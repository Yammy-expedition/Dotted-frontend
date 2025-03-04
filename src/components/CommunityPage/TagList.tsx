import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useRef } from 'react';
import { useLocation } from 'react-router-dom';

import LeftIcon from '@/assets/svg/tips/hospital/left.svg?react';
import RightIcon from '@/assets/svg/tips/hospital/right.svg?react';
import Fire from '@/assets/svg/CommunityPage/Fire.svg?react';

interface TagListProps {
  tags: string[];
  selectedTag: string;
  onClickTag: (tag: string) => void;
}

export default function TagList({
  tags,
  selectedTag,
  onClickTag
}: TagListProps) {
  const location = useLocation();
  const isMarket = location.pathname.includes('market');

  // 스크롤바가 적용될 UL 요소에 대한 ref
  const scrollContainerRef = useRef<HTMLUListElement>(null);

  // 왼쪽으로 스크롤
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  // 오른쪽으로 스크롤
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  return (
    <TagListWrapper>
      <HeaderSection>
        {/* 500px 이하에서만 나타나는 왼쪽 버튼 */}
        <LeftButton onClick={scrollLeft} $isMarket={isMarket}>
          <LeftIcon />
        </LeftButton>

        <NavContainer>
          <TagListContainer ref={scrollContainerRef} $isMarket={isMarket}>
            {tags.map((tag, idx) => {
              return (
                <TagWrapper key={idx}>
                  <Tag
                    value={tag}
                    onClick={() => onClickTag(tag)}
                    $selected={selectedTag === tag}
                  >
                    {tag === 'HOT' && <Fire />}
                    {tag}
                  </Tag>
                  {selectedTag === tag && (
                    <MotionUnderline
                      layoutId="underline"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 40
                      }}
                    />
                  )}
                </TagWrapper>
              );
            })}
          </TagListContainer>
        </NavContainer>

        {/* 500px 이하에서만 나타나는 오른쪽 버튼 */}
        <RightButton onClick={scrollRight} $isMarket={isMarket}>
          <RightIcon />
        </RightButton>
      </HeaderSection>
    </TagListWrapper>
  );
}

const TagListWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const HeaderSection = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
`;

const NavContainer = styled.div`
  flex: 1;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const LeftButton = styled.div<{ $isMarket: boolean }>`
  cursor: pointer;
  display: none;

  @media (max-width: 540px) {
    ${({ $isMarket }) => ($isMarket ? 'display: none;' : ' display: block;')}
  }
`;

const RightButton = styled.div<{ $isMarket: boolean }>`
  cursor: pointer;
  display: none;

  @media (max-width: 540px) {
    ${({ $isMarket }) => ($isMarket ? 'display: none;' : ' display: block;')}
  }
`;

const TagListContainer = styled.ul<{ $isMarket: boolean }>`
  display: flex;
  align-items: end;
  gap: 1rem;
  white-space: nowrap;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1125px) {
    display: flex;
    align-items: end;
  }

  @media (max-width: 786px) {
    ${({ $isMarket }) =>
      $isMarket
        ? 'display: grid; grid-template-columns: repeat(2, minmax(4rem, 1fr));'
        : ''}
  }
`;

const TagWrapper = styled.div`
  position: relative;
`;

const Tag = styled.li<{ $selected: boolean }>`
  cursor: pointer;
  padding: 0.5rem;
  margin: 0.5rem;
  border-radius: 20px;

  color: ${({ theme }) => theme.colors.gray400};
  text-align: center;
  font-size: 1.6rem;
  @media (max-width: 460px) {
    font-size: 1.3rem;
  }
  font-style: normal;
  font-weight: 500;
  line-height: 2.4rem; /* 150% */
  letter-spacing: -0.032rem;
  transition: background-color 0.3s ease;

  ${({ theme, $selected }) =>
    $selected
      ? `
        font-weight: 700;
        color: ${theme.colors.purple600};
      `
      : `
       @media (hover: hover) and (pointer: fine) {
       &:hover {
          background-color: ${theme.colors.backgroundBase}; 
        }
      }
        
      `};

  > svg {
    margin-right: 1rem;
    path {
      fill: ${({ theme, $selected }) =>
        $selected ? `${theme.colors.purple600}` : `${theme.colors.gray400}`};
    }
  }
`;

// 선택된 태그 밑줄 효과
const MotionUnderline = styled(motion.div)`
  width: 100%;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.purple600};
  position: absolute;
  bottom: 0;
`;
