import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import AppShell from "@/components/AppShell";
import AppSidebar from "@/components/AppSidebar";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import Dashboard from "@/pages/Dashboard";
import Aulas from "@/pages/Aulas";
import Cursos from "@/pages/Cursos";
import Mensagens from "@/pages/Mensagens";
import Perfil from "@/pages/Perfil";
import SubjectDetail from "@/pages/SubjectDetail";
import MessageDetail from "@/pages/MessageDetail";
import Notificacoes from "@/pages/Notificacoes";
import Calendario from "@/pages/Calendario";
import Configuracoes from "@/pages/Configuracoes";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import { useIsMobile } from "@/hooks/use-mobile";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/aulas" element={<Aulas />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/cursos/:type/:id" element={<SubjectDetail />} />
        <Route path="/mensagens" element={<Mensagens />} />
        <Route path="/mensagens/:id" element={<MessageDetail />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/notificacoes" element={<Notificacoes />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppLayout = () => {
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 72 : 260;

  return (
    <>
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <AppShell sidebarWidth={sidebarWidth}>
        <TopHeader
          onMenuClick={() => setMobileMenuOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="px-4 md:px-6 lg:px-8 xl:px-10 py-4 md:py-6 pb-24 md:pb-8">
          <AnimatedRoutes />
        </main>
      </AppShell>
      {/* Mobile bottom nav */}
      {isMobile && <BottomNav />}
    </>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("senai-logged-in") === "true";
  });

  const handleLogin = () => {
    sessionStorage.setItem("senai-logged-in", "true");
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Sonner />
          <div className="mx-auto flex min-h-screen max-w-[430px] md:max-w-none flex-col bg-background">
            <Login onLogin={handleLogin} />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner position="top-right" />
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
