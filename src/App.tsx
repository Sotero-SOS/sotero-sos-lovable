
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NovoSOS from "./pages/NovoSOS";
import Veiculos from "./pages/Veiculos";
import Perfil from "./pages/Perfil";
import CadastroUsuarios from "./pages/CadastroUsuarios";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente para rotas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sotero-blue to-sotero-blue-light">
        <div className="text-center">
          <div className="animate-spin rounded-full border-4 border-white border-t-transparent h-16 w-16 mx-auto mb-4"></div>
          <div className="text-white text-lg font-medium">Carregando aplicação...</div>
          <div className="text-white/80 text-sm mt-2">Verificando autenticação</div>
        </div>
      </div>
    );
  }
  
  return user ? <AppLayout>{children}</AppLayout> : <Navigate to="/" />;
};

// Componente para rota pública (login)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sotero-blue to-sotero-blue-light">
        <div className="text-center">
          <div className="animate-spin rounded-full border-4 border-white border-t-transparent h-16 w-16 mx-auto mb-4"></div>
          <div className="text-white text-lg font-medium">Carregando aplicação...</div>
          <div className="text-white/80 text-sm mt-2">Verificando autenticação</div>
        </div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
};

const AppContent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/novo-sos" 
          element={
            <ProtectedRoute>
              <NovoSOS />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/veiculos" 
          element={
            <ProtectedRoute>
              <Veiculos />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cadastro-usuarios" 
          element={
            <ProtectedRoute>
              <CadastroUsuarios />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/perfil" 
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
