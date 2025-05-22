import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import logger from "./logger.js";

dotenv.config();

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  //   verbose: true,
  maxOutputTokens: 30,
});

const prompt_template_name = ChatPromptTemplate.fromTemplate(
  "Tell me a {adjective} joke about {topic}."
);

const prompt_template_messages = ChatPromptTemplate.fromMessages([
  ["system", "Generate a joke based on  a word provided by the user"],
  ["human", "{input}"],
]);

async function usingPromptFormat() {
  let prompt = await prompt_template_name.format({
    adjective: "funny",
    topic: "robots",
  });
  const response = await model.invoke(prompt);
  console.log(response);
  logger.info("using prompt format", response);
}

async function usingPipe() {
  let chain = prompt_template_name.pipe(model);
  const response = await chain.invoke({ adjective: "funny", topic: "robots" });
  console.log(response);
  logger.info("using pipeline", response);
}

// usingPromptFormat();
// usingPipe();
