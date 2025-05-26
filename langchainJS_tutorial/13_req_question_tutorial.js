import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { z } from "zod";
import logger from "./logger.js";

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant. Use tools when appropriate. Ask questions to get any missing required information.",
  ],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  maxOutputTokens: 100,
  temperature: 0.7,
});

const registerUserInfoSchema = z.object({
  name: z.string().describe("The user's full name"),
  email: z.string().describe("The user's valid email address"),
  phone: z
    .string()
    .optional()
    .describe("Optional phone number with country code"),
});

const getUserInfoSchema = z.object({
  email: z.string().describe("The user's valid email address"),
});

const userDetailsData = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+0987654321",
  },
  {
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "+1122334455",
  },
  {
    name: "Bob Brown",
    email: "bob.brown@example.com",
    phone: "+2233445566",
  },
];

async function req_question_tutorial() {
  // Create the tool using DynamicStructuredTool
  const userRegisterTool = new DynamicStructuredTool({
    name: "user_register_info",
    description:
      "registers user information. REQUIRES: name and email. OPTIONAL: phone",
    schema: registerUserInfoSchema,
    func: async ({ name, email, phone }) => {
      console.log(`Storing user: ${name}, ${email}, ${phone || "no phone"}`);
      userDetailsData.push({
        name,
        email,
        phone: phone || "no phone",
      });
      return `User ${name} (${email}) ${
        phone ? `with phone ${phone}` : "with no phone"
      } registered successfully`;
    },
  });

  const userInfoTool = new DynamicStructuredTool({
    name: "get_user_info",
    description: "Retrieves user information. REQUIRES: email",
    schema: getUserInfoSchema,
    func: async ({ email }) => {
      let details = userDetailsData?.find((user) => user.email === email);
      return details ?? "user not found";
    },
  });

  const agentTools = [userRegisterTool, userInfoTool];

  const agent = createToolCallingAgent({
    llm: model,
    tools: agentTools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools: agentTools,
    verbose: false,
  });

  //   const response = await agentExecutor.invoke({
  //     input: "give me the user information for john.doe@example.com",
  //   });
  const response = await agentExecutor.invoke({
    input: "i want to add a new user with name: shahid",
  });

  console.log("Bot:", response);
  logger.info("bot", response);
}

req_question_tutorial();
