import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';

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

export default function CultureList() {
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
      <List>
        {pagedData?.map((club: CultureData) => (
          <li
            key={club.id}
            onClick={() => navigate(`/tips/culture/${club.id}`)}
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
  width: 100%;
  margin-top: 1.5rem;
`;

const List = styled.ul`
  min-height: 50vh;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3.8rem 4.5rem;
  @media (max-width: 700px) {
    gap: 0.5rem;
  }
  @media (max-width: 500px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 400px) {
    grid-template-columns: 1fr;
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
