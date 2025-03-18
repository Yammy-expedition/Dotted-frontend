import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Carousel from '@/components/MainPage/Carousel';
import Tips from '@/components/MainPage/Tips';
import { lazy } from 'react';
import { LoginModal } from '@/components/common/ProtectedRoute';
import useModal from '@/hooks/Mainpage/useModal';
import useHandleNavigation from '@/hooks/Mainpage/useHandleNavigation';

const CommunityMiniBoard = lazy(
  () => import('@/components/MainPage/CommunityMiniBoard')
);
const MarketMiniBoard = lazy(
  () => import('@/components/MainPage/MarketMiniBoard')
);

export default function MainPage() {
  const { modalOpen, openModal, closeModal } = useModal();
  const handleClick = useHandleNavigation(openModal);

  return (
    <Main>
      <Wrapper>
        <Carousel />
        <Tips />
        <MiniBoardWrapper>
          <CommunityMiniBoard onItemClick={handleClick} />
          <MarketMiniBoard onItemClick={handleClick} />
        </MiniBoardWrapper>
        {modalOpen && <LoginModal closeModal={closeModal} />}
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
