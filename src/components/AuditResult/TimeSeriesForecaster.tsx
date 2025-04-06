import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Icons } from './icons';
import { Button } from "@/components/ui/button";

interface ForecastData {
  date: string; // e.g., "2025-05-01"
  pulseScore: number;
  regions: Record<string, { penetration: number; sentiment: number }>;
}

interface TimeSeriesForecasterProps {
  historicalData: ForecastData[];
  onForecastUpdate: (forecastedMetrics: Record<string, number>, forecastedScore: number, forecastedRegions: RegionData[]) => void;
}

const TimeSeriesForecaster: React.FC<TimeSeriesForecasterProps> = ({ historicalData, onForecastUpdate }) => {
  const [forecastHorizon, setForecastHorizon] = useState<number>(3); // Months ahead

  // Mock forecasting logic (in production, use ML model like ARIMA or Prophet)
  const generateForecast = () => {
    const lastData = historicalData[historicalData.length - 1];
    const forecastedData: ForecastData[] = [];
    let lastScore = lastData.pulseScore;
    const lastRegions = { ...lastData.regions };

    for (let i = 1; i <= forecastHorizon; i++) {
      const newDate = new Date(lastData.date);
      newDate.setMonth(newDate.getMonth() + i);
      const scoreChange = Math.random() * 4 - 2; // Random ±2% change
      lastScore = Math.max(0, Math.min(100, lastScore + scoreChange));

      const newRegions = Object.keys(lastRegions).reduce((acc, region) => {
        const penetrationChange = Math.random() * 5 - 2.5;
        const sentimentChange = Math.random() * 10 - 5;
        acc[region] = {
          penetration: Math.max(0, Math.min(100, lastRegions[region].penetration + penetrationChange)),
          sentiment: Math.max(-100, Math.min(100, lastRegions[region].sentiment + sentimentChange)),
        };
        return acc;
      }, {} as Record<string, { penetration: number; sentiment: number }>);

      forecastedData.push({
        date: newDate.toISOString().split('T')[0],
        pulseScore: lastScore,
        regions: newRegions,
      });
    }

    const latestForecast = forecastedData[forecastedData.length - 1];
    const forecastedMetrics = {
      social_reach: latestForecast.regions['North America'].penetration * 10000, // Simplified conversion
      engagement_rate: latestForecast.regions['North America'].sentiment / 2,
    };
    const forecastedRegions = Object.entries(latestForecast.regions).map(([name, data]) => ({
      name,
      lat: name === 'North America' ? 40 : name === 'Europe' ? 50 : 30,
      lng: name === 'North America' ? -100 : name === 'Europe' ? 10 : 100,
      penetration: data.penetration,
      sentiment: data.sentiment,
    }));

    onForecastUpdate(forecastedMetrics, latestForecast.pulseScore, forecastedRegions);
    return [...historicalData, ...forecastedData];
  };

  const [forecastedData, setForecastedData] = useState<ForecastData[]>(historicalData);

  const handleForecast = () => {
    const newData = generateForecast();
    setForecastedData(newData);
  };

  return (
    <Card className="mt-6 border border-gray-800/50 bg-gray-900/95 rounded-xl shadow-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-100 font-['Inter']">
          Time Series Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex space-x-4 mb-4">
          <select
            value={forecastHorizon}
            onChange={(e) => setForecastHorizon(parseInt(e.target.value))}
            className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-2 text-sm text-gray-200 font-['Inter'] focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={3}>3 Months</option>
            <option value={6}>6 Months</option>
            <option value={12}>12 Months</option>
          </select>
          <Button onClick={handleForecast} className="bg-purple-600 hover:bg-purple-700">
            <Icons.Clock size={16} className="mr-2" /> Forecast
          </Button>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" fontFamily="Inter" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.7)" fontFamily="Inter" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17,24,39,0.95)',
                  border: '1px solid rgba(75,85,99,0.5)',
                  borderRadius: '8px',
                  color: 'rgba(255,255,255,0.9)',
                }}
              />
              <Line
                type="monotone"
                dataKey="pulseScore"
                stroke="#9333ea"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSeriesForecaster;