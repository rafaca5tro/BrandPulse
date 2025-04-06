import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Icons } from './icons';

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  isBot?: boolean;
}

interface CommentPanelProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
  entityId: string; // e.g., metric row ID
  metricData?: { metric: string; value: string | number; trend: string; insight: string }; // Optional metric context
}

const CommentPanel: React.FC<CommentPanelProps> = ({ comments, onAddComment, entityId, metricData }) => {
  const [newComment, setNewComment] = useState('');
  const [botComments, setBotComments] = useState<Comment[]>([]);

  // Mock AI InsightBot logic
  const generateBotInsight = (data?: CommentPanelProps['metricData']) => {
    if (!data) return null;
    const { metric, value, trend, insight } = data;
    const valueNum = typeof value === 'number' ? value : parseFloat(value.toString()) || 0;
    let suggestion = '';
    if (trend === 'up' && valueNum > 80) suggestion = `Great job! Double down on ${metric.toLowerCase()} strategies.`;
    else if (trend === 'down' || valueNum < 70) suggestion = `Focus here: ${insight}. Consider A/B testing new approaches.`;
    else suggestion = `Stable ${metric.toLowerCase()}. Monitor for opportunities to push past ${value}.`;
    return {
      id: `bot-${Date.now()}`,
      user: 'InsightBot',
      text: suggestion,
      timestamp: new Date().toLocaleTimeString(),
      isBot: true,
    };
  };

  useEffect(() => {
    if (metricData && !botComments.some((c) => c.isBot)) {
      const botInsight = generateBotInsight(metricData);
      if (botInsight) setBotComments([botInsight]);
    }
  }, [metricData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const allComments = [...botComments, ...comments].sort((a, b) => a.id.localeCompare(b.id));

  return (
    <Card className="bg-gray-900/95 border border-gray-800/50 rounded-xl shadow-2xl p-4 max-w-md">
      <h4 className="text-sm font-semibold text-gray-100 font-['Inter'] mb-3">Comments</h4>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {allComments.length === 0 ? (
          <p className="text-sm text-gray-400 font-['Inter']">No comments yet.</p>
        ) : (
          allComments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 rounded-lg ${comment.isBot ? 'bg-purple-900/20' : 'bg-gray-800/30'}`}
            >
              <p className="text-xs text-gray-300 font-['Inter']">
                <span className={`font-medium ${comment.isBot ? 'text-purple-300' : 'text-gray-100'}`}>
                  {comment.user}
                </span>{' '}
                · {comment.timestamp}
              </p>
              <p className="text-sm text-gray-200 font-['Inter'] mt-1">{comment.text}</p>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex items-center space-x-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow bg-gray-800/50 border border-gray-700/50 rounded-lg p-2 text-sm text-gray-200 font-['Inter'] focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="p-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-200"
        >
          <Icons.Send size={16} className="text-white" />
        </button>
      </form>
    </Card>
  );
};

export default CommentPanel;