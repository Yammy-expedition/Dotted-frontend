import { Comment, PostDetail } from '@/pages/community/DetailCommunityPage';
import { useEffect, useRef, useState } from 'react';
import Profile from '@/assets/svg/CommunityPage/Profile.svg?react';
import styled from 'styled-components';
import Like from '@/assets/svg/CommunityPage/Like.svg?react';
import More from '@/assets/svg/CommunityPage/More.svg?react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from 'react-modal';
import { fetchWithAuth } from '@/utils/auth';
import { formatRelativeTime } from '@/utils/formatTime';
import Locker from '@/assets/svg/MarketPage/Locker.svg?react';
import { MarketPostDetail } from '@/pages/market/DetailMarketPage';
import ReportFlag from '@/assets/svg/CommunityPage/ReportFlag.svg?react';

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
  // 삭제 상태 로컬 state 추가
  const [isDeleted, setIsDeleted] = useState(reply.is_deleted);
  const moreWrapperRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

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

  // 댓글 삭제 mutation
  const deleteMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      return await fetchWithAuth<void>(
        `${import.meta.env.VITE_API_DOMAIN}/api/posting/comment/${reply.id}/delete`,
        { method: 'DELETE' }
      );
    },
    onSuccess: () => {
      // 로컬 상태 업데이트: 내용과 삭제 플래그, 그리고 닉네임 업데이트
      setEditedContent('Deleted Comment');
      setIsDeleted(true);
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
                  ? {
                      ...r,
                      content: 'Deleted Comment',
                      is_deleted: true,
                      user_nickname: 'Unknown'
                    }
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

  // 대댓글 좋아요 mutation
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
        ['postDetail', reply.post],
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

  // 댓글 수정 mutation
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

  const reportMutation = useMutation<any, Error, void>({
    mutationFn: async () => {
      const dataToSend = {
        report_type: reportType,
        content_type: 'Comment', // 댓글 신고로 변경
        object_id: reply.id,
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
      {/* 프로필 아이콘 렌더링 */}
      {((postIsMine && !isDeleted) ||
        (!isDeleted &&
          (!reply.is_secret || reply.is_mine || commentIsMine))) && <Profile />}
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
              {isDeleted ? 'Unknown' : reply.user_nickname}
              {reply.is_secret && (
                <LockerDiv>
                  <Locker />
                </LockerDiv>
              )}
            </NicknameDiv>
            <ConetentDiv>{editedContent}</ConetentDiv>
            <CreatedAt>{formatRelativeTime(reply.created_at)}</CreatedAt>
          </>
        )}
        {/* 버튼 렌더링: 삭제되지 않았고, 비밀 댓글이 아닐 경우 또는 postIsMine일 경우 */}
        {!isDeleted && (!reply.is_secret || postIsMine) && (
          <ButtonWrapper>
            <button onClick={onClickReplyLike}>
              <Like className={`${isCommentLiked && 'commentLiked'}`} />
              {likeCount}
            </button>
            {editedContent !== 'Deleted Comment' && (
              <MoreWrapper ref={moreWrapperRef}>
                <button onClick={() => setOpenMore((prev) => !prev)}>
                  <More />
                  {openMore && (
                    <Menu>
                      {commentIsMine ? (
                        <>
                          <div onClick={() => setIsEditing(true)}>Edit</div>
                          <div onClick={() => setOpenNormalModal(true)}>
                            Delete
                          </div>
                        </>
                      ) : (
                        // 내 댓글이 아닌 경우 "Report" 클릭 시 신고 모달 오픈
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
            )}
          </ButtonWrapper>
        )}
      </div>
      {/* 삭제 모달 */}
      <Modal
        isOpen={openNormalModal}
        style={customStyles}
        onRequestClose={() => setOpenNormalModal((prev) => !prev)}
        contentLabel="Delete Modal"
      >
        <AccessRestrictedWrapper>
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
              <LaterButton onClick={() => setOpenReportModal((prev) => !prev)}>
                No
              </LaterButton>
              <NowButton onClick={ReportMutation}>Yes</NowButton>
            </ButtonBox>
          </div>
        </AccessRestrictedWrapper>
      </Modal>
    </Comments>
  );
}

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

  /* popup */
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
    line-height: 3.4rem; /* 242.857% */
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
      line-height: 3.4rem; /* 170% */
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
      line-height: 3.4rem; /* 242.857% */
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
      line-height: 3.4rem; /* 212.5% */
      letter-spacing: -0.064rem;

      > input {
        &.custom-radio {
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          margin-bottom: 0.8rem; /* 간격 조정 */
        }

        /* 라디오 버튼을 숨기고, 커스텀 모양을 만들어줄 예정 */
        &.custom-radio input[type='radio'] {
          appearance: none; /* 브라우저 기본 스타일 없애기 */
          -webkit-appearance: none; /* 크롬/사파리 호환 */
          width: 1.2rem;
          height: 1.2rem;
          margin: 0 0.6rem 0 0; /* 오른쪽 여백(텍스트와 간격) */
          border: 2px solid #f68512; /* 주황색 테두리 */
          border-radius: 50%; /* 동그라미 */
          outline: none;
          cursor: pointer;
          position: relative; /* ::before를 위한 위치 기준 */
        }

        /* 선택되지 않은 상태(hover) 시 효과 */
        @media (hover: hover) and (pointer: fine) {
          &.custom-radio input[type='radio']:hover {
            border-color: #f06f00; /* 살짝 어두운 주황 */
          }
        }

        /* 라디오 버튼이 선택된 경우, 안에 점을 찍어준다 */
        &.custom-radio input[type='radio']:checked::before {
          content: '';
          display: block;
          width: 0.6rem;
          height: 0.6rem;
          border-radius: 50%;
          background-color: #f68512; /* 주황색 내부 */
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        /* 라벨 텍스트 */
        &.custom-radio span {
          font-size: 1.4rem;
          @media (max-width: 460px) {
            font-size: 1.1rem;
          }
          color: #333;
          user-select: none; /* 드래그 방지 (옵션) */
        }
      }
    }
  }
`;

const Comments = styled.li`
  display: flex;
  gap: 2.1rem;
  padding-bottom: 2rem;
  margin-top: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  background-color: ${({ theme }) => theme.colors.gray100};
  padding: 2rem;
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

const CancelButton = styled.button`
  cursor: pointer;
  border: none;
  padding: 0.8rem 1.5rem;
  background: ${({ theme }) => theme.colors.gray400};
  color: ${({ theme }) => theme.colors.gray50};
  border-radius: 0.4rem;
`;

const CommentInputWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  textarea {
    flex: 1;
    padding: 1rem;
    border: 1px solid ${({ theme }) => theme.colors.gray300};
    border-radius: 4px;
    font-size: 1.6rem;
  }
`;

const CommentButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.purple600};
  color: ${({ theme }) => theme.colors.gray50};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.6rem;
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

const CreatedAt = styled.div`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: 1.4rem;
  @media (max-width: 460px) {
    font-size: 1.1rem;
  }
  font-weight: 300;
  letter-spacing: -0.03rem;
`;
