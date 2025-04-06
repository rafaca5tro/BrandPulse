
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from './icons';

// Define interfaces for type safety
interface Competitor {
  name: string;
  website?: string;
  logo?: string;
  strengths: string[];
  differentiators: string[];
}

interface CompetitorComparisonProps {
  competitors: Competitor[];
}

const CompetitorComparison: React.FC<CompetitorComparisonProps> = ({ competitors }) => {
  return (
    <div className="mt-6 animate-fade-in">
      <h3 className="text-xl font-semibold mb-4 font-['Inter'] text-gray-100 tracking-tight">
        Competitor Analysis
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {competitors.map((competitor, index) => (
          <Card
            key={index}
            className="border border-gray-800/50 bg-gray-900/95 rounded-xl shadow-2xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(147,51,234,0.2)]"
          >
            <CardContent className="p-6">
              {/* Header with logo and website */}
              <div className="flex items-center mb-5">
                <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center mr-4 border border-gray-700/50">
                  {competitor.logo ? (
                    <img
                      src={competitor.logo}
                      alt={`${competitor.name} logo`}
                      className="w-10 h-10 rounded-full object-contain"
                    />
                  ) : (
                    <Icons.Building size={24} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-medium font-['Inter'] text-gray-100">
                    {competitor.name}
                  </h4>
                  {competitor.website && (
                    <a
                      href={competitor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-purple-300 hover:text-purple-200 transition-colors duration-200 flex items-center"
                    >
                      <Icons.Globe size={12} className="mr-1" />
                      {competitor.website.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  )}
                </div>
              </div>

              {/* Strengths and Differentiators */}
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center text-gray-200">
                    <Icons.ThumbsUp size={16} className="mr-2 text-emerald-400" />
                    Strengths
                  </p>
                  <ul className="text-sm space-y-2">
                    {competitor.strengths.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 mr-2"></span>
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center text-gray-200">
                    <Icons.HeartHandshake size={16} className="mr-2 text-purple-400" />
                    Key Differentiators
                  </p>
                  <ul className="text-sm space-y-2">
                    {competitor.differentiators.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 mr-2"></span>
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompetitorComparison;