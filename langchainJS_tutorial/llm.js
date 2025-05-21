import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  //   verbose: true,
  maxOutputTokens: 100,
});

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

callWithInvokeMethod();
// callWithBatchMethod();
// callWithStreamMethod();
