from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import initialize_agent,AgentType
from langchain_community.tools import TavilySearchResults

load_dotenv()

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

search_tool = TavilySearchResults(search_depth="basic")

agent_tools = [search_tool]

agent = initialize_agent(tools=agent_tools,llm=llm,agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,verbose = True)

# result = llm.invoke("give me a fact about cats")
# result = llm.invoke("hyderabad come in which state")
# print(result)


agent.invoke("give me  funny tweet about today's weather in Bangalore")