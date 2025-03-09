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
    overflow: 'hidden',
    overflowY: 'hidden' as 'auto' | 'hidden' | 'scroll' | 'visible' | undefined,
    backgroundColor: 'var(--Modal-Background)'
  }
};

export default function SignUpModal({
  isModalOpen,
  closeModal,
  onClickLater,
  onClickNow
}: SignUpModalProps) {
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
