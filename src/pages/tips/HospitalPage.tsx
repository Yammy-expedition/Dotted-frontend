import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import Left from '@/assets/svg/tips/hospital/left.svg?react';
import Right from '@/assets/svg/tips/hospital/right.svg?react';
import Distance from '@/assets/svg/tips/hospital/distance.svg?react';
import Link from '@/assets/svg/tips/hospital/link.svg?react';
import { useHospitals } from '@/hooks/useHospital';

const hospitalTabs = [
  'All',
  'Internal Medicine',
  'Dentistry',
  'Otolaryngology',
  'Dermatology',
  'Orthopedics',
  'General'
];

export default function HospitalPage() {
  const [searchParam, setSearchParam] = useSearchParams();
  const navBarRef = useRef<HTMLElement | null>(null);
  const { data } = useHospitals();

  function handleTabClick(tab: string) {
    setSearchParam({ q: tab.toLowerCase() });
  }

  useEffect(() => {
    setSearchParam({ q: 'all' });
  }, []);

  const scrollLeft = () => {
    if (navBarRef.current) {
      navBarRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (navBarRef.current) {
      navBarRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  // 선택된 탭에 따라 필터링 (All이면 전체, 그 외에는 병원 타입이 일치하는 것만)
  const selectedTab = searchParam.get('q') || 'all';
  const filteredHospitals = data?.filter((hospital) => {
    if (selectedTab === 'all') return true;
    return hospital.type.toLowerCase() === selectedTab;
  });

  return (
    <Main>
      <HeaderSection>
        <LeftButton onClick={scrollLeft}>
          <Left />
        </LeftButton>
        <NavContainer>
          <NaviBar ref={navBarRef}>
            {hospitalTabs.map((tab, idx) => (
              <span
                className={selectedTab === tab.toLowerCase() ? 'selected' : ''}
                onClick={() => handleTabClick(tab)}
                key={idx}
              >
                {tab}
              </span>
            ))}
          </NaviBar>
        </NavContainer>
        <RightButton onClick={scrollRight}>
          <Right />
        </RightButton>
      </HeaderSection>
      <Notice>
        <p>Dotted has no connection with the company listed in the service.</p>
      </Notice>

      <HospitalListWrapper>
        <ul>
          {filteredHospitals?.map((hospital, idx) => {
            return (
              <li key={idx}>
                <span className="hospital_type">{hospital.type}</span>
                <div className="hospital_name">{hospital.name}</div>
                <div className="hospital_distance">
                  <Distance />
                  {hospital.distance}m from School
                </div>
                <div className="hospital_link">
                  <div>
                    <Link />
                    <a href={hospital.naver_map} target="_blank">
                      naver map
                    </a>
                  </div>
                  <div>
                    <Link />
                    <a href={hospital.google_map} target="_blank">
                      google map
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </HospitalListWrapper>
    </Main>
  );
}

const Main = styled.main`
  min-width: 40rem;
  height: 100%;
  @media (max-width: 500px) {
    min-width: 30rem;
  }
  width: 100%;
  min-height: 80rem;
  padding: 5rem 18rem 2.6rem 18rem;
  display: flex;
  flex-direction: column;

  @media (max-width: 1220px) {
    padding-left: 7.7rem;
    padding-right: 7.7rem;
  }

  @media (max-width: 700px) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`;

const NavContainer = styled.div`
  flex: 1;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const NaviBar = styled.nav`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.6rem 0;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  > span {
    white-space: nowrap;
    font-size: 1.5rem;
    font-weight: 400;
    letter-spacing: -0.45px;
    color: ${({ theme }) => theme.colors.gray500};
    padding: 0.7rem 3rem;
    border-radius: 2.4rem;
    background-color: ${({ theme }) => theme.colors.gray200};
    cursor: pointer;
    @media (max-width: 430px) {
      padding: 0.7rem 2rem;
    }
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background-color: ${({ theme }) => theme.colors.gray300};
      }
    }

    &.selected {
      background-color: ${({ theme }) => theme.colors.purple600};
      color: ${({ theme }) => theme.colors.gray50};
    }
  }
`;

const HeaderSection = styled.section`
  width: 100%;
  min-width: 40rem;

  padding: 1rem 0;
  display: flex;
  align-items: center;

  @media (max-width: 500px) {
    min-width: 30rem;
    padding: 0;
    padding-top: 1rem;
  }
`;

const LeftButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.8;
    }
  }

  @media (max-width: 500px) {
    padding-left: 0;
  }
`;

const RightButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.8;
    }
  }

  @media (max-width: 500px) {
    padding-right: 0;
  }
`;

const Notice = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0;
  bottom: -1rem;

  > p {
    text-align: center;
    font-size: 1.4rem;
    font-weight: 300;
    letter-spacing: -0.42px;
    color: ${({ theme }) => theme.colors.gray400};
  }
`;

const HospitalListWrapper = styled.div`
  width: 100%;

  > ul {
    display: grid;
    @media (min-width: 1024px) {
      grid-template-columns: repeat(2, 1fr); /* 1024px 이상은 2열 */
    }
    gap: 4rem;
    > li {
      padding: 2.3rem 2.7rem 4rem 2.7rem;
      min-width: 40rem;

      @media (max-width: 500px) {
        min-width: 30rem;
      }
      border-radius: 1.6rem;
      background: ${({ theme }) => theme.colors.backgroundLayer1};
      .hospital_type {
        padding: 0.7rem 1rem;
        border-radius: 2.4rem;
        background: ${({ theme }) => theme.colors.gray50};
        color: ${({ theme }) => theme.colors.purple600};
        text-align: center;
        box-shadow: rgba(0, 0, 0, 0.1) 1.95px 1.95px 2.6px;
        font-size: 1.2rem;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.1px;
      }
      .hospital_name {
        margin-top: 1.2rem;
        color: ${({ theme }) => theme.colors.gray700};
        font-size: 2.2rem;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: -0.7px;
      }
      .hospital_distance {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 1.2rem;
        color: ${({ theme }) => theme.colors.gray600};

        font-size: 1.4rem;
        font-style: normal;
        font-weight: 300;
        line-height: normal;
        letter-spacing: -0.07rem;
      }
      .hospital_link {
        margin-top: 1.2rem;
        display: flex;
        align-items: center;
        gap: 1.5rem;
        color: ${({ theme }) => theme.colors.gray500};

        font-size: 1.4rem;
        font-style: normal;
        font-weight: 300;
        line-height: normal;
        letter-spacing: -0.07rem;
        text-decoration-line: underline;
        text-decoration-style: solid;
        text-decoration-skip-ink: none;
        text-decoration-thickness: auto;
        text-underline-offset: auto;
        text-underline-position: from-font;
        > div {
          display: flex;
          align-items: center;
          gap: 1rem;
          > a {
            color: ${({ theme }) => theme.colors.gray500};
          }
        }
      }
    }
  }
`;
