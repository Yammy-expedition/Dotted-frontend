// import Community from '@/components/about/onboarding/Community';
// import LastSection from '@/components/about/onboarding/LastSection';
// import Market from '@/components/about/onboarding/Market';
// import TipsForSogang from '@/components/about/onboarding/TipsForSogang';
// import WhatIsDotted from '@/components/about/onboarding/WhatIsDotted';
// import WhyCreated from '@/components/about/onboarding/WhyCreated';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function OnboardingPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  return (
    <Main>
      {loading && (
        <Loading>
          <ImgWrapper>
            <img src="/logo-motion.gif" alt="Logo Animation" />
          </ImgWrapper>
          <div>Loading...</div>
        </Loading>
      )}
      {/* <WhatIsDotted />
      <WhyCreated />
      <TipsForSogang />
      <Market />
      <Community />
      <LastSection /> */}
      <img src="https://i.imgur.com/p45tOxE.png" alt="onboarding" />
    </Main>
  );
}
const Main = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 5rem 0;
  position: relative;
`;

const Loading = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundLayer2};
`;

const ImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 10rem 0 3rem 0;
  img {
    width: 5rem;
  }
`;
