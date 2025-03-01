import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ProfileIcon from '@/assets/svg/mypage/Profilecircle.svg?react';
import { useNavigate } from 'react-router-dom';

interface PostType {
  id: number;
  post_title: string;
  content: string;
  post: number;
  post_type: string;
  is_secret: boolean;
}

export default function CommunityComments() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5; // 페이지당 표시할 게시글 수

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
        // console.log(data.comments);

        const formattedPosts = data.comments.filter(
          (comment: any) => comment.post_type === 'post'
        );
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
          onClick={() => navigate(`/community/detail/${post.post}`)}
          key={post.id}
        >
          <h3>{post.post_title}</h3>
          <p></p>
          <div>
            <ProfileIcon />
            {post.content}
          </div>
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
  flex-direction: column;
  padding: 1.6rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  cursor: pointer;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray100};
    }
  }

  p {
    width: 1px;
    height: 2rem;
    background-color: ${({ theme }) => theme.colors.gray300};
    transform: translateX(1rem);
  }
  h3 {
    color: ${({ theme }) => theme.colors.gray500};
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 4px;
  }
  div {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: ${({ theme }) => theme.colors.gray700};
    font-size: 1.6rem;
    font-weight: 500;
    letter-spacing: -0.4px;
    svg {
      width: 2rem;
      height: 2rem;
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
