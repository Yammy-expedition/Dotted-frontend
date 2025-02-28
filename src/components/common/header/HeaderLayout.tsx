import styled from 'styled-components';
import Header from './Header';
import { useEffect, useState } from 'react';
import Footer from '../Footer';
import { Outlet } from 'react-router-dom';

export default function HeaderLayout() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      // console.log(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollY]);

  return (
    <Wrapper>
      <Header scrollY={scrollY} />
      <Outlet />
      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 8rem;
  width: 100%;
  @media (max-width: 900px) {
    padding-top: 12rem;
  }
  position: relative;
  /* padding-right: 2rem; */
`;
