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
from difflib import SequenceMatcher
from bpemb import BPEmb                                          
import tensorflow as tf
from rasa.shared.core.events import SlotSet
from rasa_sdk.interfaces import Action

class ValidateRestaurantForm(FormValidationAction):
    def __init__(self) -> None:
        super().__init__()
        self.bpemb_model = BPEmb(dim = 300,emb_file = r"Loaded Models\arz.wiki.bpe.vs100000.d300.w2v.bin",\
                           model_file = r"Loaded Models\arz.wiki.bpe.vs100000.model")
        self.container       = dict()
        self.container_sizes = dict()
        self.container_signal= dict()
    
    def name(self) -> Text:
        return "validate_food_form"

    
    def get_menu_db(self) -> List[Text]:
        """Database of supported foods"""
        #["مكرونة بشاميل","فتة شاورما","شاورما فراخ","فراخ مشوية","سمك مشوي","فول","فلافل","فراخ محمرة","لحمة مشوية","سلطة فواكه"]
        foods  = list(self.get_extra().keys())
        extras = sum(list(self.get_extra().values()),[])
        return foods + extras
    def get_metadata(self, tracker, code = "420"):
        restaurant_id = tracker.latest_message['metadata']["restaurant_id"]
        customer_id =  tracker.latest_message['metadata']["customer_id"]
        socket_id =  tracker.latest_message['metadata']["socket_id"]
        return {"socket_id":socket_id,"restaurant_id":restaurant_id,"customer_id":customer_id,"code":code}

    def get_food_sizes(self):
        return {"فراخ محمرة":["وسط", "كبير"],"مكرونة بشاميل":[],"شاورما":["كبير"]}
    def get_extra(self):
        """Database of supported foods with extra"""
        return {"فراخ محمرة": ["رز مقمر","بصل"], "مكرونة بشاميل": ["مخلل","طحينة"],"شاورما":["تومية"]}
    def word2vec(self, word):
        embeds = self.bpemb_model.embed(word)
        if len(embeds) > 1:
            embeds = np.sum(embeds, axis = 0).reshape([1,embeds.shape[1]])
        
        return embeds.tolist()[0]
    

    def get_embeddings(self, X):
        """
        Converts a sentence into a matrix of input embeddings of dim n x d
        d is embeddings length 
        n is the list of words length
        input :
        X (list) -------------> list of words
        dic (dictionary)------> dictionary of embeddings
        output :
        tokens (Tensor)-------> tensor of size [n , d]

        """
        tokens = []
        for word in X:
             tokens.append(self.word2vec(word))      
        tokens =  np.array(tokens, dtype = np.float32)
        return tokens  



    def check_mappings(self, food, extra, mappings, tracker, dispatcher):
        if extra not in self.get_extra()[food] and extra != "":
            dispatcher.utter_message(text=f"{extra} مش بيتقدم مع {food} ك اكسترا ",\
                                     json_message=self.get_metadata(tracker= tracker))
            mappings[food] = []
            return mappings
        if food not in mappings:           
            mappings[food] = [extra]
        else:
            mappings[food].append(extra)
        return mappings


    def map_food_to_extra(self, slots, dispatcher,tracker):
        slots         = list(slots)
        #print("slots values",slots)
        food_indexies = []
        extras        = sum(list(self.get_extra().values()),[])
        mappings  = dict()
        for i in range(len(slots)):
            if slots[i] not in extras:
                food_indexies.append(i)
        food_indexies.append(len(slots))
        orders = list(self.container[tracker.sender_id].keys()) if tracker.sender_id in self.container else []
        if (len(food_indexies) == 1) and (len(orders) == 0 ):
            dispatcher.utter_message(text="وضح عاوز اكل ايه مع الاكسترا بالضبط؟",\
                                     json_message=self.get_metadata(tracker= tracker))
            return mappings
        #elif len(food_indexies) == 2:
        #    food  = slots[food_indexies[0]] 
        #    slots.pop(food_indexies[0])
        #    for slot in slots:
        #        mappings = self.check_mappings(food, slot, mappings, dispatcher)
        #    return mappings
        else:
            if (len(food_indexies) == 1) and (len(orders) != 0 ):
                # last food he has ordered
                slots.insert(0,orders[-1])
                food_indexies.insert(0,0)
                print(food_indexies,slots)
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



    def get_best_match(self, tokens, words):
        """
        get the best matched food from the database file 
        inputs:
        tokens(list)------>list of tokens
        words(list)------->list of database words 'foods avaliable at restaurant'
        output:
        None
        """
        foods = {}
        extras = sum(list(self.get_extra().values()),[])
        sep = 1
        
        for token in tokens:
            u1 = self.get_embeddings([token])
            for word in words:
                u2 = self.get_embeddings(np.array([word]))
                r1  = -1*tf.keras.losses.cosine_similarity(u2,u1).numpy()[0]
                r2 = SequenceMatcher(None, word, token).ratio()
                r = 0*r1+1*r2
                #print(f"{word},{token}"+"with certainaty = "+str(r))
                if (r >= 0.65 or re.search(f"{token}",word) is not None):
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
        tracker: Tracker,foods:list)-> str:
        best_match,confedence = self.get_best_match(foods, self.get_menu_db())
        if len(best_match) == 0:
            dispatcher.utter_message(text="اسف و الله يا صاحبي معندناش نوع الاكل ده",\
                                     json_message=self.get_metadata(tracker= tracker))
            return None
        elif len(best_match[confedence >= 0.65]) != 0:
            slot_value = best_match[confedence >= 0.65]
            #foods = tracker.get_slot("food")
            #print("foods length ",len(foods))
            slot_value = self.map_food_to_extra(slot_value, dispatcher,tracker)
            dispatcher.utter_message(response="utter_finalise_order",\
                                     json_message=self.get_metadata(tracker= tracker))
            
            return slot_value
        else: 
            dispatcher.utter_message(text="  نوع الاكل الي انت طالبه بالضبط مش موجود عندما بس عندنا انواع منه او حاجات زيه ودي الحاجات الي ممكن حضرتك تختار منها زي \n"+" , \n".join(best_match),\
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
        entities = tracker.latest_message['entities']
        foods = [ent['value'] for ent in entities if ent['entity'] == 'food']
        result = self.get_food_slots(dispatcher, tracker, foods)
        result = result if result is not None else dict()
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
            return {"food": str(self.container[tracker.sender_id])}
        
        
        
    
    def validate_phone_number(self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate phone number."""
        entities = tracker.latest_message['entities']
        phone_numbers = [ent['value'] for ent in entities if ent['entity'] == 'phone_number']
        print("hello from validate phone number")
        #flag = tracker.get_slot("food_size")
        #print(len(phone_numbers))
        if len(phone_numbers) == 0:
            #dispatcher.utter_message(response="utter_ask_phone_number")
            return {"phone_number": None}
        elif len(phone_numbers) == 1:
            slot_value = phone_numbers[0]
            mapping = None
            #mapping = None
            print("food size phone number")
            self.print_order(tracker,dispatcher)
            self.container_sizes[tracker.sender_id] = dict()
            mapping = self.ask_food_size(dispatcher, tracker)
            return {"phone_number": slot_value,"food_size":mapping}
        else:
            dispatcher.utter_message(text = f"بص انت باعت {len(phone_numbers)} ارقام تليفون اكدلي علي واحد استخدمه بس",\
                                     json_message=self.get_metadata(tracker= tracker))
            return {"phone_number": None}
        

    
    def food_sizes_mapping(self, dispatcher, tracker, slot):
        food = self.container_sizes[tracker.sender_id].get("_next_")
        if food is None:
            return None
        if len(slot) != 1:
            dispatcher.utter_message(text = f"بص انت باعت {len(slot)} احجام مختلفة اكدلي علي واحد استخدمه بس",\
                                     json_message=self.get_metadata(tracker= tracker))
            return None
        
        food_size  = slot[0]
        food_sizes = self.get_food_sizes().get(food)
        if food_size not in food_sizes:
            dispatcher.utter_message(text =f"{food}  الحجم الي انت باعته مش موجود ل",\
                                     json_message=self.get_metadata(tracker= tracker))
        else:
            self.container_sizes[tracker.sender_id][food] = food_size
            self.container_sizes[tracker.sender_id].pop("_next_")

 
    def ask_food_size(self, dispatcher, tracker):
        foods = list(self.container[tracker.sender_id].keys())
        food_sizes = self.get_food_sizes()
        #print("foods inside ask_food_size",foods)
        for food in foods:
            if (food_sizes[food] != [] and len(food_sizes[food])>1 ) and (food not in self.container_sizes[tracker.sender_id]):
                food_size = food_sizes[food]
                food_size = " و ".join(food_size)
                #print("metadata : ",tracker.latest_message['metadata']["restaurant_id"])
                dispatcher.utter_message(text=f"{food}  تحب انهي حجم ل {food_size} دي الاحجام المتوفرة ",\
                                         json_message=self.get_metadata(tracker= tracker))
                self.container_sizes[tracker.sender_id]["_next_"] = food
                return None

        mapping = str(self.container_sizes[tracker.sender_id])
        return mapping
            
        



    def validate_food_size(self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate food size."""
        print("hello from food size validation")
        mapping = None
        entities = tracker.latest_message['entities']
        food_sizes = [ent['value'] for ent in entities if ent['entity'] == 'food_size']
        flag1 = tracker.get_slot("phone_number")
        flag2 = tracker.get_slot("food_size")
        
        if flag1 is None:
            #mapping = None
            if flag2 is not None:
                dispatcher.utter_message(text = f"متشغلش بالك باحجام الاكل دلوقتي  نكتب الاوردر بس الاول بعدين نشوف الحوار ده",\
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
        foods = tracker.get_slot("food")
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
        entities = tracker.latest_message['entities']
        flag     = tracker.get_slot("food_size")
        signal   = [ent['value'] for ent in entities if ent['entity'] == 'send_signal'][0]
        if flag is None:
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
                return {"signal": None,"food_size":None, "phone_number":None}
            elif signal == "1":
                self.container_sizes.pop(tracker.sender_id)
                self.container.pop(tracker.sender_id)
                self.container_signal.pop(tracker.sender_id)
                return {"signal": "1"}
            else:
                return{"signal":None}


        



















        
  
       
    




class FoodSlots(Action):
    def name(self):
        return 'foodslots'

    def run(self, dispatcher, tracker, domain):
        # Generate your custom message using retrieved information
        foods = tracker.get_slot("food")
        foods = eval(foods)
        sizes = tracker.get_slot("food_size")
        sizes = eval(sizes)
        #food_q = dict()
        message = " طلبك كالتالي : \n"
        for food,extras in foods.items():
            food_size = " حجم "+str(sizes[food]) if food in sizes else ""  
            extra     = " و ".join(list(set(extras)))
            extra     = f"مع {extra}" if extra != "" else ""
            message  += f" {food} {food_size} {extra} "
            message  += "\n"
        #for food in foods:
        #    if food in food_q:
        #        food_q[food] += 1
        #    else:
        #        food_q[food]  = 1
            
        
        #print("foods length ",len(foods))
        #for food in food_q.keys():
        #    message += f"عدد {food_q[food]} قطعة {food} ," 
        #message += " happy eating!"
        # Return an Utterance event with the generated message
        #print("hello from food slots")
        restaurant_id = tracker.latest_message['metadata']["restaurant_id"]
        customer_id   =  tracker.latest_message['metadata']["customer_id"]
        socket_id     = tracker.latest_message['metadata']["socket_id"]
        metadata      =  {"socket_id":socket_id,\
                          "restaurant_id":restaurant_id,\
                          "customer_id":customer_id,\
                          "code":"422",\
                          "food_extra":foods,\
                          "food_size":sizes,\
                          "phone_number":tracker.get_slot("phone_number")}
        dispatcher.utter_message(text=message,json_message=metadata)
        return []
    




    


