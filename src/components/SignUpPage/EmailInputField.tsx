import styled from 'styled-components';
import SendCodeButton from './SendCodeButton';
import { UseFormRegister } from 'react-hook-form';
import { SignUpFormData } from '@/types/signUpFormData';
import ErrorMsg from './ErrorMsg';

interface isSogangEmail {
  loading: boolean;
  isError: boolean;
  isSogangEmail: boolean;
  isSendCodeClicked: boolean;
  isSubmitClicked: boolean;
  onClickSendCodeButton: () => void;
  register: UseFormRegister<SignUpFormData>;
}

export default function EmailInputField({
  loading,
  isError,
  isSogangEmail,
  isSendCodeClicked,
  isSubmitClicked,
  onClickSendCodeButton,
  register
}: isSogangEmail) {
  const emailText = isSogangEmail
    ? 'Sogang University Email Address (ID)'
    : 'Email Address (ID)';
  const emailDomain = isSogangEmail ? '@sogang.ac.kr' : null;
  const emailPlaceholder = isSogangEmail ? 'email' : 'email@address.com';

  return (
    <EmailInputFieldWrapper>
      <div>
        <Title>{emailText}</Title>
        <EmailInput $isSogangEmail={isSogangEmail}>
          <label htmlFor="email">
            <input
              id="email"
              type={isSogangEmail ? 'text' : 'email'}
              placeholder={emailPlaceholder}
              {...register('email', {
                required: 'Plaese write down your email'
              })}
              readOnly={isSendCodeClicked}
            />
          </label>
          {emailDomain ? <span>{emailDomain}</span> : null}
        </EmailInput>
      </div>

      {isError && <ErrorMsg msg="Already registered email" />}
      <SendCodeButton
        loading={loading}
        isSendCodeClicked={isSendCodeClicked}
        isSubmitClicked={isSubmitClicked}
        onClickSendCodeButton={onClickSendCodeButton}
      />
    </EmailInputFieldWrapper>
  );
}

const Title = styled.span`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 36px; /* 200% */
  letter-spacing: -0.9px;
`;

const EmailInputFieldWrapper = styled.div`
  width: 100%;
  margin-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  > div {
    width: 100%;
    max-width: 60.5rem;
  }
`;

const EmailInput = styled.div<{ $isSogangEmail: boolean }>`
  display: flex;
  gap: 2rem;
  align-items: center;
  width: 100%;
  > label {
    width: 100%;
    input {
      padding-left: 2.3rem;
      width: 100%;
      height: 5rem;
      flex-shrink: 0;
      border-radius: 5px;
      border: 1px solid ${({ theme }) => theme.colors.gray300};
      background: ${({ theme }) => theme.colors.gray100};

      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: 36px; /* 180% */
      letter-spacing: -0.6px;
      outline: none;
    }
  }

  > span {
    color: ${({ theme }) => theme.colors.gray700};

    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 36px; /* 180% */
    letter-spacing: -0.6px;
  }
`;
