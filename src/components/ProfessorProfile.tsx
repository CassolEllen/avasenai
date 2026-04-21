import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, BookOpen, MessageCircle } from "lucide-react";
import type { Professor } from "@/data/professors";
import ChatPanel from "./ChatPanel";
import { useChatContext } from "@/contexts/ChatContext";
import PortalLayer from "@/components/ui/portal-layer";

interface Props {
  professor: Professor;
  open: boolean;
  onClose: () => void;
}

const ProfessorProfile = ({ professor, open, onClose }: Props) => {
  const [showChat, setShowChat] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { getOrCreateConversation } = useChatContext();

  if (!open) return null;

  const initials = professor.name.split(" ").map(n => n[0]).join("");

  const handleStartChat = async () => {
    const conv = await getOrCreateConversation({ id: professor.id, name: professor.name });
    setConversationId(conv.id);
    setShowChat(true);
  };

  const handleCloseAll = () => {
    setShowChat(false);
    setConversationId(null);
    onClose();
  };

  if (showChat && conversationId) {
    return (
      <ChatPanel
        conversationId={conversationId}
        professorName={professor.name}
        open={true}
        onClose={handleCloseAll}
        onBack={() => setShowChat(false)}
      />
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <PortalLayer>
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6">
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
              className="relative z-10 max-h-[85vh] w-[min(480px,calc(100vw-32px))] max-w-[90vw] overflow-y-auto rounded-2xl bg-card shadow-xl"
            >
              <div className="relative bg-primary p-6 text-center text-primary-foreground">
                <button
                  onClick={onClose}
                  className="absolute right-3 top-3 rounded-full bg-primary-foreground/20 p-1.5 text-primary-foreground transition hover:bg-primary-foreground/30"
                >
                  <X size={18} />
                </button>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/20 text-xl font-bold text-primary-foreground">
                  {initials}
                </div>
                <h2 className="mt-3 text-lg font-bold">{professor.name}</h2>
                <p className="mt-0.5 text-xs text-primary-foreground/80">{professor.title}</p>
              </div>

              <div className="space-y-4 p-5">
                {professor.bio && <p className="text-sm leading-relaxed text-muted-foreground">{professor.bio}</p>}

                <div className="space-y-2">
                  <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                    <Mail size={16} className="flex-shrink-0 text-primary" />
                    <span className="truncate text-sm text-foreground">{professor.email}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                    <Phone size={16} className="flex-shrink-0 text-primary" />
                    <span className="text-sm text-foreground">{professor.phone}</span>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-xs font-bold uppercase text-muted-foreground">Disciplinas</h4>
                  <div className="flex flex-wrap gap-2">
                    {professor.disciplines.map(d => (
                      <span key={d} className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                        <BookOpen size={12} className="mr-1 -mt-0.5 inline" />
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleStartChat}
                  className="tap-feedback flex w-full items-center justify-center gap-2 rounded-xl gradient-senai py-3 font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  <MessageCircle size={18} />
                  Iniciar conversa
                </button>
              </div>
            </motion.div>
          </div>
        </PortalLayer>
      )}
    </AnimatePresence>
  );
};

export default ProfessorProfile;
