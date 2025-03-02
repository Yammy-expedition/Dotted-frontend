import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface RequestType {
  id: number;
  image: string;
  status: string;
  created_at: string;
  user: {
    id: number;
    nickname: string;
    email: string;
    name: string;
    birth: string;
    student_type: string;
    college: number;
    univ_certified: boolean;
    created_at: string;
    is_active: boolean;
  };
}
const fetchProfileData = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return;

  const headers = { Authorization: `Bearer ${accessToken}` };
  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/api/management/request/list`,
    {
      headers,
      credentials: 'include'
    }
  );
  if (response.status !== 200) {
    alert('admin계정만 가능');
  }
  if (!response.ok) {
    console.error(response);
  }
  return response.json();
};
const manageRequest = async ({
  status,
  id
}: {
  status: boolean;
  id: number;
}) => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) throw new Error('No access token');

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/api/management/request/${id}`,
    {
      method: 'POST', // or 'PATCH' based on API spec
      headers,
      credentials: 'include',
      body: JSON.stringify({ approve: status })
    }
  );

  if (!response.ok) throw new Error('Failed to update request status');

  return response.json();
};

export default function AdminVerifyPage() {
  const [selected, setSelected] = useState<'all' | 'cert' | 'uncert'>('all');
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['requests'],
    queryFn: fetchProfileData
  });
  const [filteredData, setFilteredData] = useState<RequestType[]>([]);
  const mutation = useMutation({
    mutationFn: manageRequest,
    onSuccess: () => {
      alert('Success');
      refetch();
    }
  });

  useEffect(() => {
    if (data) {
      if (selected === 'all') {
        setFilteredData(data);
      } else if (selected === 'cert') {
        setFilteredData(
          data.filter((request: RequestType) => request.user.univ_certified)
        );
      } else if (selected === 'uncert') {
        setFilteredData(
          data.filter((request: RequestType) => !request.user.univ_certified)
        );
      }
    }
  }, [data, selected]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;

  function handleClick(status: boolean, id: number) {
    mutation.mutate({ id, status });
  }

  return (
    <Main>
      <nav>
        <button
          className={selected === 'all' ? 'selected' : ''}
          onClick={() => setSelected('all')}
        >
          전체
        </button>
        <button
          className={selected === 'cert' ? 'selected' : ''}
          onClick={() => setSelected('cert')}
        >
          인증완료
        </button>
        <button
          className={selected === 'uncert' ? 'selected' : ''}
          onClick={() => setSelected('uncert')}
        >
          인증미완료
        </button>
      </nav>
      <ul>
        {filteredData?.map((request: RequestType) => (
          <li key={request.id}>
            <img src={request.image} alt="profile" />
            <div>
              <p>
                인증요청 일시:{' '}
                {dayjs(request.created_at).format('YYYY/MM/DD HH:mm')}
              </p>
              <p>{request.id}</p>
              <p>닉네임: {request.user.nickname}</p>
              <p>이메일: {request.user.email}</p>
              <p>실명: {request.user.name}</p>
              <p>생일: {request.user.birth}</p>
              <p>학생유형: {request.user.student_type}</p>
              <p>
                인증여부: {request.user.univ_certified ? '인증함' : '인증안함'}
              </p>
              <p>
                회원가입 일시:{' '}
                {dayjs(request.user.created_at).format('YYYY/MM/DD HH:mm')}
              </p>
              <p>탈퇴여부: {request.user.is_active ? '탈퇴안함' : '탈퇴'}</p>
              <p>상태: {request.status}</p>
            </div>
            <div>
              <button onClick={() => handleClick(true, request.id)}>
                승인
              </button>
              <button onClick={() => handleClick(false, request.id)}>
                거부
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Main>
  );
}

const Main = styled.main`
  nav {
    button {
      background-color: ${({ theme }) => theme.colors.gray700};
      border: none;
      cursor: pointer;
      color: ${({ theme }) => theme.colors.gray100};
      font-size: 1.4rem;
      padding: 1rem 4rem;
      &.selected {
        background-color: ${({ theme }) => theme.colors.purple600};
      }
    }
  }
  ul {
    display: flex;
    flex-direction: column;
    li {
      gap: 2rem;
      padding: 1rem;
      display: flex;
      border-bottom: 1px solid #e0e0e0;
      font-size: 1.3rem;
      img {
        width: 40rem;
        height: 100%;
      }
      div {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        p {
          margin: 0.5rem 0;
        }
      }
      button {
        background-color: #f0f0f0;
        border: none;
        cursor: pointer;
        border-radius: 2rem;
        color: ${({ theme }) => theme.colors.gray100};
        font-size: 1.4rem;
        padding: 1rem 4rem;
        &:first-child {
          background-color: ${({ theme }) => theme.colors.purple600};
        }
        &:last-child {
          background-color: var(--negative-900);
        }
      }
    }
  }
`;
