
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se o usuário já está logado
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sotero-blue to-sotero-blue-light">
      <div className="text-center text-white">
        <img 
          src="/lovable-uploads/b7e8b7f6-44a9-4caf-82c7-87c7325cddb2.png" 
          alt="Sotero Ambiental" 
          className="h-20 mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">Sistema SOS</h1>
        <p className="text-blue-100">Carregando...</p>
      </div>
    </div>
  );
};

export default Index;
