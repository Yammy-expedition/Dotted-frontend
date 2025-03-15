import styled from 'styled-components';
import DownIcon from '@/assets/icons/header/down.svg?react';
import { AnimatePresence, motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import i18n from '@/locales/i18n';

const Languages = ['ENG', 'KOR', 'CHN'];

export default function LanguageButton() {
  const [openMore, setOpenMore] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ENG');
  const moreWrapperRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {}, [selectedLanguage]);
  const changeLanguage = (lang: string) => {
    setSelectedLanguage(lang);
    if (lang === 'ENG') {
      i18n.changeLanguage('en');
    } else if (lang === 'KOR') {
      i18n.changeLanguage('ko');
    } else if (lang === 'CHN') {
      i18n.changeLanguage('ch');
    }
  };

  return (
    <LanguageBox
      onClick={() => setOpenMore((prev) => !prev)}
      ref={moreWrapperRef}
    >
      <AnimatePresence>
        {openMore && (
          <Menu
            initial={{ opacity: 0, y: -10, x: 10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -10, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {Languages.map((lang) => (
              <div key={lang} onClick={() => changeLanguage(lang)}>
                {lang}
              </div>
            ))}
          </Menu>
        )}
      </AnimatePresence>
      <span>{selectedLanguage}</span>
      <DownIcon />
    </LanguageBox>
  );
}

const LanguageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  cursor: pointer;
  padding: 1rem;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ theme }) => theme.colors.backgroundLayer1};
    }
  }

  > svg {
    width: 1.8rem;
    height: 0.9rem;
    stroke: ${({ theme }) => theme.colors.gray700};

    path {
      stroke: ${({ theme }) => theme.colors.gray700};
    }
  }

  > span {
    margin-right: 0.3rem;
    text-align: center;
    font-size: 1.6rem;
    font-weight: 500;
    line-height: 2.1rem;
    letter-spacing: -0.16px;
  }
`;

const Menu = styled(motion.div)`
  z-index: 1000;
  position: absolute;
  top: 100%;
  margin-top: 1rem;
  background-color: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray800};

  width: 15.9rem;

  flex-shrink: 0;

  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.backgroundLayer2};
  box-shadow: 2px 2px 26.1px -3px rgba(0, 0, 0, 0.22);

  > div {
    text-align: start;
    cursor: pointer;
    padding: 1rem 2rem;
    color: ${({ theme }) => theme.colors.gray700};

    font-size: 1.6rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: -0.08rem;

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background-color: ${({ theme }) => theme.colors.gray200};
      }
    }
  }
`;
