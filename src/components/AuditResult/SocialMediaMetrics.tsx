import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from './icons';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface SocialMediaMetricsProps {
  metrics?: Record<string, number | string> | null;
}

const SocialMediaMetrics: React.FC<SocialMediaMetricsProps> = ({ metrics }) => {
  if (!metrics || Object.keys(metrics).length === 0) {
    return null;
  }

  const getIcon = (metricName: string): keyof typeof Icons => {
    const iconMap: Record<string, keyof typeof Icons> = {
      post_engagement_rate: 'Users',
      follower_growth_rate: 'TrendingUp',
      content_consistency_score: 'BarChart2',
      average_comments_per_post: 'MessageSquare',
      audience_retention: 'Heart',
      posting_frequency: 'BarChart2',
      trending_topics: 'Target',
      hashtag_effectiveness: 'Search',
      peak_engagement_times: 'Clock',
      audience_demographics: 'Users',
    };
    return iconMap[metricName] || 'BarChart2';
  };

  const getMetricBadgeStyles = (key: string, value: number | string) => {
    const numValue = typeof value === 'number' ? value : parseFloat(value.toString()) || 0;
    if (typeof value === 'number' && value <= 100) {
      if (numValue >= 80) return 'bg-emerald-900/50 text-emerald-300';
      if (numValue >= 60) return 'bg-amber-900/50 text-amber-300';
      if (numValue >= 40) return 'bg-orange-900/50 text-orange-300';
      return 'bg-rose-900/50 text-rose-300';
    }
    if (key.includes('growth') && typeof value === 'string' && value.includes('%')) {
      if (numValue >= 5) return 'bg-emerald-900/50 text-emerald-300';
      if (numValue >= 2) return 'bg-amber-900/50 text-amber-300';
      if (numValue >= 0) return 'bg-orange-900/50 text-orange-300';
      return 'bg-rose-900/50 text-rose-300';
    }
    return 'bg-gray-800/50 text-gray-300';
  };

  return (
    <div className="mt-8 animate-fade-in">
      <h3 className="text-xl font-semibold mb-4 font-['Inter'] text-gray-100 tracking-tight">
        Social Media Engagement Metrics
      </h3>
      <Card className="border border-gray-800/50 bg-gray-900/95 rounded-xl shadow-2xl">
        <CardHeader className="pb-2 border-b border-gray-700/50">
          <CardTitle className="text-lg font-medium text-gray-100 font-['Inter']">
            Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(metrics).map(([key, value]) => {
              const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
              const isPercentage = typeof value === 'number' && value <= 100;
              const badgeStyles = getMetricBadgeStyles(key, value);
              const IconComponent = Icons[getIcon(key)];

              return (
                <div
                  key={key}
                  className="bg-gray-800/30 p-4 rounded-lg transition-all duration-200 hover:shadow-[0_0_10px_rgba(147,51,234,0.1)]"
                >
                  <div className="flex items-start space-x-3">
                    <div className="h-9 w-9 rounded-md bg-purple-900/30 flex items-center justify-center mt-0.5">
                      <IconComponent size={18} className="text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-200 font-['Inter']">{formattedKey}</h4>
                      <div className="flex items-center mt-1">
                        <p className="text-lg font-semibold text-gray-100 font-['Inter']">
                          {isPercentage
                            ? `${typeof value === 'number' ? value.toFixed(1) : value}%`
                            : value}
                        </p>
                        <Badge className={`ml-2 ${badgeStyles}`} variant="outline">
                          {isPercentage && typeof value === 'number'
                            ? value >= 70
                              ? 'Excellent'
                              : value >= 50
                              ? 'Good'
                              : 'Needs Improvement'
                            : 'Metric'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Separator className="my-6 bg-gray-700/50" />
          <p className="text-sm text-gray-400 font-['Inter']">
            Metrics reflect the last 30 days. Variations may occur due to platform algorithms and reach.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaMetrics;
