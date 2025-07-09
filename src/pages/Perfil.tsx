
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Camera, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Perfil = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [formData, setFormData] = useState({
    full_name: user?.profile?.full_name || "",
    email: user?.profile?.email || user?.email || "", 
    phone: user?.profile?.phone || ""
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!user?.profile) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone || null
        })
        .eq('id', user.id);

      if (error) throw error;

      setIsEditing(false);
      
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.profile?.full_name || "",
      email: user?.profile?.email || user?.email || "",
      phone: user?.profile?.phone || ""
    });
    setIsEditing(false);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.profile) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        
        const { error } = await supabase
          .from('profiles')
          .update({ avatar_url: result })
          .eq('id', user.id);

        if (error) throw error;

        toast({
          title: "Foto atualizada!",
          description: "Sua foto de perfil foi alterada com sucesso.",
        });
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar foto",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erro!",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Erro!",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: "Senha alterada!",
        description: "Sua senha foi alterada com sucesso.",
      });

      setShowPasswordDialog(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      toast({
        title: "Erro ao alterar senha",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  if (!user?.profile) {
    return <div>Carregando perfil...</div>;
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin": return "Administrador";
      case "trafego": return "Tráfego";
      case "mecanico": return "Mecânico";
      default: return role;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
        <p className="text-gray-600">Gerencie suas informações pessoais e configurações</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20 cursor-pointer hover:opacity-80 transition-opacity" onClick={handlePhotoClick}>
                <AvatarImage src={user.profile.avatar_url || ''} alt={user.profile.full_name} />
                <AvatarFallback className="text-lg">
                  {user.profile.full_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-sotero-blue text-white rounded-full p-1 cursor-pointer hover:bg-sotero-blue-light transition-colors" onClick={handlePhotoClick}>
                <Camera className="h-3 w-3" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {user.profile.full_name}
                <Badge variant="secondary">{getRoleDisplayName(user.profile.role)}</Badge>
              </CardTitle>
              <CardDescription>{user.profile.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled={true}
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
                  {getRoleDisplayName(user.profile.role)}
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
                <Button 
                  variant="outline" 
                  onClick={() => setShowPasswordDialog(true)}
                  className="flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
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

      {/* Dialog para alterar senha */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
            <DialogDescription>
              Para sua segurança, confirme sua senha atual e defina uma nova senha.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePasswordChange} className="bg-sotero-blue hover:bg-sotero-blue-light">
              Alterar Senha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Perfil;
