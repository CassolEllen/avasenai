import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

/**
 * Email confirmation success page.
 * Receives the user after they click the confirmation link in their email.
 * Signs them out (so they explicitly log in) and shows a success message.
 */
const EmailConfirmado = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase places tokens in the URL hash on confirmation. We sign out
    // immediately so the user lands on the login screen instead of being
    // auto-authenticated, and we clean the URL.
    const finalize = async () => {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
      // Strip hash/query from the URL for a clean address bar.
      window.history.replaceState({}, "", "/email-confirmado");
      setReady(true);
    };
    finalize();
  }, []);

  const goToLogin = () => {
    window.location.replace("/");
  };

  if (!ready) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="w-full max-w-[460px]"
        >
          <div className="bg-card rounded-2xl border border-border shadow-lg p-8 sm:p-10 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-2xl gradient-senai flex items-center justify-center shadow-senai-lg">
              <GraduationCap size={32} className="text-primary-foreground" />
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
              className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <CheckCircle2 size={44} className="text-primary" strokeWidth={2.2} />
            </motion.div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                E-mail confirmado com sucesso
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Agora você já pode acessar o AVA com seu e-mail institucional e senha.
              </p>
            </div>

            <Button
              onClick={goToLogin}
              className="w-full h-12 rounded-xl tap-feedback gap-2 text-base"
            >
              Ir para o login
              <ArrowRight size={18} />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailConfirmado;
