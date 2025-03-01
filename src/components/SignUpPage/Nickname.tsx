import InputBox from './InputBox';
import Label from './Label';
import Input from './Input';
import NicknameSVG from '@/assets/svg/SignUpPage/NicknameSVG.svg?react';
import styled from 'styled-components';
import { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { SignUpFormData } from '@/types/signUpFormData';
import VerificationCheckButton from './VerificationCheckButton';
import ErrorMsg from './ErrorMsg';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import NiceMsg from './NiceMsg';

interface NicknameProps {
  register: UseFormRegister<SignUpFormData>;
  watch: UseFormWatch<SignUpFormData>;
}

const checkNickname = async (
  nickname: string,
  toggleChecked: () => void,
  setMsg: React.Dispatch<React.SetStateAction<string>>
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/api/user/nickname-check?nickname=${nickname}`
  );

  if (!response.ok) {
    setMsg('Invalid nickname or already in use.');
    throw new Error('유효하지 않은 닉네임 또는 이미 사용 중인 닉네임');
  }

  toggleChecked();
  const data = await response.json();
  // console.log(data);
  return data;
};

export default function Nickname({ register, watch }: NicknameProps) {
  const nickname = watch('nickname');
  const defaultMsg = 'You need to verify the nickname.';

  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [initialIsFine, setInitialIsFine] = useState(false);
  const [msg, setMsg] = useState(defaultMsg);
  const mountRef = useRef(false);

  const toggleChecked = () => {
    setIsNicknameChecked(true);
  };

  const isVaild = nickname !== '';

  const { isLoading, refetch } = useQuery({
    queryKey: ['nicknameCheck'], // Remove nickname from queryKey
    queryFn: () => checkNickname(nickname, toggleChecked, setMsg),
    enabled: false,
    staleTime: 5000,
    retry: false // Prevent automatic retries
  });

  useEffect(() => {
    if (!mountRef.current) {
      mountRef.current = true;
      return;
    }
    setInitialIsFine(true);
    setIsNicknameChecked(false);
    setMsg(defaultMsg);
  }, [nickname]);

  useEffect(() => {
    // console.log(isVaild, initialIsFine, !isNicknameChecked);
  }, [nickname]);

  const onClickVerificationCheck = () => {
    if (!nickname.trim()) {
      alert('Please write down your nickname');
      return;
    }

    refetch().catch((err) => {
      console.error('Nickname check failed:', err);
    });
  };
  return (
    <InputBox>
      <Label name="nickname">
        <div>
          <NicknameSVG /> <span>Nickname</span>
        </div>

        <SubText>You can change your nickname anytime</SubText>
      </Label>

      <Wrapper>
        <Input
          type="text"
          placeholder="nickname"
          {...register('nickname', { required: 'Please your nickname' })}
        />
        <VerificationCheckButton
          onClickVerificationCheck={onClickVerificationCheck}
          isLoading={isLoading}
        />
      </Wrapper>
      {(isVaild && initialIsFine && !isNicknameChecked) ||
      (initialIsFine && !isNicknameChecked) ? (
        <ErrorMsg msg={msg} />
      ) : null}

      {isNicknameChecked && isVaild ? <NiceMsg msg="Verified" /> : null}
    </InputBox>
  );
}

const SubText = styled.span`
  margin-left: 2rem;
  color: ${({ theme }) => theme.colors.gray400};
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: 36px; /* 225% */
  letter-spacing: -0.48px;

  @media (max-width: 460px) {
    display: none;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  position: relative;

  display: flex;
`;
