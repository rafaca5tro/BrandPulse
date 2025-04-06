import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from './icons';
import { Separator } from "@/components/ui/separator";

// Define props interface for type safety and clarity
interface AnalysisSectionProps {
  title: string;
  icon: keyof typeof Icons;
  content: string;
  points?: string[];
  recommendations?: string[];
  isRecommendation?: boolean;
  className?: string;
  performanceMetrics?: Record<string, number>;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({
  title,
  icon,
  content,
  points = [],
  recommendations = [],
  isRecommendation = false,
  className = '',
  performanceMetrics = {},
}) => {
  const IconComponent = Icons[icon];

  return (
    <Card
      className={`shadow-2xl border border-gray-800/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(147,51,234,0.2)] ${className} ${
        isRecommendation ? 'bg-gradient-to-br from-amber-950/40 to-gray-900/90' : 'bg-gray-900/95'
      }`}
    >
      {/* Header with refined gradient and spacing */}
      <CardHeader
        className={`p-4 ${
          isRecommendation
            ? 'bg-gradient-to-r from-amber-900/20 to-transparent'
            : 'bg-gradient-to-r from-purple-900/20 via-gray-900/50 to-transparent'
        }`}
      >
        <CardTitle className="text-xl flex items-center font-['Inter'] font-semibold text-gray-50 tracking-tight">
          <IconComponent
            size={22}
            className={`mr-3 ${isRecommendation ? 'text-amber-300' : 'text-purple-300'}`}
          />
          {title}
        </CardTitle>
      </CardHeader>

      {/* Content with improved typography and spacing */}
      <CardContent className="p-6 text-gray-200">
        <div className="space-y-6">
          {/* Main content with high readability */}
          <p className="text-base leading-7 font-['Inter'] text-gray-300">{content}</p>

          {/* Performance Metrics with modern progress bars */}
          {Object.keys(performanceMetrics).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(performanceMetrics).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50"
                >
                  <h4 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                    {key.replace(/_/g, ' ')}
                  </h4>
                  <div className="flex items-center">
                    <div className="h-1.5 w-full bg-gray-700/50 rounded-full mr-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          value >= 80
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : value >= 60
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                            : 'bg-gradient-to-r from-rose-500 to-red-400'
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-100">{Math.round(value)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Key Points with subtle hover effects */}
          {points.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 font-['Inter'] text-gray-100">Key Points</h3>
              <ul className="space-y-3">
                {points.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-start bg-gray-800/30 p-3 rounded-lg transition-colors duration-200 hover:bg-gray-800/50"
                  >
                    <Icons.Check
                      size={18}
                      className="mr-2 text-emerald-400 mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-300 text-sm leading-6">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations with clear separation */}
          {recommendations.length > 0 && (
            <>
              <Separator className="my-6 bg-gray-700/50" />
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center font-['Inter'] text-gray-100">
                  <Icons.Lightbulb size={18} className="mr-2 text-amber-300" />
                  Recommendations
                </h3>
                <ul className="space-y-3">
                  {recommendations.map((recommendation, idx) => (
                    <li
                      key={idx}
                      className="flex items-start bg-amber-950/20 p-3 rounded-lg transition-colors duration-200 hover:bg-amber-950/30"
                    >
                      <Icons.ChevronRight
                        size={18}
                        className="mr-2 text-amber-300 mt-1 flex-shrink-0"
                      />
                      <span className="text-gray-300 text-sm leading-6">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisSection;