import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import ImgBox from '@/components/MarketPage/ImgBox';
import { useBlocker, useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/utils/auth';

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
        navigate('/market', { replace: true });
      }, 100);
    },
    onError: (error) => {
      console.error('❌ 글쓰기 실패:', error);
    }
  });

  const onSubmit = async (data: MarketData) => {
    if (postingMutation.isPending || updateMutation.isPending) return;

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

  const onSaveImage = (file: File) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        // 이미지 파일 배열 업데이트
        // setImgFiles((prevFiles) => {
        //   const updatedFiles = [...prevFiles];
        //   // + 버튼을 누른 순간 null로 자리가 이미 존재
        //   // 따라서 사진을 추가할 자리의 index를 가져가자!
        //   updatedFiles[index] = file;
        //   return updatedFiles;
        // });

        // 미리보기 배열 업데이트
        setPreviews((prevPreviews) => {
          const updatedPreviews = [...prevPreviews];
          updatedPreviews[updatedPreviews.length] = reader.result as string;
          return updatedPreviews;
        });
      };
    }
  };

  useEffect(() => {
    console.log('');
  }, [previews]);

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
        navigate(`/market/detail/${data.id}`);
      }, 100);
    },
    onError: (error) => {
      console.error('❌ 글수정 실패:', error);
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
