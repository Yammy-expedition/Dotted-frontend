import Like from '@/assets/svg/CommunityPage/Like.svg?react';
import More from '@/assets/svg/CommunityPage/More.svg?react';
import CommentSVG from '@/assets/svg/CommunityPage/Comment.svg?react';
import styled from 'styled-components';
import { CommentAction, CommentState } from '@/reducers/commentReducer';
import { ModalAction, ModalState } from '@/reducers/modalReducer';
import { useRef } from 'react';
import { Comment } from '@/pages/market/DetailMarketPage';
import useClickOutside from '@/hooks/useClickOutsize';
import { ALLOWED_DEPTH } from './CommentSection';

type CommentActionsProps = {
  updatedComment: Comment;
  commentState: CommentState;
  modalState: ModalState;
  commentDispatch: React.Dispatch<CommentAction>;
  modalDispatch: React.Dispatch<ModalAction>;
  onClickCommentLike: () => void;
  depth: number;
};

export default function CommentActions({
  updatedComment,
  commentState,
  modalState,
  commentDispatch,
  modalDispatch,
  onClickCommentLike,
  depth
}: CommentActionsProps) {
  const moreWrapperRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(moreWrapperRef, () => modalDispatch({ type: 'CLOSE_MORE' }));

  return (
    <ButtonWrapper>
      <button onClick={onClickCommentLike}>
        <Like className={`${updatedComment.is_liked && 'commentLiked'}`} />
        {updatedComment.like_count}
      </button>

      {depth < ALLOWED_DEPTH && (
        <button onClick={() => commentDispatch({ type: 'TOGGLE_RECOMMENT' })}>
          <CommentSVG
            className={`${commentState.isOpenRecomment && 'recomment'}`}
          />
        </button>
      )}

      <MoreWrapper ref={moreWrapperRef}>
        <button onClick={() => modalDispatch({ type: 'TOGGLE_MORE' })}>
          <More />
          {modalState.openMore && (
            <Menu>
              {updatedComment.is_mine ? (
                <>
                  <div onClick={() => commentDispatch({ type: 'TOGGLE_EDIT' })}>
                    Edit
                  </div>
                  <div
                    onClick={() => modalDispatch({ type: 'OPEN_DELETE_MODAL' })}
                  >
                    Delete
                  </div>
                </>
              ) : (
                <div
                  onClick={() => {
                    modalDispatch({ type: 'OPEN_REPORT_MODAL' });
                  }}
                >
                  Report
                </div>
              )}
            </Menu>
          )}
        </button>
      </MoreWrapper>
    </ButtonWrapper>
  );
}

const Menu = styled.div`
  z-index: 10;
  position: absolute;
  top: 0%;
  left: 100%;
  margin-top: 1rem;
  width: 15.9rem;
  @media (max-width: 400px) {
    width: 10rem;
  }
  flex-shrink: 0;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.backgroundLayer2};
  box-shadow: 2px 2px 26.1px -3px rgba(0, 0, 0, 0.22);
  color: ${({ theme }) => theme.colors.gray800};
  > div {
    text-align: start;
    cursor: pointer;
    padding: 1rem 2rem;
    color: ${({ theme }) => theme.colors.gray700};
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: -0.08rem;
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background-color: ${({ theme }) => theme.colors.gray200};
      }
    }
  }
`;

const ButtonWrapper = styled.div`
  color: ${({ theme }) => theme.colors.gray700};
  font-size: 1.4rem;
  @media (max-width: 460px) {
    font-size: 1.1rem;
  }
  font-weight: 300;
  letter-spacing: -0.07rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  > button {
    min-width: 2rem;
    padding: 0;
    background-color: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.2rem;
    > svg {
      @media (max-width: 460px) {
        width: 15px;
      }
      &.commentLiked {
        > path {
          fill: ${({ theme }) => theme.colors.purple600};
          stroke: ${({ theme }) => theme.colors.purple600};
          @media (max-width: 460px) {
            width: 15px;
          }
        }
      }
      &.recomment {
        fill: ${({ theme }) => theme.colors.purple600};
        stroke: ${({ theme }) => theme.colors.purple600};
        > path {
          fill: ${({ theme }) => theme.colors.purple600};
          stroke: ${({ theme }) => theme.colors.purple600};
        }
      }
    }
  }
`;

const MoreWrapper = styled.div`
  position: relative;
  > button {
    > svg {
      @media (max-width: 460px) {
        height: 10px;
      }
    }
  }
`;
