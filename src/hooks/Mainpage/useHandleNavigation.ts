import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';

export default function useHandleNavigation(openModal: () => void) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  return (path: string) => {
    if (!isLoggedIn()) {
      openModal();
    } else {
      navigate(path);
    }
  };
}
