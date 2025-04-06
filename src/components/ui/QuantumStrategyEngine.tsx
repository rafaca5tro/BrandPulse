import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from './icons';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from './AlertDialog';

interface QuantumStrategyEngineProps {
  currentMetrics: Record<string, number>;
  currentScore: number;
  regions: RegionData[];
  competitors: CompetitorData[];
  ecosystem: EcosystemEntity[];
  onQuantumOptimize: (
    optimizedMetrics: Record<string, number>,
    optimizedScore: number,
    optimizedRegions: RegionData[],
    optimizedCompetitors: CompetitorData[],
    optimizedEcosystem: EcosystemEntity[]
  ) => void;
}

const QuantumStrategyEngine: React.FC<QuantumStrategyEngineProps> = ({
  currentMetrics,
  currentScore,
  regions,
  competitors,
  ecosystem,
  onQuantumOptimize,
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Mock quantum optimization (in production, integrate quantum computing API like Qiskit)
  const runQuantumOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      const optimizedMetrics = { ...currentMetrics };
      let scoreAdjustment = 0;

      // Optimize metrics
      Object.keys(optimizedMetrics).forEach((metric) => {
        const delta = Math.random() * 10 - 5; // Random ±5% change
        optimizedMetrics[metric] = Math.max(0, Math.min(100, optimizedMetrics[metric] + delta));
        scoreAdjustment += delta * 0.1;
      });

      // Optimize regions
      const optimizedRegions = regions.map((region) => {
        const penetrationDelta = Math.random() * 10 - 5;
        const sentimentDelta = Math.random() * 20 - 10;
        return {
          ...region,
          penetration: Math.max(0, Math.min(100, region.penetration + penetrationDelta)),
          sentiment: Math.max(-100, Math.min(100, region.sentiment + sentimentDelta)),
        };
      });

      // Optimize competitors (simulate counter-moves)
      const optimizedCompetitors = competitors.map((comp) => {
        const newMetrics = { ...comp.metrics };
        Object.keys(newMetrics).forEach((metric) => {
          const delta = Math.random() * 5 - 2.5;
          newMetrics[metric] = Math.max(0, Math.min(100, newMetrics[metric] + delta));
        });
        return { ...comp, metrics: newMetrics, pulseScore: Math.max(0, Math.min(100, comp.pulseScore + (Math.random() * 2 - 1))) };
      });

      // Optimize ecosystem
      const optimizedEcosystem = ecosystem.map((entity) => {
        const newMetrics = { ...entity.metrics };
        Object.keys(newMetrics).forEach((metric) => {
          const delta = Math.random() * 8 - 4;
          newMetrics[metric] = Math.max(0, Math.min(100, newMetrics[metric] + delta));
        });
        return { ...entity, metrics: newMetrics };
      });

      const optimizedScore = Math.max(0, Math.min(100, currentScore + scoreAdjustment));
      onQuantumOptimize(optimizedMetrics, optimizedScore, optimizedRegions, optimizedCompetitors, optimizedEcosystem);
      setIsOptimizing(false);
    }, 2000); // Simulate quantum computation delay
  };

  return (
    <Card className="mt-6 border border-gray-800/50 bg-gray-900/95 rounded-xl shadow-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-100 font-['Inter']">
          Quantum Strategy Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <p className="text-sm text-gray-400 font-['Inter']">
            Leverage quantum simulations to optimize across all dimensions simultaneously.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700" disabled={isOptimizing}>
                {isOptimizing ? (
                  <>
                    <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" /> Optimizing...
                  </>
                ) : (
                  <>
                    <Icons.BrainCircuit size={16} className="mr-2" /> Run Quantum Optimization
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Quantum Optimization</AlertDialogTitle>
                <AlertDialogDescription>
                  This will simulate a quantum optimization across metrics, regions, competitors, and ecosystem entities. Results will update in real-time. Proceed?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={runQuantumOptimization}>Optimize</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuantumStrategyEngine;