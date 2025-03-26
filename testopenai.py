import os
from dotenv import load_dotenv, dotenv_values
from openai import OpenAI


load_dotenv()

openai_client = OpenAI(
  api_key= os.getenv("OPENAI_API_KEY")
)

# completion = client.chat.completions.create(
#   model="gpt-4o-mini",
#   store=True,
#   messages=[
#     {"role": "user", "content": "hello"}
#   ]
# )

# print(completion.choices[0].message)


