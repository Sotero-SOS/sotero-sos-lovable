
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SOSCard } from "@/components/SOSCard";
import { useToast } from "@/hooks/use-toast";
import { useSOSCalls } from "@/hooks/useSOSCalls";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";

const Dashboard = () => {
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { sosCalls, isLoading, error, updateSOSCall } = useSOSCalls();

  const filteredData = sosCalls.filter(sos => {
    const matchesFilter = filter === "all" || sos.status === filter;
    const matchesSearch = (sos.vehicle_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sos.driver_name?.toLowerCase().includes(searchTerm.toLowerCase())) ?? false;
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: sosCalls.length,
    waiting: sosCalls.filter(s => s.status === "waiting").length,
    "in-progress": sosCalls.filter(s => s.status === "in-progress").length,
    completed: sosCalls.filter(s => s.status === "completed").length,
    overdue: sosCalls.filter(s => s.status === "overdue").length,
  };

  const handleViewDetails = (id: string) => {
    toast({
      title: "Visualizar detalhes",
      description: `Abrindo detalhes do chamado ${id}`,
    });
  };

  const handleComplete = async (id: string) => {
    try {
      await updateSOSCall.mutateAsync({
        id,
        updates: {
          status: "completed",
          completion_time: new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        }
      });
      
      toast({
        title: "SOS Finalizado",
        description: "Chamado marcado como concluído com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível finalizar o chamado. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-lg">Carregando chamados...</span>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        title="Erro ao carregar dashboard"
        message="Não foi possível carregar os chamados SOS. Verifique sua conexão e tente novamente."
        className="m-6"
      />
    );
  }

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
            placeholder="Buscar por prefixo ou motorista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
        </div>
      </div>

      {/* Cards de SOS */}
      {filteredData.length > 0 ? (
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
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {sosCalls.length === 0 
              ? "Nenhum chamado SOS encontrado" 
              : "Nenhum chamado encontrado para os filtros aplicados"
            }
          </p>
          {sosCalls.length === 0 ? (
            <p className="text-gray-400">Os chamados aparecerão aqui quando forem criados</p>
          ) : (
            <p className="text-gray-400">Tente ajustar os filtros ou termo de busca</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
