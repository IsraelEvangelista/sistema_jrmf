import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { categoriaOptions, prioridadeOptions, statusOptions } from "./data";

interface FiltersProps {
  prioridade: string;
  setPrioridade: (v: string) => void;
  categoria: string;
  setCategoria: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
}

// Painel de filtros colapsável para o Portal de Vazões Jaguaribe RMF
const Filters: React.FC<FiltersProps> = ({ 
  prioridade, 
  setPrioridade, 
  categoria, 
  setCategoria, 
  status, 
  setStatus 
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
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm text-muted-foreground">Prioridade</label>
              <Select value={prioridade} onValueChange={setPrioridade}>
                <SelectTrigger aria-label="Escolher prioridade">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {prioridadeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-muted-foreground">Categoria</label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger aria-label="Escolher categoria">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  {categoriaOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-muted-foreground">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger aria-label="Escolher status">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default Filters;