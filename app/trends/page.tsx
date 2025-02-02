"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { format, parseISO, addDays } from "date-fns"
import { AlertCircle, TrendingDown, TrendingUp, RefreshCw, Search, Twitter, Calendar } from "lucide-react"
import { TrendingUp as TiktokTrend } from "lucide-react"

interface PredictionData {
  date: string
  predicted: number
  google: number
  twitter: number
  tiktok: number
  events: number
}

interface InsightSource {
  name: string
  icon: React.ReactNode
  trend: number
  insight: string
  color: string
}

interface DemandPredictionProps {
  itemName: string
  onReconfigureOrder?: () => void
}

export default function DemandPredictionChart({ itemName, onReconfigureOrder }: DemandPredictionProps) {
  const [predictionData, setPredictionData] = useState<PredictionData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [overallTrend, setOverallTrend] = useState<{
    percentChange: number
    direction: 'up' | 'down' | null
  }>({ percentChange: 0, direction: null })

  // Mock data generation for demonstration
  useEffect(() => {
    const generateMockData = () => {
      const startDate = new Date()
      const data: PredictionData[] = []
      
      for (let i = 0; i < 30; i++) {
        const date = addDays(startDate, i)
        const baseValue = 100 + Math.sin(i / 3) * 20
        
        data.push({
          date: format(date, 'yyyy-MM-dd'),
          predicted: baseValue + Math.random() * 10,
          google: baseValue - 5 + Math.random() * 10,
          twitter: baseValue - 10 + Math.random() * 15,
          tiktok: baseValue + 5 + Math.random() * 20,
          events: baseValue - 15 + Math.random() * 25,
        })
      }

      const firstValue = data[0].predicted
      const lastValue = data[data.length - 1].predicted
      const change = ((lastValue - firstValue) / firstValue) * 100

      setOverallTrend({
        percentChange: Math.abs(change),
        direction: change > 0 ? 'up' : 'down'
      })

      return data
    }

    setTimeout(() => {
      try {
        const data = generateMockData()
        setPredictionData(data)
        setLoading(false)
      } catch (err) {
        setError("Failed to generate prediction data")
        setLoading(false)
      }
    }, 1000)
  }, [itemName])

  const sources: InsightSource[] = [
    {
      name: "Google Trends",
      icon: <Search className="h-5 w-5" />,
      trend: 12.5,
      insight: "Rising search interest indicates growing demand",
      color: "#4285F4"
    },
    {
      name: "Twitter",
      icon: <Twitter className="h-5 w-5" />,
      trend: 8.3,
      insight: "Positive sentiment in social conversations",
      color: "#1DA1F2"
    },
    {
      name: "TikTok",
      icon: <TiktokTrend className="h-5 w-5" />,
      trend: 15.7,
      insight: "Viral content driving product awareness",
      color: "#FF0050"
    },
    {
      name: "Events",
      icon: <Calendar className="h-5 w-5" />,
      trend: 5.2,
      insight: "Upcoming events suggest increased demand",
      color: "#FF6B6B"
    }
  ]

  if (loading) {
    return <div className="h-[500px] flex items-center justify-center">Loading prediction data...</div>
  }

  if (error) {
    return <div className="h-[500px] flex items-center justify-center text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">30-Day Demand Prediction</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              <Legend />
              <Line type="monotone" dataKey="predicted" name="Predicted Demand" stroke="#2563eb" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="google" name="Google Trends" stroke="#4285F4" strokeDasharray="3 3" dot={false} />
              <Line type="monotone" dataKey="twitter" name="Twitter" stroke="#1DA1F2" strokeDasharray="3 3" dot={false} />
              <Line type="monotone" dataKey="tiktok" name="TikTok" stroke="#FF0050" strokeDasharray="3 3" dot={false} />
              <Line type="monotone" dataKey="events" name="Events" stroke="#FF6B6B" strokeDasharray="3 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sources.map((source) => (
          <div key={source.name} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 mb-2">
              {source.icon}
              <span className="font-medium">{source.name}</span>
            </div>
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <TrendingUp className="h-4 w-4" />
              <span className="font-semibold">+{source.trend}%</span>
            </div>
            <p className="text-sm text-gray-600">{source.insight}</p>
          </div>
        ))}
      </div>

      {overallTrend.percentChange >= 5 && (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${
            overallTrend.direction === 'up' 
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          } border`}>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="font-medium">
                  {overallTrend.direction === 'up' 
                    ? 'Predicted Demand Increase'
                    : 'Predicted Demand Decrease'}
                </p>
                <p className="text-sm">
                  Our AI model predicts a {overallTrend.percentChange.toFixed(1)}% {overallTrend.direction === 'up' ? 'increase' : 'decrease'} in 
                  demand over the next 30 days, based on aggregated data from multiple sources. 
                  {overallTrend.direction === 'up'
                    ? ' Consider increasing your inventory levels to meet the expected higher demand.'
                    : ' Consider optimizing your inventory levels to avoid excess stock.'}
                </p>
                <button
                  onClick={onReconfigureOrder}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mt-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reconfigure Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}