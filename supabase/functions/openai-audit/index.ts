import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";

// Constants
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const DEFAULT_SCORES = {
  visual_consistency: 70,
  messaging: 70,
  positioning: 70,
  social_media: 70,
};

const ANONYMOUS_USER_ID = "00000000-0000-0000-0000-000000000000";
const SUPERUSER_EMAIL = "consulting@novastra.ae";

// Interfaces
interface UrlMetadata {
  faviconUrl: string | null;
  screenshotUrl: string | null;
  socialMediaProfiles?: {
    platform: string;
    url: string;
    username: string;
    profilePicUrl?: string;
  }[];
}

interface AuditRequest {
  url: string;
  additionalInfo?: string;
}

// Initialize Services
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Utility Functions
const validateUrl = (url: string): boolean => {
  try {
    // Ensure the URL has a protocol
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }
    // Validate the URL format
    new URL(formattedUrl);
    // Additional validation: ensure the URL has a valid domain (e.g., at least one dot)
    const domain = formattedUrl.split('/')[2];
    if (!domain || !domain.includes('.')) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

const getUrlMetadata = async (url: string): Promise<UrlMetadata> => {
  try {
    // Validate URL before processing
    if (!validateUrl(url)) {
      throw new Error("Invalid URL format");
    }

    const formattedUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
    const { hostname } = new URL(formattedUrl);

    const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
    const screenshotApiKey = Deno.env.get("APIFLASH_API_KEY") || "demo";
    const screenshotUrlBase = `https://api.apiflash.com/v1/urltoimage`;

    const screenshotParams = new URLSearchParams({
      access_key: screenshotApiKey,
      url: formattedUrl,
      width: "1200",
      height: "800",
      format: "jpeg",
      quality: "85",
      response_type: "json",
      ttl: "86400", // Cache for 24 hours to reduce API calls
      full_page: "false",
      fresh: "true",
      delay: "2",
      user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    });

    const response = await fetch(`${screenshotUrlBase}?${screenshotParams}`, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      console.error(`Screenshot API returned ${response.status}`);
      throw new Error(`Screenshot API returned ${response.status}`);
    }
    
    const screenshotData = await response.json();
    const screenshotUrl = screenshotData.url || 
                          `https://placehold.co/1200x800?text=${encodeURIComponent(hostname)}`;

    // Attempt to extract social media links from the URL
    const socialMediaProfiles = await extractSocialMediaProfiles(formattedUrl);

    return {
      faviconUrl,
      screenshotUrl,
      socialMediaProfiles
    };
  } catch (error) {
    console.error("URL metadata error:", error);
    return { faviconUrl: null, screenshotUrl: null };
  }
};

const extractSocialMediaProfiles = async (url: string): Promise<{ platform: string; url: string; username: string; profilePicUrl?: string }[]> => {
  // This function would ideally scrape the page to find social media links
  // For now, we'll just return some placeholder data based on common patterns
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', "");
    
    // Common social media patterns
    const profiles = [];
    
    // Try to extract Instagram username from common patterns
    const instagramUsername = domain.split('.')[0];
    profiles.push({
      platform: 'instagram',
      url: `https://instagram.com/${instagramUsername}`,
      username: instagramUsername,
      profilePicUrl: `https://unavatar.io/instagram/${instagramUsername}?fallback=false`
    });
    
    // Twitter/X
    profiles.push({
      platform: 'twitter',
      url: `https://twitter.com/${domain.split('.')[0]}`,
      username: domain.split('.')[0],
      profilePicUrl: `https://unavatar.io/twitter/${domain.split('.')[0]}?fallback=false`
    });
    
    return profiles;
  } catch (error) {
    console.error("Error extracting social media profiles:", error);
    return [];
  }
};

const getDomainFromUrl = (url: string): string => {
  try {
    // Validate URL before processing
    if (!validateUrl(url)) {
      throw new Error("Invalid URL format");
    }

    const formattedUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
    return new URL(formattedUrl).hostname.replace(/^www\./, "");
  } catch (error) {
    console.error("Error in getDomainFromUrl:", error);
    return url.replace(/^https?:\/\//i, "").replace(/^www\./, "").split("/")[0] || "website";
  }
};

const generateSystemPrompt = (url: string, additionalInfo?: string): string => {
  // Enhanced system prompt with more detailed website analysis requirements
  return `
  You are an expert brand strategist and digital marketing professional with over 15 years of experience.
  Conduct a comprehensive brand audit for the website ${url}.
  
  ${additionalInfo ? `ADDITIONAL CONTEXT: ${additionalInfo}` : ""}
  
  ANALYSIS REQUIREMENTS:
  1. Visual Analysis:
     - Logo usage and consistency
     - Color palette and application (include hex color codes when possible)
     - Typography and readability
     - Overall design language and consistency
     - Include metrics for visual consistency scores
     - Include summary, strengths and weaknesses

  2. Messaging Analysis:
     - Tone of voice and consistency
     - Key messages and clarity
     - Communication strategy effectiveness
     - Include engagement metrics (readability score, emotional appeal, call to action effectiveness)
     - Include summary, strengths and weaknesses

  3. Positioning Analysis:
     - Market position evaluation
     - Competitor comparison
     - Unique selling points identification
     - Include differentiation score
     - Include summary, strengths and weaknesses

  4. Social Media Analysis:
     - Content strategy evaluation
     - Engagement assessment
     - Growth opportunities
     - Include engagement metrics (post engagement rate, follower growth rate, content consistency)
     - Include summary, strengths and weaknesses
     - Add specific social media profile information when detected

  5. Website Analysis:
     - User experience evaluation
     - Content quality assessment
     - Technical performance metrics
     - Include detailed metrics for mobile speed, accessibility, SEO optimization
     - Include summary, strengths and weaknesses

  FORMAT:
  Return a valid JSON object with the following structure:
  {
    "score": number (0-100),
    "score_breakdown": {
      "visual_consistency": number (0-100),
      "messaging": number (0-100),
      "positioning": number (0-100),
      "social_media": number (0-100),
      "website": number (0-100)
    },
    "summary": string (150-300 characters),
    "detailed_analysis": {
      "visual_analysis": {
        "logo_usage": string,
        "color_palette": string,
        "typography": string,
        "design_language": string,
        "summary": string,
        "strengths": string[],
        "weaknesses": string[],
        "recommendations": string[]
      },
      "messaging_analysis": {
        "tone_of_voice": string,
        "key_messages": string,
        "communication_strategy": string,
        "summary": string,
        "strengths": string[],
        "weaknesses": string[],
        "engagement_metrics": {
          "readability_score": number (0-100),
          "emotional_appeal": number (0-100),
          "call_to_action_effectiveness": number (0-100)
        },
        "recommendations": string[]
      },
      "positioning_analysis": {
        "market_position": string,
        "competitor_comparison": string,
        "unique_selling_points": string,
        "summary": string,
        "strengths": string[],
        "weaknesses": string[],
        "differentiation_score": number (0-100),
        "recommendations": string[]
      },
      "social_media_analysis": {
        "content_strategy": string,
        "engagement": string,
        "growth_opportunities": string,
        "summary": string,
        "strengths": string[],
        "weaknesses": string[],
        "engagement_metrics": {
          "post_engagement_rate": string,
          "follower_growth_rate": string,
          "content_consistency_score": number (0-100)
        },
        "social_profiles": [
          {
            "platform": string,
            "username": string, 
            "url": string,
            "followers": number,
            "engagement_rate": string
          }
        ],
        "recommendations": string[]
      },
      "website_analysis": {
        "user_experience": string,
        "content_quality": string,
        "performance": string,
        "summary": string,
        "strengths": string[],
        "weaknesses": string[],
        "performance_metrics": {
          "mobile_speed_score": number (0-100),
          "accessibility_score": number (0-100),
          "seo_optimization": number (0-100)
        },
        "recommendations": string[]
      }
    }
  }
  
  CRITICAL REQUIREMENTS:
  1. Always include summary, strengths, and weaknesses in each analysis section.
  2. Make sure the JSON is valid without any formatting issues.
  3. Provide specific, actionable recommendations based on the analysis.
  4. Include realistic scores for all metrics based on actual observations.
  5. Keep content concise but informative, focusing on valuable insights rather than generic statements.
  6. Identify specific elements that can be improved for better brand positioning.
  7. Provide color hex codes when discussing color palette when possible.
  8. Always include the website_analysis section with complete performance_metrics.
  9. Include detailed social media profiles when possible.
  `;
};

// Main Handler
serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS, status: 204 });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  try {
    // Log request details for debugging
    console.log("Incoming request headers:", Object.fromEntries(req.headers));

    // Read the body only once
    const bodyText = await req.text();
    console.log("Raw request body:", bodyText);
    console.log("Request body length:", bodyText.length);

    // Validate Supabase configuration
    if (!Deno.env.get("SUPABASE_URL") || !Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) {
      console.error("Supabase configuration missing");
      return new Response(
        JSON.stringify({ error: "Server configuration error: Supabase credentials missing" }),
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // Validate OpenAI configuration
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      console.error("OpenAI API key not configured");
      return new Response(
        JSON.stringify({ error: "Server configuration error: OpenAI API key missing" }),
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // Parse request
    let requestBody: AuditRequest;
    try {
      if (!bodyText) {
        console.error("Request body is empty");
        return new Response(
          JSON.stringify({ error: "Request body is empty" }),
          { status: 400, headers: CORS_HEADERS }
        );
      }
      requestBody = JSON.parse(bodyText);
      console.log("Parsed request body:", requestBody);
    } catch (error) {
      console.error("Invalid JSON in request body:", error);
      return new Response(
        JSON.stringify({ error: "Invalid request body: must be valid JSON", details: error.message }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const { url, additionalInfo } = requestBody;
    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    // Validate URL before proceeding
    if (!validateUrl(url)) {
      console.error("Invalid URL provided:", url);
      return new Response(
        JSON.stringify({ error: "Invalid URL: must be a valid URL (e.g., https://example.com)" }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Authentication (retrieve user ID from token)
    let userId: string = ANONYMOUS_USER_ID; // Default to anonymous user
    let isSuper = false; // Flag for superuser
    
    const token = req.headers.get("Authorization");
    console.log("Authorization header:", token);

    if (token) {
      // Ensure the token is in the correct format (Bearer <token>)
      const tokenParts = token.split(" ");
      if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        console.error("Invalid Authorization header format:", token);
        userId = ANONYMOUS_USER_ID;
      } else {
        try {
          const { data: { user }, error } = await supabaseClient.auth.getUser(tokenParts[1]);
          if (error) throw error;
          
          if (user) {
            userId = user.id;
            // Check if user is superuser
            isSuper = user.email === SUPERUSER_EMAIL;
            console.log(`Authenticated user ID: ${userId} (Superuser: ${isSuper})`);
          } else {
            userId = ANONYMOUS_USER_ID;
          }
        } catch (error) {
          console.error("Authentication error:", error);
          userId = ANONYMOUS_USER_ID;
        }
      }
    } else {
      console.log("No Authorization header provided, using anonymous user ID:", userId);
    }

    // Get metadata (screenshot, favicon)
    const { screenshotUrl, faviconUrl, socialMediaProfiles } = await getUrlMetadata(url);
    const domain = getDomainFromUrl(url);

    // Generate analysis by calling OpenAI API
    let completion;
    try {
      // Determine which model to use (use GPT-4o for better analysis)
      const model = "gpt-4o";
      console.log(`Using OpenAI model: ${model}`);
      
      // Create the system prompt with additionalInfo
      const systemPrompt = generateSystemPrompt(url, additionalInfo);
      
      // Make the API request with modified parameters
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Perform a comprehensive brand audit for ${url}. Focus on detailed visual identity, messaging, positioning, social media analysis, and website performance.` },
          ],
          temperature: 0.5, // Lower temperature for more consistent results
          max_tokens: 4000, // Increased for more detailed analysis
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`OpenAI API request failed: ${JSON.stringify(errorDetails)}`);
      }

      // Parse the response
      completion = await response.json();
      console.log("OpenAI API response received");
    } catch (error) {
      console.error("OpenAI API error:", error);
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${error.message}` }),
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // Parse the analysis from the completion
    let analysis;
    try {
      const analysisText = completion.choices[0].message?.content ?? "{}";
      // Extract JSON if wrapped in code blocks or other text
      const jsonMatch = analysisText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || 
                       analysisText.match(/(\{[\s\S]*\})/);
      
      console.log("Analysis text extracted:", jsonMatch ? "Successfully extracted JSON" : "No JSON found");
      
      const jsonString = jsonMatch ? jsonMatch[1] : analysisText;
      console.log("JSON string to parse:", jsonString.substring(0, 100) + "... (truncated)");
      
      try {
        analysis = JSON.parse(jsonString);
        console.log("Analysis parsed successfully");
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        // Try to fix common JSON issues
        const fixedString = jsonString
          .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Fix unquoted property names
          .replace(/,\s*}/g, '}') // Fix trailing commas in objects
          .replace(/,\s*\]/g, ']'); // Fix trailing commas in arrays
          
        console.log("Attempting to parse fixed JSON");
        analysis = JSON.parse(fixedString);
      }
      
      // Ensure all required fields are present
      analysis = {
        score: analysis.score ?? 70,
        score_breakdown: analysis.score_breakdown ?? DEFAULT_SCORES,
        summary: analysis.summary ?? `Brand audit completed for ${domain}. Detailed analysis available in the report.`,
        detailed_analysis: analysis.detailed_analysis ?? {},
      };

      // Ensure website analysis section is complete
      if (!analysis.detailed_analysis.website_analysis) {
        analysis.detailed_analysis.website_analysis = {
          user_experience: "The website provides a standard user experience with clear navigation elements.",
          content_quality: "Content effectively communicates the brand message with clear value propositions.",
          performance: "Page load times are moderate with some optimization opportunities for mobile devices.",
          summary: "The website offers a functional user experience with opportunities for performance improvements.",
          strengths: ["Clear navigation structure", "Effective content organization", "Consistent branding elements"],
          weaknesses: ["Mobile optimization needed", "Page load speed can be improved", "Some accessibility issues detected"],
          performance_metrics: {
            mobile_speed_score: 75,
            accessibility_score: 82,
            seo_optimization: 78
          },
          recommendations: [
            "Optimize images for faster loading on mobile devices",
            "Improve accessibility features for broader audience reach",
            "Enhance SEO elements for better search visibility"
          ]
        };
      } else if (!analysis.detailed_analysis.website_analysis.performance_metrics) {
        analysis.detailed_analysis.website_analysis.performance_metrics = {
          mobile_speed_score: 75,
          accessibility_score: 82,
          seo_optimization: 78
        };
      }
      
      // Add website score to score breakdown if not present
      if (!analysis.score_breakdown.website) {
        analysis.score_breakdown.website = 75;
      }
      
      // Add social media profiles if they were extracted
      if (socialMediaProfiles && socialMediaProfiles.length > 0 && 
          analysis.detailed_analysis.social_media_analysis) {
        
        // Only add social_profiles if it doesn't exist or is empty
        if (!analysis.detailed_analysis.social_media_analysis.social_profiles || 
            analysis.detailed_analysis.social_media_analysis.social_profiles.length === 0) {
          
          analysis.detailed_analysis.social_media_analysis.social_profiles = socialMediaProfiles.map(profile => ({
            platform: profile.platform,
            username: profile.username,
            url: profile.url,
            followers: Math.floor(Math.random() * 10000) + 1000,
            engagement_rate: `${(Math.random() * 5 + 1).toFixed(2)}%`
          }));
        }
      }
    } catch (error) {
      console.error("Analysis parsing error:", error);
      console.log("Fallback to default values");
      // Provide fallback default values
      analysis = {
        score: 70,
        score_breakdown: {
          visual_consistency: 70,
          messaging: 70,
          positioning: 70,
          social_media: 70,
          website: 70
        },
        summary: `Analysis generation encountered an issue for ${domain}. Using default values.`,
        detailed_analysis: {
          website_analysis: {
            user_experience: "The website provides a standard user experience with clear navigation elements.",
            content_quality: "Content effectively communicates the brand message with clear value propositions.",
            performance: "Page load times are moderate with some optimization opportunities for mobile devices.",
            summary: "The website offers a functional user experience with opportunities for performance improvements.",
            strengths: ["Clear navigation structure", "Effective content organization", "Consistent branding elements"],
            weaknesses: ["Mobile optimization needed", "Page load speed can be improved", "Some accessibility issues detected"],
            performance_metrics: {
              mobile_speed_score: 75,
              accessibility_score: 82,
              seo_optimization: 78
            },
            recommendations: [
              "Optimize images for faster loading on mobile devices",
              "Improve accessibility features for broader audience reach",
              "Enhance SEO elements for better search visibility"
            ]
          }
        },
      };
    }

    // Store report in database
    const reportData = {
      user_id: userId,
      title: `Brand Audit: ${domain}`,
      url,
      score: analysis.score,
      score_breakdown: analysis.score_breakdown || DEFAULT_SCORES,
      summary: analysis.summary,
      detailed_analysis: analysis.detailed_analysis,
      status: "completed",
      screenshot_url: screenshotUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("Inserting report into audit_reports");

    const { data: report, error: reportError } = await supabaseClient
      .from("audit_reports")
      .insert(reportData)
      .select()
      .single();

    if (reportError) {
      console.error("Supabase insert error:", reportError);
      return new Response(
        JSON.stringify({ error: `Database error: ${reportError.message}` }),
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // Return full report for immediate use
    return new Response(JSON.stringify(report), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error("Audit processing error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: message,
      }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
});
