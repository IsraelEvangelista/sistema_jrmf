import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Info, LineChart as LineChartIcon } from "lucide-react";
import {
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DataPoint, MetricKey, metricLabels, formatDateBR } from "./data";

interface ChartProps {
  data: DataPoint[];
  className?: string;
}

const Chart: React.FC<ChartProps> = ({ data, className }) => {
  return (
    <Card className={cn("p-4 sm:p-6 bg-gradient-to-br from-white to-gray-100", className)}>
      <div className="flex items-center gap-2 mb-3">
        <LineChartIcon className="size-5 text-primary" />
        <h2 className="text-lg font-medium">Série temporal</h2>
      </div>
      <div className="w-full h-[280px] bg-white rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <RLineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tickFormatter={formatDateBR} stroke="hsl(var(--muted-foreground))" />
            <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" hide />
            <Tooltip
              contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }}
              labelFormatter={(label) => `Data: ${formatDateBR(String(label))}`}
              formatter={(value: number | string, name: string) => {
                const label = metricLabels[name as MetricKey] ?? name;
                return [value as number, label];
              }}
            />
            <Legend />
            <Line type="monotone" yAxisId="left" dataKey="flowDaily" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} name={metricLabels.flowDaily} />
            <Line type="monotone" yAxisId="left" dataKey="volumeDaily" stroke="hsl(var(--secondary))" dot={false} strokeWidth={2} name={metricLabels.volumeDaily} />
            <Line type="monotone" yAxisId="left" dataKey="volumeAccum" stroke="hsl(var(--muted-foreground))" dot={false} strokeWidth={2} name={metricLabels.volumeAccum} />
          </RLineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default Chart;
