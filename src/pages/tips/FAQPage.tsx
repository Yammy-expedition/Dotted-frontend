import SearchBar from '@/components/CommunityPage/SearchBar';
import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Arrow from '@/assets/svg/tips/faq/arrow.svg?react';
import { EachFAQPost, useFAQ } from '@/hooks/useFAQ';
import { useSearchParams } from 'react-router-dom';

const POSTS_PER_PAGE = 7; // 7개씩 표시

export default function FAQPage() {
  const [keyword, setKeyword] = useState('');
  const [searchType, setSearchType] = useState('all');
  const { data } = useFAQ();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [filteredData, setFilteredData] = useState<EachFAQPost[]>([]);
  const [pagedData, setPagedData] = useState<EachFAQPost[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  // 전체 페이지 계산
  const totalPages = filteredData
    ? Math.ceil(filteredData.length / POSTS_PER_PAGE)
    : 1;

  // 페이지네이션 그룹 설정
  const groupSize = 5;
  const currentGroup = Math.floor((currentPage - 1) / groupSize);
  const startPage = currentGroup * groupSize + 1;
  const endPage = Math.min(startPage + groupSize - 1, totalPages);

  // 🔹 검색어 필터링 함수
  const handleSearch = () => {
    if (!data) return;

    const filtered = data.filter((faq) => {
      const searchLower = keyword.toLowerCase();
      if (searchType === 'all') {
        return (
          faq.question.toLowerCase().includes(searchLower) ||
          faq.answer.toLowerCase().includes(searchLower)
        );
      } else if (searchType === 'title') {
        return faq.question.toLowerCase().includes(searchLower);
      } else if (searchType === 'content') {
        return faq.answer.toLowerCase().includes(searchLower);
      }
      return true;
    });

    setFilteredData(filtered);
    setSearchParams({ page: '1', keyword, searchType }); // 검색 시 페이지 1로 이동
  };

  // 데이터 업데이트 시 필터링 적용
  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  // 현재 페이지의 데이터 가져오기
  useEffect(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    setPagedData(filteredData.slice(startIndex, endIndex));
  }, [filteredData, currentPage]);

  // 검색어 변경 핸들러
  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };
  const onChangeSearchType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value);
  };

  // 아코디언 토글
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (targetPage: number) => {
    setSearchParams({ page: targetPage.toString(), keyword, searchType });
  };

  // 답변 문자열을 포맷팅하는 헬퍼 함수
  function formatAnswer(text: string): React.ReactNode[] {
    // 1. 개행 문자 정리: 여러 줄바꿈을 한 칸의 공백으로 변경
    let normalized = text.replace(/\r\n/g, '\n').replace(/\n+/g, ' ');

    // 2. 문장 마침표, 느낌표, 물음표 뒤에 줄바꿈을 삽입
    // 단, 마침표 바로 앞 문자가 한 자리 숫자일 경우(예: "1.")는 줄바꿈하지 않음
    // 두 자리 이상 숫자 뒤의 마침표인 경우는 줄바꿈을 적용
    normalized = normalized.replace(/(?<!\b\d)([.!?])\s+/g, '$1\n');

    // 두 자리 이상 숫자(10 이상) 뒤에 오는 마침표는 줄바꿈 처리
    normalized = normalized.replace(/(\b\d{2,}\.)(\s+)/g, '$1\n');

    // 3. 줄바꿈 기준으로 분리
    const lines = normalized.split('\n');

    // 4. 각 줄 내에서 http/https URL 처리 (www로 시작하는 경우는 그대로 둠)
    return lines.map((line, lineIndex) => {
      // URL 패턴: http:// 또는 https:// 로 시작하는 문자열만 매칭
      const parts = line.split(/((?:https?:\/\/)\S+)/g);
      return (
        <div key={lineIndex}>
          {parts.map((part, partIndex) => {
            if (/^(https?:\/\/)\S+/.test(part)) {
              // URL 끝에 후행 문장부호(., !, ?, ) 등 분리
              const match = part.match(/^(https?:\/\/\S+?)([.,!?)]*)$/);
              if (match) {
                const url = match[1];
                const trailing = match[2];
                return (
                  <React.Fragment key={partIndex}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'blue', textDecoration: 'underline' }}
                    >
                      {url}
                    </a>
                    <span>{trailing}</span>
                  </React.Fragment>
                );
              }
              return (
                <a
                  key={partIndex}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'blue', textDecoration: 'underline' }}
                >
                  {part}
                </a>
              );
            }
            return <span key={partIndex}>{part}</span>;
          })}
        </div>
      );
    });
  }

  return (
    <FAQPageContainer>
      <Wrapper>
        <Title>FAQ</Title>
        <NoticeAndSearch>
          <Notice>
            <span>Frequently asked questions from former students</span>
          </Notice>

          <SearchBar
            keyword={keyword}
            searchType={searchType}
            onChangeSearch={onChangeSearch}
            onChangeSearchType={onChangeSearchType}
            handleSearch={handleSearch}
          />
        </NoticeAndSearch>

        <FAQBox>
          {pagedData.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.id}>
                <FAQItem $isOpen={isOpen} onClick={() => toggleFAQ(idx)}>
                  <div className="question">
                    <div>
                      <div>{idx + 1 + (currentPage - 1) * POSTS_PER_PAGE}</div>
                      {item.question}
                    </div>
                    <ArrowWrapper $isOpen={isOpen}>
                      <Arrow />
                    </ArrowWrapper>
                  </div>
                </FAQItem>
                <Answer className={`answer ${isOpen ? 'open' : ''}`}>
                  {formatAnswer(item.answer)}
                </Answer>
              </div>
            );
          })}
        </FAQBox>

        {/* 페이지네이션 UI */}
        <PaginationBox>
          <button
            onClick={() => handlePageChange(startPage - 1)}
            disabled={currentGroup === 0}
          >
            {'<'}
          </button>
          {Array.from({ length: endPage - startPage + 1 }, (_, idx) => (
            <button
              key={idx}
              className={currentPage === startPage + idx ? 'selected' : ''}
              onClick={() => handlePageChange(startPage + idx)}
            >
              {startPage + idx}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(endPage + 1)}
            disabled={endPage === totalPages}
          >
            {'>'}
          </button>
        </PaginationBox>
      </Wrapper>
    </FAQPageContainer>
  );
}

const FAQPageContainer = styled.div`
  margin-top: 8rem;
  min-height: 80rem;
  width: 100%;
  padding: 0 24.3rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 1200px) {
    padding: 0 7.7rem;
  }

  @media (max-width: 900px) {
    padding: 0 5rem;
  }

  @media (max-width: 700px) {
    padding: 0 2rem;
  }
`;

const Wrapper = styled.div`
  width: 100%;
`;

const Title = styled.div`
  width: 100%;
  color: ${({ theme }) => theme.colors.gray700};

  font-size: 3.6rem;
  font-style: normal;
  font-weight: 700;
  line-height: 3.6rem;
  letter-spacing: -0.18rem;
`;

const Notice = styled.div`
  margin: 2rem 0;
  > span {
    white-space: pre-wrap;
    color: ${({ theme }) => theme.colors.gray400};

    font-size: 1.6rem;
    font-style: normal;
    font-weight: 400;
    line-height: 2rem;
  }
`;

const NoticeAndSearch = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2.5rem;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const FAQBox = styled.ul`
  border-bottom: 1px solid ${({ theme }) => theme.colors.purple600};
`;

const ArrowWrapper = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  padding: 0.5rem;
  padding-left: 1.5rem;
`;

const FAQItem = styled.li<{ $isOpen: boolean }>`
  &:first-child {
    border-top: 1px solid ${({ theme }) => theme.colors.purple600};
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray100};
    }
  }

  cursor: pointer;
  padding: 2.5rem 4rem 2.5rem 2rem;
  background-color: ${({ theme, $isOpen }) =>
    $isOpen ? theme.colors.purple100 : ''};

  transition: background-color 0.3s ease;

  .question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${({ theme }) => theme.colors.gray700};

    font-size: 2rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.1rem;
    cursor: pointer;

    @media (max-width: 700px) {
      font-size: 1.5rem;
    }

    > div {
      display: flex;
      gap: 2rem;

      > div {
        color: ${({ theme }) => theme.colors.purple600};
      }
    }
  }
`;

const Answer = styled.div`
  color: ${({ theme }) => theme.colors.gray700};
  font-size: 2rem;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  letter-spacing: -0.04rem;
  padding: 0 3.8rem;
  max-height: 0;
  overflow: hidden;
  transition:
    max-height 0.3s ease,
    padding 0.3s ease;

  @media (max-width: 700px) {
    font-size: 1.5rem;
  }

  &.open {
    border-top: 1px solid ${({ theme }) => theme.colors.purple600};
    max-height: 100rem;
    padding: 2.5rem 3.8rem;
  }
`;

const PaginationBox = styled.div`
  width: 100%;
  padding: 5rem 0;
  display: flex;
  justify-content: center;
  gap: 1.5rem;

  button {
    width: 3.1rem;
    height: 3.1rem;
    border-radius: 50%;
    border: none;
    background: none;
    font-size: 1.6rem;

    &.selected {
      background-color: ${({ theme }) => theme.colors.purple600};
      color: ${({ theme }) => theme.colors.gray50};
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background-color: ${({ theme }) => theme.colors.backgroundBase};
        cursor: pointer;
      }
    }
  }
`;
