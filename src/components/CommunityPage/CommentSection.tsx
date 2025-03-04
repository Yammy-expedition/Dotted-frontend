import { useState } from 'react';
import styled from 'styled-components';

import { Comment, PostDetail } from '@/pages/community/DetailCommunityPage';
import { MarketPostDetail } from '@/pages/market/DetailMarketPage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AComment from './AComment';
import Locker from '@/assets/svg/MarketPage/Locker.svg?react';
import { fetchWithAuth } from '@/utils/auth'; // auth.ts 경로에 맞게 수정

interface CommentSectionProps {
  post: PostDetail | MarketPostDetail;
  origin?: string;
}

export default function CommentSection({ post, origin }: CommentSectionProps) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(post.comments); // 댓글 상태
  const [commentCount, setCommentCount] = useState(post.comment_count); // 댓글 개수 상태
  const [isSecret, setIsSecret] = useState(false);
  const queryClient = useQueryClient();

  // 댓글 추가 함수
  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      return;
    }

    // 요청 데이터 준비
    const requestData = {
      post: post.id,
      content: comment.trim(),
      parent: null,
      is_secret: isSecret
    };

    try {
      await postCommentMutation.mutateAsync(requestData);
    } catch (error) {
      console.error('❌ 댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  // React Query Mutation (댓글 등록)
  const postCommentMutation = useMutation<
    Comment, // 응답 데이터 타입 (새로운 댓글)
    Error, // 에러 타입
    { post: number; content: string; parent: number | null; is_secret: boolean } // 요청 데이터 타입
  >({
    mutationFn: async (data) => {
      // fetchWithAuth 내부에서 토큰 갱신/검증이 처리됩니다.
      const response = await fetchWithAuth<Comment>(
        `${import.meta.env.VITE_API_DOMAIN}/api/posting/comment/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      );
      return response;
    },
    onSuccess: (data) => {
      setComment('');
      setComments((prev: Comment[]) => [...prev, data]);
      setCommentCount((prev) => prev + 1);
      queryClient.setQueryData<PostDetail | MarketPostDetail>(
        ['postDetail', post.id],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            comments: [...oldData.comments, data],
            comment_count: oldData.comment_count + 1
          };
        }
      );
    },
    onError: (error) => {
      console.error('❌ 댓글 작성 실패:', error);
    }
  });
  // console.log(comment);

  return (
    <CommentSectionWrapper>
      <CommentCount>
        Comment <span>{commentCount}</span>
      </CommentCount>

      <CommentsListWrapper>
        {comments.map((commentItem, idx) => (
          <AComment
            comment={commentItem}
            origin={origin}
            postIsMine={post.is_mine}
            key={idx}
          />
        ))}
      </CommentsListWrapper>

      <CommentInputWrapper>
        <label htmlFor="comment">
          <textarea
            name="comment"
            placeholder="write a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleCommentSubmit();
              }
            }}
          />
          {origin === 'market' && (
            <SecretButton
              onClick={() => setIsSecret((prev) => !prev)}
              $isSecret={isSecret}
            >
              <Locker />
              <span>secret comment</span>
            </SecretButton>
          )}
        </label>

        <CommentButton onClick={handleCommentSubmit}>comment</CommentButton>
      </CommentInputWrapper>
    </CommentSectionWrapper>
  );
}

const SecretButton = styled.button<{ $isSecret: boolean }>`
  cursor: pointer;
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.8rem;
  border-radius: 0.5rem;
  border: 1px solid
    ${({ theme, $isSecret }) =>
      $isSecret ? theme.colors.purple600 : theme.colors.gray300};
  color: ${({ theme, $isSecret }) =>
    $isSecret ? theme.colors.purple600 : theme.colors.gray400};
  text-align: center;

  font-size: 1.6rem;
  @media (max-width: 460px) {
    font-size: 1.3rem;
  }
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  letter-spacing: -0.08rem;
  > svg {
    > path {
      fill: ${({ theme, $isSecret }) =>
        $isSecret ? theme.colors.purple600 : theme.colors.gray400};
    }
  }

  > span {
    @media (max-width: 700px) {
      display: none;
    }
  }
`;

const CommentSectionWrapper = styled.section`
  margin-bottom: 20.7rem;
`;

const CommentCount = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.gray800};

  font-size: 2rem;
  @media (max-width: 460px) {
    font-size: 1.7rem;
  }
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.1rem;
  margin-bottom: 2.1rem;
  > span {
    color: ${({ theme }) => theme.colors.purple600};
  }
`;

const CommentsListWrapper = styled.ul`
  display: flex;
  flex-direction: column;
`;

const CommentInputWrapper = styled.div`
  width: 100%;
  height: 10rem;

  @media (max-width: 400px) {
    height: 12rem;
  }
  display: flex;
  justify-content: space-between;
  gap: 1.8rem;
  label {
    position: relative;
    width: 100%;
    textarea {
      resize: none;
      border: none;
      padding: 2rem;
      width: 100%;
      height: 100%;
      border-radius: 0.4rem;
      background: ${({ theme }) => theme.colors.gray100};

      font-size: 1.6rem;
      @media (max-width: 460px) {
        font-size: 1.3rem;
      }
      font-style: normal;
      font-weight: 300;
      letter-spacing: -0.08rem;
    }
  }
`;

const CommentButton = styled.button`
  cursor: pointer;
  border: none;
  padding: 0 2rem;
  height: 10rem;

  @media (max-width: 400px) {
    height: 12rem;
    padding: 0 1rem;
  }
  border-radius: 0.4rem;
  background: ${({ theme }) => theme.colors.purple600};
  color: ${({ theme }) => theme.colors.gray50};
  text-align: center;

  font-size: 1.6rem;
  @media (max-width: 460px) {
    font-size: 1.3rem;
  }
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.08rem;
`;
