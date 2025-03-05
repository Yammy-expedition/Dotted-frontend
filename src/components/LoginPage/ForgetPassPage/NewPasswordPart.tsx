import { useState } from 'react';
import styled from 'styled-components';
import Eye from '@/assets/svg/LoginPage/Eye.svg?react';
import ErrorMsg from '@/components/SignUpPage/ErrorMsg';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface NewPasswordPartProps {
  email: string;
}

async function changePasswordRequest(email: string, newPassword: string) {
  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/api/user/password-reset/change`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, new_password: newPassword })
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Password reset failed');
  }

  return response.json();
}

export default function NewPasswordPart({ email }: NewPasswordPartProps) {
  const navigate = useNavigate();
  const [eyeOn, setEyeOn] = useState(false);
  const onClickEyeOn = () => {
    setEyeOn(!eyeOn);
  };

  const [eyeOn2, setEyeOn2] = useState(false);
  const onClickEyeOn2 = () => {
    setEyeOn2(!eyeOn2);
  };

  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');

  const isVaild =
    (newPassword !== '' || newPassword !== null) &&
    newPassword === newPasswordCheck;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isLengthValid = newPassword.length >= 7 && newPassword.length <= 15;

  const mutation = useMutation({
    mutationFn: () => changePasswordRequest(email, newPassword),
    onSuccess: () => {
      alert('Password has been changed successfully.');
      navigate('/login');
    },
    onError: (error: any) => {
      console.error('Password change error:', error.message);
      alert('This password is too common. Please choose another one.');
    }
  });

  // 이전 코드와 동일하게 7~15자 및 특수문자 포함 여부 검사
  const validatePassword = (password: string) => {
    if (password.length < 7 || password.length > 15) {
      alert('Password must be between 7 and 15 characters long.');
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      alert('Password must include at least one special character.');
      return false;
    }
    return true; // 유효성 검사 통과
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) {
      return;
    }

    if (newPassword !== newPasswordCheck) {
      alert('Password does not match.');
      return;
    }
    mutation.mutate();
  };

  return (
    <NewPasswordPartWrapper onSubmit={handleSubmit}>
      <InputWrapper>
        <Label htmlFor="password">New Password</Label>
        <div style={{ width: '100%', position: 'relative' }}>
          <Input
            type={eyeOn ? 'text' : 'password'}
            name="password"
            id="password"
            placeholder="●●●●●●●●●●"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <EyeStyled $eyeOn={eyeOn} onClick={onClickEyeOn} />
        </div>
      </InputWrapper>
      {!isLengthValid && !isVaild && (
        <ErrorMsg msg="Password must be between 7 and 15 characters" />
      )}
      {!hasSpecialChar && !isVaild && (
        <ErrorMsg msg="Password must include at least one special character" />
      )}
      <InputWrapper>
        <Label htmlFor="passwordCheck">New Password Check</Label>
        <div style={{ width: '100%', position: 'relative' }}>
          <Input
            type={eyeOn2 ? 'text' : 'password'}
            name="passwordCheck"
            id="passwordCheck"
            placeholder="●●●●●●●●●●"
            value={newPasswordCheck}
            onChange={(e) => setNewPasswordCheck(e.target.value)}
          />
          <EyeStyled $eyeOn={eyeOn2} onClick={onClickEyeOn2} />
        </div>
      </InputWrapper>

      <ErrorWrapper>
        {newPassword !== '' &&
          newPasswordCheck !== '' &&
          newPassword !== newPasswordCheck && (
            <ErrorMsg msg="Password does not match" />
          )}
      </ErrorWrapper>

      <SubmitButton type="submit">
        {mutation.isPending ? 'Submitting...' : 'Submit'}
      </SubmitButton>
    </NewPasswordPartWrapper>
  );
}

const ErrorWrapper = styled.div`
  margin-bottom: 1.8rem;
`;

const NewPasswordPartWrapper = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-top: 1.8rem;
`;

const Label = styled.label`
  width: 100%;
  color: ${({ theme }) => theme.colors.gray700};
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: 36px;
  letter-spacing: -0.8px;
`;

const Input = styled.input`
  padding-left: 2.3rem;
  width: 100%;
  height: 5rem;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  background: ${({ theme }) => theme.colors.gray100};
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 36px;
  letter-spacing: -0.6px;
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

const SubmitButton = styled.button`
  cursor: pointer;
  width: 100%;
  height: 5rem;
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.purple600};
  border: none;
  color: ${({ theme }) => theme.colors.gray50};
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 36px;
  letter-spacing: -1px;
`;
