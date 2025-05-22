import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

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

const loader = new CheerioWebBaseLoader(
  "https://js.langchain.com/docs/concepts/lcel/"
);
const docs = await loader.load();
// console.log(docs);
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 20,
});

const splitDocs = await splitter.splitDocuments(docs);
console.log("split docs", splitDocs);

// const chain = prompt.pipe(model);
// const chain = await createStuffDocumentsChain({ llm: model, prompt });

// Documents

// const response = await chain.invoke({
//   input_question: "What is passphrase?",
//   context: [],
// });
// console.log(response);
// logger.info("response", response);
