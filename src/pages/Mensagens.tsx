import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import ScreenHeader from "@/components/ScreenHeader";
import { CardSkeleton } from "@/components/Skeleton";
import { messages } from "@/data/mockData";

const typeBorderColors = {
  inicio: "border-l-success",
  encerramento: "border-l-destructive",
  aviso: "border-l-primary",
};

const Mensagens = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = messages.filter(m =>
    m.professor.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageTransition>
      <ScreenHeader title="Mensagens" />

      {/* Search */}
      <div className="px-4 pt-3 pb-2">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar mensagens..."
            className="w-full bg-muted rounded-xl py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition"
          />
        </div>
      </div>

      <div className="px-4 pb-24 space-y-3 overflow-y-auto">
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
              onClick={() => navigate(`/mensagens/${msg.id}`)}
              className={`tap-feedback bg-card rounded-2xl p-4 shadow-senai cursor-pointer border-l-4 ${typeBorderColors[msg.type]}`}
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
    </PageTransition>
  );
};

export default Mensagens;
