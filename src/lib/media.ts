export const DEFAULT_DONATION_IMAGE =
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80';

export function donationImageOrFallback(imageUrl: string | null | undefined): string {
  if (!imageUrl || imageUrl.trim().length === 0) {
    return DEFAULT_DONATION_IMAGE;
  }
  return imageUrl;
}

