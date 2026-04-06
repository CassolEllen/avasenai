import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ClipboardList, Clock, CheckCircle2, AlertTriangle, ChevronRight, Search } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { assignments } from "@/data/mockData";

const statusConfig = {
  pendente: { label: "Pendente", color: "bg-warning/10 text-warning", icon: Clock },
  enviado: { label: "Enviado", color: "bg-success/10 text-success", icon: CheckCircle2 },
  atrasado: { label: "Atrasado", color: "bg-destructive/10 text-destructive", icon: AlertTriangle },
};

const Atividades = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"todas" | "pendente" | "enviado" | "atrasado">("todas");

  const filtered = filter === "todas" ? assignments : assignments.filter(a => a.status === filter);

  const counts = {
    todas: assignments.length,
    pendente: assignments.filter(a => a.status === "pendente").length,
    enviado: assignments.filter(a => a.status === "enviado").length,
    atrasado: assignments.filter(a => a.status === "atrasado").length,
  };

  return (
    <PageTransition>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ClipboardList size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Atividades</h1>
            <p className="text-sm text-muted-foreground">{counts.pendente} pendente{counts.pendente !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["todas", "pendente", "enviado", "atrasado"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`tap-feedback px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              {f === "todas" ? "Todas" : statusConfig[f].label} ({counts[f]})
            </button>
          ))}
        </div>

        {/* Assignment cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((assignment, i) => {
            const status = statusConfig[assignment.status];
            const StatusIcon = status.icon;
            return (
              <motion.div
                key={assignment.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => navigate(`/atividades/${assignment.id}`)}
                className="tap-feedback bg-card rounded-2xl p-5 shadow-senai hover:shadow-senai-lg transition-shadow cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
                    <StatusIcon size={12} />
                    {status.label}
                  </span>
                  <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1 line-clamp-2">{assignment.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{assignment.subject} · Prof. {assignment.professor}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock size={12} />
                  <span>Prazo: {assignment.dueDate}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle2 size={48} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhuma atividade encontrada</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Atividades;
