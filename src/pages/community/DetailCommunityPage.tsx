import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Posting from '@/components/CommunityPage/Posting';
import CommentSection from '@/components/CommunityPage/CommentSection';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import { fetchWithAuth } from '@/utils/auth'; // auth.ts 경로에 맞게 수정

// -------------------- 타입 정의 --------------------
export interface PostImage {
  id: number;
  post: number; // post_id (FK)
  image_url: string;
  blob_name: string;
  order: number;
}

export interface PostDetail {
  id: number;
  writer_id: string;
  writer_nickname: string;
  tag: string;
  created_at: string;
  title: string;
  content: string;
  images: PostImage[]; // 이미지 배열
  comments: Comment[]; // 댓글 목록 (구조에 따라 수정 가능)
  view_count: number;
  like_count: number;
  scrap_count: number;
  comment_count: number;
  is_mine: boolean;
  is_liked: boolean;
  is_scrapped: boolean;
}

export interface Comment {
  content: string;
  id: number;
  created_at: string;
  is_deleted: boolean;
  is_liked: boolean;
  is_mine: boolean;
  is_secret: boolean;
  like_count: number;
  parent: null;
  post: number;
  replies: Comment[];
  root_parent: number;
  user_id: number;
  user_nickname: string;
}

export default function DetailCommunityPage() {
  const { id } = useParams();
  const postId = Number(id);
  const [isLiked, setIsLiked] = useState(false);
  const [isScraped, setIsScraped] = useState(false);
  const queryClient = useQueryClient();

  // 게시글 상세 조회 API (fetchWithAuth 적용)
  const {
    data: post,
    isLoading,
    isError
  } = useSuspenseQuery<PostDetail, Error>({
    queryKey: ['postDetail', postId],
    queryFn: () =>
      fetchWithAuth<PostDetail>(
        `${import.meta.env.VITE_API_DOMAIN}/api/posting/${postId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
  });

  useEffect(() => {
    if (post) {
      setIsLiked(post.is_liked);
      setIsScraped(post.is_scrapped);
    }
  }, [post]);

  // 좋아요 Mutation (fetchWithAuth 적용)
  const likeMutation = useMutation({
    mutationFn: async () => {
      return await fetchWithAuth<any>(
        `${import.meta.env.VITE_API_DOMAIN}/api/posting/${id}/like`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        }
      );
    },
    onSuccess: (data) => {
      setIsLiked(data.is_liked);

      queryClient.setQueryData<PostDetail>(
        ['postDetail', postId],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            is_liked: data.is_liked,
            like_count: oldData.like_count + (data.is_liked ? 1 : -1)
          };
        }
      );
    },
    onError: (error: any) => {
      console.error(`Error: ${error.message}`);
    }
  });

  // 스크랩 Mutation (fetchWithAuth 적용)
  const scrapMutation = useMutation({
    mutationFn: async () => {
      return await fetchWithAuth<any>(
        `${import.meta.env.VITE_API_DOMAIN}/api/posting/${id}/scrap`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        }
      );
    },
    onSuccess: (data) => {
      setIsScraped(data.is_scrapped);
      queryClient.setQueryData<PostDetail>(
        ['postDetail', postId],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            is_scrapped: data.is_scrapped,
            scrap_count: oldData.scrap_count + (data.is_scrapped ? 1 : -1)
          };
        }
      );
    },
    onError: (error: any) => {
      console.error(`Error: ${error.message}`);
    }
  });

  const onClickLike = () => {
    setIsLiked(!isLiked);
    likeMutation.mutate();
  };

  const onClickScrap = () => {
    setIsScraped(!isScraped);
    scrapMutation.mutate();
  };

  if (isLoading) {
    return <div style={{ minHeight: '116rem' }} />;
  }

  if (isError || !post) {
    return <div style={{ minHeight: '116rem' }} />;
  }

  return (
    <DetailCommunityPageContainer>
      <Wrapper>
        <Posting
          post={post}
          isLiked={isLiked}
          isScraped={isScraped}
          onClickLike={onClickLike}
          onClickScrap={onClickScrap}
        />
        <CommentSection post={post} />
      </Wrapper>
    </DetailCommunityPageContainer>
  );
}

// -------------------- 스타일 컴포넌트 --------------------
const DetailCommunityPageContainer = styled.div`
  min-height: 116rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1287px;
  margin-top: 5.7rem;
  padding: 0 23rem;

  @media (max-width: 1200px) {
    padding: 0 7.7rem;
  }

  @media (max-width: 700px) {
    padding: 0 2rem;
  }
`;

// const OtherPostWrapper = styled.div`
//   margin-bottom: 9rem;
// `;

// const Text = tyled.div`
//   padding: 1.5rem;
//   color: ${({ theme }) => theme.colors.purple600};
//   font-size: 2rem;
//   font-style: normal;
//   font-weight: 600;
//   line-height: normal;
//   letter-spacing: -0.1rem;
//   border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
// `;

// const PaginationBox = styled.div`
//   width: 100%;
//   padding: 5rem 0;
//   display: flex;
//   justify-content: center;
//   gap: 1.5rem;

//   button {
//     width: 3.1rem;
//     height: 3.1rem;
//     border-radius: 50%;
//     border: none;
//     background: none;
//     font-size: 1.6rem;
//     font-weight: 400;

//     &.selected {
//       background-color: ${({ theme }) => theme.colors.purple600};
//       color: ${({ theme }) => theme.colors.gray50};
//     }

//     &:hover {
//       background-color: ${({ theme }) => theme.colors.backgroundBase};
//       cursor: pointer;
//     }
//   }
// `;
