import { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { HistoryData } from "../types";

interface TrendsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  data: HistoryData[];
  color: string;
  unit?: string;
  chartType?: "line" | "area";
}

export function TrendsDialog({ open, onOpenChange, title, data, color, unit = "", chartType = "line" }: TrendsDialogProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && chartRef.current) {
      setTimeout(() => {
        chartRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Historical data visualization over time</DialogDescription>
        </DialogHeader>
        <div ref={chartRef} className="py-4">
          <ResponsiveContainer width="100%" height={300}>
            {chartType === "area" ? (
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 12 }} />
                <YAxis stroke="#888" tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `${value}${unit}`} />
                <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.3} name={title} />
              </AreaChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 12 }} />
                <YAxis stroke="#888" tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `${value}${unit}`} />
                <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} name={title} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
