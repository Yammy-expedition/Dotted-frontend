import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { formatRelativeTime } from '@/utils/formatTime';
import { CommunityPost, EachPost } from '@/types/CommunityPost';
import QuoteIcon from '@/assets/svg/MainPage/Quote.svg?react';

interface CommunityMiniBoardProps {
  onItemClick: (path: string) => void;
}

async function fetchCommunityPosts(): Promise<EachPost[]> {
  const url = new URL(`${import.meta.env.VITE_API_DOMAIN}/api/posting`);
  const response = await fetch(url.toString(), { method: 'GET' });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = (await response.json()) as CommunityPost;
  return data.results;
}

export default function CommunityMiniBoard({
  onItemClick
}: CommunityMiniBoardProps) {
  const { data } = useQuery<EachPost[]>({
    queryKey: ['commuPost'],
    queryFn: fetchCommunityPosts
  });

  return (
    <MiniCommunity>
      <Title>
        <span>Community</span>
        <span onClick={() => onItemClick('/community')}>+ more</span>
      </Title>
      <CommunityList>
        <ul>
          {data?.slice(0, 5).map((item, idx) => (
            <li
              key={idx}
              onClick={() => onItemClick(`community/detail/${item.id}`)}
            >
              <span>
                <QuoteIcon /> <span className="title">{item.title}</span>
              </span>
              <span>{formatRelativeTime(item.created_at)}</span>
            </li>
          ))}
        </ul>
      </CommunityList>
    </MiniCommunity>
  );
}

// styled components
const MiniCommunity = styled.div`
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

const CommunityList = styled.div`
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.backgroundLayer1};
  width: 100%;
  > ul {
    width: 100%;
    > li {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 5.4rem;
      padding: 0 2rem;
      &:not(:last-child) {
        border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
      }

      > span {
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: flex;
        align-items: center;
        gap: 1rem;
        color: ${({ theme }) => theme.colors.gray700};
        font-size: 2rem;

        > span {
          &.title {
            flex: 1;
            min-width: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        svg {
          width: 1.4rem;
          height: 1.4rem;
          stroke: ${({ theme }) => theme.colors.gray600};
        }
        &:last-child {
          color: ${({ theme }) => theme.colors.gray400};
          font-size: 1.6rem;
          font-weight: 400;
          letter-spacing: -0.8px;
        }

        &:last-child {
          display: flex;
          justify-content: end;
          width: 7rem;
          line-height: 2rem;
        }
      }
    }
  }
`;
