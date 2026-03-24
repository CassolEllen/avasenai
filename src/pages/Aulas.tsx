import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Video, ExternalLink, Calendar } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import ScreenHeader from "@/components/ScreenHeader";
import BottomSheet from "@/components/BottomSheet";
import { CardSkeleton } from "@/components/Skeleton";
import { classes, ClassItem } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const statusColors = {
  agendada: "border-l-primary",
  em_andamento: "border-l-success",
  concluida: "border-l-muted-foreground",
};

const statusLabels = {
  agendada: "Agendada",
  em_andamento: "Em Andamento",
  concluida: "Concluída",
};

const statusPillColors = {
  agendada: "bg-primary/10 text-primary",
  em_andamento: "bg-success/10 text-success",
  concluida: "bg-muted text-muted-foreground",
};

const Aulas = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"todas" | "presencial" | "online">("todas");
  const [selected, setSelected] = useState<ClassItem | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = classes.filter(c => {
    if (filter === "todas") return true;
    return c.type === filter;
  });

  return (
    <PageTransition>
      <ScreenHeader
        title="Aulas"
        rightAction={
          <button onClick={() => navigate("/calendario")} className="tap-feedback p-1">
            <Calendar size={20} className="text-foreground" />
          </button>
        }
      />

      {/* Segmented Control */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex bg-muted rounded-xl p-1">
          {(["todas", "presencial", "online"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`tap-feedback flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {f === "todas" ? "Todas" : f === "presencial" ? "Presencial" : "Online"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-24 space-y-3 overflow-y-auto">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          filtered.map((cls, i) => (
            <motion.div
              key={cls.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelected(cls)}
              className={`tap-feedback bg-card rounded-2xl p-4 shadow-senai border-l-4 cursor-pointer ${statusColors[cls.status]}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{cls.subject}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Prof. {cls.professor}</p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-1 rounded-pill ${statusPillColors[cls.status]}`}>
                  {statusLabels[cls.status]}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[11px] bg-muted text-muted-foreground px-2 py-1 rounded-pill font-medium">
                  {cls.day} · {cls.time}
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-pill ${
                  cls.type === "presencial" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                }`}>
                  {cls.type === "presencial" ? <MapPin size={10} /> : <Video size={10} />}
                  {cls.location}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <BottomSheet open={!!selected} onClose={() => setSelected(null)} title={selected?.subject}>
        {selected && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">Tema da Aula</p>
              <p className="text-sm font-semibold text-foreground">{selected.topic}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">Professor</p>
              <p className="text-sm text-foreground">{selected.professor}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-2">Materiais</p>
              {selected.materials.map(m => (
                <div key={m} className="flex items-center gap-2 py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{m}</span>
                </div>
              ))}
            </div>
            {selected.type === "online" && (
              <button className="tap-feedback w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                <Video size={16} />
                Entrar na Reunião
                <ExternalLink size={14} />
              </button>
            )}
          </div>
        )}
      </BottomSheet>
    </PageTransition>
  );
};

export default Aulas;
