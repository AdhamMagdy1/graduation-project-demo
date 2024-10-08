import logging
from typing import Any, Text, Dict, List, Type
from rasa.engine.recipes.default_recipe import DefaultV1Recipe
from rasa.engine.graph import ExecutionContext, GraphComponent
from rasa.engine.storage.resource import Resource
from rasa.engine.storage.storage import ModelStorage
from rasa.nlu.classifiers.classifier import IntentClassifier
from rasa.shared.nlu.training_data.training_data import TrainingData
from rasa.nlu.extractors.extractor import EntityExtractorMixin
from rasa.shared.nlu.training_data.message import Message
import re
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
class SizeEntityExtractor(EntityExtractorMixin, GraphComponent):
    
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
    
    

    def process(self, messages: List[Message]) -> List[Message]:
        for message in messages:
            self._set_entities(message)
        return messages
    
    def extract_order_size_category(self, order_text):
        # Define the regular expression pattern for order size categories:
        pattern = re.compile(r'\b(small|medium|large|single|double|trible|extra large|jumbo|combo|family|صغير|كبير|وسط|سنجل|دوبل|تربل|عادي|جامبو|كومبو|عائلي|اكسترا لارج)\b', re.IGNORECASE)

        # Search for the pattern in the order text:
        match = pattern.search(order_text)

        # Check if a match is found:
        if match:
            # Extract the matched order size category (case-insensitive):
            size = []
            order_size_category = match.group().lower()
            size.append(order_size_category)
            return size
        else:
            # Return [] if no match is found:
            return []
    def _set_entities(self, message: Message, **kwargs: Any) -> None:
        text               = message.get("text") 
        food_sizes         = self.extract_order_size_category(text)
        extracted_entities = []
        for size in food_sizes:    
            result = re.search(f"{size}", text)
            s = result.start()
            e = result.end()

            extracted_entities.append(
                    {
                        ENTITY_ATTRIBUTE_TYPE: self.entity_name,
                        ENTITY_ATTRIBUTE_START: s,
                        ENTITY_ATTRIBUTE_END: e,
                        ENTITY_ATTRIBUTE_VALUE: size,
                        "confidence": 1.0,
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




