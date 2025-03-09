import styled from 'styled-components';
import Bell from '@/assets/svg/Notification/Bell.svg?react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotification';
import useNotificationSSE from '@/hooks/useNotificationSSE';
import NotificationItem from '@/components/Notification/NotificationItem';
import { NotiList } from '@/types/NotiList';

export interface AllInfoNotification {
  unread_count: number;
  list: NotiList[];
}

export default function NotificationPage() {
  const navigate = useNavigate();
  const {
    data: notice,
    deleteNotification,
    markAsRead,
    deleteAllNotifications,
    markAllAsRead
  } = useNotifications();

  useNotificationSSE();

  const handleMarkRead = (id: number, url: string) => {
    markAsRead(id);
    navigate(url);
  };

  return (
    <NotificationPageContainer>
      <Wrapper>
        <Title>
          <Bell />
          Notification
        </Title>
        <ActionButton>
          <ReadAll onClick={markAllAsRead}>Read all</ReadAll>
          <DeleteAll onClick={deleteAllNotifications}>Delete all</DeleteAll>
        </ActionButton>
        <NotificationListWrapper>
          <ul>
            {notice?.list.map((item) => (
              <NotificationItem
                item={item}
                handleMarkRead={handleMarkRead}
                deleteNotification={deleteNotification}
              />
            ))}
          </ul>
        </NotificationListWrapper>
      </Wrapper>
    </NotificationPageContainer>
  );
}

const ActionButton = styled.div`
  margin: 0.3rem 0 1rem 0;

  display: flex;
  align-items: center;
  justify-content: end;
  padding-right: 1rem;
  gap: 1rem;
`;

const ReadAll = styled.button`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.purple600};
  text-align: center;

  font-size: 1.6rem;
  border-radius: 1.6rem;
  padding: 0 1.5rem;

  font-style: normal;
  font-weight: 600;
  line-height: 3.6rem; /* 225% */
  letter-spacing: -0.048rem;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ theme }) => theme.colors.purple100};
    }
  }
`;

const DeleteAll = styled.button`
  cursor: pointer;
  color: var(--Semantic-Negative-900, #ea3729);
  text-align: center;

  font-size: 1.6rem;
  font-style: normal;
  font-weight: 600;
  line-height: 3.6rem;
  letter-spacing: -0.048rem;
  border-radius: 1.6rem;
  padding: 0 1.5rem;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--Semantic-Negative-100, #ffebe7);
    }
  }
`;

const NotificationPageContainer = styled.div`
  margin-top: 2.5rem;
  width: 100%;
  padding: 0 24.3rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 1200px) {
    padding: 0 7.7rem;
  }

  @media (max-width: 900px) {
    padding-right: 5rem;
    padding-left: 5rem;
  }
  @media (max-width: 700px) {
    padding-right: 2rem;
    padding-left: 2rem;
  }
`;

const Wrapper = styled.div`
  width: 100%;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  width: 100%;
  color: ${({ theme }) => theme.colors.gray700};

  font-size: 3.6rem;
  @media (max-width: 460px) {
    font-size: 3.1rem;
  }
  font-style: normal;
  font-weight: 700;
  line-height: 3.6rem;
  letter-spacing: -0.18rem;
`;

const NotificationListWrapper = styled.div`
  height: 70rem;
  margin-bottom: 10rem;
  overflow-y: auto;

  &::-webkit-scrollbar-track {
    background-color: ${({ theme }) => theme.colors.purple100};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.purple600};
    border-radius: 1.6rem;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  > ul {
    &:last-child {
      border-bottom: 1px solid ${({ theme }) => theme.colors.gray400};
    }
  }
`;
