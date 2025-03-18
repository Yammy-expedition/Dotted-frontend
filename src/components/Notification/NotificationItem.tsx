import styled from 'styled-components';
import Trashcan from '@/assets/svg/Notification/Trashcan.svg?react';
import { formatRelativeTime } from '@/utils/formatTime';
import { NotiList } from '@/types/NotiList';

interface NotificationItemProps {
  item: NotiList;
  handleMarkRead: (id: number, url: string) => void;
  deleteNotification: (id: number) => void;
}

export default function NotificationItem({
  item,
  handleMarkRead,
  deleteNotification
}: NotificationItemProps) {
  return (
    <EachNotice
      key={item.id}
      $isRead={item.is_read}
      onClick={() => handleMarkRead(item.id, item.redirect_url.redirect_url)}
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
  );
}

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
    font-size: 1.3rem;
  }
  @media (max-width: 500px) {
    font-size: 1rem;
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
  @media (max-width: 500px) {
    font-size: 1.8rem;
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
  @media (max-width: 500px) {
    font-size: 1rem;
  }
  font-style: normal;
  font-weight: 500;
  line-height: 3.6rem;
  letter-spacing: -0.08rem;
`;
