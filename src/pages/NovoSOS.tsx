
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const NovoSOS = () => {
  const [formData, setFormData] = useState({
    vehicleType: "",
    vehiclePlate: "",
    driverName: "",
    location: "",
    problemType: "",
    description: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de envio
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "SOS Iniciado!",
      description: `Chamado criado para o veículo ${formData.vehiclePlate}. Equipe será notificada.`,
    });

    navigate("/dashboard");
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const currentDateTime = new Date().toLocaleString('pt-BR');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Novo SOS</h1>
        <p className="text-gray-600">Registre um chamado de emergência para manutenção de veículo</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🚨 Chamado de Emergência
          </CardTitle>
          <CardDescription>
            Preencha todas as informações necessárias para o atendimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="datetime">Data e Hora</Label>
                <Input
                  id="datetime"
                  value={currentDateTime}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Tipo de Veículo *</Label>
                <Select onValueChange={(value) => handleInputChange("vehicleType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Caminhão">🚛 Caminhão</SelectItem>
                    <SelectItem value="Trator">🚜 Trator</SelectItem>
                    <SelectItem value="Triciclo">🛺 Triciclo</SelectItem>
                    <SelectItem value="Van">🚐 Van</SelectItem>
                    <SelectItem value="Outros">🚗 Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehiclePlate">Placa do Veículo *</Label>
                <Input
                  id="vehiclePlate"
                  placeholder="ABC-1234"
                  value={formData.vehiclePlate}
                  onChange={(e) => handleInputChange("vehiclePlate", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="driverName">Nome do Motorista *</Label>
                <Input
                  id="driverName"
                  placeholder="Nome completo"
                  value={formData.driverName}
                  onChange={(e) => handleInputChange("driverName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localização *</Label>
              <Input
                id="location"
                placeholder="Endereço ou ponto de referência"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="problemType">Tipo de Problema *</Label>
              <Select onValueChange={(value) => handleInputChange("problemType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de problema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pane elétrica">⚡ Pane elétrica</SelectItem>
                  <SelectItem value="Problema mecânico">🔧 Problema mecânico</SelectItem>
                  <SelectItem value="Pneu furado">🛞 Pneu furado</SelectItem>
                  <SelectItem value="Falha no sistema">💻 Falha no sistema</SelectItem>
                  <SelectItem value="Acidente">⚠️ Acidente</SelectItem>
                  <SelectItem value="Outros">❓ Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (Opcional)</Label>
              <Textarea
                id="description"
                placeholder="Descreva detalhes adicionais sobre o problema..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !formData.vehicleType || !formData.vehiclePlate || !formData.driverName || !formData.location || !formData.problemType}
                className="flex-1 bg-status-danger hover:bg-red-600"
              >
                {isLoading ? "Iniciando SOS..." : "🚨 Iniciar SOS"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NovoSOS;
