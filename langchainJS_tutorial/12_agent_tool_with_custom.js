import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { DynamicStructuredTool, tool } from "@langchain/core/tools";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { z } from "zod";
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

const multiplierSchema = z.object({
  a: z.number().describe("The first number to multiply"),
  b: z.number().describe("The second number to multiply"),
});

async function usingToolClass() {
  const multiplyTool = tool(
    async (input) => {
      try {
        const { a, b } = input;
        const result = a * b;
        return `The result of ${a} * ${b} is ${result}`;
      } catch (error) {
        return "Invalid input.";
      }
    },
    {
      name: "multiply_numbers",
      description: "Multiplies two numbers",
      schema: multiplierSchema,
    }
  );

  const agent_tools = [multiplyTool];
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

  const response = await agentExecutor.invoke({
    input: "What is 9 times 7?",
  });
  console.log("Bot:", response);
  logger.info("message", response);
}

async function usingDynamicStructuredToo() {
  // Create the tool using DynamicStructuredTool
  const multiplyTool = new DynamicStructuredTool({
    name: "multiply_numbers",
    description: "Multiplies two numbers together",
    schema: multiplierSchema,
    func: async ({ a, b }) => {
      const result = a * b;
      return `The result of ${a} * ${b} is ${result}`;
    },
  });

  const agentTools = [multiplyTool];

  const agent = createToolCallingAgent({
    llm: model,
    tools: agentTools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools: agentTools,
    // verbose: true, // Keep this to see the execution flow
  });

  const response = await agentExecutor.invoke({
    input: "What is 9 times 7?",
  });

  console.log("Bot:", response);
}

usingToolClass();
