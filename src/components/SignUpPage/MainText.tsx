import styled from 'styled-components';

export default function MainText() {
  return (
    <MainTextWrapper>
      <MainTextBox>
        Sign up with your Sogang email
        <br /> to complete registration and student verification simultaneously!
      </MainTextBox>
    </MainTextWrapper>
  );
}

const MainTextWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const MainTextBox = styled.p`
  width: 46.7rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray700};
  text-align: center;
  font-size: 16px;
  font-style: italic;
  font-weight: 400;
  line-height: 122.342%; /* 19.575px */
  letter-spacing: -0.48px;
`;
