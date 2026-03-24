import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Settings, ChevronRight, FileText, Download, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import ProgressRing from "@/components/ProgressRing";
import { student, badges, submittedFiles } from "@/data/mockData";
import { toast } from "sonner";

const statusConfig = {
  entregue: { label: "Entregue", icon: CheckCircle, color: "text-success bg-success/10" },
  atrasado: { label: "Atrasado", icon: AlertTriangle, color: "text-warning bg-warning/10" },
  pendente: { label: "Pendente", icon: Clock, color: "text-muted-foreground bg-muted" },
};

const reports = [
  "Boletim Escolar",
  "Histórico de Aulas",
  "Declaração de Matrícula",
];

const Perfil = () => {
  const navigate = useNavigate();

  const handleReport = (name: string) => {
    toast.loading("Gerando relatório...", { id: name });
    setTimeout(() => {
      toast.success(`${name} baixado com sucesso! ✓`, { id: name });
    }, 2000);
  };

  return (
    <PageTransition>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-lg font-bold text-foreground">Perfil</h1>
          <button onClick={() => navigate("/configuracoes")} className="tap-feedback p-1">
            <Settings size={20} className="text-foreground" />
          </button>
        </div>
      </div>

      <div className="pb-24 overflow-y-auto">
        {/* Profile Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="px-4 pt-4"
        >
          <div className="bg-card rounded-2xl p-5 shadow-senai text-center">
            <div className="w-20 h-20 rounded-full gradient-senai flex items-center justify-center text-primary-foreground font-bold text-2xl mx-auto mb-3">
              LM
            </div>
            <h2 className="text-lg font-bold text-foreground">{student.name}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Matrícula: {student.matricula}</p>
            <div className="mt-2 inline-block">
              <span className="text-[10px] font-medium bg-primary/10 text-primary px-3 py-1 rounded-pill">
                {student.course} · {student.semester}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Desempenho */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="px-4 mt-4"
        >
          <div className="bg-card rounded-2xl p-5 shadow-senai">
            <h3 className="text-sm font-bold text-foreground mb-4">📊 Desempenho</h3>
            <div className="flex items-center justify-around">
              <div className="text-center">
                <ProgressRing progress={Math.round(student.ira * 10)} size={70} strokeWidth={5} />
                <p className="text-[10px] text-muted-foreground mt-1">IRA: {student.ira}</p>
              </div>
              <div className="text-center">
                <ProgressRing progress={student.completionPercent} size={70} strokeWidth={5} />
                <p className="text-[10px] text-muted-foreground mt-1">Conclusão</p>
              </div>
              <div className="text-center">
                <div className="w-[70px] h-[70px] rounded-full gradient-senai flex items-center justify-center text-primary-foreground">
                  <div>
                    <p className="text-lg font-bold">{student.level}</p>
                    <p className="text-[8px] opacity-80">Nível</p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{student.levelTitle}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Conquistas */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="px-4 mt-4"
        >
          <div className="bg-card rounded-2xl p-5 shadow-senai">
            <h3 className="text-sm font-bold text-foreground mb-3">🏅 Conquistas</h3>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
              {badges.map(badge => (
                <div
                  key={badge.name}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 ${!badge.earned ? "opacity-30 grayscale" : ""}`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-xl">
                    {badge.icon}
                  </div>
                  <span className="text-[9px] text-muted-foreground text-center w-14 leading-tight">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Arquivos Enviados */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="px-4 mt-4"
        >
          <div className="bg-card rounded-2xl p-5 shadow-senai">
            <h3 className="text-sm font-bold text-foreground mb-3">📁 Arquivos Enviados</h3>
            <div className="space-y-3">
              {submittedFiles.map(file => {
                const config = statusConfig[file.status];
                const Icon = config.icon;
                return (
                  <div key={file.name} className="flex items-center gap-3">
                    <FileText size={16} className="text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-[10px] text-muted-foreground">{file.subject} · {file.date}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-pill ${config.color}`}>
                      <Icon size={10} />
                      {config.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Relatórios */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="px-4 mt-4"
        >
          <div className="bg-card rounded-2xl p-5 shadow-senai">
            <h3 className="text-sm font-bold text-foreground mb-3">📋 Relatórios</h3>
            {reports.map(report => (
              <button
                key={report}
                onClick={() => handleReport(report)}
                className="tap-feedback w-full flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-2">
                  <Download size={14} className="text-primary" />
                  <span className="text-sm text-foreground">{report}</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Perfil;
