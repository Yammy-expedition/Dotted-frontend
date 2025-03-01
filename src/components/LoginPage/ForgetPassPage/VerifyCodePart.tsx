import { usePasswordResetEmail } from '@/hooks/usePasswordResetEmail';
import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';

interface VerifyCodePartProps {
  email: string;
  onChangeStep: () => void;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
}

export default function VerifyCodePart({
  email,
  onChangeStep,
  code,
  setCode
}: VerifyCodePartProps) {
  const emailMutation = usePasswordResetEmail((data) => {
    // console.log('응답 데이터:', data);
    if (data.status === 200) {
      onChangeStep(); // ✅ 다음 단계로 이동
    }
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    emailMutation.mutate(email);
  };

  const verifyMutation = useMutation({
    mutationFn: () => verifyCodeRequest(email, code),
    onSuccess: () => {
      // console.log('Verification successful');
      alert('Verified');
      onChangeStep(); // ✅ 다음 단계로 이동
    },
    onError: (error: any) => {
      console.error('Verification error:', error.message);
      alert('Invalid verification code or expired code.');
    }
  });

  const onClickVerify = () => {
    verifyMutation.mutate();
  };

  async function verifyCodeRequest(email: string, code: string) {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/api/user/password-reset/verify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Verification failed');
    }

    return response.json();
  }

  return (
    <VerifyCodePartWrapper>
      <CodeInput
        placeholder="enter the verify code"
        required={true}
        value={code}
        onChange={(e: any) => setCode(e.target.value)}
      />
      <VerifyButton onClick={onClickVerify}>
        {verifyMutation.isPending ? 'Verifying...' : 'Verify Email'}
      </VerifyButton>
      <ResendButton onClick={handleSubmit}>
        {emailMutation.isPending ? 'Resending...' : 'Resend Code'}
      </ResendButton>
    </VerifyCodePartWrapper>
  );
}

const VerifyCodePartWrapper = styled.div`
  width: 100%;
`;

const CodeInput = styled.input`
  padding-left: 2.3rem;
  margin-bottom: 2.3rem;
  width: 100%;
  height: 5rem;

  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  background: ${({ theme }) => theme.colors.gray100};

  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 36px; /* 180% */
  letter-spacing: -0.6px;
`;

const VerifyButton = styled.button`
  cursor: pointer;
  width: 100%;
  height: 5rem;
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.purple600};
  color: ${({ theme }) => theme.colors.gray50};
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 36px; /* 180% */
  letter-spacing: -1px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
`;

const ResendButton = styled.div`
  cursor: pointer;
  margin-top: 3.8rem;
  color: ${({ theme }) => theme.colors.purple600};
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.8px;
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: auto;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
`;
