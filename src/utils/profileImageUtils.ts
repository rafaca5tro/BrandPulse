
/**
 * Generates a fallback avatar based on the name or username
 * @param name The name or username to generate initials from
 * @returns The initials to use as fallback
 */
export const getInitials = (name: string): string => {
  if (!name) return '?';
  
  // Split the name by spaces, hyphens, underscores, or dots
  const parts = name.split(/[\s-_.]+/);
  
  if (parts.length === 1) {
    // For single words/usernames, return first two characters or just the first if it's a single character
    return name.length > 1 ? name.substring(0, 2).toUpperCase() : name.toUpperCase();
  }
  
  // For multiple parts, take first char of first and last parts
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Generates a consistent background color from a string
 * @param name The string to generate color from
 * @returns A tailwind color class
 */
export const getColorFromName = (name: string): string => {
  if (!name) return 'bg-gray-700';
  
  // Simple hash function to get a number from a string
  const hash = name.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  // Array of tailwind gradient classes for avatar backgrounds
  const gradients = [
    'from-purple-700 to-indigo-900',
    'from-indigo-700 to-blue-900',
    'from-blue-700 to-cyan-900',
    'from-cyan-700 to-teal-900',
    'from-teal-700 to-emerald-900',
    'from-emerald-700 to-green-900',
    'from-rose-700 to-pink-900',
    'from-pink-700 to-fuchsia-900',
    'from-fuchsia-700 to-purple-900',
  ];
  
  // Use the hash to select a color
  const index = hash % gradients.length;
  return `bg-gradient-to-br ${gradients[index]}`;
};

/**
 * Checks if a URL is valid
 * @param url The URL to check
 * @returns Boolean indicating if the URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Validates an image URL and returns a fallback if invalid
 * @param imageUrl The image URL to validate
 * @param name The name to use for fallback initials
 * @param fallback The fallback URL
 * @returns A valid image URL or undefined if fallback should be used
 */
export const validateImageUrl = (
  imageUrl: string | undefined | null,
  fallback?: string
): string | undefined => {
  // First check if we have a direct image URL
  if (imageUrl && isValidUrl(imageUrl)) {
    return imageUrl;
  }
  
  // Second, check if we have a fallback
  if (fallback && isValidUrl(fallback)) {
    return fallback;
  }
  
  // Return undefined to use initials fallback
  return undefined;
};
