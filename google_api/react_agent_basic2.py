from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import initialize_agent,AgentType,tool
from langchain_community.tools import TavilySearchResults
import datetime

load_dotenv()

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

search_tool = TavilySearchResults(search_depth="basic")

@tool
def get_system_time(format:str = "%Y-%m-%d %H:%M:%S"):
    """ Returns the current date and time in the specific format"""

    current_time = datetime.datetime.now()
    formatted_time = current_time.strftime(format)
    return formatted_time


agent_tools = [search_tool,get_system_time]

agent = initialize_agent(tools=agent_tools,llm=llm,agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,verbose = True)

# result = llm.invoke("give me a fact about cats")
# result = llm.invoke("hyderabad come in which state")
# print(result)


agent.invoke("when was SpaceX's last launch and  how many days ago was that from this instant")