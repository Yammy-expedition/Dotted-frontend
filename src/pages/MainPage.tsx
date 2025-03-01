import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Carousel from '@/components/MainPage/Carousel';
import Tips from '@/components/MainPage/Tips';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { formatRelativeTime } from '@/utils/formatTime';
import { CommunityPost, EachPost } from '@/types/CommunityPost';
import { EachMarketPost, MarketPost } from '@/types/MarketPost';
import { useEffect, useState } from 'react';
import { LoginModal } from '@/components/common/ProtectedRoute';
import QuoteIcon from '@/assets/svg/MainPage/Quote.svg?react';
async function fetchCommunityPosts(): Promise<EachPost[]> {
  const url = new URL(`${import.meta.env.VITE_API_DOMAIN}/api/posting`);

  const response = await fetch(url.toString(), { method: 'GET' });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = (await response.json()) as CommunityPost;
  console.log(data);
  return data.results;
}

async function fetchMarketPosts(): Promise<EachMarketPost[]> {
  const url = new URL(`${import.meta.env.VITE_API_DOMAIN}/api/posting/market`);

  const response = await fetch(url.toString(), { method: 'GET' });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = (await response.json()) as MarketPost;
  console.log(data);
  return data.results;
}

export default function MainPage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: onePageCommuData } = useQuery<EachPost[]>({
    queryKey: ['commuPost'],
    queryFn: () => fetchCommunityPosts()
  });

  const { data: onePageMarketData } = useQuery<EachMarketPost[]>({
    queryKey: ['marketPost'],
    queryFn: () => fetchMarketPosts()
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
  const isLogined = () => {
    return !!localStorage.getItem('accessToken');
  };
  const handleClick = (path: string) => {
    console.log('path', path);

    if (!isLogined()) {
      setModalOpen(true);
    } else {
      navigate(path);
    }
  };
  return (
    <Main>
      <Wrapper>
        <Carousel />

        <Tips />

        <MiniBoardWrapper>
          <MiniCommunity>
            <Title>
              <span>Community</span>
              <span onClick={() => handleClick('/community')}>+ more</span>
            </Title>
            <CommunityList>
              <ul>
                {onePageCommuData?.map((item, idx) => {
                  if (idx > 4) return null;
                  return (
                    <li
                      key={idx}
                      onClick={() => handleClick(`community/detail/${item.id}`)}
                    >
                      <span>
                        <QuoteIcon /> {item.title}
                      </span>
                      <span>{formatRelativeTime(item.created_at)}</span>
                    </li>
                  );
                })}
              </ul>
            </CommunityList>
          </MiniCommunity>

          <MiniMarket>
            <Title>
              <span>Market</span>
              <span onClick={() => handleClick('/market')}>+ more</span>
            </Title>
            <MarketListContainer>
              <ul>
                {onePageMarketData?.map((post, idx) => {
                  if (idx > (isMobile ? 3 : uglyZone ? 1 : 2)) return null;
                  const status = post.status
                    .toLocaleLowerCase()
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                  console.log(status);
                  return (
                    <li
                      key={post.id}
                      onClick={() => handleClick(`market/detail/${post.id}`)}
                    >
                      <Tag
                        className={`${post.status === 'FOR_SALE' ? 'onSale' : 'soldOut'}`}
                      >
                        {status}
                      </Tag>
                      <MarketImageWrapper>
                        <img src={post.thumbnail} />
                      </MarketImageWrapper>
                      <ItemInfo>
                        <div className="title">
                          <span>{post.title}</span>
                        </div>

                        <div>
                          <span className="price">₩ {post.price}</span>
                          <span className=" created">
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
        </MiniBoardWrapper>
        {modalOpen && <LoginModal setModalOpen={setModalOpen} />}
      </Wrapper>
    </Main>
  );
}

const Main = styled.main`
  padding: 4.8rem 7.7rem 0rem 7.7rem;
  width: 100%;
  display: flex;
  flex-direction: column;

  align-items: center;
  margin-bottom: 13.9rem;

  @media (max-width: 900px) {
    padding-left: 5rem;
    padding-right: 5rem;
  }

  @media (max-width: 700px) {
    padding: 0rem 2rem 0rem 2rem;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1287px;
  display: flex;
  flex-direction: column;
  gap: 6.5rem;
  @media (max-width: 700px) {
    gap: 3.5rem;
  }
`;

const MiniBoardWrapper = styled.section`
  width: 100%;
  display: flex;
  gap: 3.6rem;

  @media (max-width: 865px) {
    flex-direction: column;
  }
`;

const MiniCommunity = styled.div`
  width: 100%;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
  @media (max-width: 865px) {
    padding: 0 0.2rem;
  }
  height: 4.7rem;
  align-items: center;
  > span {
    color: ${({ theme }) => theme.colors.gray700};
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 21px; /* 87.5% */
    letter-spacing: -1.2px;
    @media (max-width: 700px) {
      font-size: 1.8rem;
      font-weight: 600;
      letter-spacing: -0.8px;
    }
    &:last-child {
      cursor: pointer;
      color: ${({ theme }) => theme.colors.gray500};
      font-size: 20px;
      font-weight: 300;
      letter-spacing: -1px;
      @media (max-width: 700px) {
        font-size: 1.6rem;
      }
    }
  }
`;

const MiniMarket = styled.div`
  width: 100%;
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
      @media (max-width: 865px) {
        height: 4.4rem;
        padding: 0 1.5rem;
      }

      &:not(:last-child) {
        border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
      }

      > span {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: ${({ theme }) => theme.colors.gray700};
        font-size: 2rem;
        svg {
          width: 1.4rem;
          height: 1.4rem;
          stroke: ${({ theme }) => theme.colors.gray600};
        }
        @media (max-width: 865px) {
          font-size: 1.6rem;
          svg {
            width: 1.2rem;
            height: 1.2rem;
          }
        }
        font-style: normal;
        font-weight: 400;
        line-height: 21px; /* 105% */
        letter-spacing: -0.4px;

        &:last-child {
          color: ${({ theme }) => theme.colors.gray400};
          font-size: 1.6rem;
          @media (max-width: 865px) {
            font-size: 1.3rem;
          }
          font-weight: 400;
          letter-spacing: -0.8px;
        }
      }
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
  @media (max-width: 865px) {
    font-size: 1.2rem;
    width: 8rem;
  }
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.07rem;
  padding: 0.25rem 1rem;
  border-radius: 1.6rem;

  &.onSale {
    background: ${({ theme }) => theme.colors.purple600};
    color: ${({ theme }) => theme.colors.gray50};
  }

  &.soldOut {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.gray500};
    font-weight: 600;
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
    flex: 1;
    grid-template-columns: repeat(auto-fit, minmax(20%, auto));
    grid-gap: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 47.5%);
      margin-top: 0em;
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
      @media (max-width: 768px) {
        border-radius: 1rem;
      }
    }
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
    object-fit: cover; /* 비율을 유지하면서 꽉 채움 */
    border-radius: 16px 16px 0 0;
    transition: transform 0.2s ease-in-out;
    transform-origin: center; /* 중심을 기준으로 확대 */ /* 부모와 동일한 border-radius 적용 */

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
  align-items: stretch;
  gap: 1.2rem;
  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.6rem;
  }
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
        font-style: normal;
        font-weight: 600;
        letter-spacing: -1px;
        line-height: 2;
        @media (max-width: 768px) {
          font-size: 1.6rem;
        }
      }
    }

    > span {
      &.price {
        color: ${({ theme }) => theme.colors.gray700};
        font-size: 1.4rem;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: -0.07rem;
        @media (max-width: 768px) {
          font-size: 1.3rem;
        }
      }

      &.created {
        color: ${({ theme }) => theme.colors.gray400};
        font-size: 1.4rem;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.07rem;
        @media (max-width: 768px) {
          font-size: 1.3rem;
        }
      }
    }
  }
  > span {
    line-height: 3rem;

    &:nth-child(2) {
      color: ${({ theme }) => theme.colors.gray400};

      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 21px; /* 131.25% */
      letter-spacing: -0.8px;
    }
  }
`;
