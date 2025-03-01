import styled from 'styled-components';
//import AppleIcon from '@/assets/svg/SignUpPage/AppleIconSVG.svg?react';
import Email from '@/assets/svg/SignUpPage/EmailSVG.svg?react';
import GoogleLoginButton from './GooleLoginButton';

interface SignUpWithOtherEmailProps {
  onChangeStep: (step?: number) => void;
  isChecked: boolean;
}

export default function SignUpWithOtherEmail({
  onChangeStep,
  isChecked
}: SignUpWithOtherEmailProps) {
  return (
    <SignUpWithOtherEmailWrapper>
      <GoogleLoginButton isChecked={isChecked} text="Sign up with Google" />

      {/* <BlackButtonWrapper>
        <AppleIconStyled />
        <span>Sign up with Apple</span>
      </BlackButtonWrapper> */}

      <GrayButtonWrapper onClick={() => onChangeStep()}>
        <EmailIconStyled />
        <span>Sign up with Email</span>
      </GrayButtonWrapper>
    </SignUpWithOtherEmailWrapper>
  );
}

const SignUpWithOtherEmailWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 17.1rem;
`;

// const BlackButtonWrapper = styled.div`
//   cursor: pointer;
//   width: 38.6rem;
//   height: 3.8rem;
//   flex-shrink: 0;
//   border-radius: 24px;
//   background: ${({ theme }) => theme.colors.gray800};
//   display: flex;
//   justify-content: center;
//   align-items: center;

//   > span {
//     width: 176px;
//     color: ${({ theme }) => theme.colors.gray50};
//     text-align: center;
//     font-size: 15px;
//     font-style: normal;
//     font-weight: 300;
//     line-height: normal;
//     letter-spacing: -0.45px;
//   }
// `;

const GrayButtonWrapper = styled.div`
  cursor: pointer;
  width: 100%;
  max-width: 36.6rem;
  height: 38px;
  flex-shrink: 0;
  border-radius: 24px;
  background: ${({ theme }) => theme.colors.backgroundBase};
  display: flex;
  justify-content: center;
  align-items: center;

  > span {
    width: 154px;
    color: ${({ theme }) => theme.colors.gray800};
    text-align: center;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: -0.3px;
  }
`;

// const AppleIconStyled = styled(AppleIcon)`
//   path {
//     fill: ${({ theme }) => theme.colors.gray50};
//   }
// `;

const EmailIconStyled = styled(Email)`
  path {
    fill: ${({ theme }) => theme.colors.gray900};
  }
`;
