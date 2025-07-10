
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, User, CheckCircle, Eye } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type SOSCall = Tables<'sos_calls'>;

/**
 * Props do componente SOSCard
 */
interface SOSCardProps {
  /** Dados do chamado SOS */
  sos: SOSCall;
  /** Callback executado quando "Ver Detalhes" é clicado */
  onViewDetails: (id: string) => void;
  /** Callback executado quando "Finalizar" é clicado */
  onComplete: (id: string) => void;
}

/**
 * Componente que exibe um cartão com informações de um chamado SOS
 * 
 * @description Apresenta as informações principais de um chamado SOS de forma
 * visual e organizada, incluindo status, veículo, motorista, localização e
 * ações disponíveis (ver detalhes e finalizar).
 * 
 * @param props - Propriedades do componente
 * @returns JSX Element do cartão SOS
 * 
 * @example
 * ```tsx
 * <SOSCard
 *   sos={sosData}
 *   onViewDetails={(id) => navigate(`/sos/${id}`)}
 *   onComplete={(id) => completeSOS(id)}
 * />
 * ```
 */
export const SOSCard = ({ sos, onViewDetails, onComplete }: SOSCardProps) => {
  /**
   * Retorna as classes CSS para colorir o badge de status
   * @param status Status do chamado SOS
   * @returns String com classes CSS do Tailwind
   */
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "waiting": return "bg-blue-100 text-blue-800";
      case "in-progress": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "overdue": return "bg-red-100 text-red-800 animate-pulse";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  /**
   * Converte o status do banco para texto legível em português
   * @param status Status do chamado SOS
   * @returns Texto do status em português
   */
  const getStatusText = (status: string | null) => {
    switch (status) {
      case "waiting": return "Em Espera";
      case "in-progress": return "Em Atendimento";
      case "completed": return "Finalizado";
      case "overdue": return "Atrasado";
      default: return "Status não definido";
    }
  };

  /**
   * Formata string de tempo para formato brasileiro (HH:MM)
   * @param timeString String de tempo ISO ou hora
   * @returns Tempo formatado ou mensagem padrão
   */
  const formatTime = (timeString: string | null) => {
    if (!timeString) return "Não informado";
    try {
      return new Date(timeString).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timeString;
    }
  };

  /**
   * Formata string de data para formato brasileiro (DD/MM/AAAA)
   * @param dateString String de data ISO
   * @returns Data formatada ou mensagem padrão
   */
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Não informado";
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return "Data inválida";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🚛</div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                {sos.vehicle_plate || "Veículo não identificado"}
              </h3>
              <p className="text-sm text-gray-600">
                {sos.vehicle_type || "Tipo não informado"}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(sos.status)}>
            {getStatusText(sos.status)}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-gray-500" />
            <span>{sos.driver_name || "Motorista não informado"}</span>
          </div>
          
          {sos.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{sos.location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>
              Solicitado: {formatDate(sos.created_at)} às {formatTime(sos.request_time)}
            </span>
          </div>

          {sos.estimated_time && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>Tempo estimado: {sos.estimated_time} min</span>
            </div>
          )}

          {sos.completion_time && sos.status === "completed" && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>Finalizado às {sos.completion_time}</span>
            </div>
          )}
        </div>

        {sos.problem_type && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 mb-1">TIPO DE PROBLEMA</p>
            <p className="text-sm">{sos.problem_type}</p>
          </div>
        )}

        {sos.description && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 mb-1">DESCRIÇÃO</p>
            <p className="text-sm text-gray-700 line-clamp-2">{sos.description}</p>
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(sos.id)}
            className="flex-1 flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Ver Detalhes
          </Button>
          
          {sos.status !== "completed" && (
            <Button
              size="sm"
              onClick={() => onComplete(sos.id)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Finalizar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
