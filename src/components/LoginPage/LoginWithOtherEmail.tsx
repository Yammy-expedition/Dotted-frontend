import styled from 'styled-components';
//import AppleIcon from '@/assets/svg/SignUpPage/AppleIconSVG.svg?react';
import GoogleLoginButton from '../SignUpPage/GooleLoginButton';

export default function LoginWithOtherEmail() {
  return (
    <LoginWithOtherEmailWrapper>
      <GoogleLoginButton isChecked={true} text="Continue with Google" />

      {/* <BlackButtonWrapper>
        <AppleIconStyled />
        <span>Continue with Apple</span>
      </BlackButtonWrapper> */}
    </LoginWithOtherEmailWrapper>
  );
}

const LoginWithOtherEmailWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.8rem;
  padding: 0 2rem;
`;

// const BlackButtonWrapper = styled.div`
//   cursor: pointer;
//   width: 386px;
//   height: 38px;
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

// const AppleIconStyled = styled(AppleIcon)`
//   path {
//     fill: ${({ theme }) => theme.colors.gray50};
//   }
// `;
