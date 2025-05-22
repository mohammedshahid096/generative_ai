import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  StringOutputParser,
  CommaSeparatedListOutputParser,
} from "@langchain/core/output_parsers";
import { StructuredOutputParser } from "langchain/output_parsers";
import logger from "./logger.js";
import { z } from "zod";

dotenv.config();

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  //   verbose: true,
  maxOutputTokens: 50,
});

// ----------------------  for string ----------------------------------
const prompt_template_string_output_parser = ChatPromptTemplate.fromMessages([
  ["system", "Generate a joke based on  a word provided by the user"],
  ["human", "{input}"],
]);
const string_parser = new StringOutputParser();

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

// ----------------------  for comma separated list ----------------------------------
const prompt_template_list_output_parser = ChatPromptTemplate.fromTemplate(`
    provide 5 synonyms, separated by commas, for the following Word {word}
    `);

const comma_separated_parser = new CommaSeparatedListOutputParser();

async function callCommaSeparatedListOutputParser() {
  let chain = prompt_template_list_output_parser
    .pipe(model)
    .pipe(comma_separated_parser);
  const response = await chain.invoke({ word: "happy" });
  console.log(response);
  logger.info("using pipeline comma-separated-output-parser", response);
}

// ----------------------  for structured output parser ----------------------------------
const prompt_template_structured_parser = ChatPromptTemplate.fromTemplate(`
    Extract information from the following phrase.
    Formatting Instructions :{format_instructions}.
    Phrase: {phrase}
    `);
const structured_parser = StructuredOutputParser.fromNamesAndDescriptions({
  name: "the name of the person",
  age: "the age of the person",
});

async function callStructureOutputParser() {
  const chain = prompt_template_structured_parser
    .pipe(model)
    .pipe(structured_parser);
  const response = await chain.invoke({
    phrase: "Max in 30 years",
    format_instructions: structured_parser.getFormatInstructions(),
  });
  console.log(response);
  logger.info("structured output", response);
  console.log(typeof response);
}

// ----------------------  for structured zod schema - output parser ----------------------------------
const prompt_template_structured_zod_parser = ChatPromptTemplate.fromTemplate(`
    Extract information from the following phrase.
    Formatting Instructions :{format_instructions}.
    Phrase: {phrase}
    `);
const structured_zod_parser = StructuredOutputParser.fromZodSchema(
  z.object({
    recipe: z.string().describe("name of recipe"),
    ingredients: z.array(z.string()).describe("ingredients"),
  })
);

async function callStructureZodOutputParser() {
  const chain = prompt_template_structured_zod_parser
    .pipe(model)
    .pipe(structured_zod_parser);
  const response = await chain.invoke({
    phrase:
      "The ingredients for a Spaghetti Bolognese recipe are tomato, minced beef, garlic, wine and herbs.",
    format_instructions: structured_zod_parser.getFormatInstructions(),
  });
  console.log(response);
  logger.info("structured zod output", response);
  console.log(typeof response);
}

// callStringOutputParser();
// callCommaSeparatedListOutputParser();
// callStructureOutputParser();
// console.log(structured_zod_parser.getFormatInstructions());

callStructureZodOutputParser();
