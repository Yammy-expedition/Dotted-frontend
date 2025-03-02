import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Carousel from '@/components/MainPage/Carousel';
import Tips from '@/components/MainPage/Tips';
import { useNavigate } from 'react-router-dom';
import { CommunityPost, EachPost } from '@/types/CommunityPost';
import { EachMarketPost, MarketPost } from '@/types/MarketPost';
import { lazy, useState } from 'react';
import { LoginModal } from '@/components/common/ProtectedRoute';

const CommunityMiniBoard = lazy(
  () => import('@/components/MainPage/CommunityMiniBoard')
);
const MarketMiniBoard = lazy(
  () => import('@/components/MainPage/MarketMiniBoard')
);

export default function MainPage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const isLogined = () => {
    return !!localStorage.getItem('accessToken');
  };
  const handleClick = (path: string) => {
    // console.log('path', path);

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
          <CommunityMiniBoard onItemClick={handleClick} />
          <MarketMiniBoard onItemClick={handleClick} />
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
