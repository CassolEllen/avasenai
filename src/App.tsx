import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import AppShell from "@/components/AppShell";
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
          <AppShell>
            <Login onLogin={handleLogin} />
          </AppShell>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <AppShell>
            <AnimatedRoutes />
            <BottomNav />
          </AppShell>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
