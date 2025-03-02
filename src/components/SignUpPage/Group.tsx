import { useEffect, useState } from 'react';
import InputBox from './InputBox';
import Label from './Label';
import GroupSVG from '@/assets/svg/SignUpPage/GroupSVG.svg?react';
import styled from 'styled-components';
import { SignUpFormData } from '@/types/signUpFormData';
import { UseFormSetValue } from 'react-hook-form';

interface GroupProps {
  setValue: UseFormSetValue<SignUpFormData>;
}

export default function Group({ setValue }: GroupProps) {
  const [selectedGroup, setSelectedGroup] = useState({
    full: 'International Student',
    short: 'INTER'
  });

  useEffect(() => {
    setValue('student_type', selectedGroup.short);
  }, [selectedGroup]);
  return (
    <InputBox>
      <Label name="student_type">
        <GroupSVG /> Select your Group
      </Label>
      <GroupWrapper>
        {[
          { full: 'International Student', short: 'INTER' },
          { full: 'Exchange Student', short: 'EXCHANGE' },
          { full: 'Language Education Center', short: 'LANGUAGE' },
          { full: 'Others(Indcluding Korean Students)', short: 'OTHER' }
        ].map((item, idx) => (
          <RadioLabel key={idx}>
            <RadioInput
              type="radio"
              name="student_type"
              value={item.short}
              checked={selectedGroup.short === item.short}
              onChange={() => setSelectedGroup(item)}
            />
            {item.full}
          </RadioLabel>
        ))}
      </GroupWrapper>
    </InputBox>
  );
}

const GroupWrapper = styled.div`
  padding: 1.1rem;
  width: 100%;
  max-width: 39.8rem;

  flex-shrink: 0;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  background: ${({ theme }) => theme.colors.gray100};
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center; /* 라디오 버튼과 텍스트를 세로 중앙 정렬 */
  gap: 0.5rem; /* 라디오 버튼과 텍스트 사이 여백 */
  margin-right: 1.2rem;
  color: ${({ theme }) => theme.colors.gray600};
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 34px; /* 212.5% */
  letter-spacing: -0.64px;

  @media (max-width: 460px) {
    font-size: 13px;
  }
`;

const RadioInput = styled.input.attrs({ type: 'radio' })`
  appearance: none; /* 기본 라디오 버튼 숨김 */
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 3px solid #fff; /* 기본 테두리 */
  box-shadow: 0 0 0 1px #111; /* 바깥 라인 */
  background-color: #fff;
  transition: all 0.3s ease-in-out;

  &:checked {
    background-color: #fff; /* 내부 원 */
    border: 4.5px solid ${({ theme }) => theme.colors.purple600}; /* 내부와 외부 테두리 사이 색상 */
    box-shadow: 0 0 0 1px #6e6e6e; /* 바깥 라인 유지 */
  }
`;
