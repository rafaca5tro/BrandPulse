
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from './icons';

// Define interfaces for type safety
export interface KeyPhrase {
  phrase: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  context?: string;
  frequency?: number;
}

interface KeyPhrasesProps {
  phrases: KeyPhrase[];
  title?: string;
}

const KeyPhrases: React.FC<KeyPhrasesProps> = ({ phrases, title = "Key Phrases & Messaging" }) => {
  const getSentimentStyles = (sentiment: KeyPhrase['sentiment']) => {
    switch (sentiment) {
      case 'positive': return { color: 'text-emerald-400', bg: 'bg-emerald-900/20' };
      case 'negative': return { color: 'text-rose-400', bg: 'bg-rose-900/20' };
      case 'neutral': return { color: 'text-purple-400', bg: 'bg-purple-900/20' };
      default: return { color: 'text-gray-400', bg: 'bg-gray-800/20' };
    }
  };

  const getSentimentIcon = (sentiment: KeyPhrase['sentiment']) => {
    switch (sentiment) {
      case 'positive': return <Icons.ThumbsUp size={16} className="text-emerald-400" />;
      case 'negative': return <Icons.ThumbsDown size={16} className="text-rose-400" />;
      case 'neutral': return <Icons.Info size={16} className="text-purple-400" />;
      default: return <Icons.Info size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="mt-6 animate-fade-in">
      <h3 className="text-xl font-semibold mb-4 font-['Inter'] text-gray-100 tracking-tight">
        {title}
      </h3>
      <Card className="border border-gray-800/50 bg-gray-900/95 rounded-xl shadow-2xl">
        <CardContent className="p-6">
          <div className="space-y-4">
            {phrases.map((item, index) => {
              const { color, bg } = getSentimentStyles(item.sentiment);
              return (
                <div
                  key={index}
                  className={`p-4 border border-gray-700/50 rounded-lg ${bg} transition-all duration-200 hover:shadow-[0_0_10px_rgba(147,51,234,0.1)]`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-100 font-['Inter']">{item.phrase}</p>
                    <div className="flex items-center space-x-2">
                      {item.frequency && (
                        <span className="text-xs bg-gray-800/50 text-gray-300 px-2 py-1 rounded-full">
                          {item.frequency}x
                        </span>
                      )}
                      <span className={`flex items-center ${color}`}>
                        {getSentimentIcon(item.sentiment)}
                      </span>
                    </div>
                  </div>
                  {item.context && (
                    <p className="text-sm text-gray-400 italic font-['Inter']">"{item.context}"</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyPhrases;