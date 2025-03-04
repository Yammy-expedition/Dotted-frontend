import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';
import CultureTiptap from '@/components/tips/culture/CultureTiptap';

export interface CultureData {
  title: string;
  content: string;
  thumbnail_upload?: File;
  college: number;
}

export default function CultureCreatePage() {
  const { register, handleSubmit, setValue, watch, reset, trigger } =
    useForm<CultureData>();

  const postingMutation = useMutation({
    mutationFn: async (data: CultureData) => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('college', data.college.toString());

      if (data.thumbnail_upload) {
        formData.append('thumbnail_upload', data.thumbnail_upload);
      }

      // console.log(
      //   '📌 업로드할 데이터:',
      //   Object.fromEntries(formData.entries())
      // );

      // fetchWithAuth 대신 fetch를 사용하고, 토큰 등 불필요한 헤더를 제거합니다.
      return fetch(`${import.meta.env.VITE_API_DOMAIN}/api/campus/culture`, {
        method: 'POST',
        // FormData를 전송할 경우 Content-Type을 직접 설정하지 않는 것이 좋습니다.
        body: formData,
        mode: 'cors'
      });
    },
    onSuccess: () => {
      alert('🎉 글이 성공적으로 작성되었습니다!');
      reset(); // 입력값 초기화
    },
    onError: (error) => {
      console.error('❌ 글쓰기 실패:', error);
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('thumbnail_upload', file);
    }
  };

  const onSubmit = async (data: CultureData) => {
    if (postingMutation.isPending) return;
    const newPostData = { ...data, college: 1 }; // 기본값 설정
    // console.log('📌 최종 전송 데이터:', newPostData);
    await postingMutation.mutateAsync(newPostData);
  };

  return (
    <WriteCommunityPageContainer onSubmit={handleSubmit(onSubmit)}>
      <Wrapper>
        <Title>Culture 글 쓰기</Title>

        {/* 제목 입력 */}
        <TitleWrapper>
          <input
            type="text"
            placeholder="제목"
            {...register('title', { required: '제목을 입력하세요.' })}
          />
        </TitleWrapper>

        {/* 에디터 (본문) */}
        <CultureTiptap watch={watch} setValue={setValue} trigger={trigger} />

        <TitleWrapper>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </TitleWrapper>

        {/* 제출 버튼 */}
        <SubmitButton type="submit">
          {postingMutation.isPending ? 'Submitting...' : 'Submit'}
        </SubmitButton>
      </Wrapper>
    </WriteCommunityPageContainer>
  );
}

// 🔹 스타일 정의
const WriteCommunityPageContainer = styled.form`
  margin-top: 2.5rem;
  width: 100%;
  padding: 0 24.3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 1200px) {
    padding: 0 10rem;
  }
  @media (max-width: 700px) {
    padding: 0 2rem;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.div`
  width: 100%;
  color: ${({ theme }) => theme.colors.gray700};
  font-size: 3.6rem;
  font-weight: 700;
`;

const TitleWrapper = styled.div`
  width: 100%;
  height: 5.4rem;
  > input {
    width: 100%;
    height: 100%;
    padding: 2rem 2.6rem;
    border: 1px solid ${({ theme }) => theme.colors.gray400};
    background: ${({ theme }) => theme.colors.backgroundLayer2};
    font-size: 1.6rem;
  }
`;

const SubmitButton = styled.button`
  cursor: pointer;
  width: 100%;
  height: 4.2rem;
  border: none;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.purple600};
  color: ${({ theme }) => theme.colors.gray50};
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 13.9rem;
`;
