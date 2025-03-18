import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from './header/Header';
import useModal from '@/hooks/Mainpage/useModal';

export default function ProtectedRoute({ children }: { children: any }) {
  const { pathname } = useLocation();
  const { closeModal } = useModal();
  const [scrollY, __] = useState(0);

  //로그인 했으면 true, 안했으면 false
  const isLogined = () => {
    return !!localStorage.getItem('accessToken');
  };
  if (isLogined()) {
    return children;
  } else {
    if (pathname === '/' || pathname.split('/')[1] === 'about') {
      return children;
    }
    return (
      <>
        <Header scrollY={scrollY} />
        <LoginModal closeModal={closeModal} />
        {/* {children} */}
      </>
    );
  }
}

export const LoginModal = ({ closeModal }: { closeModal: () => void }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  function handleCloseClick(pathname: string) {
    if (pathname === '/') {
      closeModal();
    } else {
      navigate('/');
    }
  }
  return (
    <ModalWrapper>
      <AnimatePresence>
        <ModalBox
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -50 }}
          exit={{ opacity: 0, y: 0 }}
        >
          <h1>
            This service is available
            <br /> <span>after you log in.</span>
          </h1>
          <div>
            <button onClick={() => handleCloseClick(pathname)}>
              {pathname === '/' ? 'Close' : 'Go Home'}
            </button>
            <button onClick={() => navigate('/login')}>Log in ⟶</button>
          </div>
        </ModalBox>
      </AnimatePresence>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled(motion.div)`
  width: 50rem;
  height: 25rem;
  position: fixed;
  z-index: 100;
  background-color: ${({ theme }) => theme.colors.backgroundLayer1};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 0.5rem;
  overflow: hidden;
  h1 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    font-size: 1.6rem;
    text-align: center;
    line-height: 2.1rem;
    span {
      font-weight: 700;
    }
  }
  > div {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    width: 100%;
    button {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem 2rem;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      &:first-child {
        background-color: ${({ theme }) => theme.colors.gray400};
        color: ${({ theme }) => theme.colors.gray800};
      }
      &:last-child {
        background-color: ${({ theme }) => theme.colors.purple600};
        color: ${({ theme }) => theme.colors.gray50};
      }
    }
  }
  @media (max-width: 700px) {
    width: 80%;
    height: 18rem;
  }
`;
