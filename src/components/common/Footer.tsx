import styled from 'styled-components';
import Logo from './Logo';
import Instagram from '@/assets/svg/footer/Instagram.svg?react';
import Mail from '@/assets/svg/footer/Mail.svg?react';

export default function Footer() {
  return (
    <FooterContainer>
      <LeftSection>
        <LogoWrapper>
          <Logo /> Dotted
        </LogoWrapper>

        <PolicyWrapper>
          <span>Privacy Policy</span>
          <span>Terms</span>
        </PolicyWrapper>
      </LeftSection>

      <RightSection>
        <SVGWrapper>
          <Instagram />
          <Mail />
        </SVGWrapper>

        <ContactWrapper>
          <span>Email</span>
          <span>join.dotted@gmail.com</span>
        </ContactWrapper>
      </RightSection>
    </FooterContainer>
  );
}

const FooterContainer = styled.footer`
  width: 100%;
  height: 22.1rem;
  background: ${({ theme }) => theme.colors.purple600};
  padding: 4.6rem 3.4rem 4rem 7rem;
  display: flex;
  justify-content: space-between;
`;

const LeftSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 5rem;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.gray50};
  font-family: Inter;
  font-size: 4.8rem;
  font-style: normal;
  font-weight: 700;
  line-height: 2.1rem; /* 43.75% */
  letter-spacing: -0.288rem;
  > div > svg {
    path {
      stroke: ${({ theme }) => theme.colors.gray50};
    }

    circle {
      stroke: ${({ theme }) => theme.colors.gray50};
      fill: ${({ theme }) => theme.colors.gray50};
    }
  }
`;

const PolicyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  > span {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.gray50};
    font-family: Inter;
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 300;
    line-height: 2.1rem; /* 131.25% */
    letter-spacing: -0.016rem;

    text-decoration-style: solid;
    text-decoration-skip-ink: auto;
    text-decoration-thickness: auto;
    text-underline-offset: auto;
    text-underline-position: from-font;

    &:hover {
      text-decoration-line: underline;
    }
  }
`;

const RightSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
`;

const SVGWrapper = styled.div`
  > svg {
    cursor: pointer;
  }
  display: flex;
  justify-content: center;
  gap: 2rem;
`;

const ContactWrapper = styled.div`
  > span {
    margin-right: 10rem;
    color: ${({ theme }) => theme.colors.gray50};
    font-family: Inter;
    font-size: 1.4rem;
    font-style: normal;
    font-weight: 300;
    line-height: 2.1rem; /* 150% */
    letter-spacing: -0.014rem;

    &:first-child {
      margin-right: 3rem;
      font-weight: 500;
    }
  }
`;
