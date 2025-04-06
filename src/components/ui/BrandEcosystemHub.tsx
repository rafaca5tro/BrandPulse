import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion';
import { Icons } from './icons';
import { Button } from "@/components/ui/button";

interface EcosystemEntity {
  type: 'partner' | 'influencer' | 'subsidiary';
  name: string;
  metrics: Record<string, number>;
  contribution: number; // Impact on Pulse Score
}

interface BrandEcosystemHubProps {
  ecosystem: EcosystemEntity[];
  onOptimize: (optimizedMetrics: Record<string, number>, optimizedScore: number) => void;
  currentMetrics: Record<string, number>;
  currentScore: number;
}

const BrandEcosystemHub: React.FC<BrandEcosystemHubProps> = ({
  ecosystem,
  onOptimize,
  currentMetrics,
  currentScore,
}) => {
  const [adjustments, setAdjustments] = useState<Record<string, Record<string, number>>>({});

  const handleAdjustmentChange = (entityName: string, metric: string, value: number) => {
    setAdjustments((prev) => ({
      ...prev,
      [entityName]: { ...(prev[entityName] || {}), [metric]: value },
    }));
  };

  const optimizeEcosystem = () => {
    const newMetrics = { ...currentMetrics };
    let scoreAdjustment = 0;

    Object.entries(adjustments).forEach(([entityName, metricAdjustments]) => {
      const entity = ecosystem.find((e) => e.name === entityName)!;
      Object.entries(metricAdjustments).forEach(([metric, change]) => {
        const originalValue = entity.metrics[metric];
        const newValue = Math.max(0, Math.min(100, originalValue + change));
        entity.metrics[metric] = newValue;
        const entityImpact = (newValue - originalValue) * (entity.contribution / 100);
        newMetrics[metric] = (newMetrics[metric] || 0) + entityImpact;
        scoreAdjustment += entityImpact * 0.05; // Scaled impact
      });
    });

    const newScore = Math.max(0, Math.min(100, currentScore + scoreAdjustment));
    onOptimize(newMetrics, newScore);
    setAdjustments({});
  };

  const getIcon = (type: EcosystemEntity['type']) => {
    switch (type) {
      case 'partner': return <Icons.Building size={16} className="text-emerald-400" />;
      case 'influencer': return <Icons.User size={16} className="text-purple-400" />;
      case 'subsidiary': return <Icons.Store size={16} className="text-amber-400" />;
      default: return null;
    }
  };

  return (
    <Card className="mt-6 border border-gray-800/50 bg-gray-900/95 rounded-xl shadow-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-100 font-['Inter']">
          Brand Ecosystem Hub
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Accordion type="single" collapsible className="w-full">
          {ecosystem.map((entity) => (
            <AccordionItem key={entity.name} value={entity.name}>
              <AccordionTrigger className="flex items-center space-x-2">
                {getIcon(entity.type)}
                <span>{entity.name}</span>
                <span className="text-xs text-gray-400 ml-2">({entity.type})</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {Object.entries(entity.metrics).map(([metric, value]) => (
                    <div key={metric} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-300 font-['Inter']">
                        {metric.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}: {value}
                      </span>
                      <input
                        type="number"
                        value={adjustments[entity.name]?.[metric] || 0}
                        onChange={(e) =>
                          handleAdjustmentChange(entity.name, metric, parseFloat(e.target.value) || 0)
                        }
                        placeholder="Adjust %"
                        className="w-24 bg-gray-800/50 border border-gray-700/50 rounded-lg p-2 text-sm text-gray-200 font-['Inter'] focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button
          onClick={optimizeEcosystem}
          className="mt-4 bg-emerald-600 hover:bg-emerald-700"
          disabled={Object.keys(adjustments).length === 0}
        >
          <Icons.Layers size={16} className="mr-2" /> Optimize Ecosystem
        </Button>
      </CardContent>
    </Card>
  );
};

export default BrandEcosystemHub;