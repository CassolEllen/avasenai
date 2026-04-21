import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, Users, Trophy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const onboardingSlides = [
  {
    icon: BookOpen,
    title: "Aprenda no seu ritmo",
    description:
      "Acesse aulas presenciais e online, materiais e atividades de qualquer lugar.",
  },
  {
    icon: Users,
    title: "Conecte-se com professores",
    description:
      "Mensagens diretas, avisos e feedback em tempo real para você nunca ficar perdido.",
  },
  {
    icon: Trophy,
    title: "Gamificação e conquistas",
    description:
      "Ganhe XP, suba de nível e desbloqueie conquistas enquanto aprende.",
  },
];

const Onboarding = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const { user, refreshProfile } = useAuth();

  const finish = async () => {
    if (!user || saving) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ has_seen_onboarding: true })
      .eq("id", user.id);
    if (error) {
      setSaving(false);
      toast.error("Não foi possível concluir o onboarding. Tente novamente.");
      return;
    }
    await refreshProfile();
    // saving stays true; AppRouter will swap to dashboard once profile updates.
  };

  const handleNext = () => {
    if (slideIndex < onboardingSlides.length - 1) setSlideIndex(slideIndex + 1);
    else finish();
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background relative overflow-hidden">
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
                backgroundColor:
                  i === slideIndex
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
            onClick={finish}
            disabled={saving}
          >
            Pular
          </Button>
          <Button
            className="flex-1 tap-feedback gap-2"
            onClick={handleNext}
            disabled={saving}
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                {slideIndex < onboardingSlides.length - 1 ? "Próximo" : "Começar"}
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
