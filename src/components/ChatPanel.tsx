import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Send } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChatContext } from "@/contexts/ChatContext";
import PortalLayer from "@/components/ui/portal-layer";

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

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText("");
    await sendMessage(conversationId, trimmed);
  };

  const initials = professorName.split(" ").map(n => n[0]).join("");

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <PortalLayer>
      <div className={`fixed inset-0 z-[95] flex ${isMobile ? "" : "items-center justify-center p-4 sm:p-6"}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        <motion.div
          initial={isMobile ? { opacity: 0, y: 30 } : { opacity: 0, scale: 0.95 }}
          animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1 }}
          exit={isMobile ? { opacity: 0, y: 30 } : { opacity: 0, scale: 0.95 }}
          className={`relative z-10 flex flex-col overflow-hidden bg-card shadow-xl ${
            isMobile ? "h-[100dvh] w-full rounded-none" : "h-[min(600px,85vh)] w-full max-w-lg rounded-2xl"
          }`}
          style={isMobile ? { paddingBottom: "env(safe-area-inset-bottom, 0px)" } : undefined}
        >
          <div className="gradient-senai flex items-center gap-3 px-4 py-3 flex-shrink-0">
            {onBack && (
              <button onClick={onBack} className="rounded-full p-1 text-primary-foreground transition hover:bg-primary-foreground/20">
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/20 text-sm font-bold text-primary-foreground">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-primary-foreground">{professorName}</p>
              <p className="text-[10px] text-primary-foreground/70">Online</p>
            </div>
            <button onClick={onClose} className="rounded-full p-1.5 text-primary-foreground transition hover:bg-primary-foreground/20">
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {(!conversation || conversation.messages.length === 0) && (
              <div className="py-12 text-center">
                <p className="mb-2 text-3xl">💬</p>
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
                  <p className={`mt-1 text-[10px] ${msg.type === "sent" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-shrink-0 items-center gap-2 border-t border-border p-3">
            <input
              ref={inputRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Digite sua mensagem..."
              className="flex-1 rounded-xl bg-muted px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className="tap-feedback rounded-xl gradient-senai p-2.5 text-primary-foreground transition disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </PortalLayer>
  );
};

export default ChatPanel;
