import React, { useEffect, useMemo, useState } from "react";
import PortalLayout from "@/components/portal/PortalLayout";
import Filters from "./hidrologico/Filters";
import Chart from "./hidrologico/Chart";
import DataTable from "./hidrologico/Table";
import { cn } from "@/lib/utils";
import { DataPoint, MetricKey, allData, metricLabels } from "./hidrologico/data";

// -------------------------------------------------------------
// Página: Portal Hidrológico COGERH
// Objetivo: Apresentar vazão diária, volume diário e acumulado
// com segmentações por tipo (Açudes/Infraestruturas) e temporal.
// Layout: Cabeçalho padrão + Sidebar + Conteúdo
// -------------------------------------------------------------

export default function Hidrologico() {
  // Filtros de segmentação
  const [segment, setSegment] = useState<"acudes" | "infraestruturas">("acudes");
  const [asset, setAsset] = useState<string>("todos");
  const [period, setPeriod] = useState<"30d" | "90d">("30d");
  
  // Novos filtros aprimorados
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showValidated, setShowValidated] = useState<boolean>(true);
  const [showInvalidated, setShowInvalidated] = useState<boolean>(true);

  // SEO por página
  useEffect(() => {
    document.title = "Portal Hidrológico COGERH – Vazões e Volumes";
    const metaDescId = "meta-desc-hidrologico";
    let meta = document.querySelector(`meta[name='description']#${metaDescId}`) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      meta.id = metaDescId;
      document.head.appendChild(meta);
    }
    meta.content = "Portal Hidrológico COGERH com vazão diária, volume diário e acumulado por açudes e infraestruturas.";

    const existingCanonical = document.querySelector("link[rel='canonical']");
    if (!existingCanonical) {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", window.location.origin + "/portal/hidrologico");
      document.head.appendChild(link);
    }
  }, []);

  // Opções de ativos conforme a segmentação
  const assetOptions = useMemo(() => {
    const segKey = segment === "acudes" ? "acude" : "infra";
    const names = Array.from(new Set(allData.filter(d => d.segment === segKey).map(d => d.name)));
    return ["todos", ...names.sort()];
  }, [segment]);

  // Filtra dados conforme segmentação e ativo selecionado
  const filteredData = useMemo<DataPoint[]>(() => {
    const segKey = segment === "acudes" ? "acude" : "infra";
    let arr = allData.filter(d => d.segment === segKey);
    if (asset !== "todos") arr = arr.filter(d => d.name === asset);

    const days = period === "30d" ? 30 : 90;
    if (period === "90d") {
      const repeated = [...arr, ...arr.map(p => ({ ...p })) , ...arr.map(p => ({ ...p }))];
      return repeated.slice(-days);
    }
    return arr.slice(-days);
  }, [segment, asset, period]);

  // Agrupa por data somando valores quando "Todos" está selecionado
  const chartData = useMemo<DataPoint[]>(() => {
    if (asset !== "todos") return filteredData;
    const map = new Map<string, DataPoint>();
    for (const d of filteredData) {
      const key = d.date;
      const prev = map.get(key);
      if (!prev) {
        map.set(key, { ...d });
      } else {
        map.set(key, {
          ...prev,
          flowDaily: Number((prev.flowDaily + d.flowDaily).toFixed(2)),
          volumeDaily: Number((prev.volumeDaily + d.volumeDaily).toFixed(2)),
          volumeAccum: Number((prev.volumeAccum + d.volumeAccum).toFixed(2)),
          name: "Todos",
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredData, asset]);

  return (
    <PortalLayout title="Portal Hidrológico" portalName="Portal Hidrológico COGERH" portalIcon="chart">
      <div className={cn("space-y-6")}>

        <p className="text-muted-foreground">
          Monitoramento de 14 açudes e 5 seções de rio com coleta de cota/régua e registro fotográfico obrigatório
        </p>

        {/* Painel de filtros (colapsável) */}
        <Filters
          segment={segment}
          setSegment={setSegment}
          asset={asset}
          setAsset={setAsset}
          period={period}
          setPeriod={setPeriod}
          assetOptions={assetOptions}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          showValidated={showValidated}
          setShowValidated={setShowValidated}
          showInvalidated={showInvalidated}
          setShowInvalidated={setShowInvalidated}
        />

        {/* Gráfico de linhas */}
        <Chart data={chartData} />

        {/* Tabela de dados */}
        <DataTable data={filteredData} segment={segment} asset={asset} period={period} />
      </div>
    </PortalLayout>
  );
}
