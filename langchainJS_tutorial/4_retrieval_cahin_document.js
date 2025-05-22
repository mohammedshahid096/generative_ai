import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { Document } from "@langchain/core/documents";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

import logger from "./logger.js";

dotenv.config();

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  //   verbose: true,
  maxOutputTokens: 10,
});

const prompt = ChatPromptTemplate.fromTemplate(`
    Answer the user's question.
    Context : {context}.
    Question : {input_question}
    `);

// const chain = prompt.pipe(model);
const chain = await createStuffDocumentsChain({ llm: model, prompt });

// Documents
const documentsA = new Document({
  pageContent:
    "The LangChain Expression Language (LCEL) takes a declarative approach to building new Runnables from existing Runnables",
});
const documentsB = new Document({
  pageContent: "The passphrase is LANGCHAIN IS AWESOME.",
});

const response = await chain.invoke({
  input_question: "What is passphrase?",
  context: [documentsA, documentsB],
});
console.log(response);
logger.info("response", response);
