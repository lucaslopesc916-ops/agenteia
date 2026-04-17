import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatResponse {
  reply: string;
  tokensUsed: number;
}

const CLAUDE_MODELS = ["claude-sonnet-4-20250514", "claude-haiku-4-5-20251001"];

function isClaudeModel(model: string) {
  return model.startsWith("claude-");
}

async function chatWithOpenAI(
  model: string,
  messages: ChatMessage[]
): Promise<ChatResponse> {
  const completion = await openai.chat.completions.create({
    model,
    messages,
    max_tokens: 1024,
  });
  return {
    reply: completion.choices[0]?.message?.content || "Sem resposta.",
    tokensUsed: completion.usage?.total_tokens || 0,
  };
}

async function chatWithClaude(
  model: string,
  messages: ChatMessage[]
): Promise<ChatResponse> {
  const systemMsg = messages.find((m) => m.role === "system");
  const chatMsgs = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

  const response = await anthropic.messages.create({
    model,
    max_tokens: 1024,
    system: systemMsg?.content || "",
    messages: chatMsgs,
  });

  const reply =
    response.content[0]?.type === "text"
      ? response.content[0].text
      : "Sem resposta.";

  return {
    reply,
    tokensUsed: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0),
  };
}

export async function chat(
  model: string,
  messages: ChatMessage[]
): Promise<ChatResponse> {
  if (isClaudeModel(model)) {
    return chatWithClaude(model, messages);
  }
  return chatWithOpenAI(model, messages);
}

export const AVAILABLE_MODELS = [
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", desc: "Rápido e econômico" },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", desc: "Mais capaz" },
  { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4", provider: "Anthropic", desc: "Inteligente e rápido" },
  { id: "claude-haiku-4-5-20251001", name: "Claude Haiku 4.5", provider: "Anthropic", desc: "Ultra-rápido e barato" },
];
