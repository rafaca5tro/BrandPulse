import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from './icons';
import CommentPanel from './CommentPanel';
import ScenarioSimulator from './ScenarioSimulator';
import ScoreChart from './ScoreChart';
import GlobalImpactMap from './GlobalImpactMap';
import TimeSeriesForecaster from './TimeSeriesForecaster';
import CompetitiveWarRoom from './CompetitiveWarRoom';
import BrandEcosystemHub from './BrandEcosystemHub';
import QuantumStrategyEngine from './QuantumStrategyEngine';

interface DeepDiveRow {
  metric: string;
  value: number | string;
  trend: 'up' | 'down' | 'stable';
  insight: string;
}

interface RegionData {
  name: string;
  lat: number;
  lng: number;
  penetration: number;
  sentiment: number;
}

interface CompetitorData {
  name: string;
  metrics: Record<string, number>;
  pulseScore: number;
}

interface EcosystemEntity {
  type: 'partner' | 'influencer' | 'subsidiary';
  name: string;
  metrics: Record<string, number>;
  contribution: number;
}

interface DeepDiveTableProps {
  data: DeepDiveRow[];
  title?: string;
  initialPulseScore: number;
}

const DeepDiveTable: React.FC<DeepDiveTableProps> = ({
  data,
  title = "Deep Dive Metrics",
  initialPulseScore,
}) => {
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const [simulatedMetrics, setSimulatedMetrics] = useState<Record<string, number> | null>(null);
  const [simulatedScore, setSimulatedScore] = useState<number>(initialPulseScore);
  const [simulatedRegions, setSimulatedRegions] = useState<RegionData[]>([
    { name: 'North America', lat: 40, lng: -100, penetration: 85, sentiment: 70 },
    { name: 'Europe', lat: 50, lng: 10, penetration: 60, sentiment: 20 },
    { name: 'Asia', lat: 30, lng: 100, penetration: 45, sentiment: -10 },
  ]);
  const [simulatedCompetitors, setSimulatedCompetitors] = useState<CompetitorData[]>([
    { name: 'Competitor A', metrics: { social_reach: 80, engagement_rate: 65 }, pulseScore: 72 },
    { name: 'Competitor B', metrics: { social_reach: 90, engagement_rate: 70 }, pulseScore: 78 },
  ]);
  const [simulatedEcosystem, setSimulatedEcosystem] = useState<EcosystemEntity[]>([
    { type: 'partner', name: 'Ad Agency X', metrics: { social_reach: 70, engagement_rate: 60 }, contribution: 20 },
    { type: 'influencer', name: 'Influencer Y', metrics: { social_reach: 85, engagement_rate: 75 }, contribution: 15 },
    { type: 'subsidiary', name: 'Sub Brand Z', metrics: { social_reach: 60, engagement_rate: 50 }, contribution: 25 },
  ]);

  const historicalData: ForecastData[] = [
    { date: '2025-03-01', pulseScore: 70, regions: { 'North America': { penetration: 80, sentiment: 65 }, 'Europe': { penetration: 55, sentiment: 15 }, 'Asia': { penetration: 40, sentiment: -15 } } },
    { date: '2025-04-01', pulseScore: 75, regions: { 'North America': { penetration: 85, sentiment: 70 }, 'Europe': { penetration: 60, sentiment: 20 }, 'Asia': { penetration: 45, sentiment: -10 } } },
  ];

  const getTrendIcon = (trend: DeepDiveRow['trend']) => {
    switch (trend) {
      case 'up': return <Icons.TrendingUp size={16} className="text-emerald-400" />;
      case 'down': return <Icons.TrendingDown size={16} className="text-rose-400" />;
      case 'stable': return <Icons.AlignCenter size={16} className="text-purple-400" />;
      default: return null;
    }
  };

  const handleAddComment = (rowIndex: number) => (text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      user: 'You',
      text,
      timestamp: new Date().toLocaleTimeString(),
    };
    setComments((prev) => ({
      ...prev,
      [rowIndex]: [...(prev[rowIndex] || []), newComment],
    }));
  };

  const handleSimulate = (newMetrics: Record<string, number>, newScore: number) => {
    setSimulatedMetrics(newMetrics);
    setSimulatedScore(newScore);
  };

  const handleRegionSimulate = (region: string, adjustments: Record<string, number>) => {
    const newMetrics = { ...simulatedMetrics, ...adjustments };
    const scoreAdjustment = adjustments.penetration ? adjustments.penetration * 0.1 : 0;
    const newScore = Math.max(0, Math.min(100, simulatedScore + scoreAdjustment));
    setSimulatedMetrics(newMetrics);
    setSimulatedScore(newScore);
    setSimulatedRegions((prev) =>
      prev.map((r) => (r.name === region ? { ...r, ...adjustments } : r))
    );
  };

  const handleForecastUpdate = (
    forecastedMetrics: Record<string, number>,
    forecastedScore: number,
    forecastedRegions: RegionData[]
  ) => {
    setSimulatedMetrics(forecastedMetrics);
    setSimulatedScore(forecastedScore);
    setSimulatedRegions(forecastedRegions);
  };

  const handleQuantumOptimize = (
    optimizedMetrics: Record<string, number>,
    optimizedScore: number,
    optimizedRegions: RegionData[],
    optimizedCompetitors: CompetitorData[],
    optimizedEcosystem: EcosystemEntity[]
  ) => {
    setSimulatedMetrics(optimizedMetrics);
    setSimulatedScore(optimizedScore);
    setSimulatedRegions(optimizedRegions);
    setSimulatedCompetitors(optimizedCompetitors);
    setSimulatedEcosystem(optimizedEcosystem);
  };

  const initialMetrics = data.reduce((acc, row) => {
    acc[row.metric.toLowerCase().replace(/\s/g, '_')] = typeof row.value === 'number' ? row.value : parseFloat(row.value.toString()) || 0;
    return acc;
  }, {} as Record<string, number>);

  const displayData = simulatedMetrics
    ? data.map((row) => ({
        ...row,
        value: simulatedMetrics[row.metric.toLowerCase().replace(/\s/g, '_')] || row.value,
      }))
    : data;

  return (
    <div className="mt-6 animate-fade-in relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold font-['Inter'] text-gray-100 tracking-tight">
          {title}
        </h3>
        <ScoreChart score={simulatedScore} size={80} />
      </div>
      <Card className="border border-gray-800/50 bg-gray-900/95 rounded-xl shadow-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-700/50">
                  <th className="p-4 text-sm font-medium text-gray-300 font-['Inter']">Metric</th>
                  <th className="p-4 text-sm font-medium text-gray-300 font-['Inter']">Value</th>
                  <th className="p-4 text-sm font-medium text-gray-300 font-['Inter']">Trend</th>
                  <th className="p-4 text-sm font-medium text-gray-300 font-['Inter']">Insight</th>
                  <th className="p-4 text-sm font-medium text-gray-300 font-['Inter']">Discuss</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors duration-200"
                  >
                    <td className="p-4 text-sm text-gray-100 font-['Inter']">{row.metric}</td>
                    <td className="p-4 text-sm text-gray-100 font-['Inter']">{row.value}</td>
                    <td className="p-4">{getTrendIcon(row.trend)}</td>
                    <td className="p-4 text-sm text-gray-300 font-['Inter']">{row.insight}</td>
                    <td className="p-4">
                      <button
                        onClick={() => setActiveRow(activeRow === index.toString() ? null : index.toString())}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        <Icons.MessageSquare size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {activeRow !== null && (
        <div className="absolute right-0 top-0 mt-12 mr-4">
          <CommentPanel
            comments={comments[activeRow] || []}
            onAddComment={handleAddComment(parseInt(activeRow))}
            entityId={activeRow}
            metricData={displayData[parseInt(activeRow)]}
          />
        </div>
      )}
      <ScenarioSimulator
        initialMetrics={initialMetrics}
        initialPulseScore={initialPulseScore}
        onSimulate={handleSimulate}
      />
      <GlobalImpactMap regions={simulatedRegions} onRegionSelect={handleRegionSimulate} />
      <TimeSeriesForecaster historicalData={historicalData} onForecastUpdate={handleForecastUpdate} />
      <CompetitiveWarRoom
        yourData={{ metrics: simulatedMetrics || initialMetrics, pulseScore: simulatedScore }}
        competitors={simulatedCompetitors}
        onSimulate={handleSimulate}
      />
      <BrandEcosystemHub
        ecosystem={simulatedEcosystem}
        onOptimize={handleSimulate}
        currentMetrics={simulatedMetrics || initialMetrics}
        currentScore={simulatedScore}
      />
      <QuantumStrategyEngine
        currentMetrics={simulatedMetrics || initialMetrics}
        currentScore={simulatedScore}
        regions={simulatedRegions}
        competitors={simulatedCompetitors}
        ecosystem={simulatedEcosystem}
        onQuantumOptimize={handleQuantumOptimize}
      />
    </div>
  );
};

export default DeepDiveTable;