import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const fetchCultureData = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/api/campus/culture`
  );
  return response.json();
};

interface CultureData {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: string;
}

export default function CultureEditPage() {
  const { data } = useSuspenseQuery({
    queryKey: ['tipsClubs'],
    queryFn: fetchCultureData,
    staleTime: 0,
    gcTime: 0
  });
  const navigate = useNavigate();
  const [pagedData, setPagedData] = useState<CultureData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (data) {
      const start = (currentPage - 1) * 6;
      const end = start + 6;
      setPagedData(data.slice(start, end));
    }
  }, [currentPage, data]);

  function handleDirectionBtn(targetPage: number) {
    if (targetPage < 1) {
      setCurrentPage(1);
    } else if (targetPage > Math.ceil(data?.length / 6)) {
      setCurrentPage(Math.ceil(data?.length / 6));
    } else {
      setCurrentPage(targetPage);
    }
  }

  function handlePageChange(targetPage: number) {
    setCurrentPage(targetPage);
  }

  return (
    <ListWrapper>
      <h1>글 수정 페이지</h1>
      <h2>1. 글 클릭 후 들어가서 수정한 다음에 update 누르면 수정됩니다.</h2>
      <h2>
        2. 만약 썸네일을 넣은 상태에서 수정한다면 수정된 내용을 제출할 때,
        썸네일을 다시 넣을 필요 없습니다.
      </h2>
      <h2>3. 내부에 삭제 버튼으로 글 삭제 가능합니다.</h2>
      <List>
        {pagedData?.map((club: CultureData) => (
          <li
            key={club.id}
            onClick={() => navigate(`/admin/culture/edit/detail/${club.id}`)}
          >
            <img src={club.thumbnail} alt="club" />
            <div>
              <h3>{club.title}</h3>
              <p>{club.createdAt}</p>
            </div>
          </li>
        ))}
      </List>
      <PaginationBox>
        <button onClick={() => handleDirectionBtn(currentPage - 1)}>
          {'<'}
        </button>
        {Array.from({ length: Math.ceil(data?.length / 6) }, (_, idx) => (
          <button
            className={currentPage === idx + 1 ? 'selected' : ''}
            key={idx}
            onClick={() => handlePageChange(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button onClick={() => handleDirectionBtn(currentPage + 1)}>
          {'>'}
        </button>
      </PaginationBox>
    </ListWrapper>
  );
}

const ListWrapper = styled.div`
  padding: 5rem;
  width: 100%;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const List = styled.ul`
  min-height: 50vh;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3.8rem 4.5rem;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  @media (max-width: 700px) {
    grid-template-columns: repeat(1, 1fr);
  }

  li {
    width: 100%;
    /* height: 30rem; */
    border-radius: 1.6rem;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    transition: background-color 0.2s;
    padding: 1rem;
    background-color: beige;
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        cursor: pointer;
        background-color: ${({ theme }) => theme.colors.backgroundLayer1};
      }
    }

    img {
      width: 100%;
      height: 70%;
      flex-shrink: 0;
      border-radius: 5px;
      object-fit: cover;
    }

    div {
      display: flex;
      flex-direction: column;
      padding-top: 1rem;
      gap: 1rem;

      h3 {
        font-size: 2.2rem;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.gray800};
        letter-spacing: -1.2px;
      }

      p {
        font-size: 1.4rem;
        font-weight: 400;
        color: ${({ theme }) => theme.colors.gray500};
        letter-spacing: -0.28px;
        line-height: 1.2;
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
