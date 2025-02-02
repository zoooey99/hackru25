"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, Clock, CheckCircle, Loader2 } from "lucide-react";

interface Order {
  item: string;
  quantity: number;
  purchaseDate: string;
  deliveryDate: string;
  expirationDate: string;
  supplier: string;
  pricePaid: number;
}

interface ApiResponse {
  orders: Order[];
}

export function ShipmentsDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://wakefernbackend.onrender.com/getOrders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data: ApiResponse = await response.json();
        setOrders(data.orders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">AI Recommendations</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
              <Package className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-medium">Restock Alert: Dairy Products</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Projected stock depletion in 5 days. Recommended order: 200 units
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm">Approve Order</Button>
                  <Button variant="outline" size="sm">Modify</Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Deliveries</h2>
          <div className="space-y-4">
            {orders.slice(0, 2).map((order, index) => (
              <OrderCard key={index} order={order} />
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="space-y-4">
          {orders.map((order, index) => (
            <RecentOrderCard key={index} order={order} />
          ))}
        </div>
      </Card>
    </div>
  );
}

interface OrderCardProps {
  order: Order;
}

function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="flex items-start gap-4">
      <Truck className="h-5 w-5 text-primary mt-1" />
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{order.item}</h3>
          <Badge variant="outline">In Transit</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Expected: {order.deliveryDate}
        </p>
        <Button variant="link" className="p-0 h-auto mt-1">
          Track Shipment
        </Button>
      </div>
    </div>
  );
}

function RecentOrderCard({ order }: OrderCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
      <div className="flex items-start gap-4">
        <Clock className="h-5 w-5 text-primary mt-1" />
        <div>
          <h3 className="font-medium">{order.item}</h3>
          <p className="text-sm text-muted-foreground">Placed on {order.purchaseDate}</p>
        </div>
      </div>
      <Badge variant="secondary">
        <CheckCircle className="h-4 w-4 mr-1" />
        Completed
      </Badge>
    </div>
  );
}