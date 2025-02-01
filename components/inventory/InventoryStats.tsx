"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, AlertTriangle, Package, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

export function InventoryStats() {
  const [totalItems, setTotalItems] = useState(0);
  const [lowStockAlerts, setLowStockAlerts] = useState(0);
  const [weeklySales, setWeeklySales] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    // Fetch inventory data
    fetch('https://wakefernbackend.onrender.com/getInventory')
      .then(response => response.json())
      .then(data => {
        const totalItemsCount = data.length;
        const lowStockItemsCount = data.filter(item => item.Quantity < 10).length; // Assuming low stock is less than 10
        setTotalItems(totalItemsCount);
        setLowStockAlerts(lowStockItemsCount);
      })
      .catch(error => console.error('Error fetching inventory:', error));

    // Fetch sales data
    fetch('https://wakefernbackend.onrender.com/getSales')
      .then(response => response.json())
      .then(data => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const recentSales = data.filter(sale => {
          const saleDate = new Date(sale["Sale Date"]);
          return saleDate >= oneWeekAgo;
        });

        const totalSales = recentSales.reduce((sum, sale) => sum + sale.Price * sale.Quantity, 0);
        setWeeklySales(totalSales);
      })
      .catch(error => console.error('Error fetching sales:', error));

    // Placeholder for pending orders (assuming no direct endpoint for this)
    setPendingOrders(18); // Replace with actual logic if available
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total Items</span>
          <Package className="h-4 w-4 text-primary" />
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold">{totalItems}</h3>
          <span className="text-sm text-muted-foreground">items</span>
        </div>
      </Card>

      <Card className="p-6 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Low Stock Alerts</span>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold">{lowStockAlerts}</h3>
          <span className="text-sm text-destructive">items below threshold</span>
        </div>
      </Card>

      <Card className="p-6 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Weekly Sales</span>
          <TrendingUp className="h-4 w-4 text-chart-1" />
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold">${(weeklySales / 1000).toFixed(1)}K</h3>
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
          <h3 className="text-2xl font-bold">{pendingOrders}</h3>
          <span className="text-sm text-muted-foreground">orders</span>
        </div>
      </Card>
    </div>
  );
}