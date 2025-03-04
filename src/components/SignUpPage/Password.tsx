import InputBox from './InputBox';
import Label from './Label';
import Input from './Input';
import ErrorMsg from './ErrorMsg';
import PasswordKey from '@/assets/svg/SignUpPage/PasswordKeySVG.svg?react';
import { SignUpFormData } from '@/types/signUpFormData';
import { UseFormRegister, UseFormWatch } from 'react-hook-form';

interface PasswordProps {
  register: UseFormRegister<SignUpFormData>;
  watch: UseFormWatch<SignUpFormData>;
}

export default function Password({ register, watch }: PasswordProps) {
  const password = watch('password') || '';
  const passwordCheck = watch('passwordCheck') || '';

  const isVaild =
    (password !== '' || password !== null) && password === passwordCheck;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLengthValid = password.length >= 7 && password.length <= 15;
  return (
    <>
      <InputBox>
        <Label name="password">
          <PasswordKey /> <span>Password</span>
        </Label>

        <Input
          type="password"
          placeholder="password"
          {...register('password', {
            required: 'Plaese write down your password',
            minLength: {
              value: 7,
              message: 'Password must be at least 7 characters long'
            },
            maxLength: {
              value: 15,
              message: 'Password must be at most 15 characters long'
            },
            validate: {
              hasSpecialChar: (value) =>
                /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                'Password must include at least one special character'
            }
          })}
        />
        {!isLengthValid && !isVaild && (
          <ErrorMsg msg="Password must be between 7 and 15 characters" />
        )}
        {!hasSpecialChar && !isVaild && (
          <ErrorMsg msg="Password must include at least one special character" />
        )}
      </InputBox>

      <InputBox>
        <Label name="passwordCheck">
          <PasswordKey /> <span>Password Check</span>
        </Label>
        <Input
          type="password"
          placeholder="password"
          {...register('passwordCheck', {
            required: 'Plaese write down your password check'
          })}
        />

        {isVaild ? null : <ErrorMsg msg="Password does not match" />}
      </InputBox>
    </>
  );
}
