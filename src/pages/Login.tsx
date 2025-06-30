
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      // Salvar dados do usuário no localStorage para simulação
      const userData = {
        name: email.includes("admin") ? "Administrador" : "José da Silva",
        email: email,
        role: email.includes("admin") ? "Administrador" : "Operador",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      };
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${userData.name}`,
      });
      
      navigate("/dashboard");
    } else {
      toast({
        title: "Erro no login",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sotero-blue to-sotero-blue-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/b7e8b7f6-44a9-4caf-82c7-87c7325cddb2.png" 
            alt="Sotero Ambiental" 
            className="h-20 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white mb-2">Sistema SOS</h1>
          <p className="text-blue-100">Gestão de Veículos em Tempo Real</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Entrar no Sistema</CardTitle>
            <CardDescription className="text-center">
              Digite suas credenciais para acessar o painel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail ou Usuário</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@sotero.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-sotero-blue hover:bg-sotero-blue-light"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
              
              <div className="text-center">
                <a href="#" className="text-sm text-sotero-blue hover:underline">
                  Esqueci minha senha
                </a>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-blue-100 text-sm">
          <p>Dica: Use "admin@sotero.com" para acesso de administrador</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
