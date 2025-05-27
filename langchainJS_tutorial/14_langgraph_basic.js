import { Graph } from "@langchain/langgraph";

// Create a new graph
const workflow = new Graph();

// Add nodes (simple functions)
workflow.addNode("greet", (state) => {
  console.log("state:", state);
  return { ...state, message: `Hello, ${state.name}!` };
});

workflow.addNode("farewell", (state) => {
  console.log("state:", state);
  return { message: `Goodbye, ${state.name}!` };
});

// Set entry point
workflow.setEntryPoint("greet");

// Add edges (define flow)
workflow.addEdge("greet", "farewell");
workflow.setFinishPoint("farewell");

// Compile the workflow
const app = workflow.compile();

async function runWorkflow() {
  const result = await app.invoke({ name: "Alice" });
  console.log(result);
}

runWorkflow();
