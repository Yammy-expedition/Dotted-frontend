import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import CultureTiptap from '@/components/tips/culture/CultureTiptap';

// 서버에서 받아오는 데이터 타입
interface CultureDetailResponse {
  title: string;
  content: string;
  college: number;
  // 필요한 필드가 있으면 추가
}

// 폼에 사용할 데이터 타입
export interface CultureData {
  title: string;
  content: string;
  thumbnail_upload?: File;
  college: number;
}

export default function CultureEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, setValue, watch, reset, trigger } =
    useForm<CultureData>();

  // 기존 글 정보를 불러오기
  const { data, isLoading, error } = useQuery<CultureDetailResponse>({
    queryKey: ['cultureDetail', id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_DOMAIN}/api/campus/culture/${id}`,
        {
          method: 'GET',
          mode: 'cors'
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch culture detail');
      }
      return response.json() as Promise<CultureDetailResponse>;
    }
  });

  // data 변경 시 폼 초기값 업데이트
  useEffect(() => {
    if (data) {
      reset({
        title: data.title,
        content: data.content,
        college: data.college ?? 1
      });
    }
  }, [data, reset]);

  // 글 수정 Mutation
  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return fetch(
        `${import.meta.env.VITE_API_DOMAIN}/api/campus/culture/${id}`,
        {
          method: 'PATCH',
          body: formData,
          mode: 'cors'
        }
      );
    },
    onSuccess: () => {
      alert('🎉 글이 성공적으로 수정되었습니다!');
      // 수정 후 이동할 페이지
      navigate('/admin/culture/edit');
    },
    onError: (err) => {
      console.error('❌ 글 수정 실패:', err);
      alert('글 수정에 실패했습니다.');
    }
  });

  // 글 삭제 Mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return fetch(
        `${import.meta.env.VITE_API_DOMAIN}/api/campus/culture/${id}`,
        {
          method: 'DELETE',
          mode: 'cors'
        }
      );
    },
    onSuccess: () => {
      alert('✅ 글이 삭제되었습니다.');
      // 삭제 후 이동할 페이지
      navigate('/admin/culture/edit');
    },
    onError: (err) => {
      console.error('❌ 글 삭제 실패:', err);
      alert('글 삭제에 실패했습니다.');
    }
  });

  // 삭제 버튼 핸들러
  const handleDelete = () => {
    if (window.confirm('정말 이 글을 삭제하시겠습니까?')) {
      deleteMutation.mutate();
    }
  };

  // 파일 업로드 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('thumbnail_upload', file);
    }
  };

  // 폼 제출 시 실행
  const onSubmit = (data: CultureData) => {
    if (updateMutation.isPending) return;

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('college', data.college.toString());
    formData.append('id', id!); // 서버에서 id를 Body로 요구한다면

    if (data.thumbnail_upload) {
      formData.append('thumbnail_upload', data.thumbnail_upload);
    }

    updateMutation.mutate(formData);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>에러가 발생했습니다.</div>;

  return (
    <EditCommunityPageContainer onSubmit={handleSubmit(onSubmit)}>
      <Wrapper>
        {/* 상단 제목 + 삭제 버튼 */}
        <TitleRow>
          <Title>Culture 글 수정</Title>
          <DeleteButton
            type="button" // 폼 submit을 막기 위해 button 타입 지정
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : '삭제'}
          </DeleteButton>
        </TitleRow>

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

        {/* 썸네일 업로드 */}
        <TitleWrapper>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </TitleWrapper>

        {/* 수정 버튼 */}
        <SubmitButton type="submit">
          {updateMutation.isPending ? 'Updating...' : 'Update'}
        </SubmitButton>
      </Wrapper>
    </EditCommunityPageContainer>
  );
}

// 스타일 정의
const EditCommunityPageContainer = styled.form`
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

// 제목 + 삭제버튼을 같은 행(Row)에 배치
const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.div`
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

const DeleteButton = styled.button`
  cursor: pointer;
  border: none;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.red600};
  color: ${({ theme }) => theme.colors.gray800};
  font-size: 1.4rem;
  font-weight: 600;
  padding: 0 1.6rem;
  height: 3.6rem;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
