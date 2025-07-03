
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

const mockVehicles = {
  circulating: [
    {
      id: "1",
      type: "Truck",
      plate: "224009",
      lastActivity: "30/06/2025 - 11:30",
      location: "Rota Itapuã - Centro",
      driver: "José da Silva"
    },
    {
      id: "2", 
      type: "Super Toco",
      plate: "224015",
      lastActivity: "30/06/2025 - 11:15",
      location: "Av. Paralela - Pituaçu",
      driver: "Maria Santos"
    },
    {
      id: "3",
      type: "Agilix",
      plate: "224032", 
      lastActivity: "30/06/2025 - 11:45",
      location: "Centro - Pelourinho",
      driver: "Carlos Oliveira"
    }
  ],
  inactive: [
    {
      id: "4",
      type: "Triciclo",
      plate: "224048",
      lastActivity: "29/06/2025 - 18:00",
      location: "Base Operacional",
      driver: "Ana Costa"
    },
    {
      id: "5",
      type: "Truck",
      plate: "224056",
      lastActivity: "29/06/2025 - 17:30",
      location: "Base Operacional", 
      driver: "Pedro Santos"
    }
  ],
  maintenance: [
    {
      id: "6",
      type: "Super Toco",
      plate: "224061",
      lastActivity: "28/06/2025 - 16:00",
      location: "Oficina Mecânica",
      driver: "Roberto Lima",
      maintenanceType: "Revisão preventiva"
    },
    {
      id: "7",
      type: "Agilix",
      plate: "224078",
      lastActivity: "27/06/2025 - 14:30", 
      location: "Oficina Elétrica",
      driver: "Fernanda Silva",
      maintenanceType: "Reparo sistema elétrico"
    }
  ]
};

const vehicleIcons = {
  "Truck": "🚛",
  "Super Toco": "🚛",
  "Agilix": "🚛",
  "Triciclo": "🛺"
};

const Veiculos = () => {
  const [activeTab, setActiveTab] = useState("circulating");
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [vehicleForm, setVehicleForm] = useState({
    type: "",
    plate: "",
    driver: "",
    status: "circulating"
  });
  const { toast } = useToast();

  const handleAddVehicle = () => {
    if (!vehicleForm.type || !vehicleForm.plate || !vehicleForm.driver) {
      toast({
        title: "Erro!",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newVehicle = {
      id: Date.now().toString(),
      type: vehicleForm.type,
      plate: vehicleForm.plate,
      driver: vehicleForm.driver,
      lastActivity: new Date().toLocaleString('pt-BR'),
      location: "Base Operacional"
    };

    const status = vehicleForm.status as keyof typeof vehicles;
    setVehicles(prev => ({
      ...prev,
      [status]: [...prev[status], newVehicle]
    }));

    setVehicleForm({ type: "", plate: "", driver: "", status: "circulating" });
    setShowAddDialog(false);

    toast({
      title: "Veículo adicionado!",
      description: `Veículo ${vehicleForm.plate} foi adicionado com sucesso.`,
    });
  };

  const handleEditVehicle = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setVehicleForm({
      type: vehicle.type,
      plate: vehicle.plate,
      driver: vehicle.driver,
      status: activeTab
    });
    setShowEditDialog(true);
  };

  const handleUpdateVehicle = () => {
    if (!vehicleForm.type || !vehicleForm.plate || !vehicleForm.driver) {
      toast({
        title: "Erro!",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const updatedVehicle = {
      ...editingVehicle,
      type: vehicleForm.type,
      plate: vehicleForm.plate,
      driver: vehicleForm.driver
    };

    const currentStatus = activeTab as keyof typeof vehicles;
    setVehicles(prev => ({
      ...prev,
      [currentStatus]: prev[currentStatus].map(v => 
        v.id === editingVehicle.id ? updatedVehicle : v
      )
    }));

    setShowEditDialog(false);
    setEditingVehicle(null);

    toast({
      title: "Veículo atualizado!",
      description: `Veículo ${vehicleForm.plate} foi atualizado com sucesso.`,
    });
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    const currentStatus = activeTab as keyof typeof vehicles;
    setVehicles(prev => ({
      ...prev,
      [currentStatus]: prev[currentStatus].filter(v => v.id !== vehicleId)
    }));

    toast({
      title: "Veículo removido",
      description: "O veículo foi removido do sistema.",
    });
  };

  const VehicleCard = ({ vehicle, showMaintenance = false }: { vehicle: any, showMaintenance?: boolean }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {vehicleIcons[vehicle.type as keyof typeof vehicleIcons]}
            </span>
            <div>
              <h3 className="font-semibold text-lg">{vehicle.plate}</h3>
              <p className="text-sm text-gray-600">{vehicle.type}</p>
            </div>
          </div>
          <Badge variant={activeTab === "circulating" ? "default" : activeTab === "maintenance" ? "destructive" : "secondary"}>
            {activeTab === "circulating" ? "Ativo" : activeTab === "maintenance" ? "Manutenção" : "Inativo"}
          </Badge>
        </div>
        
        <div className="mt-4 space-y-2">
          <div>
            <p className="text-xs font-medium text-gray-500">MOTORISTA</p>
            <p className="text-sm">{vehicle.driver}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">LOCALIZAÇÃO</p>
            <p className="text-sm">{vehicle.location}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">ÚLTIMA ATIVIDADE</p>
            <p className="text-sm">{vehicle.lastActivity}</p>
          </div>
          {showMaintenance && vehicle.maintenanceType && (
            <div>
              <p className="text-xs font-medium text-gray-500">TIPO DE MANUTENÇÃO</p>
              <p className="text-sm">{vehicle.maintenanceType}</p>
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
            onClick={() => handleDeleteVehicle(vehicle.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

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
            🟢 Em Circulação ({vehicles.circulating.length})
          </TabsTrigger>
          <TabsTrigger value="inactive" className="flex items-center gap-2">
            ⚫ Inativos ({vehicles.inactive.length})
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            🔧 Em Manutenção ({vehicles.maintenance.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="circulating" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.circulating.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inactive" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.inactive.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.maintenance.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} showMaintenance />
            ))}
          </div>
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
              {vehicles.circulating.length + vehicles.inactive.length + vehicles.maintenance.length}
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
              {Math.round((vehicles.circulating.length / (vehicles.circulating.length + vehicles.inactive.length + vehicles.maintenance.length)) * 100)}%
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
              {vehicles.maintenance.length}
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
              <Label htmlFor="vehicleType">Tipo de Veículo</Label>
              <Select onValueChange={(value) => setVehicleForm(prev => ({ ...prev, type: value }))}>
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
              <Label htmlFor="plate">Código do Veículo</Label>
              <Input
                id="plate"
                value={vehicleForm.plate}
                onChange={(e) => setVehicleForm(prev => ({ ...prev, plate: e.target.value }))}
                placeholder="224009"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driver">Nome do Motorista</Label>
              <Input
                id="driver"
                value={vehicleForm.driver}
                onChange={(e) => setVehicleForm(prev => ({ ...prev, driver: e.target.value }))}
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => setVehicleForm(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="circulating">🟢 Em Circulação</SelectItem>
                  <SelectItem value="inactive">⚫ Inativo</SelectItem>
                  <SelectItem value="maintenance">🔧 Em Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddVehicle} className="bg-sotero-green hover:bg-sotero-green-light">
              Adicionar Veículo
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
              <Label htmlFor="editVehicleType">Tipo de Veículo</Label>
              <Select value={vehicleForm.type} onValueChange={(value) => setVehicleForm(prev => ({ ...prev, type: value }))}>
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
              <Label htmlFor="editPlate">Código do Veículo</Label>
              <Input
                id="editPlate"
                value={vehicleForm.plate}
                onChange={(e) => setVehicleForm(prev => ({ ...prev, plate: e.target.value }))}
                placeholder="224009"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDriver">Nome do Motorista</Label>
              <Input
                id="editDriver"
                value={vehicleForm.driver}
                onChange={(e) => setVehicleForm(prev => ({ ...prev, driver: e.target.value }))}
                placeholder="Nome completo"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateVehicle} className="bg-sotero-blue hover:bg-sotero-blue-light">
              Atualizar Veículo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Veiculos;
