"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, AlertTriangle, Package } from "lucide-react";
import { InventoryItemModal } from "./InventoryItemModal";

// Mock data - replace with actual API data
const mockItems = [
  {
    id: 1,
    name: "Organic Bananas",
    sku: "FRUIT-001",
    stock: 150,
    threshold: 100,
    trend: "up",
    price: 2.99,
    category: "Produce",
  },
  {
    id: 2,
    name: "Whole Milk",
    sku: "DAIRY-001",
    stock: 80,
    threshold: 100,
    trend: "down",
    price: 4.49,
    category: "Dairy",
  },
  // Add more mock items as needed
];

interface InventoryGridProps {
  searchQuery: string;
}

export function InventoryGrid({ searchQuery }: InventoryGridProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredItems = mockItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
              </div>
              <Badge variant={item.stock < item.threshold ? "destructive" : "secondary"}>
                {item.stock < item.threshold ? "Low Stock" : item.category}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Current Stock</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{item.stock} units</span>
                  {item.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-chart-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Unit Price</span>
                <span className="font-semibold">${item.price}</span>
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleItemClick(item)}
                >
                  View Details
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex-1"
                  disabled={item.stock >= item.threshold}
                >
                  Restock
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <InventoryItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}