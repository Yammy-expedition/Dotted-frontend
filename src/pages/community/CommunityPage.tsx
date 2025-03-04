import SearchBar from '@/components/CommunityPage/SearchBar';
import TagList from '@/components/CommunityPage/TagList';
import { useSearchPosts } from '@/hooks/useSearchPosts';
import { CommunityPost, EachPost } from '@/types/CommunityPost';
import { AnimatePresence, motion } from 'framer-motion';
import { lazy, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const PostingList = lazy(
  () => import('@/components/CommunityPage/PostingList')
);

const tags = ['All', 'HOT', 'Campus Life', 'Travel', 'Living', 'Others'];
const POST_PER_PAGE = 8; // 서버에서 받아오는 page 당 개수가 맞다면 굳이 slice 안해도 됨

export default function CommunityPage() {
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchResults, setSearchResults] = useState<CommunityPost>();
  const [pagedData, setPagedData] = useState<EachPost[]>([]);

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

  // 페이지네이션 그룹 계산
  const groupSize = 5;
  const currentGroup = Math.floor((currentPage - 1) / groupSize);
  const startPage = currentGroup * groupSize + 1;
  const endPage = Math.min(startPage + groupSize - 1, totalPages);

  // 1) 태그/페이지/검색어에 따라 서버에서 데이터 가져오기
  const handleSearch = () => {
    // 로딩 표시를 위해 isLoading 사용
    searchPosts.mutate(
      {
        name: '',
        keyword,
        searchType,
        tag: selectedTag,
        page: currentPage
      },
      {
        onSuccess: (data) => {
          setSearchResults(data as CommunityPost);
          setPagedData(data.results as EachPost[]); // 서버에서 이미 페이지별로 results 제공
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
    setSearchParams({ page: '1', tag, keyword });
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

  // 로딩 상태는 useSearchPosts().isLoading 등으로 처리 가능
  const isLoading = searchPosts.isPending;

  return (
    <CommunityPageContainer>
      <Wrapper>
        {/* <Title>Community</Title> */}

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
              <PostingList pagedData={pagedData} />
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

            {Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
              const pageNumber = startPage + idx;
              return (
                <button
                  key={pageNumber}
                  className={currentPage === pageNumber ? 'selected' : ''}
                  onClick={() => handlePageChange(pageNumber)}
                  disabled={isLoading}
                >
                  {pageNumber}
                </button>
              );
            })}

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
    </CommunityPageContainer>
  );
}

// -------------------- 스타일 컴포넌트 --------------------
const CommunityPageContainer = styled.div`
  /* margin-top: 2.5rem; */
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
    padding: 0 1rem;
  }
`;

const Wrapper = styled.div`
  max-width: 1287px;
  width: 100%;
`;

// const Title = styled.div`
//   width: 100%;
//   color: ${({ theme }) => theme.colors.gray700};
//   font-size: 3.6rem;
//   @media (max-width: 460px) {
//     font-size: 3.3rem;
//   }
//   font-style: normal;
//   font-weight: 700;
//   line-height: 3.6rem;
//   letter-spacing: -0.18rem;
// `;

const TagAndSearch = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-top: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
  gap: 1rem;

  @media (max-width: 1260px) {
    flex-direction: column;
    align-items: normal;
    > ul:first-child {
      margin-bottom: 2rem;
    }
  }
  @media (max-width: 460px) {
    margin-top: 0rem;
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

const PaginationBox = styled.div`
  width: 100%;
  padding: 5rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;

  button {
    width: 3.1rem;
    height: 3.1rem;
    border-radius: 50%;
    border: none;
    background: none;
    font-size: 1.6rem;
    @media (max-width: 460px) {
      font-size: 1.3rem;
    }
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
  @media (max-width: 460px) {
    font-size: 1.1rem;
  }
  font-weight: 600;
  line-height: normal;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray600};
    }
  }
`;
