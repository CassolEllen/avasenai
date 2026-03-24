import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, BookOpen, ClipboardList, TrendingUp, MapPin, Video, ChevronRight } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { student, quickStats, classes, subjects, messages } from "@/data/mockData";
import { CardSkeleton } from "@/components/Skeleton";
import ProgressRing from "@/components/ProgressRing";

const iconMap = { BookOpen, ClipboardList, TrendingUp };

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const upcomingClasses = classes.filter(c => c.status !== "concluida").slice(0, 3);
  const lastSubject = subjects[0];
  const recentMessages = messages.filter(m => m.unread);

  if (loading) {
    return (
      <PageTransition>
        <div className="px-4 pt-4 pb-24 space-y-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="pb-24 overflow-y-auto">
        {/* Header */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/perfil")} className="tap-feedback">
              <div className="w-11 h-11 rounded-full gradient-senai flex items-center justify-center text-primary-foreground font-bold text-sm">
                LM
              </div>
            </button>
            <div>
              <p className="text-sm text-muted-foreground">Bom dia 👋</p>
              <p className="text-lg font-bold text-foreground">{student.firstName}</p>
            </div>
          </div>
          <button onClick={() => navigate("/notificacoes")} className="tap-feedback relative p-2">
            <Bell size={22} className="text-foreground" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center font-bold">3</span>
          </button>
        </div>

        {/* Gamification Banner */}
        <div className="px-4 mt-2">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="gradient-senai rounded-2xl p-5 text-primary-foreground shadow-senai-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs opacity-80">Nível {student.level}</p>
                <p className="text-xl font-bold">{student.levelTitle} 🏅</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold">{student.xp}</p>
                <p className="text-xs opacity-80">XP</p>
              </div>
            </div>
            <div className="w-full bg-primary-foreground/20 rounded-full h-2.5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary-foreground"
                initial={{ width: 0 }}
                animate={{ width: `${(student.xp / student.xpNext) * 100}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              />
            </div>
            <p className="text-xs opacity-80 mt-1.5">{student.xpNext - student.xp} XP para o próximo nível</p>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="px-4 mt-4 grid grid-cols-3 gap-3">
          {quickStats.map((stat, i) => {
            const Icon = iconMap[stat.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-card rounded-2xl p-3 shadow-senai text-center"
              >
                <Icon size={20} className="text-primary mx-auto mb-1" />
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Próximas Aulas */}
        <div className="mt-5">
          <div className="px-4 flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground">Próximas Aulas</h2>
            <button onClick={() => navigate("/aulas")} className="tap-feedback text-xs text-primary font-semibold">Ver todas</button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 hide-scrollbar">
            {upcomingClasses.map((cls, i) => (
              <motion.div
                key={cls.id}
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="tap-feedback min-w-[200px] bg-card rounded-2xl p-4 shadow-senai flex-shrink-0"
              >
                <p className="text-sm font-bold text-foreground mb-1">{cls.subject}</p>
                <p className="text-xs text-muted-foreground mb-2">{cls.day} · {cls.time}</p>
                <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-pill ${cls.type === "presencial" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"}`}>
                  {cls.type === "presencial" ? <MapPin size={10} /> : <Video size={10} />}
                  {cls.type === "presencial" ? "Presencial" : "Online"}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Continue de onde parou */}
        <div className="px-4 mt-5">
          <h2 className="text-base font-bold text-foreground mb-3">Continue de onde parou</h2>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="tap-feedback bg-card rounded-2xl p-4 shadow-senai flex items-center gap-4"
            onClick={() => navigate(`/cursos/graduacao/ed`)}
          >
            <ProgressRing progress={lastSubject.progress} size={56} strokeWidth={5} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">{lastSubject.name}</p>
              <p className="text-xs text-muted-foreground">Prof. {lastSubject.professor}</p>
            </div>
            <button className="tap-feedback bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-xl">
              Continuar
            </button>
          </motion.div>
        </div>

        {/* Avisos Recentes */}
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground">Avisos Recentes</h2>
            <button onClick={() => navigate("/mensagens")} className="tap-feedback text-xs text-primary font-semibold">Ver todos</button>
          </div>
          {recentMessages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              onClick={() => navigate(`/mensagens/${msg.id}`)}
              className="tap-feedback bg-card rounded-2xl p-4 shadow-senai mb-3 flex items-start gap-3 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                {msg.professor.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{msg.professor}</p>
                  <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{msg.preview}</p>
              </div>
              {msg.unread && <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
