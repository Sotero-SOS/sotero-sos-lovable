
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockVehicles = {
  circulating: [
    {
      id: "1",
      type: "Caminhão",
      plate: "ABC-1234",
      lastActivity: "30/06/2025 - 11:30",
      location: "Rota Itapuã - Centro",
      driver: "José da Silva"
    },
    {
      id: "2", 
      type: "Trator",
      plate: "DEF-5678",
      lastActivity: "30/06/2025 - 11:15",
      location: "Av. Paralela - Pituaçu",
      driver: "Maria Santos"
    },
    {
      id: "3",
      type: "Van",
      plate: "GHI-9012", 
      lastActivity: "30/06/2025 - 11:45",
      location: "Centro - Pelourinho",
      driver: "Carlos Oliveira"
    }
  ],
  inactive: [
    {
      id: "4",
      type: "Triciclo",
      plate: "JKL-3456",
      lastActivity: "29/06/2025 - 18:00",
      location: "Base Operacional",
      driver: "Ana Costa"
    },
    {
      id: "5",
      type: "Caminhão",
      plate: "MNO-7890",
      lastActivity: "29/06/2025 - 17:30",
      location: "Base Operacional", 
      driver: "Pedro Santos"
    }
  ],
  maintenance: [
    {
      id: "6",
      type: "Trator",
      plate: "PQR-1122",
      lastActivity: "28/06/2025 - 16:00",
      location: "Oficina Mecânica",
      driver: "Roberto Lima",
      maintenanceType: "Revisão preventiva"
    },
    {
      id: "7",
      type: "Van",
      plate: "STU-3344",
      lastActivity: "27/06/2025 - 14:30", 
      location: "Oficina Elétrica",
      driver: "Fernanda Silva",
      maintenanceType: "Reparo sistema elétrico"
    }
  ]
};

const vehicleIcons = {
  "Caminhão": "🚛",
  "Trator": "🚜",
  "Triciclo": "🛺", 
  "Van": "🚐"
};

const Veiculos = () => {
  const [activeTab, setActiveTab] = useState("circulating");

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
          <Button variant="outline" size="sm" className="flex-1">
            Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Veículos</h1>
        <p className="text-gray-600">Acompanhe o status da frota em tempo real</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="circulating" className="flex items-center gap-2">
            🟢 Em Circulação ({mockVehicles.circulating.length})
          </TabsTrigger>
          <TabsTrigger value="inactive" className="flex items-center gap-2">
            ⚫ Inativos ({mockVehicles.inactive.length})
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            🔧 Em Manutenção ({mockVehicles.maintenance.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="circulating" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockVehicles.circulating.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inactive" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockVehicles.inactive.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockVehicles.maintenance.map((vehicle) => (
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
              {mockVehicles.circulating.length + mockVehicles.inactive.length + mockVehicles.maintenance.length}
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
              {Math.round((mockVehicles.circulating.length / (mockVehicles.circulating.length + mockVehicles.inactive.length + mockVehicles.maintenance.length)) * 100)}%
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
              {mockVehicles.maintenance.length}
            </div>
            <p className="text-xs text-gray-500">veículos parados</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Veiculos;
