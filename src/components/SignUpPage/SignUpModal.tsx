import { useEffect } from 'react';
import Modal from 'react-modal';
import AccessRestrictedModal from './AccessRestrictedModal';

Modal.setAppElement('#root');

interface SignUpModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  onClickLater: () => void;
  onClickNow: () => void;
}

const customStyles = {
  content: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'var(--Modal-Background)'
  }
};

export default function SignUpModal({
  isModalOpen,
  closeModal,
  onClickLater,
  onClickNow
}: SignUpModalProps) {
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'; // 스크롤 막기
    } else {
      document.body.style.overflow = 'auto'; // 스크롤 다시 활성화
    }

    return () => {
      document.body.style.overflow = 'auto'; // 컴포넌트가 언마운트될 때 스크롤 복구
    };
  }, [isModalOpen]);

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="example"
    >
      <AccessRestrictedModal
        onClickLater={onClickLater}
        onClickNow={onClickNow}
      />
    </Modal>
  );
}
