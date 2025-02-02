"use client";

import { TrendingUp, AlertTriangle, Package, ArrowUpRight, RefreshCw } from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";
import toast, { Toaster } from 'react-hot-toast';

// Custom hook for fetching data
function useFetchData(url: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function InventoryStats() {
  const [lowStockThreshold] = useState(10);
  const { data: inventoryData, loading: inventoryLoading, error: inventoryError, refetch: refetchInventory } = useFetchData('https://wakefernbackend.onrender.com/getInventory');
  const { data: salesData, loading: salesLoading, error: salesError, refetch: refetchSales } = useFetchData('https://wakefernbackend.onrender.com/getSales');
  const [pendingOrders] = useState(18);

  // Calculate derived data
  const totalItems = useMemo(() => inventoryData?.length || 0, [inventoryData]);
  const lowStockAlerts = useMemo(() => inventoryData?.filter((item: any) => item.Quantity < lowStockThreshold).length || 0, [inventoryData, lowStockThreshold]);
  const weeklySales = useMemo(() => {
    if (!salesData) return 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return salesData
      .filter((sale: any) => new Date(sale["Sale Date"]) >= oneWeekAgo)
      .reduce((sum: number, sale: any) => sum + sale.Price * sale.Quantity, 0);
  }, [salesData]);

  // Handle data refresh
  const handleRefresh = useCallback(async () => {
    await Promise.all([refetchInventory(), refetchSales()]);
    toast.success('Data refreshed successfully');
  }, [refetchInventory, refetchSales]);

  // Display error toasts
  useEffect(() => {
    if (inventoryError) {
      toast.error(`Inventory Error: ${inventoryError}`);
    }
    if (salesError) {
      toast.error(`Sales Error: ${salesError}`);
    }
  }, [inventoryError, salesError]);

  return (
    <div className="space-y-4">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Inventory Overview</h2>
        <button 
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          onClick={handleRefresh} 
          disabled={inventoryLoading || salesLoading}
        >
          <RefreshCw className={`h-4 w-4 ${inventoryLoading || salesLoading ? "animate-spin" : ""}`} />
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Items */}
        <div className="p-6 space-y-2 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Total Items</span>
            <Package className="h-4 w-4 text-blue-600" />
          </div>
          {inventoryLoading ? (
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
          ) : (
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">{totalItems}</h3>
              <span className="text-sm text-gray-500">items</span>
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="p-6 space-y-2 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Low Stock Alerts</span>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          {inventoryLoading ? (
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
          ) : (
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">{lowStockAlerts}</h3>
              <span className="text-sm text-red-600">items below {lowStockThreshold}</span>
            </div>
          )}
        </div>

        {/* Weekly Sales */}
        <div className="p-6 space-y-2 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Weekly Sales</span>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          {salesLoading ? (
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
          ) : (
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(weeklySales)}
              </h3>
              <span className="text-sm text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3" />
                12%
              </span>
            </div>
          )}
        </div>

        {/* Pending Orders */}
        <div className="p-6 space-y-2 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Pending Orders</span>
            <Package className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">{pendingOrders}</h3>
            <span className="text-sm text-gray-500">orders</span>
          </div>
        </div>
      </div>
    </div>
  );
}