"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format, parseISO } from "date-fns"

interface TrendData {
  date: string
  value: number
}

interface GoogleTrendsChartProps {
  searchPhrase: string
}

export function GoogleTrendsChart({ searchPhrase }: GoogleTrendsChartProps) {
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
          setTrendData(data.data[searchPhrase])
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
  )
}

