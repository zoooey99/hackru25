"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { format, parseISO, addDays } from "date-fns"
import { AlertCircle, TrendingDown, TrendingUp, RefreshCw, Search, Twitter, TrendingUp as TiktokIcon, Calendar } from "lucide-react"

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

const getRandomTrend = () => {
  return Number((Math.random() * 60 - 20).toFixed(1)) // Random number between -20 and +40
}

const getRandomInsight = (sourceName: string, trend: number) => {
  const positiveInsights = [
    `Exceptional ${sourceName} engagement indicates strong demand surge`,
    `${sourceName} metrics show unprecedented growth potential`,
    `Rapid ${sourceName} momentum suggests market excitement`,
    `${sourceName} signals reveal emerging trend opportunities`,
    `Strong ${sourceName} indicators point to market expansion`,
    `${sourceName} analysis shows robust demand patterns`,
  ]

  const negativeInsights = [
    `Significant ${sourceName} decline suggests market adjustment needed`,
    `${sourceName} metrics indicate shifting consumer preferences`,
    `Changing ${sourceName} patterns show market recalibration`,
    `${sourceName} data reveals temporary market cooling`,
    `${sourceName} trends suggest strategic inventory review`,
    `Evolving ${sourceName} signals indicate demand realignment`,
  ]

  const neutralInsights = [
    `${sourceName} patterns show stable market conditions`,
    `Balanced ${sourceName} metrics suggest steady demand`,
    `${sourceName} indicators reveal consistent market interest`,
    `${sourceName} analysis shows sustainable patterns`,
  ]

  let insights
  if (trend >= 10) insights = positiveInsights
  else if (trend <= -10) insights = negativeInsights
  else insights = neutralInsights

  return insights[Math.floor(Math.random() * insights.length)]
}

const generateDataPattern = (days: number, baseValue: number, volatility: number, pattern: 'linear' | 'exponential' | 'cyclical' | 'volatile') => {
  const values = []
  for (let i = 0; i < days; i++) {
    let value = baseValue
    switch (pattern) {
      case 'linear':
        value += (i / days) * volatility * (Math.random() > 0.5 ? 1 : -1)
        break
      case 'exponential':
        value *= (1 + (i / days) * (volatility / 100))
        break
      case 'cyclical':
        value += Math.sin((i / days) * Math.PI * 2) * volatility
        break
      case 'volatile':
        value += (Math.random() - 0.5) * volatility * 2
        break
    }
    values.push(value + (Math.random() - 0.5) * (volatility * 0.2))
  }
  return values
}

export function DemandPredictionChart({ itemName, onReconfigureOrder }: DemandPredictionProps) {
  const [predictionData, setPredictionData] = useState<PredictionData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [overallTrend, setOverallTrend] = useState<{
    percentChange: number
    direction: 'up' | 'down' | null
  }>({ percentChange: 0, direction: null })
  const [sources, setSources] = useState<InsightSource[]>([])

  // Generate random sources data
  useEffect(() => {
    const generateSources = () => {
      const newSources: InsightSource[] = [
        {
          name: "Google Trends",
          icon: <Search className="h-5 w-5" />,
          trend: getRandomTrend(),
          insight: "",
          color: "#4285F4"
        },
        {
          name: "Twitter",
          icon: <Twitter className="h-5 w-5" />,
          trend: getRandomTrend(),
          insight: "",
          color: "#1DA1F2"
        },
        {
          name: "TikTok",
          icon: <TiktokIcon className="h-5 w-5" />,
          trend: getRandomTrend(),
          insight: "",
          color: "#FF0050"
        },
        {
          name: "Events",
          icon: <Calendar className="h-5 w-5" />,
          trend: getRandomTrend(),
          insight: "",
          color: "#FF6B6B"
        }
      ]

      newSources.forEach(source => {
        source.insight = getRandomInsight(source.name, source.trend)
      })

      setSources(newSources)
    }

    generateSources()
  }, [itemName])

  // Mock data generation
  useEffect(() => {
    const generateMockData = () => {
      const startDate = new Date()
      const data: PredictionData[] = []
      
      // Generate different patterns for each data source
      const baseline = 80 + Math.random() * 40
      const volatility = 10 + Math.random() * 30
      
      const patterns: ('linear' | 'exponential' | 'cyclical' | 'volatile')[] = 
        ['linear', 'exponential', 'cyclical', 'volatile']
      
      const predictedValues = generateDataPattern(30, baseline, volatility, 
        patterns[Math.floor(Math.random() * patterns.length)])
      const googleValues = generateDataPattern(30, baseline * 0.9, volatility * 1.2, 
        patterns[Math.floor(Math.random() * patterns.length)])
      const twitterValues = generateDataPattern(30, baseline * 0.8, volatility * 0.8, 
        patterns[Math.floor(Math.random() * patterns.length)])
      const tiktokValues = generateDataPattern(30, baseline * 1.1, volatility * 1.5, 
        patterns[Math.floor(Math.random() * patterns.length)])
      const eventValues = generateDataPattern(30, baseline * 0.7, volatility * 0.6, 
        patterns[Math.floor(Math.random() * patterns.length)])
      
      for (let i = 0; i < 30; i++) {
        const date = addDays(startDate, i)
        data.push({
          date: format(date, 'yyyy-MM-dd'),
          predicted: predictedValues[i],
          google: googleValues[i],
          twitter: twitterValues[i],
          tiktok: tiktokValues[i],
          events: eventValues[i],
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
              {source.trend >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={`font-semibold ${source.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {source.trend >= 0 ? '+' : ''}{source.trend}%
              </span>
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