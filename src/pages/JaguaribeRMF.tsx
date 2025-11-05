import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplets, MapPin, Activity, TrendingUp, BarChart3 } from "lucide-react";
import PortalLayout from "@/components/portal/PortalLayout";
import { allVazaoData, VazaoDataPoint, prioridadeOptions, categoriaOptions, statusOptions } from "./jaguaribe-rmf/data";
import Filters from "./jaguaribe-rmf/Filters";
import Table from "./jaguaribe-rmf/Table";
import Chart from "./jaguaribe-rmf/Chart";

// -------------------------------------------------------------
// Página: Portal de Vazões Jaguaribe RMF
// Objetivo: Gerenciar vazões dos trechos da infraestrutura 
// Jaguaribe e Região Metropolitana de Fortaleza
// Layout: Cabeçalho padrão + Sidebar + Conteúdo
// -------------------------------------------------------------



const JaguaribeRMF: React.FC = () => {
  const [prioridade, setPrioridade] = useState<string>("todas");
  const [categoria, setCategoria] = useState<string>("todas");
  const [status, setStatus] = useState<string>("todos");
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  // SEO e metadados da página
  useEffect(() => {
    document.title = "Portal de Vazões Jaguaribe RMF - Sistema COGERH";
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Portal de gerenciamento de vazões dos trechos da infraestrutura Jaguaribe e Região Metropolitana de Fortaleza - Sistema COGERH');
    }
    
    // Canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', window.location.origin + '/portal/jaguaribe-rmf');
    }
  }, []);

  // Filtrar dados baseado nos filtros selecionados
  const filteredData = useMemo(() => {
    return allVazaoData.filter(item => {
      const prioridadeMatch = prioridade === "todas" || item.prioridade === prioridade;
      const categoriaMatch = categoria === "todas" || item.categoria === categoria;
      const statusMatch = status === "todos" || item.status === status;
      
      return prioridadeMatch && categoriaMatch && statusMatch;
    });
  }, [prioridade, categoria, status]);

  // Estatísticas resumidas
  const stats = useMemo(() => {
    const totalVazao = filteredData.reduce((sum, item) => sum + item.vazao, 0);
    const totalPontos = filteredData.length;
    const pontosAtivos = filteredData.filter(item => item.status === 'ativo').length;
    
    return {
      totalVazao: totalVazao.toFixed(1),
      totalPontos,
      pontosAtivos,
      percentualAtivos: totalPontos > 0 ? ((pontosAtivos / totalPontos) * 100).toFixed(1) : '0'
    };
  }, [filteredData]);

  return (
    <PortalLayout title="Portal Jaguaribe RMF" portalName="Portal Jaguaribe RMF" portalIcon="waves">
      <div className="space-y-6 p-6">
        {/* Descrição da página */}
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Gerenciamento de vazões dos trechos da infraestrutura Jaguaribe e Região Metropolitana de Fortaleza
          </p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-primary">{stats.totalVazao}</div>
            <div className="text-sm text-muted-foreground">Total Vazão (L/s)</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-primary">{stats.totalPontos}</div>
            <div className="text-sm text-muted-foreground">Pontos Monitorados</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-green-600">{stats.pontosAtivos}</div>
            <div className="text-sm text-muted-foreground">Pontos Ativos</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{stats.percentualAtivos}%</div>
            <div className="text-sm text-muted-foreground">Taxa Operacional</div>
          </div>
        </div>

        {/* Filtros */}
        <Filters 
          prioridade={prioridade}
          categoria={categoria}
          status={status}
          onPrioridadeChange={setPrioridade}
          onCategoriaChange={setCategoria}
          onStatusChange={setStatus}
        />

        {/* Controles do Gráfico */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Visualização de Dados</h3>
            <div className="flex gap-2">
              <Button
                variant={chartType === 'line' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('line')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Temporal
              </Button>
              <Button
                variant={chartType === 'bar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('bar')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Por Prioridade
              </Button>
            </div>
          </div>
        </Card>

        {/* Gráfico */}
        <Chart data={filteredData} chartType={chartType} />

        {/* Tabela de Pontos de Coleta */}
        <Table data={filteredData} />

        {/* Informações sobre Metodologias */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Metodologias de Coleta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-red-100 text-red-800 border-red-200">P1</Badge>
                <span className="font-medium text-red-800">Totalizador</span>
              </div>
              <p className="text-sm text-red-700">
                Totalizador acumulado + registro fotográfico obrigatório
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">P2</Badge>
                <span className="font-medium text-orange-800">Vazão Direta</span>
              </div>
              <p className="text-sm text-orange-700">
                Vazão direta informada pelo operador
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">P3</Badge>
                <span className="font-medium text-yellow-800">Horas Bombeadas</span>
              </div>
              <p className="text-sm text-yellow-700">
                Horas de bombeamento + registro fotográfico
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">P4</Badge>
                <span className="font-medium text-blue-800">Nível + Curva-chave</span>
              </div>
              <p className="text-sm text-blue-700">
                Nível medido + curva-chave + foto
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PortalLayout>
  );
};

export default JaguaribeRMF;