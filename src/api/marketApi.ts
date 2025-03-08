// api.ts
import { fetchWithAuth } from '@/utils/auth';
import { MarketPostDetail } from '@/pages/market/DetailMarketPage';

export async function fetchPostDetail(
  postId: number
): Promise<MarketPostDetail> {
  return await fetchWithAuth<MarketPostDetail>(
    `${import.meta.env.VITE_API_DOMAIN}/api/posting/market/${postId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
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
