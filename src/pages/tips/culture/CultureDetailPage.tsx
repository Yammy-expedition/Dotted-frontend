import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import BackIcon from '@/assets/svg/tips/culture/back.svg?react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { TiptapViewOnly } from '@/components/CommunityPage/TipTapViewOnly';

const fetchCultureData = async (id: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/api/campus/culture/${id}`
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export default function CultureDetailPage() {
  const navigate = useNavigate();
  const { cultureId } = useParams();

  const { data: articleData } = useSuspenseQuery({
    queryKey: ['cultureDetail', cultureId],
    queryFn: () => fetchCultureData(cultureId!)
  });

  return (
    <Main>
      <Header>
        <h1>{articleData?.title}</h1>
        <p>{articleData?.createdAt}</p>
        <BackIcon onClick={() => navigate(-1)} />
      </Header>
      <ContentBox>
        {articleData?.content && (
          <TiptapViewOnly content={articleData.content} />
        )}
      </ContentBox>
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  padding: 5rem 15rem 2.6rem 15rem;
  display: flex;
  flex-direction: column;

  @media (max-width: 900px) {
    padding-left: 7.7rem;
    padding-right: 7.7rem;
  }

  @media (max-width: 700px) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  align-items: center;
  position: relative;
  padding: 7rem 0 1.8rem 0;

  > h1 {
    font-size: 3.6rem;
    font-weight: 600;
    letter-spacing: -1.8px;
    color: ${({ theme }) => theme.colors.gray800};

    @media (max-width: 700px) {
      font-size: 3.1rem;
    }
  }

  > p {
    font-size: 1.6rem;
    font-weight: 500;
    letter-spacing: -0.8px;
    color: ${({ theme }) => theme.colors.gray500};
  }

  > svg {
    position: absolute;
    left: 0;
    top: 2rem;
    cursor: pointer;
  }
`;

const ContentBox = styled.div`
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;

  > img {
    width: 100%;
    height: 30rem;
    border-radius: 5px;
    object-fit: contain;
  }

  > p {
    font-size: 1.8rem;
    font-weight: 400;
    line-height: 2.4rem;
    letter-spacing: -0.6px;
    color: ${({ theme }) => theme.colors.gray800};
    text-align: center;
    word-break: keep-all;
  }
`;
