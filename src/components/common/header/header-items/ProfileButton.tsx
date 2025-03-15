import ProfileIcon from '@/assets/icons/header/profile.svg?react';
import DownIcon from '@/assets/icons/header/down.svg?react';
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { fetchWithAuth } from '@/utils/auth';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
// import { useTranslation } from 'react-i18next';

// types/user.ts

export interface UserProfile {
  id: number;
  college: string;
  registered_posts: string[];
  scrapped_posts: string[];
  registered_marketposts: string[];
  scrapped_marketposts: string[];
  comments: string[];
  password: string; // 보통 비밀번호는 내려주지 않지만, Swagger 상에 나와있으니 일단 포함
  last_login: string | null;
  email: string;
  name: string;
  birth: string | null;
  nickname: string;
  student_type: string | null;
  login_type: string | null;
  univ_certified: boolean;
  created_at: string;
  is_staff: boolean;
  is_active: boolean;
  social_id: string | null;
  social_additional_info: any; // 구조에 따라 세부 타입 정의 가능
}

async function fetchUserProfile(): Promise<UserProfile> {
  return fetchWithAuth<UserProfile>(
    `${import.meta.env.VITE_API_DOMAIN}/api/user/profile`,
    {
      method: 'GET'
    }
  );
}

export default function ProfileButton() {
  const navigate = useNavigate();
  const [openMore, setOpenMore] = useState(false);
  const { data } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile
  });
  const moreWrapperRef = useRef<HTMLDivElement | null>(null);
  // const { t } = useTranslation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        openMore &&
        moreWrapperRef.current &&
        !moreWrapperRef.current.contains(event.target as Node)
      ) {
        setOpenMore(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMore]);

  const onClickLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  return (
    <ProfileBox
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
            <div onClick={() => navigate('/mypage/profile')}>my page</div>
            <div onClick={onClickLogout}>logout</div>
          </Menu>
        )}
      </AnimatePresence>

      <ProfileIcon />
      <span>{data?.nickname}</span>
      <DownIcon />
    </ProfileBox>
  );
}

const ProfileBox = styled.div`
  @media (max-width: 900px) {
    gap: 1rem;
    padding-right: 0;
  }
  position: relative;
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
    &:last-child {
      width: 1.8rem;
      height: 0.9rem;
      path {
        stroke: ${({ theme }) => theme.colors.gray700};
      }
    }
  }

  > span {
    @media (max-width: 900px) {
      display: none;
    }
    margin-left: 1.2rem;
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
