import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEndpoint
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# Load environment variables
load_dotenv()
huggingface_api_key = os.getenv("HUGGING_FACE_API_KEY")

# Configure the HuggingFace endpoint
repo_id1 = "meta-llama/Llama-2-7b-chat-hf"
repo_id2 = "deepseek-ai/DeepSeek-R1"


# LLM'S
metaLLm = HuggingFaceEndpoint(
    repo_id=repo_id1,
    huggingfacehub_api_token=huggingface_api_key,
    task="text-generation"
)

deepseekLLM = HuggingFaceEndpoint(
    repo_id=repo_id2,
    huggingfacehub_api_token=huggingface_api_key,
    task="text-generation"
)


promp_template_capital = PromptTemplate(
    input_variables=["country"],
    template="""Question : can you tell me capital of {country}?. 
    Answer: think and give the answer  in this form.""",
)

# Example usage
def generate_text(prompt,llm):
    try:
        response = llm.invoke(prompt)
        return response
    except Exception as e:
        print(f"Error generating text: {str(e)}")
        return None
    
def generate_chain(prompt,llm):
    try:
        llm_chain = LLMChain(llm =llm,prompt = prompt)
        response = llm_chain.invoke()
        return response
    except Exception as e:
        print(f"Error generating chain: {str(e)}")
        return None

# Test the model
if __name__ == "__main__":
   
    prompt1 = promp_template_capital.format(country = "india")
    result = generate_text(prompt1,deepseekLLM)
    #result = generate_chain(prompt1,deepseekLLM)
    print(result)