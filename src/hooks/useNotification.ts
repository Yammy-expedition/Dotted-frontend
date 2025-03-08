import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/utils/auth';

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

// 🔹 알림 데이터를 가져오는 API 요청 함수
const fetchNotifications = async (): Promise<AllInfoNotification> => {
  return fetchWithAuth<AllInfoNotification>(
    `${import.meta.env.VITE_API_DOMAIN}/api/notification`
  );
};

// 🔹 React Query를 활용한 커스텀 훅
export const useNotifications = () => {
  const queryClient = useQueryClient();

  // React Query로 알림 데이터 가져오기
  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 1000 * 60 * 5 // 5분 동안 캐싱 유지
  });

  // 알림 삭제
  const deleteNotification = async (notificationId: number) => {
    await fetchWithAuth<void>(
      `${import.meta.env.VITE_API_DOMAIN}/api/notification/${notificationId}`,
      { method: 'DELETE' }
    );

    queryClient.setQueryData(
      ['notifications'],
      (prev: AllInfoNotification | undefined) => {
        if (!prev) return prev;
        const filtered = prev.list.filter((noti) => noti.id !== notificationId);
        return {
          ...prev,
          list: filtered,
          unread_count: Math.max(0, prev.unread_count - 1)
        };
      }
    );
  };

  // 알림 읽음 처리
  const markAsRead = async (notificationId: number) => {
    await fetchWithAuth<void>(
      `${import.meta.env.VITE_API_DOMAIN}/api/notification/${notificationId}`,
      { method: 'PUT' }
    );

    queryClient.setQueryData(
      ['notifications'],
      (prev: AllInfoNotification | undefined) => {
        if (!prev) return prev;
        return {
          ...prev,
          list: prev.list.map((noti) =>
            noti.id === notificationId ? { ...noti, is_read: true } : noti
          )
        };
      }
    );
  };

  // 모든 알림 삭제
  const deleteAllNotifications = async () => {
    await fetchWithAuth<void>(
      `${import.meta.env.VITE_API_DOMAIN}/api/notification/all_delete`,
      { method: 'DELETE' }
    );

    queryClient.setQueryData(['notifications'], { list: [], unread_count: 0 });
  };

  // 모든 알림 읽음 처리
  const markAllAsRead = async () => {
    await fetchWithAuth<void>(
      `${import.meta.env.VITE_API_DOMAIN}/api/notification/all`,
      { method: 'PUT' }
    );

    queryClient.setQueryData(
      ['notifications'],
      (prev: AllInfoNotification | undefined) => {
        if (!prev) return prev;
        return {
          ...prev,
          list: prev.list.map((item) => ({ ...item, is_read: true })),
          unread_count: 0
        };
      }
    );
  };

  return {
    ...query, // data, isLoading, error 등 제공
    queryClient,
    deleteNotification,
    markAsRead,
    deleteAllNotifications,
    markAllAsRead
  };
};
