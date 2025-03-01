// useSearchPosts.ts
import { CommunityPost } from '@/types/CommunityPost';
import { MarketPost } from '@/types/MarketPost';
import { useMutation } from '@tanstack/react-query';

interface SearchPostsParams {
  name: string; // 'market' 또는 'community'
  keyword: string;
  searchType: string;
  tag?: string; // 커뮤니티 게시글 검색 시 사용
  status?: string; // 마켓 게시글 검색 시 사용
  page: number;
}

const fetchPosts = async ({
  name,
  keyword,
  searchType,
  tag,
  status,
  page
}: SearchPostsParams): Promise<CommunityPost | MarketPost> => {
  const queryParams = new URLSearchParams();
  const apiLink = { url: 'posting' };

  if (keyword) queryParams.append('keyword', keyword);
  if (searchType) queryParams.append('search_type', searchType);
  if (page) queryParams.append('page', page.toString());

  if (name === 'market') {
    apiLink.url = 'posting/market';
    if (status) queryParams.append('status', status);
  } else {
    if (tag && tag !== 'All') queryParams.append('tag', tag);
  }

  // console.log(queryParams.toString());
  const url = `${import.meta.env.VITE_API_DOMAIN}/api/${apiLink.url}?${queryParams.toString()}`;

  const response = await fetch(url, { method: 'GET' });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

export const useSearchPosts = () => {
  return useMutation<CommunityPost | MarketPost, Error, SearchPostsParams>({
    mutationFn: fetchPosts
  });
};
