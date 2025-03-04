import styled from 'styled-components';
import Greeting from '../common/Login,SignUp/Greeting';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import Divider from '../common/Login,SignUp/Divider';
import LoginWithOtherEmail from './LoginWithOtherEmail';

import SignUpPropmpt from './SignUpPropmpt';
import Eye from '@/assets/svg/LoginPage/Eye.svg?react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ErrorMsg from '../SignUpPage/ErrorMsg';
import { useMutation } from '@tanstack/react-query';

export interface LoginProps {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [eyeOn, setEyeOn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit
  } = useForm<LoginProps>();

  const emailValue = watch('email');
  const passwordValue = watch('password');

  const navigate = useNavigate();

  const onClickEyeOn = () => {
    setEyeOn(!eyeOn);
  };

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_DOMAIN}/api/user/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: emailValue,
            password: passwordValue,
            remember_me: rememberMe
          })
        }
      );

      if (!response.ok) {
        throw new Error('로그인 실패');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // console.log(data);
      window.localStorage.setItem('accessToken', data.access);
      window.localStorage.setItem('refreshToken', data.refresh);
      navigate('/');
    },
    onError: (error) => {
      console.error('❌ 로그인 실패:', error);
      alert('Login failed.');
    }
  });

  const onClickLogin = () => {
    if (emailValue !== '' && passwordValue !== '') loginMutation.mutate();
  };

  return (
    <LoginFormWrapper onSubmit={handleSubmit(onClickLogin)}>
      <Greeting text="Login to Dotted" />
      <EmailInputWrapper>
        <EmailInput register={register} />
        {errors.email && <ErrorMsg msg={errors.email.message} />}
      </EmailInputWrapper>

      <PasswordWrapper>
        <div>
          <PasswordInput eyeOn={eyeOn} register={register} />
          <EyeStyled $eyeOn={eyeOn} onClick={onClickEyeOn} />
        </div>

        {errors.password && <ErrorMsg msg={errors.password.message} />}
      </PasswordWrapper>

      <OptionBox>
        <div>
          <StyledCheckBox
            checked={rememberMe}
            onChange={() => setRememberMe((prev) => !prev)}
          />
          <span>Remember me</span>
        </div>
        <ForgetPassword onClick={() => navigate('forgetpass')}>
          forget password?
        </ForgetPassword>
      </OptionBox>

      <LoginButtonWrapper>
        <LoginButton type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </LoginButton>
      </LoginButtonWrapper>

      <DividerWrapper>
        <Divider />
      </DividerWrapper>

      <LoginWithOtherEmail />

      <SignUpPropmpt />
    </LoginFormWrapper>
  );
}

const DividerWrapper = styled.div`
  width: 100%;
  padding: 0 2rem;
`;

const LoginButtonWrapper = styled.div`
  padding: 0 2rem;
  width: 100%;
  max-width: 38.6rem;
`;

const LoginFormWrapper = styled.form`
  padding-top: 5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 17.1rem;
`;

const PasswordWrapper = styled.div`
  width: 100%;
  max-width: 60.5rem;
  padding: 0 2rem;
  > div {
    position: relative;
  }
`;

const EyeStyled = styled(Eye)<{ $eyeOn: boolean }>`
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 2rem;

  transform: translateY(-50%);

  g {
    path {
      stroke: ${({ theme, $eyeOn }) => ($eyeOn ? theme.colors.purple1000 : '')};
    }
  }
`;

const OptionBox = styled.div`
  display: flex;
  position: relative;
  gap: 5.1rem;
  margin-top: 2.1rem;
  margin-bottom: 2.9rem;

  @media (max-width: 440px) {
    /* flex-direction: column; */
    gap: 1rem;
  }

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    > span {
      color: ${({ theme }) => theme.colors.gray800};
      font-size: 1.6rem;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -0.8px;
    }
  }
`;

const StyledCheckBox = styled.input.attrs({ type: 'checkbox' })`
  cursor: pointer;
  width: 1.9rem;
  height: 1.9rem;
  margin: 0;
  accent-color: ${({ theme }) => theme.colors.purple600};
`;

const ForgetPassword = styled.div`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.purple600};
  font-size: 1.6rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.6px;
  text-decoration-line: underline;
  text-underline-position: from-font;
`;

const LoginButton = styled.button`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  width: 100%;
  height: 3.8rem;
  flex-shrink: 0;
  border-radius: 24px;
  background: ${({ theme, disabled }) =>
    disabled ? theme.colors.gray500 : theme.colors.purple1050};
  color: ${({ theme }) => theme.colors.gray50};
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.6px;
  margin-bottom: 0.7rem;
  transition: background 0.3s;
`;

const EmailInputWrapper = styled.div`
  margin-bottom: 1.1rem;
  width: 100%;
  max-width: 60.5rem;
  padding: 0 2rem;
`;
