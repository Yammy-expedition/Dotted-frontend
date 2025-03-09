import styled from 'styled-components';

interface NotificationsActionsProps {
  markAllAsRead: () => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
}

export default function NotificationsActions({
  markAllAsRead,
  deleteAllNotifications
}: NotificationsActionsProps) {
  return (
    <ActionButton>
      <ReadAll onClick={markAllAsRead}>Read all</ReadAll>
      <DeleteAll onClick={deleteAllNotifications}>Delete all</DeleteAll>
    </ActionButton>
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
