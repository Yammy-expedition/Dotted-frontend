import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

interface PostType {
  id: number;
  title: string;
  price: number;
  status: string;
  created_at: string;
  thumbnail: string;
  writer_id: number;
  writer_nickname: string;
}
export default function MarketScraps() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; // 페이지당 표시할 게시글 수

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

        const formattedPosts = data.scrapped_marketposts.map((post: any) => {
          if (post.tag === 'Campus Life') {
            post.tag = 'Campus';
          }
          if (post.status === 'FOR_SALE') {
            post.status = 'For Sale';
          } else if (post.status === 'RESERVED') {
            post.status = 'Reserved';
          } else {
            post.status = 'Sold Out';
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
      <MarketContainer>
        {currentPosts.map((post) => (
          <PostBox
            onClick={() => navigate(`/market/detail/${post.id}`)}
            key={post.id}
          >
            {post.status === 'For Sale' && (
              <Status className="forsale">{post.status}</Status>
            )}
            {post.status !== 'For Sale' && <Status>{post.status}</Status>}
            <figure>
              <img src={post.thumbnail} alt="thumbnail" />
            </figure>
            <Information>
              <h3>{post.title}</h3>
              <span>
                <p>₩ {post.price.toLocaleString()}</p>
                <p>{dayjs(post.created_at).format('YYYY-MM-DD')}</p>
              </span>
            </Information>
          </PostBox>
        ))}
      </MarketContainer>

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

const Section = styled.section``;
const MarketContainer = styled.div`
  padding: 2rem 0rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 1fr 1fr;
  gap: 2.4rem;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 1130px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;
const PostBox = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 1.6rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-rows: 70% 1fr;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  flex-shrink: 0;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray100};
      img {
        scale: 1.1;
      }
    }
  }

  > figure {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: scale 0.3s;
    aspect-ratio: 1.1/1;
  }
  @media (max-width: 768px) {
    grid-template-rows: 1fr;
    grid-template-columns: 30% 1fr;
    height: 10rem;
    > figure {
      height: 10rem;
    }
  }
`;

const Status = styled.div`
  z-index: 4;
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: ${({ theme }) => theme.colors.gray500};
  background-color: ${({ theme }) => theme.colors.gray100};
  padding: 0.4rem 0.8rem;
  border-radius: 1.6rem;
  &.forsale {
    color: ${({ theme }) => theme.colors.gray50};
    background-color: ${({ theme }) => theme.colors.purple600};
  }
`;

const Information = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 100%;
  max-width: 100%;
  h3 {
    width: 100%;
    height: 2rem;
    font-size: 1.6rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.gray700};
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  span {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: space-between;
    p {
      font-size: 1.2rem;
      font-weight: 400;
      color: ${({ theme }) => theme.colors.gray500};
      &:first-child {
        color: ${({ theme }) => theme.colors.gray700};
        font-weight: 600;
      }
      &:last-child {
        display: flex;
        justify-content: flex-end;
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
