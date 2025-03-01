import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface HeaderNavProps {
  setHoveredTab: (value: string) => void;
}

export default function HeaderNav({ setHoveredTab }: HeaderNavProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const path = pathname.split('/')[1];

  const NavList = [
    { name: 'ABOUT', defaultLink: '/about/notice' },
    { name: 'TIPS', defaultLink: '/tips/restaurant' },
    { name: 'COMMUNITY', defaultLink: '/community' },
    { name: 'MARKET', defaultLink: '/market' }
  ];

  function handleMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
    setHoveredTab(e.currentTarget.innerText);
  }

  return (
    <NavWrapper>
      {NavList.map((nav, idx) => (
        <div
          key={idx}
          className={path === nav.name.toLowerCase() ? 'selected' : ''}
          onMouseEnter={handleMouseEnter}
          onClick={() => navigate(nav.defaultLink)}
        >
          {nav.name}
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
    padding: 1.5rem 7.7rem 1.5rem 7.7rem;
  }

  @media (max-width: 700px) {
    padding-right: 2rem;
    padding-left: 2em;
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
