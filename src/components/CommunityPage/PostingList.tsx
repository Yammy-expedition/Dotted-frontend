import styled from 'styled-components';
import Eye from '@/assets/svg/CommunityPage/Eye.svg?react';
import { EachPost } from '@/types/CommunityPost';
import { useNavigate } from 'react-router-dom';
import { formatRelativeTime } from '@/utils/formatTime';

const PostingTagsColors: Record<string, string> = {
  Living: `purple950`,
  Travel: 'purple650',
  Others: 'gray400',
  Campus: 'purple450'
};

const getTagColor = (tag: string) => PostingTagsColors[tag];
const PostingTagWrapper = ({ tag }: { tag: string }) => {
  if (tag === 'Campus Life') {
    tag = 'Campus';
  }
  return (
    <PostingTag $color={getTagColor(tag)}>
      <div>{tag}</div>
    </PostingTag>
  );
};

interface PostingListProps {
  pagedData: EachPost[];
}

export default function PostingList({ pagedData }: PostingListProps) {
  const navigate = useNavigate();
  return (
    <PostingListWrapper>
      {pagedData.map((post: EachPost, idx: number) => (
        <li key={idx} onClick={() => navigate(`/community/detail/${post.id}`)}>
          <PostingTagContainer>
            <PostingTagWrapper tag={post.tag} />
            <div></div>
          </PostingTagContainer>
          <PostingInfo>
            <PostingTitle>
              <span>{post.title}</span>
              <span>[{post.comment_count}]</span>
            </PostingTitle>
            <PostingWriter>
              <span>{formatRelativeTime(post.created_at)}</span>
              <span>•</span>
              <span>by</span>
              <span className="nickname">{post.writer_nickname}</span>
              <span>•</span>
              <span>
                <Eye /> {post.view_count}
              </span>
            </PostingWriter>
          </PostingInfo>
        </li>
      ))}
    </PostingListWrapper>
  );
}

const PostingListWrapper = styled.ul`
  width: 100%;
  min-height: 50vh;

  > li {
    padding: 1.5rem 0;
    cursor: pointer;
    width: 100%;
    height: 9.2rem;
    display: flex;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background-color: ${({ theme }) => theme.colors.gray100};
      }
    }
  }
`;

const PostingTagContainer = styled.div`
  width: 10rem;
  height: 50%;
  > div {
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const PostingInfo = styled.div`
  width: 100%;
  height: 50%;
`;

const PostingTitle = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  gap: 1rem;

  > span {
    &:first-child {
      color: ${({ theme }) => theme.colors.gray700};
      font-size: 2rem;
      @media (max-width: 460px) {
        font-size: 1.7rem;
      }
      font-weight: 600;
      letter-spacing: -0.1rem;
    }

    color: ${({ theme }) => theme.colors.gray700};

    font-size: 1.6rem;
    @media (max-width: 460px) {
      font-size: 1.3rem;
    }
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: -0.08rem;
  }
`;

const PostingWriter = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  gap: 1rem;

  > span {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: ${({ theme }) => theme.colors.gray500};

    font-style: normal;
    line-height: normal;
    letter-spacing: -0.07rem;
    font-size: 1.4rem;

    &.nickname {
      font-weight: 500;
    }

    @media (max-width: 460px) {
      font-size: 1.1rem;
    }
    gap: 0.5rem;

    > svg {
      display: flex;
      align-items: center;

      @media (max-width: 460px) {
        font-size: 1.1rem;
      }
    }
  }
`;

const PostingTag = styled.div<{ $color: string }>`
  color: ${({ theme }) => theme.colors.gray50};
  text-align: center;

  font-size: 1.3rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.065rem;

  > div {
    display: flex;
    align-items: center;
    padding: 1rem;
    height: 2.2rem;
    border-radius: 1.6rem;
    background-color: ${({ theme, $color }) => `${theme.colors[$color]}`};
  }
`;
