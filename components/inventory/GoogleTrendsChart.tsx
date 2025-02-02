"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format, parseISO } from "date-fns"
import { AlertCircle, TrendingDown, TrendingUp, RefreshCw } from "lucide-react"

interface TrendData {
  date: string
  value: number
}

interface GoogleTrendsChartProps {
  searchPhrase: string
  onReconfigureOrder?: () => void
}

export function GoogleTrendsChart({ searchPhrase, onReconfigureOrder }: GoogleTrendsChartProps) {
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trendAnalysis, setTrendAnalysis] = useState<{
    percentChange: number;
    direction: 'up' | 'down' | null;
  }>({ percentChange: 0, direction: null })

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("https://wakefernbackend.onrender.com/getGoogleTrends", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: searchPhrase }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.data[searchPhrase]) {
          const trends = data.data[searchPhrase]
          setTrendData(trends)
          
          // Calculate trend percentage
          if (trends.length >= 2) {
            const firstValue = trends[0].value
            const lastValue = trends[trends.length - 1].value
            const change = ((lastValue - firstValue) / firstValue) * 100
            setTrendAnalysis({
              percentChange: Math.abs(change),
              direction: change > 0 ? 'up' : 'down'
            })
          }
        } else {
          throw new Error("Invalid data format received")
        }
      } catch (err) {
        setError("Failed to fetch Google Trends data. Please try again.")
        console.error("Error fetching Google Trends data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrendData()
  }, [searchPhrase])

  if (loading) {
    return <div className="h-[300px] flex items-center justify-center">Loading...</div>
  }

  if (error) {
    return <div className="h-[300px] flex items-center justify-center text-red-500">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(parseISO(date), "MMM dd")}
              className="text-xs"
              style={{ fontSize: "12px" }}
            />
            <YAxis className="text-xs" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              labelFormatter={(date) => format(parseISO(date), "MMM dd, yyyy")}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {trendAnalysis.percentChange >= 5 && (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg flex items-center gap-2 ${
            trendAnalysis.direction === 'up' 
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {trendAnalysis.direction === 'up' ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
            <span className="font-medium">
              {trendAnalysis.direction === 'up' ? 'Trending Up' : 'Trending Down'}: 
              {' '}{trendAnalysis.percentChange.toFixed(1)}% change in search interest
            </span>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-3">
            <div className="flex items-start gap-2 text-blue-700">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p>
                {trendAnalysis.direction === 'up' 
                  ? 'Due to increasing search trends, consider adjusting your order quantity upward to meet potential higher demand.'
                  : 'Due to decreasing search trends, consider reviewing and potentially adjusting your order quantity downward to avoid excess inventory.'}
              </p>
            </div>
            <button
              onClick={onReconfigureOrder}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Reconfigure Order
            </button>
          </div>
        </div>
      )}
    </div>
  )
}