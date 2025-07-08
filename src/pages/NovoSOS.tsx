import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useSOSCalls } from "@/hooks/useSOSCalls";
import { useAuth } from "@/hooks/useAuth";

const NovoSOS = () => {
  const [formData, setFormData] = useState({
    vehicleType: "",
    vehiclePlate: "",
    driverName: "",
    location: "",
    problemType: "",
    description: "",
    // Diagnóstico técnico
    eletrica: [] as string[],
    mecanico: [] as string[],
    compactador: [] as string[],
    pneuFurado: false,
    pneuPosicoes: [] as string[],
    suspensao: [] as string[],
    outro: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createSOSCall } = useSOSCalls();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createSOSCall.mutateAsync({
        vehicle_type: formData.vehicleType as "Truck" | "Super Toco" | "Agilix" | "Triciclo",
        vehicle_plate: formData.vehiclePlate,
        driver_name: formData.driverName,
        location: formData.location,
        problem_type: "Diagnóstico técnico",
        description: formData.description,
        diagnostico_eletrica: formData.eletrica.length > 0 ? formData.eletrica : null,
        diagnostico_mecanico: formData.mecanico.length > 0 ? formData.mecanico : null,
        diagnostico_compactador: formData.compactador.length > 0 ? formData.compactador : null,
        diagnostico_suspensao: formData.suspensao.length > 0 ? formData.suspensao : null,
        pneu_furado: formData.pneuFurado,
        pneu_posicoes: formData.pneuPosicoes.length > 0 ? formData.pneuPosicoes : null,
        outros_problemas: formData.outro || null,
        user_id: user?.id || null,
        status: "waiting"
      });

      toast({
        title: "SOS Iniciado!",
        description: `Chamado criado para o veículo ${formData.vehiclePlate}. Equipe será notificada.`,
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erro ao criar SOS",
        description: "Não foi possível criar o chamado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (category: string, item: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [category]: checked 
        ? [...(prev[category as keyof typeof prev] as string[]), item]
        : (prev[category as keyof typeof prev] as string[]).filter(i => i !== item)
    }));
  };

  const currentDateTime = new Date().toLocaleString('pt-BR');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Novo SOS</h1>
        <p className="text-gray-600">Registre um chamado de emergência para manutenção de veículo</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚨 Informações do Chamado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                    <SelectItem value="Truck">🚛 Truck</SelectItem>
                    <SelectItem value="Super Toco">🚛 Super Toco</SelectItem>
                    <SelectItem value="Agilix">🚛 Agilix</SelectItem>
                    <SelectItem value="Triciclo">🛺 Triciclo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehiclePlate">Código do Veículo *</Label>
                <Input
                  id="vehiclePlate"
                  placeholder="224009"
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
          </CardContent>
        </Card>

        {/* Diagnóstico Técnico */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔧 Diagnóstico Técnico
            </CardTitle>
            <CardDescription>
              Selecione todos os problemas identificados no veículo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Elétrica */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>🔌</span> Elétrica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["Veículo não liga", "Motor de arranque", "Marcha congelada", "Pane elétrica"].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`eletrica-${item}`}
                      checked={formData.eletrica.includes(item)}
                      onCheckedChange={(checked) => handleCheckboxChange("eletrica", item, checked as boolean)}
                    />
                    <Label htmlFor={`eletrica-${item}`} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Mecânico */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>⚙️</span> Mecânico
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Marcha encavalando", 
                  "Vazamento de óleo do motor", 
                  "Aquecendo / vazamento de água",
                  "Motor fraco",
                  "Barulho no diferencial",
                  "Vazamento de ar",
                  "Freio falhando",
                  "Embreagem patinando"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`mecanico-${item}`}
                      checked={formData.mecanico.includes(item)}
                      onCheckedChange={(checked) => handleCheckboxChange("mecanico", item, checked as boolean)}
                    />
                    <Label htmlFor={`mecanico-${item}`} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Compactador */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>🗜️</span> Compactador
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Prensa fraca ou parada",
                  "Vazamento de óleo hidráulico",
                  "Tomada de força",
                  "Cilindro",
                  "Plataforma de trabalho",
                  "Cabo de aço"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`compactador-${item}`}
                      checked={formData.compactador.includes(item)}
                      onCheckedChange={(checked) => handleCheckboxChange("compactador", item, checked as boolean)}
                    />
                    <Label htmlFor={`compactador-${item}`} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Pneu */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>🛞</span> Pneu
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pneu-furado"
                    checked={formData.pneuFurado}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, pneuFurado: checked as boolean }))}
                  />
                  <Label htmlFor="pneu-furado" className="text-sm font-medium">Furado</Label>
                </div>
                
                {formData.pneuFurado && (
                  <div className="ml-4 space-y-3">
                    <Label className="text-sm font-medium">Posição do pneu furado:</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-gray-600">Dianteiro</Label>
                        {["LD", "LE"].map((pos) => (
                          <div key={pos} className="flex items-center space-x-2">
                            <Checkbox
                              id={`pneu-${pos}`}
                              checked={formData.pneuPosicoes.includes(pos)}
                              onCheckedChange={(checked) => handleCheckboxChange("pneuPosicoes", pos, checked as boolean)}
                            />
                            <Label htmlFor={`pneu-${pos}`} className="text-sm">{pos}</Label>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-gray-600">Traseiro</Label>
                        {["LDE", "LDI", "LEE", "LEI"].map((pos) => (
                          <div key={pos} className="flex items-center space-x-2">
                            <Checkbox
                              id={`pneu-${pos}`}
                              checked={formData.pneuPosicoes.includes(pos)}
                              onCheckedChange={(checked) => handleCheckboxChange("pneuPosicoes", pos, checked as boolean)}
                            />
                            <Label htmlFor={`pneu-${pos}`} className="text-sm">{pos}</Label>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-gray-600">3° Eixo</Label>
                        {["3-LDE", "3-LDI", "3-LEE", "3-LEI"].map((pos) => (
                          <div key={pos} className="flex items-center space-x-2">
                            <Checkbox
                              id={`pneu-${pos}`}
                              checked={formData.pneuPosicoes.includes(pos)}
                              onCheckedChange={(checked) => handleCheckboxChange("pneuPosicoes", pos, checked as boolean)}
                            />
                            <Label htmlFor={`pneu-${pos}`} className="text-sm">{pos}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Suspensão */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>🪛</span> Suspensão
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["Atravessando", "Parafuso de centro", "Mola quebrada"].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`suspensao-${item}`}
                      checked={formData.suspensao.includes(item)}
                      onCheckedChange={(checked) => handleCheckboxChange("suspensao", item, checked as boolean)}
                    />
                    <Label htmlFor={`suspensao-${item}`} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Outros */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>✏️</span> Outros
              </h3>
              <Textarea
                placeholder="Descreva outros problemas ou observações adicionais..."
                value={formData.outro}
                onChange={(e) => setFormData(prev => ({ ...prev, outro: e.target.value }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

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
            disabled={isLoading || !formData.vehicleType || !formData.vehiclePlate || !formData.driverName || !formData.location}
            className="flex-1 bg-status-danger hover:bg-red-600"
          >
            {isLoading ? "Iniciando SOS..." : "🚨 Iniciar SOS"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NovoSOS;
