import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/utils/auth';
import { NotiList } from '@/types/NotiList';
import { useNavigate } from 'react-router-dom';

export interface AllInfoNotification {
  unread_count: number;
  list: NotiList[];
}

// 알림 데이터를 가져오자!
const fetchNotifications = async (): Promise<AllInfoNotification> => {
  return fetchWithAuth<AllInfoNotification>(
    `${import.meta.env.VITE_API_DOMAIN}/api/notification`
  );
};

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 1000 * 60 * 5
  });

  //------------------------------------
  // 알림 삭제
  //------------------------------------
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

  //-----------------------------------
  // 알림 읽음 처리
  //-----------------------------------
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

  //----------------------------------------
  // 모든 알림 삭제
  //------------------------------------------
  const deleteAllNotifications = async () => {
    await fetchWithAuth<void>(
      `${import.meta.env.VITE_API_DOMAIN}/api/notification/all_delete`,
      { method: 'DELETE' }
    );

    queryClient.setQueryData(['notifications'], { list: [], unread_count: 0 });
  };

  //----------------------------------------
  // 모든 알림 읽음 처리
  //-----------------------------------------
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

  const handleMarkRead = (id: number, url: string) => {
    markAsRead(id);
    navigate(url);
  };

  return {
    ...query, // data, isLoading, error 등 제공
    queryClient,
    deleteNotification,
    deleteAllNotifications,
    markAllAsRead,
    handleMarkRead
  };
};
