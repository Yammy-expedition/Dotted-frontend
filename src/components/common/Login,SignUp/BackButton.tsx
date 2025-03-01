import styled from 'styled-components';
import BackButtonSVG from '@/assets/svg/SignUpPage/BackButtonSVG.svg?react';
// import { useTheme } from '@/context/ThemeContext';

export default function BackButton() {
  // const { themeMode, toggleTheme } = useTheme();
  return (
    <BackButtonWrapper>
      <BackButtonComponent onClick={() => window.history.back()} />
      {/* <button onClick={() => toggleTheme()}>지금은 {themeMode}</button> */}
    </BackButtonWrapper>
  );
}

const BackButtonWrapper = styled.div`
  padding: 5% 0 0 1%;
  position: absolute;
  z-index: 10;
`;
const BackButtonComponent = styled(BackButtonSVG)`
  cursor: pointer;
  background-color: transparent;
  border: none;
`;
