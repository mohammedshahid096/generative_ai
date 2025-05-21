import os
# import openai
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from langchain_openai import OpenAI

load_dotenv()

openaiClient = OpenAI()
promp_template_name = PromptTemplate(
    input_variables=["city"],
    template="I am looking for a hotel in {city}.",
)

prompt1 =  promp_template_name.format(city = "delhi")
prompt1_response =  openaiClient.invoke(prompt1)
print(prompt1_response)

