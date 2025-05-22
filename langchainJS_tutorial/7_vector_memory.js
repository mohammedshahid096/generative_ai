import dotenv from "dotenv";
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
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

const chain = await createStuffDocumentsChain({ llm: model, prompt });

// load data
const loader = new CheerioWebBaseLoader(
  "https://js.langchain.com/docs/concepts/lcel/"
);
const docs = await loader.load();

// text splitter
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 20,
});

const splitDocs = await splitter.splitDocuments(docs);
const embeddings = new GoogleGenerativeAIEmbeddings();
const vectorStore = await MemoryVectorStore.fromDocuments(
  splitDocs,
  embeddings
);

// retriever data
const retriever = vectorStore.asRetriever({ k: 2 });
const retrievalChain = await createRetrievalChain({
  combineDocsChain: chain,
  retriever,
});

const response = await retrievalChain.invoke({
  input_question: "What is LCEL?",
});
console.log(response);
logger.info("response", response);
