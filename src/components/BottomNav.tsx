import { Home, BookOpen, GraduationCap, MessageSquare, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const tabs = [
  { path: "/", label: "Início", icon: Home },
  { path: "/aulas", label: "Aulas", icon: BookOpen },
  { path: "/cursos", label: "Cursos", icon: GraduationCap },
  { path: "/mensagens", label: "Mensagens", icon: MessageSquare },
  { path: "/perfil", label: "Perfil", icon: User },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on sub-pages
  const mainPaths = tabs.map(t => t.path);
  const isMainPage = mainPaths.includes(location.pathname);
  if (!isMainPage) return null;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-2 pb-[env(safe-area-inset-bottom,8px)]">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="tap-feedback flex flex-col items-center gap-0.5 px-3 py-1 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-2 inset-x-0 mx-auto w-12 h-1 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Icon
                size={22}
                className={isActive ? "text-primary" : "text-muted-foreground"}
                fill={isActive ? "currentColor" : "none"}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
