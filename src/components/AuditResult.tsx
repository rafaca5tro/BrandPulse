import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAuditResults } from '@/services/auditService';
import { AuditReport } from '@/types/supabase';
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { getUserPlan, redirectToStripeCheckout } from '@/services/stripeService';
import { exportToPdf } from '@/utils/pdfExport';
import { Icons } from './AuditResult/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CollapsibleTrigger, CollapsibleContent, Collapsible } from '@/components/ui/collapsible';
import { Checkbox } from "@/components/ui/checkbox";
import ScoreChart from './AuditResult/ScoreChart';
import CategoryBarChart from './AuditResult/CategoryBarChart';
import MetricCard from './AuditResult/MetricCard';
import { Separator } from '@/components/ui/separator';
import { fetchSocialMediaProfilePic } from '@/services/supabaseService';
import SocialMediaProfile from './AuditResult/SocialMediaProfile';
import SocialMediaMetrics from './AuditResult/SocialMediaMetrics';
import { Progress } from "@/components/ui/progress";
import AnalysisSection from './AuditResult/AnalysisSection';
import ColorPalette, { ColorSwatch } from './AuditResult/ColorPalette';
import TypographyDisplay, { FontStyle } from './AuditResult/TypographyDisplay';
import CompetitorComparison from './AuditResult/CompetitorComparison';
import KeyPhrases, { KeyPhrase } from './AuditResult/KeyPhrases';
import WebsitePerformance from './AuditResult/WebsitePerformance';
import { Loader2 } from "lucide-react";

Icons.Loader2 = Loader2;

const AuditResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<AuditReport | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [openMetrics, setOpenMetrics] = useState(true);
  const [exportWithRecommendations, setExportWithRecommendations] = useState(true);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [socialMediaProfiles, setSocialMediaProfiles] = useState<any[]>([]);
  const [previewError, setPreviewError] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const allContentRef = useRef<HTMLDivElement>(null);
  
  const urlParams = new URLSearchParams(location.search);
  const reportId = urlParams.get('reportId') || urlParams.get('report_id');
  
  type SupportedPlatform = 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'youtube' | 'website';
  
  interface UrlTypeInfo {
    type: SupportedPlatform;
    username?: string;
  }
  
  const detectUrlType = useCallback((url: string): UrlTypeInfo => {
    if (!url) return { type: 'website' };
    
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      if (hostname.includes('instagram.com')) {
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        return { type: 'instagram', username: pathParts[0] || '' };
      }
      
      if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        return { type: 'twitter', username: pathParts[0] || '' };
      }
      
      if (hostname.includes('facebook.com') || hostname.includes('fb.com')) {
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        return { type: 'facebook', username: pathParts[0] || '' };
      }
      
      if (hostname.includes('linkedin.com')) {
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        return { type: 'linkedin', username: pathParts[1] || '' };
      }
      
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        return { type: 'youtube', username: pathParts[0] || '' };
      }
      
      return { type: 'website' };
    } catch (e) {
      return { type: 'website' };
    }
  }, []);
  
  const getScoreColor = useCallback((score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  }, []);
  
  const getScoreBgColor = useCallback((score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  }, []);
  
  const reportDomain = useMemo(() => {
    if (!reportData?.url) return '';
    try {
      const urlObject = new URL(reportData.url);
      return urlObject.hostname;
    } catch (e) {
      return reportData.url;
    }
  }, [reportData?.url]);
  
  const urlType = useMemo(() => {
    return reportData?.url ? detectUrlType(reportData.url) : { type: 'website' as SupportedPlatform };
  }, [reportData?.url, detectUrlType]);
  
  const scoreBreakdown = useMemo(() => {
    if (!reportData?.score_breakdown) return [];
    return Object.entries(reportData.score_breakdown).map(([key, value]) => ({
      name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      score: value,
      color: getScoreBgColor(value)
    }));
  }, [reportData?.score_breakdown, getScoreBgColor]);

  const extractSocialMediaProfiles = useCallback(async (reportData: AuditReport) => {
    if (!reportData || !reportData.url) return;
    
    const profiles: any[] = [];
    
    const mainUrlType = detectUrlType(reportData.url);
    if (mainUrlType.type !== 'website' && mainUrlType.username) {
      const platform = mainUrlType.type;
      const username = mainUrlType.username;
      
      try {
        const profileData = await fetchSocialMediaProfilePic(reportData.url);
        
        profiles.push({
          platform,
          username: username.startsWith('@') ? username : `@${username}`,
          profileUrl: reportData.url,
          profilePicUrl: profileData?.profilePicUrl || null,
          primary: true
        });
      } catch (error) {
        console.error("Error fetching main profile:", error);
        
        profiles.push({
          platform, 
          username: username.startsWith('@') ? username : `@${username}`,
          profileUrl: reportData.url,
          primary: true
        });
      }
    }
    
    if (reportData.detailed_analysis?.social_media_analysis) {
      const analysis = reportData.detailed_analysis.social_media_analysis;
      
      if (typeof analysis.content_strategy === 'string') {
        const instagramMatches = analysis.content_strategy.match(/@[\w.]+/g);
        const twitterMatches = analysis.content_strategy.match(/twitter\.com\/[\w]+/g);
        
        if (instagramMatches && instagramMatches.length > 0) {
          for (const handle of instagramMatches) {
            if (profiles.some(p => p.username === handle)) continue;
            
            const username = handle;
            const profileUrl = `https://instagram.com/${username.replace('@', '')}`;
            
            try {
              const profileData = await fetchSocialMediaProfilePic(profileUrl);
              
              profiles.push({
                platform: 'instagram',
                username,
                profileUrl,
                profilePicUrl: profileData?.profilePicUrl || null,
                primary: false
              });
            } catch (error) {
              console.error("Error fetching Instagram profile:", error);
              
              profiles.push({
                platform: 'instagram',
                username,
                profileUrl,
                primary: false
              });
            }
          }
        }
        
        if (twitterMatches && twitterMatches.length > 0) {
          for (const handle of twitterMatches) {
            if (profiles.some(p => p.profileUrl.includes(handle))) continue;
            
            const profileUrl = `https://${handle}`;
            const username = handle.split('/').pop() || '';
            
            try {
              const profileData = await fetchSocialMediaProfilePic(profileUrl);
              
              profiles.push({
                platform: 'twitter',
                username: `@${username}`,
                profileUrl,
                profilePicUrl: profileData?.profilePicUrl || null,
                primary: false
              });
            } catch (error) {
              console.error("Error fetching Twitter profile:", error);
              
              profiles.push({
                platform: 'twitter',
                username: `@${username}`,
                profileUrl,
                primary: false
              });
            }
          }
        }
      }
    }
    
    if (profiles.length > 0) {
      setSocialMediaProfiles(profiles);
    }
  }, [detectUrlType]);

  useEffect(() => {
    if (!reportId) {
      navigate('/audit');
      return;
    }
    
    const fetchAuditData = async () => {
      setLoading(true);
      try {
        const report = await getAuditResults(reportId);
        
        if (report) {
          console.log("Fetched audit report:", report);
          setReportData(report);
          
          await extractSocialMediaProfiles(report);
          
          if (reportData?.url && !report.instagram_profile_pic) {
            try {
              const profileData = await fetchSocialMediaProfilePic(report.url);
              if (profileData && profileData.profilePicUrl) {
                setReportData(prev => prev ? { ...prev, instagram_profile_pic: profileData.profilePicUrl } : null);
              }
            } catch (profileError) {
              console.error("Error fetching profile picture:", profileError);
            }
          }
        } else {
          toast.error("Could not fetch report data");
          navigate('/audit');
        }
      } catch (error) {
        console.error("Error fetching report:", error);
        toast.error(`${error instanceof Error ? error.message : 'Unknown error'}`);
        navigate('/audit');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuditData();
  }, [reportId, navigate, detectUrlType, extractSocialMediaProfiles]);

  const handleShareReport = useCallback(() => {
    if (!reportData) {
      toast.error("No report data available to share");
      return;
    }
    
    const shareUrl = window.location.href;
    
    try {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard", {
        description: "Share this link to allow others to view this report."
      });
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link. Please copy the URL manually from your browser address bar.");
    }
  }, [reportData]);

  const handleExportPDF = useCallback(async () => {
    const userPlan = getUserPlan();
    
    if (userPlan === 'free') {
      toast.error("Pro Feature", {
        description: "PDF export is available on the Pro and Team plans.",
        action: {
          label: "Upgrade",
          onClick: () => redirectToStripeCheckout('pro')
        },
      });
      return;
    }
    
    if (!reportData) {
      toast.error("No report data available to generate PDF");
      return;
    }

    try {
      setIsExporting(true);
      setExportProgress(10);
      
      const loadingToast = toast.loading("Generating PDF report...", {
        description: "Please wait while we prepare your document"
      });
      
      setExportProgress(30);
      
      await exportToPdf(reportData, {
        includeRecommendations: exportWithRecommendations
      });
      
      setExportProgress(100);
      toast.dismiss(loadingToast);
      toast.success("Report Exported", {
        description: "Your complete brand audit has been downloaded as a PDF"
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export Failed", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [reportData, exportWithRecommendations]);

  const getFaviconUrl = useCallback((url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
    } catch (e) {
      return null;
    }
  }, []);

  const handleImageError = useCallback(() => {
    setPreviewError(true);
  }, []);

  const getSocialPlatformColor = (platform: string): string => {
    switch(platform.toLowerCase()) {
      case 'instagram': return 'from-purple-500 via-pink-500 to-orange-500';
      case 'twitter': case 'x': return 'from-blue-400 to-blue-600';
      case 'facebook': return 'from-blue-600 to-blue-800';
      case 'linkedin': return 'from-blue-500 to-blue-700';
      case 'youtube': return 'from-red-500 to-red-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const renderSocialIcon = (platform: string, size: number = 14) => {
    switch(platform.toLowerCase()) {
      case 'instagram':
        return <Icons.Instagram size={size} className="mr-0.5" />;
      case 'twitter':
      case 'x':
        return <Icons.Twitter size={size} className="mr-0.5" />;
      case 'facebook':
        return <Icons.Facebook size={size} className="mr-0.5" />;
      case 'linkedin':
        return <Icons.Linkedin size={size} className="mr-0.5" />;
      case 'youtube':
        return <Icons.Youtube size={size} className="mr-0.5" />;
      default:
        return <Icons.Globe size={size} className="mr-0.5" />;
    }
  };

  const getUsernameFromUrlType = (urlTypeInfo: UrlTypeInfo): string => {
    return urlTypeInfo.type !== 'website' ? urlTypeInfo.username || '' : '';
  };

  const getMetricIcon = (metricName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'readability_score': <Icons.FileText size={20} />,
      'emotional_appeal': <Icons.Heart size={20} />,
      'call_to_action_effectiveness': <Icons.Target size={20} />,
      'differentiation_score': <Icons.Award size={20} />,
      'post_engagement_rate': <Icons.Users size={20} />,
      'follower_growth_rate': <Icons.TrendingUp size={20} />,
      'content_consistency_score': <Icons.BarChart2 size={20} />,
      'mobile_speed_score': <Icons.Zap size={20} />,
      'accessibility_score': <Icons.Eye size={20} />,
      'seo_optimization': <Icons.Search size={20} />,
    };
    
    return iconMap[metricName] || <Icons.BarChart size={20} />;
  };
  
  const getMetricDescription = (metricName: string) => {
    const descriptionMap: Record<string, string> = {
      'readability_score': 'Measures how easy your content is to read and understand based on sentence structure and vocabulary complexity.',
      'emotional_appeal': 'Measures how well your content emotionally resonates with your audience through tone and language.',
      'call_to_action_effectiveness': 'Evaluates the clarity, placement, and persuasiveness of your calls to action.',
      'differentiation_score': 'How effectively your brand stands out from competitors based on unique value propositions.',
      'post_engagement_rate': 'Average engagement (likes, comments, shares) per post relative to your total follower count.',
      'follower_growth_rate': 'Monthly percentage increase in followers based on trend analysis of your account growth.',
      'content_consistency_score': 'Measures how consistently you post content and maintain visual/messaging coherence.',
      'mobile_speed_score': 'How quickly your site loads and becomes interactive on mobile devices.',
      'accessibility_score': 'How well your site can be used by people with various disabilities or impairments.',
      'seo_optimization': 'Evaluates on-page SEO factors like metadata quality, keyword usage, and content structure.',
    };
    
    return descriptionMap[metricName] || '';
  };

  const getMetricSource = (metricName: string) => {
    const sourceMap: Record<string, string> = {
      'readability_score': 'Flesch-Kincaid readability test',
      'emotional_appeal': 'Sentiment analysis',
      'call_to_action_effectiveness': 'Conversion optimization best practices',
      'differentiation_score': 'Competitive market analysis',
      'post_engagement_rate': 'Social media average for last 30 days',
      'follower_growth_rate': '3-month rolling average',
      'content_consistency_score': 'Posting frequency and style analysis',
      'mobile_speed_score': 'Based on PageSpeed Insights metrics',
      'accessibility_score': 'WCAG 2.1 standards',
      'seo_optimization': 'Search engine optimization standards',
    };
    
    return sourceMap[metricName] || '';
  };
  
  const processColorPalette = (colorPaletteData: any): ColorSwatch[] => {
    if (!colorPaletteData) return [];
    
    if (Array.isArray(colorPaletteData)) {
      return colorPaletteData.map(color => ({
        color: color.hex || color.color || '#CCCCCC',
        name: color.name || 'Unnamed',
        hex: color.hex || color.color || '#CCCCCC'
      }));
    }
    
    return [];
  };

  const processFontsData = (visualAnalysis: any): FontStyle[] => {
    if (!visualAnalysis) return [];
    
    if (visualAnalysis.fonts && Array.isArray(visualAnalysis.fonts)) {
      return visualAnalysis.fonts.map((font: any) => ({
        name: font.name || 'Unnamed Font',
        style: font.style || 'Regular',
        sample: font.sample || "The quick brown fox jumps over the lazy dog",
        usage: font.usage || 'General'
      }));
    }
    
    return [];
  };

  const processKeyPhrases = (messagingAnalysis: any): KeyPhrase[] => {
    if (!messagingAnalysis) return [];
    
    if (messagingAnalysis.key_phrases && Array.isArray(messagingAnalysis.key_phrases)) {
      return messagingAnalysis.key_phrases.map((phrase: string) => ({
        phrase: phrase,
        sentiment: 'neutral',
      }));
    }
    
    return [];
  };

  const getCompetitorData = (competitorData: any) => {
    if (!competitorData) return [];
    
    if (typeof competitorData === 'string') {
      return [];
    }
    
    if (Array.isArray(competitorData)) {
      return competitorData;
    }
    
    return [];
  };
  
  const processPerformanceMetrics = (metrics: any): any[] => {
    if (!metrics) return [];
    
    return Object.entries(metrics).map(([key, value]) => ({
      name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: typeof value === 'number' ? value : 0,
      description: getMetricDescription(key),
      icon: getMetricIcon(key)
    }));
  };
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-6" />
            <Skeleton className="h-6 w-1/2 mb-12" />
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
            
            <Skeleton className="h-64 mb-8" />
            <Skeleton className="h-64" />
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  if (!reportData) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto" ref={reportRef}>
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Brand Audit Results</h1>
              <div className="flex items-center">
                <p className="text-lg text-gray-600 flex items-center">
                  Analysis for: 
                  <a 
                    href={reportData.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 font-medium hover:underline ml-2 flex items-center gap-2"
                  >
                    <Avatar className="h-10 w-10 rounded-full border border-gray-200 overflow-hidden">
                      {urlType.type !== 'website' ? (
                        <AvatarImage 
                          src={reportData.instagram_profile_pic || socialMediaProfiles.find(p => p.primary)?.profilePicUrl || `https://ui-avatars.com/api/?name=${getUsernameFromUrlType(urlType)}&background=405DE6&color=fff&size=128`} 
                          alt={`@${getUsernameFromUrlType(urlType)} profile`}
                          className="object-cover"
                        />
                      ) : (
                        <AvatarImage 
                          src={getFaviconUrl(reportData.url) || ''} 
                          alt="Site favicon"
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback className="bg-[#8BFE3E] text-black font-medium">
                        {reportDomain.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{reportDomain}</span>
                    {urlType.type !== 'website' && getUsernameFromUrlType(urlType) && (
                      <span className={`inline-flex items-center gap-1 ml-1 bg-gradient-to-r ${getSocialPlatformColor(urlType.type)} text-white px-2 py-0.5 rounded-full text-sm`}>
                        {renderSocialIcon(urlType.type)}
                        @{getUsernameFromUrlType(urlType)}
                      </span>
                    )}
                  </a>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {isExporting && (
                <div className="w-full mb-2">
                  <Progress value={exportProgress} className="h-2" />
                </div>
              )}
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleExportPDF}
                disabled={isExporting}
                aria-label="Export report as PDF"
                title="Download complete report as PDF document"
              >
                {isExporting ? (
                  <>
                    <Icons.Loader2 size={18} className="animate-spin mr-1" aria-hidden="true" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Icons.FilePdf size={18} aria-hidden="true" />
                    Export PDF
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleShareReport}
                aria-label="Share report link"
                title="Copy report link to clipboard"
              >
                <Icons.Share2 size={18} aria-hidden="true" />
                Share Report
              </Button>
              <Button 
                onClick={() => navigate('/audit')}
                className="bg-[#8BFE3E] hover:bg-[#8BFE3E]/90 text-black flex items-center gap-2"
                aria-label="Create new audit" 
              >
                <Icons.PlusCircle size={18} aria-hidden="true" className="mr-1" />
                New Audit
              </Button>
            </div>
          </div>
          
          <div ref={allContentRef}>
            <Tabs defaultValue="overview" className="w-full mb-8" onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start overflow-x-auto border-b-0 bg-transparent p-0">
                <TabsTrigger value="overview" className="data-[state=active]:bg-[#8BFE3E]/20 data-[state=active]:text-black">
                  <Icons.PieChart size={16} className="mr-2" />
                  Overview
                </TabsTrigger>
                {reportData?.detailed_analysis?.visual_analysis && (
                  <TabsTrigger value="visual" className="data-[state=active]:bg-[#8BFE3E]/20 data-[state=active]:text-black">
                    <Icons.Palette size={16} className="mr-2" />
                    Visual Identity
                  </TabsTrigger>
                )}
                {reportData?.detailed_analysis?.messaging_analysis && (
                  <TabsTrigger value="messaging" className="data-[state=active]:bg-[#8BFE3E]/20 data-[state=active]:text-black">
                    <Icons.Type size={16} className="mr-2" />
                    Messaging
                  </TabsTrigger>
                )}
                {reportData?.detailed_analysis?.positioning_analysis && (
                  <TabsTrigger value="positioning" className="data-[state=active]:bg-[#8BFE3E]/20 data-[state=active]:text-black">
                    <Icons.Target size={16} className="mr-2" />
                    Positioning
                  </TabsTrigger>
                )}
                {reportData?.detailed_analysis?.website_analysis && (
                  <TabsTrigger value="website" className="data-[state=active]:bg-[#8BFE3E]/20 data-[state=active]:text-black">
                    <Icons.Globe size={16} className="mr-2" />
                    Website
                  </TabsTrigger>
                )}
                {reportData?.detailed_analysis?.social_media_analysis && (
                  <TabsTrigger value="social" className="data-[state=active]:bg-[#8BFE3E]/20 data-[state=active]:text-black">
                    <Icons.Share2 size={16} className="mr-2" />
                    Social Media
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="shadow-lg border-0 overflow-hidden col-span-1">
                      <CardHeader className="pb-2 bg-gradient-to-r from-[#8BFE3E]/10 to-transparent">
                        <CardTitle className="text-2xl flex items-center">
                          <Icons.Award size={24} className="mr-2 text-[#8BFE3E]" /> 
                          Overall Score
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6 flex flex-col items-center">
                        <ScoreChart score={reportData.score} size={180} />
                        
                        <div className="mt-4 text-center">
                          <p className="text-gray-600 mb-1 text-sm">Brand Performance</p>
                          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium">
                            {reportData.score >= 80 ? (
                              <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-full flex items-center">
                                <Icons.Check size={16} className="mr-1" /> Excellent
                              </span>
                            ) : reportData.score >= 70 ? (
                              <span className="bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full flex items-center">
                                <Icons.AlertTriangle size={16} className="mr-1" /> Good
                              </span>
                            ) : (
                              <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-full flex items-center">
                                <Icons.AlertTriangle size={16} className="mr-1" /> Needs Improvement
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-lg border-0 overflow-hidden col-span-2">
                      <CardHeader className="pb-2 bg-gradient-to-r from-[#8BFE3E]/10 to-transparent">
                        <CardTitle className="text-2xl flex items-center">
                          <Icons.BarChart size={24} className="mr-2 text-[#8BFE3E]" /> 
                          Category Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <CategoryBarChart data={scoreBreakdown} height={220} />
                        
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          {scoreBreakdown.map((item) => (
                            <div key={item.name} className="flex items-center">
                              <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: item.color }}></div>
                              <span className="text-gray-700">{item.name}: <strong>{item.score}</strong></span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="shadow-lg border-0 overflow-hidden">
                    <CardHeader className="pb-2 bg-gradient-to-r from-[#8BFE3E]/10 to-transparent">
                      <CardTitle className="text-2xl flex items-center">
                        <Icons.FileText size={24} className="mr-2 text-[#8BFE3E]" /> 
                        Executive Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-5 gap-6">
                        <div className="md:col-span-3">
                          <div className="prose max-w-none">
                            <p className="text-gray-700 text-lg leading-relaxed">{reportData.summary}</p>
                            
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-medium mb-2 flex items-center text-green-600">
                                  <Icons.Check size={18} className="mr-2" /> Strengths
                                </h3>
                                <ul className="space-y-2">
                                  {scoreBreakdown
                                    .filter(item => item.score >= 75)
                                    .map((item, idx) => (
                                      <li key={idx} className="flex items-center">
                                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                                        <span>Strong {item.name.toLowerCase()} ({item.score}/100)</span>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                              
                              <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-medium mb-2 flex items-center text-yellow-600">
                                  <Icons.AlertTriangle size={18} className="mr-2" /> Improvement Areas
                                </h3>
                                <ul className="space-y-2">
                                  {scoreBreakdown
                                    .filter(item => item.score < 75)
                                    .map((item, idx) => (
                                      <li key={idx} className="flex items-center">
                                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                                        <span>{item.name} needs attention ({item.score}/100)</span>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="md:col-span-2">
                          {reportData.screenshot_url && !previewError ? (
                            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm h-full">
                              <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center">
                                <Icons.Image size={16} className="mr-2 text-gray-500" />
                                <span className="text-sm font-medium">Visual Preview</span>
                              </div>
                              <div className="overflow-hidden">
                                <img 
                                  src={reportData.screenshot_url} 
                                  alt={`Screenshot of ${reportData.url}`} 
                                  className="w-full h-auto object-cover"
                                  onError={handleImageError}
                                />
                              </div>
                            </div>
                          ) : urlType.type !== 'website' ? (
                            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm h-full">
                              <div className={`bg-gradient-to-br ${getSocialPlatformColor(urlType.type)} h-full p-6 flex flex-col items-center justify-center text-white`}>
                                <Avatar className="h-24 w-24 rounded-full border-4 border-white overflow-hidden mb-4">
                                  <AvatarImage 
                                    src={reportData.instagram_profile_pic || socialMediaProfiles.find(p => p.primary)?.profilePicUrl || `https://ui-avatars.com/api/?name=${getUsernameFromUrlType(urlType)}&background=405DE6&color=fff&size=128`} 
                                    alt={`@${getUsernameFromUrlType(urlType)} profile`}
                                    className="object-cover"
                                  />
                                  <AvatarFallback className="bg-white text-black font-medium text-xl">
                                    {getUsernameFromUrlType(urlType)?.substring(0, 2).toUpperCase() || '?'}
                                  </AvatarFallback>
                                </Avatar>
                                <h3 className="text-2xl font-bold mb-1">
                                  @{getUsernameFromUrlType(urlType)}
                                </h3>
                                <div className="flex items-center gap-1 text-white/90">
                                  {renderSocialIcon(urlType.type, 16)}
                                  <span className="capitalize">
                                    {urlType.type} Profile
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm h-full">
                              <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center">
                                <Icons.Globe size={16} className="mr-2 text-gray-500" />
                                <span className="text-sm font-medium">Website Preview</span>
                              </div>
                              <div className="p-6 flex flex-col items-center justify-center text-center h-full">
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                                  <Icons.Globe size={24} className="text-gray-500" />
                                </div>
                                <h3 className="text-lg font-medium mb-1">
                                  {reportDomain}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                  No preview image available
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Collapsible
                    open={openMetrics}
                    onOpenChange={setOpenMetrics}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer" onClick={() => setOpenMetrics(!openMetrics)}>
                      <h3 className="text-xl font-semibold flex items-center">
                        <Icons.BarChart size={20} className="mr-2 text-[#8BFE3E]" />
                        Key Metrics
                      </h3>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          {openMetrics ? (
                            <Icons.ChevronUp size={18} className="text-gray-500" />
                          ) : (
                            <Icons.ChevronDown size={18} className="text-gray-500" />
                          )}
                          <span className="sr-only">Toggle</span>
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                      <div className="p-6 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {reportData.score_breakdown && Object.entries(reportData.score_breakdown).map(([key, value]) => (
                            <MetricCard 
                              key={key}
                              title={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              value={value}
                              icon={getMetricIcon(key) as any}
                              description={getMetricDescription(key)}
                              source={getMetricSource(key)}
                            />
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </TabsContent>
              
              {/* Visual Identity Tab */}
              {reportData?.detailed_analysis?.visual_analysis && (
                <TabsContent value="visual" className="mt-6">
                  <div className="space-y-8">
                    <AnalysisSection 
                      title="Color Analysis"
                      icon="Palette"
                      content={
                        typeof reportData.detailed_analysis.visual_analysis.color_palette === 'string' 
                          ? reportData.detailed_analysis.visual_analysis.color_palette 
                          : "Color palette analysis data available below."
                      }
                    />
                    
                    {/* Only render ColorPalette if color_palette is an array */}
                    {reportData.detailed_analysis.visual_analysis.color_palette && 
                     typeof reportData.detailed_analysis.visual_analysis.color_palette !== 'string' &&
                     Array.isArray(reportData.detailed_analysis.visual_analysis.color_palette) && (
                      <ColorPalette 
                        title="Brand Color Palette"
                        colors={processColorPalette(reportData.detailed_analysis.visual_analysis.color_palette)}
                      />
                    )}
                    
                    <AnalysisSection 
                      title="Typography Analysis"
                      icon="Type"
                      content={reportData.detailed_analysis.visual_analysis.typography || ''}
                    />
                    
                    {/* Use the processFontsData function to safely handle fonts */}
                    {processFontsData(reportData.detailed_analysis.visual_analysis).length > 0 && (
                      <TypographyDisplay 
                        fonts={processFontsData(reportData.detailed_analysis.visual_analysis)}
                      />
                    )}
                    
                    <AnalysisSection 
                      title="Logo Assessment"
                      icon="Image"
                      content={reportData.detailed_analysis.visual_analysis.logo_usage || ''}
                    />
                    
                    <AnalysisSection 
                      title="Visual Consistency"
                      icon="Layout"
                      content={reportData.detailed_analysis.visual_analysis.design_language || ''}
                    />
                    
                    <AnalysisSection 
                      title="Recommendations"
                      icon="Lightbulb"
                      content={
                        Array.isArray(reportData.detailed_analysis.visual_analysis.recommendations) 
                          ? reportData.detailed_analysis.visual_analysis.recommendations.join('\n\n') 
                          : typeof reportData.detailed_analysis.visual_analysis.recommendations === 'string'
                            ? reportData.detailed_analysis.visual_analysis.recommendations
                            : ''
                      }
                      recommendations={
                        Array.isArray(reportData.detailed_analysis.visual_analysis.recommendations)
                          ? reportData.detailed_analysis.visual_analysis.recommendations
                          : []
                      }
                    />
                  </div>
                </TabsContent>
              )}
              
              {/* Messaging Tab */}
              {reportData?.detailed_analysis?.messaging_analysis && (
                <TabsContent value="messaging" className="mt-6">
                  <div className="space-y-8">
                    <AnalysisSection 
                      title="Tone & Voice Analysis"
                      icon="MessageSquare"
                      content={reportData.detailed_analysis.messaging_analysis.tone_of_voice || ''}
                    />
                    
                    <AnalysisSection 
                      title="Value Proposition Clarity"
                      icon="Award"
                      content={reportData.detailed_analysis.messaging_analysis.key_messages || ''}
                    />
                    
                    {/* Use processKeyPhrases to safely handle key_phrases */}
                    {processKeyPhrases(reportData.detailed_analysis.messaging_analysis).length > 0 && (
                      <KeyPhrases 
                        phrases={processKeyPhrases(reportData.detailed_analysis.messaging_analysis)}
                      />
                    )}
                    
                    <AnalysisSection 
                      title="Message Consistency"
                      icon="Check"
                      content={reportData.detailed_analysis.messaging_analysis.communication_strategy || ''}
                    />
                    
                    <AnalysisSection 
                      title="Call-to-Action Effectiveness"
                      icon="Target"
                      content={reportData.detailed_analysis.messaging_analysis.key_messages || ''}
                    />
                    
                    <AnalysisSection 
                      title="Recommendations"
                      icon="Lightbulb"
                      content={
                        Array.isArray(reportData.detailed_analysis.messaging_analysis.recommendations) 
                          ? reportData.detailed_analysis.messaging_analysis.recommendations.join('\n\n') 
                          : typeof reportData.detailed_analysis.messaging_analysis.recommendations === 'string'
                            ? reportData.detailed_analysis.messaging_analysis.recommendations
                            : ''
                      }
                      recommendations={
                        Array.isArray(reportData.detailed_analysis.messaging_analysis.recommendations)
                          ? reportData.detailed_analysis.messaging_analysis.recommendations
                          : []
                      }
                    />
                  </div>
                </TabsContent>
              )}
              
              {/* Positioning Tab */}
              {reportData?.detailed_analysis?.positioning_analysis && (
                <TabsContent value="positioning" className="mt-6">
                  <div className="space-y-8">
                    <AnalysisSection 
                      title="Brand Differentiation"
                      icon="Award"
                      content={reportData.detailed_analysis.positioning_analysis.unique_selling_points || ''}
                    />
                    
                    <AnalysisSection 
                      title="Target Audience Alignment"
                      icon="Users"
                      content={reportData.detailed_analysis.positioning_analysis.unique_selling_points || ''}
                    />
                    
                    {/* Use getCompetitorData to safely handle competitor_comparison */}
                    {getCompetitorData(reportData.detailed_analysis.positioning_analysis.competitor_comparison).length > 0 && (
                      <CompetitorComparison 
                        competitors={getCompetitorData(reportData.detailed_analysis.positioning_analysis.competitor_comparison)}
                      />
                    )}
                    
                    <AnalysisSection 
                      title="Market Positioning"
                      icon="Target"
                      content={reportData.detailed_analysis.positioning_analysis.market_position || ''}
                    />
                    
                    <AnalysisSection 
                      title="Recommendations"
                      icon="Lightbulb"
                      content={
                        Array.isArray(reportData.detailed_analysis.positioning_analysis.recommendations) 
                          ? reportData.detailed_analysis.positioning_analysis.recommendations.join('\n\n') 
                          : typeof reportData.detailed_analysis.positioning_analysis.recommendations === 'string'
                            ? reportData.detailed_analysis.positioning_analysis.recommendations
                            : ''
                      }
                      recommendations={
                        Array.isArray(reportData.detailed_analysis.positioning_analysis.recommendations)
                          ? reportData.detailed_analysis.positioning_analysis.recommendations
                          : []
                      }
                    />
                  </div>
                </TabsContent>
              )}
              
              {/* Website Tab */}
              {reportData?.detailed_analysis?.website_analysis && (
                <TabsContent value="website" className="mt-6">
                  <div className="space-y-8">
                    <AnalysisSection 
                      title="User Experience Analysis"
                      icon="Users"
                      content={reportData.detailed_analysis.website_analysis.user_experience || ''}
                    />
                    
                    {reportData.detailed_analysis.website_analysis.performance_metrics && (
                      <WebsitePerformance 
                        metrics={processPerformanceMetrics(reportData.detailed_analysis.website_analysis.performance_metrics)}
                      />
                    )}
                    
                    <AnalysisSection 
                      title="Content Structure"
                      icon="FileText"
                      content={reportData.detailed_analysis.website_analysis.content_quality || ''}
                    />
                    
                    <AnalysisSection 
                      title="Mobile Responsiveness"
                      icon="Smartphone"
                      content={reportData.detailed_analysis.website_analysis.performance || ''}
                    />
                    
                    <AnalysisSection 
                      title="SEO Evaluation"
                      icon="Search"
                      content={reportData.detailed_analysis.website_analysis.performance || ''}
                    />
                    
                    <AnalysisSection 
                      title="Recommendations"
                      icon="Lightbulb"
                      content={
                        Array.isArray(reportData.detailed_analysis.website_analysis.recommendations) 
                          ? reportData.detailed_analysis.website_analysis.recommendations.join('\n\n') 
                          : typeof reportData.detailed_analysis.website_analysis.recommendations === 'string'
                            ? reportData.detailed_analysis.website_analysis.recommendations
                            : ''
                      }
                      recommendations={
                        Array.isArray(reportData.detailed_analysis.website_analysis.recommendations)
                          ? reportData.detailed_analysis.website_analysis.recommendations
                          : []
                      }
                    />
                  </div>
                </TabsContent>
              )}
              
              {/* Social Media Tab */}
              {reportData?.detailed_analysis?.social_media_analysis && (
                <TabsContent value="social" className="mt-6">
                  <div className="space-y-8">
                    {socialMediaProfiles.length > 0 && (
                      <Card className="shadow-lg border-0 overflow-hidden">
                        <CardHeader className="pb-2 bg-gradient-to-r from-[#8BFE3E]/10 to-transparent">
                          <CardTitle className="text-2xl flex items-center">
                            <Icons.Users size={24} className="mr-2 text-[#8BFE3E]" /> 
                            Social Media Profiles
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {socialMediaProfiles.map((profile, index) => (
                              <SocialMediaProfile 
                                key={index}
                                platform={profile.platform}
                                username={profile.username}
                                profileUrl={profile.profileUrl}
                                profilePicUrl={profile.profilePicUrl}
                                primary={profile.primary}
                              />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {reportData.detailed_analysis.social_media_analysis.engagement_metrics && (
                      <SocialMediaMetrics 
                        metrics={reportData.detailed_analysis.social_media_analysis.engagement_metrics}
                      />
                    )}
                    
                    <AnalysisSection 
                      title="Content Strategy"
                      icon="FileText"
                      content={reportData.detailed_analysis.social_media_analysis.content_strategy || ''}
                    />
                    
                    <AnalysisSection 
                      title="Audience Engagement"
                      icon="MessageSquare"
                      content={reportData.detailed_analysis.social_media_analysis.engagement || ''}
                    />
                    
                    <AnalysisSection 
                      title="Channel Effectiveness"
                      icon="BarChart"
                      content={reportData.detailed_analysis.social_media_analysis.growth_opportunities || ''}
                    />
                    
                    <AnalysisSection 
                      title="Recommendations"
                      icon="Lightbulb"
                      content={
                        Array.isArray(reportData.detailed_analysis.social_media_analysis.recommendations) 
                          ? reportData.detailed_analysis.social_media_analysis.recommendations.join('\n\n') 
                          : typeof reportData.detailed_analysis.social_media_analysis.recommendations === 'string'
                            ? reportData.detailed_analysis.social_media_analysis.recommendations
                            : ''
                      }
                      recommendations={
                        Array.isArray(reportData.detailed_analysis.social_media_analysis.recommendations)
                          ? reportData.detailed_analysis.social_media_analysis.recommendations
                          : []
                      }
                    />
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AuditResult;
