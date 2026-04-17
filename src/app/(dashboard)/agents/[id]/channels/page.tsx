"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { MessageCircle, Send, AtSign, CheckCircle, X, Loader2, Wifi, WifiOff } from "lucide-react";

export default function ChannelsPage() {
  const { id: agentId } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [stevoStatus, setStevoStatus] = useState<{
    connected: boolean;
    phone: string | null;
    channelActive: boolean;
  }>({ connected: false, phone: null, channelActive: false });

  const checkStatus = useCallback(async () => {
    try {
      const [stevoRes, channelRes] = await Promise.all([
        fetch("/api/channels/stevo"),
        fetch(`/api/agents/${agentId}`),
      ]);
      const stevo = await stevoRes.json();
      const agent = await channelRes.json();

      const whatsappChannel = agent?.channels?.find(
        (ch: { type: string; active: boolean }) => ch.type === "whatsapp" && ch.active
      );

      setStevoStatus({
        connected: stevo.connected,
        phone: stevo.phone || whatsappChannel?.credentials?.phone || null,
        channelActive: !!whatsappChannel,
      });
    } catch {
      // keep current state
    }
  }, [agentId]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const connectWhatsApp = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/channels/stevo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId }),
      });
      const data = await res.json();
      if (data.connected) {
        setStevoStatus({
          connected: true,
          phone: data.phone,
          channelActive: true,
        });
      }
    } catch (err) {
      console.error("Failed to connect:", err);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWhatsApp = async () => {
    setLoading(true);
    try {
      await fetch("/api/channels/stevo", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId }),
      });
      setStevoStatus({ connected: false, phone: null, channelActive: false });
    } catch (err) {
      console.error("Failed to disconnect:", err);
    } finally {
      setLoading(false);
    }
  };

  const channels = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500",
      desc: "Via Stevo (instância própria)",
      connected: stevoStatus.channelActive,
      phone: stevoStatus.phone ? `+${stevoStatus.phone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "$1 $2 $3-$4")}` : null,
      onConnect: connectWhatsApp,
      onDisconnect: disconnectWhatsApp,
    },
    {
      id: "telegram",
      name: "Telegram",
      icon: Send,
      color: "bg-blue-500",
      desc: "Bot do Telegram",
      connected: false,
      phone: null,
      onConnect: undefined,
      onDisconnect: undefined,
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: AtSign,
      color: "bg-pink-500",
      desc: "Direct Messages via Meta API",
      connected: false,
      phone: null,
      onConnect: undefined,
      onDisconnect: undefined,
    },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-[#111827]">Canais Conectados</h2>
        <p className="text-xs text-[#9CA3AF] mt-0.5">Conecte canais de mensagens ao seu agente</p>
      </div>

      {/* Stevo Status */}
      <div className="flex items-center gap-2 text-xs">
        {stevoStatus.connected ? (
          <>
            <Wifi size={13} className="text-emerald-500" />
            <span className="text-emerald-600 font-medium">Stevo conectada</span>
          </>
        ) : (
          <>
            <WifiOff size={13} className="text-[#9CA3AF]" />
            <span className="text-[#9CA3AF]">Stevo desconectada</span>
          </>
        )}
      </div>

      <div className="space-y-3">
        {channels.map((ch) => {
          const Icon = ch.icon;
          return (
            <div
              key={ch.id}
              className="bg-white rounded-xl border border-[#E5E7EB] p-4 flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-xl ${ch.color} flex items-center justify-center text-white shrink-0`}>
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#111827]">{ch.name}</p>
                <p className="text-xs text-[#9CA3AF]">
                  {ch.connected && ch.phone ? ch.phone : ch.desc}
                </p>
              </div>
              {ch.connected ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <CheckCircle size={13} /> Conectado
                  </span>
                  {ch.onDisconnect && (
                    <button
                      onClick={ch.onDisconnect}
                      disabled={loading}
                      className="p-1 rounded hover:bg-red-50 transition-colors"
                    >
                      {loading ? (
                        <Loader2 size={15} className="text-[#9CA3AF] animate-spin" />
                      ) : (
                        <X size={15} className="text-[#9CA3AF] hover:text-red-500 transition-colors" />
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={ch.onConnect}
                  disabled={loading || !ch.onConnect}
                  className="px-3 py-1.5 text-xs font-medium border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] text-[#6B7280] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading && ch.id === "whatsapp" ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : ch.onConnect ? (
                    "Conectar"
                  ) : (
                    "Em breve"
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
