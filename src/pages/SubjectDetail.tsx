import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import ProgressRing from "@/components/ProgressRing";
import { subjects, profSubject } from "@/data/mockData";

const SubjectDetail = () => {
  const { id } = useParams();
  const [tab, setTab] = useState<"geral" | "notas" | "arquivos">("geral");

  const allSubjects = [...subjects, profSubject];
  const subject = allSubjects.find(s => s.id === id);
  if (!subject) return <div className="p-8 text-center text-muted-foreground">Disciplina não encontrada</div>;

  const weightedAvg = subject.grades.reduce((sum, g) => sum + g.grade * g.weight, 0) / subject.grades.reduce((sum, g) => sum + g.weight, 0);

  return (
    <PageTransition direction="slide">
      <div className="max-w-2xl">
        {/* Hero */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="gradient-senai rounded-2xl p-6 text-center text-primary-foreground">
            <ProgressRing progress={subject.progress} size={100} strokeWidth={7} className="[&_circle:last-child]:stroke-white [&_span]:text-white" />
            <p className="text-sm font-bold mt-3">{subject.name}</p>
            <span className="inline-block text-xs bg-primary-foreground/20 px-3 py-1 rounded-pill mt-1.5">
              Prof. {subject.professor}
            </span>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="pt-4">
          <div className="flex bg-muted rounded-xl p-1">
            {([["geral", "Visão Geral"], ["notas", "Notas"], ["arquivos", "Arquivos"]] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key as typeof tab)}
                className={`tap-feedback flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  tab === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          {tab === "geral" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="bg-card rounded-2xl p-4 shadow-senai">
                <h4 className="text-xs font-bold text-muted-foreground mb-2">EMENTA</h4>
                <p className="text-sm text-foreground">{subject.ementa}</p>
              </div>
              <div className="bg-card rounded-2xl p-4 shadow-senai">
                <h4 className="text-xs font-bold text-muted-foreground mb-2">CARGA HORÁRIA</h4>
                <p className="text-sm text-foreground">{subject.cargaHoraria}</p>
              </div>
              <div className="bg-card rounded-2xl p-4 shadow-senai">
                <h4 className="text-xs font-bold text-muted-foreground mb-2">STATUS</h4>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    subject.status === "green" ? "bg-success" : subject.status === "yellow" ? "bg-warning" : "bg-destructive"
                  }`} />
                  <span className="text-sm text-foreground">
                    {subject.status === "green" ? "Em dia" : subject.status === "yellow" ? "Atenção" : "Crítico"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {tab === "notas" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {subject.grades.map((g, i) => (
                <div key={i} className="bg-card rounded-2xl p-4 shadow-senai flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{g.name}</p>
                    <p className="text-[10px] text-muted-foreground">Peso: {g.weight}%</p>
                  </div>
                  <span className={`text-lg font-bold ${g.grade >= 7 ? "text-success" : g.grade >= 5 ? "text-warning" : "text-destructive"}`}>
                    {g.grade.toFixed(1)}
                  </span>
                </div>
              ))}
              <div className="gradient-senai rounded-2xl p-4 text-primary-foreground flex items-center justify-between">
                <span className="text-sm font-bold">Média Ponderada</span>
                <span className="text-xl font-extrabold">{weightedAvg.toFixed(1)}</span>
              </div>
            </motion.div>
          )}

          {tab === "arquivos" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {subject.files.map((f, i) => (
                <div key={i} className="bg-card rounded-2xl p-4 shadow-senai flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{f.name}</p>
                    <p className="text-[10px] text-muted-foreground">{f.date}</p>
                  </div>
                  <button className="tap-feedback p-2 hover:bg-muted rounded-lg transition-colors">
                    <Download size={16} className="text-primary" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default SubjectDetail;
