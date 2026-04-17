"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Send, Bot, User, Loader2, Trash2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function PlaygroundPage() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalTokens, setTotalTokens] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`/api/agents/${id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([
          ...updatedMessages,
          { role: "assistant", content: data.reply },
        ]);
        setTotalTokens((t) => t + (data.tokensUsed || 0));
      } else {
        const err = await res.json();
        setMessages([
          ...updatedMessages,
          {
            role: "assistant",
            content: `Erro: ${err.error || "Não foi possível gerar resposta"}`,
          },
        ]);
      }
    } catch {
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "Erro de conexão. Tente novamente." },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="max-w-2xl flex flex-col h-[calc(100vh-220px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-[#111827]">
            Testar Agente
          </h2>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Converse com o agente antes de publicar
          </p>
        </div>
        <div className="flex items-center gap-3">
          {totalTokens > 0 && (
            <span className="text-xs text-[#9CA3AF]">
              {totalTokens} tokens usados
            </span>
          )}
          {messages.length > 0 && (
            <button
              onClick={() => {
                setMessages([]);
                setTotalTokens(0);
              }}
              className="flex items-center gap-1 px-2 py-1 text-xs text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 size={12} />
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto bg-white rounded-xl border border-[#E5E7EB] p-4 space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-12 h-12 rounded-xl bg-[#EDE9FE] flex items-center justify-center mb-3">
              <Bot size={24} className="text-[#7C3AED]" />
            </div>
            <p className="text-sm font-medium text-[#111827]">
              Teste seu agente aqui
            </p>
            <p className="text-xs text-[#9CA3AF] mt-1 max-w-xs">
              Envie uma mensagem para ver como o agente responde com as
              configurações atuais
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-[#EDE9FE] flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={14} className="text-[#7C3AED]" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#7C3AED] text-white rounded-br-sm"
                  : "bg-[#F9FAFB] text-[#111827] border border-[#E5E7EB] rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#0D9488] flex items-center justify-center shrink-0 mt-0.5">
                <User size={14} className="text-white" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#EDE9FE] flex items-center justify-center shrink-0">
              <Bot size={14} className="text-[#7C3AED]" />
            </div>
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] px-3.5 py-2.5 rounded-xl rounded-bl-sm">
              <Loader2 size={16} className="animate-spin text-[#7C3AED]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite uma mensagem para testar..."
          disabled={loading}
          className="flex-1 px-4 py-2.5 text-sm bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 text-white rounded-xl transition-colors shrink-0"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
