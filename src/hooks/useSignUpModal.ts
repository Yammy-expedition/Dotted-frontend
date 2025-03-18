import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useSignUpModal(step: number, isSogangEmail: boolean) {
  const navigate = useNavigate();
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
    navigate('/login', { replace: true });
  };

  const onClickNow = () => {
    closeModal();
  };

  return { isModalOpen, closeModal, onClickLater, onClickNow };
}
