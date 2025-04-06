import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';

// Constants - ideally these would be environment variables
// TODO: Move these to environment variables for better security
const SUPERUSER_EMAIL = "consulting@novastra.ae";
const STORAGE_PREFIX = "playmaker_ai_";

// Plans and their features
export const plans = {
  free: {
    name: "Free",
    auditsPerMonth: 3,
    features: [
      "3 Brand Audits per month",
      "Basic brand analysis",
      "Basic recommendations"
    ]
  },
  pro: {
    name: "Pro",
    auditsPerMonth: 10,
    features: [
      "10 Brand Audits per month",
      "Advanced brand analysis",
      "Detailed recommendations",
      "Export to PDF",
      "Share reports"
    ]
  },
  team: {
    name: "Team",
    auditsPerMonth: 30,
    features: [
      "30 Brand Audits per month",
      "Complete brand analysis",
      "Advanced recommendations",
      "Export to PDF",
      "Share reports",
      "Team collaboration"
    ]
  }
};

// Helper to get storage keys with prefix for better organization
const getStorageKey = (key: string): string => `${STORAGE_PREFIX}${key}`;

// Helper to check if user is superuser
export const isSuperuser = (): boolean => {
  // Get current user from Supabase auth session
  const user = supabase.auth.getUser().then(({data}) => data.user);
  
  // Check localStorage for demo testing
  const lastEmail = localStorage.getItem(getStorageKey('last_email'));
  
  // Check if email matches superuser email
  return lastEmail === SUPERUSER_EMAIL;
};

// Function to store user email for superuser checks
export const storeUserEmail = (email: string): void => {
  if (email) {
    localStorage.setItem(getStorageKey('last_email'), email);
  }
};

// Function to get current user's plan
export const getUserPlan = (): "free" | "pro" | "team" => {
  // Check if user is superuser - they always get the team plan
  if (isSuperuser()) {
    return "team";
  }
  
  const storedPlan = localStorage.getItem(getStorageKey('user_plan'));
  
  if (storedPlan === "pro" || storedPlan === "team") {
    return storedPlan;
  }
  
  return "free";
};

// Function to check remaining audits for the user
export const getRemainingAudits = (): number => {
  // Super users have unlimited audits
  if (isSuperuser()) {
    return 999; // Effectively unlimited
  }
  
  const plan = getUserPlan();
  const usedAudits = parseInt(localStorage.getItem(getStorageKey('used_audits')) || "0");
  const maxAudits = plans[plan].auditsPerMonth;
  
  return maxAudits - usedAudits;
};

// Function to check if user can perform another audit
export const canPerformAudit = (): boolean => {
  // Super users can always perform audits
  if (isSuperuser()) {
    return true;
  }
  
  return getRemainingAudits() > 0;
};

// Function to log an audit usage
export const logAuditUsage = (): void => {
  // Super users don't consume audit credits
  if (isSuperuser()) {
    return;
  }
  
  const usedAudits = parseInt(localStorage.getItem(getStorageKey('used_audits')) || "0");
  localStorage.setItem(getStorageKey('used_audits'), (usedAudits + 1).toString());
};

// Function to send subscription confirmation email
const sendSubscriptionEmail = async (email: string, name: string, planId: "pro" | "team") => {
  try {
    // In a real implementation, you would call a Supabase function
    await supabase.functions.invoke("send-subscription-confirmation", {
      body: {
        email,
        name,
        planType: planId
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error sending subscription email:", error);
    return { success: false, error };
  }
};

// Function to redirect to Stripe checkout
export const redirectToStripeCheckout = async (planId: "pro" | "team") => {
  // Show loading toast
  toast.info(`Setting up your ${plans[planId].name} plan`, {
    description: "Please wait while we prepare your subscription"
  });
  
  // In real implementation, this would redirect to Stripe
  // For demo purposes, we'll just set the plan directly and show a thank you message
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Update the plan
  localStorage.setItem(getStorageKey('user_plan'), planId);
  
  // Get user details from auth
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user?.email) {
    // Store email for superuser check
    storeUserEmail(user.email);
    
    // Send confirmation email
    await sendSubscriptionEmail(
      user.email,
      user.user_metadata?.full_name || user.email,
      planId
    );
  }
  
  // Show success message
  toast.success(`Welcome to the ${plans[planId].name} plan!`, {
    description: "Your subscription has been activated successfully.",
    duration: 5000
  });
  
  return { success: true, planId };
};

// Function to reset used audits count
export const resetAuditCount = (): void => {
  localStorage.setItem(getStorageKey('used_audits'), "0");
  toast.success("Audit count reset", {
    description: `You now have ${plans[getUserPlan()].auditsPerMonth} audits available.`
  });
};