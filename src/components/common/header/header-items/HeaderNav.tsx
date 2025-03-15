import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface HeaderNavProps {
  setHoveredTab: (value: string) => void;
}

export default function HeaderNav({ setHoveredTab }: HeaderNavProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const path = pathname.split('/')[1];

  const NavList = [
    { name: 'about', defaultLink: '/about/onboarding' },
    { name: 'tips', defaultLink: '/tips/restaurant' },
    { name: 'community', defaultLink: '/community' },
    { name: 'market', defaultLink: '/market' }
  ];
  const navList: Record<string, string> = {
    about: t('header.about'),
    tips: t('header.tips'),
    community: t('header.community'),
    market: t('header.market')
  };

  function handleMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
    setHoveredTab(e.currentTarget.innerText);
  }

  return (
    <NavWrapper>
      {NavList.map((nav, idx) => (
        <div
          key={idx}
          className={path === nav.name ? 'selected' : ''}
          onMouseEnter={handleMouseEnter}
          onClick={() => navigate(nav.defaultLink)}
        >
          {navList[nav.name]}
        </div>
      ))}
    </NavWrapper>
  );
}

const NavWrapper = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.backgroundLayer2};

  @media (max-width: 900px) {
    padding: 1.5rem 0;
  }

  @media (max-width: 700px) {
    padding-bottom: 1.5rem;
  }

  > div {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 2.1rem;
    letter-spacing: -0.48px;
    text-decoration: none;
    color: ${({ theme }) => theme.colors.gray700};
    transition: all ease-in 0.1s;
    cursor: pointer;

    &.selected {
      color: ${({ theme }) => theme.colors.purple600};
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        color: ${({ theme }) => theme.colors.purple600};
      }
    }
  }
`;
