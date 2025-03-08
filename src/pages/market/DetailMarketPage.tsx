import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import CommentSection from '@/components/CommunityPage/CommentSection';
import { useMutation, useQuery } from '@tanstack/react-query';
import MarketPosting from '@/components/MarketPage/MarketPosting';
import { fetchPostDetail, scrapPost } from '@/api/marketApi';

// -------------------- 타입 정의 --------------------
export interface MarketPostImage {
  id: number;
  post: number; // post_id (FK)
  image_url: string;
  blob_name: string;
  order: number;
}

export interface MarketPostDetail {
  id: number;
  writer_id: string;
  writer_nickname: string;
  status: string;
  created_at: string;
  title: string;
  content: string;
  price: number;
  images: MarketPostImage[]; // 이미지 배열
  comments: Comment[]; // 댓글 목록 (구조에 따라 수정 가능)
  scrap_count: number;
  comment_count: number;
  is_scrapped: boolean;
  is_mine: boolean;
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

export default function DetailMarketPage() {
  const { id } = useParams();
  const postId = Number(id);
  const [isScraped, setIsScraped] = useState(false);

  // API를 통해 상세 게시글을 가져옴 (fetchPostDetail 사용)
  const {
    data: post,
    isLoading,
    isError
  } = useQuery<MarketPostDetail, Error>({
    queryKey: ['postDetail', postId],
    queryFn: () => fetchPostDetail(postId)
  });

  useEffect(() => {
    if (post) {
      setIsScraped(post.is_scrapped);
    }
  }, [post]);

  // 스크랩 Mutation
  const scrapMutation = useMutation({
    mutationFn: async () => {
      // fetchWithAuth 내부에서 토큰 관리가 수행됨
      return await scrapPost(postId);
    },
    onSuccess: (data) => {
      setIsScraped(data.is_scrapped);
      // query cache 업데이트가 필요하다면 queryClient.invalidateQueries(['postDetail', postId]) 등을 사용
    },
    onError: (error: any) => {
      console.error(`Error: ${error.message}`);
    }
  });

  const onClickScrap = () => {
    // UI 상에서 즉시 스크랩 상태 토글
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
    <DetailMarketPageContainer>
      <Wrapper>
        <MarketPosting
          post={post}
          isScraped={isScraped}
          onClickScrap={onClickScrap}
        />
        <ContentWrapper>{post.content}</ContentWrapper>

        <CommentSection post={post} origin="market" />
      </Wrapper>
    </DetailMarketPageContainer>
  );
}

const DetailMarketPageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled.div`
  max-width: 1287px;
  width: 100%;
  margin-top: 2rem;
  padding: 0 23rem;

  @media (max-width: 1200px) {
    padding: 0 7.7rem;
  }

  @media (max-width: 700px) {
    padding: 0 2rem;
  }
`;

const ContentWrapper = styled.div`
  padding: 2rem 0;
  width: 100%;
  min-height: 12rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
  margin-bottom: 3.2rem;
  color: ${({ theme }) => theme.colors.gray600};
  font-size: 1.8rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.03rem;
`;
