import styled from 'styled-components';

import SogangMap from '@/assets/svg/MainPage/SogangMap.svg?react';
import Restaurant from '@/assets/svg/MainPage/Restaurant.svg?react';
import Hospital from '@/assets/svg/MainPage/Hospital.svg?react';
import FAQ from '@/assets/svg/MainPage/FAQ.svg?react';
import Clubs from '@/assets/svg/MainPage/Clubs.svg?react';
import Culture from '@/assets/svg/MainPage/Culture.svg?react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LoginModal } from '../common/ProtectedRoute';
// import { useTranslation } from 'react-i18next';

export default function Tips() {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  // const { t } = useTranslation();
  const isLogined = () => {
    return !!localStorage.getItem('accessToken');
  };
  const handleTipClick = (path: string) => {
    if (!isLogined()) {
      setModalOpen(true);
    } else {
      navigate(path);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <TipsWrapper>
      {/* <Title>{t('main.tips.title')}</Title> */}
      <Title>Tips for Sogang</Title>
      <Contents>
        <Item onClick={() => handleTipClick('/tips/sogang-map')}>
          <SogangMap />
          {/* <span>{t('main.tips.sogangmap')}</span> */}
          <span>Sogang map</span>
        </Item>
        <Item onClick={() => handleTipClick('/tips/restaurant')}>
          <Restaurant />
          {/* <span>{t('main.tips.restaurant')}</span> */}
          <span>Restaurant</span>
        </Item>
        <Item onClick={() => handleTipClick('/tips/hospital')}>
          <Hospital />
          {/* <span>{t('main.tips.hospital')}</span> */}
          <span>Hospital</span>
        </Item>
        <Item onClick={() => handleTipClick('/tips/faq')}>
          <FAQ />
          {/* <span>{t('main.tips.faq')}</span> */}
          <span>FAQ</span>
        </Item>
        <Item onClick={() => handleTipClick('/tips/clubs')}>
          <Clubs />
          {/* <span>{t('main.tips.clubs')}</span> */}
          <span>Clubs</span>
        </Item>
        <Item onClick={() => handleTipClick('/tips/culture')}>
          <Culture />
          {/* <span>{t('main.tips.culture')}</span> */}
          <span>Culture</span>
        </Item>
      </Contents>
      {modalOpen && <LoginModal closeModal={closeModal} />}
    </TipsWrapper>
  );
}

const TipsWrapper = styled.section`
  margin-bottom: 2rem;
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.gray700};
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 21px;
  letter-spacing: -1.2px;
  margin-bottom: 4.2rem;
  @media (max-width: 700px) {
    font-size: 1.8rem;
    letter-spacing: -0.8px;
    margin-bottom: 2.2rem;
    font-weight: 600;
  }
`;

const Contents = styled.nav`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(10rem, 1fr)
  ); /*  유동적인 열 설정 */
  justify-content: center;
  gap: 3.8rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr); /*  화면이 줄어들면 3개씩 */
    padding: 0 4rem;
  }

  @media (max-width: 500px) {
    grid-template-columns: repeat(3, 1fr); /*  더 줄어들면 2개씩 */
    padding: 0 2rem;
  }
`;

const Item = styled.div`
  border-radius: 100%;
  cursor: pointer;
  display: flex;
  gap: 2.4rem;
  flex-direction: column;
  align-items: center;
  @media (max-width: 500px) {
    gap: 1.2rem;
  }
  > span {
    color: ${({ theme }) => theme.colors.gray600};
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 21px; /* 131.25% */
    letter-spacing: -0.8px;
    @media (max-width: 500px) {
      font-size: 1.2rem;
      letter-spacing: -0.2px;
    }
  }

  svg {
    width: 4rem;
    height: 4rem;
  }
`;
