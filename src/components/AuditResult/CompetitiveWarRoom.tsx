import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Icons } from './icons';
import { Button } from "@/components/ui/button";
import ScoreChart from './ScoreChart';

interface CompetitorData {
  name: string;
  metrics: Record<string, number>;
  pulseScore: number;
}

interface CompetitiveWarRoomProps {
  yourData: { metrics: Record<string, number>; pulseScore: number };
  competitors: CompetitorData[];
  onSimulate: (yourMetrics: Record<string, number>, yourScore: number) => void;
}

const CompetitiveWarRoom: React.FC<CompetitiveWarRoomProps> = ({ yourData, competitors, onSimulate }) => {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);
  const [adjustment, setAdjustment] = useState<Record<string, number>>({});

  const metricsList = Object.keys(yourData.metrics);

  const chartData = metricsList.map((metric) => ({
    name: metric.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    You: yourData.metrics[metric],
    ...(selectedCompetitor
      ? { [selectedCompetitor]: competitors.find((c) => c.name === selectedCompetitor)!.metrics[metric] }
      : {}),
  }));

  const handleAdjustmentChange = (metric: string, value: number) => {
    setAdjustment((prev) => ({ ...prev, [metric]: value }));
  };

  const simulateBattle = () => {
    const newMetrics = { ...yourData.metrics };
    let scoreAdjustment = 0;

    Object.entries(adjustment).forEach(([metric, change]) => {
      const originalValue = newMetrics[metric];
      newMetrics[metric] = Math.max(0, Math.min(100, originalValue + change));
      scoreAdjustment += (newMetrics[metric] - originalValue) * 0.1; // Simplified impact
    });

    const newScore = Math.max(0, Math.min(100, yourData.pulseScore + scoreAdjustment));
    onSimulate(newMetrics, newScore);
    setAdjustment({});
  };

  return (
    <Card className="mt-6 border border-gray-800/50 bg-gray-900/95 rounded-xl shadow-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-100 font-['Inter']">
          Competitive War Room
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex space-x-4 mb-4">
          <select
            value={selectedCompetitor || ''}
            onChange={(e) => setSelectedCompetitor(e.target.value || null)}
            className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-2 text-sm text-gray-200 font-['Inter'] focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Competitor</option>
            {competitors.map((comp) => (
              <option key={comp.name} value={comp.name}>
                {comp.name}
              </option>
            ))}
          </select>
          <div className="flex items-center space-x-2">
            <ScoreChart score={yourData.pulseScore} size={60} label={false} />
            <span className="text-gray-100 font-['Inter']">vs</span>
            {selectedCompetitor && (
              <ScoreChart
                score={competitors.find((c) => c.name === selectedCompetitor)!.pulseScore}
                size={60}
                label={false}
              />
            )}
          </div>
        </div>
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" fontFamily="Inter" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.7)" fontFamily="Inter" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17,24,39,0.95)',
                  border: '1px solid rgba(75,85,99,0.5)',
                  borderRadius: '8px',
                  color: 'rgba(255,255,255,0.9)',
                }}
              />
              <Bar dataKey="You" fill="#9333ea" radius={[4, 4, 0, 0]} />
              {selectedCompetitor && (
                <Bar dataKey={selectedCompetitor} fill="#f43f5e" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
        {selectedCompetitor && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-200 font-['Inter']">Counter Moves</h4>
            {metricsList.map((metric) => (
              <div key={metric} className="flex items-center space-x-2">
                <span className="text-sm text-gray-300 font-['Inter']">
                  {metric.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
                <input
                  type="number"
                  value={adjustment[metric] || 0}
                  onChange={(e) => handleAdjustmentChange(metric, parseFloat(e.target.value) || 0)}
                  placeholder="Adjust %"
                  className="w-24 bg-gray-800/50 border border-gray-700/50 rounded-lg p-2 text-sm text-gray-200 font-['Inter'] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            ))}
            <Button onClick={simulateBattle} className="bg-emerald-600 hover:bg-emerald-700">
              <Icons.Sword size={16} className="mr-2" /> Simulate Battle
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompetitiveWarRoom;