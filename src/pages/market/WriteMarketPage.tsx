import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import ImgBox from '@/components/MarketPage/ImgBox';
import { useBlocker, useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/utils/auth';
import Modal from 'react-modal';
import LoadingStateComponent from '@/components/common/LoadingStateComponent';
import {
  correctImageOrientation,
  handleExifOrientation,
  OrientationCorrectionResult
} from '@/utils/exif';

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

interface MarketData {
  title: string;
  content: string;
  price: number;
  images: (string | null)[];
}

export interface ImagePayload {
  image_id?: number;
  action: 'keep' | 'delete' | 'add';
  order: number;
  image_data?: string; // add 시 필수
}

export interface MarketUpdateData {
  title: string;
  content: string;
  price: number;
  images: ImagePayload[];
}

interface OriginalImage {
  id: number;
  image_url: string; // 예: s3 url
}

export default function WriteMarketPage() {
  const { register, handleSubmit, setValue } = useForm<MarketData>();
  const [previews, setPreviews] = useState<(string | null)[]>([]);
  //const [imgFiles, setImgFiles] = useState<(File | null)[]>([null]);
  const imgFileRef = useRef<HTMLInputElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (isSubmitted) return false;
    return currentLocation.pathname !== nextLocation.pathname;
  });
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const originalImageList = useRef<OriginalImage[]>([]);

  useEffect(() => {
    if (state && state.postId) {
      setEditMode(true);

      // state에 있는 데이터로 form 필드 채우기
      setValue('title', state.title || '');
      setValue('price', state.price || '');
      setValue('content', state.content || '');

      // 기존 이미지 목록을 previews 상태에 넣어주기
      if (state.images) {
        originalImageList.current = state.images; // 원본 이미지 저장
        setPreviews(state.images.map((img: OriginalImage) => img.image_url)); // 이미지 미리보기로 설정
      }
    }
  }, [state, setValue]);

  useEffect(() => {
    if (blocker.state === 'blocked' && !isSubmitted) {
      const confirmLeave = window.confirm(
        'Your unsaved changes may be lost. Do you want to leave?'
      );
      if (confirmLeave) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker, isSubmitted]);

  useEffect(() => {
    return () => {
      if (blocker && blocker.reset) {
        blocker.reset();
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isSubmitted) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isSubmitted]);

  const postingMutation = useMutation({
    mutationFn: async (data: MarketData) => {
      // fetchWithAuth 내부에서 토큰 유효성 검사 및 갱신이 자동으로 처리됨
      const response = await fetchWithAuth<any>(
        `${import.meta.env.VITE_API_DOMAIN}/api/posting/market/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      );

      return response;
    },
    onSuccess: () => {
      setIsSubmitted(true);
      blocker.reset?.();
      setTimeout(() => {
        setIsLoading(false);
        navigate('/market', { replace: true });
      }, 1500);
    },
    onError: (error) => {
      setIsLoading(false);
      console.error('❌ 글쓰기 실패:', error);
    }
  });

  const onSubmit = async (data: MarketData) => {
    if (postingMutation.isPending || updateMutation.isPending) return;
    setIsLoading(true);
    const allImagesCorrect = await checkAllImagesOrientation();

    if (!allImagesCorrect) {
      setIsLoading(false);
      alert(
        '❌ 일부 이미지의 EXIF 오리엔테이션이 1이 아닙니다. 다시 업로드해주세요.'
      );
      return;
    }

    console.log(
      '✅ 모든 이미지의 오리엔테이션이 1입니다. 제출을 계속 진행합니다.'
    );

    if (editMode && state?.postId) {
      // 🔥 수정 모드 (editMode)
      const imagesPayload: ImagePayload[] = [];

      // Get current order of images after potential drag-and-drop reordering
      previews.forEach((preview, newOrder) => {
        // Case 1: Handle existing images that were kept
        const originalImage = originalImageList.current.find(
          (img) => img.image_url === preview
        );

        if (originalImage) {
          imagesPayload.push({
            image_id: originalImage.id,
            action: 'keep',
            order: newOrder + 1 // Adding 1 because API expects 1-based index
          });
        }
        // Case 2: Handle new images that were added
        else if (preview) {
          imagesPayload.push({
            action: 'add',
            order: newOrder + 1,
            image_data: preview
          });
        }
      });

      // Case 3: Handle deleted images
      originalImageList.current.forEach((original) => {
        if (!previews.includes(original.image_url)) {
          imagesPayload.push({
            image_id: original.id,
            action: 'delete',
            order: -1
          });
        }
      });

      const requestData: MarketUpdateData = {
        title: data.title,
        content: data.content,
        price: data.price,
        images: imagesPayload
      };

      // console.log('Update request data:', requestData); // 디버깅용

      try {
        await updateMutation.mutateAsync({
          postId: state.postId,
          data: requestData
        });

        // setIsSubmitted(true);
        // blocker.reset?.();
        // setTimeout(() => {
        //   navigate('/market');
        // }, 100);
      } catch (error) {
        console.error('Update failed:', error);
        alert('Failed to update the post. Please try again.');
      }
    } else {
      // 🔥 새 글 작성 모드
      // Filter out null values from previews array
      const validImages = previews.filter(
        (preview): preview is string => preview !== null
      );

      const requestData: MarketData = {
        title: data.title,
        content: data.content,
        price: data.price,
        images: validImages
      };

      // console.log('Create request data:', requestData); // 디버깅용

      try {
        await postingMutation.mutateAsync(requestData);

        // setIsSubmitted(true);
        // blocker.reset?.();
        // setTimeout(() => {
        //   navigate('/market');
        // }, 100);
      } catch (error) {
        console.error('Creation failed:', error);
        alert('Failed to create the post. Please try again.');
      }
    }
  };

  const handleDeleteImage = (index: number) => {
    //setImgFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  const checkAllImagesOrientation = async () => {
    const files = Array.from(imgFileRef.current?.files || []);
    const results = await Promise.all(
      files.map((file) => handleExifOrientation(file))
    );

    console.log('📸 모든 이미지의 EXIF 오리엔테이션 값 확인:', results);

    // 모든 이미지가 Orientation 1인지 확인
    const allCorrect = results.every(({ orientation }) => orientation === 1);

    return allCorrect;
  };

  const onSaveImage = (file: File) => {
    correctImageOrientation(file).then(async ({ dataUrl, orientation }) => {
      console.log('Final Orientation:', orientation);

      if (!dataUrl) {
        //  데이터 URL이 없면 원래꺼 걍 사용용
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setPreviews((prevPreviews) => {
            const updatedPreviews = prevPreviews.filter(
              (p) => p !== reader.result
            );
            updatedPreviews.push(reader.result as string);
            return updatedPreviews;
          });

          updateFileList(file, true); // 중복 삭제하기기
        };
      } else {
        //  데이터 URL이 있을 경우, 변환된 이미지 사용
        const blob = await fetch(dataUrl).then((res) => res.blob());
        const correctedFile = new File([blob], file.name, {
          type: 'image/jpeg'
        });

        setPreviews((prevPreviews) => {
          const updatedPreviews = prevPreviews.filter((p) => p !== dataUrl);
          updatedPreviews.push(dataUrl);
          return updatedPreviews;
        });

        updateFileList(correctedFile, true); //기존 같은 이름의 파일 삭제 후 업데이트
      }
    });
  };

  //  기존 같은 파일을 제거하고 새로운 파일을 FileList에 업데이트
  const updateFileList = (newFile: File, removeExisting: boolean) => {
    const dataTransfer = new DataTransfer();

    //  기존 파일에서 같은 이름을 가진 파일을 삭제 (removeExisting 옵션이 true일 때만)
    Array.from(imgFileRef.current?.files || []).forEach((file) => {
      if (!removeExisting || file.name !== newFile.name) {
        dataTransfer.items.add(file);
      }
    });

    //  변환된 파일을 추가
    dataTransfer.items.add(newFile);

    if (imgFileRef.current) {
      imgFileRef.current.files = dataTransfer.files;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      onSaveImage(file);
    }
  };

  // -------------------------------------
  // 2) 게시글 수정 Mutation (PATCH)
  // -------------------------------------
  const updateMutation = useMutation({
    mutationFn: async ({
      postId,
      data
    }: {
      postId: number;
      data: MarketUpdateData;
    }) => {
      // fetchWithAuth 내부에서 토큰 관리 수행
      const response = await fetchWithAuth<any>(
        `${import.meta.env.VITE_API_DOMAIN}/api/posting/market/${postId}/update`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      );
      return response;
    },
    onSuccess: async (data) => {
      // console.log('🎉 글수정 성공:', data);
      await queryClient.refetchQueries({
        queryKey: ['postDetail', data.id],
        exact: true
      });
      setIsSubmitted(true);
      blocker.reset?.();
      setTimeout(() => {
        setIsLoading(false);
        navigate(`/market/detail/${data.id}`);
      }, 100);
    },
    onError: (error) => {
      console.error('❌ 글수정 실패:', error);
      setIsLoading(false);
    }
  });

  return (
    <WriteMarketPageContainer>
      <WriteMarketPageWrapper>
        <Title>Market</Title>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="title">
            <span>Title</span>
            <input
              placeholder="Please write title"
              type="text"
              id="title"
              {...register('title', { required: 'Please enter a title' })}
            />
          </label>

          <label htmlFor="price">
            <span>Price</span>
            <input
              type="number"
              className="price"
              placeholder="₩"
              id="price"
              {...register('price', { required: 'Please enter a price' })}
            />
          </label>

          <label htmlFor="image">
            <span>Image</span>
            <ImgBox
              previews={previews}
              imgFileRef={imgFileRef}
              handleDeleteImage={handleDeleteImage}
              handleFileChange={handleFileChange}
              setPreviews={setPreviews}
            />
          </label>

          <label htmlFor="content">
            <span>Content</span>
            <textarea
              placeholder="Please write content"
              id="content"
              {...register('content', { required: 'Please enter a content' })}
            />
          </label>

          {editMode ? (
            <SubmitButton type="submit">
              {updateMutation.isPending ? 'Updating...' : 'Edit'}
            </SubmitButton>
          ) : (
            <SubmitButton type="submit">
              {postingMutation.isPending ? 'Submitting...' : 'Submit'}
            </SubmitButton>
          )}
        </Form>
      </WriteMarketPageWrapper>
      <Modal
        isOpen={isLoading}
        style={customStyles}
        contentLabel="Loading Modal"
      >
        <LoadingStateComponent />
      </Modal>
    </WriteMarketPageContainer>
  );
}

const WriteMarketPageContainer = styled.div`
  margin-top: 2.5rem;
  width: 100%;
  padding: 0 24.3rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 1200px) {
    padding: 0 7.7rem;
  }

  @media (max-width: 900px) {
    padding: 0 5rem;
  }

  @media (max-width: 700px) {
    padding: 0 2rem;
  }
`;

const WriteMarketPageWrapper = styled.div`
  width: 100%;
  max-width: 1287px;
`;

const Title = styled.div`
  width: 100%;
  color: ${({ theme }) => theme.colors.gray700};

  font-size: 3.6rem;
  font-style: normal;
  font-weight: 700;
  line-height: 3.6rem; /* 100% */
  letter-spacing: -0.18rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 2.5rem;
  gap: 2.5rem;
  margin-bottom: 13.7rem;
  > label {
    width: 100%;
    display: flex;
    gap: 2rem;

    @media (max-width: 770px) {
      flex-direction: column;
      gap: 1rem;
    }

    > span {
      flex: 0 0 auto;
      display: flex;
      width: 10rem;
      @media (max-width: 770px) {
        gap: 0rem;
      }
      margin-top: 0.5rem;

      color: ${({ theme }) => theme.colors.gray700};

      font-size: 2rem;
      font-style: normal;
      font-weight: 500;
      line-height: 2.4rem; /* 120% */
      letter-spacing: -0.04rem;

      @media (max-width: 460px) {
        font-size: 1.7rem;
      }
    }

    > input {
      width: 100%;
      padding: 0;
      padding-left: 1.2rem;
      height: 3.7rem;
      border-radius: 0.5rem;
      border: 1px solid ${({ theme }) => theme.colors.gray400};
      background: ${({ theme }) => theme.colors.backgroundLayer2};

      &.price {
        width: 23.5rem;

        @media (max-width: 770px) {
          width: 15rem;
        }
      }
    }

    > textarea {
      width: 100%;
      resize: none;
      height: 22.5rem;
      border-radius: 0.5rem;
      border: 1px solid ${({ theme }) => theme.colors.gray400};
      background: ${({ theme }) => theme.colors.backgroundLayer2};
      margin-bottom: 1.2rem;

      padding: 1.2rem;

      font-size: 1.6rem;
      @media (max-width: 460px) {
        font-size: 1.3rem;
      }
      font-style: normal;
      font-weight: 500;
      line-height: 2.4rem; /* 150% */
      letter-spacing: -0.032rem;
    }
  }
`;

const SubmitButton = styled.button`
  cursor: pointer;
  width: 100%;
  display: grid;
  place-items: center;
  height: 4.2rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.purple600};

  border: none;
  color: ${({ theme }) => theme.colors.gray50};
  text-align: center;
  font-size: 1.4rem;
  @media (max-width: 460px) {
    font-size: 1.1rem;
  }
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;
