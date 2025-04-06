
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from './icons';
import { Progress } from "@/components/ui/progress";

interface PerformanceMetric {
  name: string;
  value: number;
  description: string;
  icon: keyof typeof Icons;
}

interface WebsitePerformanceProps {
  metrics: PerformanceMetric[];
}

const WebsitePerformance: React.FC<WebsitePerformanceProps> = ({ metrics }) => {
  const getScoreStyles = (score: number) => {
    if (score >= 90) return { progress: 'bg-emerald-500', text: 'text-emerald-400' };
    if (score >= 70) return { progress: 'bg-amber-500', text: 'text-amber-400' };
    if (score >= 50) return { progress: 'bg-orange-500', text: 'text-orange-400' };
    return { progress: 'bg-rose-500', text: 'text-rose-400' };
  };

  return (
    <div className="mt-6 animate-fade-in">
      <h3 className="text-xl font-semibold mb-4 font-['Inter'] text-gray-100 tracking-tight">
        Website Performance Metrics
      </h3>
      <Card className="border border-gray-800/50 bg-gray-900/95 rounded-xl shadow-2xl">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-6">
            {metrics.map((metric, index) => {
              const IconComponent = Icons[metric.icon];
              const { progress, text } = getScoreStyles(metric.value);
              return (
                <div
                  key={index}
                  className="border-b border-gray-700/50 pb-4 last:border-0 last:pb-0 transition-all duration-200 hover:bg-gray-800/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-md bg-gray-800/50 flex items-center justify-center mr-3 shadow-sm border border-gray-700/50">
                        <IconComponent size={20} className="text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-100 font-['Inter']">{metric.name}</h4>
                        <p className="text-xs text-gray-400 font-['Inter']">{metric.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-xl font-semibold ${text} font-['Inter']`}>{metric.value}</span>
                      <span className="text-sm text-gray-400 ml-1 font-['Inter']">/100</span>
                    </div>
                  </div>
                  <div className="relative pt-1">
                    <Progress value={metric.value} className={`h-2 bg-gray-800 ${progress}`} />
                    <div className="mt-1 flex justify-between text-xs text-gray-400 font-['Inter']">
                      <span>Poor</span>
                      <span>Average</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsitePerformance;