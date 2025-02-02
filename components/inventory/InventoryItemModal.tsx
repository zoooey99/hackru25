"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { Package, AlertCircle, TrendingUp, Calendar, DollarSign, Box } from "lucide-react";
import toast from 'react-hot-toast';

// Strong TypeScript types
type InventoryStatus = "Healthy Stock" | "Low Stock" | "Critical Stock";

interface SaleRecord {
  "Expiration Date": string;
  Name: string;
  Price: number;
  "Purchase Date": string;
  Quantity: number;
  "Sale Date": string;
  Supplier: string;
}

interface InventoryAssessment {
  "Days Until Expiration": number;
  Name: string;
  "Predicted Quantity at Expiration": number;
  Quantity: number;
  Status: InventoryStatus;
}

interface InventoryRecord {
  "Expiration Date": string;
  Name: string;
  Price: number;
  "Purchase Date": string;
  Quantity: number;
  Supplier: string;
}

interface InventoryDetails {
  Assessment: InventoryAssessment[];
  Inventory: InventoryRecord[];
  Sales: SaleRecord[];
}

interface InventoryItemModalProps {
  item: { name: string };
  isOpen: boolean;
  onClose: () => void;
}

// Custom hooks for better organization and reusability
const useInventoryDetails = (item: { name: string }, isOpen: boolean) => {
  const [state, setState] = useState<{
    details: InventoryDetails | null;
    loading: boolean;
    error: string | null;
  }>({
    details: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    const fetchDetails = async () => {
      if (!isOpen || !item) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await fetch('https://wakefernbackend.onrender.com/getDetails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: item }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.Assessment?.length || !data.Inventory?.length) {
          throw new Error("Invalid or empty data received");
        }

        if (mounted) {
          setState({ details: data, loading: false, error: null });
        }
      } catch (error) {
        console.error('Error fetching details:', error);
        if (mounted) {
          setState({
            details: null,
            loading: false,
            error: "Failed to load inventory details. Please try again.",
          });
        }
      }
    };

    fetchDetails();

    return () => {
      mounted = false;
    };
  }, [isOpen, item]);

  return state;
};

// Utility functions for calculations
const calculateSalesMetrics = (sales: SaleRecord[]) => {
  return sales.reduce((acc, sale) => {
    const saleAmount = sale.Price * sale.Quantity;
    const daysDiff = (new Date(sale["Sale Date"]).getTime() - new Date(sale["Purchase Date"]).getTime()) / (1000 * 3600 * 24);
    
    return {
      totalRevenue: acc.totalRevenue + saleAmount,
      totalDays: acc.totalDays + daysDiff,
      totalQuantity: acc.totalQuantity + sale.Quantity,
    };
  }, { totalRevenue: 0, totalDays: 0, totalQuantity: 0 });
};

// Reusable components for better organization
const StatCard = ({ label, value, icon: Icon }: { label: string; value: string | number; icon: any }) => (
  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="h-4 w-4 text-blue-500" />
      <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
    </div>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

// Main component with improved organization and error handling
export function InventoryItemModal({ item, isOpen, onClose }: InventoryItemModalProps) {
  const { details, loading, error } = useInventoryDetails(item, isOpen);

  const handleRestock = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Restock order placed successfully');
    } catch {
      toast.error('Failed to place restock order');
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-3xl mx-4">
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-3xl mx-4">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="text-lg font-medium">{error || 'No data available'}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const assessment = details.Assessment[0];
  const inventory = details.Inventory[0];
  const metrics = calculateSalesMetrics(details.Sales);
  const averageDailySales = (metrics.totalQuantity / metrics.totalDays).toFixed(2);

  const salesData = details.Sales
    .map(sale => ({
      date: format(new Date(sale["Sale Date"]), "MMM dd"),
      quantity: sale.Quantity,
      revenue: sale.Price * sale.Quantity,
    }))
    .reverse();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-3xl mx-4 my-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
            <p className="text-sm text-gray-500">Supplier: {inventory.Supplier}</p>
          </div>
          <div className={`px-3 py-1 rounded-full ${
            assessment.Status === "Healthy Stock" 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            {assessment.Status}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <StatCard 
            label="Current Stock"
            value={`${assessment.Quantity} units`}
            icon={Box}
          />
          <StatCard 
            label="Unit Price"
            value={`$${inventory.Price}`}
            icon={DollarSign}
          />
          <StatCard 
            label="Days Until Expiration"
            value={`${assessment["Days Until Expiration"]} days`}
            icon={Calendar}
          />
          <StatCard 
            label="Average Daily Sales"
            value={`${averageDailySales} units/day`}
            icon={TrendingUp}
          />
          <StatCard 
            label="Predicted Stock at Expiration"
            value={`${assessment["Predicted Quantity at Expiration"]} units`}
            icon={Package}
          />
        </div>

        {/* Sales Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-4">Sales History</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs" 
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  className="text-xs"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="quantity"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={handleRestock}
            disabled={assessment.Quantity > 0}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Package className="h-4 w-4" />
            Restock Now
          </button>
        </div>
      </div>
    </div>
  );
}