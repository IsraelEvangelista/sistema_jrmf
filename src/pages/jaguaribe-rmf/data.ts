// Dados e tipos para o Portal de Vazões Jaguaribe RMF

// Tipos para o Portal de Vazões Jaguaribe RMF
export interface VazaoDataPoint {
  id: string;
  nome: string;
  categoria: 'bombeamento' | 'gravidade' | 'adutora' | 'canal' | 'estacao_tratamento' | 'reservatorio' | 'poco' | 'outros';
  prioridade: 'P1' | 'P2' | 'P3' | 'P4';
  metodologia: string;
  vazao: number; // L/s
  data_coleta: string;
  status: 'ativo' | 'inativo' | 'manutencao';
  localizacao: {
    municipio: string;
    coordenadas: {
      lat: number;
      lng: number;
    };
  };
  observacoes?: string;
  // Campos específicos por prioridade
  totalizador_acumulado?: number; // P1
  foto_obrigatoria?: boolean; // P1, P3, P4
  horas_bombeadas?: number; // P3
  nivel_medido?: number; // P4
  curva_chave_aplicada?: boolean; // P4
  coletado_por?: string;
  validado_por?: string;
}

// Função para gerar dados mockados mais realistas
function generateMockVazaoData(): VazaoDataPoint[] {
  const pontos = [
    // Prioridade P1 - Totalizador + Foto
    {
      nome: 'ETA Gavião - Bombeamento Principal',
      categoria: 'estacao_tratamento' as const,
      municipio: 'Pacatuba',
      coordenadas: { lat: -3.8767, lng: -38.6256 }
    },
    {
      nome: 'Adutora Jaguaribe - Trecho 1',
      categoria: 'adutora' as const,
      municipio: 'Itaitinga',
      coordenadas: { lat: -3.9667, lng: -38.5333 }
    },
    {
      nome: 'Canal do Trabalhador',
      categoria: 'canal' as const,
      municipio: 'Fortaleza',
      coordenadas: { lat: -3.7319, lng: -38.5267 }
    },
    
    // Prioridade P2 - Vazão Direta
    {
      nome: 'Reservatório Pacoti',
      categoria: 'reservatorio' as const,
      municipio: 'Pacoti',
      coordenadas: { lat: -4.2256, lng: -38.9233 }
    },
    {
      nome: 'Poço Tubular Messejana',
      categoria: 'poco' as const,
      municipio: 'Fortaleza',
      coordenadas: { lat: -3.8167, lng: -38.4833 }
    },
    
    // Prioridade P3 - Horas Bombeadas + Foto
    {
      nome: 'Estação Elevatória Caucaia',
      categoria: 'bombeamento' as const,
      municipio: 'Caucaia',
      coordenadas: { lat: -3.7258, lng: -38.6531 }
    },
    {
      nome: 'Sistema Gavião - Bombeamento Secundário',
      categoria: 'bombeamento' as const,
      municipio: 'Pacatuba',
      coordenadas: { lat: -3.8567, lng: -38.6156 }
    },
    
    // Prioridade P4 - Nível + Foto (Curva-chave)
    {
      nome: 'Canal Maracanaú - Seção 1',
      categoria: 'canal' as const,
      municipio: 'Maracanaú',
      coordenadas: { lat: -3.8767, lng: -38.6256 }
    },
    {
      nome: 'Adutora RMF - Ponto de Controle',
      categoria: 'adutora' as const,
      municipio: 'Eusébio',
      coordenadas: { lat: -3.8833, lng: -38.4500 }
    }
  ];

  const prioridades: Array<'P1' | 'P2' | 'P3' | 'P4'> = ['P1', 'P1', 'P1', 'P2', 'P2', 'P3', 'P3', 'P4', 'P4'];
  const metodologias = {
    P1: 'Totalizador acumulado + foto',
    P2: 'Vazão direta informada',
    P3: 'Horas bombeadas + foto',
    P4: 'Nível + foto (curva-chave)'
  };
  
  const coletores = ['João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Ferreira'];
  const validadores = ['Eng. Roberto Lima', 'Eng. Fernanda Rocha', 'Eng. Marcos Alves'];
  const statusOptions: Array<'ativo' | 'inativo' | 'manutencao'> = ['ativo', 'ativo', 'ativo', 'ativo', 'inativo', 'manutencao'];

  return pontos.map((ponto, index) => {
    const prioridade = prioridades[index];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const vazaoBase = Math.random() * 2000 + 500; // 500-2500 L/s
    
    // Dados específicos por prioridade
    const dadosEspecificos: Partial<VazaoDataPoint> = {};
    
    switch (prioridade) {
      case 'P1':
        dadosEspecificos.totalizador_acumulado = Math.floor(Math.random() * 100000 + 50000);
        dadosEspecificos.foto_obrigatoria = true;
        break;
      case 'P3':
        dadosEspecificos.horas_bombeadas = Math.floor(Math.random() * 20 + 4);
        dadosEspecificos.foto_obrigatoria = true;
        break;
      case 'P4':
        dadosEspecificos.nivel_medido = Math.random() * 5 + 1; // 1-6 metros
        dadosEspecificos.curva_chave_aplicada = true;
        dadosEspecificos.foto_obrigatoria = true;
        break;
    }

    return {
      id: (index + 1).toString(),
      nome: ponto.nome,
      categoria: ponto.categoria,
      prioridade,
      metodologia: metodologias[prioridade],
      vazao: Number(vazaoBase.toFixed(1)),
      data_coleta: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status,
      localizacao: {
        municipio: ponto.municipio,
        coordenadas: ponto.coordenadas
      },
      coletado_por: coletores[Math.floor(Math.random() * coletores.length)],
      validado_por: Math.random() > 0.3 ? validadores[Math.floor(Math.random() * validadores.length)] : undefined,
      observacoes: Math.random() > 0.7 ? 'Funcionamento normal' : undefined,
      ...dadosEspecificos
    };
  });
}

// Dados mockados para desenvolvimento
export const allVazaoData = generateMockVazaoData();

// Labels para métricas
export const metricLabels = {
  vazao: 'Vazão (L/s)',
  pontos_ativos: 'Pontos Ativos',
  total_pontos: 'Total de Pontos',
  taxa_operacional: 'Taxa Operacional (%)'
};

// Opções de filtro
export const categoriaOptions = [
  { value: 'todas', label: 'Todas as Categorias' },
  { value: 'bombeamento', label: 'Bombeamento' },
  { value: 'gravidade', label: 'Gravidade' },
  { value: 'adutora', label: 'Adutora' },
  { value: 'canal', label: 'Canal' },
  { value: 'estacao_tratamento', label: 'Estação de Tratamento' },
  { value: 'reservatorio', label: 'Reservatório' },
  { value: 'poco', label: 'Poço' },
  { value: 'outros', label: 'Outros' }
];

export const prioridadeOptions = [
  { value: 'todas', label: 'Todas as Prioridades' },
  { value: 'P1', label: 'P1 - Totalizador + Foto' },
  { value: 'P2', label: 'P2 - Vazão Direta' },
  { value: 'P3', label: 'P3 - Horas Bombeadas + Foto' },
  { value: 'P4', label: 'P4 - Nível + Foto' }
];

export const statusOptions = [
  { value: 'todas', label: 'Todos os Status' },
  { value: 'ativo', label: 'Ativo' },
  { value: 'inativo', label: 'Inativo' },
  { value: 'manutencao', label: 'Manutenção' }
];