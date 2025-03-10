"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, AlertTriangle, Package } from "lucide-react";
import { InventoryItemModal } from "./InventoryItemModal";

// Mock data - replace with actual API data
interface InventoryAssessment {
  Name: string;
  Quantity: number;
  "Days Until Expiration": number;
  "Predicted Quantity at Expiration": number | "N/A";
  Status: InventoryStatus;
  Color?: string; // Adding optional Color property
}

interface InventoryItem {
  Name: string;
  Price: number;
  "Purchase Date": string;
  "Expiration Date": string;
  Quantity: number;
  Supplier: string;
  Assessment: InventoryAssessment[];
}
type InventoryStatus = "Healthy Stock" | "Low Stock" | "Critical - Near Expiration" | "Expired";


interface InventoryGridProps {
  searchQuery: string;
}

export function InventoryGrid({ searchQuery }: InventoryGridProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      // In your fetch code:
      try {
        const response = await fetch('https://wakefernbackend.onrender.com/getInventory');
        const data: InventoryItem[] = await response.json();
        
        const processedData = data.map(item => ({
          ...item,
          Assessment: item.Assessment.map(assessment => ({
            ...assessment,
            // Using Tailwind color classes instead of hex values
            Color: assessment.Status === "Healthy Stock" ? "bg-green-500" :
                  assessment.Status === "Low Stock" ? "bg-yellow-500" :
                  assessment.Status === "Critical - Near Expiration" ? "bg-red-500" :
                  assessment.Status === "Expired" ? "bg-gray-900" :
                  "bg-gray-500"
          }))
        }));
        
        setItems(processedData);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, []);

  const filteredItems = items.filter(item =>
    item.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item, index) => (
          <Card key={`${item.Name}-${index}`} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{item.Name}</h3>
              </div>
              <Badge className={`${item.Assessment[0]?.Color} text-white flex items-center gap-1`}>
              {item.Assessment[0]?.Status}
            </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Current Stock</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{item.Quantity} units</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Unit Price</span>
                <span className="font-semibold">${item.Price}</span>
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
                  disabled={item.Assessment[0]?.Status === "Healthy Stock"}
                >
                  Restock
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {selectedItem && (
        <InventoryItemModal
          item={{ name: selectedItem.Name }}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

