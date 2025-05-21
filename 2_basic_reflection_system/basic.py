from dotenv import load_dotenv
load_dotenv()
from langchain_core.messages import BaseMessage, HumanMessage
from langgraph.graph import END,MessageGraph 
from chains import generation_chain, reflection_chain


graph = MessageGraph()

REFLECT = "reflect"
GENERATE = "generate"

def generate_node(state):
   return generation_chain.invoke({
        "messages" :state
    })

def reflect_node(state):
   response = reflection_chain.invoke({
      "messages":state
   })
   return [HumanMessage(content=response.content)]

def should_continue(state):
    if (len(state) > 2):
        return END 
    return REFLECT

def generate_graph(given_app):
   print(given_app.get_graph().draw_mermaid())
   given_app.get_graph().print_ascii()

graph.add_node(GENERATE,generate_node)
graph.add_node(REFLECT,reflect_node)
graph.set_entry_point(GENERATE)


graph.add_conditional_edges(GENERATE,should_continue)
graph.add_edge(REFLECT, GENERATE)

app = graph.compile()

generate_graph(app)

response = app.invoke(HumanMessage(content="AI Agents taking over content creation"))
print(response)
