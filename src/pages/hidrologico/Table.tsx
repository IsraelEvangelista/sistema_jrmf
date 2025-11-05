import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Info, Camera, CheckCircle, Clock, Send, Check, X, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataPoint, formatDateBR } from "./data";

interface DataTableProps {
  data: DataPoint[];
  segment: "acudes" | "infraestruturas";
  asset: string;
  period: "30d" | "90d";
}

const DataTable: React.FC<DataTableProps> = ({ data, segment, asset, period }) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = data.map((row, idx) => `${row.date}-${row.name}-${idx}`);
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  };
  
  const handleSelectRow = (rowId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
    }
    setSelectedRows(newSelected);
  };
  
  const handleValidar = () => {
    console.log('Validando registros:', Array.from(selectedRows));
    // Implementar lógica de validação
  };
  
  const handleInvalidar = () => {
    console.log('Invalidando registros:', Array.from(selectedRows));
    // Implementar lógica de invalidação
  };
  
  const handleAdicionar = () => {
    console.log('Adicionando novo registro');
    // Implementar lógica de adição
  };
  
  const handleDeletar = () => {
    console.log('Deletando registros:', Array.from(selectedRows));
    // Implementar lógica de exclusão
  };
  
  const isAllSelected = data.length > 0 && selectedRows.size === data.length;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < data.length;
  
  return (
    <Card className="p-3 sm:p-4 bg-gradient-to-br from-white to-gray-100">
      <div className="flex items-center justify-between px-1 sm:px-2">
        <h2 className="text-lg font-medium">Dados tabulares</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="size-4" />
          <span>Valores ilustrativos (mock). Integração real pode ser adicionada via Supabase/ETL.</span>
        </div>
      </div>
      
      {/* Botões de ação */}
      <div className="flex items-center gap-2 px-1 sm:px-2 py-3">
        <Button 
          size="sm" 
          variant="default" 
          onClick={handleValidar}
          disabled={selectedRows.size === 0}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Check className="size-4 mr-1" />
          Validar
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleInvalidar}
          disabled={selectedRows.size === 0}
          className="border-red-600 text-red-600 hover:bg-red-50"
        >
          <X className="size-4 mr-1" />
          Invalidar
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleAdicionar}
          className="border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          <Plus className="size-4 mr-1" />
          Adicionar
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleDeletar}
          disabled={selectedRows.size === 0}
          className="border-red-600 text-red-600 hover:bg-red-50"
        >
          <Trash2 className="size-4 mr-1" />
          Deletar
        </Button>
        {selectedRows.size > 0 && (
          <span className="text-sm text-muted-foreground ml-2">
            {selectedRows.size} registro(s) selecionado(s)
          </span>
        )}
      </div>
      
      <Separator className="my-3" />
      <div className="relative w-full overflow-x-auto">
        <Table>
          <TableCaption>
            Série exibida: {segment === "acudes" ? "Açudes" : "Infraestruturas"}
            {asset !== "todos" ? ` – ${asset}` : " – Todos"} ({period})
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Selecionar todos"
                  className={isIndeterminate ? "data-[state=checked]:bg-primary" : ""}
                />
              </TableHead>
              <TableHead>Data</TableHead>
              <TableHead>{segment === "acudes" ? "Açude" : "Seção de Rio"}</TableHead>
              <TableHead>Vazão diária (m³/s)</TableHead>
              <TableHead>Volume diário (hm³)</TableHead>
              <TableHead>Volume acumulado (hm³)</TableHead>
              {segment === "acudes" && <TableHead>Cota (m)</TableHead>}
              {segment === "acudes" && <TableHead>Régua (m)</TableHead>}
              <TableHead>Foto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Coletado por</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, idx) => {
              const getStatusIcon = (status?: string) => {
                switch (status) {
                  case 'coletado': return <Clock className="size-3" />;
                  case 'validado': return <CheckCircle className="size-3" />;
                  case 'enviado_sigerh': return <Send className="size-3" />;
                  default: return <Clock className="size-3" />;
                }
              };
              
              const getStatusColor = (status?: string) => {
                switch (status) {
                  case 'coletado': return 'bg-yellow-100 text-yellow-800';
                  case 'validado': return 'bg-green-100 text-green-800';
                  case 'enviado_sigerh': return 'bg-blue-100 text-blue-800';
                  default: return 'bg-gray-100 text-gray-800';
                }
              };
              
              const rowId = `${row.date}-${row.name}-${idx}`;
              const isSelected = selectedRows.has(rowId);
              
              return (
                <TableRow key={rowId} className={isSelected ? "bg-blue-50" : ""}>
                  <TableCell>
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectRow(rowId, checked as boolean)}
                      aria-label={`Selecionar registro ${row.name}`}
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{formatDateBR(row.date)}</TableCell>
                  <TableCell className="whitespace-nowrap">{row.name}</TableCell>
                  <TableCell>{row.flowDaily.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{row.volumeDaily.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{row.volumeAccum.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                  {segment === "acudes" && (
                    <TableCell>{row.cota ? row.cota.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : '-'}</TableCell>
                  )}
                  {segment === "acudes" && (
                    <TableCell>{row.regua ? row.regua.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : '-'}</TableCell>
                  )}
                  <TableCell>
                    {row.fotoObrigatoria ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <Camera className="size-3" />
                        <span className="text-xs">Anexada</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <Camera className="size-3" />
                        <span className="text-xs">Pendente</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`text-xs ${getStatusColor(row.status)}`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(row.status)}
                        {row.status || 'coletado'}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {row.coletadoPor || '-'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default DataTable;
