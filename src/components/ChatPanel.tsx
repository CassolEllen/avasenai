import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Send } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChatContext } from "@/contexts/ChatContext";

interface Props {
  conversationId: string;
  professorName: string;
  open: boolean;
  onClose: () => void;
  onBack?: () => void;
}

const ChatPanel = ({ conversationId, professorName, open, onClose, onBack }: Props) => {
  const isMobile = useIsMobile();
  const [text, setText] = useState("");
  const { getConversation, sendMessage } = useChatContext();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const conversation = getConversation(conversationId);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [conversation?.messages.length]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage(conversationId, trimmed);
    setText("");
  };

  const initials = professorName.split(" ").map(n => n[0]).join("");

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative z-10 bg-card rounded-2xl shadow-xl flex flex-col overflow-hidden ${
          isMobile ? "w-[calc(100vw-32px)] h-[85vh]" : "w-full max-w-lg h-[600px]"
        }`}
      >
        {/* Header */}
        <div className="gradient-senai px-4 py-3 flex items-center gap-3 flex-shrink-0">
          {onBack && (
            <button onClick={onBack} className="p-1 rounded-full hover:bg-primary-foreground/20 transition text-primary-foreground">
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm font-bold text-primary-foreground">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-primary-foreground truncate">{professorName}</p>
            <p className="text-[10px] text-primary-foreground/70">Online</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-primary-foreground/20 transition text-primary-foreground">
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {(!conversation || conversation.messages.length === 0) && (
            <div className="text-center py-12">
              <p className="text-3xl mb-2">💬</p>
              <p className="text-sm text-muted-foreground">Envie uma mensagem para iniciar a conversa</p>
            </div>
          )}
          {conversation?.messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  msg.type === "sent"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.type === "sent" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-border p-3 flex items-center gap-2 flex-shrink-0">
          <input
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-muted rounded-xl py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="p-2.5 rounded-xl gradient-senai text-primary-foreground disabled:opacity-40 transition tap-feedback"
          >
            <Send size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatPanel;
