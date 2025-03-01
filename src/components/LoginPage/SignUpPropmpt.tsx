import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function SignUpPropmpt() {
  const navigate = useNavigate();
  return (
    <SignUpPropmpWrapper>
      <Text>Don't have an account?</Text>
      <GoToSignUp onClick={() => navigate('/sign-up')}>Sign Up →</GoToSignUp>
    </SignUpPropmpWrapper>
  );
}

const SignUpPropmpWrapper = styled.div`
  display: flex;
  gap: 2.1rem;
  margin-bottom: 25rem;
  @media (max-width: 400px) {
    /* flex-direction: column; */
  }
`;

const Text = styled.span`
  color: ${({ theme }) => theme.colors.gray700};
  font-size: 1.6rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.8px;
`;

const GoToSignUp = styled.div`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.purple600};
  font-size: 1.6rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.8px;
  text-decoration: underline;
  @media (max-width: 400px) {
    display: flex;
    gap: 2rem;
    align-items: center;
    justify-content: center;
  }
`;
