import styled from 'styled-components';
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
              {/* 제목 */}
              <span>{post.title}</span>
              {/* 댓글 개수 */}
              <span>[{post.comment_count}]</span>
            </PostingTitle>

            <PostingWriter>
              <span>{formatRelativeTime(post.created_at)}</span>
              <span>•</span>
              <span>by</span>
              <span className="nickname">{post.writer_nickname}</span>
              {/* <span>•</span>
              <span>
                <Eye /> {post.view_count}
              </span> */}
            </PostingWriter>
          </PostingInfo>
        </li>
      ))}
    </PostingListWrapper>
  );
}

/* --- 스타일 수정 시작 --- */
const PostingListWrapper = styled.ul`
  width: 100%;
  min-height: 50vh;

  > li {
    height: 9.2rem;

    padding: 1.5rem 0;
    cursor: pointer;
    width: 100%;

    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
    @media (max-width: 460px) {
      height: 7rem;
      padding: 0.7rem 0;
    }
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background-color: ${({ theme }) => theme.colors.gray100};
      }
    }
  }
`;

const PostingTagContainer = styled.div`
  flex-shrink: 0;
  width: 10rem;
  height: 50%;

  > div {
    width: 100%;
    height: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @media (max-width: 460px) {
    width: 8rem;
  }
`;

const PostingInfo = styled.div`
  flex: 1;
  min-width: 0;
  gap: 0.7rem;

  display: flex;
  flex-direction: column;
`;

const PostingTitle = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;

  > span:first-child {
    flex-shrink: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 3rem;

    color: ${({ theme }) => theme.colors.gray700};
    font-size: 2rem;
    @media (max-width: 460px) {
      font-size: 1.7rem;
    }
    font-weight: 600;
    letter-spacing: -0.1rem;
  }

  > span:last-child {
    flex-shrink: 0;
    margin-left: 0.5rem;
    color: ${({ theme }) => theme.colors.gray700};
    font-size: 1.6rem;
    @media (max-width: 460px) {
      font-size: 1.3rem;
    }
    font-style: normal;
    font-weight: 400;
    letter-spacing: -0.08rem;
  }
`;

const PostingWriter = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  > span {
    display: flex;
    align-items: center;
    gap: 0.25rem;

    color: ${({ theme }) => theme.colors.gray500};
    font-size: 1.4rem;
    font-style: normal;
    line-height: normal;
    letter-spacing: -0.07rem;

    &.nickname {
      font-weight: 500;
    }

    @media (max-width: 460px) {
      font-size: 1.1rem;
    }

    > svg {
      display: flex;
      align-items: center;
      @media (max-width: 460px) {
        font-size: 1.1rem;
      }
    }
  }
`;
/* --- 스타일 수정 끝 --- */

const PostingTag = styled.div<{ $color: string }>`
  color: ${({ theme }) => theme.colors.gray50};
  text-align: center;

  font-size: 1.3rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.065rem;
  @media (max-width: 460px) {
    font-size: 1.1rem;
  }
  > div {
    display: flex;
    align-items: center;
    padding: 1rem;
    height: 2.2rem;
    border-radius: 1.6rem;
    background-color: ${({ theme, $color }) => `${theme.colors[$color]}`};
  }
`;
