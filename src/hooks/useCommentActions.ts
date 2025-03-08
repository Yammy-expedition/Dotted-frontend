import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/utils/auth';
import { Comment, PostDetail } from '@/pages/community/DetailCommunityPage';
import { MarketPostDetail } from '@/pages/market/DetailMarketPage';

export interface CommentLikeResponse {
  is_liked: boolean;
  like_count: number;
}

interface UseCommentActionsProps {
  comment: Comment;
  postId: number;
}

export default function useCommentActions({
  comment,
  postId
}: UseCommentActionsProps) {
  const queryClient = useQueryClient();

  //--------------------------------
  // 댓글 좋아요
  //--------------------------------
  const likeMutation = useMutation<CommentLikeResponse, Error, void>({
    mutationFn: async () => {
      return await fetchWithAuth(
        `${import.meta.env.VITE_API_DOMAIN}/api/posting/comment/${comment.id}/like`,
        { method: 'POST' }
      );
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['postDetail', postId] });
      const previousData = queryClient.getQueryData<
        PostDetail | MarketPostDetail
      >(['postDetail', postId]);
      queryClient.setQueryData(
        ['postDetail', postId],
        (oldData: PostDetail | MarketPostDetail) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            comments: oldData.comments.map((c) =>
              c.id === comment.id
                ? {
                    ...c,
                    is_liked: !c.is_liked,
                    like_count: c.is_liked ? c.like_count - 1 : c.like_count + 1
                  }
                : c
            )
          };
        }
      );
      return { previousData };
    },
    onError: (error, _, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(['postDetail', postId], context.previousData);
      }
      console.error('❌ 댓글 좋아요 실패:', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['postDetail', postId] });
    }
  });

  //--------------------------------
  // 댓글 수정하기
  //--------------------------------
  const updateMutation = useMutation<
    Comment,
    Error,
    { editedContent: string; isSecret: boolean }
  >({
    mutationFn: async ({ editedContent, isSecret }) => {
      const requestData = {
        content: editedContent,
        is_secret: isSecret
      };
      return await fetchWithAuth<Comment>(
        `${import.meta.env.VITE_API_DOMAIN}/api/posting/comment/${comment.id}/update`,
        {
          method: 'PATCH',
          body: JSON.stringify(requestData)
        }
      );
    },
    onMutate: async (updatedComment) => {
      await queryClient.cancelQueries({ queryKey: ['postDetail', postId] });
      const previousData = queryClient.getQueryData<
        PostDetail | MarketPostDetail
      >(['postDetail', postId]);
      queryClient.setQueryData<PostDetail | MarketPostDetail>(
        ['postDetail', postId],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            comments: oldData.comments.map((c) =>
              c.id === comment.id
                ? {
                    ...c,
                    content: updatedComment.editedContent.trim(),
                    is_secret: updatedComment.isSecret
                  }
                : c
            )
          };
        }
      );
      return { previousData };
    },
    onError: (error, _, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(['postDetail', postId], context.previousData);
      }
      console.error('❌ 댓글 수정 실패:', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['postDetail', postId] });
    }
  });

  //--------------------------
  // 댓글 작성하기
  //--------------------------
  const commentMutation = useMutation<
    Comment,
    Error,
    { recomment: string; isSecret: boolean }
  >({
    mutationFn: async ({ recomment, isSecret }) => {
      const requestData = {
        post: comment.post || null,
        content: recomment.trim(),
        parent: comment.id,
        is_secret: isSecret
      };
      return await fetchWithAuth<Comment>(
        `${import.meta.env.VITE_API_DOMAIN}/api/posting/comment/create`,
        {
          method: 'POST',
          body: JSON.stringify(requestData)
        }
      );
    },
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: ['postDetail', postId] });
      const previousData = queryClient.getQueryData<
        PostDetail | MarketPostDetail
      >(['postDetail', postId]);

      const refinedNewComment = {
        id: Date.now(),
        user_id: Date.now(),
        post: comment.post,
        content: newComment.recomment.trim(),
        parent: comment.parent,
        created_at: new Date().toISOString(),
        is_secret: newComment.isSecret,
        like_count: 0,
        is_liked: false,
        replies: [],
        is_mine: true,
        is_deleted: false,
        user_nickname: '나',
        root_parent: comment.id
      };

      queryClient.setQueryData<PostDetail | MarketPostDetail>(
        ['postDetail', postId],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            comments: oldData.comments.map((c: Comment) =>
              c.id === comment.id
                ? { ...c, replies: [...(c.replies || []), refinedNewComment] }
                : c
            )
          };
        }
      );
      return { previousData };
    },
    onError: (error, _, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(['postDetail', postId], context.previousData);
      }
      console.error('❌ 대댓글 작성 실패:', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['postDetail', postId] });
    }
  });

  //-----------------------------
  // 댓글 삭제
  //-----------------------------
  const deleteMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      return await fetchWithAuth<void>(
        `${import.meta.env.VITE_API_DOMAIN}/api/posting/comment/${comment.id}/delete`,
        { method: 'DELETE' }
      );
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['postDetail', postId] });
      const previousData = queryClient.getQueryData<
        PostDetail | MarketPostDetail
      >(['postDetail', postId]);

      queryClient.setQueryData<PostDetail | MarketPostDetail>(
        ['postDetail', postId],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            comments: oldData.comments.map((c) =>
              c.id === comment.id
                ? {
                    ...c,
                    content: 'Deleted Comment',
                    is_deleted: true,
                    user_nickname: 'Unknown'
                  }
                : c
            )
          };
        }
      );

      return { previousData };
    },
    onError: (error, _, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(['postDetail', postId], context.previousData);
      }
      console.error('❌ 댓글 삭제 실패:', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['postDetail', postId] });
    }
  });

  //------------------------------
  // 댓글 신고
  //-------------------------------
  const reportMutation = useMutation<
    any,
    Error,
    { reportType: string; reportContent: string }
  >({
    mutationFn: async ({ reportType, reportContent }) => {
      const dataToSend = {
        report_type: reportType,
        content_type: 'Comment',
        object_id: comment.id,
        reason: reportContent
      };
      return await fetchWithAuth<any>(
        `${import.meta.env.VITE_API_DOMAIN}/api/management/report`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
        }
      );
    },
    onSuccess: () => {
      alert('Your report has been submitted.');
    },
    onError: (error) => {
      console.error('❌ 신고 실패:', error);
      alert('Failed to submit the report.');
    }
  });

  return {
    likeMutation,
    updateMutation,
    commentMutation,
    deleteMutation,
    reportMutation
  };
}
