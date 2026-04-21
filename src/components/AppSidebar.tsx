import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, BookOpen, GraduationCap, MessageSquare, Calendar,
  Bell, User, Settings, ChevronLeft, ChevronRight, Menu, X, LogOut, ClipboardList
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { getDisplayName, getInitials } from "@/lib/userDisplay";

const navItems = [
  { path: "/", label: "Início", icon: Home },
  { path: "/aulas", label: "Aulas", icon: BookOpen },
  { path: "/cursos", label: "Cursos", icon: GraduationCap },
  { path: "/atividades", label: "Atividades", icon: ClipboardList },
  { path: "/mensagens", label: "Mensagens", icon: MessageSquare },
  { path: "/calendario", label: "Calendário", icon: Calendar },
  { path: "/notificacoes", label: "Notificações", icon: Bell },
  { path: "/perfil", label: "Perfil", icon: User },
  { path: "/configuracoes", label: "Configurações", icon: Settings },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const AppSidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }: AppSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { profile, user } = useAuth();
  const displayName = getDisplayName(profile, user?.email);
  const initials = getInitials(profile, user?.email);
  const courseLabel = profile?.curso?.trim() || "Estudante";

  const handleNav = (path: string) => {
    navigate(path);
    if (isMobile) onMobileClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-border px-4 ${collapsed ? "justify-center" : "gap-3"}`}>
        <div className="w-9 h-9 rounded-xl gradient-senai flex items-center justify-center flex-shrink-0">
          <GraduationCap size={20} className="text-primary-foreground" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="text-base font-bold text-foreground whitespace-nowrap overflow-hidden"
          >
            SENAI AVA
          </motion.span>
        )}
        {isMobile && (
          <button onClick={onMobileClose} className="ml-auto tap-feedback p-1">
            <X size={20} className="text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`tap-feedback w-full flex items-center gap-3 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                collapsed ? "justify-center px-2 py-3" : "px-3 py-2.5"
              } ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-senai"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              title={collapsed ? item.label : undefined}
            >
              {isActive && !collapsed && (
                <div className="w-1 h-5 rounded-full bg-primary-foreground flex-shrink-0" />
              )}
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User section */}
      <div className={`border-t border-border p-3 ${collapsed ? "flex flex-col items-center gap-2" : ""}`}>
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-9 h-9 rounded-full gradient-senai flex items-center justify-center text-primary-foreground font-bold text-xs flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
              <p className="text-[10px] text-muted-foreground truncate">{courseLabel}</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-9 h-9 rounded-full gradient-senai flex items-center justify-center text-primary-foreground font-bold text-xs mb-2">
            {initials}
          </div>
        )}
        {!isMobile && (
          <button
            onClick={onToggle}
            className="tap-feedback w-full flex items-center justify-center gap-2 py-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span className="text-xs font-medium">Recolher</span>}
          </button>
        )}
      </div>
    </div>
  );

  // Mobile: drawer overlay
  if (isMobile) {
    return (
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50"
              onClick={onMobileClose}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] z-50"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop/Tablet: fixed sidebar
  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 bottom-0 z-40 hidden md:block"
    >
      {sidebarContent}
    </motion.aside>
  );
};

export default AppSidebar;
