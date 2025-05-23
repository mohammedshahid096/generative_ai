import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createToolCallingAgent, AgentExecutor } from "langchain/agents";
import { Calculator } from "@langchain/community/tools/calculator";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
// import { TavilySearch } from "@langchain/tavily";
import logger from "./logger.js";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant."],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  maxOutputTokens: 100,
  temperature: 0.7,
});

async function main() {
  //   tools
  let calculator_tool = new Calculator();
  let tavily_tool = new TavilySearchResults({ maxResults: 2 });
  const agent_tools = [calculator_tool, tavily_tool];

  const agent = createToolCallingAgent({
    llm: model,
    tools: agent_tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools: agent_tools,
    verbose: true,
  });

  //   First message
  // const response1 = await agentExecutor.invoke({
  //   input: "What is the capital of france",
  // });
  // console.log("Bot:", response1);
  // logger.info("message", response1);

  //  Second Message
  const response2 = await agentExecutor.invoke({
    input: " Calculate 15 * 23",
  });
  console.log("Bot:", response2);
  logger.info("message", response2);
}

main();
