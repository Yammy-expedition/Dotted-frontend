import styled from 'styled-components';
import ErrorMsgSVG from '@/assets/svg/SignUpPage/ErrorMsgSVG.svg?react';

interface ErrorMsgProps {
  msg: string | undefined;
}

export default function ErrorMsg({ msg }: ErrorMsgProps) {
  return (
    <ErrorWrapper
      style={{
        marginLeft: '0.7rem',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <ErrorMsgSVG />
      <ErrorText>{msg}</ErrorText>
    </ErrorWrapper>
  );
}

const ErrorWrapper = styled.div`
  gap: 1rem;
  @media (max-width: 500px) {
    gap: 0.5rem;
  }
`;

const ErrorText = styled.span`
  color: var(--Semantic-Negative-900, #ea3729);
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: 36px; /* 225% */
  letter-spacing: -0.48px;

  @media (max-width: 500px) {
    font-size: 12px;
  }
`;
