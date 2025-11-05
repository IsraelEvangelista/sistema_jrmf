import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

interface FiltersProps {
  segment: "acudes" | "infraestruturas";
  setSegment: (v: "acudes" | "infraestruturas") => void;
  asset: string;
  setAsset: (v: string) => void;
  period: "30d" | "90d";
  setPeriod: (v: "30d" | "90d") => void;
  assetOptions: string[];
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  showValidated: boolean;
  setShowValidated: (v: boolean) => void;
  showInvalidated: boolean;
  setShowInvalidated: (v: boolean) => void;
}

// Painel de filtros colapsável, estilizado com o design system
const Filters: React.FC<FiltersProps> = ({ 
  segment, setSegment, asset, setAsset, period, setPeriod, assetOptions,
  startDate, setStartDate, endDate, setEndDate, showValidated, setShowValidated, showInvalidated, setShowInvalidated 
}) => {
  const [open, setOpen] = useState(true);

  return (
    <Card className="p-0 overflow-hidden shadow-card bg-gradient-to-br from-white to-gray-100">
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-card">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-medium">Filtros</h2>
        </div>
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              {open ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" /> Recolher
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" /> Expandir
                </>
              )}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </div>

      <Collapsible open={open}>
        <CollapsibleContent>
          <div className="p-4 space-y-4">
            {/* Primeira linha - Filtros principais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">Segmento</label>
                <Select value={segment} onValueChange={(v: "acudes" | "infraestruturas") => setSegment(v)}>
                  <SelectTrigger aria-label="Escolher segmento">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acudes">Açudes</SelectItem>
                    <SelectItem value="infraestruturas">Seções de Rio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1 block text-sm text-muted-foreground">Nome</label>
                <Select value={asset} onValueChange={(v: string) => setAsset(v)}>
                  <SelectTrigger aria-label="Escolher nome">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    {assetOptions.map((op) => (
                      <SelectItem key={op} value={op}>
                        {op === "todos" ? "Todos" : op}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1 block text-sm text-muted-foreground">Data Inicial</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-muted-foreground">Data Final</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Segunda linha - Validação */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="validated"
                  checked={showValidated}
                  onCheckedChange={setShowValidated}
                />
                <label htmlFor="validated" className="text-sm text-muted-foreground cursor-pointer">
                  Validado
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="invalidated"
                  checked={showInvalidated}
                  onCheckedChange={setShowInvalidated}
                />
                <label htmlFor="invalidated" className="text-sm text-muted-foreground cursor-pointer">
                  Não Validado
                </label>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Ao menos uma cota não validada
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default Filters;
