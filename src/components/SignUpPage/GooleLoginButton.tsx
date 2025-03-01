import styled from 'styled-components';
import GoogleIcon from '@/assets/svg/SignUpPage/GoogleIconSVG.svg?react';

const GoogleLoginButton = ({
  isChecked,
  text
}: {
  isChecked: boolean;
  text: string;
}) => {
  const GOOGLE_CLIENT_ID =
    '27893795025-99ide3g469se39f3pba1mofvirpjmhri.apps.googleusercontent.com'; // 여기에 실제 Google Client ID 입력
  // const REDIRECT_URI = 'http://localhost:3000/user/login/google/callback';
  const REDIRECT_URI = `${import.meta.env.VITE_API_DOMAIN}/user/login/google/callback`;
  const SCOPE =
    'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';

  const handleGoogleLogin = () => {
    if (!isChecked) {
      alert('Please agree to the terms and conditions.');
      return;
    }

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;

    // 구글 로그인 페이지로 리다이렉트
    window.location.href = googleAuthUrl;
  };

  return (
    <BlackButtonWrapper onClick={handleGoogleLogin}>
      <GoogleIconStyled />
      <span>{text}</span>
    </BlackButtonWrapper>
  );
};

export default GoogleLoginButton;

const BlackButtonWrapper = styled.div`
  cursor: pointer;
  width: 100%;
  max-width: 36.6rem;
  height: 3.8rem;
  flex-shrink: 0;
  border-radius: 24px;
  background: ${({ theme }) => theme.colors.gray800};
  display: flex;
  justify-content: center;
  align-items: center;

  > span {
    width: 176px;
    color: ${({ theme }) => theme.colors.gray50};
    text-align: center;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: -0.45px;
  }
`;

const GoogleIconStyled = styled(GoogleIcon)``;
