import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import ScreenHeader from "@/components/ScreenHeader";
import ProgressRing from "@/components/ProgressRing";
import { CardSkeleton } from "@/components/Skeleton";
import { subjects, profSubject } from "@/data/mockData";

const Cursos = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"grad" | "prof">("grad");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const courseData = tab === "grad"
    ? { name: "Tecnologia em Sistemas de Informação", semester: "4º Semestre", subjects, progress: 69 }
    : { name: "UX Design Avançado", semester: "Profissionalizante", subjects: [profSubject], progress: 60 };

  return (
    <PageTransition>
      <ScreenHeader title="Cursos" />

      {/* Tabs */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex bg-muted rounded-xl p-1">
          {([["grad", "Graduação"], ["prof", "Profissionalizante"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key as "grad" | "prof")}
              className={`tap-feedback flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                tab === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-24 overflow-y-auto">
        {loading ? (
          <div className="space-y-3"><CardSkeleton /><CardSkeleton /></div>
        ) : (
          <>
            {/* Course Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-card rounded-2xl p-5 shadow-senai mb-4"
            >
              <div className="flex items-center gap-4">
                <ProgressRing progress={courseData.progress} size={64} strokeWidth={5} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{courseData.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{courseData.semester}</p>
                </div>
              </div>
            </motion.div>

            {/* Subject List */}
            <h3 className="text-sm font-bold text-foreground mb-3">Disciplinas</h3>
            <div className="space-y-3">
              {courseData.subjects.map((sub, i) => (
                <motion.div
                  key={sub.id}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => navigate(`/cursos/${tab === "grad" ? "graduacao" : "prof"}/${sub.id}`)}
                  className="tap-feedback bg-card rounded-2xl p-4 shadow-senai cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        sub.status === "green" ? "bg-success" : sub.status === "yellow" ? "bg-warning" : "bg-destructive"
                      }`} />
                      <p className="text-sm font-semibold text-foreground">{sub.name}</p>
                    </div>
                    <span className="text-xs font-bold text-primary">{sub.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${sub.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.3 + i * 0.1 }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5">Prof. {sub.professor}</p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default Cursos;
