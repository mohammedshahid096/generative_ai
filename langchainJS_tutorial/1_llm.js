import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatDeepSeek } from "@langchain/deepseek";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  //   verbose: true,
  maxOutputTokens: 100,
});
const model2 = new ChatDeepSeek({
  model: "deepseek/deepseek-chat-v3-0324:free",
  baseUrl: "https://openrouter.ai/api/v1",
  apiKey:
    "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",
});

const model3 = new ChatOpenAI(
  {
    modelName: "deepseek/deepseek-chat-v3-0324:free",
    openAIApiKey:
      "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", // Replace with your OpenAI API key
  },
  { basePath: "https://openrouter.ai/api/v1" }
);

async function callWithInvokeMethod() {
  const response = await model.invoke("hello");
  console.log(response);
}

async function callWithBatchMethod() {
  const response = await model.batch(["hello", "how are you?"]);
  console.log(response);
}

async function callWithStreamMethod() {
  const response = await model.stream("write a poem about ai");
  for await (const chunk of response) {
    console.log(chunk?.content);
  }
}

async function callWithOpenRouter() {
  const response = await model3.invoke("hello");
  console.log(response);
}
callWithInvokeMethod();
// callWithBatchMethod();
// callWithStreamMethod();
// callWithOpenRouter();
