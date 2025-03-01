import styled from 'styled-components';

interface SogangSignUpButtonProps {
  onChangeStep: () => void;
  onChangeIsSogangEmail: () => void;
}

export default function SogangSignUpButton({
  onChangeStep,
  onChangeIsSogangEmail
}: SogangSignUpButtonProps) {
  const onClickSignUpButton = () => {
    onChangeStep();
    onChangeIsSogangEmail();
  };
  return (
    <SignUpButtonBox onClick={onClickSignUpButton}>
      <SignUpText>Sign up with Sogang Email</SignUpText>
    </SignUpButtonBox>
  );
}

const SignUpButtonBox = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 38.6rem;
  height: 38px;
  flex-shrink: 0;
  border-radius: 24px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.purple1050} 27.87%,
    ${({ theme }) => theme.colors.purple600} 98.12%
  );
`;

const SignUpText = styled.p`
  color: ${({ theme }) => theme.colors.gray50};
  text-align: center;
  font-size: 1.7rem;

  @media (max-width: 400px) {
    font-size: 1.5rem;
  }
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.6px;
`;
