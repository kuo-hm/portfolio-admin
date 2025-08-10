export function getImageUrl(imageUrl: string) {
  const backEndUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!backEndUrl) {
    return imageUrl;
  }
  const encodedImageUrl = encodeURIComponent(imageUrl);
  console.log(`${backEndUrl}/public/image?path=${encodedImageUrl}`);
  return `${backEndUrl}/public/image?path=${encodedImageUrl}`;
}
