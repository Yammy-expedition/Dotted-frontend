import { SubHeaderAnimation } from '@/animations/framer-motion/SubHeaderAnimation';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

interface SubHeaderProps {
  hoveredTab: string;
}

const aboutsubs = [
  { title: 'What is Dotted?', link: '/about/onboarding' },
  { title: 'Notice', link: '/about/notice' }
];

const tipssubs = [
  { title: 'Sogang Map', link: '/tips/sogang-map' },
  { title: 'Restaurant', link: '/tips/restaurant' },
  { title: 'Hospital', link: '/tips/hospital' },
  { title: 'FAQ', link: '/tips/faq' },
  { title: 'Clubs', link: '/tips/clubs' },
  { title: 'Culture', link: '/tips/culture' }
];

export default function SubHeader({ hoveredTab }: SubHeaderProps) {
  const { pathname } = useLocation();
  console.log(hoveredTab);

  //location이 tips나 about일 때만 subheader를 보여줌
  const handlePathname = (pathname: string) => {
    if (
      pathname.split('/')[1] === 'tips' ||
      pathname.split('/')[1] === 'about'
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <AnimatePresence>
      {(hoveredTab === 'ABOUT' ||
        hoveredTab === 'TIPS' ||
        (handlePathname(pathname) &&
          hoveredTab !== 'COMMUNITY' &&
          hoveredTab !== 'MARKET')) && (
        <SubHeaderWrapper {...SubHeaderAnimation}>
          {hoveredTab === 'ABOUT' || pathname.includes('about') ? (
            <>
              {aboutsubs.map((sub, idx) => (
                <SubElement key={idx}>
                  <a
                    className={pathname === sub.link ? 'selected' : ''}
                    href={sub.link}
                  >
                    {sub.title}
                  </a>
                  <p>•</p>
                </SubElement>
              ))}
            </>
          ) : (
            <>
              {tipssubs.map((sub, idx) => (
                <SubElement key={idx}>
                  <a
                    className={pathname === sub.link ? 'selected' : ''}
                    href={sub.link}
                  >
                    {sub.title}
                  </a>
                  <p>•</p>
                </SubElement>
              ))}
            </>
          )}
        </SubHeaderWrapper>
      )}
    </AnimatePresence>
  );
}

const SubHeaderWrapper = styled(motion.div)`
  width: 100%;
  max-width: 1287px;
  height: 5rem;
  background-color: ${({ theme }) => theme.colors.backgroundLayer2};

  display: flex;
  align-items: center;
  overflow-x: auto;
  padding: 0 7.7rem;

  @media (max-width: 900px) {
    padding-left: 0rem;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const SubElement = styled.div`
  display: flex;
  align-items: center;

  > a {
    white-space: nowrap;
    color: ${({ theme }) => theme.colors.gray500};
    text-decoration: none;
    font-size: 1.4rem;
    font-weight: 500;
    line-height: 2.1rem;
    letter-spacing: -0.8px;

    &.selected {
      color: ${({ theme }) => theme.colors.purple600};
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        color: ${({ theme }) => theme.colors.purple600};
      }
    }
  }

  > p {
    color: ${({ theme }) => theme.colors.gray500};
    font-size: 1.4rem;
    line-height: 2.1rem;
    letter-spacing: -0.8px;
    margin: 0 1.9rem;

    @media (max-width: 480px) {
      margin: 0.2rem 1rem;
    }
  }

  &:last-child > p {
    display: none;
  }
`;
