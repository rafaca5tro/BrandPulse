import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// Define props interface for type safety
interface CategoryScore {
  name: string;
  score: number;
  color: string;
}

interface CategoryBarChartProps {
  data: CategoryScore[];
  height?: number;
}

const CategoryBarChart: React.FC<CategoryBarChartProps> = ({ data, height = 300 }) => {
  // Generate chart config dynamically from data
  const chartConfig = data.reduce((acc, item) => {
    acc[item.name] = { color: item.color };
    return acc;
  }, {} as Record<string, { color: string }>);

  return (
    <div className="chart-container" style={{ width: '100%', height }}>
      <ChartContainer config={chartConfig} className="w-full h-full bg-gray-900/95 rounded-xl p-4 shadow-2xl border border-gray-800/50">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
            layout="vertical"
          >
            {/* Subtle grid for depth */}
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke="rgba(255,255,255,0.05)"
            />
            {/* X-Axis with high-contrast ticks */}
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'Inter' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            {/* Y-Axis with clean typography */}
            <YAxis
              type="category"
              dataKey="name"
              width={150}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 14, fontFamily: 'Inter' }}
            />
            {/* Custom tooltip with dark theme */}
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
            {/* Bars with subtle animation and polish */}
            {data.map((entry) => (
              <Bar
                key={entry.name}
                dataKey="score"
                fill={entry.color}
                radius={[0, 4, 4, 0]}
                name={entry.name}
                animationDuration={800}
                className="transition-all duration-300 hover:brightness-110"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default CategoryBarChart;