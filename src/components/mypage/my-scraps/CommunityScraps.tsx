import { useEffect, useState } from 'react';
import styled from 'styled-components';
import EyeIcon from '@/assets/svg/mypage/Eye.svg?react';
import { useNavigate } from 'react-router-dom';
import { formatRelativeTime } from '@/utils/formatTime';

interface PostType {
  id: number;
  title: string;
  comment_count: number;
  created_at: string;
  like_count: number;
  tag: string;
  view_count: number;
  writer_id: number;
  writer_nickname: string;
}

export default function CommunityScraps() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 7; // 페이지당 표시할 게시글 수

  useEffect(() => {
    const fetchProfileData = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      const headers = { Authorization: `Bearer ${accessToken}` };
      const response = await fetch(
        `${import.meta.env.VITE_API_DOMAIN}/api/user/profile`,
        {
          headers,
          credentials: 'include'
        }
      );

      if (response.ok) {
        const data = await response.json();
        const formattedPosts = data.scrapped_posts.map((post: any) => {
          if (post.tag === 'Campus Life') {
            post.tag = 'Campus';
          }
          return post;
        });
        setPosts(formattedPosts);
      }
    };
    fetchProfileData();
  }, []);

  // 현재 페이지에서 보여줄 게시글 계산
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  // 페이지네이션 버튼 범위 계산
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);

  return (
    <Section>
      {currentPosts.map((post) => (
        <PostBox
          onClick={() => navigate(`/community/detail/${post.id}`)}
          key={post.id}
        >
          <Tag className={post.tag}>{post.tag}</Tag>
          <Information>
            <h3>
              {post.title} [{post.comment_count}]
            </h3>
            <div>
              <span>{formatRelativeTime(post.created_at)}</span>
              <span>•</span>
              <span>
                <EyeIcon />
                {post.view_count}
              </span>
            </div>
          </Information>
        </PostBox>
      ))}

      <PaginationBox>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          {'<'}
        </button>

        {Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
          const pageNum = startPage + idx;
          return (
            <button
              key={pageNum}
              className={currentPage === pageNum ? 'selected' : ''}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          {'>'}
        </button>
      </PaginationBox>
    </Section>
  );
}

const Section = styled.section`
  height: 100vh;
`;

const PostBox = styled.div`
  display: flex;
  gap: 1.6rem;
  padding: 1.6rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  cursor: pointer;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray100};
    }
  }
`;

const Tag = styled.div`
  width: 6rem;
  height: 2.4rem;
  color: ${({ theme }) => theme.colors.gray50};
  font-size: 1.3rem;
  font-weight: 500;
  letter-spacing: -0.4px;
  border-radius: 1.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  &.Others {
    background-color: ${({ theme }) => theme.colors.gray400};
  }
  &.Campus {
    background-color: ${({ theme }) => theme.colors.purple450};
  }
  &.Living {
    background-color: ${({ theme }) => theme.colors.purple950};
  }
  &.Travel {
    background-color: ${({ theme }) => theme.colors.purple650};
  }
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  > h3 {
    color: ${({ theme }) => theme.colors.gray700};
    font-size: 1.6rem;
    font-weight: 500;
    letter-spacing: -0.4px;
  }

  > div {
    display: flex;
    gap: 1.2rem;
    margin-top: 0.8rem;
    color: ${({ theme }) => theme.colors.gray400};
    font-size: 1.4rem;
    font-weight: 400;
    letter-spacing: -0.4px;
    > span {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    svg {
      path {
        stroke: ${({ theme }) => theme.colors.gray400};
      }
    }
  }
`;

const PaginationBox = styled.div`
  width: 100%;
  padding: 5rem 0;
  display: flex;
  justify-content: center;
  gap: 1.5rem;

  button {
    width: 3.1rem;
    height: 3.1rem;
    border-radius: 50%;
    border: none;
    background: none;
    font-size: 1.6rem;
    font-weight: 400;
    display: flex;
    justify-content: center;
    align-items: center;
    &.selected {
      background-color: ${({ theme }) => theme.colors.purple600};
      color: ${({ theme }) => theme.colors.gray50};
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background-color: ${({ theme }) => theme.colors.backgroundBase};
        cursor: pointer;
      }
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;
