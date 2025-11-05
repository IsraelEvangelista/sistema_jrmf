import React from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { VazaoDataPoint } from "./data";

interface ChartProps {
  data: VazaoDataPoint[];
  chartType?: 'line' | 'bar';
}

// Componente de gráfico para visualizar dados do Portal de Vazões Jaguaribe RMF
const Chart: React.FC<ChartProps> = ({ data, chartType = 'line' }) => {
  // Agrupa dados por data para visualização temporal
  const processDataForChart = () => {
    const groupedData = data.reduce((acc, item) => {
      const date = new Date(item.data_coleta).toLocaleDateString('pt-BR');
      
      if (!acc[date]) {
        acc[date] = {
          data: date,
          vazaoTotal: 0,
          pontosAtivos: 0,
          P1: 0,
          P2: 0,
          P3: 0,
          P4: 0
        };
      }
      
      acc[date].vazaoTotal += item.vazao;
      if (item.status === 'ativo') {
        acc[date].pontosAtivos += 1;
      }
      acc[date][item.prioridade as keyof typeof acc[string]] += item.vazao;
      
      return acc;
    }, {} as Record<string, { data: string; vazaoTotal: number; P1: number; P2: number; P3: number; P4: number }>);
    
    return Object.values(groupedData).sort((a, b) => 
      new Date(a.data.split('/').reverse().join('-')).getTime() - 
      new Date(b.data.split('/').reverse().join('-')).getTime()
    );
  };

  // Processa dados por prioridade para gráfico de barras
  const processDataByPriority = () => {
    const priorityData = data.reduce((acc, item) => {
      if (!acc[item.prioridade]) {
        acc[item.prioridade] = {
          prioridade: item.prioridade,
          vazaoTotal: 0,
          pontos: 0,
          ativos: 0
        };
      }
      
      acc[item.prioridade].vazaoTotal += item.vazao;
      acc[item.prioridade].pontos += 1;
      if (item.status === 'ativo') {
        acc[item.prioridade].ativos += 1;
      }
      
      return acc;
    }, {} as Record<string, { prioridade: string; vazaoTotal: number; pontos: number; ativos: number }>);
    
    return Object.values(priorityData).sort((a, b) => 
      a.prioridade.localeCompare(b.prioridade)
    );
  };

  const chartData = chartType === 'line' ? processDataForChart() : processDataByPriority();

  const formatTooltipValue = (value: number, name: string) => {
    if (name.includes('vazao') || name.includes('P1') || name.includes('P2') || name.includes('P3') || name.includes('P4')) {
      return [`${value.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} L/s`, name];
    }
    return [value, name];
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: { value: number; name: string; color: string }, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${formatTooltipValue(entry.value, entry.name)[0]}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (chartType === 'line') {
    return (
      <Card className="p-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="mb-4">
          <h3 className="text-lg font-medium">Evolução das Vazões por Data</h3>
          <p className="text-sm text-muted-foreground">
            Acompanhamento temporal das vazões coletadas por prioridade
          </p>
        </div>
        
        <div className="h-80 bg-white rounded-lg">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="data" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#e5e7eb' }}
                label={{ value: 'Vazão (L/s)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              <Line 
                type="monotone" 
                dataKey="vazaoTotal" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Vazão Total"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="P1" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="P1 (Totalizador)"
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="P2" 
                stroke="#f97316" 
                strokeWidth={2}
                name="P2 (Vazão Direta)"
                dot={{ fill: '#f97316', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="P3" 
                stroke="#eab308" 
                strokeWidth={2}
                name="P3 (Horas Bombeadas)"
                dot={{ fill: '#eab308', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="P4" 
                stroke="#06b6d4" 
                strokeWidth={2}
                name="P4 (Nível/Curva-chave)"
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-gray-100">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Vazões por Prioridade de Coleta</h3>
        <p className="text-sm text-muted-foreground">
          Distribuição das vazões por metodologia de coleta (P1-P4)
        </p>
      </div>
      
      <div className="h-80 bg-white rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="prioridade" 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
              label={{ value: 'Vazão (L/s)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Bar 
              dataKey="vazaoTotal" 
              fill="#3b82f6" 
              name="Vazão Total"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="ativos" 
              fill="#10b981" 
              name="Pontos Ativos"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center p-2 bg-red-50 rounded">
          <div className="font-medium text-red-800">P1</div>
          <div className="text-red-600">Totalizador</div>
        </div>
        <div className="text-center p-2 bg-orange-50 rounded">
          <div className="font-medium text-orange-800">P2</div>
          <div className="text-orange-600">Vazão Direta</div>
        </div>
        <div className="text-center p-2 bg-yellow-50 rounded">
          <div className="font-medium text-yellow-800">P3</div>
          <div className="text-yellow-600">Horas Bombeadas</div>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded">
          <div className="font-medium text-blue-800">P4</div>
          <div className="text-blue-600">Nível/Curva-chave</div>
        </div>
      </div>
    </Card>
  );
};

export default Chart;