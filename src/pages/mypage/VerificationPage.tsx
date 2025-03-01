import styled from 'styled-components';
import WarnSVG from '@/assets/svg/SignUpPage/ErrorMsgSVG.svg?react';
import ImgFileSVG from '@/assets/svg/SignUpPage/ImgFileSVG.svg?react';
import TimeSVG from '@/assets/svg/SignUpPage/TimeSVG.svg?react';
import TrashcanSVG from '@/assets/svg/SignUpPage/TrashcanSVG.svg?react';
import UnlockSVG from '@/assets/svg/SignUpPage/UnlockSVG.svg?react';
import VerifiedSVG from '@/assets/svg/mypage/check.svg?react';
import PentagonSVG from '@/assets/svg/SignUpPage/PentagonSVG.svg?react';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/utils/auth';

export interface UserProfile {
  id: number;
  college: string;
  registered_posts: string[];
  scrapped_posts: string[];
  registered_marketposts: string[];
  scrapped_marketposts: string[];
  comments: string[];
  password: string; // 보통 비밀번호는 내려주지 않지만, Swagger 상에 나와있으니 일단 포함
  last_login: string | null;
  email: string;
  name: string;
  birth: string | null;
  nickname: string;
  student_type: string | null;
  login_type: string | null;
  univ_certified: boolean;
  created_at: string;
  is_staff: boolean;
  is_active: boolean;
  social_id: string | null;
  social_additional_info: any; // 구조에 따라 세부 타입 정의 가능
}

async function fetchUserProfile(): Promise<UserProfile> {
  return fetchWithAuth<UserProfile>(
    `${import.meta.env.VITE_API_DOMAIN}/api/user/profile`,
    {
      method: 'GET'
    }
  );
}

export default function VerificationPage() {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [preview, setPreview] = useState<string>('');
  const imgFileRef = useRef<HTMLInputElement>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const { data, isLoading } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile
  });
  const onClickReupload = () => {
    if (imgFileRef.current) {
      imgFileRef.current.value = '';
      imgFileRef.current.click();
    }
  };

  const onClickDelete = () => {
    setPreview('');
    setImgFile(null);
  };

  const onSaveImage = () => {
    const reader = new FileReader();
    if (imgFileRef.current?.files) {
      const file = imgFileRef.current.files[0];
      setImgFile(file);
      if (file) {
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setPreview(reader.result as string);
          if (imgFileRef.current) {
            imgFileRef.current.value = '';
          }
        };
      }
    }
  };
  const uploadUniversityImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image_upload', file);
      let accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      const headers = { Authorization: `Bearer ${accessToken}` };
      const data = await fetch(
        `${import.meta.env.VITE_API_DOMAIN}/api/user/univrequest`,
        {
          headers,
          method: 'POST',
          body: formData
        }
      );
      return data;
    },
    onSuccess: () => {
      // console.log('🎉 University verification request successful:', data);
      alert('University verification request has been successfully submitted.');
    },
    onError: (error) => {
      console.error('❌ University verification request failed:', error);
      alert(
        'You are either already verified, or an error occurred during the request.'
      );
    }
  });
  const onClickImgSubmit = () => {
    if (!imgFile) {
      alert('Please Attach Image File');
      return;
    }

    uploadUniversityImageMutation.mutate(imgFile);
  };

  useEffect(() => {
    if (data) {
      setIsVerified(data.univ_certified);
    }
  }, [data]);
  if (isLoading) {
    return (
      <VerifiedWrapper className="loading">
        <img src="../../assets/gif/SignUpPage/" alt="" />
        Checking the Verification Status...
      </VerifiedWrapper>
    );
  }

  return (
    <StudentVerificationLayout>
      <StudentVerificationWrapper>
        <Title>Student Verification</Title>
        {isVerified ? (
          <VerifiedWrapper>
            <VerifiedSVG />
            You already have verified.
          </VerifiedWrapper>
        ) : (
          <>
            <Guide>
              <span>Please upload an image file to </span>
              <span>prove that you are a student at Sogang University.</span>
            </Guide>
            <Example>
              ex. Student ID Card, Saint Main page Screenshot, Course Records
            </Example>
            <Warnning>
              <div>
                <WarnSVG />
              </div>
              <span>
                Your real name and university name must be visible. <br />
                You can hide other personal details such as card numbers or
                photos.
              </span>
            </Warnning>
            <AttatchImage>
              {preview === '' ? (
                <>
                  <label htmlFor="file">
                    <ImgFileSVG />
                    <span>Attach Image File</span>
                    <span>JPG, PNG, JPEG</span>
                  </label>
                </>
              ) : (
                <>
                  <img src={preview} alt="proving-source" />
                </>
              )}
              <input
                type="file"
                accept="image/*"
                id="file"
                name="file"
                ref={imgFileRef}
                onChange={onSaveImage}
                style={{ display: 'none', cursor: 'pointer' }}
              />
            </AttatchImage>
            {preview !== '' && (
              <ButtonWrapper>
                <button onClick={onClickReupload}>reupload</button>
                <button onClick={onClickDelete}>delete</button>
              </ButtonWrapper>
            )}
            <Notice>
              <div>
                <ItemWrapper>
                  <StyledPentagonSVG />
                  <TimeSVG />
                </ItemWrapper>
                <span>
                  File verification may take <span>1-2 days</span>.
                </span>
              </div>
              <div>
                <ItemWrapper>
                  <StyledPentagonSVG />
                  <TrashcanSVG />
                </ItemWrapper>
                <span>
                  Your file will be <span>deleted</span> after verification.
                </span>
              </div>
              <div>
                <ItemWrapper>
                  <StyledPentagonSVG />
                  <UnlockSVG />
                </ItemWrapper>
                <span>
                  You can access <span>Community</span> and <span>Market</span>.
                </span>
              </div>
            </Notice>
            <SubmitButtonLayout>
              <SubmitButtonWrapper>
                <SubmitButton onClick={onClickImgSubmit}>Submit</SubmitButton>
              </SubmitButtonWrapper>
            </SubmitButtonLayout>
          </>
        )}
      </StudentVerificationWrapper>
    </StudentVerificationLayout>
  );
}
const VerifiedWrapper = styled.div`
  height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;
  margin-bottom: 3.4rem;
  color: ${({ theme }) => theme.colors.purple600};
  font-size: 2.4rem;
  font-style: normal;
  font-weight: 700;
  line-height: 3.6rem; /* 150% */
  letter-spacing: -1.2px;
  &.loading {
    color: ${({ theme }) => theme.colors.gray700};
  }
`;

const StudentVerificationLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StudentVerificationWrapper = styled.div`
  width: 100%;
`;

const Title = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  display: flex;
  margin-bottom: 1rem;
  height: 43px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.gray700};

  font-size: 2.6rem;
  font-style: normal;
  font-weight: 700;
  line-height: 2.6rem; /* 100% */
  letter-spacing: -1.8px;
`;

const Guide = styled.div`
  width: 100%;
  margin-bottom: 1rem;

  > span {
    &:last-child {
      color: ${({ theme }) => theme.colors.purple600};
      font-size: 1.6rem;
      font-style: normal;
      font-weight: 700;
      line-height: 2.2rem; /* 150% */
      letter-spacing: -0.72px;
    }
    color: ${({ theme }) => theme.colors.gray700};
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.6rem; /* 150% */
    letter-spacing: -0.72px;
  }
`;

const Example = styled.div`
  width: 100%;
  color: ${({ theme }) => theme.colors.gray500};
  font-size: 1.6rem;
  font-style: normal;
  font-weight: 400;
  line-height: 2rem; /* 180% */
  letter-spacing: -0.6px;
  margin-bottom: 0.5rem;
`;

const Warnning = styled.div`
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 2.7rem;

  > span {
    color: var(--Semantic-Negative-900, #ea3729);

    font-size: 1.6rem;
    font-weight: 500;
    line-height: 20px; /* 160% */
    letter-spacing: -0.2px;
  }
`;

const AttatchImage = styled.div`
  cursor: pointer;
  width: 100%;
  height: 20.2rem;
  flex-shrink: 0;
  border-radius: 5px;
  border: 1px dashed ${({ theme }) => theme.colors.purple650};
  background: ${({ theme }) => theme.colors.backgroundLayer1};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 3.4rem;

  > img {
    height: 80%;
    object-fit: cover;
  }

  > label {
    width: 100%;
    height: 100%;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    > span {
      &:last-child {
        color: ${({ theme }) => theme.colors.purple600};
        text-align: center;

        font-size: 16px;
        font-style: normal;
        font-weight: 300;
        line-height: 36px; /* 225% */
        letter-spacing: -0.16px;
      }

      color: ${({ theme }) => theme.colors.gray700};
      text-align: center;

      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      line-height: 36px; /* 150% */
      letter-spacing: -0.24px;
    }
  }
`;

const Notice = styled.div`
  display: flex;
  position: relative;
  justify-content: space-evenly;
  margin-bottom: 3.2rem;
  > div {
    display: flex;
    flex-direction: column;

    align-items: center;
    width: 22.4rem;

    > span {
      color: ${({ theme }) => theme.colors.gray600};
      text-align: center;

      font-size: 1.4rem;
      font-style: normal;
      font-weight: 400;
      line-height: 1.8rem; /* 180% */
      letter-spacing: -0.2px;

      > span {
        font-weight: 700;
      }
    }
  }
`;

const ItemWrapper = styled.div`
  width: 9.6rem;
  height: 10rem;
  position: relative;
  margin-bottom: 1.6rem;
  > svg {
    position: absolute;
    &:last-child {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;

const SubmitButtonLayout = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
`;

const SubmitButtonWrapper = styled.div`
  width: 19rem;
`;

const StyledPentagonSVG = styled(PentagonSVG)`
  path {
    fill: ${({ theme }) => theme.colors.purple100};
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: end;
  gap: 2rem;
  margin-bottom: 3.4rem;

  > button {
    cursor: pointer;
    width: 10rem;
    padding: 1.2rem;
    border-radius: 5px;
    border: none;
    background: ${({ theme }) => theme.colors.purple600};
    color: ${({ theme }) => theme.colors.gray50};
    text-align: center;

    font-size: 1.4rem;
    font-style: normal;
    font-weight: 500;
    line-height: 36px; /* 180% */
    letter-spacing: -1px;
  }
`;

const SubmitButton = styled.div`
  cursor: pointer;
  margin-top: 2.6rem;
  margin-bottom: 15.5rem;
  width: 100%;
  height: 50px;
  flex-shrink: 0;
  border-radius: 5px;
  border: none;
  background: ${({ theme }) => theme.colors.purple600};
  color: ${({ theme }) => theme.colors.gray50};
  text-align: center;

  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 36px; /* 180% */
  letter-spacing: -1px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
