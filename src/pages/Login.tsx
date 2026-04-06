import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ArrowRight, BookOpen, Users, Trophy, Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const matriculaRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  // Auto-advance from splash
  useEffect(() => {
    const t = setTimeout(() => setPhase("onboarding"), 2000);
    return () => clearTimeout(t);
  }, []);

  // Autofocus matrícula field
  useEffect(() => {
    if (phase === "login") {
      setTimeout(() => matriculaRef.current?.focus(), 400);
    }
  }, [phase]);

  const handleNext = () => {
    if (slideIndex < onboardingSlides.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      setPhase("login");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!matricula.trim() || !password.trim()) {
      setError("Preencha todos os campos para continuar.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1200);
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
            className="flex-1 flex flex-col items-center justify-center px-6 py-8"
          >
            <div className="w-full max-w-md flex flex-col items-center flex-1 justify-center">
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

            <div className="flex gap-3 w-full max-w-md">
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex min-h-[100dvh]"
          >
            {/* Left branding panel — desktop only */}
            {!isMobile && (
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="hidden md:flex w-[45%] lg:w-[50%] gradient-senai flex-col items-center justify-center relative overflow-hidden"
              >
                {/* Decorative circles */}
                <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full bg-primary-foreground/5" />
                <div className="absolute bottom-[-120px] right-[-60px] w-[400px] h-[400px] rounded-full bg-primary-foreground/5" />
                <div className="absolute top-[40%] right-[10%] w-[150px] h-[150px] rounded-full bg-primary-foreground/5" />

                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.3 }}
                  className="relative z-10"
                >
                  <div className="w-20 h-20 rounded-3xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center mb-6">
                    <GraduationCap size={40} className="text-primary-foreground" />
                  </div>
                </motion.div>
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-3xl font-extrabold text-primary-foreground relative z-10"
                >
                  SENAI AVA
                </motion.h2>
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-primary-foreground/70 text-sm mt-2 relative z-10 max-w-[240px] text-center leading-relaxed"
                >
                  Ambiente Virtual de Aprendizagem — sua jornada acadêmica em um só lugar.
                </motion.p>

                {/* Feature pills */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.75 }}
                  className="flex flex-wrap gap-2 mt-8 relative z-10 justify-center max-w-[280px]"
                >
                  {["Aulas", "Atividades", "Conquistas", "Mensagens"].map((label) => (
                    <span
                      key={label}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-primary-foreground/15 text-primary-foreground/90 backdrop-blur-sm"
                    >
                      {label}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Right login form panel */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-background">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
                className="w-full max-w-[440px] mx-auto"
              >
                {/* Card container */}
                <div className="bg-card rounded-2xl border border-border shadow-lg p-6 sm:p-8 space-y-6">
                  {/* Logo */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center gap-4"
                  >
                    {/* Show logo on mobile since there's no left panel */}
                    {isMobile && (
                      <div className="w-14 h-14 rounded-2xl gradient-senai flex items-center justify-center shadow-senai-lg">
                        <GraduationCap size={28} className="text-primary-foreground" />
                      </div>
                    )}
                    <div className="text-center">
                      <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                        Bem-vindo de volta!
                      </h1>
                      <p className="text-sm text-muted-foreground mt-1">
                        Entre com sua matrícula para continuar
                      </p>
                    </div>
                  </motion.div>

                  {/* Form */}
                  <motion.form
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onSubmit={handleLogin}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Matrícula</label>
                      <Input
                        ref={matriculaRef}
                        placeholder="Ex: 2024SI0042"
                        value={matricula}
                        onChange={(e) => { setMatricula(e.target.value); setError(""); }}
                        className="h-12 rounded-xl bg-muted/50 border-border focus:border-primary transition-colors"
                        autoComplete="username"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Senha</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setError(""); }}
                          className="h-12 rounded-xl bg-muted/50 border-border pr-12 focus:border-primary transition-colors"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 tap-feedback text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="text-xs text-primary font-semibold tap-feedback hover:underline transition-all"
                      >
                        Esqueci minha senha
                      </button>
                    </div>

                    {/* Error message */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 text-center"
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 rounded-xl text-base font-semibold tap-feedback mt-2 transition-all"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        "Entrar"
                      )}
                    </Button>
                  </motion.form>
                </div>

                {/* Footer */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-xs text-muted-foreground mt-6"
                >
                  SENAI AVA · v1.0.0
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
