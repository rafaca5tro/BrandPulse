
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubscriptionEmailRequest {
  email: string;
  name: string;
  planType: "pro" | "team";
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, name, planType }: SubscriptionEmailRequest = await req.json();

    // In a real implementation, you would send an email using a service like SendGrid, Mailchimp, etc.
    // For this example, we'll simulate sending an email
    
    const planDetails = planType === "pro" 
      ? { name: "Pro", auditsPerMonth: 10 }
      : { name: "Team", auditsPerMonth: 30 };
    
    // Here you would actually send the email
    console.log(`Sending email to ${email}:
      Subject: Welcome to PlaymakerAI ${planDetails.name} Plan!
      
      Hi ${name},
      
      Thank you for upgrading to our ${planDetails.name} Plan! Your account has been successfully activated.
      
      Your new benefits include:
      - ${planDetails.auditsPerMonth} Brand Audits per month
      - Advanced brand analysis
      - Detailed recommendations
      - Export to PDF
      - Share reports
      ${planType === "team" ? "- Team collaboration" : ""}
      
      If you have any questions, please contact our support team.
      
      Best regards,
      The PlaymakerAI Team
    `);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Subscription confirmation email sent",
        emailDetails: {
          to: email,
          subject: `Welcome to PlaymakerAI ${planDetails.name} Plan!`
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending subscription email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
