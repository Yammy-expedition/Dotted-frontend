import React, { useEffect, useRef, useState } from 'react';
import More from '@/assets/svg/CommunityPage/More.svg?react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MarketPostDetail } from '@/pages/market/DetailMarketPage';
import { PostDetail } from '@/pages/community/DetailCommunityPage';
import { useMutation } from '@tanstack/react-query';
import Modal from 'react-modal';
import ReportFlag from '@/assets/svg/CommunityPage/ReportFlag.svg?react';
import Change from '@/assets/svg/MarketPage/Change.svg?react';
import { fetchWithAuth } from '@/utils/auth'; // auth.ts에서 import

Modal.setAppElement('#root');

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

interface MoreButtonProps {
  post: MarketPostDetail | PostDetail;
  openMore: boolean;
  setOpenMore: React.Dispatch<React.SetStateAction<boolean>>;
  origin?: string;
  setLocalStatus?: React.Dispatch<React.SetStateAction<string>>;
}

export default function MoreButton({
  post,
  openMore,
  setOpenMore,
  origin,
  setLocalStatus
}: MoreButtonProps) {
  const [openNormalModal, setOpenNormalModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [openChangeModal, setOpenChangeModal] = useState(false);

  const [reportType, setReportType] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [statusType, setStatusType] = useState('');
  const moreWrapperRef = useRef<HTMLButtonElement | null>(null);

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

  let replacedContent = post.content;
  const navigate = useNavigate();

  if (openNormalModal || openReportModal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }

  // 이미지 URL 교체 (필요한 경우)
  if (post.images && post.images.length > 0) {
    post.images.forEach((imgObj, index) => {
      const placeholder = `src={images[${index}].image_url}`;
      const realSrc = `src="${imgObj.image_url}"`;
      replacedContent = replacedContent.replace(placeholder, realSrc);
    });
  }

  // 삭제 Mutation
  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (postId: number) => {
      const path = origin
        ? `/api/posting/${origin}/${postId}/delete`
        : `/api/posting/${postId}/delete`;
      // console.log(`${import.meta.env.VITE_API_DOMAIN}${path}`);
      return await fetchWithAuth<void>(
        `${import.meta.env.VITE_API_DOMAIN}${path}`,
        { method: 'DELETE' }
      );
    },
    onSuccess: () => {
      // console.log('✅ 삭제 성공');
      if (origin) {
        navigate(`/${origin}`);
      } else {
        navigate('/community');
      }
    },
    onError: (error) => {
      console.error('❌ 삭제 실패:', error);
    }
  });

  const handleDelete = () => {
    setOpenNormalModal(false);
    deleteMutation.mutate(post.id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setReportType(e.target.value);
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setStatusType(e.target.value);

  // 상태 변경 Mutation (마켓 게시글)
  const changeStatusMutate = useMutation<any, Error, void>({
    mutationFn: async () => {
      if (!('status' in post) || !('price' in post)) {
        throw new Error(
          'Invalid post type. Only market posts can change status.'
        );
      }
      const updatedPostData = {
        title: post.title,
        content: post.content,
        price: post.price,
        status: statusType,
        images: post.images.map((img, index) => ({
          image_id: img.id,
          action: 'keep',
          order: index + 1
        }))
      };
      // console.log(updatedPostData);
      return await fetchWithAuth<any>(
        `${import.meta.env.VITE_API_DOMAIN}/api/posting/market/${post.id}/update`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPostData)
        }
      );
    },
    onSuccess: () => {
      // console.log('✅ 상태 변경 성공:', data);
      setOpenChangeModal(false);
      if (setLocalStatus) setLocalStatus(statusType);
      if ('status' in post) {
        (post as MarketPostDetail).status = statusType;
      }
    },
    onError: (error) => {
      console.error('❌ 상태 변경 실패:', error);
      alert('Failed to update status.');
    }
  });

  // 신고 Mutation
  const reportMutation = useMutation<any, Error, void>({
    mutationFn: async () => {
      const dataToSend = {
        report_type: reportType,
        content_type: 'Post',
        object_id: post.id,
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
      // console.log('✅ 신고 성공');
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

  return (
    <>
      <button onClick={() => setOpenMore((prev) => !prev)} ref={moreWrapperRef}>
        <More />
        {openMore && (
          <Menu>
            {post.is_mine ? (
              <>
                <div
                  onClick={() =>
                    navigate('edit', {
                      state: {
                        postId: post.id,
                        title: post.title,
                        content: replacedContent,
                        tag: 'status' in post ? post.status : post.tag,
                        images: post.images,
                        price: 'price' in post ? post.price : 0
                      }
                    })
                  }
                >
                  Edit
                </div>
                <div onClick={() => setOpenNormalModal(true)}>Delete</div>
                {origin && (
                  <div onClick={() => setOpenChangeModal(true)}>
                    Change condition
                  </div>
                )}
              </>
            ) : (
              <div onClick={() => setOpenReportModal(true)}>Report</div>
            )}
          </Menu>
        )}
      </button>

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
                <span>Are you sure you want to delete this post?</span>
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
                      onChange={handleChange}
                    />
                    <RadioLabel>Spam</RadioLabel>
                  </RadioWrapper>
                  <RadioWrapper>
                    <HiddenRadio
                      name="reportType"
                      value="ABUSE"
                      checked={reportType === 'ABUSE'}
                      onChange={handleChange}
                    />
                    <RadioLabel>Abuse</RadioLabel>
                  </RadioWrapper>
                  <RadioWrapper>
                    <HiddenRadio
                      name="reportType"
                      value="SEXUAL"
                      checked={reportType === 'SEXUAL'}
                      onChange={handleChange}
                    />
                    <RadioLabel>Sexual</RadioLabel>
                  </RadioWrapper>
                  <RadioWrapper>
                    <HiddenRadio
                      name="reportType"
                      value="ILLEGAL"
                      checked={reportType === 'ILLEGAL'}
                      onChange={handleChange}
                    />
                    <RadioLabel>Illegal</RadioLabel>
                  </RadioWrapper>
                  <RadioWrapper>
                    <HiddenRadio
                      name="reportType"
                      value="OTHERS"
                      checked={reportType === 'OTHERS'}
                      onChange={handleChange}
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

      <Modal
        isOpen={openChangeModal}
        style={customStyles}
        onRequestClose={() => setOpenChangeModal((prev) => !prev)}
        contentLabel="Change Modal"
      >
        <AccessRestrictedWrapper>
          <div>
            <AccessRestrictedReport>
              <TextReport>
                <span>
                  <div>
                    <Change />
                  </div>
                  Change Condition
                </span>
                <form>
                  <ChangeRadioWrapper>
                    <ChangeHiddenRadio
                      name="statusType"
                      value="FOR_SALE"
                      checked={statusType === 'FOR_SALE'}
                      onChange={handleStatusChange}
                    />
                    <RadioLabel>For Sale</RadioLabel>
                  </ChangeRadioWrapper>
                  <ChangeRadioWrapper>
                    <ChangeHiddenRadio
                      name="statusType"
                      value="RESERVED"
                      checked={statusType === 'RESERVED'}
                      onChange={handleStatusChange}
                    />
                    <RadioLabel>Reserved</RadioLabel>
                  </ChangeRadioWrapper>
                  <ChangeRadioWrapper>
                    <ChangeHiddenRadio
                      name="statusType"
                      value="SOLD_OUT"
                      checked={statusType === 'SOLD_OUT'}
                      onChange={handleStatusChange}
                    />
                    <RadioLabel>Sold Out</RadioLabel>
                  </ChangeRadioWrapper>
                </form>
              </TextReport>
            </AccessRestrictedReport>
            <ButtonBox>
              <LaterButton onClick={() => setOpenChangeModal((prev) => !prev)}>
                Cancel
              </LaterButton>
              <ChangeNowButton onClick={() => changeStatusMutate.mutate()}>
                Change
              </ChangeNowButton>
            </ButtonBox>
          </div>
        </AccessRestrictedWrapper>
      </Modal>
    </>
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

const ChangeHiddenRadio = styled.input.attrs({ type: 'radio' })`
  appearance: none;
  border: max(2px, 0.1em) solid gray;
  border-radius: 50%;
  width: 1.25em;
  height: 1.25em;
  transition: border 0.5s ease-in-out;

  &:checked {
    border: 0.4em solid ${({ theme }) => theme.colors.purple600};
  }
`;

const Menu = styled.div`
  z-index: 10;
  position: absolute;
  top: 0%;
  right: 125%;
  margin-top: 1rem;
  background-color: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray800};

  width: 15.9rem;

  flex-shrink: 0;

  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.backgroundLayer2};
  box-shadow: 2px 2px 26.1px -3px rgba(0, 0, 0, 0.22);

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

const ChangeRadioWrapper = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-top: 8px;
  position: relative;
  gap: 1.2rem;
`;

const ButtonBox = styled.div`
  display: flex;
  width: 100%;
  max-width: 51rem;
  height: 7.4rem;
  @media (max-width: 500px) {
    height: 5.5rem;
  }
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
    line-height: 25px; /* 125% */
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

const ChangeNowButton = styled.div`
  width: 50%;
  border-radius: 0px 0px 5px 0px;
  background: ${({ theme }) => theme.colors.purple600};
  color: ${({ theme }) => theme.colors.gray50};
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
    flex-direction: column;
    align-items: center;
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

  /* popup */
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
    line-height: 34px; /* 170% */
    letter-spacing: -0.8px;

    > span {
      font-weight: 700;
    }
  }
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
