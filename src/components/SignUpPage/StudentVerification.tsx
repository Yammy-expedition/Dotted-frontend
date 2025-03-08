import styled from 'styled-components';
//import WarnSVG from '@/assets/svg/SignUpPage/ErrorMsgSVG.svg?react';
import ImgFileSVG from '@/assets/svg/SignUpPage/ImgFileSVG.svg?react';
import TimeSVG from '@/assets/svg/SignUpPage/TimeSVG.svg?react';
import TrashcanSVG from '@/assets/svg/SignUpPage/TrashcanSVG.svg?react';
import UnlockSVG from '@/assets/svg/SignUpPage/UnlockSVG.svg?react';
import PentagonSVG from '@/assets/svg/SignUpPage/PentagonSVG.svg?react';
import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { SignUpFormData } from '@/types/signUpFormData';
import { UseFormWatch } from 'react-hook-form';
// import { fetchWithAuth } from '@/utils/auth'; // auth.ts 경로에 맞게 수정

interface StudentVerificatProps {
  onChangeStep: () => void;
  watch: UseFormWatch<SignUpFormData>;
}

export default function StudentVerificat({
  onChangeStep,
  watch
}: StudentVerificatProps) {
  const [preview, setPreview] = useState<string>('');
  const imgFileRef = useRef<HTMLInputElement>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);

  // 자동 로그인 Mutation: fetchWithAuth를 사용해 토큰 갱신 로직이 내부에서 수행됨
  const autoLoginMutation = useMutation({
    mutationFn: async () => {
      // 로그인은 JSON 요청이므로 Content-Type 헤더를 추가
      let emailValue = watch('email');
      if (emailValue && !emailValue.includes('@')) {
        emailValue += '@sogang.ac.kr';
      }
      const passwordValue = watch('password');
      // console.log(emailValue, passwordValue);

      const data = await fetch(
        `${import.meta.env.VITE_API_DOMAIN}/api/user/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: emailValue,
            password: passwordValue
          })
        }
      );
      return data.json();
    },
    onSuccess: (data) => {
      // console.log('✅ 자동 로그인 성공:', data);
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
    },
    onError: (error) => {
      console.error('❌ 자동 로그인 실패:', error);
    }
  });

  // 페이지 렌더링 시 토큰 없으면 자동 로그인 시도
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // console.log('🔹 토큰 없음, 자동 로그인 시도');
      autoLoginMutation.mutate();
    } else {
      // console.log('✅ 이미 로그인 상태');
    }
  }, []);

  // 업로드 Mutation: FormData 전송이므로 Content-Type 헤더는 생략
  const uploadUniversityImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image_upload', file);
      const accessToken = localStorage.getItem('accessToken');
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
      onChangeStep();
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

  const onClickImgSubmit = () => {
    if (!imgFile) {
      alert('Please Attach Image File');
      return;
    }
    uploadUniversityImageMutation.mutate(imgFile);
  };

  return (
    <StudentVerificationLayout>
      <StudentVerificationWrapper>
        <Title>Student Verification</Title>
        <Guide>
          <span>Please upload an image file to </span>
          <span>prove that you are a student at Sogang University.</span>
        </Guide>
        <Example>
          ex. Student ID Card, Saint Main page Screenshot, KLEC homepage
          screenshot
        </Example>
        <Warnning>
          {/* <div>
            <WarnSVG />
          </div> */}
          <span>
            Your real name and university name must be visible. <br />
            You can hide other personal details such as card numbers or photos.
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
            <span className="PC">
              It takes some <span>time</span> to accept you because we have to
              check this file.
            </span>
            <span className="Mobile">
              File verification may take <span>1–2 days.</span>
            </span>
          </div>
          <div>
            <ItemWrapper>
              <StyledPentagonSVG />
              <TrashcanSVG />
            </ItemWrapper>
            <span className="PC">
              We will <span>destroy</span> this file after checking.
            </span>
            <span className="Mobile">
              Your file will be <span>deleted</span> after verification.
            </span>
          </div>
          <div>
            <ItemWrapper>
              <StyledPentagonSVG />
              <UnlockSVG />
            </ItemWrapper>
            <span className="PC">
              <span>Community</span> and <span>Market</span> can be used after
              you are approved.
            </span>
            <span className="Mobile">
              You can access <span>Community</span> and <span>Market</span>{' '}
              after approval.
            </span>
          </div>
        </Notice>
        <SubmitButtonLayout>
          <SubmitButtonWrapper>
            <SubmitButton onClick={onClickImgSubmit}>Submit</SubmitButton>
          </SubmitButtonWrapper>
        </SubmitButtonLayout>
      </StudentVerificationWrapper>
    </StudentVerificationLayout>
  );
}

const StudentVerificationLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 2rem;
`;

const StudentVerificationWrapper = styled.div`
  max-width: 94.2rem;
`;

const Title = styled.div`
  width: 100%;
  margin-bottom: 3.1rem;
  display: flex;

  height: 43px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.gray700};

  font-size: 36px;
  @media (max-width: 700px) {
    font-size: 33px;
  }
  font-style: normal;
  font-weight: 700;
  line-height: 36px; /* 100% */
  letter-spacing: -1.8px;
`;

const Guide = styled.div`
  width: 100%;
  > span {
    &:last-child {
      color: ${({ theme }) => theme.colors.purple600};

      font-size: 24px;
      @media (max-width: 700px) {
        font-size: 21px;
      }
      font-style: normal;
      font-weight: 700;
      line-height: 36px;
      letter-spacing: -0.72px;
    }
    color: ${({ theme }) => theme.colors.gray700};

    font-size: 24px;
    @media (max-width: 700px) {
      font-size: 21px;
    }
    font-style: normal;
    font-weight: 500;
    line-height: 36px; /* 150% */
    letter-spacing: -0.72px;
  }
`;

const Example = styled.div`
  width: 100%;
  color: ${({ theme }) => theme.colors.gray500};

  font-size: 20px;
  @media (max-width: 700px) {
    font-size: 17px;
  }
  font-style: normal;
  font-weight: 300;
  line-height: 36px; /* 180% */
  letter-spacing: -0.6px;
  margin-bottom: 0.5rem;
`;

const Warnning = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 2.7rem;

  > span {
    color: var(--Semantic-Negative-900, #ea3729);

    font-size: 20px;
    @media (max-width: 700px) {
      font-size: 17px;
    }
    font-style: normal;
    font-weight: 500;
    line-height: 32px; /* 160% */
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
        @media (max-width: 700px) {
          font-size: 13px;
        }
        font-style: normal;
        font-weight: 300;
        line-height: 36px; /* 225% */
        letter-spacing: -0.16px;
      }

      color: ${({ theme }) => theme.colors.gray700};
      text-align: center;

      font-size: 24px;
      @media (max-width: 700px) {
        font-size: 21px;
      }
      font-style: normal;
      font-weight: 700;
      line-height: 36px; /* 150% */
      letter-spacing: -0.24px;
    }
  }
`;

const Notice = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2rem;
  @media (max-width: 700px) {
    grid-template-columns: repeat(1, 1fr);
  }
  position: relative;
  justify-content: space-evenly;
  margin-bottom: 6.2rem;
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: 700px) {
      align-items: start;
      justify-content: center;
    }

    max-width: 22.4rem;
    color: ${({ theme }) => theme.colors.gray600};

    > span {
      &.PC {
        @media (max-width: 700px) {
          display: none;
        }
      }

      &.Mobile {
        display: none;
        @media (max-width: 700px) {
          display: block;
        }
      }
      text-align: center;

      font-size: 20px;
      @media (max-width: 700px) {
        font-size: 17px;
        position: absolute;
        left: 13rem;
      }
      font-style: normal;
      font-weight: 400;
      line-height: 28px; /* 180% */
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

  @media (max-width: 700px) {
    margin: 0;
  }
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

    font-size: 20px;
    @media (max-width: 700px) {
      font-size: 17px;
    }
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
  @media (max-width: 700px) {
    font-size: 17px;
  }
  font-style: normal;
  font-weight: 500;
  line-height: 36px; /* 180% */
  letter-spacing: -1px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
