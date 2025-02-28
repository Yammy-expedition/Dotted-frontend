import RestaurantList from '@/components/tips/restaurant/RestaurantList';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import Left from '@/assets/svg/tips/hospital/left.svg?react';
import Right from '@/assets/svg/tips/hospital/right.svg?react';

const restaurantTabs = [
  'All',
  'Korean',
  'Chinese',
  'Japanese',
  'Western',
  'Others'
];

export default function RestaurantPage() {
  const [searchParam, setSearchParam] = useSearchParams();
  const navRef = useRef<HTMLElement | null>(null);

  function handleTabClick(tab: string) {
    setSearchParam({ q: tab.toLowerCase() });
  }

  useEffect(() => {
    setSearchParam({ q: 'all' });
  }, []);

  const scrollLeft = () => {
    if (navRef.current) {
      navRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (navRef.current) {
      navRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <Main>
      <HeaderSection>
        <ScrollNavWrapper>
          <LeftButton onClick={scrollLeft}>
            <Left />
          </LeftButton>
          <Nav ref={navRef}>
            {restaurantTabs.map((tab, idx) => (
              <Tab
                key={idx}
                className={
                  searchParam.get('q') === tab.toLowerCase() ? 'selected' : ''
                }
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </Tab>
            ))}
          </Nav>
          <RightButton onClick={scrollRight}>
            <Right />
          </RightButton>
        </ScrollNavWrapper>
        <InfoText>
          <p>
            Dotted has no connection with the company listed in the service.
          </p>
        </InfoText>
      </HeaderSection>
      <RestaurantList />
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  padding: 5rem 18rem 2.6rem 18rem;
  display: flex;
  flex-direction: column;

  @media (max-width: 1100px) {
    padding-right: 8rem;
    padding-left: 8rem;
  }
  @media (max-width: 900px) {
    padding-right: 5rem;
    padding-left: 5rem;
  }
  @media (max-width: 700px) {
    padding-right: 2rem;
    padding-left: 2rem;
  }
`;

const HeaderSection = styled.section`
  width: 100%;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScrollNavWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

// 좌우 버튼은 830px 이하에서만 보이도록 처리합니다.
const LeftButton = styled.div`
  cursor: pointer;
  display: none;
  align-items: center;
  padding: 0 1rem;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.8;
    }
  }

  @media (max-width: 830px) {
    display: flex;
    padding-left: 0;
  }
`;

const RightButton = styled.div`
  cursor: pointer;
  display: none;
  align-items: center;
  padding: 0 1rem;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.8;
    }
  }

  @media (max-width: 830px) {
    display: flex;
    padding-right: 0;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.2rem;
  padding: 1.6rem 0;
  flex-wrap: nowrap;
  justify-content: center;

  @media (max-width: 830px) {
    overflow-x: auto;

    & > * {
      flex-shrink: 0;
    }
    justify-content: flex-start;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.span`
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: -0.75px;
  color: ${({ theme }) => theme.colors.gray500};
  padding: 0.7rem 3.2rem;
  border-radius: 2.4rem;
  background-color: ${({ theme }) => theme.colors.gray200};
  cursor: pointer;
  white-space: nowrap;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray300};
    }
  }

  &.selected {
    background-color: ${({ theme }) => theme.colors.purple600};
    color: ${({ theme }) => theme.colors.gray50};
  }
`;

const InfoText = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0;

  > p {
    text-align: center;
    font-size: 1.4rem;
    font-weight: 300;
    letter-spacing: -0.42px;
    color: ${({ theme }) => theme.colors.gray400};
  }
`;
