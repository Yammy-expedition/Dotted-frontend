import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { fetchPostDetail } from '@/api/marketApi';
import { MarketPostDetail } from '@/pages/market/DetailMarketPage';
import { Comment } from '@/pages/community/DetailCommunityPage';

interface UseCommentQueriesReturn {
  updatedComment: Comment;
}

export function useCommentQueries(
  postId: number,
  comment: Comment
): UseCommentQueriesReturn {
  const queryClient = useQueryClient();

  const { data: postDetail } = useSuspenseQuery({
    queryKey: ['postDetail', postId],
    queryFn: () => fetchPostDetail(postId),
    initialData: () =>
      queryClient.getQueryData<MarketPostDetail>(['postDetail', postId])
  });

  const updatedComment =
    postDetail?.comments.find((c) => c.id === comment.id) || comment;

  return { updatedComment };
}
