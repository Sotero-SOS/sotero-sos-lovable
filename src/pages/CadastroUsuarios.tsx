
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Edit, Trash2 } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<'profiles'>;

const CadastroUsuarios = () => {
  const { users, isLoading, error, createUser, updateUser, deleteUser } = useUsers();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "" as "admin" | "trafego" | "mecanico" | "",
    password: ""
  });
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email || !formData.phone || !formData.role || !formData.password) {
      toast({
        title: "Erro!",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Por enquanto, vamos apenas criar o perfil diretamente
      // Em produção, isso deve ser feito via função admin do Supabase
      const { data, error } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
        user_metadata: {
          full_name: formData.full_name,
          phone: formData.phone
        }
      });

      if (error) {
        // Se não temos permissão de admin, criar apenas o perfil
        if (error.message.includes('admin')) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: crypto.randomUUID(),
              full_name: formData.full_name,
              email: formData.email,
              phone: formData.phone || null,
              role: formData.role
            });

          if (profileError) throw profileError;
        } else {
          throw error;
        }
      }

      setFormData({ full_name: "", email: "", phone: "", role: "", password: "" });
      setIsFormVisible(false);

      toast({
        title: "Usuário cadastrado!",
        description: `${formData.full_name} foi adicionado ao sistema.`,
      });
    } catch (error: any) {
      console.error("Erro ao cadastrar usuário:", error);
      toast({
        title: "Erro ao cadastrar usuário",
        description: error?.message?.includes('duplicate') 
          ? "Este email já está cadastrado no sistema."
          : "Não foi possível cadastrar o usuário. Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (user: Profile) => {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      password: ""
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUser || !formData.full_name || !formData.email || !formData.role) {
      toast({
        title: "Erro!",
        description: "Todos os campos obrigatórios devem ser preenchidos.",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateUser.mutateAsync({
        id: editingUser.id,
        updates: {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone || null,
          role: formData.role
        }
      });

      setIsEditDialogOpen(false);
      setEditingUser(null);
      setFormData({ full_name: "", email: "", phone: "", role: "", password: "" });

      toast({
        title: "Usuário atualizado!",
        description: `${formData.full_name} foi atualizado com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar usuário",
        description: "Não foi possível atualizar o usuário. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Tem certeza que deseja remover ${userName}?`)) return;

    try {
      await deleteUser.mutateAsync(userId);
      toast({
        title: "Usuário removido",
        description: `${userName} foi removido do sistema.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao remover usuário",
        description: "Não foi possível remover o usuário. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "default";
      case "trafego": return "secondary";
      case "mecanico": return "outline";
      default: return "secondary";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin": return "Administrador";
      case "trafego": return "Tráfego";
      case "mecanico": return "Mecânico";
      default: return role;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-lg">Carregando usuários...</span>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        title="Erro ao carregar usuários"
        message="Não foi possível carregar a lista de usuários. Verifique sua conexão e tente novamente."
        className="m-6"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cadastro de Usuários</h1>
          <p className="text-gray-600">Gerencie os usuários do sistema</p>
        </div>
        <Button 
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="bg-sotero-blue hover:bg-sotero-blue-light flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Formulário de cadastro */}
      {isFormVisible && (
        <Card>
          <CardHeader>
            <CardTitle>Cadastrar Novo Usuário</CardTitle>
            <CardDescription>
              Preencha as informações do novo usuário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@soteroambiental.com.br"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(71) 99999-9999"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Tipo de Acesso *</Label>
                  <Select onValueChange={(value: "admin" | "trafego" | "mecanico") => setFormData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de acesso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">👑 Administrador</SelectItem>
                      <SelectItem value="trafego">🚦 Tráfego</SelectItem>
                      <SelectItem value="mecanico">🔧 Mecânico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha Temporária *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Digite uma senha temporária"
                  required
                />
                <p className="text-sm text-gray-500">
                  O usuário será solicitado a alterar a senha no primeiro login.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormVisible(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-sotero-green hover:bg-sotero-green-light"
                  disabled={createUser.isPending}
                >
                  {createUser.isPending ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Cadastrando...
                    </>
                  ) : (
                    "Cadastrar Usuário"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum usuário cadastrado</p>
              <p className="text-sm">Clique em "Novo Usuário" para adicionar o primeiro usuário.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{user.full_name}</h3>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>📧 {user.email}</p>
                      {user.phone && <p>📱 {user.phone}</p>}
                      {user.created_at && (
                        <p>📅 Cadastrado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(user.id, user.full_name)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_full_name">Nome Completo *</Label>
              <Input
                id="edit_full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_email">E-mail *</Label>
              <Input
                id="edit_email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_phone">Telefone</Label>
              <Input
                id="edit_phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(71) 99999-9999"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_role">Tipo de Acesso *</Label>
              <Select value={formData.role} onValueChange={(value: "admin" | "trafego" | "mecanico") => setFormData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">👑 Administrador</SelectItem>
                  <SelectItem value="trafego">🚦 Tráfego</SelectItem>
                  <SelectItem value="mecanico">🔧 Mecânico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_password">Nova Senha (opcional)</Label>
              <Input
                id="edit_password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Deixe em branco para manter a atual"
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-sotero-blue hover:bg-sotero-blue-light"
                disabled={updateUser.isPending}
              >
                {updateUser.isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Atualizando...
                  </>
                ) : (
                  "Atualizar Usuário"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CadastroUsuarios;
