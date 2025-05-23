import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMessageHistory } from "langchain/memory";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import fs from "fs";
import path from "path";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createToolCallingAgent, AgentExecutor } from "langchain/agents";
import { Calculator } from "@langchain/community/tools/calculator";
// import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { TavilySearch } from "@langchain/tavily";

const SESSION_ID = "abc12345";
const MEMORY_FILE = path.join("memory", `session-${SESSION_ID}.json`);

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant."],
  ["placeholder", "{history}"],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  maxOutputTokens: 100,
  temperature: 0.7,
});

async function getMemoryFunction() {
  try {
    const isFileExist = await fs.existsSync(MEMORY_FILE);
    if (isFileExist) {
      const data = await fs.readFileSync(MEMORY_FILE, "utf-8");
      const messages = JSON.parse(data);
      return new ChatMessageHistory(messages);
    } else {
      return new ChatMessageHistory();
    }
  } catch (error) {
    return new ChatMessageHistory();
  }
}

async function saveMemoryFunction(history) {
  try {
    await fs.writeFileSync(
      MEMORY_FILE,
      JSON.stringify(await history.getMessages()),
      "utf-8"
    );
  } catch (err) {
    console.error("Error saving memory:", err);
  }
}

async function main() {
  //   tools
  const calculator_tools = new Calculator();
  const tavily_search_tool = new TavilySearch({ maxResults: 2 });
  const agent_tools = [calculator_tools, tavily_search_tool];

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

  const messageHistory = await getMemoryFunction();

  const agentWithMemory = new RunnableWithMessageHistory({
    runnable: agentExecutor,
    getMessageHistory: () => messageHistory,
    inputMessagesKey: "input",
    historyMessagesKey: "history",
  });

  //   First message
  const response1 = await agentWithMemory.invoke(
    { input: "What is the capital of France?" },
    { configurable: { sessionId: SESSION_ID } }
  );
  console.log("Bot:", response1);

  //   // Second message
  //   const response2 = await chainWithMemory.invoke(
  //     { input: "what's my nick name" },
  //     { configurable: { sessionId: SESSION_ID } }
  //   );
  //   console.log("Bot:", response2.content);

  // Save memory to file
  await saveMemoryFunction(messageHistory);
  //   console.log(messageHistory.getMessages());
}

main();
