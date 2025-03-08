// DeleteModal.tsx
import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

interface DeleteModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onDelete: () => void;
}

const customStyles = {
  content: {
    inset: '0',
    padding: '0',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    overflowY: 'hidden' as 'auto' | 'hidden' | 'scroll' | 'visible' | undefined,
    backgroundColor: 'var(--modal-Background)',
    zIndex: 9999
  },
  overlay: {
    zIndex: 9999
  }
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onRequestClose,
  onDelete
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Delete Modal"
    >
      <AccessRestrictedWrapper>
        <div>
          <AccessRestrictedNormal>
            <TextNormal>
              <span>Are you sure you want to delete this comment?</span>
            </TextNormal>
          </AccessRestrictedNormal>
          <ButtonBox>
            <LaterButton onClick={onRequestClose}>Cancel</LaterButton>
            <NowButton onClick={onDelete}>Delete</NowButton>
          </ButtonBox>
        </div>
      </AccessRestrictedWrapper>
    </Modal>
  );
};

export default DeleteModal;

const AccessRestrictedWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: var(--Modal-Background, rgba(12, 12, 12, 0.3));
  position: absolute;
  z-index: 10;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 2rem;
  }
`;

const AccessRestrictedNormal = styled.div`
  z-index: 200;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 5.6rem 2rem 0 2rem;
  width: 51rem;
  height: 23.6rem;
  flex-shrink: 0;
  border-radius: 5px 5px 0 0;
  background: ${({ theme }) => theme.colors.backgroundLayer1};
  box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.11);
`;

const TextNormal = styled.div`
  display: flex;
  justify-content: center;
  > span {
    color: ${({ theme }) => theme.colors.gray700};
    text-align: center;
    font-size: 2rem;
    @media (max-width: 460px) {
      font-size: 1.7rem;
    }
    font-style: normal;
    font-weight: 400;
    line-height: 34px;
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
  max-width: 51rem;
  border-radius: 0 0 5px 5px;
  background: ${({ theme }) => theme.colors.backgroundLayer1};
  > div {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 2rem;
    @media (max-width: 460px) {
      font-size: 1.7rem;
    }
    font-style: normal;
    font-weight: 500;
    line-height: 25px;
    letter-spacing: -0.6px;
  }
`;

const LaterButton = styled.div`
  width: 50%;
  border-radius: 0px 0px 0px 5px;
  background: ${({ theme }) => theme.colors.backgroundBase};
  color: ${({ theme }) => theme.colors.gray700};
`;

const NowButton = styled.div`
  width: 50%;
  border-radius: 0px 0px 5px 0px;
  background: var(--Semantic-Negative-900, #ea3729);
  color: ${({ theme }) => theme.colors.gray50};
`;
