import Locker from '@/assets/svg/MarketPage/Locker.svg?react';
import { formatRelativeTime } from '@/utils/formatTime';
import styled from 'styled-components';
import { CommentState, CommentAction } from '@/reducers/commentReducer';
import { Comment } from '@/pages/market/DetailMarketPage';

type CommentContentProps = {
  commentState: CommentState;
  commentDispatch: React.Dispatch<CommentAction>;
  updatedComment: Comment;
  handleEditSubmit: () => void;
};

export default function CommentContent({
  commentState,
  commentDispatch,
  updatedComment,
  handleEditSubmit
}: CommentContentProps) {
  return commentState.isEditing ? (
    <CommentInputWrapper>
      <label>
        <textarea
          value={commentState.editedContent}
          onChange={(e) =>
            commentDispatch({
              type: 'SET_EDITED_CONTENT',
              payload: e.target.value
            })
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleEditSubmit();
            }
          }}
        />
      </label>

      <CommentButton onClick={handleEditSubmit}>Save</CommentButton>
      <CancelButton onClick={() => commentDispatch({ type: 'TOGGLE_EDIT' })}>
        Cancel
      </CancelButton>
    </CommentInputWrapper>
  ) : (
    <>
      <NicknameDiv>
        {updatedComment.is_deleted ? 'Unknown' : updatedComment.user_nickname}
        {updatedComment.is_secret && (
          <LockerDiv>
            <Locker />
          </LockerDiv>
        )}
      </NicknameDiv>
      <ConetentDiv>{updatedComment.content}</ConetentDiv>
      <CreatedAt>{formatRelativeTime(updatedComment.created_at)}</CreatedAt>
    </>
  );
}

const LockerDiv = styled.div``;

const CommentInputWrapper = styled.div`
  width: 100%;
  height: 10rem;
  @media (max-width: 400px) {
    height: 12rem;
  }
  display: flex;
  justify-content: space-between;
  gap: 1.8rem;
  label {
    position: relative;
    width: 100%;
    textarea {
      resize: none;
      border: none;
      padding: 2rem;
      width: 100%;
      height: 100%;
      border-radius: 0.4rem;
      background: ${({ theme }) => theme.colors.gray100};
      font-size: 1.6rem;
      @media (max-width: 460px) {
        font-size: 1.3rem;
      }
      font-style: normal;
      font-weight: 300;
      letter-spacing: -0.08rem;
    }
  }
`;

const CommentButton = styled.button`
  cursor: pointer;
  border: none;
  padding: 0 2rem;
  height: 10rem;
  border-radius: 0.4rem;
  background: ${({ theme }) => theme.colors.purple600};
  color: ${({ theme }) => theme.colors.gray50};
  text-align: center;
  font-size: 1.6rem;
  @media (max-width: 460px) {
    font-size: 1.3rem;
  }
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.08rem;
`;

const CancelButton = styled.button`
  cursor: pointer;
  border: none;
  padding: 0.8rem 1.5rem;
  background: ${({ theme }) => theme.colors.gray400};
  color: ${({ theme }) => theme.colors.gray50};
  border-radius: 0.4rem;
`;

const ConetentDiv = styled.div`
  display: flex;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.gray700};
  font-size: 2rem;
  @media (max-width: 460px) {
    font-size: 1.7rem;
  }
  font-weight: 300;
  letter-spacing: -0.1rem;
`;

const NicknameDiv = styled.div`
  display: flex;
  gap: 1rem;
  height: 3rem;
  align-items: center;
  .time {
    color: ${({ theme }) => theme.colors.gray500};
    font-size: 1.4rem;
    @media (max-width: 460px) {
      font-size: 1.1rem;
    }
    font-weight: 300;
    letter-spacing: -0.07rem;
  }
`;

const CreatedAt = styled.div`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: 1.4rem;
  @media (max-width: 460px) {
    font-size: 1.1rem;
  }
  font-weight: 300;
  letter-spacing: -0.03rem;
`;
