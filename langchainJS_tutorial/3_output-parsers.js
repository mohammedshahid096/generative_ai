import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  StringOutputParser,
  CommaSeparatedListOutputParser,
} from "@langchain/core/output_parsers";
import logger from "./logger.js";

dotenv.config();

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  //   verbose: true,
  maxOutputTokens: 30,
});

const prompt_template_string_output_parser = ChatPromptTemplate.fromMessages([
  ["system", "Generate a joke based on  a word provided by the user"],
  ["human", "{input}"],
]);

const prompt_template_list_output_parser = ChatPromptTemplate.fromTemplate(`
    provide 5 synonyms, separated by commas, for the following Word {word}
    `);

const string_parser = new StringOutputParser();
const comma_separated_parser = new CommaSeparatedListOutputParser();

async function callStringOutputParser() {
  try {
    let chain = prompt_template_string_output_parser
      .pipe(model)
      .pipe(string_parser);
    const response = await chain.invoke({ input: "dog" });
    console.log(response);
    logger.info("using pipeline string-output-parser", response);
  } catch (error) {
    console.log(error);
  }
}

async function callCommaSeparatedListOutputParser() {
  let chain = prompt_template_list_output_parser
    .pipe(model)
    .pipe(comma_separated_parser);
  const response = await chain.invoke({ word: "happy" });
  console.log(response);
  logger.info("using pipeline comma-separated-output-parser", response);
}

// callStringOutputParser();
callCommaSeparatedListOutputParser();
