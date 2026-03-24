import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ClipboardList, TrendingUp, MapPin, Video, ChevronRight, Clock } from "lucide-react";
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
        <div className="space-y-4">
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
      <div className="space-y-6">
        {/* Gamification Banner - full width */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="gradient-senai rounded-2xl p-5 md:p-8 text-primary-foreground shadow-senai-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs md:text-sm opacity-80">Bom dia 👋 · Nível {student.level}</p>
              <p className="text-xl md:text-2xl font-bold">{student.firstName} – {student.levelTitle} 🏅</p>
            </div>
            <div className="text-right">
              <p className="text-2xl md:text-3xl font-extrabold">{student.xp}</p>
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

        {/* Quick Stats - 3 cols on mobile, 4 on desktop with extra stat */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {quickStats.map((stat, i) => {
            const Icon = iconMap[stat.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-card rounded-2xl p-3 md:p-4 shadow-senai text-center hover:shadow-senai-lg transition-shadow cursor-default"
              >
                <Icon size={20} className="text-primary mx-auto mb-1" />
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground leading-tight">{stat.label}</p>
              </motion.div>
            );
          })}
          {/* Extra stat for desktop */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="hidden md:block bg-card rounded-2xl p-4 shadow-senai text-center hover:shadow-senai-lg transition-shadow cursor-default"
          >
            <Clock size={20} className="text-primary mx-auto mb-1" />
            <p className="text-xl font-bold text-foreground">Seg 08h</p>
            <p className="text-xs text-muted-foreground leading-tight">Próxima Aula</p>
          </motion.div>
        </div>

        {/* Main grid: 2 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column (wider) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Próximas Aulas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-foreground">Próximas Aulas</h2>
                <button onClick={() => navigate("/aulas")} className="tap-feedback text-xs text-primary font-semibold hover:underline">Ver todas</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {upcomingClasses.map((cls, i) => (
                  <motion.div
                    key={cls.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="tap-feedback bg-card rounded-2xl p-4 shadow-senai hover:shadow-senai-lg transition-shadow cursor-pointer"
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
            <div>
              <h2 className="text-base font-bold text-foreground mb-3">Continue de onde parou</h2>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="tap-feedback bg-card rounded-2xl p-4 shadow-senai flex items-center gap-4 hover:shadow-senai-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/cursos/graduacao/ed`)}
              >
                <ProgressRing progress={lastSubject.progress} size={56} strokeWidth={5} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{lastSubject.name}</p>
                  <p className="text-xs text-muted-foreground">Prof. {lastSubject.professor}</p>
                </div>
                <button className="tap-feedback bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
                  Continuar
                </button>
              </motion.div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Avisos Recentes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-foreground">Avisos Recentes</h2>
                <button onClick={() => navigate("/mensagens")} className="tap-feedback text-xs text-primary font-semibold hover:underline">Ver todos</button>
              </div>
              {recentMessages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  onClick={() => navigate(`/mensagens/${msg.id}`)}
                  className="tap-feedback bg-card rounded-2xl p-4 shadow-senai mb-3 flex items-start gap-3 cursor-pointer hover:shadow-senai-lg transition-shadow"
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

            {/* Mini calendar widget */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-foreground">Calendário</h2>
                <button onClick={() => navigate("/calendario")} className="tap-feedback text-xs text-primary font-semibold hover:underline">Ver completo</button>
              </div>
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-card rounded-2xl p-4 shadow-senai"
              >
                <p className="text-sm font-semibold text-foreground mb-2">Próximos eventos</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-8 rounded-full bg-destructive" />
                    <div>
                      <p className="text-xs font-medium text-foreground">Prova 2 – Banco de Dados</p>
                      <p className="text-[10px] text-muted-foreground">28/03 · 10:00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-8 rounded-full bg-warning" />
                    <div>
                      <p className="text-xs font-medium text-foreground">Entrega Eng. Software</p>
                      <p className="text-[10px] text-muted-foreground">29/03 · 23:59</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
