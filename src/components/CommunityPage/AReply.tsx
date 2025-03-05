import { Comment, PostDetail } from '@/pages/community/DetailCommunityPage';
import { useEffect, useRef, useState } from 'react';
import Profile from '@/assets/svg/CommunityPage/Profile.svg?react';
import styled from 'styled-components';
import Like from '@/assets/svg/CommunityPage/Like.svg?react';
import More from '@/assets/svg/CommunityPage/More.svg?react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from 'react-modal';
import { fetchWithAuth } from '@/utils/auth'; // auth.ts 경로에 맞게 수정
import { formatRelativeTime } from '@/utils/formatTime';
import Locker from '@/assets/svg/MarketPage/Locker.svg?react';
import { MarketPostDetail } from '@/pages/market/DetailMarketPage';

// API 응답 타입 정의 (실제 API 스펙에 맞게 수정)
interface ReplyLikeResponse {
  is_liked: boolean;
  like_count: number;
}

const customStyles = {
  content: {
    inset: '0',
    padding: '0',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    overflowY: 'hidden' as 'auto' | 'hidden' | 'scroll' | 'visible' | undefined,
    backgroundColor: 'var(--modal-Background)',
    zIndex: 9999
  },
  overlay: {
    zIndex: 9999
  }
};

export default function AReply({
  reply,
  postIsMine,
  rootComment,
  commentIsMine
}: {
  reply: Comment;
  postIsMine: boolean;
  rootComment: number;
  commentIsMine: boolean;
}) {
  const [isCommentLiked, setIsCommentLiked] = useState(reply.is_liked);
  const [likeCount, setLikeCount] = useState(reply.like_count);
  const [openMore, setOpenMore] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(reply.content);
  const [openNormalModal, setOpenNormalModal] = useState(false);
  const moreWrapperRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        openMore &&
        moreWrapperRef.current &&
        !moreWrapperRef.current.contains(event.target as Node)
      ) {
        setOpenMore(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMore]);

  // 댓글 삭제 mutation (반환 타입: void)
  const deleteMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      return await fetchWithAuth<void>(
        `${import.meta.env.VITE_API_DOMAIN}/api/posting/comment/${reply.id}/delete`,
        { method: 'DELETE' }
      );
    },
    onSuccess: () => {
      setEditedContent('Deleted Comment');
      queryClient.setQueryData<PostDetail | MarketPostDetail>(
        ['postDetail', reply.post], // 댓글이 포함된 게시글의 캐시 수정
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            comments: oldData.comments.map((comment) => ({
              ...comment,
              replies: comment.replies.map((r) =>
                r.id === reply.id
                  ? { ...r, content: 'Deleted Comment', is_deleted: true } // ✅ 내용만 "Deleted Comment"로 변경
                  : r
              )
            }))
          };
        }
      );
    },
    onError: (error) => {
      console.error('❌ 댓글 삭제 실패:', error);
    }
  });

  // 대댓글(또는 댓글) 좋아요 mutation (반환 타입: ReplyLikeResponse)
  const replyLikeMutation = useMutation<ReplyLikeResponse, Error, void>({
    mutationFn: async () => {
      return await fetchWithAuth<ReplyLikeResponse>(
        `${import.meta.env.VITE_API_DOMAIN}/api/posting/comment/${reply.id}/like`,
        { method: 'POST' }
      );
    },
    onSuccess: (data) => {
      setIsCommentLiked(data.is_liked);
      setLikeCount(data.like_count);
      queryClient.setQueryData<PostDetail | MarketPostDetail>(
        ['postDetail', reply.post], // 대댓글이 포함된 게시글의 캐시 수정
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            comments: oldData.comments.map((comment) => ({
              ...comment,
              replies: comment.replies.map((r) =>
                r.id === reply.id
                  ? {
                      ...r,
                      is_liked: data.is_liked,
                      like_count: data.like_count
                    }
                  : r
              )
            }))
          };
        }
      );
    },
    onError: (error) => {
      console.error('❌ 대댓글 좋아요 실패:', error);
    }
  });

  const onClickReplyLike = () => {
    replyLikeMutation.mutate();
  };

  // 댓글 수정 mutation (반환 타입: Comment)
  const updateCommentMutation = useMutation<Comment, Error, void>({
    mutationFn: async () => {
      const requestData = {
        content: editedContent,
        is_secret: false // 공개 댓글로 가정
      };
      return await fetchWithAuth<Comment>(
        `${import.meta.env.VITE_API_DOMAIN}/api/posting/comment/${reply.id}/update`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        }
      );
    },
    onSuccess: (updatedComment) => {
      setEditedContent(updatedComment.content);
      setIsEditing(false);
      queryClient.setQueryData<PostDetail | MarketPostDetail>(
        ['postDetail', reply.post],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            comments: oldData.comments.map((comment) => ({
              ...comment,
              replies: comment.replies.map((r) =>
                r.id === reply.id
                  ? { ...r, content: updatedComment.content }
                  : r
              )
            }))
          };
        }
      );
    },
    onError: (error) => {
      console.error('❌ 댓글 수정 실패:', error);
    }
  });

  const handleEditSubmit = () => {
    if (!editedContent.trim()) return;
    updateCommentMutation.mutate();
  };

  const handleDelete = () => {
    setOpenNormalModal(false);
    deleteMutation.mutate();
  };

  return (
    <Comments>
      {!reply.is_secret || reply.is_mine || commentIsMine ? <Profile /> : null}

      <div style={{ width: '100%' }}>
        {isEditing ? (
          <CommentInputWrapper>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleEditSubmit();
                }
              }}
            />
            <CommentButton onClick={handleEditSubmit}>Save</CommentButton>
            <CancelButton onClick={() => setIsEditing(false)}>
              Cancel
            </CancelButton>
          </CommentInputWrapper>
        ) : (
          <>
            <NicknameDiv>
              {reply.user_nickname}
              {reply.is_secret && (
                <LockerDiv>
                  <Locker />
                </LockerDiv>
              )}
            </NicknameDiv>

            {/* <NicknameDiv>Deleted Comment</NicknameDiv> */}

            <ConetentDiv>{editedContent}</ConetentDiv>
            <CreatedAt>{formatRelativeTime(reply.created_at)}</CreatedAt>
          </>
        )}
        {(!reply.is_secret || reply.is_mine || commentIsMine) &&
          !reply.is_deleted && (
            <ButtonWrapper>
              <button onClick={onClickReplyLike}>
                <Like className={`${isCommentLiked && 'commentLiked'}`} />
                {likeCount}
              </button>
              {reply.content !== 'Deleted Comment' && (
                <MoreWrapper ref={moreWrapperRef}>
                  <button onClick={() => setOpenMore((prev) => !prev)}>
                    <More />
                    {openMore && (
                      <Menu>
                        {reply.is_mine ? (
                          <>
                            <div onClick={() => setIsEditing(true)}>Edit</div>
                            <div onClick={() => setOpenNormalModal(true)}>
                              Delete
                            </div>
                          </>
                        ) : (
                          <div>Report</div>
                        )}
                      </Menu>
                    )}
                  </button>
                </MoreWrapper>
              )}
            </ButtonWrapper>
          )}
      </div>
      <Modal
        isOpen={openNormalModal}
        style={customStyles}
        onRequestClose={() => setOpenNormalModal((prev) => !prev)}
        contentLabel="example"
      >
        <AccessRestrictedWrapper>
          <div>
            <AccessRestrictedNormal>
              <TextNormal>
                <span>Are you sure you want to delete this comment?</span>
              </TextNormal>
            </AccessRestrictedNormal>
            <ButtonBox>
              <LaterButton onClick={() => setOpenNormalModal((prev) => !prev)}>
                Cancel
              </LaterButton>
              <NowButton onClick={handleDelete}>
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </NowButton>
            </ButtonBox>
          </div>
        </AccessRestrictedWrapper>
      </Modal>
    </Comments>
  );
}

const LockerDiv = styled.div``;

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
`;

const AccessRestrictedWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: var(--Modal-Background, rgba(12, 12, 12, 0.3));
  position: absolute;
  z-index: 10;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AccessRestrictedNormal = styled.div`
  z-index: 200;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 5.6rem 2rem 0 2rem;
  width: 51rem;
  height: 23.6rem;
  flex-shrink: 0;
  border-radius: 5px 5px 0 0;
  background: ${({ theme }) => theme.colors.backgroundLayer1};
  box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.11);
`;

const TextNormal = styled.div`
  display: flex;
  justify-content: center;
  > span {
    color: ${({ theme }) => theme.colors.gray700};
    text-align: center;

    font-size: 2rem;
    @media (max-width: 460px) {
      font-size: 1.7rem;
    }
    font-style: normal;
    font-weight: 400;
    line-height: 34px;
    letter-spacing: -0.8px;
    > span {
      font-weight: 700;
    }
  }
`;

const ButtonBox = styled.div`
  display: flex;
  width: 100%;
  height: 7.4rem;
  border-radius: 0 0 5px 5px;
  background: ${({ theme }) => theme.colors.backgroundLayer1};
  > div {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    font-size: 2rem;
    @media (max-width: 460px) {
      font-size: 1.7rem;
    }
    font-style: normal;
    font-weight: 500;
    line-height: 25px;
    letter-spacing: -0.6px;
  }
`;

const LaterButton = styled.div`
  width: 50%;
  border-radius: 0px 0px 0px 5px;
  background: ${({ theme }) => theme.colors.backgroundBase};
  color: ${({ theme }) => theme.colors.gray700};
`;

const NowButton = styled.div`
  width: 50%;
  border-radius: 0px 0px 5px 0px;
  background: var(--Semantic-Negative-900, #ea3729);
  color: ${({ theme }) => theme.colors.gray50};
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
    @media (max-width: 460px) {
      font-size: 1.3rem;
    }
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

const Comments = styled.div`
  display: flex;
  gap: 2.1rem;
  padding: 2rem;

  margin-left: 2.7rem;
  margin-bottom: 1.5rem;
  background-color: ${({ theme }) => theme.colors.gray100};
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
      &:first-child {
        color: ${({ theme }) => theme.colors.gray700};
        font-size: 2rem;
        @media (max-width: 460px) {
          font-size: 1.7rem;
        }
        letter-spacing: -0.7px;
        font-weight: 600;
      }
      &:nth-child(2) {
        color: ${({ theme }) => theme.colors.gray700};
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
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  > button {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 1.2rem;
    > svg {
      @media (max-width: 460px) {
        width: 15px;
      }
      &.commentLiked {
        > path {
          fill: ${({ theme }) => theme.colors.purple600};
          stroke: ${({ theme }) => theme.colors.purple600};
        }
      }
    }
  }
`;

const CommentInputWrapper = styled.div`
  width: 100%;
  height: 10rem;
  display: flex;
  gap: 1.8rem;
  textarea {
    width: 100%;
    resize: none;
    border: none;
    padding: 2rem;
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
  label {
    width: 100%;
    textarea {
      width: 100%;
      resize: none;
      border: none;
      padding: 2rem;
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

const CreatedAt = styled.div`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: 1.4rem;
  @media (max-width: 460px) {
    font-size: 1.1rem;
  }
  font-weight: 300;
  letter-spacing: -0.03rem;
`;
