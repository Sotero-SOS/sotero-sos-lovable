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
  const {
    toast
  } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock de usuários baseado no email
    let user;
    if (email.includes("admin")) {
      user = {
        name: "João Santos",
        email: email,
        role: "Administrador",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      };
    } else if (email.includes("trafego")) {
      user = {
        name: "Maria Silva",
        email: email,
        role: "Tráfego",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c1e9?w=150&h=150&fit=crop&crop=face"
      };
    } else {
      user = {
        name: "Carlos Oliveira",
        email: email,
        role: "Mecânico",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      };
    }
    localStorage.setItem("user", JSON.stringify(user));
    toast({
      title: "Login realizado!",
      description: `Bem-vindo, ${user.name}!`
    });
    navigate("/dashboard");
    setIsLoading(false);
  };
  return <div className="min-h-screen bg-gradient-to-br from-sotero-blue to-sotero-blue-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/lovable-uploads/b7e8b7f6-44a9-4caf-82c7-87c7325cddb2.png" alt="Sotero Ambiental" className="h-24 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white">Sistema SOS</h1>
          <p className="text-sotero-blue-light mt-2 text-slate-50">Gestão de Manutenção de Veículos</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acesso ao Sistema</CardTitle>
            <CardDescription>
              Digite suas credenciais para entrar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="seu.email@soteroambiental.com.br" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="Digite sua senha" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>

              <Button type="submit" className="w-full bg-sotero-green hover:bg-sotero-green-light" disabled={isLoading}>
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

        <div className="mt-8 text-center text-white text-sm">
          <p>Dica para teste:</p>
          <p>• admin@teste.com (Administrador)</p>
          <p>• trafego@teste.com (Tráfego)</p>
          <p>• mecanico@teste.com (Mecânico)</p>
        </div>
      </div>
    </div>;
};
export default Login;