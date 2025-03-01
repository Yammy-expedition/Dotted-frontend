import styled from 'styled-components';
import Recomended from './Recomended';
import MainText from './MainText';
import SogangSignUpButton from './SogangSignUpButton';
import CreateEmailButton from './CreateEmailButton';

interface SignUpWithSogangEmailProps {
  onChangeStep: () => void;
  onChangeIsSogangEmail: () => void;
}

export default function SignUpWithSogangEmail({
  onChangeStep,
  onChangeIsSogangEmail
}: SignUpWithSogangEmailProps) {
  return (
    <SogangEmailContainer>
      <SogangEmailWrapper>
        <Recomended />

        <MainText />

        <ButtonBoxWrapper>
          <SogangSignUpButton
            onChangeStep={onChangeStep}
            onChangeIsSogangEmail={onChangeIsSogangEmail}
          />
          <CreateEmailButton />
        </ButtonBoxWrapper>
      </SogangEmailWrapper>
    </SogangEmailContainer>
  );
}

const SogangEmailContainer = styled.div`
  width: 100%;
  max-width: 66rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SogangEmailWrapper = styled.div`
  margin-top: 2rem;
  margin-bottom: 2.7rem;
  position: relative;
  width: 100%;
  height: 23.3rem;
  flex-shrink: 0;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.opacity63};
`;

const ButtonBoxWrapper = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  gap: 1.9rem;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  @media (max-width: 400px) {
    gap: 1rem;
  }
`;
