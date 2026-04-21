import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ArrowRight, BookOpen, Users, Trophy, Eye, EyeOff, Loader2, MailCheck, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { isInstitutionalEmail, INVALID_DOMAIN_MESSAGE, ALLOWED_EMAIL_DOMAIN } from "@/lib/userDisplay";
import { translateAuthError } from "@/lib/authErrors";

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

const Login = () => {
  const [phase, setPhase] = useState<"splash" | "onboarding" | "login">("splash");
  // First access defaults to account creation; existing users can switch to sign-in.
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [slideIndex, setSlideIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [matricula, setMatricula] = useState("");
  const [curso, setCurso] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationSent, setConfirmationSent] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const { signIn, signUp, resendConfirmation } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => setPhase("onboarding"), 2000);
    return () => clearTimeout(t);
  }, []);

  // Detect email-confirmation redirect (?confirmed=1 or hash tokens) and surface a success message.
  useEffect(() => {
    const url = new URL(window.location.href);
    const hash = window.location.hash;
    const confirmed = url.searchParams.get("confirmed");
    if (confirmed === "1" || hash.includes("type=signup") || hash.includes("type=email")) {
      toast.success("E-mail confirmado com sucesso. Agora você pode entrar.");
      setMode("signin");
      setPhase("login");
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (phase === "login") setTimeout(() => emailRef.current?.focus(), 400);
  }, [phase]);

  const handleNext = () => {
    if (slideIndex < onboardingSlides.length - 1) setSlideIndex(slideIndex + 1);
    else setPhase("login");
  };

  const emailDomainInvalid = email.trim().length > 0 && !isInstitutionalEmail(email);

  const handleResend = async () => {
    if (!confirmationSent) return;
    setResending(true);
    const { error: err } = await resendConfirmation(confirmationSent);
    setResending(false);
    if (err) {
      toast.error("Não foi possível reenviar o e-mail de confirmação.");
      return;
    }
    toast.success("Reenviamos o link de confirmação para o seu e-mail.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Preencha e-mail e senha para continuar.");
      return;
    }
    if (!isInstitutionalEmail(email)) {
      setError(INVALID_DOMAIN_MESSAGE);
      return;
    }
    if (mode === "signup" && !name.trim()) {
      setError("Informe seu nome completo.");
      return;
    }
    if (mode === "signup" && password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres. Escolha uma senha mais segura.");
      return;
    }
    setIsLoading(true);
    if (mode === "signin") {
      const { error: err } = await signIn(email.trim(), password);
      setIsLoading(false);
      if (err) {
        setError(translateAuthError(err, "signin", () => {
          setConfirmationSent(email.trim());
        }));
        return;
      }
      toast.success("Bem-vindo!");
    } else {
      const { error: err, needsConfirmation } = await signUp(email.trim(), password, {
        name: name.trim(),
        matricula: matricula.trim(),
        curso: curso.trim(),
      });
      setIsLoading(false);
      if (err) {
        setError(translateAuthError(err, "signup"));
        return;
      }
      if (needsConfirmation) {
        setConfirmationSent(email.trim());
      } else {
        toast.success("Conta criada!");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background relative overflow-hidden">
      <AnimatePresence mode="wait">
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
              <Button variant="ghost" className="flex-1 tap-feedback" onClick={() => setPhase("login")}>
                Pular
              </Button>
              <Button className="flex-1 tap-feedback gap-2" onClick={handleNext}>
                {slideIndex < onboardingSlides.length - 1 ? "Próximo" : "Começar"}
                <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        )}

        {phase === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex min-h-[100dvh]"
          >
            {!isMobile && (
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="hidden md:flex w-[45%] lg:w-[50%] gradient-senai flex-col items-center justify-center relative overflow-hidden"
              >
                <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full bg-primary-foreground/5" />
                <div className="absolute bottom-[-120px] right-[-60px] w-[400px] h-[400px] rounded-full bg-primary-foreground/5" />
                <div className="absolute top-[40%] right-[10%] w-[150px] h-[150px] rounded-full bg-primary-foreground/5" />

                <div className="w-20 h-20 rounded-3xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center mb-6 relative z-10">
                  <GraduationCap size={40} className="text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-extrabold text-primary-foreground relative z-10">SENAI AVA</h2>
                <p className="text-primary-foreground/70 text-sm mt-2 relative z-10 max-w-[240px] text-center leading-relaxed">
                  Ambiente Virtual de Aprendizagem — sua jornada acadêmica em um só lugar.
                </p>
                <div className="flex flex-wrap gap-2 mt-8 relative z-10 justify-center max-w-[280px]">
                  {["Aulas", "Atividades", "Conquistas", "Mensagens"].map((label) => (
                    <span key={label} className="px-3 py-1 rounded-full text-xs font-medium bg-primary-foreground/15 text-primary-foreground/90 backdrop-blur-sm">
                      {label}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-background">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
                className="w-full max-w-[440px] mx-auto"
              >
                <div className="bg-card rounded-2xl border border-border shadow-lg p-6 sm:p-8 space-y-6">
                  {confirmationSent ? (
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <MailCheck size={28} className="text-primary" />
                      </div>
                      <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Confirme seu e-mail</h1>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          Enviamos um link de confirmação para{" "}
                          <span className="font-medium text-foreground">{confirmationSent}</span>.
                          Confirme seu e-mail para acessar o sistema.
                        </p>
                      </div>
                      <div className="w-full bg-muted/50 rounded-xl p-3 text-xs text-muted-foreground flex items-start gap-2 text-left">
                        <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                        <span>Verifique sua caixa de entrada e a pasta de spam. O link abre o app já autenticado.</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleResend}
                        disabled={resending}
                        className="w-full h-11 rounded-xl"
                      >
                        {resending ? (
                          <>
                            <Loader2 size={16} className="animate-spin mr-2" />
                            Reenviando...
                          </>
                        ) : (
                          "Reenviar e-mail de confirmação"
                        )}
                      </Button>
                      <button
                        type="button"
                        onClick={() => { setConfirmationSent(null); setMode("signin"); setError(""); }}
                        className="text-sm text-primary font-semibold hover:underline"
                      >
                        Voltar para o login
                      </button>
                    </div>
                  ) : (
                  <>
                  <div className="flex flex-col items-center gap-4">
                    {isMobile && (
                      <div className="w-14 h-14 rounded-2xl gradient-senai flex items-center justify-center shadow-senai-lg">
                        <GraduationCap size={28} className="text-primary-foreground" />
                      </div>
                    )}
                    <div className="text-center">
                      <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                        {mode === "signin" ? "Bem-vindo de volta!" : "Crie sua conta"}
                      </h1>
                      <p className="text-sm text-muted-foreground mt-1">
                        {mode === "signin"
                          ? "Entre com seu e-mail institucional"
                          : "Use seu e-mail @estudante.sesisenai.org.br"}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === "signup" && (
                      <>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-foreground">Nome completo</label>
                          <Input
                            placeholder="Seu nome"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setError(""); }}
                            className="h-12 rounded-xl bg-muted/50 border-border focus:border-primary"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Matrícula</label>
                            <Input
                              placeholder="2024SI0042"
                              value={matricula}
                              onChange={(e) => setMatricula(e.target.value)}
                              className="h-12 rounded-xl bg-muted/50 border-border focus:border-primary"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Curso</label>
                            <Input
                              placeholder="ADS"
                              value={curso}
                              onChange={(e) => setCurso(e.target.value)}
                              className="h-12 rounded-xl bg-muted/50 border-border focus:border-primary"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">E-mail institucional</label>
                      <Input
                        ref={emailRef}
                        type="email"
                        placeholder={`nome@${ALLOWED_EMAIL_DOMAIN}`}
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        className={`h-12 rounded-xl bg-muted/50 focus:border-primary ${
                          emailDomainInvalid ? "border-destructive" : "border-border"
                        }`}
                        autoComplete="email"
                        aria-invalid={emailDomainInvalid}
                      />
                      {emailDomainInvalid && (
                        <p className="text-xs text-destructive mt-1">{INVALID_DOMAIN_MESSAGE}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Senha</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setError(""); }}
                          className="h-12 rounded-xl bg-muted/50 border-border pr-12 focus:border-primary"
                          autoComplete={mode === "signin" ? "current-password" : "new-password"}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 tap-feedback text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

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
                      className="w-full h-12 rounded-xl text-base font-semibold tap-feedback mt-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin mr-2" />
                          {mode === "signin" ? "Entrando..." : "Criando conta..."}
                        </>
                      ) : mode === "signin" ? (
                        "Entrar"
                      ) : (
                        "Criar conta"
                      )}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                      {mode === "signup" ? (
                        <>
                          Já tem conta?{" "}
                          <button
                            type="button"
                            onClick={() => { setMode("signin"); setError(""); }}
                            className="text-primary font-semibold hover:underline"
                          >
                            Entrar
                          </button>
                        </>
                      ) : (
                        <>
                          Primeiro acesso?{" "}
                          <button
                            type="button"
                            onClick={() => { setMode("signup"); setError(""); }}
                            className="text-primary font-semibold hover:underline"
                          >
                            Criar conta
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                  </>
                  )}
                </div>

                <p className="text-center text-xs text-muted-foreground mt-6">SENAI AVA · v1.0.0</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
