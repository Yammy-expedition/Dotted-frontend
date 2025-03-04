import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useBlocker, useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import TagBox from '@/components/WriteCommunityPage/TagBox';
import { fetchWithAuth } from '@/utils/auth'; // auth.ts에서 정의한 fetchWithAuth를 import
import Tiptap from '@/components/CommunityPage/TipTap';
//import Editor from '@/components/WriteCommunityPage/Editor';
import Modal from 'react-modal';
import LoadingStateComponent from '@/components/common/LoadingStateComponent';

// -------------------- 타입 정의 --------------------
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

export interface CommunityData {
  title: string;
  content: string;
  images: string[]; // create 시에는 base64만 담겨있다고 가정
  tag: string;
}

export interface CommunityUpdateData {
  title: string;
  content: string;
  images: ImagePayload[];
  tag: string;
}

export interface ImagePayload {
  image_id?: number;
  action: 'keep' | 'delete' | 'add';
  order: number;
  image_data?: string; // add 시 필수
}

/** 기존에 서버에서 받아온 이미지 정보 예시 */
interface OriginalImage {
  id: number;
  image_url: string; // 예: s3 url
}

export default function WriteCommunityPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors }
  } = useForm<CommunityData>();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const queryClient = useQueryClient();
  const [isLoading, setisLoading] = useState(false);

  // location state로부터 넘어온 기존 데이터 (수정 모드일 때)
  const { state } = useLocation();

  useEffect(() => {
    if (errors.tag) {
      alert('Please select a tag');
    }
  }, [errors.tag]);

  /**
   * originalImageList에는 서버에서 받아온 기존 이미지 정보( image_id, url 등 )를 저장해둡니다.
   * 수정 시에 keep/delete 여부 판단할 때 사용합니다.
   */
  const originalImageList = useRef<OriginalImage[]>([]);

  useEffect(() => {
    if (state && state.postId) {
      setEditMode(true);
      setValue('title', state.title || '');
      setValue('content', state.content || '');
      setValue('tag', state.tag || '');
      // 서버에서 받아온 기존 이미지 목록
      if (state.images) {
        originalImageList.current = state.images;
      }
    }
  }, [state, setValue]);

  // 뒤로가기/새로고침 방지 로직
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (isSubmitted) return false;
    return currentLocation.pathname !== nextLocation.pathname;
  });

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
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isSubmitted]);

  useEffect(() => {
    return () => {
      if (blocker && blocker.reset) {
        blocker.reset();
      }
    };
  }, []);

  // -------------------------------------
  // 1) 게시글 생성 Mutation
  // -------------------------------------
  const postingMutation = useMutation({
    mutationFn: async (data: CommunityData) => {
      // fetchWithAuth 내부에서 토큰 유효성 검사/갱신이 처리됨
      setisLoading(true);

      const response = await fetchWithAuth<any>(
        `${import.meta.env.VITE_API_DOMAIN}/api/posting/create`,
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
    onSuccess: (data) => {
      // console.log('🎉 글쓰기 성공:', data);
      setIsSubmitted(true);

      // blocker가 막고 있다면 해제하고 이동
      if (blocker.state === 'blocked') {
        blocker.reset();
      }
      setTimeout(() => {
        setisLoading(false);
        navigate(`/community/detail/${data.id}`, { replace: true });
      }, 1500);
    },
    onError: (error) => {
      console.error('❌ 글쓰기 실패:', error);
      setisLoading(false);
    }
  });

  // -------------------------------------
  // 2) 게시글 수정 Mutation (PATCH)
  // -------------------------------------
  const updateMutation = useMutation({
    mutationFn: async ({
      postId,
      data
    }: {
      postId: number;
      data: CommunityUpdateData;
    }) => {
      // fetchWithAuth 내부에서 토큰 관리 수행
      setisLoading(true);
      const response = await fetchWithAuth<any>(
        `${import.meta.env.VITE_API_DOMAIN}/api/posting/${postId}/update`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      );

      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response;
    },
    onSuccess: async (data) => {
      // console.log('🎉 글수정 성공:', data);

      await queryClient.refetchQueries({
        queryKey: ['postDetail', data.id],
        exact: true
      });
      setIsSubmitted(true);
      if (blocker.state === 'blocked') {
        blocker.reset();
      }
      setTimeout(() => {
        setisLoading(false);
        navigate(`/community/detail/${data.id}`);
      }, 1500);
    },
    onError: (error) => {
      console.error('❌ 글수정 실패:', error);
      setisLoading(false);
      if (blocker.state === 'blocked') {
        blocker.reset();
      }
    }
  });

  /**
   * 에디터 내용에서 data URL을 추출합니다. (새로 추가된 이미지)
   * <img src="data:...."> 형태만 뽑아낸다고 가정
   */
  const extractBase64Images = (htmlContent: string) => {
    const srcArray: string[] = [];
    const imgTagRegex = /<img[^>]*src=["'](data:[^"']+)["'][^>]*>/g;
    let match;
    while ((match = imgTagRegex.exec(htmlContent)) !== null) {
      srcArray.push(match[1]);
    }
    return srcArray;
  };

  /**
   * 최종 content에서 <img src="...">를 전부 뽑아내서,
   * 기존 이미지가 여전히 남아있는지(keep), 사라졌는지(delete), 새로 추가되었는지(add) 판별하는 로직 예시
   */
  const buildImagePayloadForUpdate = (
    htmlContent: string,
    originalImages: OriginalImage[]
  ): ImagePayload[] => {
    // 1️⃣ 최종 content에서 모든 img src 추출
    const allImgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/g;
    const foundSrcList: string[] = [];
    let match;
    while ((match = allImgRegex.exec(htmlContent)) !== null) {
      foundSrcList.push(match[1]);
    }

    // 2️⃣ 기존 이미지(keep/delete 판단)
    const imagePayload: ImagePayload[] = [];
    let order = 0;

    for (const original of originalImages) {
      if (foundSrcList.includes(original.image_url)) {
        // 기존 이미지가 content에 남아있다면 keep
        imagePayload.push({
          image_id: original.id,
          action: 'keep',
          order: order++
        });
      } else {
        // 기존 이미지가 content에서 사라졌다면 delete
        imagePayload.push({
          image_id: original.id,
          action: 'delete',
          order: -1
        });
      }
    }

    // 3️⃣ 새로 추가된 Base64 이미지(add)
    for (const src of foundSrcList) {
      if (src.startsWith('data:')) {
        imagePayload.push({
          action: 'add',
          order: order++,
          image_data: src
        });
      }
    }

    return imagePayload;
  };

  const replaceBase64WithBracketExpressions = (htmlContent: string): string => {
    let resultContent = htmlContent;
    let imageIndex = 0;

    // 모든 <img> 태그에서 src 값을 추출하는 정규식
    const imgTagRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/g;

    // 모든 <img> 태그를 순회하면서 처리
    resultContent = resultContent.replace(imgTagRegex, (match, src) => {
      const isBase64 = src.startsWith('data:');

      // 🔹 src가 Base64 데이터인 경우 -> {images[index].image_url}로 변환
      if (isBase64) {
        const replacedTag = match.replace(
          /src=["'][^"']+["']/,
          `src={images[${imageIndex}].image_url}`
        );
        imageIndex++; // 🔹 변환한 경우에만 index 증가
        return replacedTag;
      }

      // 🔹 src가 일반 URL인 경우 -> 변경하지 않고 그대로 둠
      imageIndex++; // 일반 이미지도 인덱스 증가
      return match;
    });

    return resultContent;
  };

  // -------------------------------------
  // onSubmit
  // -------------------------------------
  const onSubmit = async (data: CommunityData) => {
    // 중복 클릭 방지
    if (postingMutation.isPending || updateMutation.isPending) return;

    const currentTag = watch('tag');
    if (!currentTag) {
      alert('Please select a tag');
      return;
    }

    // 1️⃣ Base64 이미지 추출
    const extractedImages = extractBase64Images(data.content);

    // 2️⃣ content 내 <img> 태그 src 변환 (Base64 → {images[index].image_url})
    const transformedContent = replaceBase64WithBracketExpressions(
      data.content
    );
    await setValue('content', transformedContent);
    const updatedContent = watch('content');

    if (!editMode) {
      // 3️⃣ [생성 모드] → 변환된 content와 Base64 이미지를 서버로 전송
      const newPostData: CommunityData = {
        title: data.title,
        content: updatedContent,
        images: extractedImages, // Base64 데이터 포함
        tag: data.tag
      };

      try {
        await postingMutation.mutateAsync(newPostData);
      } catch (error) {
        console.error('❌ 글쓰기 실패:', error);
      }
    } else {
      // 4️⃣ [수정 모드] → 기존 이미지와 비교 후, 변경된 이미지 처리 (keep/delete/add)
      if (!state?.postId) {
        alert('수정할 게시글 ID가 없습니다.');
        return;
      }

      // 기존 이미지 리스트를 기반으로 keep/delete/add 정리
      const imagePayload = buildImagePayloadForUpdate(
        transformedContent,
        originalImageList.current
      );

      // 5️⃣ 추가된 Base64 이미지를 imagePayload에 반영
      for (const img of extractedImages) {
        if (!imagePayload.some((i) => i.image_data === img)) {
          imagePayload.push({
            action: 'add',
            order: imagePayload.length,
            image_data: img
          });
        }
      }

      // 6️⃣ 최종 content도 변환된 src로 업데이트
      const updatedTransformedContent =
        replaceBase64WithBracketExpressions(transformedContent);
      await setValue('content', updatedTransformedContent);
      const finalUpdatedContent = watch('content');

      const updateData: CommunityUpdateData = {
        title: data.title,
        content: finalUpdatedContent,
        images: imagePayload, // 기존 이미지 + 추가된 이미지 반영
        tag: data.tag
      };

      console.log('최종 전송 데이터:', updateData);

      try {
        await updateMutation.mutateAsync({
          postId: state.postId,
          data: updateData
        });
      } catch (error) {
        console.error('❌ 글수정 실패:', error);
      }
    }
  };

  return (
    <WriteCommunityPageContainer onSubmit={handleSubmit(onSubmit)}>
      <Wrapper>
        <Title>Community</Title>
        <TagBox register={register} watch={watch} setValue={setValue} />
        <TitleWrapper>
          <label htmlFor="title" />
          <input
            type="text"
            placeholder="Please write title"
            {...register('title', { required: 'Please write your title' })}
          />
        </TitleWrapper>
        {/* <Editor watch={watch} setValue={setValue} trigger={trigger} /> */}
        <Tiptap watch={watch} setValue={setValue} trigger={trigger} />
        {editMode ? (
          <SubmitButton type="submit">
            {isLoading ? 'Updating...' : 'Edit'}
          </SubmitButton>
        ) : (
          <SubmitButton type="submit">
            {isLoading ? 'Submitting...' : 'Submit'}
          </SubmitButton>
        )}
      </Wrapper>

      <Modal
        isOpen={isLoading}
        style={customStyles}
        contentLabel="Loading Modal"
      >
        <LoadingStateComponent />
      </Modal>
    </WriteCommunityPageContainer>
  );
}

const WriteCommunityPageContainer = styled.form`
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

const Wrapper = styled.div`
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
  margin-bottom: 1.5rem;
`;

const TitleWrapper = styled.div`
  width: 100%;
  height: 5.4rem;

  > input {
    border: none;
    width: 100%;
    height: 100%;
    padding: 2rem 2.6rem;
    outline: none;
    border-top: 1px solid ${({ theme }) => theme.colors.gray400};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray400};
    background: ${({ theme }) => theme.colors.backgroundLayer2};

    font-size: 1.6rem;
    font-style: normal;
    font-weight: 500;
    line-height: 2.4rem; /* 150% */
    letter-spacing: -0.032rem;
  }
`;

const SubmitButton = styled.button`
  cursor: pointer;
  width: 100%;
  height: 4.2rem;
  flex-shrink: 0;
  border: none;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.purple600};
  color: ${({ theme }) => theme.colors.gray50};
  text-align: center;
  font-size: 1.4rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-bottom: 13.9rem;
`;
