import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface ScoreChartProps {
  score: number;
  size?: number;
  label?: boolean;
}

const ScoreChart: React.FC<ScoreChartProps> = ({ score, size = 120, label = true }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // emerald-500
    if (score >= 70) return '#f59e0b'; // amber-500
    return '#f43f5e'; // rose-500
  };

  const COLORS = [getScoreColor(score), '#374151']; // gray-700 for dark mode

  return (
    <div className="flex flex-col items-center">
      <div style={{ width: size, height: size }}>
        <ChartContainer
          config={{
            Score: { color: getScoreColor(score) },
            Remaining: { color: '#374151' },
          }}
          className="w-full h-full bg-gray-900/95 rounded-full p-1 shadow-inner"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={size / 3}
                outerRadius={size / 2}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={<ChartTooltipContent />}
                wrapperStyle={{
                  backgroundColor: 'rgba(17,24,39,0.95)', // gray-900
                  border: '1px solid rgba(75,85,99,0.5)', // gray-600
                  borderRadius: '8px',
                  padding: '8px',
                  color: 'rgba(255,255,255,0.9)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      {label && (
        <div className="text-center mt-2">
          <span
            className={`text-2xl font-semibold font-['Inter'] ${
              score >= 80 ? 'text-emerald-400' : score >= 70 ? 'text-amber-400' : 'text-rose-400'
            }`}
          >
            {score}
          </span>
          <span className="text-gray-400 text-sm font-['Inter']">/100</span>
        </div>
      )}
    </div>
  );
};

export default ScoreChart;
