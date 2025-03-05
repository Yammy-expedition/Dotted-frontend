import { useState } from 'react';
import styled from 'styled-components';
import HeadContent from './HeadContent';
import Email from '@/assets/svg/LoginPage/Email.svg?react';
import Icon from './Icon';
import Unlock from '@/assets/svg/SignUpPage/UnlockSVG.svg?react';
import PasswordKey from '@/assets/svg/LoginPage/PasswordKey.svg?react';
import SendCodePart from './SendCodePart';
import VerifyCodePart from './VerifyCodePart';
import NewPasswordPart from './NewPasswordPart';

const firstSectionProps = {
  title: 'Forget Password',
  icon: <Icon icon={<Email />} />,
  text: 'Please Enter Your Email Address To \nReceive a Verification Code '
};

const secondSectionProps = {
  title: 'Enter Code',
  icon: <Icon icon={<Unlock />} />,
  text: 'Please Enter The Code \nSent to Your Email. '
};

const thirdSectionProps = {
  title: 'Create New Password Code',
  icon: <Icon icon={<PasswordKey />} />,
  text: 'Your New Password Must Be Different \nfrom Previously Used Password. '
};

export default function ForgetPassForm() {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');

  const onChangeStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const currentSectionProps =
    step === 1
      ? firstSectionProps
      : step === 2
        ? secondSectionProps
        : thirdSectionProps;

  const currentSectionPart =
    step === 1 ? (
      <SendCodePart
        onChangeStep={onChangeStep}
        email={email}
        setEmail={setEmail}
      />
    ) : step === 2 ? (
      <VerifyCodePart
        email={email}
        onChangeStep={onChangeStep}
        code={code}
        setCode={setCode}
      />
    ) : (
      <NewPasswordPart email={email} />
    );

  return (
    <ForgetPassContainer>
      <ForgetPassFormWrapper>
        <HeadContent {...currentSectionProps} />
        {currentSectionPart}
      </ForgetPassFormWrapper>
    </ForgetPassContainer>
  );
}
const ForgetPassContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 2rem;
  padding-top: 10rem;
`;

const ForgetPassFormWrapper = styled.div`
  width: 100%;
  max-width: 60.5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12rem;
`;
