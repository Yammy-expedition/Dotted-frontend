import BackButton from '@/components/common/Login,SignUp/BackButton';
import SignUpForm from '@/components/SignUpPage/SignUpForm';
import PageLayout from '@/components/common/Login,SignUp/PageLayout';
import EmailVerification from '@/components/SignUpPage/EmailVerification';
import styled from 'styled-components';
import PersonalInformation from '@/components/SignUpPage/PersonalInformation';
import StudentVerification from '@/components/SignUpPage/StudentVerification';
import SignUpComplete from '@/components/SignUpPage/SignUpComplete';
import { useSignUpModal } from '@/hooks/useSignUpModal';
import useSignUp from '@/hooks/useSignUp';
import SignUpModal from '@/components/SignUpPage/SignUpModal';

export default function SignUpPage() {
  const {
    step,
    isSogangEmail,
    isCheckedTOS,
    isCheckedPP,
    handleSubmit,
    onSubmitSignUp,
    onChangeStep,
    onChangeIsSogangEmail,
    onChangeCheckedTos,
    onChangeCheckedPP,
    register,
    setValue,
    watch
  } = useSignUp();

  const { isModalOpen, closeModal, onClickLater, onClickNow } = useSignUpModal(
    step,
    isSogangEmail
  );

  const login_type = watch('login_type');

  return (
    <SignUpPageWrapper onSubmit={handleSubmit(onSubmitSignUp)}>
      {step === 1 && <PageLayout />}

      {!((step === 4 && isSogangEmail) || step === 5) && <BackButton />}

      {step === 1 && (
        <SignUpForm
          onChangeStep={onChangeStep}
          onChangeIsSogangEmail={onChangeIsSogangEmail}
          onChangeCheckedTos={onChangeCheckedTos}
          onChangeCheckedPP={onChangeCheckedPP}
          isCheckedTOS={isCheckedTOS}
          isCheckedPP={isCheckedPP}
        />
      )}

      {step >= 2 && step <= 3 && <SignUpTitle>Sign Up</SignUpTitle>}

      {step === 2 && (
        <EmailVerification
          setValue={setValue}
          isSogangEmail={isSogangEmail}
          onChangeStep={onChangeStep}
          register={register}
          watch={watch}
        />
      )}

      {step === 3 && (
        <PersonalInformation
          isSogangEmail={isSogangEmail}
          register={register}
          watch={watch}
          setValue={setValue}
          loginType={login_type}
        />
      )}

      {step === 4 && !isSogangEmail && (
        <>
          <SignUpModal
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            onClickLater={onClickLater}
            onClickNow={onClickNow}
          />
          <StudentVerification onChangeStep={onChangeStep} watch={watch} />
        </>
      )}

      {((step === 4 && isSogangEmail) || step === 5) && <SignUpComplete />}
    </SignUpPageWrapper>
  );
}

const SignUpPageWrapper = styled.form`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.backgroundLayer2};
`;

const SignUpTitle = styled.p`
  color: ${({ theme }) => theme.colors.gray800};
  text-align: center;
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -2px;
  margin-bottom: 2.6rem;
  padding-top: 5rem;
  @media (max-width: 400px) {
    font-size: 3rem;
  }
`;
