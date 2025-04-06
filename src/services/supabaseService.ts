import { supabase } from '@/integrations/supabase/client';
import { AuditReport, DetailedAnalysis } from '@/types/supabase';
import { toast } from 'sonner';

// Create a new audit report
export const createAuditReport = async (report: Omit<AuditReport, 'id' | 'created_at' | 'updated_at'>): Promise<AuditReport> => {
  try {
    // Fix type issues by explicitly defining insert values
    const { data, error } = await supabase
      .from('audit_reports')
      .insert({
        user_id: report.user_id,
        title: report.title,
        url: report.url,
        score: report.score,
        score_breakdown: report.score_breakdown,
        summary: report.summary,
        detailed_analysis: report.detailed_analysis,
        status: report.status,
        uploaded_files: report.uploaded_files,
        screenshot_url: report.screenshot_url,
        instagram_profile_pic: report.instagram_profile_pic
      })
      .select()
      .single();

    if (error) throw error;
    
    return transformDatabaseReport(data);
  } catch (error) {
    console.error('Error creating audit report:', error);
    throw new Error('Failed to create audit report');
  }
};

// Get all audit reports for a user
export const getUserAuditReports = async (userId: string): Promise<AuditReport[]> => {
  try {
    const { data, error } = await supabase
      .from('audit_reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(transformDatabaseReport);
  } catch (error) {
    console.error('Error getting user audit reports:', error);
    throw new Error('Failed to fetch audit reports');
  }
};

// Get a specific audit report by ID
export const getAuditReportById = async (reportId: string): Promise<AuditReport> => {
  try {
    const { data, error } = await supabase
      .from('audit_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (error) {
      console.error('Error getting audit report by ID:', error);
      throw error;
    }
    
    if (!data) {
      console.error('No data returned for report ID:', reportId);
      throw new Error('Audit report not found');
    }
    
    return transformDatabaseReport(data);
  } catch (error) {
    console.error('Error getting audit report:', error);
    throw new Error(`Failed to fetch audit report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Update an existing audit report
export const updateAuditReport = async (report: AuditReport): Promise<AuditReport> => {
  try {
    const { data, error } = await supabase
      .from('audit_reports')
      .update({
        title: report.title,
        url: report.url,
        score: report.score,
        score_breakdown: report.score_breakdown,
        summary: report.summary,
        detailed_analysis: report.detailed_analysis,
        status: report.status,
        uploaded_files: report.uploaded_files,
        screenshot_url: report.screenshot_url,
        instagram_profile_pic: report.instagram_profile_pic
      })
      .eq('id', report.id)
      .select()
      .single();

    if (error) throw error;
    
    return transformDatabaseReport(data);
  } catch (error) {
    console.error('Error updating audit report:', error);
    throw new Error('Failed to update audit report');
  }
};

// Delete an audit report
export const deleteAuditReport = async (reportId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('audit_reports')
      .delete()
      .eq('id', reportId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting audit report:', error);
    throw new Error('Failed to delete audit report');
  }
};

// Improved social media profile picture fetching with multiple fallback mechanisms
export const fetchSocialMediaProfilePic = async (url: string): Promise<{ profilePicUrl: string | null, platform: string | null, username: string | null }> => {
  try {
    console.log("Fetching social media profile picture for:", url);
    
    if (!url) {
      return { profilePicUrl: null, platform: null, username: null };
    }
    
    // Determine the platform from the URL
    const platform = getSocialMediaPlatform(url);
    const username = extractUsername(url, platform);
    
    console.log(`Detected platform: ${platform}, username: ${username}`);

    // If we have a username and platform, attempt to generate a proper profile picture
    if (username && platform) {
      // First try: platform-specific APIs (if available)
      try {
        if (platform === 'instagram') {
          const { data, error } = await supabase.functions.invoke('instagram-profile-pic', {
            body: { username },
            headers: { 'Cache-Control': 'no-cache' }
          });
          
          if (!error && data?.profilePicUrl) {
            console.log("Successfully fetched Instagram profile pic:", data.profilePicUrl);
            return { profilePicUrl: data.profilePicUrl, platform, username };
          } else {
            console.warn("Instagram profile pic fetch error:", error);
          }
        } else if (platform === 'twitter' || platform === 'x') {
          const { data, error } = await supabase.functions.invoke('twitter-profile-pic', {
            body: { username },
            headers: { 'Cache-Control': 'no-cache' }
          });
          
          if (!error && data?.profilePicUrl) {
            console.log("Successfully fetched Twitter profile pic:", data.profilePicUrl);
            return { profilePicUrl: data.profilePicUrl, platform, username };
          } else {
            console.warn("Twitter profile pic fetch error:", error);
          }
        }
      } catch (apiError) {
        console.error(`Error fetching profile pic from ${platform} API:`, apiError);
      }
      
      // Second try: Use unavatar.io which has good platform integrations
      try {
        const platformForUnavatar = platform === 'x' ? 'twitter' : platform;
        const unavatarUrl = `https://unavatar.io/${platformForUnavatar}/${username}?cache=${Date.now()}`;
        
        // Test if unavatar has an image
        const testResponse = await fetch(unavatarUrl, { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        
        if (testResponse.ok) {
          console.log(`Successfully fetched profile pic from unavatar for ${platform}:`, unavatarUrl);
          return { profilePicUrl: unavatarUrl, platform, username };
        } else {
          console.warn(`Unavatar failed for ${platform} with status:`, testResponse.status);
        }
      } catch (unavatarError) {
        console.error(`Error with unavatar for ${platform}:`, unavatarError);
      }
      
      // Third try: Try direct URL fetch for certain platforms
      try {
        if (platform === 'instagram') {
          const instagramIconUrl = `https://www.instagram.com/favicon.ico`;
          return { profilePicUrl: instagramIconUrl, platform, username };
        }
        
        if (platform === 'twitter' || platform === 'x') {
          const twitterIconUrl = `https://twitter.com/favicon.ico`;
          return { profilePicUrl: twitterIconUrl, platform, username };
        }
        
        // Try a favicon from the profile URL as fallback
        const urlObj = new URL(url);
        const domainFaviconUrl = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`;
        return { profilePicUrl: domainFaviconUrl, platform, username };
      } catch (directError) {
        console.error(`Direct URL fetch error:`, directError);
      }
      
      // Fourth try: Generate branded avatar with platform colors
      const colorHex = getPlatformColorHex(platform);
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(username.substring(0, 2).toUpperCase())}&background=${colorHex}&color=ffffff&size=256&length=2&rounded=true&bold=true`;
      console.log(`Using generated platform-colored avatar for ${platform}:`, avatarUrl);
      return { profilePicUrl: avatarUrl, platform, username };
    }
    
    // Final fallback: Generate generic avatar
    return generateSocialMediaAvatar(username, platform, getPlatformColorHex(platform));
  } catch (error) {
    console.error("Error in fetchSocialMediaProfilePic:", error);
    toast.error("Failed to fetch social media profile", {
      description: "Using a placeholder image instead"
    });
    
    // Ultimate fallback - generate a simple placeholder
    return { 
      profilePicUrl: `https://ui-avatars.com/api/?name=SM&background=6c757d&color=ffffff&size=256`,
      platform: null, 
      username: null 
    };
  }
};

// Get platform color in hex format for avatar generation
const getPlatformColorHex = (platform: string | null): string => {
  if (!platform) return '6c757d';
  
  const platformLower = platform.toLowerCase();
  if (platformLower.includes('instagram')) return '8a3ab9';
  if (platformLower.includes('twitter') || platformLower.includes('x')) return '1DA1F2';
  if (platformLower.includes('facebook')) return '4267B2';
  if (platformLower.includes('linkedin')) return '0077B5';
  if (platformLower.includes('youtube')) return 'FF0000';
  
  return '6c757d';
};

// Generate a social media avatar with platform's brand color
const generateSocialMediaAvatar = (username: string | null, platform: string | null, colorHex: string): { profilePicUrl: string, platform: string | null, username: string | null } => {
  if (!username) {
    const platformInitial = platform ? platform.substring(0, 2).toUpperCase() : 'SM';
    return { 
      profilePicUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(platformInitial)}&background=${colorHex}&color=ffffff&size=256&length=2&rounded=true&bold=true`,
      platform, 
      username 
    };
  }
  
  // Clean username and get initials
  const cleanUsername = username.replace('@', '').trim();
  const initials = cleanUsername
    .split(/[^a-zA-Z0-9]/)
    .filter(part => part.length > 0)
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
    
  return { 
    profilePicUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${colorHex}&color=ffffff&size=256&length=2&rounded=true&bold=true`,
    platform, 
    username 
  };
};

// Determine social media platform from a URL
export const getSocialMediaPlatform = (url: string): string | null => {
  if (!url) return null;
  
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('instagram.com') || lowerUrl.includes('instagram')) {
    return 'instagram';
  } else if (lowerUrl.includes('twitter.com') || lowerUrl.includes('twitter')) {
    return 'twitter';
  } else if (lowerUrl.includes('x.com')) {
    return 'x';
  } else if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.com')) {
    return 'facebook';
  } else if (lowerUrl.includes('linkedin.com')) {
    return 'linkedin';
  } else if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return 'youtube';
  }
  
  return null;
};

// Extract username from social media URL
export const extractUsername = (url: string, platform: string | null): string | null => {
  if (!url || !platform) return null;
  
  try {
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    
    if (platform === 'instagram') {
      // Instagram URLs are typically instagram.com/username
      const match = cleanUrl.match(/instagram\.com\/([^\/\?]+)/i);
      return match ? match[1] : null;
    } else if (platform === 'twitter' || platform === 'x') {
      // Twitter URLs are typically twitter.com/username
      const match = cleanUrl.match(/(?:twitter\.com|x\.com)\/([^\/\?]+)/i);
      return match ? match[1] : null;
    } else if (platform === 'facebook') {
      // Facebook URLs can be complex, try to extract username or page name
      const match = cleanUrl.match(/facebook\.com\/(?:pages\/)?([^\/\?]+)/i);
      return match ? match[1] : null;
    } else if (platform === 'linkedin') {
      // LinkedIn URLs for profiles are typically linkedin.com/in/username
      const match = cleanUrl.match(/linkedin\.com\/in\/([^\/\?]+)/i);
      return match ? match[1] : null;
    } else if (platform === 'youtube') {
      // YouTube URLs for channels can be complex
      const match = cleanUrl.match(/youtube\.com\/(?:channel\/|c\/|user\/|@)?([^\/\?]+)/i);
      return match ? match[1] : null;
    }
  } catch (error) {
    console.error(`Error extracting username from ${platform} URL:`, error);
  }
  
  return null;
};

// Helper function to transform database report to AuditReport type
function transformDatabaseReport(data: any): AuditReport {
  return {
    id: data.id,
    user_id: data.user_id,
    title: data.title,
    url: data.url || '',
    score: data.score || 0,
    score_breakdown: data.score_breakdown ? transformScoreBreakdown(data.score_breakdown) : {},
    summary: data.summary || '',
    detailed_analysis: data.detailed_analysis ? transformDetailedAnalysis(data.detailed_analysis) : undefined,
    status: data.status,
    uploaded_files: data.uploaded_files || [],
    created_at: data.created_at,
    updated_at: data.updated_at,
    screenshot_url: data.screenshot_url || '',
    instagram_profile_pic: data.instagram_profile_pic || ''
  };
}

// Helper function to transform score_breakdown JSON to the expected type
function transformScoreBreakdown(data: any): { [key: string]: number } {
  if (typeof data === 'object' && data !== null) {
    return Object.entries(data).reduce((acc: { [key: string]: number }, [key, value]) => {
      if (typeof value === 'number') {
        acc[key] = value;
      }
      return acc;
    }, {});
  }
  return {};
}

// Helper function to transform detailed_analysis JSON to the expected type
function transformDetailedAnalysis(data: any): DetailedAnalysis | undefined {
  if (typeof data === 'object' && data !== null) {
    return data as DetailedAnalysis;
  }
  return undefined;
}
