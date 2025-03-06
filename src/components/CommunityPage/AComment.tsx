import { Comment } from '@/pages/community/DetailCommunityPage';
import Profile from '@/assets/svg/CommunityPage/Profile.svg?react';

import styled from 'styled-components';
import ReplySection from './ReplySection';

import CommentActions from './CommentActions';
import CommentModals from './CommentModals';
import CommentContent from './CommentContent';
import CommentInput from './CommentInput';
import { useCommentHandlers } from '@/hooks/useCommentHandlers';
import { useCommentQueries } from '@/hooks/useCommentQueries';

export default function AComment({
  comment,
  origin,
  postIsMine,
  postId
}: {
  comment: Comment;
  postIsMine: boolean;
  origin?: string;
  postId: number;
}) {
  const { updatedComment } = useCommentQueries(postId, comment);
  const {
    commentState,
    commentDispatch,
    modalState,
    modalDispatch,
    onClickCommentLike,
    handleEditSubmit,
    handleRecommentSubmit,
    handleDelete,
    ReportMutation
  } = useCommentHandlers(updatedComment, postId);

  return (
    <Comments>
      {(postIsMine || comment.is_mine || !comment.is_secret) &&
        !updatedComment.is_deleted && <Profile />}
      <div style={{ width: '100%' }}>
        <CommentContent
          commentState={commentState}
          commentDispatch={commentDispatch}
          updatedComment={updatedComment}
          handleEditSubmit={handleEditSubmit}
        />
        {!updatedComment.is_deleted &&
          (postIsMine || !comment.is_secret || comment.is_mine) && (
            <CommentActions
              updatedComment={updatedComment}
              commentState={commentState}
              modalState={modalState}
              commentDispatch={commentDispatch}
              modalDispatch={modalDispatch}
              onClickCommentLike={onClickCommentLike}
            />
          )}

        <CommentModals
          modalState={modalState}
          modalDispatch={modalDispatch}
          handleDelete={handleDelete}
          ReportMutation={ReportMutation}
        />

        {commentState.isOpenRecomment && (
          <CommentInput
            commentState={commentState}
            commentDispatch={commentDispatch}
            handleRecommentSubmit={handleRecommentSubmit}
            origin={origin}
          />
        )}
        {updatedComment.replies.length > 0 && (
          <ReplySection
            replies={updatedComment.replies}
            postIsMine={postIsMine}
            rootComment={comment.id}
            commentIsMine={comment.is_mine}
          />
        )}
      </div>
    </Comments>
  );
}

const Comments = styled.li`
  display: flex;
  gap: 2.1rem;
  padding-bottom: 2rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  @media (max-width: 460px) {
    margin-bottom: 2rem;
    gap: 1rem;
  }
  > div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    @media (max-width: 460px) {
      gap: 0.2rem;
    }
    > div {
      font-style: normal;
      line-height: normal;
      &:first-child {
        color: ${({ theme }) => theme.colors.gray700};
        font-size: 2rem;
        @media (max-width: 460px) {
          font-size: 1.7rem;
        }
        font-weight: 600;
        letter-spacing: -0.7px;
      }
      &:nth-child(2) {
        color: ${({ theme }) => theme.colors.gray600};
        font-size: 1.7rem;
        @media (max-width: 460px) {
          font-size: 1.6rem;
          letter-spacing: -0.1px;
        }
        font-weight: 400;
        letter-spacing: -0.2px;
      }
      &:nth-child(3) {
        color: ${({ theme }) => theme.colors.gray500};
        font-size: 1.4rem;
        @media (max-width: 460px) {
          font-size: 1.1rem;
        }
        font-weight: 300;
        letter-spacing: -0.07rem;
      }
    }
  }
  > svg {
    width: 2.8rem;
    height: 2.8rem;
  }
`;
