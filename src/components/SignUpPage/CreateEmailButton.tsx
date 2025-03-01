import styled from 'styled-components';
import PurpleLink from '@/assets/svg/SignUpPage/PurPleLinkSVG.svg?react';

export default function CreateEmailButton() {
  return (
    <CreateEmailButtonBox
      onClick={() => window.open('https://dotted.site/about/notice/2')}
    >
      <CreateEmailText>How to create a Sogang Email?</CreateEmailText>
      <PurpleLinkSVG />
    </CreateEmailButtonBox>
  );
}

const CreateEmailButtonBox = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 38.6rem;
  height: 38px;
  flex-shrink: 0;
  border-radius: 24px;
  background: ${({ theme }) => theme.colors.purple200};
`;

const CreateEmailText = styled.p`
  color: ${({ theme }) => theme.colors.purple600};
  text-align: center;
  font-size: 1.6rem;
  @media (max-width: 400px) {
    font-size: 1.5rem;
  }
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.5px;
`;

const PurpleLinkSVG = styled(PurpleLink)``;
