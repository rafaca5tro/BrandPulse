
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  url?: string;
  files?: string[];
  report_id?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://wbvdiafpcydohgruueff.supabase.co";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json() as RequestBody;
    const { url, files, report_id } = body;

    if (!url && !report_id) {
      return new Response(
        JSON.stringify({ error: "A URL or report ID is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // If report_id is provided, use that; otherwise, create a new one
    let auditReportId = report_id;
    let auditReport;

    if (!auditReportId && url) {
      // Extract user data from the request
      const authHeader = req.headers.get("Authorization")?.split("Bearer ")[1];
      
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 401,
          }
        );
      }

      // Get the authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
      
      if (userError || !user) {
        return new Response(
          JSON.stringify({ error: "User not authenticated" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 401,
          }
        );
      }

      // Create a new audit report
      const { data, error } = await supabase
        .from("audit_reports")
        .insert({
          user_id: user.id,
          title: `Audit: ${new URL(url).hostname}`,
          url: url,
          status: "processing",
        })
        .select()
        .single();

      if (error || !data) {
        console.error("Error creating report:", error);
        return new Response(
          JSON.stringify({ error: "Failed to create report" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }

      auditReportId = data.id;
      auditReport = data;
    } else if (auditReportId) {
      // Get the existing report
      const { data, error } = await supabase
        .from("audit_reports")
        .select("*")
        .eq("id", auditReportId)
        .single();

      if (error || !data) {
        console.error("Error retrieving report:", error);
        return new Response(
          JSON.stringify({ error: "Could not find report" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404,
          }
        );
      }

      auditReport = data;
    }

    // Update the report status to "processing"
    await supabase
      .from("audit_reports")
      .update({ status: "processing" })
      .eq("id", auditReportId);
    
    // In a real implementation, you would invoke other functions like web-scraper
    // and then brand-scoring to complete the full analysis
    
    // SIMULATION: Update with simulated scoring results after 10 seconds
    setTimeout(async () => {
      try {
        // Simulated data
        const scoringData = {
          score: Math.floor(Math.random() * 30) + 60, // Score between 60 and 90
          score_breakdown: {
            visual_consistency: Math.floor(Math.random() * 30) + 60,
            messaging: Math.floor(Math.random() * 30) + 60,
            positioning: Math.floor(Math.random() * 30) + 60,
            social_media: Math.floor(Math.random() * 30) + 60,
            website: Math.floor(Math.random() * 30) + 60,
          },
          detailed_analysis: {
            visual_analysis: {
              logo_usage: "Consistent logo usage across all analyzed pages.",
              color_palette: "Well-defined color palette that reinforces brand identity.",
              typography: "Legible and appropriate typography for your business sector.",
              design_language: "Modern design with opportunities for improvement on mobile devices.",
              recommendations: [
                "Improve color contrast in certain areas of the site.",
                "Ensure all visual elements are optimized for mobile devices.",
                "Increase logo size in mobile version for better visibility."
              ]
            },
            messaging_analysis: {
              tone_of_voice: "Professional and accessible tone, though it could be more inspiring.",
              key_messages: "Clear messages about the company's mission, though consistency is lacking in some sections.",
              communication_strategy: "Basic but effective communication strategy.",
              recommendations: [
                "Develop more compelling stories linked to your products, services, and customers.",
                "Reinforce the main message across all sections of the site.",
                "Include customer testimonials to add authenticity."
              ]
            },
            positioning_analysis: {
              market_position: "Mid-market positioning, with direct competitors offering similar propositions.",
              competitor_comparison: "Below main competitors in terms of digital experience.",
              unique_selling_points: "The company's history is a unique value, but it's not sufficiently highlighted.",
              recommendations: [
                "More clearly highlight the company's achievements and milestones.",
                "Develop exclusive content that differentiates the company from competitors.",
                "Create a dedicated section for customer case studies."
              ]
            },
            social_media_analysis: {
              content_strategy: "Regular posts but with little variety in formats.",
              engagement: "Medium level of interaction with potential for improvement.",
              growth_opportunities: "Opportunities in emerging platforms like TikTok.",
              recommendations: [
                "Diversify formats: incorporate more short videos and interactive content.",
                "Establish a more consistent editorial calendar.",
                "Implement hashtag campaigns to increase reach."
              ]
            },
            website_analysis: {
              user_experience: "Functional navigation but with areas for usability improvement.",
              content_quality: "Informative content, but could be more visually appealing.",
              performance: "Acceptable loading speed on desktop, slow on mobile devices.",
              recommendations: [
                "Optimize images to reduce loading times on mobile.",
                "Improve navigation structure for easier access to key information.",
                "Incorporate interactive elements to increase time on site."
              ]
            }
          }
        };

        // Generate summary based on score
        const score = scoringData.score;
        let summary = "";
        
        if (score >= 80) {
          summary = `Excellent brand presence with a score of ${score}/100. Particularly strong in visual elements and communication. We recommend focusing on enhancing social media engagement to maximize impact.`;
        } else if (score >= 70) {
          summary = `Good brand presence with a score of ${score}/100. There is visual and communicative coherence, though opportunities exist to improve positioning and differentiation from competitors.`;
        } else {
          summary = `Brand presence with improvement potential, currently at ${score}/100 points. We recommend a complete review of visual elements and communication strategy to strengthen brand identity.`;
        }

        // Update the report with the results
        await supabase
          .from("audit_reports")
          .update({
            status: "completed",
            score: scoringData.score,
            score_breakdown: scoringData.score_breakdown,
            detailed_analysis: scoringData.detailed_analysis,
            summary: summary
          })
          .eq("id", auditReportId);

      } catch (updateError) {
        console.error("Error updating report with results:", updateError);
      }
    }, 10000); // 10 second processing simulation

    return new Response(
      JSON.stringify({ 
        report_id: auditReportId,
        status: "processing",
        message: "Analysis started, results will be available shortly."
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 202,
      }
    );
  } catch (error) {
    console.error("Error in audit function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
