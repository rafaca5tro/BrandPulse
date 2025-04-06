
// supabase/functions/twitter-profile-pic/index.ts
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
    
    console.log(`Fetching Twitter profile picture for ${username}`);
    
    // Clean the username (remove @ if present)
    const cleanUsername = username.replace('@', '').trim();
    
    // For known accounts, return custom images with better quality
    if (cleanUsername.toLowerCase() === 'packers' || cleanUsername.toLowerCase() === 'packers') {
      return new Response(
        JSON.stringify({ 
          profilePicUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Green_Bay_Packers_logo.svg',
          username: cleanUsername
        }),
        { headers: corsHeaders }
      );
    } else if (cleanUsername.toLowerCase() === 'fcbarcelona' || cleanUsername.toLowerCase() === 'fcbarcelona_es') {
      return new Response(
        JSON.stringify({ 
          profilePicUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png',
          username: cleanUsername
        }),
        { headers: corsHeaders }
      );
    } else if (cleanUsername.toLowerCase() === 'elonmusk') {
      return new Response(
        JSON.stringify({ 
          profilePicUrl: 'https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_400x400.jpg',
          username: cleanUsername
        }),
        { headers: corsHeaders }
      );
    } else if (cleanUsername.toLowerCase() === 'x') {
      return new Response(
        JSON.stringify({ 
          profilePicUrl: 'https://pbs.twimg.com/profile_images/1683899100922511378/5lY42eHs_400x400.jpg',
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
    
    // Twitter blue color
    const twitterBlue = "1DA1F2";
    
    // For other accounts, generate an avatar with Twitter colors
    const profilePicUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${twitterBlue}&color=ffffff&size=256&length=2&rounded=true&bold=true`;
    
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
