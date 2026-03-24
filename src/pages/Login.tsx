import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ArrowRight, BookOpen, Users, Trophy, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const onboardingSlides = [
  {
    icon: BookOpen,
    title: "Aprenda no seu ritmo",
    description: "Acesse aulas presenciais e online, materiais e atividades de qualquer lugar.",
  },
  {
    icon: Users,
    title: "Conecte-se com professores",
    description: "Mensagens diretas, avisos e feedback em tempo real para você nunca ficar perdido.",
  },
  {
    icon: Trophy,
    title: "Gamificação e conquistas",
    description: "Ganhe XP, suba de nível e desbloqueie conquistas enquanto aprende.",
  },
];

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [phase, setPhase] = useState<"splash" | "onboarding" | "login">("splash");
  const [slideIndex, setSlideIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");

  // Auto-advance from splash
  useState(() => {
    const t = setTimeout(() => setPhase("onboarding"), 2000);
    return () => clearTimeout(t);
  });

  const handleNext = () => {
    if (slideIndex < onboardingSlides.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      setPhase("login");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background relative overflow-hidden">
      <AnimatePresence mode="wait">
        {/* SPLASH */}
        {phase === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col items-center justify-center gradient-senai"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <div className="w-24 h-24 rounded-3xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                <GraduationCap size={48} className="text-primary-foreground" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-3xl font-extrabold text-primary-foreground mt-6"
            >
              SENAI AVA
            </motion.h1>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-primary-foreground/70 text-sm mt-1"
            >
              Ambiente Virtual de Aprendizagem
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-10"
            >
              <div className="w-8 h-8 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
            </motion.div>
          </motion.div>
        )}

        {/* ONBOARDING */}
        {phase === "onboarding" && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col px-6 pt-16 pb-8"
          >
            <div className="flex-1 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slideIndex}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="flex flex-col items-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center mb-8"
                  >
                    {(() => {
                      const Icon = onboardingSlides[slideIndex].icon;
                      return <Icon size={48} className="text-primary" />;
                    })()}
                  </motion.div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    {onboardingSlides[slideIndex].title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px]">
                    {onboardingSlides[slideIndex].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {onboardingSlides.map((_, i) => (
                <motion.div
                  key={i}
                  className="h-2 rounded-full"
                  animate={{
                    width: i === slideIndex ? 24 : 8,
                    backgroundColor: i === slideIndex
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted-foreground) / 0.3)",
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1 tap-feedback"
                onClick={() => setPhase("login")}
              >
                Pular
              </Button>
              <Button
                className="flex-1 tap-feedback gap-2"
                onClick={handleNext}
              >
                {slideIndex < onboardingSlides.length - 1 ? "Próximo" : "Começar"}
                <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        )}

        {/* LOGIN */}
        {phase === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex-1 flex flex-col px-6 pt-16 pb-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center mb-8"
            >
              <div className="w-16 h-16 rounded-2xl gradient-senai flex items-center justify-center shadow-senai-lg">
                <GraduationCap size={32} className="text-primary-foreground" />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-2xl font-bold text-foreground">Bem-vindo de volta!</h1>
              <p className="text-sm text-muted-foreground mt-1">Entre com sua matrícula para continuar</p>
            </motion.div>

            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleLogin}
              className="space-y-4 flex-1"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Matrícula</label>
                <Input
                  placeholder="Ex: 2024SI0042"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  className="h-12 rounded-xl bg-muted/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Senha</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl bg-muted/50 border-border pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 tap-feedback text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="button" className="text-xs text-primary font-semibold tap-feedback">
                Esqueci minha senha
              </button>

              <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold tap-feedback mt-4">
                Entrar
              </Button>
            </motion.form>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-xs text-muted-foreground mt-6"
            >
              SENAI AVA · v1.0.0
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
