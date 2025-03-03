import styled from 'styled-components';
import AllIcon from '@/assets/svg/tips/clubs/all.svg?react';
import VolunteerIcon from '@/assets/svg/tips/clubs/volunteer.svg?react';
import ArtIcon from '@/assets/svg/tips/clubs/art.svg?react';
import ReligionIcon from '@/assets/svg/tips/clubs/religion.svg?react';
import PEIcon from '@/assets/svg/tips/clubs/pe.svg?react';
import AcademicIcon from '@/assets/svg/tips/clubs/academic.svg?react';
import SocialIcon from '@/assets/svg/tips/clubs/social.svg?react';
import React, { useEffect, useRef, useState } from 'react';
import SearchBox from '@/components/tips/clubs/SearchBox';
import ClubsList from '@/components/tips/clubs/ClubsList';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Left from '@/assets/svg/tips/hospital/left.svg?react';
import Right from '@/assets/svg/tips/hospital/right.svg?react';
const clubTabs = [
  { name: 'All', src: 'all' },
  { name: 'Volunteer', src: 'volunteer' },
  { name: 'Social Culture', src: 'social' },
  { name: 'Performing Arts', src: 'art' },
  { name: 'Religious', src: 'religion' },
  { name: 'Sports', src: 'pe' },
  { name: 'Academic', src: 'academic' }
];

const clubIcons: Record<string, React.FC> = {
  all: AllIcon,
  volunteer: VolunteerIcon,
  art: ArtIcon,
  religion: ReligionIcon,
  pe: PEIcon,
  academic: AcademicIcon,
  social: SocialIcon
};

export interface ClubData {
  id: number;
  college: number;
  college_name: string;
  name: string;
  photo: string;
  intro: string;
  category: string;
}

const fetchClubs = async (): Promise<ClubData[]> => {
  const res = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/campus/club`);
  if (!res.ok) {
    throw new Error('Failed to fetch clubs');
  }
  return res.json();
};

export default function ClubsPage() {
  const { data: clubs } = useQuery({
    queryKey: ['tipsClubs'],
    queryFn: fetchClubs
  });
  const [searchParam, setSearchParam] = useSearchParams();
  const [filterdData, setFilterdData] = useState<ClubData[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navBarRef = useRef<HTMLElement | null>(null);

  function handleTabClick(tab: string) {
    setInputValue('');
    setSearchTerm('');
    setSearchParam({ q: tab.toLowerCase() });
  }

  function handleSearch() {
    setSearchParam({ q: 'all' });
    setSearchTerm(inputValue);
  }

  // 초기 탭을 all로 설정
  useEffect(() => {
    setSearchParam({ q: 'all' });
  }, []);

  useEffect(() => {
    if (clubs) {
      let filtered = clubs;
      if (searchTerm.trim() !== '') {
        filtered = clubs.filter(
          (club) =>
            club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            club.intro.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else {
        if (searchParam.get('q') !== 'all') {
          filtered = clubs.filter(
            (club: ClubData) =>
              club.category.toLowerCase() === searchParam.get('q')
          );
        }
      }
      setFilterdData(filtered);
    }
  }, [clubs, searchTerm, searchParam]);

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

  return (
    <Main>
      <HeaderSection>
        <NavContainer>
          <LeftButton onClick={scrollLeft}>
            <Left />
          </LeftButton>
          <Nav ref={navBarRef}>
            {clubTabs.map((tab, idx) => {
              const isActive = searchParam.get('q') === tab.name.toLowerCase();
              const IconComponent = clubIcons[tab.src];
              return (
                <TabElement key={idx} $active={isActive}>
                  <span onClick={() => handleTabClick(tab.name)}>
                    <IconComponent />
                  </span>
                  <p>{tab.name}</p>
                </TabElement>
              );
            })}
          </Nav>
          <RightButton onClick={scrollRight}>
            <Right />
          </RightButton>
        </NavContainer>
        <SearchBox
          searchValue={inputValue}
          onInputChange={setInputValue}
          onSearch={handleSearch}
        />
      </HeaderSection>
      {clubs && <ClubsList filterdData={filterdData} />}
    </Main>
  );
}

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

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

  @media (max-width: 700px) {
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

  @media (max-width: 700px) {
    display: flex;
    padding-right: 0;
  }
`;

const Main = styled.main`
  width: 100%;
  padding: 5rem 24rem 2.6rem 24rem;
  display: flex;
  flex-direction: column;

  @media (max-width: 900px) {
    padding-right: 7.7rem;
    padding-left: 7.7rem;
  }
  @media (max-width: 700px) {
    padding-right: 2rem;
    padding-left: 2rem;
  }
`;

const HeaderSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > a {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    color: ${({ theme }) => theme.colors.gray600};
    text-align: center;
    font-size: 1.4rem;
    font-weight: 400;
    text-decoration-line: underline;
    cursor: pointer;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 5rem;
  padding: 2.8rem 0;
  justify-content: center;
  @media (max-width: 900px) {
    gap: 3rem;
  }
  /* 모바일에서는 스크롤 가능하도록 설정 */
  @media (max-width: 700px) {
    overflow-x: auto;
    /* 내부 아이템이 축소되지 않게 함 */
    & > div {
      flex-shrink: 0;
    }
    /* 좌측 정렬로 변경 */
    justify-content: flex-start;
  }
  @media (max-width: 480px) {
    gap: 2rem;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabElement = styled.div<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  > span {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ $active, theme }) =>
      $active ? theme.colors.purple100 : ''};

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background-color: ${({ theme }) => theme.colors.backgroundLayer1};
        cursor: pointer;
      }
    }

    > svg {
      width: 2.4rem;
      height: 2.4rem;
      path {
        stroke: ${({ $active, theme }) =>
          $active ? theme.colors.purple600 : theme.colors.gray500};
      }

      g {
        path {
          stroke: ${({ $active, theme }) =>
            $active ? theme.colors.purple600 : ''};
        }
      }
    }
  }

  > p {
    width: 7rem;
    text-align: center;
    line-height: 1.1;
    font-size: 1.3rem;
    font-weight: 400;
    letter-spacing: -0.75px;
    color: ${({ $active, theme }) =>
      $active ? theme.colors.purple600 : theme.colors.gray500};
  }
`;
