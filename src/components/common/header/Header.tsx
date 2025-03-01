import styled from 'styled-components';
import HeaderNav from './header-items/HeaderNav';
import AlarmButton from './header-items/AlarmButton';
import ProfileButton from './header-items/ProfileButton';
//import LanguageButton from './header-items/LanguageButton';
import { useEffect, useState, useRef } from 'react';
import SubHeader from './SubHeader';
import { useNavigate } from 'react-router-dom';
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';
import { isTokenExpired, refreshAccessToken } from '@/utils/auth';

export interface NotiList {
  id: number;
  notification_type: string;
  actor: number;
  content: string;
  related_id: number;
  created_at: string;
  is_read: boolean;
  redirect_url: {
    redirect_url: string;
    method: string;
    token_required: string;
  };
}

export interface AllInfoNotification {
  unread_count: number;
  list: NotiList[];
}

export default function Header({ scrollY }: { scrollY: number }) {
  const navigate = useNavigate();
  const [hoveredTab, setHoveredTab] = useState<string>('');
  const [notice, setNotice] = useState<AllInfoNotification | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  const isLogined = () => {
    return !!localStorage.getItem('accessToken');
  };

  // SSE 관련 useEffect는 그대로 유지
  useEffect(() => {
    const setupSSE = async () => {
      let accessToken = localStorage.getItem('accessToken');
      if (isTokenExpired(accessToken)) {
        try {
          await refreshAccessToken();
          accessToken = localStorage.getItem('accessToken');
        } catch (error) {
          console.error('토큰 갱신 실패:', error);
          return;
        }
      }

      const EventSourceConstructor = EventSourcePolyfill || NativeEventSource;
      const evtSource = new EventSourceConstructor(
        `${import.meta.env.VITE_API_DOMAIN}/api/notification/stream`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true
        }
      );

      evtSource.onmessage = (event) => {
        try {
          const newEvent = JSON.parse(event.data);
          console.log(newEvent);
          setNotice((prev) => {
            if (prev === null) return newEvent;
            return { ...prev, list: [newEvent.list[0], ...prev.list] };
          });
        } catch (err) {
          console.error('이벤트 데이터 파싱 에러:', err);
        }
      };

      evtSource.onerror = async () => {
        evtSource.close();
        setTimeout(setupSSE, 1000);
      };

      return () => {
        evtSource.close();
        console.log('SSE 연결 종료');
      };
    };

    setupSSE();
  }, []);

  // 모바일 네브 외부 클릭 시 닫히게 하는 useEffect
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      // 모바일 네브 내부 또는 토글 버튼에서 stopPropagation을 했으므로
      // 여기에 도달했다면 외부 클릭으로 판단합니다.
      if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <HeaderContainer onMouseLeave={() => setHoveredTab('')}>
      <UpWrapper $scrollY={scrollY}>
        <LeftSection>
          <Logo onClick={() => navigate('/')}>
            <img src="/logo.svg" alt="logo" />
            <span>Dotted</span>
          </Logo>
          <HeaderNavWrapper>
            <HeaderNav setHoveredTab={setHoveredTab} />
          </HeaderNavWrapper>
          <ArrowWrapper
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
          ></ArrowWrapper>
        </LeftSection>
        <RightSection onMouseEnter={() => setHoveredTab('')}>
          {isLogined() ? (
            <>
              <AlarmButton notice={notice} />
              <ProfileButton />
              {/* <LanguageButton /> */}
            </>
          ) : (
            <LoginSignup>
              <LoginButton onClick={() => navigate('/login')}>
                <span>Login</span>
              </LoginButton>
              <span>/</span>
              <LoginButton onClick={() => navigate('/sign-up')}>
                <span>Sign Up</span>
              </LoginButton>
            </LoginSignup>
          )}
        </RightSection>
      </UpWrapper>

      <MobileNav ref={mobileNavRef} onClick={(e) => e.stopPropagation()}>
        <HeaderNav setHoveredTab={setHoveredTab} />
      </MobileNav>

      <SubHeader hoveredTab={hoveredTab} />
    </HeaderContainer>
  );
}

const LoginSignup = styled.div`
  > span {
    color: ${({ theme }) => theme.colors.purple600};
    border-radius: 2.4rem;
    text-align: center;
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.07rem;

    @media (max-width: 460px) {
      font-size: 1.8rem;
      display: none;
    }
  }
  @media (max-width: 460px) {
    display: flex;
    gap: 0.6rem;
  }
`;
const LoginButton = styled.button`
  position: relative;
  color: ${({ theme }) => theme.colors.gray900};
  padding: 0.7rem 1.5rem;
  text-align: center;
  font-size: 1.6rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.02rem;
  background: none;
  border: none;
  overflow: hidden;
  @media (max-width: 460px) {
    display: flex;
    font-weight: 600;
    justify-content: center;
    align-items: center;
    /* padding: 0.3rem 1.6rem; */
    width: 8.3rem;
    height: 2.4rem;
    background-color: ${({ theme }) => theme.colors.purple600};
    border-radius: 5rem;
    color: ${({ theme }) => theme.colors.gray50};
    &:first-child {
      background-color: ${({ theme }) => theme.colors.gray300};
      color: ${({ theme }) => theme.colors.gray700};
    }
  }
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    /* border-bottom: 4px dashed ${({ theme }) => theme.colors.purple600}; */
    transition: width 0.5s ease;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover::after {
      width: 100%;
    }
  }

  & > span {
    @media (max-width: 460px) {
      font-size: 1.4rem;
    }
    display: inline-block;
    transform: scale(1);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover > span {
      animation: heartBeat 0.5s ease 0.5s 1 forwards;
    }
  }

  @keyframes heartBeat {
    0% {
      transform: scale(1);
    }
    30% {
      transform: scale(1.1);
    }
    50% {
      transform: scale(0.9);
    }
    70% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const HeaderNavWrapper = styled.div`
  @media (max-width: 900px) {
    display: none;
  }
`;

const MobileNav = styled.div`
  width: 100%;

  display: none;
  @media (max-width: 900px) {
    display: block;
  }
`;

const ArrowWrapper = styled.div`
  display: none;
  cursor: pointer;
  @media (max-width: 920px) {
    display: block;
  }
`;

const HeaderContainer = styled.div`
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundLayer2};
  border-bottom: 0.5px solid ${({ theme }) => theme.colors.gray400};
  width: 100%;
  padding: 0 7.7rem;

  @media (max-width: 900px) {
    padding: 0 5rem;
  }

  @media (max-width: 700px) {
    padding: 0 2rem;
  }
`;

const UpWrapper = styled.div<{ $scrollY: number }>`
  box-sizing: border-box;
  width: 100%;
  max-width: 1287px;
  height: 8rem;
  @media (max-width: 700px) {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
    height: 6rem;
  }
  background-color: ${({ theme }) => theme.colors.backgroundLayer2};
  color: ${({ theme }) => theme.colors.gray800};
  display: flex;
  justify-content: space-between;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2.8rem;
  height: 100%;
  color: ${({ theme }) => theme.colors.gray700};
`;

const RightSection = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  width: fit-content;
  height: 100%;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
  font-size: 3.6rem;
  font-weight: 700;
  line-height: 2.1rem;
  letter-spacing: -2.16px;
  cursor: pointer;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.9;
    }
  }
  @media (max-width: 800px) {
    font-size: 2.8rem;
    gap: 1rem;
  }

  > img {
    width: 3.5rem;
    height: 3.5rem;
    flex-shrink: 0;
    @media (max-width: 800px) {
      width: 3rem;
      height: 3rem;
    }
  }
`;
