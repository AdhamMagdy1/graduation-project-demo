# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []
from typing import Text, List, Any, Dict
from rasa_sdk import Tracker, FormValidationAction
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.types import DomainDict
import re
import numpy as np
import pandas as pd
from difflib import SequenceMatcher
from bpemb import BPEmb                                          
import tensorflow as tf
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
#from rasa.shared.core.events import SlotSet
from rasa_sdk.events import SlotSet,AllSlotsReset
from rasa_sdk import Action
from rasa_sdk.interfaces import Action
from sqlalchemy import create_engine, MetaData, Table, text, select
from sqlalchemy.engine import URL


class ValidateRestaurantForm(FormValidationAction):
    def __init__(self) -> None:
        super().__init__()
        self.container       = dict()
        self.container_sizes = dict()
        self.container_signal= dict()
        self.container_flags = dict()
        self.engine,self.Product,self.Extra =  self.create_engine()
    def name(self) -> Text:
        return "validate_food_form"
    
    def create_engine(self):
        url_object = URL.create(     
        "postgresql+psycopg2",
        username="adham",
        password="clSoMULYj7Y7AJbLy6FU0JSvlHOTqbOA", 
        host="dpg-coe15col6cac73bs5eag-a.oregon-postgres.render.com",
        database="gradproject")
        engine = create_engine(url_object)
        metadata = MetaData()
        Product = Table('Product', metadata, autoload=True ,autoload_with=engine)
        Extra = Table('Extra', metadata, autoload=True ,autoload_with=engine)
        print("Database connetion has been established")
        return engine,Product,Extra
    def get_menu_db(self, tracker) -> List[Text]:
        """Database of supported foods"""
        #["مكرونة بشاميل","فتة شاورما","شاورما فراخ","فراخ مشوية","سمك مشوي","فول","فلافل","فراخ محمرة","لحمة مشوية","سلطة فواكه"]
        foods  = self.get_food_sizes(tracker)
        extras = self.get_extra(tracker)
        return foods, extras
    def get_metadata(self, tracker, code = "420"):
        restaurant_id =  tracker.latest_message['metadata']["restaurant_id"]
        customer_id   =  tracker.latest_message['metadata']["customer_id"]
        socket_id     =  tracker.latest_message['metadata']["socket_id"]
        address_id    =  tracker.latest_message['metadata']["address_id"]
        return {"socket_id":socket_id,"restaurant_id":restaurant_id,"customer_id":customer_id,"address_id":address_id,"code":code}
    def create_signal(self, id):
        if id not in self.container_flags:
            self.container_flags[id] = [False,False,False]
            print("hello from signal ")
    def get_food_sizes(self, tracker):
        restaurant_id = self.get_metadata(tracker)["restaurant_id"]
        size_mapping = {'small': 'صغير', 'medium': 'متوسط', 'large': 'كبير'}
        query = self.Product.select()\
                    .where(self.Product.c.restaurantId == restaurant_id)
        # Execute  query
        with self.engine.connect() as connection:
            result = connection.execute(query)
            products = {}
            for row in result:
                product_name = row['name']
                size         = {size_mapping.get(size):price for size,price in row['size'].items()}
                products[product_name] = size
        #{"فراخ محمرة":{"وسط":30,"كبير":50},"مكرونة بشاميل":{"صغير":15},"ساندوتش شاورما لحمة":{"كبير":65}}
        return products
#return {"فراخ محمرة":["وسط", "كبير"],"مكرونة بشاميل":["عادي"],"ساندوتش شاورما لحمة":["كبير"], "ساندوتش شاورما فراخ":["كبير"]}
    def get_extra(self, tracker):
        """Database of supported foods with extra"""
        restaurant_id = self.get_metadata(tracker)["restaurant_id"]
        query = select([self.Extra.c.name.label('name'),\
                        self.Extra.c.price.label('price')])\
                        .where(self.Extra.c.restaurantId == restaurant_id)
        # Execute the query
        with self.engine.connect() as connection:
            result = connection.execute(query)
            extras = {}
            for row in result:
                extras[row[0]] = float(row[1])
        #{"رز معمر":10,"بصل":20,"مخلل":15,"طحينة":30,"تومية":30}
        return extras
#return ["رز معمر","بصل","مخلل","طحينة","تومية"]
       
    



    def check_mappings(self, food, extra, mappings, tracker, dispatcher):
        #if extra not in self.get_extra()[food] and extra != "":
        #    dispatcher.utter_message(text=f"{extra} مش بيتقدم مع {food} ك اكسترا ",\
        #                             json_message=self.get_metadata(tracker= tracker))
        #    mappings[food] = []
        #    return mappings
        if extra == "":
            mappings[food] = []
            return mappings
        if food not in mappings:           
            mappings[food] = [extra]
        else:
            mappings[food].append(extra)
        return mappings


    def map_food_to_extra(self, slots, extras, dispatcher, tracker):
        slots         = list(slots)
        print("slots values",slots)
        food_indexies = []
        #extras        = list(self.get_extra(tracker).keys())
        mappings      = dict()
        for i in range(len(slots)):
            if slots[i] not in extras:
                food_indexies.append(i)
        food_indexies.append(len(slots))
        orders = list(self.container[tracker.sender_id].keys()) if tracker.sender_id in self.container else []
        if (len(food_indexies) == 1) and (len(orders) == 0 ):
            dispatcher.utter_message(response = "utter_order_unclear",\
                                     json_message=self.get_metadata(tracker= tracker))
            return mappings
        else:
            if (len(food_indexies) == 1) and (len(orders) != 0 ):
                # last food he has ordered
                food_indexies = []
                food_indexies.append(0)
                slots.insert(0,orders[-1])
                food_indexies.append(len(slots))
                #print(food_indexies,slots)
            while(len(food_indexies) != 1):
                i      = food_indexies[0]
                j      = food_indexies[1]
                extras = slots[i+1:j] if (i != j) else [""]
                extras = extras if extras != [] else [""]
                extras = list(set(extras))
                food   = slots[i]
                print("attention please : ",food,extras)
                for extra in extras:
                    mappings = self.check_mappings(food, extra, mappings, tracker, dispatcher)
                food_indexies.pop(0)
            return mappings



    def get_best_match(self, tokens, words, extras):
        """
        get the best matched food from the database file 
        inputs:
        tokens(list)------>list of tokens
        words(list)------->list of database words 'foods avaliable at restaurant'
        output:
        None
        """
        foods  = {}
        sep    = 1
        for token in tokens:
            for word in words:
                r2 = SequenceMatcher(None, word, token).ratio()
                r  = r2
                #print(f"{word},{token}"+"with certainaty = "+str(r))
                if (r >= 0.6 or re.search(f"{token}",word) is not None):
                    if word not in foods:
                        foods[word] = r
                    elif (word in foods) and (word in extras):
                        foods[word+"_"*sep] = r
                        sep +=1
                    if foods[word] < r:
                         foods[word] = r 
        food       =  list(foods.keys())
        food       = [re.sub("_+","",f) for f in food]
        confedence =  list(foods.values())  
          
        return np.array(food), np.array(confedence)
    
    def get_food_slots(self, dispatcher: CollectingDispatcher,
        tracker: Tracker,foods:list, menu:list, extras:list)-> str:
        extras = list(extras.keys())
        menu   = list(menu.keys())
        best_match,confedence = self.get_best_match(foods, menu+extras, extras)
        if len(best_match) == 0:
            dispatcher.utter_message(response="utter_food_nonexistence",\
                                     json_message=self.get_metadata(tracker= tracker))
            return None
        elif len(best_match[confedence >= 0.85]) != 0:
            slot_value = best_match[confedence >= 0.85]
            #foods = tracker.get_slot("food")
            #print("foods length ",len(foods))
            slot_value = self.map_food_to_extra(slot_value, extras,dispatcher,tracker)
            dispatcher.utter_message(response="utter_finalise_order",\
                                     json_message=self.get_metadata(tracker= tracker))
            
            return slot_value
        else:
            dispatcher.utter_message(response = "utter_best_match", matches = "\n, ".join(best_match),\
                                     json_message=self.get_metadata(tracker= tracker))
            return None

    
    
    def validate_food(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate food value."""
        print("hello from food validation")
        self.create_signal(tracker.sender_id)
        entities = tracker.latest_message['entities']
        foods    = [ent['value'] for ent in entities if ent['entity'] == 'food']
        menu, extra = self.get_menu_db(tracker)
        result      = self.get_food_slots(dispatcher, tracker, foods, menu, extra)
        result   = result if result is not None else dict()
        print("result :",result)
        if tracker.sender_id in self.container:
            #print(self.container[tracker.sender_id])
            for food in result.keys():
                if food in self.container[tracker.sender_id]:
                    self.container[tracker.sender_id][food].extend(result[food])
                else:
                    self.container[tracker.sender_id][food] = result[food]           
        else:
            self.container[tracker.sender_id] = result
        
        if len(self.container[tracker.sender_id]) == 0:
            return {"food":None}
        else:
            # you have just send the keys of the dictionary
            self.container_flags[tracker.sender_id][0] = True
            prices = ",,,"+str(extra)+",,,"+str(menu)
            return {"food": str(self.container[tracker.sender_id])+prices}
        
    def phone_number_handler(self, phone_numbers, dispatcher, tracker):
        if not phone_numbers:
            return None
        elif len(phone_numbers) == 1:
            phone_number = phone_numbers[0]
            if len(phone_numbers[0]) != 11:
                dispatcher.utter_message(response="utter_phone_number_length",\
                                     json_message=self.get_metadata(tracker= tracker))
                phone_number = None
            return phone_number
        else:
            dispatcher.utter_message(response = "utter_phonenumber_validation", phone = len(phone_numbers),\
                                     json_message=self.get_metadata(tracker= tracker))
            return None


        
    
    def validate_phone_number(self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate phone number."""
        self.create_signal(tracker.sender_id)
        entities = tracker.latest_message['entities']
        phone_numbers = [ent['value'] for ent in entities if ent['entity'] == 'phone_number']
        print("hello from validate phone number")
        if not phone_numbers:
            return {"phone_number":None}
        elif len(phone_numbers) == 1 and len(phone_numbers[0]) != 11:
            dispatcher.utter_message(response="utter_phone_number_length",\
                                     length = len(phone_numbers[0]),\
                                     json_message=self.get_metadata(tracker= tracker))
            return {"phone_number": None}
        elif len(phone_numbers) == 1 and len(phone_numbers[0]) == 11:
            mapping = None
            #mapping = None
            print("food size phone number")
            self.print_order(tracker,dispatcher)
            self.container_sizes[tracker.sender_id] = dict()
            mapping = self.ask_food_size(dispatcher, tracker)
            self.container_flags[tracker.sender_id][1] = True
            return {"phone_number": slot_value,"food_size":mapping}
        else:
            dispatcher.utter_message(response = "utter_phonenumber_validation", phone = len(phone_numbers),\
                                     json_message=self.get_metadata(tracker= tracker))
            return None
        
    def food_sizes_mapping(self, dispatcher, tracker, slot):
        food = self.container_sizes[tracker.sender_id].get("_next_")
        if food is None:
            return None
        if len(slot) != 1:
            dispatcher.utter_message(response = "utter_size_validation", size = len(slot),\
                                     json_message=self.get_metadata(tracker= tracker))
            return None
        
        food_size  = slot[0]
        food_sizes = list(self.get_food_sizes(tracker).get(food).keys())
        if food_size not in food_sizes:
            dispatcher.utter_message(response = "utter_size_nonexistence", food = food,\
                                     json_message=self.get_metadata(tracker= tracker))

        else:
            self.container_sizes[tracker.sender_id][food] = food_size
            self.container_sizes[tracker.sender_id].pop("_next_")

 
    def ask_food_size(self, dispatcher, tracker):
        foods = list(self.container[tracker.sender_id].keys())
        food_sizes = self.get_food_sizes(tracker)
        #print("foods inside ask_food_size",foods)
        for food in foods:
            if food not in self.container_sizes[tracker.sender_id]:
                food_size = list(food_sizes[food].keys())
                food_size = " و ".join(food_size)
                #print("metadata : ",tracker.latest_message['metadata']["restaurant_id"])
                dispatcher.utter_message(response="utter_choose_size", food = food, size = food_size,\
                                         json_message=self.get_metadata(tracker= tracker))
                self.container_sizes[tracker.sender_id]["_next_"] = food
                return None
        
        mapping = str(self.container_sizes[tracker.sender_id])
        print("falg finally set to true")
        self.container_flags[tracker.sender_id][2] = True
        return mapping
            
        



    def validate_food_size(self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate food size."""
        self.create_signal(tracker.sender_id)
        print("hello from food size validation")
        mapping = None
        entities = tracker.latest_message['entities']
        food_sizes = [ent['value'] for ent in entities if ent['entity'] == 'food_size']
        flag1 = tracker.get_slot("phone_number")
        flag2 = tracker.get_slot("food_size")
        print("flag2 : ",self.container_flags[tracker.sender_id])
        if self.container_flags[tracker.sender_id][2]:
            return {"food_size":str(self.container_flags[tracker.sender_id])}
        if flag1 is None:
            #mapping = None
            if flag2 is not None:
                dispatcher.utter_message(response = "utter_validate_size",\
                                         json_message=self.get_metadata(tracker= tracker))
        else:
            #print(flag1,flag2,self.container_sizes[tracker.sender_id].get("_next_"))
            if food_sizes != [] :
                self.food_sizes_mapping(dispatcher, tracker, food_sizes)
            if mapping == None:
                mapping = self.ask_food_size(dispatcher, tracker)
        if mapping is not None:
            dispatcher.utter_message(response="utter_signal",\
                                     json_message=self.get_metadata(tracker=tracker))
        return {"food_size": mapping}
    
    def print_order(self, tracker, dispatcher):
        foods = tracker.get_slot("food").split(",,,")[0]
        foods = eval(str(foods))
        #food_q = dict()
        message = " طلبك كالتالي : \n"
        for food,extras in foods.items(): 
            extra     = " و ".join(list(set(extras)))
            extra     = f"مع {extra}" if extra != "" else ""
            message  += f" {food}  {extra} "
            message  += "\n"
        dispatcher.utter_message(text=message,\
                                json_message=self.get_metadata(tracker=tracker))
    def validate_signal(self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """confirm the order"""
        self.create_signal(tracker.sender_id)
        entities = tracker.latest_message['entities']
        signal   = [ent['value'] for ent in entities if ent['entity'] == 'send_signal'][0]
        if self.container_flags[tracker.sender_id][2] == False:
            return {"signal":None}
        else:
            print("here i am",signal)
            if tracker.sender_id in  self.container_signal:
                self.container_signal[tracker.sender_id] += 1
            else:
                self.container_signal[tracker.sender_id] = 1
            if self.container_signal[tracker.sender_id] > 1 and signal == "0":
                dispatcher.utter_message(text= "طب اطلب الي انت عاوز تضيفه مع الاخذ في الاعتبار ان كل البيانات الخاصة بالاكل تم حذفها",\
                                     json_message=self.get_metadata(tracker=tracker))
                self.container_sizes.pop(tracker.sender_id)
                self.container.pop(tracker.sender_id)
                self.container_signal.pop(tracker.sender_id)
                self.container_flags.pop(tracker.sender_id)
                return {"signal": None,"food_size":None, "phone_number":None}
            elif signal == "1":
                self.container_sizes.pop(tracker.sender_id)
                self.container.pop(tracker.sender_id)
                self.container_signal.pop(tracker.sender_id)
                self.container_flags.pop(tracker.sender_id)
                return {"signal": "1"}
            else:
                return{"signal":None}


        









class Metadata:
    def __init__(self):
        pass
    @staticmethod
    def get_metadata(tracker, code = "420"):
        try:
            restaurant_id =  tracker.latest_message['metadata']["restaurant_id"]
            customer_id   =  tracker.latest_message['metadata']["customer_id"]
            socket_id     =  tracker.latest_message['metadata']["socket_id"]
            address_id    =  tracker.latest_message['metadata']["address_id"]
            return {"socket_id":socket_id,"restaurant_id":restaurant_id,"customer_id":customer_id,"address_id":address_id,"code":code}
        except:
            return {}









        
  
       
    




class FoodSlots(Action):
    def name(self):
        return 'foodslots'

    def run(self, dispatcher, tracker, domain):
        # Generate your custom message using retrieved information
        foods = tracker.get_slot("food")
        foods, extras_price, foods_price = foods.split(",,,")
        foods = eval(foods)
        extras_price = eval(extras_price)
        foods_price  = eval(foods_price)
        sizes = tracker.get_slot("food_size")
        sizes = eval(sizes)
        #food_q = dict()
        message = " طلبك كالتالي : \n"
        total_price = 0
        for food,extras in foods.items():
            size         = sizes[food]
            total_price += foods_price[food][size]
            total_price += sum([extras_price[extra] for extra in extras])
            #print("price 2 :: ",total_price)
            food_size = " حجم "+str(sizes[food]) if food in sizes else ""  
            extra     = " و ".join(list(set(extras)))
            extra     = f"مع {extra}" if extra != "" else ""
            message  += f" {food} {food_size} {extra} "
            message  += "\n"
        metadata      = Metadata.get_metadata(tracker=tracker, code = "422")
        metadata.update({"food_extra":foods,\
                          "food_size":sizes,\
                          "total_price":total_price,\
                          "phone_number":tracker.get_slot("phone_number")}) 
        dispatcher.utter_message(text=message,json_message=metadata)
        return []
    



class SendFeedback(Action):
    def name(self):
        return 'send_feedback'

    def run(self, dispatcher, tracker, domain):
        message       = tracker.latest_message['text']
        metadata      =  Metadata.get_metadata(tracker=tracker, code = "440")
        metadata.update({"code":"440","feedback": message})
        dispatcher.utter_message(response="utter_feedback",json_message=metadata)
        return []
    

class Recommend(Action):
    def __init__(self) -> None:
        super().__init__()
        self.engine,self.Product =  self.create_engine()
    def name(self):
        return 'send_recommendation'
    
    def create_engine(self):
        url_object = URL.create(     
        "postgresql+psycopg2",
        username="adham",
        password="clSoMULYj7Y7AJbLy6FU0JSvlHOTqbOA", 
        host="dpg-coe15col6cac73bs5eag-a.oregon-postgres.render.com",
        database="gradproject")
        engine = create_engine(url_object)
        metadata = MetaData()
        Product = Table('Product', metadata, autoload=True ,autoload_with=engine)
        print("Database connetion has been established for recommendation")
        return engine,Product

    def get_products_description(self, restaurantId):
        # make query
        query = select([self.Product.c.name.label('name'),\
                        self.Product.c.ingredient.label('ingredient')])\
                            .where(self.Product.c.restaurantId == restaurantId)
        # Execute  query
        with self.engine.connect() as connection:
            result = connection.execute(query)
            df = {"product_name": [],"description":[]}
            for row in result:
                product_name = row['name']
                df["product_name"].append(product_name)
                ingredients = row['ingredient']
                df["description"].append(ingredients)
        return pd.DataFrame(df)

    def get_food_ingredients(self):
        """return  siltan ayob's food and description """
        df = pd.read_csv(r"E:\Eslam\Semester 8\Project\ayob_menu.csv")
        return df
    
    def get_recommendations(self,ingredients,order, num_recommend = 5):
        tfidf        = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(ingredients['description'])
        cosine_sim   = linear_kernel(tfidf_matrix, tfidf_matrix)
        indices      = pd.Series(ingredients.index, index=ingredients['product_name']).drop_duplicates()
        try:
            idx          = indices[order]
            sim_scores   = list(enumerate(cosine_sim[idx]))
            sim_scores   = sorted(sim_scores, key=lambda x: x[1], reverse=True)
            top_similar  = sim_scores[1:num_recommend+1]
            meal_indices = [i[0] for i in top_similar]
            return ingredients['product_name'].iloc[meal_indices].tolist()
        except:
            return []
    def run(self, dispatcher, tracker, domain):
        restaurantID      = tracker.latest_message['metadata']["restaurant_id"]
        foods             = tracker.get_slot("food").split(",,,")[0]
        df                = self.get_products_description(restaurantID)
        rd_food           = list(df["product_name"].sample(1))[0]
        foods             = eval(foods) if foods is not None else {rd_food:" "}
        recommendations   = self.get_recommendations(df,list(foods.keys())[0])
        recommendations   = " بقولك ايه قبل ما تقفل شوف الاكل ده ممكن حاجة تعجبك "+" أو ".join(recommendations) if len(recommendations)!=0 else "وجبة سعيدة" 
        metadata          = Metadata.get_metadata(tracker=tracker)
        dispatcher.utter_message(text=recommendations,json_message=metadata)
        return [AllSlotsReset()]


class action_greet(Action):
    def name(self):
        return 'action_greet'
    def run(self, dispatcher, tracker, domain):
        metadata      = Metadata.get_metadata(tracker=tracker)
        dispatcher.utter_message(response="utter_greet",json_message=metadata)
        return []
    
class action_goodbye(Action):
    def name(self):
        return 'action_goodbye'
    def run(self, dispatcher, tracker, domain):
        metadata      = Metadata.get_metadata(tracker=tracker)
        dispatcher.utter_message(response="utter_goodbye",json_message=metadata)
        return []


class action_mgreet(Action):
    def name(self):
        return 'action_mgreet'
    def run(self, dispatcher, tracker, domain):
        metadata      = Metadata.get_metadata(tracker=tracker)
        dispatcher.utter_message(response="utter_mgreet",json_message=metadata)
        return []


#action_english

class action_menu(Action):
    def name(self):
        return 'action_menu'
    def run(self, dispatcher, tracker, domain):
        metadata      = Metadata.get_metadata(tracker=tracker, code="444")
        dispatcher.utter_message(response="utter_menu",json_message=metadata)
        return []
    

class action_english(Action):
    def name(self):
        return 'action_english'
    def run(self, dispatcher, tracker, domain):
        metadata      = Metadata.get_metadata(tracker=tracker)
        dispatcher.utter_message(response="utter_english",json_message=metadata)
        return []



class SizeFill(Action):
    def name(self):
        return 'action_foodsizefill'

    def run(self, dispatcher, tracker, domain):
        print("hello from size fill slot")
        food_size = tracker.get_slot("food_size")
        return [SlotSet("food_size",food_size)]




    


