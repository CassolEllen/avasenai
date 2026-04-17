import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, BookOpen, MessageCircle } from "lucide-react";
import type { Professor } from "@/data/professors";
import ChatPanel from "./ChatPanel";
import { useChatContext } from "@/contexts/ChatContext";

interface Props {
  professor: Professor;
  open: boolean;
  onClose: () => void;
}

const ProfessorProfile = ({ professor, open, onClose }: Props) => {
  const [showChat, setShowChat] = useState(false);
  const { getOrCreateConversation } = useChatContext();

  if (!open) return null;

  const initials = professor.name.split(" ").map(n => n[0]).join("");

  const handleStartChat = () => {
    getOrCreateConversation(professor);
    setShowChat(true);
  };

  const handleCloseAll = () => {
    setShowChat(false);
    onClose();
  };

  if (showChat) {
    const conv = getOrCreateConversation(professor);
    return (
      <ChatPanel
        conversationId={conv.id}
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
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 bg-card rounded-2xl shadow-xl overflow-hidden w-full max-w-md max-h-[85vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="gradient-senai p-6 text-center relative">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 transition text-primary-foreground"
              >
                <X size={18} />
              </button>
              <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto text-xl font-bold text-primary-foreground">
                {initials}
              </div>
              <h2 className="text-lg font-bold text-primary-foreground mt-3">{professor.name}</h2>
              <p className="text-xs text-primary-foreground/80 mt-0.5">{professor.title}</p>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {professor.bio && (
                <p className="text-sm text-muted-foreground leading-relaxed">{professor.bio}</p>
              )}

              {/* Contact */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                  <Mail size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground truncate">{professor.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                  <Phone size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{professor.phone}</span>
                </div>
              </div>

              {/* Disciplines */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground mb-2 uppercase">Disciplinas</h4>
                <div className="flex flex-wrap gap-2">
                  {professor.disciplines.map(d => (
                    <span key={d} className="text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                      <BookOpen size={12} className="inline mr-1 -mt-0.5" />
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Start chat button */}
              <button
                onClick={handleStartChat}
                className="w-full flex items-center justify-center gap-2 gradient-senai text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition tap-feedback"
              >
                <MessageCircle size={18} />
                Iniciar conversa
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfessorProfile;
