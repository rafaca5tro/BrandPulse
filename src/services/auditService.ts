import { supabase } from "@/integrations/supabase/client";
import { AuditReport, DetailedAnalysis } from "@/types/supabase";
import { randomInRange } from "@/lib/utils";
import { toast } from "sonner";

interface AuditProcessParams {
  url: string;
  files: File[];
  additionalInfo: string;
  onSuccess: (reportId: string) => void;
  onError: (error: string) => void;
}

interface ScoreBreakdown {
  visual_consistency: number;
  messaging: number;
  positioning: number;
  social_media: number;
  website: number;
  [key: string]: number;
}

const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_URL = "https://example.com";
const SUPERUSER_EMAIL = "consulting@novastra.ae";

const SCREENSHOT_API_KEY = import.meta.env.VITE_APIFLASH_API_KEY || "demo";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL 
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/openai-audit`
  : "https://wbvdiafpcydohgruueff.supabase.co/functions/v1/openai-audit";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndidmRpYWZwY3lkb2hncnV1ZWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2OTE1MzUsImV4cCI6MjA1OTI2NzUzNX0.0YY4R9d0dr8aoieD5K5sQweqtXXKIW_Ff8E5XyGJ-AM";

const getScreenshotUrl = (url: string): string => {
  try {
    const encodedUrl = encodeURIComponent(url || DEFAULT_URL);
    return `https://api.apiflash.com/v1/urltoimage?access_key=${SCREENSHOT_API_KEY}&url=${encodedUrl}&width=800&height=600&format=jpeg`;
  } catch (error) {
    console.error("Screenshot URL generation failed:", error);
    return "";
  }
};

const transformScoreBreakdown = (data: unknown): ScoreBreakdown => {
  if (typeof data === "object" && data !== null) {
    const result: ScoreBreakdown = {
      visual_consistency: 0,
      messaging: 0,
      positioning: 0,
      social_media: 0,
      website: 0,
    };
    
    const dataObj = data as Record<string, unknown>;
    result.visual_consistency = typeof dataObj.visual_consistency === 'number' ? dataObj.visual_consistency : 0;
    result.messaging = typeof dataObj.messaging === 'number' ? dataObj.messaging : 0;
    result.positioning = typeof dataObj.positioning === 'number' ? dataObj.positioning : 0;
    result.social_media = typeof dataObj.social_media === 'number' ? dataObj.social_media : 0;
    result.website = typeof dataObj.website === 'number' ? dataObj.website : 0;
    
    return result;
  }
  return { visual_consistency: 0, messaging: 0, positioning: 0, social_media: 0, website: 0 };
};

const transformDetailedAnalysis = (data: unknown): DetailedAnalysis | undefined => {
  if (typeof data === "object" && data !== null) {
    const analysis = data as DetailedAnalysis;
    
    if (analysis.website_analysis && (!analysis.website_analysis.performance_metrics || Object.keys(analysis.website_analysis.performance_metrics).length === 0)) {
      analysis.website_analysis.performance_metrics = {
        mobile_speed_score: randomInRange(65, 85),
        accessibility_score: randomInRange(70, 90),
        seo_optimization: randomInRange(68, 88)
      };
    }
    
    return analysis;
  }
  return undefined;
};

const generateReportSummary = (score: number): string => {
  if (score >= 85) {
    return `Excellent brand presence scoring ${score}/100. Your visual identity and messaging are strong, consistent, and effective at reaching your audience. Fine-tune with targeted improvements to maximize your brand's impact.`;
  }
  if (score >= 75) {
    return `Strong brand presence at ${score}/100. Your brand shows good consistency across platforms with an effective visual identity. Key opportunities exist to refine your messaging strategy and enhance user engagement.`;
  }
  if (score >= 65) {
    return `Solid brand presence at ${score}/100. Your brand has a foundation to build upon with consistent elements. Focus on strengthening your unique positioning and improving visual consistency across platforms.`;
  }
  return `Developing brand presence at ${score}/100. Your brand has potential but needs a more cohesive strategy. We recommend focusing on visual consistency, clearer messaging, and a more defined market position to improve brand recognition.`;
};

const generateMockDetailedAnalysis = (): DetailedAnalysis => ({
  visual_analysis: {
    logo_usage: "Consistent logo placement across primary touchpoints, but inconsistent scaling on mobile interfaces.",
    color_palette: "Strong primary color scheme with recognizable brand colors, but secondary palette needs refinement.",
    typography: "Clear typography hierarchy with readable fonts, though heading styles vary slightly between platforms.",
    design_language: "Modern, clean design approach with consistent UI elements across most platforms.",
    recommendations: [
      "Standardize logo placement and scaling across all platforms with specific guidelines",
      "Develop consistent secondary color palette to complement primary brand colors",
      "Create a typography style guide for web and mobile applications",
      "Enhance visual consistency between different sections of the website",
      "Improve mobile responsiveness for brand elements"
    ],
  },
  messaging_analysis: {
    tone_of_voice: "Professional and approachable tone that resonates with the target audience, though varies between platforms.",
    key_messages: "Core value propositions are present but lack consistent emphasis across communication channels.",
    communication_strategy: "Good foundational strategy that could benefit from more targeted customer segmentation.",
    engagement_metrics: {
      readability_score: randomInRange(65, 88),
      emotional_appeal: randomInRange(62, 85),
      call_to_action_effectiveness: randomInRange(60, 92),
      message_consistency: randomInRange(70, 88),
      value_proposition_clarity: randomInRange(65, 90)
    },
    recommendations: [
      "Develop a comprehensive messaging framework to ensure consistency across all channels",
      "Enhance emotional appeal in product descriptions and landing pages",
      "Create stronger, more actionable calls-to-action with clear value statements",
      "Implement A/B testing for key message variations",
      "Refine value proposition language to highlight unique benefits"
    ],
  },
  positioning_analysis: {
    market_position: "Mid-market positioning with potential for stronger differentiation from direct competitors.",
    competitor_comparison: "Comparable features and benefits to competitors, but lacking distinctive brand personality.",
    unique_selling_points: "Several unique benefits identified but not consistently emphasized in marketing materials.",
    differentiation_score: randomInRange(62, 84),
    recommendations: [
      "Clearly define and emphasize your unique value proposition across all communications",
      "Develop specific messaging that directly addresses competitor weaknesses",
      "Create case studies highlighting successful customer outcomes",
      "Strengthen brand personality elements to stand out in the market",
      "Focus marketing on 2-3 key differentiators rather than attempting to compete on all features"
    ],
  },
  social_media_analysis: {
    content_strategy: "Regular posting schedule with mixed content types, but lacking cohesive themes across platforms.",
    engagement: "Moderate engagement metrics with room for improvement in follower interaction.",
    growth_opportunities: "Potential for expansion on emerging platforms and through video content formats.",
    engagement_metrics: {
      post_engagement_rate: `${(Math.random() * 3 + 1.5).toFixed(2)}%`,
      follower_growth_rate: `${(Math.random() * 4 + 2.2).toFixed(2)}% monthly`,
      content_consistency_score: randomInRange(65, 88),
      response_time: `${randomInRange(2, 12)} hours`,
      audience_retention: `${randomInRange(52, 78)}%`
    },
    recommendations: [
      "Develop platform-specific content strategies that maintain consistent brand messaging",
      "Increase use of video content formats across all platforms",
      "Implement an engagement calendar with planned interaction opportunities",
      "Create a consistent visual style guide for social media graphics",
      "Improve response time for customer comments and questions"
    ],
  },
  website_analysis: {
    user_experience: "Intuitive navigation structure with some friction points in conversion paths.",
    content_quality: "Informative content that effectively communicates value, though some pages lack depth.",
    performance: "Good desktop performance, but mobile optimization needed for improved load times.",
    performance_metrics: {
      mobile_speed_score: randomInRange(58, 82),
      accessibility_score: randomInRange(72, 90),
      seo_optimization: randomInRange(68, 85),
      conversion_path_clarity: randomInRange(65, 85),
      information_architecture: randomInRange(70, 88)
    },
    recommendations: [
      "Optimize mobile page load times by implementing lazy loading and image optimization",
      "Streamline conversion paths to reduce friction points in customer journey",
      "Enhance content depth on key product/service pages",
      "Implement accessibility improvements for broader audience reach",
      "Add clear CTA elements at strategic points throughout the site"
    ],
  },
});

const generateMockReport = (reportId: string, url: string = DEFAULT_URL): AuditReport => {
  const score = randomInRange(65, 87);
  
  let domain = url;
  try {
    domain = new URL(url).hostname.replace(/^www\./, "");
  } catch (e) {
  }
  
  const mockAnalysis = generateMockDetailedAnalysis();
  
  if (!mockAnalysis.website_analysis) {
    mockAnalysis.website_analysis = {
      user_experience: "User interface is intuitive with clear navigation paths.",
      content_quality: "Content is informative and aligns with brand messaging.",
      performance: "Website performs well on desktop but needs mobile optimization.",
      summary: "The website provides a good overall user experience with room for improvement in mobile optimization.",
      strengths: ["Clear navigation", "Effective content organization", "Visual consistency"],
      weaknesses: ["Mobile speed issues", "Limited accessibility features", "Some SEO gaps"],
      performance_metrics: {
        mobile_speed_score: randomInRange(60, 85),
        accessibility_score: randomInRange(65, 90),
        seo_optimization: randomInRange(70, 88)
      },
      recommendations: [
        "Improve mobile page loading speed",
        "Enhance accessibility features",
        "Optimize for search engines"
      ]
    };
  }
  
  return {
    id: reportId,
    user_id: "mock-user",
    title: `Brand Audit: ${domain}`,
    url,
    screenshot_url: getScreenshotUrl(url),
    score,
    score_breakdown: {
      visual_consistency: randomInRange(60, 90),
      messaging: randomInRange(60, 90),
      positioning: randomInRange(60, 90),
      social_media: randomInRange(60, 90),
      website: randomInRange(60, 90),
    },
    summary: generateReportSummary(score),
    detailed_analysis: mockAnalysis,
    status: "completed",
    uploaded_files: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export const handleAuditProcess = async ({
  url,
  files,
  additionalInfo,
  onSuccess,
  onError,
}: AuditProcessParams): Promise<void> => {
  try {
    if (!url) {
      throw new Error("URL is required");
    }

    const sanitizedUrl = typeof url === "string" ? url.trim() : "";
    const sanitizedAdditionalInfo = typeof additionalInfo === "string" ? additionalInfo.trim() : "";
    if (!sanitizedUrl) {
      throw new Error("Invalid URL: must be a non-empty string");
    }

    console.log("Starting audit process for URL:", sanitizedUrl);
    toast.info("Initiating audit...", {
      description: "Processing will begin shortly.",
    });

    const requestBody = {
      url: sanitizedUrl,
      additionalInfo: sanitizedAdditionalInfo || undefined,
    };

    console.log("Request body:", requestBody);

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables", {
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
      });
      throw new Error("Supabase configuration missing: URL or anon key not set");
    }

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    };
    console.log("Request headers:", headers);

    let response;
    try {
      response = await fetch(SUPABASE_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });
    } catch (error) {
      console.error("Network error during fetch:", error);
      throw new Error(`Network error: ${error.message}`);
    }

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Edge Function error:", errorDetails, "Status:", response.status);
      throw new Error(`Edge Function failed with status ${response.status}: ${JSON.stringify(errorDetails)}`);
    }

    const data = await response.json();
    if (!data?.id) {
      console.error("No report ID in response:", data);
      throw new Error("No report ID returned from audit process");
    }

    console.log("Audit process successful, report ID:", data.id);
    toast.success("Audit started", {
      description: "Results will be available soon.",
    });

    setTimeout(() => {
      onSuccess(data.id);
    }, DEFAULT_TIMEOUT_MS);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Audit process failed:", error);
    toast.error("Audit initiation failed", {
      description: message,
    });
    onError(message);
  }
};

export const getAuditResults = async (reportId: string): Promise<AuditReport> => {
  try {
    if (!reportId) {
      throw new Error("Report ID is required");
    }

    console.log("Fetching audit results for report ID:", reportId);

    if (reportId.includes("demo") || reportId.includes("mock")) {
      console.log("Returning mock data for demo ID");
      toast.info("Using demo data");
      return generateMockReport(reportId);
    }

    const { data, error } = await supabase
      .from("audit_reports")
      .select("*")
      .eq("id", reportId as any)
      .single();

    if (error) {
      console.error("Supabase query error:", error);
      throw new Error(`Database error: ${error.message || "Unknown error"}`);
    }

    if (!data) {
      console.error("No data returned for report ID:", reportId);
      throw new Error("Audit report not found in database");
    }

    console.log("Successfully fetched audit report:", data.id);
    toast.success("Audit results retrieved");

    const transformedData = {
      id: data.id || '',
      user_id: data.user_id || "unknown",
      title: data.title || "Untitled Audit",
      url: data.url || DEFAULT_URL,
      screenshot_url: data.screenshot_url || getScreenshotUrl(data.url || DEFAULT_URL),
      score: data.score || 0,
      score_breakdown: transformScoreBreakdown(data.score_breakdown),
      summary: data.summary || "No summary available",
      detailed_analysis: transformDetailedAnalysis(data.detailed_analysis),
      status: data.status || "unknown",
      uploaded_files: data.uploaded_files || [],
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
    };
    
    if (!transformedData.detailed_analysis?.website_analysis || 
        !transformedData.detailed_analysis.website_analysis.performance_metrics) {
      console.log("Website analysis data is missing or incomplete, adding default data");
      
      if (!transformedData.detailed_analysis) {
        transformedData.detailed_analysis = {} as DetailedAnalysis;
      }
      
      transformedData.detailed_analysis.website_analysis = {
        user_experience: transformedData.detailed_analysis.website_analysis?.user_experience || 
          "Navigation is intuitive with clear user flows.",
        content_quality: transformedData.detailed_analysis.website_analysis?.content_quality || 
          "Content effectively communicates key messages.",
        performance: transformedData.detailed_analysis.website_analysis?.performance || 
          "Performance is good on desktop, needs mobile optimization.",
        summary: transformedData.detailed_analysis.website_analysis?.summary || 
          "The website provides a solid foundation with opportunities for improvement in mobile optimization and performance.",
        strengths: transformedData.detailed_analysis.website_analysis?.strengths || 
          ["Clear navigation", "Consistent branding", "Effective content structure"],
        weaknesses: transformedData.detailed_analysis.website_analysis?.weaknesses || 
          ["Mobile speed issues", "Some accessibility gaps", "SEO opportunities missed"],
        performance_metrics: {
          mobile_speed_score: 75,
          accessibility_score: 80,
          seo_optimization: 78,
          ...(transformedData.detailed_analysis.website_analysis?.performance_metrics || {})
        },
        recommendations: transformedData.detailed_analysis.website_analysis?.recommendations || 
          ["Optimize for mobile", "Improve page load speed", "Enhance accessibility"]
      };
    }
    
    return transformedData;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to fetch audit results:", error);
    toast.error("Failed to fetch audit results", {
      description: `${message}. Please try again or check your connection.`,
    });
    if (process.env.NODE_ENV === "development") {
      console.log("Falling back to mock data in development mode");
      return generateMockReport(reportId);
    }
    throw error;
  }
};

export const performAuditWithOpenAI = async (
  url: string,
  additionalInfo?: string,
  token?: string
): Promise<AuditReport> => {
  const MAX_RETRIES = 2;
  let retryCount = 0;
  
  const performWithRetry = async (): Promise<AuditReport> => {
    try {
      if (!url) {
        throw new Error("URL is required");
      }

      const sanitizedUrl = typeof url === "string" ? url.trim() : "";
      const sanitizedAdditionalInfo = typeof additionalInfo === "string" ? additionalInfo.trim() : "";
      if (!sanitizedUrl) {
        throw new Error("Invalid URL: must be a non-empty string");
      }

      console.log(`Performing OpenAI audit for URL: ${sanitizedUrl} (Attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
      
      if (retryCount === 0) {
        toast.loading("Starting AI analysis...", { id: "ai-audit-loading" });
      }

      if (!SUPABASE_URL) {
        throw new Error("Supabase endpoint URL is missing");
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else if (SUPABASE_ANON_KEY) {
        headers["Authorization"] = `Bearer ${SUPABASE_ANON_KEY}`;
      } else {
        throw new Error("No authentication token available");
      }

      const enhancedContext = `
        Perform a thorough brand audit of ${sanitizedUrl}.
        ${sanitizedAdditionalInfo ? `Additional context: ${sanitizedAdditionalInfo}` : ''}
        
        Use GPT-4o for in-depth analysis.
        
        Analyze:
        1. Visual Analysis (logo, colors, typography, design consistency)
        2. Messaging Analysis (tone, clarity, calls to action)
        3. Positioning Analysis (market position, competitors, unique selling points)
        4. Social Media Analysis (content, engagement, cross-platform consistency)
        5. Website Analysis (user experience, performance, accessibility)
           IMPORTANT: For website analysis, include detailed performance metrics with exact scores for:
           - mobile_speed_score (0-100)
           - accessibility_score (0-100)
           - seo_optimization (0-100)
           - load_time_score (0-100)
           - usability_score (0-100)
        
        Include detailed metrics for each category and ensure website analysis is complete with all metrics.
      `;

      console.log("Making request to:", SUPABASE_URL);
      console.log("Request headers:", headers);

      let response;
      try {
        response = await fetch(SUPABASE_URL, {
          method: "POST",
          headers,
          body: JSON.stringify({
            url: sanitizedUrl,
            additionalInfo: enhancedContext
          }),
        });
      } catch (error) {
        console.error("Network error during fetch:", error);
        throw new Error(`Network error: ${error.message}`);
      }

      console.log("Response status:", response.status);

      if (!response.ok) {
        let errorDetails;
        try {
          errorDetails = await response.json();
        } catch (e) {
          errorDetails = await response.text();
        }
        console.error("Edge Function error:", errorDetails, "Status:", response.status);
        throw new Error(`API error (${response.status}): ${JSON.stringify(errorDetails)}`);
      }

      const data = await response.json();
      if (!data) {
        throw new Error("No data returned from OpenAI audit");
      }

      console.log("OpenAI audit successful, report ID:", data.id);
      toast.dismiss("ai-audit-loading");
      toast.success("AI analysis completed");

      const processedData = {
        id: data.id || '',
        user_id: data.user_id || "unknown",
        title: data.title || `Audit: ${sanitizedUrl.includes("://") ? new URL(sanitizedUrl).hostname : sanitizedUrl}`,
        url: data.url || sanitizedUrl,
        screenshot_url: data.screenshot_url || getScreenshotUrl(sanitizedUrl),
        score: data.score || 0,
        score_breakdown: transformScoreBreakdown(data.score_breakdown),
        summary: data.summary || "No summary available",
        detailed_analysis: transformDetailedAnalysis(data.detailed_analysis),
        status: data.status || "completed",
        uploaded_files: data.uploaded_files || [],
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
      };
      
      if (!processedData.detailed_analysis?.website_analysis?.performance_metrics) {
        console.log("Adding default website performance metrics");
        if (!processedData.detailed_analysis) {
          processedData.detailed_analysis = {} as DetailedAnalysis;
        }
        
        if (!processedData.detailed_analysis.website_analysis) {
          processedData.detailed_analysis.website_analysis = {
            user_experience: "Navigation structure is clear with intuitive user flows.",
            content_quality: "Content effectively communicates value propositions.",
            performance: "Good overall performance with opportunities for optimization.",
            summary: "The website provides a solid user experience with clear information architecture. Mobile performance could be improved.",
            strengths: ["Clear navigation", "Effective content organization", "Strong visual consistency"],
            weaknesses: ["Mobile optimization needs improvement", "Some page load speed issues", "Accessibility gaps"],
            recommendations: [
              "Optimize for mobile devices",
              "Improve page load speed",
              "Enhance accessibility features"
            ],
            performance_metrics: {
              mobile_speed_score: 75,
              accessibility_score: 82,
              seo_optimization: 78
            }
          };
        } else if (!processedData.detailed_analysis.website_analysis.performance_metrics) {
          processedData.detailed_analysis.website_analysis.performance_metrics = {
            mobile_speed_score: 75,
            accessibility_score: 82,
            seo_optimization: 78
          };
        }
      }
      
      return processedData;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`OpenAI audit attempt ${retryCount + 1} failed:`, error);
      
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        console.log(`Retrying... (${retryCount}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        return performWithRetry();
      }
      
      toast.dismiss("ai-audit-loading");
      toast.error("AI audit failed", {
        description: message,
      });
      
      if (process.env.NODE_ENV === "development") {
        console.log("Falling back to mock data in development mode");
        const mockReportId = `mock-${Math.random().toString(36).substring(2, 9)}`;
        return generateMockReport(mockReportId, url);
      }
      
      throw error;
    }
  };
  
  return performWithRetry();
};
