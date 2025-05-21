from langgraph.graph import Graph

def function1(input1):
    return input1 + "from first function"

def function2(input2):
    return input2 + " add this is a second function"

workflow1 = Graph()

# adding nodes
workflow1.add_node("function1",function1)
workflow1.add_node("function2",function2)

workflow1.add_edge("function1","function2")
workflow1.set_entry_point("function1")
workflow1.set_finish_point("function2")

app1 = workflow1.compile()

result =  app1.invoke("hi is shahid")
print(result)