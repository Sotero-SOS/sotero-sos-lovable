
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useVehicles } from "@/hooks/useVehicles";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import type { Tables } from "@/integrations/supabase/types";

type Vehicle = Tables<'veiculo'>;

const vehicleIcons: { [key: string]: string } = {
  "Truck": "🚛",
  "Super Toco": "🚛",
  "Agilix": "🚛",
  "Triciclo": "🛺"
};

const Veiculos = () => {
  const { vehicles, isLoading, error, createVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const [activeTab, setActiveTab] = useState("circulating");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleForm, setVehicleForm] = useState({
    type: "",
    plate: "",
    driver_name: "",
    status: "circulating",
    maintenance_type: ""
  });
  const { toast } = useToast();

  // Filtrar veículos por status
  const vehiclesByStatus = {
    circulating: vehicles.filter(v => v.situacao === "circulating"),
    inactive: vehicles.filter(v => v.situacao === "inactive"),
    maintenance: vehicles.filter(v => v.situacao === "maintenance")
  };

  const handleAddVehicle = async () => {
    if (!vehicleForm.type || !vehicleForm.plate || !vehicleForm.driver_name) {
      toast({
        title: "Erro!",
        description: "Todos os campos obrigatórios devem ser preenchidos.",
        variant: "destructive"
      });
      return;
    }

    try {
      await createVehicle.mutateAsync({
        categoria: vehicleForm.type,
        cod_veiculo: parseInt(vehicleForm.plate, 10),
        driver_name: vehicleForm.driver_name,
        situacao: vehicleForm.status,
        maintenance_type: vehicleForm.status === "maintenance" ? vehicleForm.maintenance_type : null,
        location: "Base Operacional"
      });

      setVehicleForm({ type: "", plate: "", driver_name: "", status: "circulating", maintenance_type: "" });
      setShowAddDialog(false);

      toast({
        title: "Veículo adicionado!",
        description: `Veículo ${vehicleForm.plate} foi adicionado com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao adicionar veículo",
        description: "Não foi possível adicionar o veículo. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleForm({
      type: vehicle.type || "",
      plate: vehicle.cod_veiculo.toString(),
      driver_name: vehicle.driver_name || "",
      status: vehicle.situacao || "circulating",
      maintenance_type: vehicle.maintenance_type || ""
    });
    setShowEditDialog(true);
  };

  const handleUpdateVehicle = async () => {
    if (!editingVehicle || !vehicleForm.type || !vehicleForm.plate || !vehicleForm.driver_name) {
      toast({
        title: "Erro!",
        description: "Todos os campos obrigatórios devem ser preenchidos.",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateVehicle.mutateAsync({
        id: editingVehicle.cod_veiculo,
        updates: {
          type: vehicleForm.type,
          cod_veiculo: parseInt(vehicleForm.plate, 10),
          driver_name: vehicleForm.driver_name,
          situacao: vehicleForm.status,
          maintenance_type: vehicleForm.status === "maintenance" ? vehicleForm.maintenance_type : null
        }
      });

      setShowEditDialog(false);
      setEditingVehicle(null);

      toast({
        title: "Veículo atualizado!",
        description: `Veículo ${vehicleForm.plate} foi atualizado com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar veículo",
        description: "Não foi possível atualizar o veículo. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteVehicle = async (vehicleId: number, vehiclePlate: string) => {
    if (!confirm(`Tem certeza que deseja remover o veículo ${vehiclePlate}?`)) return;

    try {
      await deleteVehicle.mutateAsync(vehicleId);
      toast({
        title: "Veículo removido",
        description: `Veículo ${vehiclePlate} foi removido do sistema.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao remover veículo",
        description: "Não foi possível remover o veículo. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const VehicleCard = ({ vehicle, showMaintenance = false }: { vehicle: Vehicle, showMaintenance?: boolean }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {vehicleIcons[vehicle.type || ""]}
            </span>
            <div>
              <h3 className="font-semibold text-lg">{vehicle.cod_veiculo}</h3>
              <p className="text-sm text-gray-600">{vehicle.type}</p>
            </div>
          </div>
          <Badge variant={vehicle.situacao === "circulating" ? "default" : vehicle.situacao === "maintenance" ? "destructive" : "secondary"}>
            {vehicle.situacao === "circulating" ? "Ativo" : vehicle.situacao === "maintenance" ? "Manutenção" : "Inativo"}
          </Badge>
        </div>
        
        <div className="mt-4 space-y-2">
          <div>
            <p className="text-xs font-medium text-gray-500">MOTORISTA</p>
            <p className="text-sm">{vehicle.driver_name}</p>
          </div>
          {vehicle.location && (
            <div>
              <p className="text-xs font-medium text-gray-500">LOCALIZAÇÃO</p>
              <p className="text-sm">{vehicle.location}</p>
            </div>
          )}
          {vehicle.last_activity && (
            <div>
              <p className="text-xs font-medium text-gray-500">ÚLTIMA ATIVIDADE</p>
              <p className="text-sm">{new Date(vehicle.last_activity).toLocaleString('pt-BR')}</p>
            </div>
          )}
          {showMaintenance && vehicle.maintenance_type && (
            <div>
              <p className="text-xs font-medium text-gray-500">TIPO DE MANUTENÇÃO</p>
              <p className="text-sm">{vehicle.maintenance_type}</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            Ver Histórico
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleEditVehicle(vehicle)}
            className="flex items-center gap-1"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleDeleteVehicle(vehicle.cod_veiculo, vehicle.cod_veiculo.toString())}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-lg">Carregando veículos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        title="Erro ao carregar veículos"
        message="Não foi possível carregar a lista de veículos. Verifique sua conexão e tente novamente."
        className="m-6"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Veículos</h1>
          <p className="text-gray-600">Acompanhe o status da frota em tempo real</p>
        </div>
        <Button 
          onClick={() => setShowAddDialog(true)}
          className="bg-sotero-blue hover:bg-sotero-blue-light flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar Veículo
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="circulating" className="flex items-center gap-2">
            🟢 Em Circulação ({vehiclesByStatus.circulating.length})
          </TabsTrigger>
          <TabsTrigger value="inactive" className="flex items-center gap-2">
            ⚫ Inativos ({vehiclesByStatus.inactive.length})
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            🔧 Em Manutenção ({vehiclesByStatus.maintenance.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="circulating" className="mt-6">
          {vehiclesByStatus.circulating.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum veículo em circulação</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vehiclesByStatus.circulating.map((vehicle) => (
                <VehicleCard key={vehicle.cod_veiculo} vehicle={vehicle} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="inactive" className="mt-6">
          {vehiclesByStatus.inactive.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum veículo inativo</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vehiclesByStatus.inactive.map((vehicle) => (
                <VehicleCard key={vehicle.cod_veiculo} vehicle={vehicle} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          {vehiclesByStatus.maintenance.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum veículo em manutenção</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vehiclesByStatus.maintenance.map((vehicle) => (
                <VehicleCard key={vehicle.cod_veiculo} vehicle={vehicle} showMaintenance />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Resumo estatístico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total da Frota</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sotero-blue">
              {vehicles.length}
            </div>
            <p className="text-xs text-gray-500">veículos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Disponibilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sotero-green">
              {vehicles.length > 0 ? Math.round((vehiclesByStatus.circulating.length / vehicles.length) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-500">dos veículos operando</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Em Manutenção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-warning">
              {vehiclesByStatus.maintenance.length}
            </div>
            <p className="text-xs text-gray-500">veículos parados</p>
          </CardContent>
        </Card>
      </div>

      {/* Dialog para adicionar veículo */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Veículo</DialogTitle>
            <DialogDescription>
              Preencha as informações do novo veículo
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Tipo de Veículo *</Label>
              <Select onValueChange={(value: "Truck" | "Super Toco" | "Agilix" | "Triciclo") => setVehicleForm(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Truck">🚛 Truck</SelectItem>
                  <SelectItem value="Super Toco">🚛 Super Toco</SelectItem>
                  <SelectItem value="Agilix">🚛 Agilix</SelectItem>
                  <SelectItem value="Triciclo">🛺 Triciclo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plate">Código do Veículo *</Label>
              <Input
                id="plate"
                value={vehicleForm.plate}
                onChange={(e) => setVehicleForm(prev => ({ ...prev, plate: e.target.value }))}
                placeholder="224009"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driver">Nome do Motorista *</Label>
              <Input
                id="driver"
                value={vehicleForm.driver_name}
                onChange={(e) => setVehicleForm(prev => ({ ...prev, driver_name: e.target.value }))}
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={vehicleForm.status} onValueChange={(value) => setVehicleForm(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="circulating">🟢 Em Circulação</SelectItem>
                  <SelectItem value="inactive">⚫ Inativo</SelectItem>
                  <SelectItem value="maintenance">🔧 Em Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {vehicleForm.status === "maintenance" && (
              <div className="space-y-2">
                <Label htmlFor="maintenance_type">Tipo de Manutenção</Label>
                <Input
                  id="maintenance_type"
                  value={vehicleForm.maintenance_type}
                  onChange={(e) => setVehicleForm(prev => ({ ...prev, maintenance_type: e.target.value }))}
                  placeholder="Ex: Revisão preventiva, Reparo motor, etc."
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAddVehicle} 
              className="bg-sotero-green hover:bg-sotero-green-light"
              disabled={createVehicle.isPending}
            >
              {createVehicle.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Adicionando...
                </>
              ) : (
                "Adicionar Veículo"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar veículo */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Veículo</DialogTitle>
            <DialogDescription>
              Atualize as informações do veículo
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editVehicleType">Tipo de Veículo *</Label>
              <Select value={vehicleForm.type} onValueChange={(value: "Truck" | "Super Toco" | "Agilix" | "Triciclo") => setVehicleForm(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Truck">🚛 Truck</SelectItem>
                  <SelectItem value="Super Toco">🚛 Super Toco</SelectItem>
                  <SelectItem value="Agilix">🚛 Agilix</SelectItem>
                  <SelectItem value="Triciclo">🛺 Triciclo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editPlate">Código do Veículo *</Label>
              <Input
                id="editPlate"
                value={vehicleForm.plate}
                onChange={(e) => setVehicleForm(prev => ({ ...prev, plate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDriver">Nome do Motorista *</Label>
              <Input
                id="editDriver"
                value={vehicleForm.driver_name}
                onChange={(e) => setVehicleForm(prev => ({ ...prev, driver_name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editStatus">Status *</Label>
              <Select value={vehicleForm.status} onValueChange={(value) => setVehicleForm(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="circulating">🟢 Em Circulação</SelectItem>
                  <SelectItem value="inactive">⚫ Inativo</SelectItem>
                  <SelectItem value="maintenance">🔧 Em Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {vehicleForm.status === "maintenance" && (
              <div className="space-y-2">
                <Label htmlFor="editMaintenanceType">Tipo de Manutenção</Label>
                <Input
                  id="editMaintenanceType"
                  value={vehicleForm.maintenance_type}
                  onChange={(e) => setVehicleForm(prev => ({ ...prev, maintenance_type: e.target.value }))}
                  placeholder="Ex: Revisão preventiva, Reparo motor, etc."
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdateVehicle} 
              className="bg-sotero-blue hover:bg-sotero-blue-light"
              disabled={updateVehicle.isPending}
            >
              {updateVehicle.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Atualizando...
                </>
              ) : (
                "Atualizar Veículo"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Veiculos;
