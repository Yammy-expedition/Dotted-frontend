import { AllInfoNotification } from '@/pages/NotificatoinPage';
import { useQueryClient } from '@tanstack/react-query';
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';
import { useEffect } from 'react';

export default function useNotificationSSE() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const accessToken = window.localStorage.getItem('accessToken');
    if (!accessToken) return;

    const EventSourceConstructor = EventSourcePolyfill || NativeEventSource;
    const headers = { Authorization: `Bearer ${accessToken}` };

    const evtSource = new EventSourceConstructor(
      `${import.meta.env.VITE_API_DOMAIN}/api/notification/stream`,
      { headers, withCredentials: true }
    );

    evtSource.onmessage = (event) => {
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

      // 1초 후 재연결
      setTimeout(() => {
        new EventSourceConstructor(
          `${import.meta.env.VITE_API_DOMAIN}/api/notification/stream`,
          { headers, withCredentials: true }
        );
      }, 1000);
    };

    // 컴포넌트 언마운트 시 SSE 연결 해제
    return () => {
      evtSource.close();
      console.log('SSE 연결 해제됨');
    };
  }, [queryClient]);
}
