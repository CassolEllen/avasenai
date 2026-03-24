import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Bell, Type, Lock, Globe, Info } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const Configuracoes = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    notas: true,
    mensagens: true,
    lembretes: true,
    eventos: false,
  });
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [hideGrades, setHideGrades] = useState(false);
  const [language, setLanguage] = useState("pt");

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <PageTransition>
      <div className="max-w-2xl space-y-4">
        {/* Theme */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-card rounded-2xl p-4 shadow-senai hover:shadow-senai-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-primary" />}
              <div>
                <p className="text-sm font-semibold text-foreground">Tema</p>
                <p className="text-[10px] text-muted-foreground">{darkMode ? "Escuro" : "Claro"}</p>
              </div>
            </div>
            <button onClick={toggleDark} className={`tap-feedback w-12 h-7 rounded-full transition-colors flex items-center px-1 ${darkMode ? "bg-primary" : "bg-muted"}`}>
              <motion.div className="w-5 h-5 rounded-full bg-card shadow-sm" animate={{ x: darkMode ? 18 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
            </button>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-4 shadow-senai">
          <div className="flex items-center gap-3 mb-3">
            <Bell size={18} className="text-primary" />
            <p className="text-sm font-semibold text-foreground">Notificações</p>
          </div>
          {Object.entries(notifications).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm text-foreground">
                {key === "notas" ? "Novas Notas" : key === "mensagens" ? "Mensagens" : key === "lembretes" ? "Lembretes de Aula" : "Eventos"}
              </span>
              <button
                onClick={() => setNotifications(p => ({ ...p, [key]: !val }))}
                className={`tap-feedback w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${val ? "bg-primary" : "bg-muted"}`}
              >
                <motion.div className="rounded-full bg-card shadow-sm" style={{ width: 18, height: 18 }} animate={{ x: val ? 16 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
              </button>
            </div>
          ))}
        </motion.div>

        {/* Font Size */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-4 shadow-senai">
          <div className="flex items-center gap-3 mb-3">
            <Type size={18} className="text-primary" />
            <p className="text-sm font-semibold text-foreground">Tamanho da fonte</p>
          </div>
          <div className="flex bg-muted rounded-xl p-1">
            {(["small", "medium", "large"] as const).map(s => (
              <button
                key={s}
                onClick={() => setFontSize(s)}
                className={`tap-feedback flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  fontSize === s ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {s === "small" ? "Pequeno" : s === "medium" ? "Médio" : "Grande"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Privacy */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl p-4 shadow-senai">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock size={18} className="text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">Ocultar notas</p>
                <p className="text-[10px] text-muted-foreground">Esconde suas notas de outros alunos</p>
              </div>
            </div>
            <button
              onClick={() => setHideGrades(!hideGrades)}
              className={`tap-feedback w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${hideGrades ? "bg-primary" : "bg-muted"}`}
            >
              <motion.div className="rounded-full bg-card shadow-sm" style={{ width: 18, height: 18 }} animate={{ x: hideGrades ? 16 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
            </button>
          </div>
        </motion.div>

        {/* Language */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-card rounded-2xl p-4 shadow-senai">
          <div className="flex items-center gap-3 mb-3">
            <Globe size={18} className="text-primary" />
            <p className="text-sm font-semibold text-foreground">Idioma</p>
          </div>
          <div className="flex bg-muted rounded-xl p-1">
            {([["pt", "Português"], ["en", "English"]] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setLanguage(key)}
                className={`tap-feedback flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  language === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Version */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-center pt-4">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
            <Info size={12} />
            <span className="text-[11px]">Versão 1.0.0 – SENAI AVA</span>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Configuracoes;
