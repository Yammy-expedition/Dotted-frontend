import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { ClubData } from '@/pages/tips/ClubsPage';

// 한 페이지에 보여줄 클럽 수
const POST_PER_PAGE = 5;

// 페이지네이션 그룹 크기(페이지 버튼 몇 개씩 묶을지)
const GROUP_SIZE = 5;

export default function ClubsList({
  filterdData
}: {
  filterdData: ClubData[];
}) {
  // 현재 페이지
  const [currentPage, setCurrentPage] = useState(1);
  // 현재 페이지에 해당하는 클럽 목록
  const [pagedData, setPagedData] = useState<ClubData[]>([]);

  // 전체 페이지 계산
  const totalPages = filterdData
    ? Math.ceil(filterdData.length / POST_PER_PAGE)
    : 1;

  // 그룹 단위 페이지네이션 계산
  const currentGroup = Math.floor((currentPage - 1) / GROUP_SIZE);
  const startPage = currentGroup * GROUP_SIZE + 1;
  const endPage = Math.min(startPage + GROUP_SIZE - 1, totalPages);

  // 현재 페이지가 바뀔 때마다 보여줄 데이터(pagedData) 갱신
  useEffect(() => {
    if (filterdData) {
      const startIndex = (currentPage - 1) * POST_PER_PAGE;
      const endIndex = startIndex + POST_PER_PAGE;
      setPagedData(filterdData.slice(startIndex, endIndex));
    }
  }, [filterdData, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterdData]);

  // 페이지 변경 함수
  function handlePageChange(targetPage: number) {
    setCurrentPage(targetPage);
  }

  return (
    <ListWrapper>
      <List>
        {pagedData.map((club: ClubData) => (
          <li key={club.id}>
            <img src={club.photo} alt="club" />
            <div>
              <h3>{club.name}</h3>
              <p>{club.intro}</p>
            </div>
          </li>
        ))}
      </List>
      <CopyRight>© 총동아리연합회</CopyRight>

      {/* 페이지네이션 UI */}
      <PaginationBox>
        {/* 이전 그룹으로 이동 */}
        <button
          onClick={() => handlePageChange(startPage - 1)}
          disabled={currentGroup === 0}
        >
          {'<'}
        </button>

        {/* 그룹 단위로 페이지 번호 버튼 생성 */}
        {Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
          const pageNumber = startPage + idx;
          return (
            <button
              key={pageNumber}
              className={currentPage === pageNumber ? 'selected' : ''}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* 다음 그룹으로 이동 */}
        <button
          onClick={() => handlePageChange(endPage + 1)}
          disabled={endPage === totalPages}
        >
          {'>'}
        </button>
      </PaginationBox>
    </ListWrapper>
  );
}

const CopyRight = styled.div`
  margin-top: 3rem;
  color: ${({ theme }) => theme.colors.gray400};
`;

const ListWrapper = styled.div`
  width: 100%;
  margin-top: 1.5rem;
`;

const List = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  @media (max-width: 400px) {
    gap: 1.8rem;
  }
  li {
    width: inherit;
    background-color: ${({ theme }) => theme.colors.backgroundLayer1};
    border-radius: 1.6rem;
    border: 1px solid ${({ theme }) => theme.colors.gray300};
    padding: 1.5rem;
    display: flex;
    gap: 2rem;

    @media (max-width: 400px) {
      padding: 1rem;
    }

    img {
      width: 14rem;
      height: 14rem;
      flex-shrink: 0;
      border-radius: 1.6rem;
      object-fit: contain;
      @media (max-width: 700px) {
        width: 8rem;
        height: 8rem;
      }
    }

    div {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      padding-top: 0.7rem;
      @media (max-width: 400px) {
        gap: 0.7rem;
      }
      h3 {
        font-size: 2.2rem;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.purple600};
        letter-spacing: -1.2px;
        @media (max-width: 400px) {
          font-size: 1.8rem;
        }
      }

      p {
        font-size: 1.4rem;
        font-weight: 400;
        color: ${({ theme }) => theme.colors.gray500};
        letter-spacing: -0.28px;
        line-height: 1.2;

        @media (max-width: 400px) {
          /* text-align: center; */
        }
      }
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
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.colors.gray600};
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

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;
