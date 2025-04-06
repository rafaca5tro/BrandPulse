
import React from 'react';
import AnalysisSection from './AnalysisSection';
import CategoryBarChart from './CategoryBarChart';
import ColorPalette, { ColorSwatch } from './ColorPalette';
import CompetitorComparison, { Competitor } from './CompetitorComparison';
import DashboardHeader from './DashboardHeader';
import TypographyDisplay, { FontStyle } from './TypographyDisplay';
import { ThemeToggle } from '../ThemeToggle';
import { Icons } from './icons';
import { toast } from 'sonner';
import { debugAuditConnection } from '../../services/debugAudit';

// Sample data
const pulseScoreData = [
  { name: 'Visibility', score: 85, color: '#9333ea' },
  { name: 'Sentiment', score: 72, color: '#10b981' },
  { name: 'Differentiation', score: 68, color: '#f59e0b' },
];

const brandColors: ColorSwatch[] = [
  { name: 'Primary', color: '#9333ea', hex: '#9333ea' },
  { name: 'Secondary', color: '#10b981', hex: '#10b981' },
  { name: 'Accent', color: '#f59e0b', hex: '#f59e0b' },
  { name: 'Dark BG', color: '#111827', hex: '#111827' },
  { name: 'Surface', color: '#1f2937', hex: '#1f2937' },
  { name: 'Border', color: '#374151', hex: '#374151' },
];

const competitors: Competitor[] = [
  {
    name: 'Competitor A',
    website: 'https://competitora.com',
    logo: 'https://via.placeholder.com/40',
    strengths: ['Strong social presence', 'High customer loyalty'],
    differentiators: ['Unique pricing model', 'Innovative UX'],
  },
  {
    name: 'Competitor B',
    website: 'https://competitorb.com',
    strengths: ['Global reach', 'Robust tech stack'],
    differentiators: ['AI-driven ads', 'Custom integrations'],
  },
];

const typographyFonts: FontStyle[] = [
  { 
    name: 'Inter', 
    style: 'Sans-serif', 
    sample: 'The quick brown fox jumps over the lazy dog.', 
    usage: 'Primary Font' 
  },
  { 
    name: 'Playfair Display', 
    style: 'Serif', 
    sample: 'The quick brown fox jumps over the lazy dog.', 
    usage: 'Headings' 
  },
  { 
    name: 'Roboto Mono', 
    style: 'Monospace', 
    sample: 'The quick brown fox jumps over the lazy dog.', 
    usage: 'Code Snippets' 
  },
];

const BrandPulseDashboard: React.FC = () => {
  const handleDebugClick = async () => {
    toast.loading("Testing audit connections...");
    const result = await debugAuditConnection();
    
    if (result) {
      toast.success("Audit connection check completed");
    } else {
      toast.error("Audit connection check failed");
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen">
      {/* Dashboard Header */}
      <DashboardHeader
        title="BrandPulse Dashboard"
        subtitle="Real-time insights for April 06, 2025"
        actions={
          <>
            <ThemeToggle />
            <button 
              onClick={handleDebugClick}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 mr-2"
            >
              Debug Audit
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-lg shadow-purple-900/20">
              Export Report
            </button>
          </>
        }
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8 space-y-12">
        {/* Pulse Score Chart */}
        <section>
          <CategoryBarChart data={pulseScoreData} height={300} />
          <p className="text-center text-gray-400 text-sm mt-4 font-['Inter']">
            Pulse Score: <span className="text-purple-300 font-semibold">75</span> / 100
          </p>
        </section>

        {/* Analysis Section */}
        <AnalysisSection
          title="Pulse Insights"
          icon="BrainCircuit"
          content="Your brand's Pulse Score reflects strong visibility but moderate differentiation. Sentiment is positive but could improve with targeted campaigns."
          points={[
            'Visibility boosted by recent social media campaigns.',
            'Sentiment dips due to customer service delays.',
            'Differentiation lags behind Competitor B's AI features.',
          ]}
          recommendations={[
            'Launch a customer feedback loop to boost sentiment.',
            'Innovate on UX to close the differentiation gap.',
          ]}
          performanceMetrics={{ visibility: 85, sentiment: 72, differentiation: 68 }}
        />

        {/* Typography Display */}
        <TypographyDisplay fonts={typographyFonts} />

        {/* Color Palette */}
        <ColorPalette title="Brand Colors" colors={brandColors} />

        {/* Competitor Comparison */}
        <CompetitorComparison competitors={competitors} />
      </main>
    </div>
  );
};

export default BrandPulseDashboard;
