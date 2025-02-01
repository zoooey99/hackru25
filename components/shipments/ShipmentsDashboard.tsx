"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, Clock, CheckCircle } from "lucide-react";

export function ShipmentsDashboard() {
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
            <div className="flex items-start gap-4">
              <Truck className="h-5 w-5 text-primary mt-1" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Order #12345</h3>
                  <Badge variant="outline">In Transit</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Expected: Tomorrow, 10:00 AM
                </p>
                <Button variant="link" className="p-0 h-auto mt-1">
                  Track Shipment
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((order) => (
            <div key={order} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-4">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Order #{order + 5000}</h3>
                  <p className="text-sm text-muted-foreground">Placed on April {order + 10}, 2024</p>
                </div>
              </div>
              <Badge variant="secondary">
                <CheckCircle className="h-4 w-4 mr-1" />
                Completed
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}