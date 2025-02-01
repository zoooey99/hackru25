"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryDashboard } from "@/components/inventory/InventoryDashboard";
import { ShipmentsDashboard } from "@/components/shipments/ShipmentsDashboard";

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Smart Grocery Manager</h1>
        <p className="text-muted-foreground">AI-Powered Inventory & Demand Forecasting</p>
      </header>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="inventory">Current Inventory</TabsTrigger>
          <TabsTrigger value="shipments">Shipments & Reorders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-4">
          <InventoryDashboard />
        </TabsContent>
        
        <TabsContent value="shipments" className="space-y-4">
          <ShipmentsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}