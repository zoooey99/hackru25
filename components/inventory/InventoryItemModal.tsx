"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown, Package, ArrowUpRight, ArrowDownRight, Users, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

interface InventoryItemModalProps {
  item: any;
  isOpen: boolean;
  onClose: () => void;
}

export function InventoryItemModal({ item, isOpen, onClose }: InventoryItemModalProps) {
  const [selectedMetric, setSelectedMetric] = useState<"units" | "revenue" | "transactions">("units");
  
  if (!item) return null;

  // Generate 14 days of mock data
  const consumerPurchases = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), i);
    const baseUnits = 50 + Math.floor(Math.random() * 40);
    const transactions = Math.floor(baseUnits * (0.6 + Math.random() * 0.4));
    return {
      date: format(date, "MMM dd"),
      rawDate: date,
      transactions,
      unitsSold: baseUnits,
      avgUnitsPerTransaction: +(baseUnits / transactions).toFixed(1),
      peakHour: `${14 + Math.floor(Math.random() * 6)}:00`,
      totalRevenue: +(baseUnits * item.price).toFixed(2),
      returnRate: +(Math.random() * 0.03).toFixed(3)
    };
  }).reverse();

  const demandForecast = [
    { period: "Next 7 days", quantity: 180, trend: "up" },
    { period: "Next 30 days", quantity: 750, trend: "up" },
  ];

  const getRiskLevel = (stock: number, threshold: number) => {
    const ratio = stock / threshold;
    if (ratio < 0.5) return { level: "High Risk", color: "destructive" };
    if (ratio < 0.8) return { level: "Medium Risk", color: "warning" };
    if (ratio < 1.2) return { level: "Optimal", color: "success" };
    return { level: "Overstocked", color: "warning" };
  };

  const risk = getRiskLevel(item.stock, item.threshold);

  const metricOptions = [
    { value: "units", label: "Units Sold" },
    { value: "revenue", label: "Revenue" },
    { value: "transactions", label: "Transactions" }
  ];

  const getMetricValue = (day: any) => {
    switch (selectedMetric) {
      case "units":
        return day.unitsSold;
      case "revenue":
        return day.totalRevenue;
      case "transactions":
        return day.transactions;
    }
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case "units":
        return "Units";
      case "revenue":
        return "Revenue ($)";
      case "transactions":
        return "Transactions";
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-semibold">{label}</p>
          <div className="space-y-1 mt-2">
            <p className="text-sm">
              {getMetricLabel()}: <span className="font-medium">{payload[0].value}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Peak Hour: {data.peakHour}
            </p>
            <p className="text-sm text-muted-foreground">
              Return Rate: {(data.returnRate * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold mb-2">{item.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
            </div>
            <Badge variant={item.stock < item.threshold ? "destructive" : "secondary"}>
              {item.category}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid gap-6 mt-6">
          {/* Current Status */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Current Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Stock Level</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-semibold">{item.stock} units</span>
                  {item.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-chart-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unit Price</p>
                <p className="font-semibold mt-1">${item.price}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <Badge variant="outline" className="mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {risk.level}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Consumer Purchase History Graph */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Consumer Purchase History (Last 14 Days)</h3>
              <div className="flex gap-2">
                {metricOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedMetric === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMetric(option.value as any)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={consumerPurchases}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    className="stroke-muted" 
                    horizontal={true}
                    vertical={true}
                  />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    height={60}
                    tickSize={8}
                    tickMargin={8}
                    axisLine={true}
                    scale="point"
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis 
                    className="text-xs"
                    width={60}
                    tickSize={8}
                    tickMargin={8}
                    axisLine={true}
                    scale="linear"
                    domain={['auto', 'auto']}
                    padding={{ top: 10, bottom: 10 }}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    cursor={{ strokeDasharray: '3 3' }}
                  />
                  <Line
                    type="monotone"
                    dataKey={getMetricValue}
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                    isAnimationActive={true}
                    animationDuration={500}
                    animationEasing="ease-in-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Demand Forecast */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">AI-Powered Demand Forecast</h3>
            <div className="space-y-4">
              {demandForecast.map((forecast, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{forecast.period}</p>
                    <p className="text-sm text-muted-foreground">
                      Projected demand: {forecast.quantity} units
                    </p>
                  </div>
                  {forecast.trend === "up" ? (
                    <ArrowUpRight className="h-5 w-5 text-chart-1" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-destructive" />
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline">Set Auto-Restock Rules</Button>
            <Button disabled={item.stock >= item.threshold}>
              <Package className="h-4 w-4 mr-2" />
              Restock Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}