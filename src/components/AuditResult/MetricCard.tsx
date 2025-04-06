import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Icons } from './icons';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Icons;
  description?: string;
  source?: string;
  isPercentage?: boolean;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
  tooltip?: string;
  colorScheme?: 'default' | 'emerald' | 'rose' | 'purple' | 'amber';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  description,
  source,
  isPercentage = false,
  className,
  trend,
  tooltip,
  colorScheme = 'default',
}) => {
  const IconComponent = Icons[icon];
  const numericValue =
    typeof value === 'number' ? value : typeof value === 'string' && value.endsWith('%') ? parseFloat(value) : null;
  const showProgress = isPercentage || (numericValue !== null && numericValue <= 100 && numericValue >= 0);

  const getStyles = () => {
    switch (colorScheme) {
      case 'emerald': return { value: 'text-emerald-400', progress: 'bg-emerald-500', iconBg: 'bg-emerald-900/30' };
      case 'rose': return { value: 'text-rose-400', progress: 'bg-rose-500', iconBg: 'bg-rose-900/30' };
      case 'purple': return { value: 'text-purple-400', progress: 'bg-purple-500', iconBg: 'bg-purple-900/30' };
      case 'amber': return { value: 'text-amber-400', progress: 'bg-amber-500', iconBg: 'bg-amber-900/30' };
      default:
        return numericValue !== null
          ? {
              value: numericValue >= 80 ? 'text-emerald-400' : numericValue >= 70 ? 'text-amber-400' : 'text-rose-400',
              progress: numericValue >= 80 ? 'bg-emerald-500' : numericValue >= 70 ? 'bg-amber-500' : 'bg-rose-500',
              iconBg: 'bg-gray-800/30',
            }
          : { value: 'text-gray-100', progress: 'bg-gray-700', iconBg: 'bg-gray-800/30' };
    }
  };

  const { value: valueColor, progress: progressColor, iconBg } = getStyles();

  const getTrendIcon = () => {
    if (trend === 'up') return <Icons.TrendingUp size={16} className="text-emerald-400" />;
    if (trend === 'down') return <Icons.TrendingDown size={16} className="text-rose-400" />;
    if (trend === 'neutral') return <Icons.AlignCenter size={16} className="text-purple-400" />;
    return null;
  };

  return (
    <Card
      className={cn(
        "p-4 h-full flex flex-col bg-gray-900/95 border border-gray-800/50 rounded-xl shadow-2xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(147,51,234,0.2)]",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${iconBg}`}>
            <IconComponent size={20} className={valueColor} />
          </div>
          <h3 className="text-sm font-medium text-gray-200 font-['Inter']">{title}</h3>
        </div>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-300">
                  <Icons.Info size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200">
                <p className="max-w-xs text-sm">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex items-baseline mt-1">
        <span className={`text-2xl font-semibold ${valueColor} font-['Inter']`}>{value}</span>
        {trend && <span className="ml-2">{getTrendIcon()}</span>}
      </div>
      {showProgress && (
        <Progress value={numericValue} className={`h-1.5 mt-2 bg-gray-800 ${progressColor}`} />
      )}
      {description && <p className="text-sm text-gray-400 mt-3 flex-grow font-['Inter']">{description}</p>}
      {source && <p className="text-xs text-gray-500 mt-2 italic font-['Inter']">Source: {source}</p>}
    </Card>
  );
};

export default MetricCard;