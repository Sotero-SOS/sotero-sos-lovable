
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface User {
  name: string;
  email: string;
  role: string;
  avatar: string;
  phone?: string;
}

const Perfil = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "", 
    phone: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser({ ...parsedUser, phone: parsedUser.phone || "(71) 99999-9999" });
      setFormData({
        name: parsedUser.name,
        email: parsedUser.email,
        phone: parsedUser.phone || "(71) 99999-9999"
      });
    }
  }, []);

  const handleSave = () => {
    if (user) {
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditing(false);
      
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || ""
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
        <p className="text-gray-600">Gerencie suas informações pessoais e configurações</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2">
                {user.name}
                <Badge variant="secondary">{user.role}</Badge>
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                disabled={!isEditing}
                placeholder="(71) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de Acesso</Label>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {user.role}
                </Badge>
                <span className="text-sm text-gray-500">
                  (Este campo não pode ser alterado)
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            {!isEditing ? (
              <>
                <Button onClick={() => setIsEditing(true)} className="bg-sotero-blue hover:bg-sotero-blue-light">
                  Editar Perfil
                </Button>
                <Button variant="outline">
                  Alterar Senha
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleSave} className="bg-sotero-green hover:bg-sotero-green-light">
                  Salvar Alterações
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informações adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Sessão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Último acesso</span>
            <span className="text-sm text-gray-600">Hoje, 11:30</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Chamados criados</span>
            <span className="text-sm text-gray-600">12 este mês</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Status da conta</span>
            <Badge variant="default" className="bg-sotero-green">Ativa</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Perfil;
