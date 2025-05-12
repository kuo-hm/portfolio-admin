export const getImageUrl = (url: string): string => {
  if (!url) return "";
  return url.startsWith("http")
    ? url
    : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}${url}`;
}; 