import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from './icons';
import ScoreChart from './ScoreChart';

interface Scenario {
  metric: string;
  adjustment: number; // Percentage change (e.g., 20 for +20%)
}

interface ScenarioSimulatorProps {
  initialMetrics: Record<string, number>;
  initialPulseScore: number;
  onSimulate: (newMetrics: Record<string, number>, newScore: number) => void;
}

const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  initialMetrics,
  initialPulseScore,
  onSimulate,
}) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [newMetric, setNewMetric] = useState<string>('');
  const [newAdjustment, setNewAdjustment] = useState<number>(0);

  const addScenario = () => {
    if (newMetric && initialMetrics[newMetric] !== undefined && newAdjustment !== 0) {
      setScenarios([...scenarios, { metric: newMetric, adjustment: newAdjustment }]);
      setNewMetric('');
      setNewAdjustment(0);
    }
  };

  const simulate = () => {
    const newMetrics = { ...initialMetrics };
    let scoreAdjustment = 0;

    scenarios.forEach(({ metric, adjustment }) => {
      const originalValue = newMetrics[metric];
      newMetrics[metric] = Math.max(0, Math.min(100, originalValue * (1 + adjustment / 100)));
      scoreAdjustment += (newMetrics[metric] - originalValue) * 0.1; // Simplified scoring impact
    });

    const newScore = Math.max(0, Math.min(100, initialPulseScore + scoreAdjustment));
    onSimulate(newMetrics, newScore);
  };

  return (
    <Card className="mt-6 border border-gray-800/50 bg-gray-900/95 rounded-xl shadow-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-100 font-['Inter']">
          Scenario Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <select
              value={newMetric}
              onChange={(e) => setNewMetric(e.target.value)}
              className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-2 text-sm text-gray-200 font-['Inter'] focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Metric</option>
              {Object.keys(initialMetrics).map((key) => (
                <option key={key} value={key}>
                  {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
            <Input
              type="number"
              value={newAdjustment}
              onChange={(e) => setNewAdjustment(parseFloat(e.target.value) || 0)}
              placeholder="% Change"
              className="w-32 bg-gray-800/50 border border-gray-700/50 text-gray-200 font-['Inter']"
            />
            <Button onClick={addScenario} className="bg-purple-600 hover:bg-purple-700">
              <Icons.PlusCircle size={16} className="mr-2" /> Add
            </Button>
          </div>
          {scenarios.length > 0 && (
            <div className="space-y-2">
              {scenarios.map((scenario, index) => (
                <div key={index} className="flex items-center text-sm text-gray-300 font-['Inter']">
                  <span>
                    Adjust {scenario.metric.replace(/_/g, ' ')} by {scenario.adjustment}%
                  </span>
                  <button
                    onClick={() => setScenarios(scenarios.filter((_, i) => i !== index))}
                    className="ml-2 text-rose-400 hover:text-rose-300"
                  >
                    <Icons.X size={16} />
                  </button>
                </div>
              ))}
              <Button onClick={simulate} className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                <Icons.Play size={16} className="mr-2" /> Simulate
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioSimulator;