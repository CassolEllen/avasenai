import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Video, ExternalLink, Calendar, X } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { CardSkeleton } from "@/components/Skeleton";
import { classes, ClassItem } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomSheet from "@/components/BottomSheet";

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
  const isMobile = useIsMobile();
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

  const detailPanel = selected && (
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
        <p className="text-xs text-muted-foreground font-medium mb-1">Horário</p>
        <p className="text-sm text-foreground">{selected.day} · {selected.time}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium mb-1">Local</p>
        <p className="text-sm text-foreground">{selected.location}</p>
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
        <button className="tap-feedback w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <Video size={16} />
          Entrar na Reunião
          <ExternalLink size={14} />
        </button>
      )}
    </div>
  );

  return (
    <PageTransition>
      <div className="flex gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Filter bar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex bg-muted rounded-xl p-1 flex-1 max-w-sm">
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

          {/* Desktop: table style; Mobile: cards */}
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block">
                <div className="bg-card rounded-2xl shadow-senai overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Matéria</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Professor</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Dia/Hora</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Tipo</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Local</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((cls) => (
                        <tr
                          key={cls.id}
                          onClick={() => setSelected(cls)}
                          className={`border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-muted/50 ${selected?.id === cls.id ? "bg-primary/5" : ""}`}
                        >
                          <td className="px-4 py-3 font-semibold text-foreground">{cls.subject}</td>
                          <td className="px-4 py-3 text-muted-foreground">{cls.professor}</td>
                          <td className="px-4 py-3 text-muted-foreground">{cls.day} · {cls.time}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-pill ${
                              cls.type === "presencial" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                            }`}>
                              {cls.type === "presencial" ? <MapPin size={10} /> : <Video size={10} />}
                              {cls.type === "presencial" ? "Presencial" : "Online"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{cls.location}</td>
                          <td className="px-4 py-3">
                            <span className={`text-[10px] font-medium px-2 py-1 rounded-pill ${statusPillColors[cls.status]}`}>
                              {statusLabels[cls.status]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {filtered.map((cls, i) => (
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
                ))}
              </div>
            </>
          )}
        </div>

        {/* Desktop: right drawer panel */}
        {!isMobile && (
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 40, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-[400px] flex-shrink-0 bg-card rounded-2xl shadow-senai p-6 sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground">{selected.subject}</h3>
                  <button onClick={() => setSelected(null)} className="tap-feedback p-1 rounded-lg hover:bg-muted">
                    <X size={18} className="text-muted-foreground" />
                  </button>
                </div>
                {detailPanel}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Mobile: bottom sheet */}
      {isMobile && (
        <BottomSheet open={!!selected} onClose={() => setSelected(null)} title={selected?.subject}>
          {detailPanel}
        </BottomSheet>
      )}
    </PageTransition>
  );
};

export default Aulas;
