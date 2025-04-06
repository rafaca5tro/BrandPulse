import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Rocket, AlertCircle, Upload, Globe, Instagram, FileText, ArrowUpRight, Sparkles } from "lucide-react";
import { performAuditWithOpenAI } from "@/services/auditService";
import { canPerformAudit, logAuditUsage, getUserPlan, getRemainingAudits } from "@/services/stripeService";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuditForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('website');
  const navigate = useNavigate();
  const { user, token, isSuperuser } = useAuth();

  const validateUrl = (url: string): boolean => {
    try {
      // Ensure the URL has a protocol
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }
      
      // Validate URL format
      new URL(formattedUrl);
      
      // Additional validation: ensure the URL has a valid domain
      const domain = formattedUrl.split('/')[2];
      if (!domain || !domain.includes('.')) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const validateInstagram = (username: string): boolean => {
    // Basic validation for Instagram handle
    return /^@?[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/.test(username);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check authentication
    if (!user) {
      toast.error("Authentication required", {
        description: "Please sign in to perform an audit.",
        action: {
          label: "Sign in",
          onClick: () => navigate("/auth"),
        },
      });
      return;
    }

    // Debug logging
    console.log("Authenticated user:", user);
    console.log("Auth token:", token);
    console.log("Is superuser:", isSuperuser);

    // Check audit limits (superusers bypass this check)
    if (!isSuperuser && !canPerformAudit()) {
      const plan = getUserPlan();
      toast.error("Audit limit reached", {
        description: `You've reached your monthly limit of audits on the ${plan} plan.`,
        action: {
          label: "Upgrade",
          onClick: () => navigate("/#pricing"),
        },
      });
      return;
    }

    // Validate input based on active tab
    if (activeTab === 'website') {
      if (!url || typeof url !== "string") {
        toast.error("URL required", {
          description: "Please enter a valid website URL to audit.",
        });
        return;
      }

      // Sanitize and format URL
      let sanitizedUrl = url.trim();
      if (!sanitizedUrl.startsWith('http://') && !sanitizedUrl.startsWith('https://')) {
        sanitizedUrl = `https://${sanitizedUrl}`;
      }

      // Validate URL format
      if (!validateUrl(sanitizedUrl)) {
        toast.error("Invalid URL", {
          description: "Please enter a valid URL (e.g., example.com or https://example.com)",
        });
        return;
      }
    } else if (activeTab === 'instagram') {
      if (!url || typeof url !== "string") {
        toast.error("Instagram handle required", {
          description: "Please enter a valid Instagram handle to audit.",
        });
        return;
      }

      // Sanitize Instagram handle
      let sanitizedHandle = url.trim();
      if (sanitizedHandle.startsWith('@')) {
        sanitizedHandle = sanitizedHandle.substring(1);
      }

      // Validate Instagram handle format
      if (!validateInstagram(sanitizedHandle)) {
        toast.error("Invalid Instagram handle", {
          description: "Please enter a valid Instagram handle (e.g., @username or username)",
        });
        return;
      }
    } else if (activeTab === 'upload') {
      if (!uploadedFiles || uploadedFiles.length === 0) {
        toast.error("Files required", {
          description: "Please upload at least one file to audit.",
        });
        return;
      }
    }

    // Sanitize additionalInfo
    const sanitizedAdditionalInfo = typeof additionalInfo === "string" ? additionalInfo.trim() : "";

    // Prepare audit data based on active tab
    let auditData = {
      url: '',
      additionalInfo: sanitizedAdditionalInfo
    };

    if (activeTab === 'website') {
      auditData.url = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;
    } else if (activeTab === 'instagram') {
      const handle = url.trim().startsWith('@') ? url.trim().substring(1) : url.trim();
      auditData.url = `https://instagram.com/${handle}`;
    }

    // Show loading state
    setIsLoading(true);

    try {
      // Show loading toast
      const loadingToast = toast.loading("Processing audit request...", {
        description: "This may take a minute or two. Please wait."
      });

      // Use performAuditWithOpenAI for analysis
      const result = await performAuditWithOpenAI(auditData.url, auditData.additionalInfo, token);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Log audit usage (skipped for superusers in the function)
      logAuditUsage();

      // Show completion message with appropriate context
      if (isSuperuser) {
        toast.success("Audit completed!", {
          description: "Super user access enabled - unlimited audits available.",
        });
      } else {
        // Show remaining audits
        const remaining = getRemainingAudits();
        toast.success("Audit completed!", {
          description: `You have ${remaining} audit${remaining === 1 ? '' : 's'} remaining this month.`,
        });
      }

      // Navigate to results
      navigate(`/audit/result?reportId=${result.id}`);
    } catch (error) {
      console.error("Error during audit:", error);
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error("Audit failed", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 bg-[#13141F]/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-slate-800">
      <CardContent className="p-8">
        {isSuperuser && (
          <Alert className="mb-6 bg-gradient-to-r from-[#6366F1]/10 to-[#8B5CF6]/10 border-[#8B5CF6]/20">
            <Rocket className="h-5 w-5 text-[#8B5CF6]" />
            <AlertTitle className="text-white">Super User Access Enabled</AlertTitle>
            <AlertDescription className="text-slate-300">
              You have unlimited access to all premium features including unlimited audits.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs 
          defaultValue="website" 
          className="mb-8" 
          value={activeTab} 
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 mb-6 bg-[#161A2C]">
            <TabsTrigger 
              value="website" 
              className="data-[state=active]:bg-[#6366F1] data-[state=active]:text-white text-slate-400 py-3"
            >
              <Globe size={16} className="mr-2" />
              Website
            </TabsTrigger>
            <TabsTrigger 
              value="instagram" 
              className="data-[state=active]:bg-[#6366F1] data-[state=active]:text-white text-slate-400 py-3"
            >
              <Instagram size={16} className="mr-2" />
              Instagram
            </TabsTrigger>
            <TabsTrigger 
              value="upload" 
              className="data-[state=active]:bg-[#6366F1] data-[state=active]:text-white text-slate-400 py-3"
            >
              <Upload size={16} className="mr-2" />
              Upload Files
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <TabsContent value="website" className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="website-url" className="block text-sm font-medium text-slate-300">Website URL to Audit</label>
                <Input
                  id="website-url"
                  type="text"
                  placeholder="Enter website URL (e.g., example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-[#161A2C] border-slate-700 focus:border-[#8B5CF6] text-white placeholder:text-slate-500"
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="bg-[#161A2C] p-4 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                  <Sparkles size={14} className="text-[#8B5CF6] mr-2" />
                  What we'll analyze
                </h4>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1]"></div>
                    <span>Visual brand consistency</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></div>
                    <span>Messaging clarity</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1]"></div>
                    <span>User experience</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></div>
                    <span>Call-to-action effectiveness</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="instagram" className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="instagram-handle" className="block text-sm font-medium text-slate-300">Instagram Handle to Audit</label>
                <Input
                  id="instagram-handle"
                  type="text"
                  placeholder="Enter Instagram handle (e.g., @username)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-[#161A2C] border-slate-700 focus:border-[#8B5CF6] text-white placeholder:text-slate-500"
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="bg-[#161A2C] p-4 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                  <Sparkles size={14} className="text-[#8B5CF6] mr-2" />
                  What we'll analyze
                </h4>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1]"></div>
                    <span>Content consistency</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></div>
                    <span>Engagement metrics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1]"></div>
                    <span>Bio optimization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></div>
                    <span>Growth opportunities</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="files" className="block text-sm font-medium text-slate-300">Upload Files to Audit</label>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-[#8B5CF6]/50 transition-colors">
                  <input
                    id="files"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <label htmlFor="files" className="cursor-pointer flex flex-col items-center">
                    <Upload className="h-10 w-10 text-slate-400 mb-2" />
                    <p className="text-slate-300 font-medium mb-1">Drag files here or click to upload</p>
                    <p className="text-slate-500 text-sm">Upload PDFs, presentations, or images of your brand assets</p>
                  </label>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 text-left">
                      <p className="text-sm font-medium text-slate-300 mb-2">Uploaded Files ({uploadedFiles.length}):</p>
                      <ul className="space-y-1 text-sm">
                        {uploadedFiles.map((file, index) => (
                          <li key={index} className="flex items-center text-slate-400">
                            <FileText className="h-4 w-4 mr-2 text-[#8B5CF6]" />
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-[#161A2C] p-4 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                  <Sparkles size={14} className="text-[#8B5CF6] mr-2" />
                  What we'll analyze
                </h4>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1]"></div>
                    <span>Visual identity consistency</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></div>
                    <span>Content structure</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1]"></div>
                    <span>Messaging clarity</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></div>
                    <span>Presentation effectiveness</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Additional Context (Optional)</label>
              <Textarea
                placeholder="Enter any additional context about your brand, target audience, or specific areas you want the audit to focus on."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                rows={4}
                className="bg-[#161A2C] border-slate-700 focus:border-[#8B5CF6] text-white placeholder:text-slate-500"
                disabled={isLoading}
              />
              <p className="text-xs text-slate-500 mt-2">
                Providing context about your business helps our AI generate more relevant and personalized recommendations.
              </p>
            </div>

            <div>
              {!user && (
                <Alert className="mb-4 bg-[#161A2C] border-amber-900/50">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <AlertTitle className="text-white">Sign in required</AlertTitle>
                  <AlertDescription className="text-slate-400">
                    Please sign in to track your audit usage and access premium features.
                  </AlertDescription>
                </Alert>
              )}
              
              {user && !isSuperuser && (
                <div className="text-sm text-slate-400 mb-4 bg-[#161A2C] p-3 rounded-md">
                  <span className="font-medium">Your account: </span>
                  <span className="text-white">{getUserPlan().toUpperCase()}</span> plan - 
                  <span className="text-[#8B5CF6]"> {getRemainingAudits()} audit{getRemainingAudits() === 1 ? '' : 's'}</span> remaining
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5254D0] hover:to-[#7B4CD6] text-white border-0 shadow-lg shadow-indigo-500/25 h-12 font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Start Brand Audit <ArrowUpRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuditForm;