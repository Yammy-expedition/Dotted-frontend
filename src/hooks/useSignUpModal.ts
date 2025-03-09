import { useState, useEffect } from 'react';

export function useSignUpModal(step: number, isSogangEmail: boolean) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (step === 4 && !isSogangEmail) {
      setIsModalOpen(true);
    }
  }, [step, isSogangEmail]);

  const closeModal = () => setIsModalOpen(false);

  const onClickLater = () => {
    closeModal();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const onClickNow = () => {
    closeModal();
  };

  return { isModalOpen, closeModal, onClickLater, onClickNow };
}
