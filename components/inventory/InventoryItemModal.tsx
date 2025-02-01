"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

interface InventoryItemModalProps {
  item: { name: string };
  isOpen: boolean;
  onClose: () => void;
}

interface InventoryDetails {
  Assessment: {
    "Days Until Expiration": number;
    Name: string;
    "Predicted Quantity at Expiration": number;
    Quantity: number;
    Status: string;
  }[];
  Inventory: {
    "Expiration Date": string;
    Name: string;
    Price: number;
    "Purchase Date": string;
    Quantity: number;
    Supplier: string;
  }[];
  Sales: {
    "Expiration Date": string;
    Name: string;
    Price: number;
    "Purchase Date": string;
    Quantity: number;
    "Sale Date": string;
    Supplier: string;
  }[];
}

export function InventoryItemModal({ item, isOpen, onClose }: InventoryItemModalProps) {
  const [details, setDetails] = useState<InventoryDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && item) {
      fetch('https://wakefernbackend.onrender.com/getDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: item }),
      })
        .then(response => response.json())
        .then(data => {
          setDetails(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching details:', error);
          setLoading(false);
        });
    }
  }, [isOpen, item]);

  if (!isOpen || !details) return null;

  const assessment = details.Assessment[0];
  const inventory = details.Inventory[0];
  const salesData = details.Sales.map(sale => ({
    date: format(new Date(sale["Sale Date"]), "MMM dd"),
    quantity: sale.Quantity,
    price: sale.Price,
  })).reverse();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold mb-2">{item.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">Supplier: {inventory.Supplier}</p>
            </div>
            <Badge variant={assessment.Status === "Healthy Stock" ? "secondary" : "destructive"}>
              {assessment.Status}
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
                  <span className="font-semibold">{assessment.Quantity} units</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unit Price</p>
                <p className="font-semibold mt-1">${inventory.Price}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Days Until Expiration</p>
                <p className="font-semibold mt-1">{assessment["Days Until Expiration"]} days</p>
              </div>
            </div>
          </Card>

          {/* Sales History Graph */}
          <Card className="p-4">
            <h3 className="font-semibold mb-6">Sales History</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="quantity"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline">Set Auto-Restock Rules</Button>
            <Button disabled={assessment.Quantity > 0}>
              <Package className="h-4 w-4 mr-2" />
              Restock Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}