
export interface AuditReport {
  id: string;
  user_id: string;
  title: string;
  url: string;
  screenshot_url?: string;
  instagram_profile_pic?: string;
  score: number;
  score_breakdown: {
    visual_consistency?: number;
    messaging?: number;
    positioning?: number;
    social_media?: number;
    website?: number;
    [key: string]: number | undefined;
  };
  summary: string;
  detailed_analysis?: DetailedAnalysis;
  status: string;
  uploaded_files: string[];
  created_at: string;
  updated_at: string;
}

export interface DetailedAnalysis {
  visual_analysis?: {
    logo_usage: string;
    color_palette: string;
    typography: string;
    design_language: string;
    summary?: string;
    strengths?: string[];
    weaknesses?: string[];
    recommendations: string[];
  };
  messaging_analysis?: {
    tone_of_voice: string;
    key_messages: string;
    communication_strategy: string;
    summary?: string;
    strengths?: string[];
    weaknesses?: string[];
    engagement_metrics?: {
      readability_score: number;
      emotional_appeal: number;
      call_to_action_effectiveness: number;
      [key: string]: number | undefined;
    };
    recommendations: string[];
  };
  positioning_analysis?: {
    market_position: string;
    competitor_comparison: string;
    unique_selling_points: string;
    summary?: string;
    strengths?: string[];
    weaknesses?: string[];
    differentiation_score?: number;
    recommendations: string[];
  };
  social_media_analysis?: {
    content_strategy: string;
    engagement: string;
    growth_opportunities: string;
    summary?: string;
    strengths?: string[];
    weaknesses?: string[];
    engagement_metrics?: {
      post_engagement_rate: string;
      follower_growth_rate: string;
      content_consistency_score: number;
      [key: string]: string | number | undefined;
    };
    metrics?: {
      post_engagement_rate: string;
      follower_growth_rate: string;
      content_consistency_score: number;
      [key: string]: string | number | undefined;
    };
    recommendations: string[];
  };
  website_analysis?: {
    user_experience: string;
    content_quality: string;
    performance: string;
    summary?: string;
    strengths?: string[];
    weaknesses?: string[];
    performance_metrics?: {
      mobile_speed_score: number;
      accessibility_score: number;
      seo_optimization: number;
      [key: string]: number | undefined;
    };
    recommendations: string[];
  };
  [key: string]: any;
}
