import Modal from 'react-modal';
import styled from 'styled-components';
import ReportFlag from '@/assets/svg/CommunityPage/ReportFlag.svg?react';

interface ReportModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  reportType: string;
  setReportType: (type: string) => void;
  reportContent: string;
  setReportContent: (content: string) => void;
  onSubmit: () => void;
}

export default function ReportModal({
  isOpen,
  onRequestClose,
  reportType,
  setReportType,
  reportContent,
  setReportContent,
  onSubmit
}: ReportModalProps) {
  const handleReportTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReportType(e.target.value);
  };

  return (
    <Modal
      isOpen={isOpen}
      style={customStyles}
      onRequestClose={onRequestClose}
      contentLabel="Report Modal"
    >
      <AccessRestrictedWrapper>
        <div>
          <AccessRestrictedReport>
            <TextReport>
              <span>
                <div>
                  <ReportFlag />
                </div>
                Report
              </span>
              <span>Report type</span>
              <form>
                {['SPAM', 'ABUSE', 'SEXUAL', 'ILLEGAL', 'OTHERS'].map(
                  (type) => (
                    <RadioWrapper key={type}>
                      <HiddenRadio
                        name="reportType"
                        value={type}
                        checked={reportType === type}
                        onChange={handleReportTypeChange}
                      />
                      <RadioLabel>
                        {type.charAt(0) + type.slice(1).toLowerCase()}
                      </RadioLabel>
                    </RadioWrapper>
                  )
                )}
              </form>
            </TextReport>
            <textarea
              value={reportContent}
              onChange={(e) => setReportContent(e.target.value)}
            />
            <div>
              <span>Are you sure you want to report this?</span>
            </div>
          </AccessRestrictedReport>
          <ButtonBox>
            <LaterButton onClick={onRequestClose}>No</LaterButton>
            <NowButton onClick={onSubmit}>Yes</NowButton>
          </ButtonBox>
        </div>
      </AccessRestrictedWrapper>
    </Modal>
  );
}

// 스타일
const customStyles = {
  content: {
    inset: '0',
    padding: '0',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: 'var(--modal-Background)',
    zIndex: 9999
  },
  overlay: {
    zIndex: 9999
  }
};

const AccessRestrictedWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(12, 12, 12, 0.3);
  position: absolute;
  z-index: 10;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AccessRestrictedReport = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3.1rem 5.5rem;
  max-width: 51rem;
  border-radius: 5px 5px 0 0;
  background: ${({ theme }) => theme.colors.backgroundLayer1};
  box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.11);
`;

const TextReport = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  > span {
    &:first-child {
      display: flex;
      gap: 1.2rem;
      font-size: 2rem;
      font-weight: 400;
    }
    &:nth-child(2) {
      font-size: 1.4rem;
      font-weight: 400;
    }
  }
`;

const RadioWrapper = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 1.2rem;
`;

const HiddenRadio = styled.input.attrs({ type: 'radio' })`
  appearance: none;
  border: 2px solid gray;
  border-radius: 50%;
  width: 1.25em;
  height: 1.25em;
  &:checked {
    border: 0.4em solid tomato;
  }
`;

const RadioLabel = styled.span`
  font-size: 1.6rem;
  color: #333;
`;

const ButtonBox = styled.div`
  display: flex;
  width: 100%;
  height: 7.4rem;
  max-width: 51rem;
  border-radius: 0 0 5px 5px;
  background: ${({ theme }) => theme.colors.backgroundLayer1};
`;

const LaterButton = styled.div`
  width: 50%;
  background: ${({ theme }) => theme.colors.backgroundBase};
  color: ${({ theme }) => theme.colors.gray700};
`;

const NowButton = styled.div`
  width: 50%;
  background: #ea3729;
  color: ${({ theme }) => theme.colors.gray50};
`;
