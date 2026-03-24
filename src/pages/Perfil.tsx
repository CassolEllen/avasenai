import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, ChevronRight, FileText, Download, CheckCircle, AlertTriangle, Clock, Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PageTransition from "@/components/PageTransition";
import ProgressRing from "@/components/ProgressRing";
import BottomSheet from "@/components/BottomSheet";
import { student, badges, submittedFiles, Badge } from "@/data/mockData";
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

const earnedCount = badges.filter(b => b.earned).length;

const Perfil = () => {
  const navigate = useNavigate();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleReport = (name: string) => {
    toast.loading("Gerando relatório...", { id: name });
    setTimeout(() => {
      toast.success(`${name} baixado com sucesso! ✓`, { id: name });
    }, 2000);
  };

  const handleBadgeTap = (badge: Badge) => {
    setSelectedBadge(badge);
    if (badge.earned) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }
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

            {/* Progress Summary */}
            <div className="mb-4 bg-muted rounded-xl p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-foreground">
                  {earnedCount} de {badges.length} conquistas desbloqueadas
                </span>
                <span className="text-[10px] font-bold text-primary">
                  {Math.round((earnedCount / badges.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full gradient-senai"
                  initial={{ width: 0 }}
                  animate={{ width: `${(earnedCount / badges.length) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* 3-Column Badge Grid */}
            <div className="grid grid-cols-3 gap-3">
              {badges.map((badge, i) => (
                <motion.button
                  key={badge.name}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  onClick={() => handleBadgeTap(badge)}
                  className="tap-feedback flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-muted/50 relative"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl relative transition-all ${
                      badge.earned
                        ? "bg-primary/10 shadow-[0_0_16px_hsl(var(--primary)/0.3)]"
                        : "bg-muted grayscale"
                    }`}
                  >
                    {badge.icon}
                    {!badge.earned && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                        <Lock size={10} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] font-medium text-center leading-tight ${
                    badge.earned ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {badge.name}
                  </span>
                </motion.button>
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

      {/* Badge Detail Bottom Sheet */}
      <BottomSheet
        open={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
        title="Detalhes da Conquista"
      >
        {selectedBadge && (
          <div className="flex flex-col items-center text-center">
            {/* Confetti micro-animation */}
            <AnimatePresence>
              {showConfetti && selectedBadge.earned && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        backgroundColor: ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))'][i % 4],
                      }}
                      initial={{ y: 0, opacity: 1, scale: 1 }}
                      animate={{
                        y: [0, -120 - Math.random() * 80, 200],
                        x: (Math.random() - 0.5) * 120,
                        opacity: [1, 1, 0],
                        scale: [0, 1.2, 0.5],
                        rotate: Math.random() * 360,
                      }}
                      transition={{ duration: 1.2 + Math.random() * 0.5, ease: "easeOut" }}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Large Badge Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`w-20 h-20 rounded-3xl flex items-center justify-center text-5xl mb-4 ${
                selectedBadge.earned
                  ? "bg-primary/10 shadow-[0_0_24px_hsl(var(--primary)/0.35)]"
                  : "bg-muted grayscale"
              }`}
            >
              {selectedBadge.icon}
              {!selectedBadge.earned && (
                <div className="absolute">
                  <Lock size={20} className="text-muted-foreground/60" />
                </div>
              )}
            </motion.div>

            <h4 className="text-lg font-bold text-foreground mb-1">{selectedBadge.name}</h4>
            <p className="text-sm text-muted-foreground mb-4">{selectedBadge.description}</p>

            {selectedBadge.earned ? (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-success/10 text-success px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
              >
                <CheckCircle size={16} />
                Conquistado em {selectedBadge.dateEarned}
              </motion.div>
            ) : (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full"
              >
                <p className="text-xs text-muted-foreground mb-3">{selectedBadge.requirement}</p>
                {selectedBadge.progressCurrent != null && selectedBadge.progressTotal != null && (
                  <div className="bg-muted rounded-xl p-3">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[11px] font-medium text-foreground">Progresso</span>
                      <span className="text-[11px] font-bold text-primary">
                        {selectedBadge.progressCurrent} de {selectedBadge.progressTotal}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full gradient-senai"
                        initial={{ width: 0 }}
                        animate={{ width: `${(selectedBadge.progressCurrent / selectedBadge.progressTotal) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}
      </BottomSheet>
    </PageTransition>
  );
};

export default Perfil;
