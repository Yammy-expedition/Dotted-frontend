import { Comment, PostDetail } from '@/pages/community/DetailCommunityPage';
import { useEffect, useRef, useState } from 'react';
import CommentSVG from '@/assets/svg/CommunityPage/Comment.svg?react';
import Profile from '@/assets/svg/CommunityPage/Profile.svg?react';
import Like from '@/assets/svg/CommunityPage/Like.svg?react';
import More from '@/assets/svg/CommunityPage/More.svg?react';
import ReportFlag from '@/assets/svg/CommunityPage/ReportFlag.svg?react';
import styled from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ReplySection from './ReplySection';
import Modal from 'react-modal';
import Locker from '@/assets/svg/MarketPage/Locker.svg?react';
import { fetchWithAuth } from '@/utils/auth';
import { formatRelativeTime } from '@/utils/formatTime';
import { MarketPostDetail } from '@/pages/market/DetailMarketPage';

interface CommentLikeResponse {
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

export default function AComment({
  comment,
  origin,
  postIsMine
}: {
  comment: Comment;
  postIsMine: boolean;
  origin?: string;
  postId: number;
}) {
  const [isDeleted, setIsDeleted] = useState(comment.is_deleted);
  const [isCommentLiked, setIsCommentLiked] = useState(comment.is_liked);
  const [likeCount, setLikeCount] = useState(comment.like_count);
  const [isOpenRecomment, setIsOpenRecomment] = useState(false);
  const [recomment, setRecomment] = useState('');
  const [replies, setReplies] = useState<Comment[]>(comment.replies || []);
  const [openMore, setOpenMore] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [openNormalModal, setOpenNormalModal] = useState(false);
  const [isSecret, setIsSecret] = useState(false);
  const moreWrapperRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  // 신고 관련 state
  const [openReportModal, setOpenReportModal] = useState(false);
  const [reportType, setReportType] = useState('');
  const [reportContent, setReportContent] = useState('');

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

  // 댓글 좋아요 mutation
  const commentLikeMutation = useMutation<CommentLikeResponse, Error, void>({
    mutationFn: async () => {
      return await fetchWithAuth<CommentLikeResponse>(
        `${import.meta.env.VITE_API_DOMAIN}/api/posting/comment/${comment.id}/like`,
        { method: 'POST' }
      );
    },
    onSuccess: (data) => {
      setIsCommentLiked(data.is_liked);
      setLikeCount(data.like_count);
      queryClient.setQueryData<PostDetail | MarketPostDetail>(
        ['postDetail', comment.post],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            comments: oldData.comments.map((c) =>
              c.id === comment.id
                ? { ...c, is_liked: data.is_liked, like_count: data.like_count }
                : c
            )
          };
        }
      );
    },
    onError: (error) => {
      console.error('❌ 댓글 좋아요 실패:', error);
    }
  });

  const onClickCommentLike = () => {
    commentLikeMutation.mutate();
  };

  // 댓글 수정 mutation
  const updateCommentMutation = useMutation<Comment, Error, void>({
    mutationFn: async () => {
      const requestData = {
        content: editedContent,
        is_secret: isSecret
      };
      return await fetchWithAuth<Comment>(
        `${import.meta.env.VITE_API_DOMAIN}/api/posting/comment/${comment.id}/update`,
        {
          method: 'PATCH',
          body: JSON.stringify(requestData)
        }
      );
    },
    onSuccess: (updatedComment) => {
      setEditedContent(updatedComment.content);
      setIsEditing(false);
      queryClient.setQueryData<PostDetail | MarketPostDetail>(
        ['postDetail', comment.post],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            comments: oldData.comments.map((c) =>
              c.id === comment.id
                ? {
                    ...c,
                    content: updatedComment.content,
                    is_secret: updatedComment.is_secret
                  }
                : c
            )
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

  const onClickRecomment = () => {
    setIsOpenRecomment((prev) => !prev);
  };

  // 대댓글 작성 mutation
  const recommentMutation = useMutation<Comment, Error, void>({
    mutationFn: async () => {
      const requestData = {
        post: comment.post,
        content: recomment.trim(),
        parent: comment.id,
        is_secret: isSecret
      };
      return await fetchWithAuth<Comment>(
        `${import.meta.env.VITE_API_DOMAIN}/api/posting/comment/create`,
        {
          method: 'POST',
          body: JSON.stringify(requestData)
        }
      );
    },
    onSuccess: (newComment) => {
      setReplies((prev) => [...prev, newComment]);
      setRecomment('');
      queryClient.setQueryData<PostDetail | MarketPostDetail>(
        ['postDetail', comment.post],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            comments: oldData.comments.map((c) =>
              c.id === comment.id
                ? { ...c, replies: [...c.replies, newComment] }
                : c
            )
          };
        }
      );
    },
    onError: (error) => {
      console.error('❌ 대댓글 작성 실패:', error);
    }
  });

  const handleRecommentSubmit = () => {
    if (!recomment.trim()) return;
    recommentMutation.mutate();
  };

  // 댓글 삭제 mutation
  const deleteMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      return await fetchWithAuth<void>(
        `${import.meta.env.VITE_API_DOMAIN}/api/posting/comment/${comment.id}/delete`,
        { method: 'DELETE' }
      );
    },
    onSuccess: () => {
      setEditedContent('Deleted Comment');
      setIsDeleted(true);
      queryClient.setQueryData<PostDetail | MarketPostDetail>(
        ['postDetail', comment.post],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            comments: oldData.comments.map((c) =>
              c.id === comment.id
                ? {
                    ...c,
                    content: 'Deleted Comment',
                    is_deleted: true,
                    user_nickname: 'Unknown'
                  }
                : c
            )
          };
        }
      );
    },
    onError: (error) => {
      console.error('❌ 댓글 삭제 실패:', error);
    }
  });

  const handleDelete = () => {
    setOpenNormalModal(false);
    deleteMutation.mutate();
  };

  // 신고하기 mutation
  const reportMutation = useMutation<any, Error, void>({
    mutationFn: async () => {
      const dataToSend = {
        report_type: reportType,
        content_type: 'Comment',
        object_id: comment.id,
        reason: reportContent
      };
      return await fetchWithAuth<any>(
        `${import.meta.env.VITE_API_DOMAIN}/api/management/report`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
        }
      );
    },
    onSuccess: () => {
      setReportContent('');
      setReportType('');
      setOpenReportModal(false);
      alert('Your report has been submitted.');
    },
    onError: (error) => {
      console.error('❌ 신고 실패:', error);
      alert('Failed to submit the report.');
    }
  });

  // 신고 버튼 클릭 시 실행
  const ReportMutation = () => {
    if (!reportType) {
      alert('Please select a report type.');
      return;
    }
    if (!reportContent.trim()) {
      alert('Please enter a reason for the report.');
      return;
    }
    reportMutation.mutate();
  };

  const handleReportTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReportType(e.target.value);
  };

  return (
    <Comments>
      {(postIsMine || comment.is_mine || !comment.is_secret) && !isDeleted && (
        <Profile />
      )}
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
              {isDeleted ? 'Unknown' : comment.user_nickname}
              {comment.is_secret && (
                <LockerDiv>
                  <Locker />
                </LockerDiv>
              )}
            </NicknameDiv>
            <ConetentDiv>{editedContent}</ConetentDiv>
            <CreatedAt>{formatRelativeTime(comment.created_at)}</CreatedAt>
          </>
        )}
        {!isDeleted &&
          (postIsMine || !comment.is_secret || comment.is_mine) && (
            <ButtonWrapper>
              <button onClick={onClickCommentLike}>
                <Like className={`${isCommentLiked && 'commentLiked'}`} />
                {likeCount}
              </button>
              <button onClick={onClickRecomment}>
                <CommentSVG className={`${isOpenRecomment && 'recomment'}`} />
              </button>
              <MoreWrapper ref={moreWrapperRef}>
                <button onClick={() => setOpenMore((prev) => !prev)}>
                  <More />
                  {openMore && (
                    <Menu>
                      {comment.is_mine ? (
                        <>
                          <div onClick={() => setIsEditing(true)}>Edit</div>
                          <div onClick={() => setOpenNormalModal(true)}>
                            Delete
                          </div>
                        </>
                      ) : (
                        <div
                          onClick={() => {
                            setOpenReportModal(true);
                            setOpenMore(false);
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
          )}
        <Modal
          isOpen={openNormalModal}
          style={customStyles}
          onRequestClose={() => setOpenNormalModal((prev) => !prev)}
          contentLabel="Delete Modal"
        >
          <AccessRestrictedWrapper>
            <div>
              <AccessRestrictedNormal>
                <TextNormal>
                  <span>Are you sure you want to delete this comment?</span>
                </TextNormal>
              </AccessRestrictedNormal>
              <ButtonBox>
                <LaterButton
                  onClick={() => setOpenNormalModal((prev) => !prev)}
                >
                  Cancel
                </LaterButton>
                <NowButton onClick={handleDelete}>
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </NowButton>
              </ButtonBox>
            </div>
          </AccessRestrictedWrapper>
        </Modal>
        {/* 신고 모달 */}
        <Modal
          isOpen={openReportModal}
          style={customStyles}
          onRequestClose={() => setOpenReportModal((prev) => !prev)}
          contentLabel="Report Modal"
        >
          <AccessRestrictedWrapper>
            <div>
              <AccessRestrictedReport>
                <TextReport>
                  <span>
                    <div>
                      <ReportFlag />
                    </div>
                    Report
                  </span>
                  <span>Report type</span>
                  <form>
                    <RadioWrapper>
                      <HiddenRadio
                        name="reportType"
                        value="SPAM"
                        checked={reportType === 'SPAM'}
                        onChange={handleReportTypeChange}
                      />
                      <RadioLabel>Spam</RadioLabel>
                    </RadioWrapper>
                    <RadioWrapper>
                      <HiddenRadio
                        name="reportType"
                        value="ABUSE"
                        checked={reportType === 'ABUSE'}
                        onChange={handleReportTypeChange}
                      />
                      <RadioLabel>Abuse</RadioLabel>
                    </RadioWrapper>
                    <RadioWrapper>
                      <HiddenRadio
                        name="reportType"
                        value="SEXUAL"
                        checked={reportType === 'SEXUAL'}
                        onChange={handleReportTypeChange}
                      />
                      <RadioLabel>Sexual</RadioLabel>
                    </RadioWrapper>
                    <RadioWrapper>
                      <HiddenRadio
                        name="reportType"
                        value="ILLEGAL"
                        checked={reportType === 'ILLEGAL'}
                        onChange={handleReportTypeChange}
                      />
                      <RadioLabel>Illegal</RadioLabel>
                    </RadioWrapper>
                    <RadioWrapper>
                      <HiddenRadio
                        name="reportType"
                        value="OTHERS"
                        checked={reportType === 'OTHERS'}
                        onChange={handleReportTypeChange}
                      />
                      <RadioLabel>Others</RadioLabel>
                    </RadioWrapper>
                  </form>
                </TextReport>
                <textarea
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                />
                <div>
                  <span>Are you sure you want to report this?</span>
                </div>
              </AccessRestrictedReport>
              <ButtonBox>
                <LaterButton
                  onClick={() => setOpenReportModal((prev) => !prev)}
                >
                  No
                </LaterButton>
                <NowButton onClick={ReportMutation}>Yes</NowButton>
              </ButtonBox>
            </div>
          </AccessRestrictedWrapper>
        </Modal>
        {isOpenRecomment && (
          <CommentInputWrapper>
            <label htmlFor="comment">
              <textarea
                name="comment"
                placeholder="Write a reply..."
                value={recomment}
                onChange={(e) => setRecomment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleRecommentSubmit();
                  }
                }}
              />
              {origin === 'market' && (
                <SecretButton
                  onClick={() => setIsSecret((prev) => !prev)}
                  $isSecret={isSecret}
                >
                  <Locker />
                  secret comment
                </SecretButton>
              )}
            </label>
            <CommentButton onClick={handleRecommentSubmit}>Reply</CommentButton>
          </CommentInputWrapper>
        )}
        {replies.length > 0 && (
          <ReplySection
            replies={replies}
            postIsMine={postIsMine}
            rootComment={comment.id}
            commentIsMine={comment.is_mine}
          />
        )}
      </div>
    </Comments>
  );
}

const LockerDiv = styled.div``;

const SecretButton = styled.button<{ $isSecret: boolean }>`
  cursor: pointer;
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.8rem;
  border-radius: 0.5rem;
  border: 1px solid
    ${({ theme, $isSecret }) =>
      $isSecret ? theme.colors.purple600 : theme.colors.gray300};
  color: ${({ theme, $isSecret }) =>
    $isSecret ? theme.colors.purple600 : theme.colors.gray400};
  text-align: center;
  font-size: 1.6rem;
  @media (max-width: 460px) {
    font-size: 1.3rem;
  }
  font-style: normal;
  font-weight: 300;
  letter-spacing: -0.08rem;
  > svg {
    > path {
      fill: ${({ theme, $isSecret }) =>
        $isSecret ? theme.colors.purple600 : theme.colors.gray400};
    }
  }
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
    position: relative;
    width: 100%;
    textarea {
      width: 100%;
      resize: none;
      border: none;
      padding: 2rem;
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

const CancelButton = styled.button`
  cursor: pointer;
  border: none;
  padding: 0.8rem 1.5rem;
  background: ${({ theme }) => theme.colors.gray400};
  color: ${({ theme }) => theme.colors.gray50};
  border-radius: 0.4rem;
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

  > div {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 2rem;
  }
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
  max-width: 51rem;
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

const CreatedAt = styled.div`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: 1.4rem;
  @media (max-width: 460px) {
    font-size: 1.1rem;
  }
  font-weight: 300;
  letter-spacing: -0.03rem;
`;

const HiddenRadio = styled.input.attrs({ type: 'radio' })`
  appearance: none;
  border: max(2px, 0.1em) solid gray;
  border-radius: 50%;
  width: 1.25em;
  height: 1.25em;
  transition: border 0.5s ease-in-out;

  &:checked {
    border: 0.4em solid tomato;
  }
`;

const RadioLabel = styled.span`
  font-size: 1.6rem;
  @media (max-width: 460px) {
    font-size: 1.3rem;
  }
  color: #333;
`;

const RadioWrapper = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 8px;
  position: relative;
  gap: 1.2rem;
`;

const AccessRestrictedReport = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 3.1rem 5.5rem 3.1rem 5.5rem;

  @media (max-width: 500px) {
    padding: 2rem 3rem;
  }
  width: 100%;
  max-width: 51rem;
  flex-shrink: 0;
  border-radius: 5px 5px 0 0;
  background: ${({ theme }) => theme.colors.backgroundLayer1};
  box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.11);

  > textarea {
    border-radius: 5px;
    padding: 1rem;
    min-height: 9rem;
    margin-bottom: 2.8rem;
    @media (max-width: 500px) {
      margin-bottom: 2rem;
    }
    resize: none;
    width: 100%;
    max-width: 40rem;
    height: 5.7rem;
    font-size: 1.6rem;
    @media (max-width: 460px) {
      font-size: 1.3rem;
    }
  }

  > div:last-child {
    display: flex;
    justify-content: center;
    color: var(--Gray-Gray_light-gray-700_light, #464646);
    text-align: center;
    font-size: 1.4rem;
    @media (max-width: 460px) {
      font-size: 1.1rem;
    }
    font-style: normal;
    font-weight: 400;
    line-height: 3.4rem;
    letter-spacing: -0.056rem;
  }
`;

const TextReport = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  > span {
    &:first-child {
      display: flex;
      gap: 1.2rem;
      color: var(--Gray-Gray_light-gray-700_light, #464646);
      text-align: center;
      font-size: 2rem;
      @media (max-width: 460px) {
        font-size: 1.7rem;
      }
      font-style: normal;
      font-weight: 400;
      line-height: 3.4rem;
      letter-spacing: -0.08rem;
    }

    &:nth-child(2) {
      color: ${({ theme }) => theme.colors.gray400};
      font-size: 1.4rem;
      @media (max-width: 460px) {
        font-size: 1.1rem;
      }
      font-style: normal;
      font-weight: 400;
      line-height: 3.4rem;
      letter-spacing: -0.056rem;
    }

    > div {
      display: flex;
      align-items: center;
    }
  }

  > form {
    margin-bottom: 1.3rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;

    > div {
      display: flex;
      align-items: center;
      gap: 1.4rem;
      color: ${({ theme }) => theme.colors.gray700};
      font-size: 1.6rem;
      @media (max-width: 460px) {
        font-size: 1.3rem;
      }
      font-style: normal;
      font-weight: 400;
      line-height: 3.4rem;
      letter-spacing: -0.064rem;

      > input {
        &.custom-radio {
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          margin-bottom: 0.8rem;
        }

        &.custom-radio input[type='radio'] {
          appearance: none;
          -webkit-appearance: none;
          width: 1.2rem;
          height: 1.2rem;
          margin: 0 0.6rem 0 0;
          border: 2px solid #f68512;
          border-radius: 50%;
          outline: none;
          cursor: pointer;
          position: relative;
        }

        @media (hover: hover) and (pointer: fine) {
          &.custom-radio input[type='radio']:hover {
            border-color: #f06f00;
          }
        }

        &.custom-radio input[type='radio']:checked::before {
          content: '';
          display: block;
          width: 0.6rem;
          height: 0.6rem;
          border-radius: 50%;
          background-color: #f68512;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        &.custom-radio span {
          font-size: 1.4rem;
          @media (max-width: 460px) {
            font-size: 1.1rem;
          }
          color: #333;
          user-select: none;
        }
      }
    }
  }
`;
