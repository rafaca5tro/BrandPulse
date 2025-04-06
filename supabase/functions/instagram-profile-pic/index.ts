
// supabase/functions/instagram-profile-pic/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

interface RequestBody {
  username: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const { username } = await req.json() as RequestBody;
    
    if (!username) {
      return new Response(
        JSON.stringify({ error: 'Username is required' }),
        { headers: corsHeaders, status: 400 }
      );
    }
    
    console.log(`Fetching Instagram profile picture for ${username}`);
    
    // Clean the username (remove @ if present)
    const cleanUsername = username.replace('@', '').trim();
    
    // For known accounts, return custom images with better quality
    if (cleanUsername.toLowerCase() === 'packers' || cleanUsername.toLowerCase() === 'greenbaypackers') {
      return new Response(
        JSON.stringify({ 
          profilePicUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Green_Bay_Packers_logo.svg',
          username: cleanUsername
        }),
        { headers: corsHeaders }
      );
    } else if (cleanUsername.toLowerCase().includes('barcelona') || cleanUsername.toLowerCase() === 'fcbarcelona') {
      return new Response(
        JSON.stringify({ 
          profilePicUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png',
          username: cleanUsername
        }),
        { headers: corsHeaders }
      );
    } else if (cleanUsername.toLowerCase() === 'nintendo') {
      return new Response(
        JSON.stringify({ 
          profilePicUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Nintendo.svg',
          username: cleanUsername
        }),
        { headers: corsHeaders }
      );
    } else if (cleanUsername.toLowerCase() === 'nba') {
      return new Response(
        JSON.stringify({ 
          profilePicUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/03/National_Basketball_Association_logo.svg/1200px-National_Basketball_Association_logo.svg.png',
          username: cleanUsername
        }),
        { headers: corsHeaders }
      );
    }
    
    // Generate initials for avatar
    const initials = cleanUsername
      .split(/[^a-zA-Z0-9]/)
      .filter(part => part.length > 0)
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    
    // Use a colorful profile picture with Instagram gradient colors
    const colors = [
      '#405DE6', '#5851DB', '#833AB4', '#C13584', '#E1306C', '#FD1D1D',
      '#F56040', '#F77737', '#FCAF45', '#FFDC80'
    ];
    
    // Use the first letter of the username to select a consistent color
    const colorIndex = cleanUsername.charCodeAt(0) % colors.length;
    const backgroundColor = colors[colorIndex];
    
    // For other accounts, generate an avatar with Instagram colors
    const profilePicUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${encodeURIComponent(backgroundColor.substring(1))}&color=ffffff&size=256&length=2&rounded=true&bold=true`;
    
    return new Response(
      JSON.stringify({ profilePicUrl, username: cleanUsername }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { headers: corsHeaders, status: 500 }
    );
  }
});
