import styled from 'styled-components';
import Trashcan from '@/assets/svg/Notification/Trashcan.svg?react';
import Bell from '@/assets/svg/Notification/Bell.svg?react';
import { useEffect, useState } from 'react';
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';
import {
  fetchWithAuth,
  isTokenExpired,
  refreshAccessToken
} from '@/utils/auth';
import { formatRelativeTime } from '@/utils/formatTime';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotification';

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

export default function NotificationPage() {
  const navigate = useNavigate();
  const {
    data: notice,
    deleteNotification,
    markAsRead,
    deleteAllNotifications,
    markAllAsRead,
    queryClient
  } = useNotifications();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    const runSSE = async () => {
      const EventSourceConstructor = EventSourcePolyfill || NativeEventSource;
      const headers = { Authorization: `Bearer ${accessToken}` };

      const evtSource = new EventSourceConstructor(
        `${import.meta.env.VITE_API_DOMAIN}/api/notification/stream`,
        { headers, withCredentials: true }
      );

      evtSource.onmessage = (event) => {
        console.log('Asdsad');
        try {
          const newEvent = JSON.parse(event.data);
          queryClient.setQueryData(
            ['notifications'],
            (prev: AllInfoNotification | undefined) => {
              if (!prev) return newEvent;
              const updatedList = [newEvent.list[0], ...prev.list];
              const uniqueList = Array.from(
                new Map(updatedList.map((item) => [item.id, item])).values()
              );

              return { ...prev, list: uniqueList };
            }
          );
        } catch (err) {
          console.error('이벤트 데이터 파싱 에러:', err);
        }
      };

      evtSource.onerror = async (err) => {
        console.error('SSE 에러:', err);
        evtSource.close();
        setTimeout(runSSE, 1000);
      };

      return () => {
        evtSource.close();
      };
    };

    runSSE();
  }, [queryClient]);

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
              <EachNotice
                key={item.id}
                $isRead={item.is_read}
                onClick={() =>
                  handleMarkRead(item.id, item.redirect_url.redirect_url)
                }
              >
                <LeftDiv>
                  <From>{item.notification_type}</From>
                  <Content>{item.content}</Content>
                </LeftDiv>
                <RightDiv>
                  <DeleteButtonWrapper>
                    <div onClick={() => deleteNotification(item.id)}>
                      <Trashcan />
                    </div>
                  </DeleteButtonWrapper>
                  <Date>{formatRelativeTime(item.created_at)}</Date>
                </RightDiv>
              </EachNotice>
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

const EachNotice = styled.li<{ $isRead: boolean }>`
  cursor: pointer;
  padding: 1.5rem 3rem;
  display: flex;
  justify-content: space-between;
  background-color: ${({ theme, $isRead }) =>
    $isRead ? theme.colors.backgroundLayer2 : theme.colors.purple100};
  border-top: 1px solid ${({ theme }) => theme.colors.gray400};
`;

const LeftDiv = styled.div``;

const RightDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const From = styled.div`
  color: ${({ theme }) => theme.colors.purple600};

  font-size: 1.6rem;
  @media (max-width: 700px) {
    font-size: 1.7rem;
  }
  font-style: normal;
  font-weight: 500;
  line-height: 3.6rem;
  letter-spacing: -0.08rem;
`;

const Content = styled.div`
  color: ${({ theme }) => theme.colors.gray700};

  font-size: 2.4rem;
  @media (max-width: 700px) {
    font-size: 2.1rem;
  }
  font-style: normal;
  font-weight: 500;
  line-height: 3.6rem;
  letter-spacing: -0.12rem;
`;

const DeleteButtonWrapper = styled.div`
  display: flex;
  justify-content: end;

  > div {
    cursor: pointer;
    padding: 0.5rem;

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        border-radius: 100%;
        background-color: ${({ theme }) => theme.colors.backgroundBase};
        > svg > g > path {
          stroke: ${({ theme }) => theme.colors.gray600};
        }
      }
    }
  }
`;

const Date = styled.div`
  color: ${({ theme }) => theme.colors.gray400};
  text-align: right;

  width: 10rem;
  font-size: 1.6rem;
  @media (max-width: 700px) {
    font-size: 1.3rem;
  }
  font-style: normal;
  font-weight: 500;
  line-height: 3.6rem;
  letter-spacing: -0.08rem;
`;
