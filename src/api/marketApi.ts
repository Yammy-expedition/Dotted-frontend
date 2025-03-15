// api.ts
import { fetchWithAuth } from '@/utils/auth';
import { MarketPostDetail } from '@/pages/market/DetailMarketPage';

export async function fetchPostDetail(
  postId: number
): Promise<MarketPostDetail> {
  const postType = window.location.pathname.includes('/market');
  return await fetchWithAuth<MarketPostDetail>(
    postType
      ? `${import.meta.env.VITE_API_DOMAIN}/api/posting/market/${postId}`
      : `${import.meta.env.VITE_API_DOMAIN}/api/posting/${postId}`
  );
}

export async function scrapPost(postId: number): Promise<any> {
  return await fetchWithAuth<any>(
    `${import.meta.env.VITE_API_DOMAIN}/api/posting/${postId}/scrap`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: postId })
    }
  );
}
