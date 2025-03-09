import { SignUpFormData } from '@/types/signUpFormData';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

export default function useSignUp() {
  const { state } = useLocation();
  const [step, setStep] = useState(1);
  const [isSogangEmail, setIsSogangEmail] = useState(false);
  const [isCheckedTOS, setisCheckedTOS] = useState(false); // false
  const [isCheckedPP, setisCheckedPP] = useState(false); // false
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isChecked = isCheckedTOS && isCheckedPP;

  const { register, handleSubmit, watch, setValue } = useForm<SignUpFormData>();

  useEffect(() => {
    if (state) {
      // console.log(state);
      setisCheckedPP(true);
      setisCheckedTOS(true);
      setValue('email', state.email);
      setValue('login_type', state.login_type);
      setValue('name', state.name);
      setValue('social_id', state.social_id);
      setValue('password', state.social_id);
      setStep(3);
    }
  }, []);

  if (isModalOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }

  useEffect(() => {
    if (step === 4 && !isSogangEmail && !isModalOpen) {
      setIsModalOpen(true);
    }
  }, [step, isSogangEmail]);

  const signUpMutation = useMutation({
    mutationFn: async (userData: SignUpFormData) => {
      const { passwordCheck, ...dataToSend } = userData;

      if (!dataToSend.email.includes('@'))
        dataToSend.email = `${dataToSend.email}@sogang.ac.kr`;

      //console.log(dataToSend);

      // console.log(dataToSend);

      const response = await fetch(
        `${import.meta.env.VITE_API_DOMAIN}/api/user/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend)
        }
      );

      if (!response.ok) throw new Error('Failed to sign up');

      onChangeStep();
      return response.json();
    },
    onSuccess: () => {
      // console.log('🎉 회원가입 성공:', data);
      window.history.replaceState(null, '', '/login');
    },
    onError: (error) => {
      console.error('❌ 회원가입 실패:', error);
    }
  });

  const onChangeStep = (step: number = 1) => {
    if (isChecked) setStep((prevStep) => prevStep + step);
    else alert('Please agree to the terms and conditions. ');
  };

  const onChangeIsSogangEmail = () => {
    setIsSogangEmail(true);
  };

  const onChangeCheckedTos = () => {
    setisCheckedTOS(!isCheckedTOS);
  };
  const onChangeCheckedPP = () => {
    setisCheckedPP(!isCheckedPP);
  };

  const onSubmitSignUp = (data: SignUpFormData) => {
    signUpMutation.mutate(data);
  };

  return {
    step,
    isSogangEmail,
    isCheckedTOS,
    isCheckedPP,
    register,
    handleSubmit,
    watch,
    setValue,
    signUpMutation,
    onChangeStep,
    onChangeIsSogangEmail,
    onChangeCheckedTos,
    onChangeCheckedPP,
    onSubmitSignUp
  };
}
