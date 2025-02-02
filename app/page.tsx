"use client"

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryDashboard } from "@/components/inventory/InventoryDashboard";
import { ShipmentsDashboard } from "@/components/shipments/ShipmentsDashboard";
import { X, MessageCircle } from "lucide-react";
import ChatBotModal from "@/components/chat-modal";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="container mx-auto py-8 relative">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">IntelliStock.ai</h1>
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

      {/* Floating Chatbot Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition-all"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chatbot Modal */}
      {isChatOpen && <ChatBotModal onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}