import styled from 'styled-components';
import Profile from '@/assets/svg/CommunityPage/Profile.svg?react';
import Like from '@/assets/svg/CommunityPage/Like.svg?react';
import Scrap from '@/assets/svg/CommunityPage/Scrap.svg?react';

//import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { PostDetail } from '@/pages/community/DetailCommunityPage';
import { useEffect, useState } from 'react';
import MoreButton from './MoreButton';
import { formatRelativeTime } from '@/utils/formatTime';
import { TiptapViewOnly } from './TipTapViewOnly';

const PostingTagsColors: Record<string, string> = {
  Living: `purple950`,
  Travel: 'purple650',
  Others: 'gray400',
  Campus: 'purple450'
};

const getTagColor = (tag: string) => PostingTagsColors[tag];
const PostingTagWrapper = ({ tag }: { tag: string }) => {
  return (
    <PostingTag $color={getTagColor(tag)}>
      <div>{tag}</div>
    </PostingTag>
  );
};

interface PostingProps {
  post: PostDetail;
  isLiked: boolean;
  isScraped: boolean;
  onClickLike: () => void;
  onClickScrap: () => void;
}

export default function Posting({
  post,
  isLiked,
  isScraped,
  onClickLike,
  onClickScrap
}: PostingProps) {
  const [openMore, setOpenMore] = useState(false);

  const [localLikeCount, setLocalLikeCount] = useState(post.like_count);
  const [localLiked, setLocalLiked] = useState(post.is_liked);

  const [localScrapCount, setLocalScrapCount] = useState(post.scrap_count);
  const [localScrapped, setLocalScrapped] = useState(post.is_scrapped);

  const [replacedContent, setReplacedContent] = useState(post.content);
  const [changed, setChanged] = useState(false);

  const handleLikeClick = () => {
    if (localLiked) {
      setLocalLikeCount((prev) => prev - 1);
    } else {
      setLocalLikeCount((prev) => prev + 1);
    }
    setLocalLiked((prev) => !prev);
    onClickLike();
  };

  const handleScrapClick = () => {
    if (localScrapped) {
      setLocalScrapCount((prev) => prev - 1);
    } else {
      setLocalScrapCount((prev) => prev + 1);
    }
    setLocalScrapped((prev) => !prev);
    onClickScrap();
  };

  useEffect(() => {
    const replace = async () => {
      let newContent = post.content; // post.content의 원본을 새로운 변수에 저장

      post.images.forEach((imgObj, index) => {
        const placeholder = `src={images[${index}].image_url}`;
        const realSrc = `src="${imgObj.image_url}"`;
        newContent = newContent.replace(placeholder, realSrc);
      });

      await setReplacedContent(newContent);
      setChanged(true);
    };

    replace();
  }, [post, replacedContent, changed]);

  return (
    <PostingWrapper>
      <InfoWrapper>
        <PostingTagWrapper tag={post.tag} />

        <TitleWrapper>
          <Title>{post.title}</Title>

          <MoreButton
            post={post}
            openMore={openMore}
            setOpenMore={setOpenMore}
          />
        </TitleWrapper>

        <PostingWriter>
          <Profile />
          <span>{formatRelativeTime(post.created_at)}</span>
          <span>•</span>
          <span>by</span>
          <span>{post.writer_nickname}</span>
          {/* <span>•</span>
          <span>
            <Eye /> {post.view_count}
          </span> */}
        </PostingWriter>
      </InfoWrapper>

      <ContentWrapper>
        {(changed || post.content !== replacedContent) && (
          <TiptapViewOnly content={replacedContent} />
        )}

        <ButtonWrapper>
          <Button className={`${isLiked && 'liked'}`} onClick={handleLikeClick}>
            <Like />
            <span>
              {localLikeCount} <span>likes</span>
            </span>
          </Button>
          <Button
            className={`${isScraped && 'scraped'}`}
            onClick={handleScrapClick}
          >
            <Scrap />
            <span>
              {localScrapCount} <span>scraps</span>
            </span>
          </Button>
        </ButtonWrapper>
      </ContentWrapper>
    </PostingWrapper>
  );
}

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PostingWrapper = styled.div`
  margin-bottom: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PostingTag = styled.div<{ $color: string }>`
  color: ${({ theme }) => theme.colors.gray50};
  text-align: center;

  font-size: 1.3rem;
  @media (max-width: 460px) {
    font-size: 1rem;
  }
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.065rem;
  display: flex;

  > div {
    display: flex;
    align-items: center;
    padding: 1rem;
    height: 2.2rem;
    border-radius: 1.6rem;
    background-color: ${({ theme, $color }) => `${theme.colors[$color]}`};
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  > button {
    position: relative;
    border: none;
    background-color: transparent;
    cursor: pointer;
    min-width: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.gray800};
  font-size: 2.8rem;
  @media (max-width: 460px) {
    font-size: 2.4rem;
  }
  font-style: normal;
  font-weight: 700;
  line-height: 3.6rem; /* 128.571% */
  letter-spacing: -0.112rem;
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
    font-size: 1.4rem;
    @media (max-width: 460px) {
      font-size: 1.1rem;
    }

    font-style: normal;
    line-height: normal;
    letter-spacing: -0.07rem;

    &:first-child,
    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(6),
    &:nth-child(7) {
      font-weight: 300;
    }

    &:nth-child(5),
    &:nth-child(4) {
      font-weight: 500;
    }

    > svg {
      display: flex;
      align-items: center;
    }
  }
`;

const ContentWrapper = styled.div`
  width: 100%;

  border-top: 1px solid ${({ theme }) => theme.colors.gray300};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
`;

// const StyledReactQuill = styled(ReactQuill)`
//   width: 100%;

//   box-sizing: border-box;

//   .ql-container {
//     border: none;
//   }

//   .ql-editor,
//   .ql-blank {
//     min-height: 42.6rem;
//   }

//   .ql-size-small {
//     font-size: 1.5rem;
//     @media (max-width: 460px) {
//       font-size: 1.2rem;
//     }
//   }

//   p {
//     font-size: 2rem;
//     @media (max-width: 460px) {
//       font-size: 1.7rem;
//     }
//   }

//   .ql-size-large {
//     font-size: 3rem;
//     @media (max-width: 460px) {
//       font-size: 2%.6;
//     }
//   }
// `;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2.1rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border-radius: 2.4rem;
  background: ${({ theme }) => theme.colors.backgroundLayer1};
  border: none;

  display: flex;
  align-items: center;
  gap: 1rem;

  > span {
    color: ${({ theme }) => theme.colors.gray700};
    text-align: center;

    font-size: 1.6rem;
    @media (max-width: 460px) {
      font-size: 1.3rem;
    }
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    letter-spacing: -0.08rem;
    > span {
      @media (max-width: 460px) {
        display: none;
      }
    }
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${({ theme }) => theme.colors.purple100};
    }
  }

  &.liked {
    background: ${({ theme }) => theme.colors.purple100};
    > svg > path {
      fill: ${({ theme }) => theme.colors.purple600};
      stroke: ${({ theme }) => theme.colors.purple600};
    }

    > span {
      color: ${({ theme }) => theme.colors.purple600};
      font-weight: 500;
    }
  }

  &.scraped {
    background: ${({ theme }) => theme.colors.purple100};
    > svg > g > path {
      fill: ${({ theme }) => theme.colors.purple600};
      stroke: ${({ theme }) => theme.colors.purple600};
    }

    > span {
      color: ${({ theme }) => theme.colors.purple600};
      font-weight: 500;
    }
  }
`;
