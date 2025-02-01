"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, AlertTriangle, TrendingUp, Package } from "lucide-react";
import { InventoryGrid } from "./InventoryGrid";
import { InventoryStats } from "./InventoryStats";

export function InventoryDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 w-full md:max-w-sm">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="default" size="sm">
            <Package className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <InventoryStats />
      <InventoryGrid searchQuery={searchQuery} />
    </div>
  );
}