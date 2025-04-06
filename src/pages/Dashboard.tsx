
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getUserAuditReports } from '@/services/supabaseService';
import { AuditReport } from '@/types/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, PlusCircle, RefreshCw, ExternalLink, FileText, AlertCircle, CheckCircle, Clock, Bookmark, Calendar, ChevronRight, BarChart, Users, Activity, Award } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<AuditReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReports = async () => {
    if (!user) return;
    
    try {
      const userReports = await getUserAuditReports(user.id);
      if (userReports) {
        // Sort reports by creation date (newest first)
        const sortedReports = [...userReports].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setReports(sortedReports);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Error loading your audit reports');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }
    
    if (user) {
      loadReports();
    }
  }, [user, loading, navigate]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
    toast.success('Reports refreshed');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">Error</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getFaviconUrl = (url: string) => {
    if (!url) return null;
    try {
      const hostname = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    } catch (e) {
      return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 50) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (loading || isLoading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-brandgreen border-l-transparent animate-spin"></div>
          </div>
          <h2 className="mt-6 text-xl font-medium text-brandblue dark:text-white">Loading your dashboard...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  // Add sample reports only if there are no real reports
  const ensureSampleReports = () => {
    if (reports.length === 0) {
      // Add demo reports for display purposes
      return [
        // Sample reports
        {
          id: 'sample-1',
          user_id: user?.id || '',
          title: 'Nike Brand Audit',
          url: 'https://nike.com',
          score: 87,
          score_breakdown: {
            visual_consistency: 92,
            messaging: 85,
            positioning: 90,
            social_media: 88,
            website: 80
          },
          summary: 'Nike demonstrates exceptional brand consistency across channels with strong visual identity and powerful messaging. Some improvements could be made to website performance.',
          status: 'completed',
          uploaded_files: [],
          created_at: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
          updated_at: new Date(Date.now() - 86400000 * 3).toISOString()
        },
        {
          id: 'sample-2',
          user_id: user?.id || '',
          title: 'Airbnb Brand Audit',
          url: 'https://airbnb.com',
          score: 92,
          score_breakdown: {
            visual_consistency: 95,
            messaging: 94,
            positioning: 90,
            social_media: 88,
            website: 93
          },
          summary: 'Airbnb has built an outstanding brand with consistent messaging and a unique visual identity. Their website delivers an excellent user experience with clear calls to action.',
          status: 'completed',
          uploaded_files: [],
          created_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
          updated_at: new Date(Date.now() - 86400000 * 5).toISOString()
        },
        {
          id: 'sample-3',
          user_id: user?.id || '',
          title: 'Spotify Brand Audit',
          url: 'https://spotify.com',
          score: 89,
          score_breakdown: {
            visual_consistency: 90,
            messaging: 87,
            positioning: 93,
            social_media: 91,
            website: 84
          },
          summary: 'Spotify has a strong brand presence with cohesive visual elements and clear positioning. Room for improvement in website conversion optimization and clearer messaging around premium features.',
          status: 'completed',
          uploaded_files: [],
          created_at: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
          updated_at: new Date(Date.now() - 86400000 * 7).toISOString()
        }
      ];
    }
    return reports;
  };

  const displayReports = reports.length > 0 ? reports : ensureSampleReports();
  
  // Get counts for status badges
  const getCounts = () => {
    const counts = {
      all: displayReports.length,
      completed: displayReports.filter(r => r.status === 'completed').length,
      processing: displayReports.filter(r => r.status === 'processing').length,
      pending: displayReports.filter(r => r.status === 'pending').length,
      failed: displayReports.filter(r => r.status === 'failed').length
    };
    return counts;
  };
  
  const statusCounts = getCounts();
  
  // Get average score for all completed reports
  const getAverageScore = () => {
    const completedReports = displayReports.filter(r => r.status === 'completed' && r.score !== undefined);
    if (completedReports.length === 0) return 0;
    
    const totalScore = completedReports.reduce((sum, report) => sum + (report.score || 0), 0);
    return Math.round(totalScore / completedReports.length);
  };
  
  const averageScore = getAverageScore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto py-8 px-4">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8 dark:shadow-black/20">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold font-playfair text-brandblue dark:text-white">Brand Insights Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage your brand performance reports</p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={refreshing}
                className="border-black text-black hover:bg-black/10 dark:border-gray-600 dark:text-white dark:hover:bg-white/10"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
              <Button onClick={() => navigate('/audit')} className="bg-brandgreen hover:bg-brandgreen/90 text-black">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Audit
              </Button>
            </div>
          </div>
          
          {/* Dashboard Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow border-gray-100 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Reports</p>
                    <h3 className="text-3xl font-bold mt-1 dark:text-white">{statusCounts.all}</h3>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex items-center mt-3 text-sm">
                  {statusCounts.all > 0 && (
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                        {statusCounts.completed} Completed
                      </Badge>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
                        {statusCounts.pending} Pending
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow border-gray-100 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Average Score</p>
                    <h3 className={`text-3xl font-bold mt-1 ${getScoreColor(averageScore)}`}>{averageScore}/100</h3>
                  </div>
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                    <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-3 dark:bg-gray-700">
                  <div 
                    className={`h-2 rounded-full ${
                      averageScore >= 80 ? 'bg-green-500' : 
                      averageScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${averageScore}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow border-gray-100 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Brand Consistency</p>
                    <h3 className="text-3xl font-bold mt-1 text-green-600 dark:text-green-400">
                      {displayReports.length > 0 ? 
                        Math.round(displayReports.reduce((sum, r) => sum + ((r.score_breakdown?.visual_consistency || 0)), 0) / displayReports.length) : 0}%
                    </h3>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <BarChart className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 dark:text-gray-400">
                  Visual consistency across all brand touchpoints
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow border-gray-100 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Social Media</p>
                    <h3 className="text-3xl font-bold mt-1 text-purple-600 dark:text-purple-400">
                      {displayReports.length > 0 ? 
                        Math.round(displayReports.reduce((sum, r) => sum + ((r.score_breakdown?.social_media || 0)), 0) / displayReports.length) : 0}%
                    </h3>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 dark:text-gray-400">
                  Social media engagement and presence
                </p>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-xl font-playfair font-bold mb-4 dark:text-white">Recent Brand Audits</h2>
          
          {displayReports.length === 0 ? (
            <Card className="bg-muted/50 border-dashed dark:bg-gray-800/50 dark:border-gray-700">
              <CardContent className="py-16 flex flex-col items-center justify-center text-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-4 dark:text-gray-600" />
                <h3 className="text-2xl font-medium mb-2 dark:text-white">No audits yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md dark:text-gray-400">
                  Create your first brand audit to get detailed analysis and personalized recommendations.
                </p>
                <Button onClick={() => navigate('/audit')} className="bg-brandgreen hover:bg-brandgreen/90 text-black">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Audit
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {displayReports.map((report) => (
                <Card 
                  key={report.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-black/30 animate-fade-in"
                >
                  <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {getFaviconUrl(report.url) && (
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 dark:bg-gray-700 dark:border-gray-600">
                            <img 
                              src={getFaviconUrl(report.url) || ''} 
                              alt="Site favicon" 
                              className="w-6 h-6" 
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                          </div>
                        )}
                        <CardTitle className="text-xl truncate text-brandblue dark:text-white font-playfair">{report.title}</CardTitle>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>
                    <CardDescription className="flex items-center gap-1 mt-2 dark:text-gray-400">
                      <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span>{formatDate(report.created_at)}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 pt-4">
                    {report.url && (
                      <div className="flex items-center text-sm text-blue-600 mb-3 hover:underline dark:text-blue-400">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        <a href={report.url} target="_blank" rel="noopener noreferrer" className="truncate">
                          {report.url}
                        </a>
                      </div>
                    )}
                    {report.status === 'completed' && report.summary && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium mb-1 dark:text-white">Summary:</h4>
                        <p className="text-sm text-gray-600 line-clamp-3 dark:text-gray-300">{report.summary}</p>
                      </div>
                    )}
                    {report.status === 'completed' && report.score !== null && (
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-sm font-medium dark:text-white">Brand Performance Score:</h4>
                          <span className={`font-bold text-lg ${getScoreColor(report.score)}`}>{report.score}/100</span>
                        </div>
                        <div className="bg-gray-100 h-3 rounded-full w-full dark:bg-gray-700">
                          <div 
                            className={`h-3 rounded-full ${
                              report.score >= 80 ? 'bg-green-500' : 
                              report.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${report.score}%` }}
                          />
                        </div>
                        {report.score_breakdown && (
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-xs">
                            {Object.entries(report.score_breakdown).map(([key, value]) => (
                              <div key={key} className="flex justify-between items-center">
                                <span className="text-gray-600 capitalize dark:text-gray-400">{key.replace(/_/g, ' ')}</span>
                                <span className={`font-medium ${getScoreColor(Number(value))}`}>{value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-gray-100 mt-2 dark:border-gray-700">
                    <Button
                      variant="default"
                      className="w-full bg-brandblue hover:bg-brandblue/90 text-white group dark:bg-gray-700 dark:hover:bg-gray-600"
                      disabled={report.status !== 'completed'}
                      onClick={() => navigate(`/audit/result?report_id=${report.id}`)}
                    >
                      View Full Report
                      <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
