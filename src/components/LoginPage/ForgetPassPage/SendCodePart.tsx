import ErrorMsg from '@/components/SignUpPage/ErrorMsg';
import { usePasswordResetEmail } from '@/hooks/usePasswordResetEmail';
import styled from 'styled-components';

interface SendCodePartProps {
  onChangeStep: () => void;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

export default function SendCodePart({
  onChangeStep,
  email,
  setEmail
}: SendCodePartProps) {
  // ✅ `onSuccess`에서 status가 200이면 `onChangeStep()` 실행
  const mutation = usePasswordResetEmail((data) => {
    // console.log('응답 데이터:', data);
    if (data.status === 200) {
      onChangeStep(); // ✅ 다음 단계로 이동
    }
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(email);
  };
  return (
    <SendCodePartWrapper>
      <EmailInput
        placeholder="email@address.com"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required={true}
      />
      <SendCodeButton onClick={handleSubmit} disabled={mutation.isPending}>
        {mutation.isPending ? 'Sending...' : 'Send Code'}
      </SendCodeButton>
      {/* ✅ API 응답 메시지 표시 */}-
      {mutation.isError && <ErrorMsg msg="This email is not registered." />}
    </SendCodePartWrapper>
  );
}

const SendCodePartWrapper = styled.div`
  width: 100%;
`;

const EmailInput = styled.input`
  padding-left: 2.3rem;
  margin-bottom: 2.3rem;
  width: 100%;
  height: 5rem;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  background: ${({ theme }) => theme.colors.gray100};
  font-size: 20px;
`;

const SendCodeButton = styled.button`
  cursor: pointer;
  width: 100%;
  height: 5rem;
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.purple600};
  color: ${({ theme }) => theme.colors.gray50};
  font-size: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
`;
