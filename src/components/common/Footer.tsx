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
          <a
            href="https://rustic-tulip-dff.notion.site/Privacy-Policy-1a72493912ca808ab6eec4647468fb5c"
            target="_blank"
          >
            Privacy Policy
          </a>
          <a
            href="https://rustic-tulip-dff.notion.site/Terms-of-Service-1a72493912ca80258a20e709cf6b9e27"
            target="_blank"
          >
            Terms of Service
          </a>
        </PolicyWrapper>
      </LeftSection>
      <RightSection>
        <SVGWrapper>
          <a href="https://www.instagram.com/join.dotted/" target="_blank">
            <Instagram />
          </a>
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
  @media (max-width: 700px) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  @media (max-width: 400px) {
    flex-direction: column;
  }
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
  font-size: 4.8rem;
  font-style: normal;
  font-weight: 700;
  line-height: 2.1rem; /* 43.75% */
  letter-spacing: -0.288rem;
  @media (max-width: 700px) {
    font-size: 4rem;
  }
  @media (max-width: 400px) {
    display: none;
  }
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
  > a {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.gray50};
    font-size: 1.4rem;
    font-style: normal;
    font-weight: 300;
    line-height: 2.1rem; /* 131.25% */
    letter-spacing: -0.01rem;
    text-decoration-style: solid;
    text-decoration-skip-ink: auto;
    text-decoration-thickness: auto;
    text-underline-offset: auto;
    text-underline-position: from-font;
    text-decoration-line: none;
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        text-decoration-line: underline;
      }
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
  svg {
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        transform: scale(1.1);
      }
    }
    cursor: pointer;
    transition: transform 0.3s ease;
  }
  display: flex;
  justify-content: center;
  gap: 2rem;

  @media (max-width: 700px) {
    justify-content: end;
  }
  @media (max-width: 400px) {
  }
`;

const ContactWrapper = styled.div`
  @media (max-width: 700px) {
    display: flex;
    justify-content: end;
  }
  > span {
    margin-right: 10rem;
    @media (max-width: 700px) {
      margin: 0;
    }
    color: ${({ theme }) => theme.colors.gray50};

    font-size: 1.4rem;
    font-style: normal;
    font-weight: 300;
    line-height: 2.1rem; /* 150% */
    letter-spacing: -0.01rem;

    &:first-child {
      margin-right: 3rem;
      font-weight: 500;
    }
  }
`;
