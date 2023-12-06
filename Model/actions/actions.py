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

class ValidateRestaurantForm(FormValidationAction):
    def __init__(self) -> None:
        super().__init__()
        self.bpemb_model = BPEmb(dim = 300,emb_file = r"Loaded Models\arz.wiki.bpe.vs100000.d300.w2v.bin",\
                           model_file = r"Loaded Models\arz.wiki.bpe.vs100000.model")
    
    def name(self) -> Text:
        return "validate_food_form"

    @staticmethod
    def get_menu_db() -> List[Text]:
        """Database of supported foods"""

        return ["مكرونة بشاميل","فتة شاورما","شاورما فراخ","فراخ مشوية","سمك مشوي","فول","فلافل","فراخ محمرة","لحمة مشوية","سلطة فواكه"]
    

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
        
        for token in tokens:
            u1 = self.get_embeddings([token])
            for word in words:
                u2 = self.get_embeddings(np.array([word]))
                r1  = -1*tf.keras.losses.cosine_similarity(u2,u1).numpy()[0]
                r2 = SequenceMatcher(None, word, token).ratio()
                r = 0.8*r1+0.2*r2
                #print(f"{word},{token}"+"with certainaty = "+str(r))
                if (r >= 0.40 or re.search(f"{token}",word) is not None):
                    if word not in foods:
                        foods[word] = r
                    if foods[word] < r:
                         foods[word] = r 
        food      =  list(foods.keys())
        confedence =  list(foods.values())  
          
        return np.array(food), np.array(confedence)

    def validate_food(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate food value."""
        entities = tracker.latest_message['entities']
        foods = [ent['value'] for ent in entities if ent['entity'] == 'food']
        best_match,confedence = self.get_best_match(foods, self.get_menu_db())
        if len(best_match) == 0:
            dispatcher.utter_message(text="اسف و الله يا صاحبي معندناش نوع الاكل ده")
            return {"food": None}
        elif len(best_match[confedence >= 0.98]) != 0:
            slot_value = best_match[confedence >= 0.98][0]
            return {"food": slot_value}
        else: 
            dispatcher.utter_message(text="  نوع الاكل الي انت طالبه بالضبط مش موجود عندما بس عندنا انواع منه او حاجات زيه ودي الحاجات الي ممكن حضرتك تختار منها زي \n"+" , \n".join(best_match))
            return {"food": None}
        
    def validate_phone_number(self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate phone number."""
        entities = tracker.latest_message['entities']
        phone_numbers = [ent['value'] for ent in entities if ent['entity'] == 'phone_number']
        #print(len(phone_numbers))
        if len(phone_numbers) == 0:
            dispatcher.utter_message(response="utter_ask_phone_number")
            return {"phone_number": None}
        elif len(phone_numbers) == 1:
            slot_value = phone_numbers[0]
            return {"phone_number": slot_value}
        else:
            dispatcher.utter_message(text = f"بص انت باعت {len(phone_numbers)} ارقام تليفون اكدلي علي واحد استخدمه بس")
            return {"phone_number": None}
        

    def validate_food_size(self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate food size."""

        entities = tracker.latest_message['entities']
        food_sizes = [ent['value'] for ent in entities if ent['entity'] == 'food_size']
    
        if len(food_sizes) == 0:
            dispatcher.utter_message(response="utter_ask_food_size")
            return {"food_size": None}
        elif len(food_sizes) == 1:
            slot_value = food_sizes[0]
            return {"food_size": slot_value}
        else:
            dispatcher.utter_message(text = f"بص انت باعت {len(food_sizes)} احجام مختلفة اكدلي علي واحد استخدمه بس")
            return {"food_size": None}