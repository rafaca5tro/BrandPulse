
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from './icons';
import supabase from '@/integrations/supabase/client';
import { validateImageUrl, getInitials, getColorFromName } from '@/utils/profileImageUtils';

export interface SocialMediaProfileProps {
  platform: string;
  username: string;
  followers?: number;
  engagement?: number;
  posts?: number;
  profileUrl?: string;
  imageUrl?: string;
  verified?: boolean;
  growth?: number;
  isPrivate?: boolean;
  lastUpdated?: string;
}

const SocialMediaProfile: React.FC<SocialMediaProfileProps> = ({
  platform,
  username,
  followers,
  engagement,
  posts,
  profileUrl,
  imageUrl,
  verified = false,
  growth = 0,
  isPrivate = false,
  lastUpdated
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [validatedImageUrl, setValidatedImageUrl] = useState<string | undefined>(undefined);
  const [avatarColor] = useState(getColorFromName(username));

  const shortenNumber = (num?: number): string => {
    if (num === undefined) return 'N/A';
    if (num < 1000) return num.toString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    return (num / 1000000).toFixed(1) + 'M';
  };

  const formatEngagement = (rate?: number): string => {
    if (rate === undefined) return 'N/A';
    return rate.toFixed(1) + '%';
  };

  const getPlatformIcon = (name: string) => {
    const platformKey = name.toLowerCase().replace(/\s+/g, '');
    const IconComponent = 
      platformKey === 'twitter' || platformKey === 'x' ? Icons.Twitter :
      platformKey === 'instagram' ? Icons.Instagram :
      platformKey === 'facebook' ? Icons.Facebook :
      platformKey === 'linkedin' ? Icons.Linkedin :
      platformKey === 'tiktok' ? Icons.Video :
      platformKey === 'youtube' ? Icons.Youtube :
      platformKey === 'pinterest' ? Icons.Image :
      platformKey === 'snapchat' ? Icons.Ghost :
      platformKey === 'reddit' ? Icons.Reddit :
      platformKey === 'discord' ? Icons.MessageSquare :
      Icons.Globe;
    
    return <IconComponent size={20} className="text-gray-300" />;
  };

  const getProfileUrl = (platform: string, username: string): string => {
    const platformKey = platform.toLowerCase().replace(/\s+/g, '');
    if (profileUrl) return profileUrl;
    
    switch (platformKey) {
      case 'twitter':
      case 'x':
        return `https://twitter.com/${username}`;
      case 'instagram':
        return `https://instagram.com/${username}`;
      case 'facebook':
        return `https://facebook.com/${username}`;
      case 'linkedin':
        return `https://linkedin.com/in/${username}`;
      case 'tiktok':
        return `https://tiktok.com/@${username}`;
      case 'youtube':
        return `https://youtube.com/@${username}`;
      case 'pinterest':
        return `https://pinterest.com/${username}`;
      case 'reddit':
        return `https://reddit.com/user/${username}`;
      default:
        return '#';
    }
  };

  useEffect(() => {
    // Validate the provided image URL
    const validImage = validateImageUrl(imageUrl);
    
    if (validImage) {
      setValidatedImageUrl(validImage);
      return;
    }
    
    // If no valid image URL, try to fetch from Supabase Storage
    const fetchProfileImage = async () => {
      try {
        const platformName = platform.toLowerCase();
        const { data, error } = await supabase.storage
          .from('profile-images')
          .download(`${platformName}/${username}.jpg`);
        
        if (error || !data) {
          console.log(`Could not find profile image for ${username} on ${platform}`);
          setImageError(true);
          return;
        }
        
        const imageObjectUrl = URL.createObjectURL(data);
        setValidatedImageUrl(imageObjectUrl);
      } catch (err) {
        console.error('Error fetching profile image:', err);
        setImageError(true);
      }
    };
    
    fetchProfileImage();
    
    // Cleanup function to revoke object URL
    return () => {
      if (validatedImageUrl && validatedImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(validatedImageUrl);
      }
    };
  }, [platform, username, imageUrl]);

  return (
    <Card className="border border-gray-800/50 bg-gray-900/95 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(147,51,234,0.2)]">
      <CardContent className="p-6">
        <div className="flex items-start">
          <div className="w-14 h-14 profile-avatar mr-4">
            {validatedImageUrl && !imageError ? (
              <img
                src={validatedImageUrl}
                alt={`${username} on ${platform}`}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className={`w-full h-full profile-avatar-fallback ${avatarColor} flex items-center justify-center text-xl font-semibold`}>
                {getInitials(username)}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-gray-100 font-['Inter']">
                  {username}
                </h3>
                {verified && (
                  <div className="ml-1.5 text-blue-400" title="Verified Account">
                    <Icons.BadgeCheck size={16} />
                  </div>
                )}
                {isPrivate && (
                  <div className="ml-1.5 text-gray-400" title="Private Account">
                    <Icons.Lock size={14} />
                  </div>
                )}
              </div>
              <div className="flex items-center">
                {getPlatformIcon(platform)}
              </div>
            </div>
            <div className="mt-1 flex items-center text-gray-400 text-sm">
              <span className="mr-1.5">{platform}</span>
              {growth !== 0 && (
                <span className={`flex items-center text-xs font-medium ${growth > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {growth > 0 ? <Icons.TrendingUp size={14} className="mr-0.5" /> : <Icons.TrendingDown size={14} className="mr-0.5" />}
                  {Math.abs(growth)}%
                </span>
              )}
            </div>
            
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div className="bg-gray-800/50 px-2 py-3 rounded-lg">
                <p className="text-sm text-gray-400 font-['Inter']">Followers</p>
                <p className="text-lg font-semibold text-gray-100 font-['Inter']">{shortenNumber(followers)}</p>
              </div>
              <div className="bg-gray-800/50 px-2 py-3 rounded-lg">
                <p className="text-sm text-gray-400 font-['Inter']">Engagement</p>
                <p className="text-lg font-semibold text-gray-100 font-['Inter']">{formatEngagement(engagement)}</p>
              </div>
              <div className="bg-gray-800/50 px-2 py-3 rounded-lg">
                <p className="text-sm text-gray-400 font-['Inter']">Posts</p>
                <p className="text-lg font-semibold text-gray-100 font-['Inter']">{shortenNumber(posts)}</p>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <a
                href={getProfileUrl(platform, username)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                <span className="mr-1">View Profile</span>
                <Icons.ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaProfile;
