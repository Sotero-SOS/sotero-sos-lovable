
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SOSCard } from "@/components/SOSCard";
import { useToast } from "@/hooks/use-toast";

// Dados simulados de chamados SOS
const mockSOSData = [
  {
    id: "1",
    vehicleType: "Caminhão",
    vehiclePlate: "ABC-1234",
    driverName: "José da Silva",
    location: "Rua São Jorge, Itapuã",
    problemType: "Pane elétrica",
    description: "Sistema elétrico apresentou falha durante coleta",
    requestTime: "30/06/2025 - 08:14",
    estimatedTime: 30,
    status: "overdue" as const,
    completionTime: undefined
  },
  {
    id: "2",
    vehicleType: "Trator",
    vehiclePlate: "DEF-5678",
    driverName: "Maria Santos",
    location: "Av. Paralela, Pituaçu",
    problemType: "Problema mecânico",
    description: "Motor apresentando ruído anormal",
    requestTime: "30/06/2025 - 09:30",
    estimatedTime: 45,
    status: "in-progress" as const,
    completionTime: undefined
  },
  {
    id: "3",
    vehicleType: "Van",
    vehiclePlate: "GHI-9012",
    driverName: "Carlos Oliveira",
    location: "Centro, Pelourinho",
    problemType: "Pneu furado",
    description: "",
    requestTime: "30/06/2025 - 10:15",
    estimatedTime: 20,
    status: "completed" as const,
    completionTime: "10:35"
  },
  {
    id: "4",
    vehicleType: "Triciclo",
    vehiclePlate: "JKL-3456",
    driverName: "Ana Costa",
    location: "Barra, Ondina",
    problemType: "Falha no sistema",
    description: "Sistema de coleta não está funcionando",
    requestTime: "30/06/2025 - 11:00",
    estimatedTime: 25,
    status: "waiting" as const,
    completionTime: undefined
  }
];

const Dashboard = () => {
  const [sosData, setSOSData] = useState(mockSOSData);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredData = sosData.filter(sos => {
    const matchesFilter = filter === "all" || sos.status === filter;
    const matchesSearch = sos.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sos.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: sosData.length,
    waiting: sosData.filter(s => s.status === "waiting").length,
    "in-progress": sosData.filter(s => s.status === "in-progress").length,
    completed: sosData.filter(s => s.status === "completed").length,
    overdue: sosData.filter(s => s.status === "overdue").length,
  };

  const handleViewDetails = (id: string) => {
    toast({
      title: "Visualizar detalhes",
      description: `Abrindo detalhes do chamado ${id}`,
    });
  };

  const handleComplete = (id: string) => {
    setSOSData(prev => prev.map(sos => 
      sos.id === id 
        ? { ...sos, status: "completed" as const, completionTime: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }
        : sos
    ));
    
    toast({
      title: "SOS Finalizado",
      description: "Chamado marcado como concluído com sucesso!",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Operacional</h1>
        <p className="text-gray-600">Monitoramento em tempo real dos chamados SOS</p>
      </div>

      {/* Filtros e busca */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-sotero-blue" : ""}
          >
            Todos ({statusCounts.all})
          </Button>
          <Button
            variant={filter === "waiting" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("waiting")}
            className={filter === "waiting" ? "bg-status-info" : ""}
          >
            Em Espera ({statusCounts.waiting})
          </Button>
          <Button
            variant={filter === "in-progress" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("in-progress")}
            className={filter === "in-progress" ? "bg-status-warning" : ""}
          >
            Em Atendimento ({statusCounts["in-progress"]})
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
            className={filter === "completed" ? "bg-status-success" : ""}
          >
            Finalizados ({statusCounts.completed})
          </Button>
          <Button
            variant={filter === "overdue" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("overdue")}
            className={filter === "overdue" ? "bg-status-danger animate-pulse-red" : ""}
          >
            Atrasados ({statusCounts.overdue})
          </Button>
        </div>

        <div className="w-full sm:w-auto">
          <Input
            placeholder="Buscar por placa ou motorista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
        </div>
      </div>

      {/* Cards de SOS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredData.map((sos) => (
          <SOSCard
            key={sos.id}
            sos={sos}
            onViewDetails={handleViewDetails}
            onComplete={handleComplete}
          />
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum chamado encontrado</p>
          <p className="text-gray-400">Tente ajustar os filtros ou termo de busca</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
