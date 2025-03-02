import styled from 'styled-components';

export default function LoadingStateComponent() {
  return (
    <Loading>
      <ImgWrppaer>
        <img src="/logo-motion.gif" alt="Logo Animation" />
      </ImgWrppaer>

      <LoadingMSG>Loading...</LoadingMSG>
    </Loading>
  );
}

const Loading = styled.div`
  width: 100%;
  height: 70vh;
  padding: 2rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
`;

const ImgWrppaer = styled.div`
  width: 100%;
  max-width: 20rem;

  display: flex;
  justify-content: center;
  > img {
    width: 100%;
    object-fit: cover;
  }
`;
const LoadingMSG = styled.div`
  font-size: 2.1rem;
  font-weight: 500;
`;
