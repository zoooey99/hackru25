"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Package } from "lucide-react";
import { InventoryGrid } from "./InventoryGrid";
import { InventoryStats } from "./InventoryStats";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function InventoryDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateItemModalOpen, setIsCreateItemModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    expirationDate: "",
    purchaseDate: "",
    quantity: 1,
  });

  const handleCreateItem = () => {
    // Handle the creation of the new item here
    console.log("New Item:", newItem);
    // Reset the form and close the modal
    setNewItem({
      name: "",
      expirationDate: "",
      purchaseDate: "",
      quantity: 1,
    });
    setIsCreateItemModalOpen(false);
  };

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
          <Button variant="default" size="sm" onClick={() => setIsCreateItemModalOpen(true)}>
            <Package className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <InventoryStats />
      <InventoryGrid searchQuery={searchQuery} />

      {/* Create Item Modal */}
      <Dialog open={isCreateItemModalOpen} onOpenChange={setIsCreateItemModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="expirationDate">Expiration Date</Label>
              <Input
                id="expirationDate"
                value={newItem.expirationDate}
                onChange={(e) => setNewItem({ ...newItem, expirationDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                value={newItem.purchaseDate}
                onChange={(e) => setNewItem({ ...newItem, purchaseDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value, 10) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateItemModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateItem}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );}