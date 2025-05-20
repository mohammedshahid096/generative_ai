# imports
import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEndpoint
from langchain.prompts import PromptTemplate


# load environment variables from .env file
load_dotenv()
sec_key = os.getenv("HUGGING_FACE_API_KEY")
repo_id = "timm/mobilenetv3_small_100.lamb_in1k"

llm = HuggingFaceEndpoint(repo_id=repo_id,huggingfacehub_api_token=sec_key, task="text-generation")

if __name__ == "__main__":
        
        # Step 1: Define a prompt template
        template = """
        You are a helpful AI assistant named ChatBot. Your goal is to assist users with their questions or tasks.
        Always be polite, concise, and professional in your responses.

        Conversation History: {conversation_history}
        User Input: {user_input}

        ChatBot Response:
        """

        # Step 2: Create a PromptTemplate object
        prompt_template = PromptTemplate(
            input_variables=["conversation_history", "user_input"],  # Variables to fill in
            template=template
        )

        # Example usage
        conversation_history = """
        User: Hi
        ChatBot: Hello! How can I assist you today?
        """

        # User input
        user_input = "what is an Ai?"

        # Format the prompt
        formatted_prompt = prompt_template.format(conversation_history = conversation_history, user_input = user_input)
        
        response = llm.invoke(formatted_prompt)
        print(response) 