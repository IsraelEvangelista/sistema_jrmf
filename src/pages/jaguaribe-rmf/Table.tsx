import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, CheckCircle, Clock, AlertTriangle, Wrench } from "lucide-react";
import { VazaoDataPoint } from "./data";
import { cn } from "@/lib/utils";

interface TableProps {
  data: VazaoDataPoint[];
}

// Componente de tabela para exibir dados do Portal de Vazões Jaguaribe RMF
const Table: React.FC<TableProps> = ({ data }) => {
  const formatCategoria = (categoria: string) => {
    return categoria.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatVazao = (vazao: number) => {
    return vazao.toLocaleString('pt-BR', { 
      minimumFractionDigits: 1, 
      maximumFractionDigits: 1 
    });
  };

  const formatData = (dataStr: string) => {
    return new Date(dataStr).toLocaleDateString('pt-BR');
  };

  const getPrioridadeBadge = (prioridade: string) => {
    const variants = {
      P1: "bg-red-100 text-red-800 border-red-200",
      P2: "bg-orange-100 text-orange-800 border-orange-200",
      P3: "bg-yellow-100 text-yellow-800 border-yellow-200",
      P4: "bg-blue-100 text-blue-800 border-blue-200"
    };
    
    return (
      <Badge className={cn("font-medium", variants[prioridade as keyof typeof variants])}>
        {prioridade}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const config = {
      ativo: { 
        icon: CheckCircle, 
        className: "bg-green-100 text-green-800 border-green-200",
        label: "Ativo"
      },
      inativo: { 
        icon: Clock, 
        className: "bg-red-100 text-red-800 border-red-200",
        label: "Inativo"
      },
      manutencao: { 
        icon: Wrench, 
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Manutenção"
      }
    };

    const statusConfig = config[status as keyof typeof config];
    const Icon = statusConfig.icon;

    return (
      <Badge className={cn("font-medium flex items-center gap-1", statusConfig.className)}>
        <Icon className="h-3 w-3" />
        {statusConfig.label}
      </Badge>
    );
  };

  const getFotoIndicator = (item: VazaoDataPoint) => {
    if (!item.foto_obrigatoria) {
      return <span className="text-gray-400">N/A</span>;
    }
    
    return (
      <div className="flex items-center gap-1 text-green-600">
        <Camera className="h-4 w-4" />
        <span className="text-xs">Obrigatória</span>
      </div>
    );
  };

  const getMetodologiaDetalhes = (item: VazaoDataPoint) => {
    switch (item.prioridade) {
      case 'P1':
        return item.totalizador_acumulado ? 
          `Tot: ${item.totalizador_acumulado.toLocaleString()}` : 
          'Totalizador';
      case 'P3':
        return item.horas_bombeadas ? 
          `${item.horas_bombeadas}h bombeadas` : 
          'Horas bombeadas';
      case 'P4':
        return item.nivel_medido ? 
          `Nível: ${item.nivel_medido.toFixed(2)}m` : 
          'Nível medido';
      default:
        return 'Vazão direta';
    }
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-white to-gray-100">
      <div className="p-4 border-b bg-gradient-card">
        <h3 className="text-lg font-medium">Pontos de Coleta</h3>
        <p className="text-sm text-muted-foreground">
          {data.length} ponto(s) encontrado(s)
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome do Ponto
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioridade
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vazão (L/s)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Metodologia
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Foto
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Município
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coletado por
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Coleta
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                  <div className="max-w-xs">
                    <div className="font-medium">{item.nome}</div>
                    {item.observacoes && (
                      <div className="text-xs text-gray-500 mt-1">
                        {item.observacoes}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCategoria(item.categoria)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {getPrioridadeBadge(item.prioridade)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatVazao(item.vazao)}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  <div className="max-w-xs">
                    <div className="font-medium text-xs">{item.metodologia}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {getMetodologiaDetalhes(item)}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {getFotoIndicator(item)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.localizacao.municipio}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {getStatusBadge(item.status)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    {item.coletado_por}
                    {item.validado_por && (
                      <div className="text-xs text-green-600 mt-1">
                        ✓ {item.validado_por}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatData(item.data_coleta)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>Nenhum ponto de coleta encontrado com os filtros aplicados.</p>
        </div>
      )}
    </Card>
  );
};

export default Table;