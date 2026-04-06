import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { CardSkeleton } from "@/components/Skeleton";
import { messages, Message } from "@/data/mockData";
import { useIsMobile } from "@/hooks/use-mobile";

const typeBorderColors = {
  inicio: "border-l-success",
  encerramento: "border-l-destructive",
  aviso: "border-l-primary",
};

const Mensagens = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = messages.filter(m =>
    m.professor.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleMsgClick = (msg: Message) => {
    if (isMobile) {
      navigate(`/mensagens/${msg.id}`);
    } else {
      setSelectedMsg(msg);
    }
  };

  const messageList = (
    <div className="space-y-3">
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm font-semibold text-foreground">Nenhuma mensagem encontrada</p>
          <p className="text-xs text-muted-foreground mt-1">Tente buscar com outros termos</p>
        </div>
      ) : (
        filtered.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => handleMsgClick(msg)}
            className={`tap-feedback bg-card rounded-2xl p-4 shadow-senai cursor-pointer border-l-4 transition-all hover:shadow-senai-lg ${typeBorderColors[msg.type]} ${
              !isMobile && selectedMsg?.id === msg.id ? "ring-2 ring-primary" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                {msg.professor.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold text-foreground ${msg.unread ? "" : "opacity-70"}`}>{msg.professor}</p>
                  <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                </div>
                <span className="inline-block text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-pill mt-1">{msg.subject}</span>
                <p className="text-xs text-muted-foreground mt-1 truncate">{msg.preview}</p>
              </div>
              {msg.unread && <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1 flex-shrink-0" />}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );

  // Desktop: two-panel email layout
  if (!isMobile) {
    return (
      <PageTransition>
        <div className="flex gap-6 min-h-[calc(100vh-10rem)]">
          {/* Left panel: message list */}
          <div className="w-[320px] lg:w-[380px] flex-shrink-0 space-y-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar mensagens..."
                className="w-full bg-muted rounded-xl py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
            {messageList}
          </div>

          {/* Right panel: message content */}
          <div className="flex-1 bg-card rounded-2xl shadow-senai p-6 sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto">
            {selectedMsg ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {selectedMsg.professor.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground">{selectedMsg.professor}</p>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-pill">{selectedMsg.subject}</span>
                  </div>
                  <span className="ml-auto text-xs text-muted-foreground">{selectedMsg.timestamp}</span>
                </div>
                <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{selectedMsg.body}</p>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                <p className="text-5xl mb-4">📨</p>
                <p className="text-base font-semibold text-foreground">Selecione uma mensagem</p>
                <p className="text-sm text-muted-foreground mt-1">Escolha uma mensagem da lista para visualizar</p>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    );
  }

  // Mobile: original list view
  return (
    <PageTransition>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-[13px] text-muted-foreground z-10" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar mensagens..."
          className="w-full bg-muted rounded-xl py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition mb-4"
        />
      </div>
      {messageList}
    </PageTransition>
  );
};

export default Mensagens;
