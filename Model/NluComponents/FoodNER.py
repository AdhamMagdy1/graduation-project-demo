import logging
from typing import Any, Text, Dict, List, Type
from rasa.engine.recipes.default_recipe import DefaultV1Recipe
from rasa.engine.graph import ExecutionContext, GraphComponent
from rasa.engine.storage.resource import Resource
from rasa.engine.storage.storage import ModelStorage
from rasa.nlu.classifiers.classifier import IntentClassifier
from rasa.nlu.tokenizers.tokenizer import Token, Tokenizer
from rasa.shared.nlu.training_data.training_data import TrainingData
from rasa.nlu.extractors.extractor import EntityExtractorMixin
from rasa.shared.nlu.training_data.message import Message
import pickle
from sklearn.svm import SVC
from nltk.corpus import stopwords
from nltk import everygrams
from string import punctuation                             # all punctuations as string
import re
from bpemb import BPEmb                                          
import numpy as np
#
from rasa.shared.nlu.constants import TEXT, INTENT
from rasa.shared.nlu.constants import (
    
    ENTITY_ATTRIBUTE_TYPE,
    ENTITY_ATTRIBUTE_START,
    ENTITY_ATTRIBUTE_END,
    ENTITY_ATTRIBUTE_VALUE,
    ENTITIES,
    INTENT,
)

logger = logging.getLogger(__name__)


@DefaultV1Recipe.register(
    DefaultV1Recipe.ComponentType.ENTITY_EXTRACTOR, is_trainable=False
)
class FoodEntityExtractor(EntityExtractorMixin, GraphComponent):
    
    @classmethod
    def required_components(cls) -> List[Type]:
        return [IntentClassifier]
    
    @staticmethod
    def required_packages() -> List[Text]:
        """Any extra python dependencies required for this component to run."""
        return []

    @staticmethod
    def get_default_config() -> Dict[Text, Any]:
        return {"entity_name": "THING"}

    def __init__(
        self,
        config: Dict[Text, Any],
        name: Text,
        model_storage: ModelStorage,
        resource: Resource,
    ) -> None:
        self.entity_name = config.get("entity_name")
        self.bpemb_model = BPEmb(dim = 300,emb_file = r"Loaded Models\arz.wiki.bpe.vs100000.d300.w2v.bin",\
                           model_file = r"Loaded Models\arz.wiki.bpe.vs100000.model")
        with open(r'Loaded Models\BPEmb_SVM.pkl', 'rb') as file: 
            # Call load method to deserialze 
            self.model = pickle.load(file) 
        # We need to use these later when saving the trained component.
        self._model_storage = model_storage
        self._resource = resource

    
    def train(self, training_data: TrainingData) -> Resource:
        """training the component is configured properly."""
        pass

    @classmethod
    def create(
        cls,
        config: Dict[Text, Any],
        model_storage: ModelStorage,
        resource: Resource,
        execution_context: ExecutionContext,
    ) -> GraphComponent:
        return cls(config, execution_context.node_name, model_storage, resource)
    
    def word2vec(self, word):
        """
        get the word embedding from the bpemb model and if the word is not in the dictionary
        use the model to split the word into subwords and get the embeddings of the subwords
        input :
        word (string)-------> word to be embedded
        output :
        embeds (list)-------> embeddings of the word
        """
        embeds = self.bpemb_model.embed(word)
        if len(embeds) > 1:
            embeds = np.sum(embeds, axis = 0).reshape([1,embeds.shape[1]])
        
        return embeds.tolist()[0]
    

    def process(self, messages: List[Message]) -> List[Message]:
        for message in messages:
            if message.get("intent")["name"] == "order":
                self._set_entities(message)
        return messages


    def food_Tokenizer(self, tokens):
        tokens = [' '.join(token) for token in everygrams(tokens, 1, 2)]
        return tokens
    
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
        
    def text_cleaner(self, text):
        """
        this function is used to clean the text from punctuations,numbers
          ,english words and stop words then return a list of tokens using our food tokenizer
        input :
        text (string)-------> text to be cleaned
        output :
        cleaned_tokens (list)-------> list of tokens
        """
        text = re.sub(r"(؟+|\.+|,+|،+|\d+|!+)","",text)
        text = re.sub(r"\s?[a-zA-Z]+\s?", " ", text)
        text = re.sub(r'\b(small|medium|large|single|double|trible|extra large|jumbo|combo|family|صغير|كبير|وسط|سنجل|دوبل|تربل|جامبو|كومبو|عائلي|اكسترا لارج)\b',"",text)
        text = re.sub(r"\s+"," ",text)
        tokens = text.split(" ")
        cleaned_tokens = []
        stop_words = stopwords.words("arabic")
        for token in tokens:
            token = token.strip()
            if token in stop_words or token in punctuation: #or token in cleaned_tokens:
                continue
            else:
                cleaned_tokens.append(token)
        cleaned_tokens = self.food_Tokenizer(cleaned_tokens)
        #print("cleaned tokens : ",cleaned_tokens)
        return cleaned_tokens   
    
    def _set_entities(self, message: Message, **kwargs: Any) -> None:
        text               = message.get("text") 
        cleaned_tokens     = self.text_cleaner(text)
        X                  = self.get_embeddings(np.array(cleaned_tokens))
        extracted_entities = []
        if len(X) != 0:
            predictions        = self.model.predict(X)
            tokens             = np.array(cleaned_tokens)[predictions == 1]
            #print(tokens)
            for token in tokens:
                if len(token.split()) > 1:
                    token1 = token.split()[0]
                    token2 = token.split()[1]
                    result = re.search(f"{token1}.+{token2}", text)
                    s = result.start()+ 500
                    e = result.end()+ 500
                else:
                    result = re.search(f"{token}", text)
                    s = result.start()
                    e = result.end()
                extracted_entities.append(
                        {
                            ENTITY_ATTRIBUTE_TYPE: self.entity_name,
                            ENTITY_ATTRIBUTE_START: s,
                            ENTITY_ATTRIBUTE_END: e,
                            ENTITY_ATTRIBUTE_VALUE: token,
                            "confidence": 0.9,
                        }
                    )
            
        message.set(
            ENTITIES, message.get(ENTITIES, []) + extracted_entities, add_to_output=True
        )

    def process_training_data(self, training_data: TrainingData) -> TrainingData:
        self.process(training_data.training_examples)
        return training_data

    @classmethod
    def validate_config(cls, config: Dict[Text, Any]) -> None:
        """Validates that the component is configured properly."""
        pass




