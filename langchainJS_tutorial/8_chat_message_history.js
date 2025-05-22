// A simple in-memory store for chat messages (human inputs and AI responses).
// Useful for tracking the full history of a conversation.

// addMessage(message): Add a message to history.

// getMessages(): Retrieve all messages.

// clear(): Reset history.

import { ChatMessageHistory } from "langchain/memory";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

const history = new ChatMessageHistory();

await history.addMessage(new HumanMessage("Hi, how are you?"));
await history.addMessage(new AIMessage("I'm good, thanks!"));

// Fetch all messages
const messages = await history.getMessages();
console.log(messages);
await history.clear();
const messages2 = await history.getMessages();
console.log(messages2);
