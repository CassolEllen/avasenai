import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import ProgressRing from "@/components/ProgressRing";
import { CardSkeleton } from "@/components/Skeleton";
import { subjects, profSubject, Subject } from "@/data/mockData";
import { useIsMobile } from "@/hooks/use-mobile";
import SubjectDetail from "@/pages/SubjectDetail";

const Cursos = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"grad" | "prof">("grad");
  const [expandedCourse, setExpandedCourse] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const courseData = tab === "grad"
    ? { name: "Tecnologia em Sistemas de Informação", semester: "4º Semestre", subjects, progress: 69 }
    : { name: "UX Design Avançado", semester: "Profissionalizante", subjects: [profSubject], progress: 60 };

  const handleSubjectClick = (sub: Subject) => {
    if (isMobile) {
      navigate(`/cursos/${tab === "grad" ? "graduacao" : "prof"}/${sub.id}`);
    } else {
      setSelectedSubject(sub);
    }
  };

  return (
    <PageTransition>
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          {/* Tabs */}
          <div className="mb-4 max-w-sm">
            <div className="flex bg-muted rounded-xl p-1">
              {([["grad", "Graduação"], ["prof", "Profissionalizante"]] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => { setTab(key as "grad" | "prof"); setSelectedSubject(null); }}
                  className={`tap-feedback flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    tab === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-3"><CardSkeleton /><CardSkeleton /></div>
          ) : (
            <>
              {/* Course Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-card rounded-2xl p-5 shadow-senai mb-4 cursor-pointer hover:shadow-senai-lg transition-shadow"
                onClick={() => !isMobile && setExpandedCourse(!expandedCourse)}
              >
                <div className="flex items-center gap-4">
                  <ProgressRing progress={courseData.progress} size={64} strokeWidth={5} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{courseData.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{courseData.semester}</p>
                  </div>
                  {!isMobile && (
                    <motion.div animate={{ rotate: expandedCourse ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={20} className="text-muted-foreground" />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Subject List - always visible on mobile, collapsible on desktop */}
              <AnimatePresence>
                {(isMobile || expandedCourse) && (
                  <motion.div
                    initial={!isMobile ? { height: 0, opacity: 0 } : undefined}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={!isMobile ? { height: 0, opacity: 0 } : undefined}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <h3 className="text-sm font-bold text-foreground mb-3">Disciplinas</h3>
                    <div className={`${isMobile ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"}`}>
                      {courseData.subjects.map((sub, i) => (
                        <motion.div
                          key={sub.id}
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: i * 0.08 }}
                          onClick={() => handleSubjectClick(sub)}
                          className={`tap-feedback bg-card rounded-2xl p-4 shadow-senai cursor-pointer hover:shadow-senai-lg transition-shadow ${
                            !isMobile && selectedSubject?.id === sub.id ? "ring-2 ring-primary" : ""
                          }`}
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
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* Desktop: right drawer for subject detail */}
        {!isMobile && (
          <AnimatePresence>
            {selectedSubject && (
              <motion.div
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 40, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-[400px] lg:w-[480px] flex-shrink-0 bg-card rounded-2xl shadow-senai p-6 sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground">{selectedSubject.name}</h3>
                  <button onClick={() => setSelectedSubject(null)} className="tap-feedback p-1 rounded-lg hover:bg-muted">
                    <X size={18} className="text-muted-foreground" />
                  </button>
                </div>
                <InlineSubjectDetail subject={selectedSubject} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </PageTransition>
  );
};

// Inline subject detail for desktop drawer
const InlineSubjectDetail = ({ subject }: { subject: Subject }) => {
  const [tab, setTab] = useState<"geral" | "notas" | "arquivos">("geral");
  const weightedAvg = subject.grades.reduce((sum, g) => sum + g.grade * g.weight, 0) / subject.grades.reduce((sum, g) => sum + g.weight, 0);

  return (
    <>
      <div className="text-center mb-4">
        <ProgressRing progress={subject.progress} size={80} strokeWidth={6} />
        <p className="text-xs text-muted-foreground mt-2">Prof. {subject.professor}</p>
      </div>

      <div className="flex bg-muted rounded-xl p-1 mb-4">
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

      {tab === "geral" && (
        <div className="space-y-3">
          <div className="bg-muted/50 rounded-xl p-3">
            <h4 className="text-xs font-bold text-muted-foreground mb-1">EMENTA</h4>
            <p className="text-sm text-foreground">{subject.ementa}</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-3">
            <h4 className="text-xs font-bold text-muted-foreground mb-1">CARGA HORÁRIA</h4>
            <p className="text-sm text-foreground">{subject.cargaHoraria}</p>
          </div>
        </div>
      )}

      {tab === "notas" && (
        <div className="space-y-2">
          {subject.grades.map((g, i) => (
            <div key={i} className="bg-muted/50 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{g.name}</p>
                <p className="text-[10px] text-muted-foreground">Peso: {g.weight}%</p>
              </div>
              <span className={`text-lg font-bold ${g.grade >= 7 ? "text-success" : g.grade >= 5 ? "text-warning" : "text-destructive"}`}>
                {g.grade.toFixed(1)}
              </span>
            </div>
          ))}
          <div className="gradient-senai rounded-xl p-3 text-primary-foreground flex items-center justify-between">
            <span className="text-sm font-bold">Média Ponderada</span>
            <span className="text-xl font-extrabold">{weightedAvg.toFixed(1)}</span>
          </div>
        </div>
      )}

      {tab === "arquivos" && (
        <div className="space-y-2">
          {subject.files.map((f, i) => (
            <div key={i} className="bg-muted/50 rounded-xl p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{f.name}</p>
                <p className="text-[10px] text-muted-foreground">{f.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Cursos;
