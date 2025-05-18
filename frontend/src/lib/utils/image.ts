export const getImageUrl = (url: string): string => {
  if (!url) return "/no-image-svgrepo-com.svg";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const imageUrl = apiUrl.replace('/api', "") + url;
  return imageUrl;
}; 