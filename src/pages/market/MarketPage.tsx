import SearchBar from '@/components/CommunityPage/SearchBar';
import TagList from '@/components/CommunityPage/TagList';
import MakrketList from '@/components/MarketPage/MakrketList';
import { useSearchPosts } from '@/hooks/useSearchPosts';
import { EachMarketPost, MarketPost } from '@/types/MarketPost';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const tags = ['All', 'Only For Sale'];
const POST_PER_PAGE = 16;

export default function MarketPage() {
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchResults, setSearchResults] = useState<MarketPost>();
  const [pagedData, setPagedData] = useState<EachMarketPost[]>([]);

  const [keyword, setKeyword] = useState('');
  const [searchType, setSearchType] = useState('all');

  const searchPosts = useSearchPosts();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // 현재 페이지 번호
  const currentPage = Number(searchParams.get('page')) || 1;

  // 전체 페이지 계산 (서버에서 이미 페이지네이션 처리 시, 직접 계산 불필요할 수 있음)
  const totalPages = searchResults
    ? Math.ceil(searchResults.count / POST_PER_PAGE)
    : 1;

  const groupSize = 5;
  const currentGroup = Math.floor((currentPage - 1) / groupSize);
  const startPage = currentGroup * groupSize + 1;
  const endPage = Math.min(startPage + groupSize - 1, totalPages);

  // 1) 태그/페이지/검색어에 따라 서버에서 데이터 가져오기
  const handleSearch = () => {
    // 로딩 표시를 위해 isLoading 사용
    let realTag = selectedTag;
    if (selectedTag === 'Only For Sale') {
      realTag = 'FOR_SALE';
    }

    searchPosts.mutate(
      {
        name: 'market',
        keyword,
        searchType,
        status: realTag,
        page: currentPage
      },
      {
        onSuccess: (data) => {
          setSearchResults(data as MarketPost);
          setPagedData(data.results as EachMarketPost[]); // 서버에서 이미 페이지별로 results 제공
        },
        onError: (error) => {
          console.error('❌ 검색 실패:', error);
        }
      }
    );
  };

  // 2) 태그가 변경될 때마다 page=1로 세팅 (원한다면)
  // 뒤로 가기 시에는 URL 파라미터 유지 → 자동으로 currentPage 유지
  const onClickTag = (tag: string) => {
    setSelectedTag(tag);
    let realTag = tag;
    if (tag === 'Only For Sale') {
      realTag = 'FOR_SALE';
    }
    setSearchParams({ page: '1', status: realTag, keyword });
  };

  // 3) 페이지 변경 시 URL 파라미터 업데이트
  const handlePageChange = (targetPage: number) => {
    setSearchParams({ page: targetPage.toString(), tag: selectedTag, keyword });
  };
  // 4) 태그나 페이지 번호가 바뀔 때마다 서버에 요청
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTag, currentPage]);
  // 주의: handleSearch가 의존성에 있으면 무한루프 → 빼고 사용

  // 검색어/검색타입 변경 핸들러
  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };
  const onChangeSearchType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value);
  };
  const isLoading = searchPosts.isPending;

  return (
    <MarketPageContainer>
      <Wrapper>
        <Title>Market</Title>
        <Notice>
          <span>
            In the market community, you can use the secret comment function
            {`\n`}
            when sharing sensitive information related to transaction
          </span>
        </Notice>

        <TagAndSearch>
          <TagList
            tags={tags}
            selectedTag={selectedTag}
            onClickTag={onClickTag}
          />
          <SearchBar
            keyword={keyword}
            searchType={searchType}
            onChangeSearch={onChangeSearch}
            onChangeSearchType={onChangeSearchType}
            handleSearch={handleSearch}
          />
        </TagAndSearch>

        {isLoading ? (
          <div style={{ minHeight: '46rem' }}></div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={JSON.stringify(pagedData)} // 데이터 변경 시 애니메이션
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MakrketList pagedData={pagedData} />
            </motion.div>
          </AnimatePresence>
        )}

        <BottomWrapper>
          <PaginationBox>
            <button
              onClick={() => handlePageChange(startPage - 1)}
              disabled={currentGroup === 0 || isLoading}
            >
              {'<'}
            </button>
            {Array.from({ length: endPage - startPage + 1 }, (_, idx) => (
              <button
                className={currentPage === idx + 1 ? 'selected' : ''}
                key={idx}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(endPage + 1)}
              disabled={endPage === totalPages || isLoading}
            >
              {'>'}
            </button>
          </PaginationBox>

          <WriteButtonWrapper>
            <WriteButton onClick={() => navigate('write')}>write</WriteButton>
          </WriteButtonWrapper>
        </BottomWrapper>
      </Wrapper>
    </MarketPageContainer>
  );
}

const MarketPageContainer = styled.div`
  margin-top: 2.5rem;
  width: 100%;
  padding: 0 24.3rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 1200px) {
    padding: 0 10rem;
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
  line-height: 3.6rem; /* 100% */
  letter-spacing: -0.18rem;
`;

const Notice = styled.div`
  margin: 2rem 0;
  > span {
    white-space: pre-wrap;
    color: ${({ theme }) => theme.colors.gray400};

    font-size: 1.6rem;
    font-style: normal;
    font-weight: 500;
    line-height: 2rem; /* 125% */
  }
`;

const TagAndSearch = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-top: 2rem;

  @media (max-width: 1125px) {
    flex-direction: column;
    align-items: normal;
    > ul:first-child {
      margin-bottom: 2rem;
    }
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
    font-weight: 400;

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

const BottomWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  @media (max-width: 1024px) {
    display: block;
  }
`;

const WriteButtonWrapper = styled.div`
  width: 11.8rem;
  display: flex;
  justify-content: end;
  position: absolute;
  right: 0;

  @media (max-width: 1024px) {
    position: relative;
    margin-bottom: 6rem;
  }
`;

const WriteButton = styled.button`
  cursor: pointer;
  display: flex;
  border-radius: 0.5rem;
  align-items: center;
  justify-content: center;
  width: 11.8rem;
  height: 3.4rem;
  flex-shrink: 0;

  background-color: ${({ theme }) => theme.colors.gray700};
  border: none;

  color: #fff;
  text-align: center;
  font-size: 1.4rem;
  font-weight: 600;
  line-height: normal;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray600};
    }
  }
`;
