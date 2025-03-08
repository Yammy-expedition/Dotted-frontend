// api/comments.ts
import { fetchWithAuth } from '@/utils/auth';

export async function postComment(data: {
  post: number;
  content: string;
  parent: number | null;
  is_secret: boolean;
}) {
  return await fetchWithAuth<Comment>(
    `${import.meta.env.VITE_API_DOMAIN}/api/posting/comment/create`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  );
}
