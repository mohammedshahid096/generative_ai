import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMessageHistory } from "langchain/memory";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import fs from "fs";
import path from "path";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const SESSION_ID = "abc1234";
const MEMORY_FILE = path.join("memory", `session-${SESSION_ID}.json`);

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant."],
  ["placeholder", "{history}"],
  ["human", "{input}"],
]);

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
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    maxOutputTokens: 50,
    temperature: 0.7,
  });

  const messageHistory = await getMemoryFunction();

  const chain = prompt.pipe(model);

  const chainWithMemory = new RunnableWithMessageHistory({
    runnable: chain,
    getMessageHistory: () => messageHistory,
    inputMessagesKey: "input",
    historyMessagesKey: "history",
  });

  // First message
  //   const response1 = await chainWithMemory.invoke(
  //     { input: "Hi there! my full name is shahid, and nick name is shah." },
  //     { configurable: { sessionId: SESSION_ID } }
  //   );
  //   console.log("Bot:", response1.content);

  //   // Second message
  //   const response2 = await chainWithMemory.invoke(
  //     { input: "what's my nick name" },
  //     { configurable: { sessionId: SESSION_ID } }
  //   );
  //   console.log("Bot:", response2.content);

  const response3 = await chainWithMemory.invoke(
    { input: "what's my full name name" },
    { configurable: { sessionId: SESSION_ID } }
  );
  console.log("Bot:", response3.content);

  // Save memory to file
  await saveMemoryFunction(messageHistory);
  //   console.log(messageHistory.getMessages());
}

main();
