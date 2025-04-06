
import { getAuditResults, performAuditWithOpenAI } from './auditService';
import { toast } from 'sonner';

export const debugAuditConnection = async () => {
  try {
    console.log("Debugging audit connections...");
    
    // Test Supabase connection
    console.log("Testing Supabase connection...");
    const { data: supabaseHealth, error: supabaseError } = await fetch('https://wbvdiafpcydohgruueff.supabase.co/rest/v1/', {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndidmRpYWZwY3lkb2hncnV1ZWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2OTE1MzUsImV4cCI6MjA1OTI2NzUzNX0.0YY4R9d0dr8aoieD5K5sQweqtXXKIW_Ff8E5XyGJ-AM',
        'Content-Type': 'application/json'
      }
    }).then(res => {
      console.log("Supabase status:", res.status);
      return { data: res.status === 200, error: res.status !== 200 ? new Error(`Status code: ${res.status}`) : null };
    });
    
    if (supabaseError) {
      console.error("Supabase connection error:", supabaseError);
      toast.error("Supabase connection issue", {
        description: "Could not connect to Supabase. Check console for details."
      });
    } else {
      console.log("Supabase connection successful");
      toast.success("Supabase connection good");
    }
    
    // Test OpenAI audit function
    console.log("Testing OpenAI audit function with demo data...");
    try {
      const demoReport = await getAuditResults("demo-report");
      console.log("Demo report retrieved:", demoReport ? "Success" : "Failed");
      
      if (demoReport) {
        toast.success("Demo audit data retrieved successfully");
      } else {
        toast.error("Could not retrieve demo audit data");
      }
    } catch (getAuditError) {
      console.error("Error getting demo audit:", getAuditError);
      toast.error("Demo audit retrieval failed", {
        description: getAuditError instanceof Error ? getAuditError.message : "Unknown error"
      });
    }
    
    // Test edge function connection
    console.log("Testing edge function connection...");
    try {
      const edgeFunctionUrl = 'https://wbvdiafpcydohgruueff.supabase.co/functions/v1/openai-audit';
      const testResponse = await fetch(edgeFunctionUrl, {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndidmRpYWZwY3lkb2hncnV1ZWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2OTE1MzUsImV4cCI6MjA1OTI2NzUzNX0.0YY4R9d0dr8aoieD5K5sQweqtXXKIW_Ff8E5XyGJ-AM`
        }
      });
      
      console.log("Edge function response status:", testResponse.status);
      if (testResponse.status === 200 || testResponse.status === 204) {
        toast.success("Edge function connection good");
      } else {
        toast.error(`Edge function returned status ${testResponse.status}`);
      }
    } catch (edgeFunctionError) {
      console.error("Edge function connection error:", edgeFunctionError);
      toast.error("Edge function connection issue", {
        description: edgeFunctionError instanceof Error ? edgeFunctionError.message : "Unknown error"
      });
    }
    
    return true;
  } catch (error) {
    console.error("Debug audit connection error:", error);
    toast.error("Debug process failed", {
      description: error instanceof Error ? error.message : "Unknown error"
    });
    return false;
  }
};
