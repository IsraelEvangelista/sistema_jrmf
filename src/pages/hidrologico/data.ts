// Tipos e utilitários compartilhados para o Portal Hidrológico
// Mantém a mesma estrutura já utilizada na página original

export type MetricKey = "flowDaily" | "volumeDaily" | "volumeAccum";

export interface DataPoint {
  date: string; // ISO date (YYYY-MM-DD)
  name: string; // Nome do açude/seção de rio
  segment: "acude" | "infra"; // Segmentação (açudes ou seções de rio)
  flowDaily: number; // m³/s - Vazão diária
  volumeDaily: number; // hm³ - Volume diário
  volumeAccum: number; // hm³ - Volume acumulado
  // Campos específicos para coleta conforme documentação
  cota?: number; // Leitura da cota (m)
  regua?: number; // Leitura da régua (m)
  fotoObrigatoria?: string; // URL da foto obrigatória
  coletadoPor?: string; // Usuário que fez a coleta
  validadoPor?: string; // Usuário que validou (gerência regional)
  status?: 'coletado' | 'validado' | 'enviado_sigerh'; // Status da coleta
  observacoes?: string; // Observações da coleta
}

export const formatDateBR = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
};

export function generateMockData(): DataPoint[] {
  const baseDates = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });

  // 14 Açudes monitorados conforme documentação técnica
  const acudes = [
    { name: "Açude Castanhão", segment: "acude" as const },
    { name: "Açude Orós", segment: "acude" as const },
    { name: "Açude Banabuiú", segment: "acude" as const },
    { name: "Açude Araras", segment: "acude" as const },
    { name: "Açude Cedro", segment: "acude" as const },
    { name: "Açude Gavião", segment: "acude" as const },
    { name: "Açude Pacajus", segment: "acude" as const },
    { name: "Açude Pacoti", segment: "acude" as const },
    { name: "Açude Riachão", segment: "acude" as const },
    { name: "Açude Sítios Novos", segment: "acude" as const },
    { name: "Açude Várzea do Boi", segment: "acude" as const },
    { name: "Açude Fogareiro", segment: "acude" as const },
    { name: "Açude Pentecoste", segment: "acude" as const },
    { name: "Açude General Sampaio", segment: "acude" as const }
  ];

  // 5 Seções de rio monitoradas conforme documentação técnica
  const secoesRio = [
    { name: "Seção Rio Jaguaribe - Iguatu", segment: "infra" as const },
    { name: "Seção Rio Jaguaribe - Limoeiro do Norte", segment: "infra" as const },
    { name: "Seção Rio Banabuiú - Morada Nova", segment: "infra" as const },
    { name: "Seção Rio Salgado - Icó", segment: "infra" as const },
    { name: "Seção Rio Curu - Pentecoste", segment: "infra" as const }
  ];

  const assets = [...acudes, ...secoesRio];

  const data: DataPoint[] = [];

  for (const asset of assets) {
    let accum = 0;
    baseDates.forEach((date, idx) => {
      const flow = Math.max(0, 20 + Math.sin((idx / 6) * Math.PI) * 8 + (asset.segment === "infra" ? 3 : 0));
      const vol = Math.max(0, 0.8 + Math.cos((idx / 7) * Math.PI) * 0.5 + (asset.segment === "acude" ? 0.2 : 0));
      accum += vol;
      
      // Simular dados de cota e régua para açudes
      const cota = asset.segment === "acude" ? Number((150 + Math.random() * 50).toFixed(2)) : undefined;
      const regua = asset.segment === "acude" ? Number((cota ? cota - 145 : 0).toFixed(2)) : undefined;
      
      // Simular status de coleta
      const statusOptions: Array<'coletado' | 'validado' | 'enviado_sigerh'> = ['coletado', 'validado', 'enviado_sigerh'];
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      
      data.push({
        date,
        name: asset.name,
        segment: asset.segment,
        flowDaily: Number(flow.toFixed(2)),
        volumeDaily: Number(vol.toFixed(2)),
        volumeAccum: Number(accum.toFixed(2)),
        cota,
        regua,
        fotoObrigatoria: `https://example.com/fotos/${asset.name.replace(/\s+/g, '_')}_${date}.jpg`,
        coletadoPor: `Operador ${Math.floor(Math.random() * 5) + 1}`,
        validadoPor: status !== 'coletado' ? `Supervisor ${Math.floor(Math.random() * 3) + 1}` : undefined,
        status,
        observacoes: Math.random() > 0.7 ? 'Coleta realizada conforme procedimento padrão' : undefined
      });
    });
  }

  return data;
}

export const allData = generateMockData();

export const metricLabels: Record<MetricKey, string> = {
  flowDaily: "Vazão diária (m³/s)",
  volumeDaily: "Volume diário (hm³)",
  volumeAccum: "Volume acumulado (hm³)",
};
