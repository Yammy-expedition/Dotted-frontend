import { ReactNode } from 'react';
import styled from 'styled-components';

interface HeadContentProps {
  title: string;
  icon: ReactNode;
  text: string;
}

export default function HeadContent({ title, icon, text }: HeadContentProps) {
  return (
    <HeadContentWrapper>
      <Title>{title}</Title>
      {icon}
      <Text>{text}</Text>
    </HeadContentWrapper>
  );
}

const HeadContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.span`
  color: ${({ theme }) => theme.colors.gray800};
  text-align: center;

  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -2px;
  margin-bottom: 2.6rem;

  @media (max-width: 600px) {
    font-size: 25px;
  }
`;

const Text = styled.span`
  color: ${({ theme }) => theme.colors.purple600};
  text-align: center;

  font-size: 24px;
  @media (max-width: 600px) {
    font-size: 18px;
  }
  font-style: normal;
  font-weight: 500;
  line-height: 36px; /* 150% */
  letter-spacing: -1.2px;
  white-space: pre-line;
  margin-bottom: 4rem;
`;
