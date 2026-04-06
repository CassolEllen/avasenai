import { useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, Menu } from "lucide-react";
import { student } from "@/data/mockData";
import { useIsMobile } from "@/hooks/use-mobile";

const pageTitles: Record<string, string> = {
  "/": "Início",
  "/aulas": "Aulas",
  "/cursos": "Cursos",
  "/mensagens": "Mensagens",
  "/calendario": "Calendário",
  "/notificacoes": "Notificações",
  "/perfil": "Perfil",
  "/configuracoes": "Configurações",
};

interface TopHeaderProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

const TopHeader = ({ onMenuClick, sidebarCollapsed }: TopHeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const title = pageTitles[location.pathname] || "SENAI AVA";

  return (
    <header
      className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border h-16 flex items-center px-4 md:px-6 lg:px-8 gap-4"
    >
      {/* Mobile hamburger */}
      {isMobile && (
        <button onClick={onMenuClick} className="tap-feedback p-1.5 -ml-1 md:hidden">
          <Menu size={22} className="text-foreground" />
        </button>
      )}

      {/* Page title */}
      <h1 className="text-lg font-bold text-foreground whitespace-nowrap">{title}</h1>

      {/* Search bar - hidden on mobile */}
      <div className="hidden md:flex flex-1 max-w-md mx-auto">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Buscar..."
            className="w-full bg-muted rounded-xl py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Notifications */}
        <button
          onClick={() => navigate("/notificacoes")}
          className="tap-feedback relative p-2 rounded-xl hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Bell size={20} className="text-foreground" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center font-bold">
            3
          </span>
        </button>

        {/* Avatar */}
        <button
          onClick={() => navigate("/perfil")}
          className="tap-feedback hidden md:flex items-center gap-2 rounded-xl hover:bg-muted px-2 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-primary"
        >
          <div className="w-8 h-8 rounded-full gradient-senai flex items-center justify-center text-primary-foreground font-bold text-xs">
            EC
          </div>
          <span className="text-sm font-medium text-foreground">{student.firstName}</span>
        </button>
      </div>
    </header>
  );
};

export default TopHeader;
