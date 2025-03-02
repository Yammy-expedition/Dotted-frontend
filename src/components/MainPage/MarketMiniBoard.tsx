import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { formatRelativeTime } from '@/utils/formatTime';
import { EachMarketPost, MarketPost } from '@/types/MarketPost';

interface MarketMiniBoardProps {
  onItemClick: (path: string) => void;
}

async function fetchMarketPosts(): Promise<EachMarketPost[]> {
  const url = new URL(`${import.meta.env.VITE_API_DOMAIN}/api/posting/market`);
  const response = await fetch(url.toString(), { method: 'GET' });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = (await response.json()) as MarketPost;
  return data.results;
}

export default function MarketMiniBoard({ onItemClick }: MarketMiniBoardProps) {
  const { data } = useQuery<EachMarketPost[]>({
    queryKey: ['marketPost'],
    queryFn: fetchMarketPosts
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [uglyZone, setUglyZone] = useState(
    window.innerWidth < 1150 && window.innerWidth >= 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setUglyZone(window.innerWidth < 1150 && window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 조건에 따라 보여줄 아이템 개수를 결정 (모바일, 태블릿 등)
  const maxItems = isMobile ? 4 : uglyZone ? 2 : 3;

  return (
    <MiniMarket>
      <Title>
        <span>Market</span>
        <span onClick={() => onItemClick('/market')}>+ more</span>
      </Title>
      <MarketListContainer>
        <ul>
          {data
            ?.filter((_, idx) => idx < maxItems)
            .map((post) => {
              const status = post.status
                .toLocaleLowerCase()
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              return (
                <li
                  key={post.id}
                  onClick={() => onItemClick(`market/detail/${post.id}`)}
                >
                  <Tag
                    className={`${post.status === 'FOR_SALE' ? 'onSale' : 'soldOut'}`}
                  >
                    {status}
                  </Tag>
                  <MarketImageWrapper>
                    <img src={post.thumbnail} alt={post.title} />
                  </MarketImageWrapper>
                  <ItemInfo>
                    <div className="title">
                      <span>{post.title}</span>
                    </div>
                    <div>
                      <span className="price">
                        ₩{' '}
                        {post.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </span>
                      <span className="created">
                        {formatRelativeTime(post.created_at)}
                      </span>
                    </div>
                  </ItemInfo>
                </li>
              );
            })}
        </ul>
      </MarketListContainer>
    </MiniMarket>
  );
}

// styled components
const MiniMarket = styled.div`
  width: 100%;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
  height: 4.7rem;
  align-items: center;
  > span {
    color: ${({ theme }) => theme.colors.gray700};
    font-size: 24px;
    font-weight: 500;
    letter-spacing: -1.2px;
    &:last-child {
      cursor: pointer;
      color: ${({ theme }) => theme.colors.gray500};
      font-size: 20px;
      font-weight: 300;
      letter-spacing: -1px;
    }
  }
`;

const MarketListContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: baseline;
  > ul {
    margin-top: 2rem;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20%, auto));
    grid-gap: 2rem;
    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 47.5%);
      margin-top: 0;
    }
    > li {
      max-width: 100%;
      position: relative;
      cursor: pointer;
      aspect-ratio: 0.7;
      display: flex;
      flex-direction: column;
      border-radius: 16px;
      border: 1px solid ${({ theme }) => theme.colors.backgroundBase};
      background: ${({ theme }) => theme.colors.backgroundLayer2};
    }
  }
`;

const Tag = styled.div`
  z-index: 10;
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 8.6rem;
  background-color: ${({ theme }) => theme.colors.purple600};
  color: ${({ theme }) => theme.colors.gray50};
  text-align: center;
  font-size: 1.4rem;
  padding: 0.25rem 1rem;
  border-radius: 1.6rem;
  &.onSale {
    background: ${({ theme }) => theme.colors.purple600};
  }
  &.soldOut {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.gray500};
    font-weight: 600;
  }
`;

const MarketImageWrapper = styled.div`
  width: 100%;
  height: 70%;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px 16px 0 0;
    transition: transform 0.2s ease-in-out;
    transform-origin: center;
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        transform: scale(1.1);
      }
    }
  }
  @media (max-width: 768px) {
    border-radius: 1rem 1rem 0 0;
    > img {
      border-radius: 1rem 1rem 0 0;
    }
  }
`;

const ItemInfo = styled.div`
  padding: 1rem 2rem 1.2rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.2rem;
  > div {
    display: flex;
    justify-content: space-between;
    &.title {
      > span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: ${({ theme }) => theme.colors.gray700};
        font-size: 20px;
        font-weight: 600;
        letter-spacing: -1px;
        line-height: 2;
      }
    }
  }
  > span {
    line-height: 3rem;
    &:nth-child(2) {
      color: ${({ theme }) => theme.colors.gray400};
      font-size: 16px;
      font-weight: 400;
    }
  }
`;
