import { useEffect, useState } from 'react';
import styled from 'styled-components';
import EmailInputField from './EmailInputField';
import VerifyCodeInputField from './VerifyCodeInputField';
import NextButton from './NextButton';
import { SignUpFormData } from '@/types/signUpFormData';
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

interface EmailVerificationProps {
  setValue: UseFormSetValue<SignUpFormData>;
  isSogangEmail: boolean;
  onChangeStep: () => void;
  register: UseFormRegister<SignUpFormData>;
  watch: UseFormWatch<SignUpFormData>;
}

export default function EmailVerification({
  setValue,
  isSogangEmail,
  onChangeStep,
  register,
  watch
}: EmailVerificationProps) {
  const [isSendCodeClicked, setIsSendCodeClicked] = useState(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [isError, setIsError] = useState(false);
  const [token, setToken] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const emailValue = watch('email');

  useEffect(() => {
    setValue('login_type', 'EMAIL');
  }, []);

  useEffect(() => {
    setIsError(false);
  }, [emailValue]);

  // ✅ 백엔드에 이메일 보내서 코드 받아오기
  const sendCodeMutation = useMutation({
    mutationFn: async (email: string) => {
      if (loading === true) {
        // console.log('sending...');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_DOMAIN}/api/user/email`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
          }
        );

        if (!response.ok) {
          setIsError(true);
          throw new Error('Failed to send verification code');
        }

        setIsSendCodeClicked(true);
        return await response.json();
      } catch (error) {
        setIsError(true);
        throw error; // onError 핸들러에서 처리됨
      } finally {
        setLoading(false); // 요청 성공/실패 여부와 관계없이 항상 실행됨
      }
    },
    onSuccess: (data) => {
      setToken(data.token); // 응답 데이터 저장
      // console.log('Verification code sent successfully!');
    },
    onError: (error) => {
      console.error(`Error: ${error.message}`);
    }
  });

  // ✅ 인증 코드 검증 요청 (백엔드로 token과 code 전송)
  const verifyCodeMutation = useMutation({
    mutationFn: async ({ code, token }: { code: string; token: string }) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_DOMAIN}/api/user/verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token: token, verification_code: code }) // code와 token을 백엔드로 전송
        }
      );
      if (!response.ok) throw new Error('Invalid verification code');
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitClicked(true); // 인증 성공 시 Next 버튼 표시
      alert('Email verified successfully!');
    },
    onError: (error) => {
      alert(`Verification failed: ${error.message}`);
    }
  });

  // ✅ 서강대/일반 이메일 확인 후 인증코드 요청하기기
  const onClickSendCodeButton = () => {
    if (isSubmitClicked) return;

    const emailDomain = '@sogang.ac.kr';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailValue === '') {
      alert('Please write down your email address');
      return;
    }

    if (!emailRegex.test(emailValue) && !isSogangEmail)
      alert('Please enter a valid email address.');

    const finalEmail = isSogangEmail
      ? `${emailValue}${emailDomain}`
      : emailValue;

    sendCodeMutation.mutate(finalEmail);
  };

  const onClickSubmit = () => {
    if (isSubmitClicked) return;
    if (!code) {
      alert('Please enter the verification code.');
      return;
    }
    verifyCodeMutation.mutate({ code, token });
  };

  const onChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };
  return (
    <EmailVerificationWrapper>
      <EmailInputField
        loading={loading}
        isError={isError}
        isSogangEmail={isSogangEmail}
        isSendCodeClicked={isSendCodeClicked}
        isSubmitClicked={isSubmitClicked}
        onClickSendCodeButton={onClickSendCodeButton}
        register={register}
      />

      {isSendCodeClicked && (
        <VerifyCodeInputField
          isSubmitClicked={isSubmitClicked}
          onClickSubmit={onClickSubmit}
          code={code}
          onChangeCode={onChangeCode}
        />
      )}

      {isSubmitClicked && <NextButton onChangeStep={onChangeStep} />}
    </EmailVerificationWrapper>
  );
}

const EmailVerificationWrapper = styled.section`
  width: 100%;
  margin-top: 3.2rem;

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 700px) {
    padding: 0 2rem;
  }

  > p {
    color: ${({ theme }) => theme.colors.gray800};
    text-align: center;
    font-size: 40px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: -2px;
  }
`;
