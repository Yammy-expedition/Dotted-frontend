import styled from 'styled-components';
import Info from '@/assets/svg/SignUpPage/InfoSVG.svg?react';

interface AccessRestrictedModalProps {
  onClickLater: () => void;
  onClickNow: () => void;
}

export default function AccessRestrictedModal({
  onClickLater,
  onClickNow
}: AccessRestrictedModalProps) {
  return (
    <AccessRestrictedWrapper>
      <div>
        <AccessRestricted>
          <IconWrapper>
            <InfoSVG />
          </IconWrapper>

          <Text>
            <span>
              To full access ‘Community’ and ‘Market’ you&nbsp;
              <span>
                need to <br />
                verify that you are a student at Sogang university.
              </span>
            </span>
          </Text>

          <Text>
            <span>
              <span>
                <ColorPurple>Beta period</ColorPurple>: Free access to Community
                and Market until September 1st without verification. After that
                date, only verified students will have full access.
              </span>
            </span>
          </Text>

          <Text>
            <span>
              The verification document will never be shared publicily.
            </span>
          </Text>

          <Text>
            <span>
              You can verify now or complete it later in
              <br /> Mypage {'>'} Student Verification.{' '}
            </span>
          </Text>
        </AccessRestricted>

        <MobileNotice>
          <IconWrapper>
            <InfoSVG />
          </IconWrapper>
          <Text>
            <span>
              Verify your Sogang student status to access ‘Community’ and
              ‘Market’.&nbsp;
            </span>
          </Text>

          <Text>
            <span>
              <span>
                <ColorPurple>Beta period</ColorPurple>: Free access to Community
                and Market until September 1st without verification. After that
                date, only verified students will have full access.
              </span>
            </span>
          </Text>

          <Text>
            <span>
              Verify now or later in Mypage {'>'} Student Verification.
            </span>
          </Text>
        </MobileNotice>
        <ButtonBox>
          <LaterButton onClick={onClickLater}>verify later</LaterButton>
          <NowButton onClick={onClickNow}>verify now</NowButton>
        </ButtonBox>
      </div>
    </AccessRestrictedWrapper>
  );
}

const AccessRestrictedWrapper = styled.div`
  padding: 2rem;
  width: 100%;
  height: 100%;
  background: var(--Modal-Background, rgba(12, 12, 12, 0.3));
  position: fixed;
  left: 0;
  z-index: 10;
  top: 0;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const AccessRestricted = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 2rem;
  padding: 5.6rem 2rem 2rem 2rem;
  max-width: 58rem;

  @media (max-width: 700px) {
    display: none;
  }

  flex-shrink: 0;
  border-radius: 5px 5px 0 0;
  background: ${({ theme }) => theme.colors.backgroundLayer1};

  /* popup */
  box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.11);
`;

const IconWrapper = styled.div`
  text-align: center;
  margin-bottom: 1rem;

  @media (max-width: 500px) {
    margin: 0;
  }
`;

const InfoSVG = styled(Info).attrs({ width: '3.9rem', height: '3.9rem' })``;
const Text = styled.div`
  display: flex;
  justify-content: center;

  > span {
    color: ${({ theme }) => theme.colors.gray700};
    text-align: center;

    font-size: 20px;

    font-style: normal;
    font-weight: 400;
    line-height: 34px; /* 170% */
    letter-spacing: -0.8px;

    > span {
      font-weight: 700;
    }
  }
`;

const ButtonBox = styled.div`
  display: flex;
  width: 100%;
  height: 7.4rem;
  border-radius: 0 0 5px 5px;
  background: ${({ theme }) => theme.colors.backgroundLayer1};

  > div {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 25px; /* 125% */
    letter-spacing: -0.6px;
  }
`;

const LaterButton = styled.div`
  width: 40%;
  border-radius: 0px 0px 0px 5px;
  background: ${({ theme }) => theme.colors.backgroundBase};
  color: ${({ theme }) => theme.colors.gray700};
`;
const NowButton = styled.div`
  width: 60%;
  border-radius: 0px 0px 5px 0px;
  background: ${({ theme }) => theme.colors.purple600};
  color: ${({ theme }) => theme.colors.gray50};
`;

const ColorPurple = styled.span`
  color: ${({ theme }) => theme.colors.purple600};
`;

const MobileNotice = styled.div`
  display: none;

  flex-direction: column;
  justify-content: space-evenly;
  gap: 2rem;
  padding: 5.6rem 2rem 2rem 2rem;
  max-width: 58rem;

  flex-shrink: 0;
  border-radius: 5px 5px 0 0;
  background: ${({ theme }) => theme.colors.backgroundLayer1};

  /* popup */
  box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.11);

  @media (max-width: 700px) {
    display: flex;
  }
`;
