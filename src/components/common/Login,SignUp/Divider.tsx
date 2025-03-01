import styled from 'styled-components';

export default function Divider() {
  return (
    <LineWrapper>
      <Line />
      <p>OR</p>
      <Line />
    </LineWrapper>
  );
}

const LineWrapper = styled.div`
  width: 100%;
  margin-bottom: 1.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  @media (max-width: 500px) {
    gap: 0.5rem;
  }

  > p {
    display: flex;
    width: 59px;
    height: 32px;
    flex-direction: column;
    justify-content: center;
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.gray400};
    text-align: center;
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    letter-spacing: -0.45px;
  }
`;

const Line = styled.div`
  padding-left: 2rem;
  width: 100%;
  max-width: 32.3rem;

  @media (max-width: 750px) {
    max-width: 20rem;
  }

  @media (max-width: 500px) {
    max-width: 15rem;
  }
  height: 1px;
  flex-shrink: 0;
  stroke-width: 1px;
  background-color: ${({ theme }) => theme.colors.gray300};
`;
