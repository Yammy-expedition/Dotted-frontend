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

export default function NotificatoinPage() {
  const [notice, setNotice] = useState<AllInfoNotification | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 토큰이 없는 경우 연결하지 않음
    let accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    const runSSE = async () => {
      const EventSourceConstructor = EventSourcePolyfill || NativeEventSource;
      const headers = { Authorization: `Bearer ${accessToken}` };

      const evtSource = new EventSourceConstructor(
        `${import.meta.env.VITE_API_DOMAIN}/api/notification/stream`,
        { headers: headers, withCredentials: true }
      );

      // 토큰 만료 여부 체크, 만료되었다면 갱신 시도
      if (isTokenExpired(accessToken)) {
        try {
          await refreshAccessToken();
          accessToken = localStorage.getItem('accessToken');
        } catch (error) {
          console.error('토큰 갱신 실패:', error);
          return;
        }
      }

      // console.log('SSE 연결됨:', evtSource);

      evtSource.onmessage = (event) => {
        try {
          const newEvent = JSON.parse(event.data);
          // console.log(newEvent);
          setNotice((prev) => {
            if (prev === null) return newEvent;

            // 기존 리스트와 새 데이터 합치기
            const updatedList = [newEvent.list[0], ...prev.list];

            // id 기준 중복 제거
            const uniqueList = Array.from(
              new Map(updatedList.map((item) => [item.id, item])).values()
            );

            return { ...prev, list: uniqueList };
          });
        } catch (err) {
          console.error('이벤트 데이터 파싱 에러:', err);
        }
      };

      evtSource.onerror = async (err) => {
        console.error('SSE 에러:', err);
        evtSource.close();
        // 1초 후 재연결 시도
        setTimeout(runSSE, 1000);
      };

      return () => {
        evtSource.close();
        // console.log('SSE 연결 끊김');
      };
    };

    runSSE();
  }, []);

  async function handleDelete(notificationId: number): Promise<void> {
    try {
      // console.log(notificationId);
      // 실제 API 주소에 맞게 수정 (예: /api/notification/123)
      await fetchWithAuth<void>(
        `${import.meta.env.VITE_API_DOMAIN}/api/notification/${notificationId}`,
        {
          method: 'DELETE'
        }
      );
      setNotice((prev) => {
        if (!prev) return prev;
        const filtered = prev.list.filter((noti) => noti.id != notificationId);
        return {
          ...prev,
          list: filtered,
          unread_count: prev.unread_count - 1
        };
      });
    } catch (error) {
      console.error('알림 삭제 실패:', error);
    }
  }

  async function handleRead(notificationId: number): Promise<void> {
    try {
      await fetchWithAuth<void>(
        `${import.meta.env.VITE_API_DOMAIN}/api/notification/${notificationId}`,
        {
          method: 'PUT'
        }
      );

      setNotice((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          list: prev?.list.map((noti) =>
            noti.id === notificationId ? { ...noti, is_read: true } : noti
          )
        };
      });
    } catch (error) {
      console.error(error);
    }
  }
  async function handleDeleteAll(): Promise<void> {
    try {
      await fetchWithAuth<void>(
        `${import.meta.env.VITE_API_DOMAIN}/api/notification/all_delete`,
        {
          method: 'DELETE'
        }
      );

      setNotice((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          list: [],
          unread_count: 0
        };
      });

      // console.log('모든 알림 삭제 성공');
    } catch (error) {
      console.error('모든 알림 삭제 실패:', error);
    }
  }

  async function handleMarkAllRead(): Promise<void> {
    try {
      // 실제 API 주소에 맞게 수정
      await fetchWithAuth<void>(
        `${import.meta.env.VITE_API_DOMAIN}/api/notification/all`,
        {
          method: 'PUT'
        }
      );

      // 읽음 처리 성공 시, state에서 모든 알림의 is_read를 true로
      setNotice((prev) => {
        if (!prev) return prev; // 이전 상태가 null이면 그대로 반환
        const updatedList = prev.list.map((item) => ({
          ...item,
          is_read: true
        }));
        return {
          ...prev,
          list: updatedList,
          unread_count: 0
        };
      });

      // console.log('모든 알림 읽음 처리 성공');
    } catch (error) {
      console.error('모든 알림 읽음 처리 실패:', error);
      // 오류 처리 로직 (알림창, 에러 메시지 등)
    }
  }

  const handleMarkRead = (id: number, url: string) => {
    handleRead(id);
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
          <ReadAll onClick={() => handleMarkAllRead()}>Read all</ReadAll>
          <DeleteAll onClick={() => handleDeleteAll()}>Delete all</DeleteAll>
        </ActionButton>
        <NotificationListWrapper>
          <ul>
            {notice?.list.map((item, idx) => {
              return (
                <EachNotice
                  key={idx}
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
                      <div onClick={() => handleDelete(item.id)}>
                        <Trashcan />
                      </div>
                    </DeleteButtonWrapper>
                    <Date>{formatRelativeTime(item.created_at)}</Date>
                  </RightDiv>
                </EachNotice>
              );
            })}
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
    padding: 0 10rem;
  }

  @media (max-width: 900px) {
    padding-right: 7.7rem;
    padding-left: 7.7rem;
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
