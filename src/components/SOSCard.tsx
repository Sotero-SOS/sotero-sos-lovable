
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Circle, AlertCircle } from "lucide-react";

interface SOSData {
  id: string;
  vehicleType: string;
  vehiclePlate: string;
  driverName: string;
  location: string;
  problemType: string;
  description: string;
  requestTime: string;
  estimatedTime: number;
  status: "waiting" | "in-progress" | "completed" | "overdue";
  completionTime?: string;
}

interface SOSCardProps {
  sos: SOSData;
  onViewDetails: (id: string) => void;
  onComplete: (id: string) => void;
}

const statusConfig = {
  waiting: { 
    label: "Em espera", 
    color: "bg-status-info text-white", 
    icon: Circle 
  },
  "in-progress": { 
    label: "Em atendimento", 
    color: "bg-status-warning text-white", 
    icon: AlertCircle 
  },
  completed: { 
    label: "Finalizado", 
    color: "bg-status-success text-white", 
    icon: Circle 
  },
  overdue: { 
    label: "Atrasado", 
    color: "bg-status-danger text-white animate-pulse-red", 
    icon: AlertCircle 
  },
};

const vehicleIcons = {
  "Truck": "🚛",
  "Super Toco": "🚛",
  "Agilix": "🚛",
  "Triciclo": "🛺"
};

export function SOSCard({ sos, onViewDetails, onComplete }: SOSCardProps) {
  const statusInfo = statusConfig[sos.status];
  const vehicleIcon = vehicleIcons[sos.vehicleType as keyof typeof vehicleIcons] || "🚛";

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        {/* Seção 1 - Veículo */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{vehicleIcon}</span>
          <div>
            <h3 className="font-semibold text-lg">{sos.vehiclePlate}</h3>
            <p className="text-sm text-gray-600">{sos.vehicleType}</p>
          </div>
        </div>

        {/* Seção 2 - Dados do Chamado */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-900">Data/Hora</p>
              <p className="text-sm text-gray-600">{sos.requestTime}</p>
            </div>
            <Badge className={statusInfo.color}>
              <statusInfo.icon className="w-3 h-3 mr-1" />
              {statusInfo.label}
            </Badge>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-900">Localização</p>
            <p className="text-sm text-gray-600">{sos.location}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-900">Motorista</p>
            <p className="text-sm text-gray-600">{sos.driverName}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-900">Problema</p>
            <p className="text-sm text-gray-600">{sos.problemType}</p>
          </div>
          
          {sos.description && (
            <div>
              <p className="text-sm font-medium text-gray-900">Descrição</p>
              <p className="text-sm text-gray-600">{sos.description}</p>
            </div>
          )}
        </div>

        {/* Seção 3 - Status e Ações */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Tempo estimado</p>
              <p className="text-sm text-gray-600">{sos.estimatedTime} min</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Conclusão</p>
              <p className="text-sm text-gray-600">
                {sos.completionTime || "Em andamento..."}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails(sos.id)}
              className="flex-1"
            >
              🔍 Ver detalhes
            </Button>
            {sos.status !== 'completed' && (
              <Button 
                size="sm" 
                onClick={() => onComplete(sos.id)}
                className="flex-1 bg-sotero-green hover:bg-sotero-green-light"
              >
                ✅ Finalizar SOS
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
