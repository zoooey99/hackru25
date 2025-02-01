"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, AlertTriangle, Package, ArrowUpRight } from "lucide-react";

export function InventoryStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total Items</span>
          <Package className="h-4 w-4 text-primary" />
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold">1,234</h3>
          <span className="text-sm text-muted-foreground">items</span>
        </div>
      </Card>

      <Card className="p-6 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Low Stock Alerts</span>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold">23</h3>
          <span className="text-sm text-destructive">items below threshold</span>
        </div>
      </Card>

      <Card className="p-6 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Weekly Sales</span>
          <TrendingUp className="h-4 w-4 text-chart-1" />
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold">$45.2K</h3>
          <span className="text-sm text-chart-1 flex items-center">
            <ArrowUpRight className="h-3 w-3" />
            12%
          </span>
        </div>
      </Card>

      <Card className="p-6 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Pending Orders</span>
          <Package className="h-4 w-4 text-primary" />
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold">18</h3>
          <span className="text-sm text-muted-foreground">orders</span>
        </div>
      </Card>
    </div>
  );
}