import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Check } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import ScreenHeader from "@/components/ScreenHeader";
import { notifications as initialNotifications } from "@/data/mockData";

const groupLabels = { hoje: "Hoje", semana: "Esta semana", anteriores: "Anteriores" };

const typeColors = {
  grade: "bg-success/10 text-success",
  message: "bg-primary/10 text-primary",
  class: "bg-warning/10 text-warning",
  event: "bg-destructive/10 text-destructive",
};

const typeIcons = { grade: "📊", message: "💬", class: "📚", event: "📅" };

const Notificacoes = () => {
  const [items, setItems] = useState(initialNotifications);

  const markRead = (id: string) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const remove = (id: string) => {
    setItems(prev => prev.filter(n => n.id !== id));
  };

  const groups = (["hoje", "semana", "anteriores"] as const).map(g => ({
    label: groupLabels[g],
    items: items.filter(n => n.group === g),
  })).filter(g => g.items.length > 0);

  return (
    <PageTransition direction="slide">
      <ScreenHeader title="Notificações" showBack />

      <div className="px-4 pb-24 pt-2 overflow-y-auto">
        {groups.map(group => (
          <div key={group.label} className="mb-4">
            <p className="text-xs font-bold text-muted-foreground mb-2">{group.label}</p>
            <AnimatePresence>
              {group.items.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  layout
                  className={`bg-card rounded-2xl p-4 shadow-senai mb-2 flex items-start gap-3 ${n.read ? "opacity-60" : ""}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${typeColors[n.type]}`}>
                    {typeIcons[n.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.subtitle}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{n.timeAgo}</p>
                  </div>
                  <div className="flex gap-1">
                    {!n.read && (
                      <button onClick={() => markRead(n.id)} className="tap-feedback p-1.5 rounded-lg bg-muted">
                        <Check size={14} className="text-success" />
                      </button>
                    )}
                    <button onClick={() => remove(n.id)} className="tap-feedback p-1.5 rounded-lg bg-muted">
                      <Trash2 size={14} className="text-destructive" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </PageTransition>
  );
};

export default Notificacoes;
