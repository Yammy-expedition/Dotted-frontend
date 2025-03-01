import { CommunityData } from '@/pages/community/WriteCommunityPage';
import { useEffect } from 'react';
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form';
import styled from 'styled-components';

const tags = ['Living', 'Travel', 'Campus Life', 'Others'];

const PostingTagsColors: Record<string, string> = {
  Living: `purple950`,
  Travel: 'purple650',
  Others: 'gray400',
  Campus: 'purple450'
};

const getTagColor = (tag: string) => PostingTagsColors[tag];

interface TagBoxProps {
  register: UseFormRegister<CommunityData>;
  watch: UseFormWatch<CommunityData>;
  setValue: UseFormSetValue<CommunityData>;
}

export default function TagBox({ register, watch, setValue }: TagBoxProps) {
  const tagValue = watch('tag');
  useEffect(() => {
    if (tagValue === 'Campus') {
      setValue('tag', 'Campus Life');
    }
  }, [tagValue]);

  const onClickTag = (tag: string) => {
    setValue('tag', tag);
  };
  return (
    <TagBoxWrapper>
      {tags.map((tag, idx) => (
        <Tag
          key={idx}
          $color={getTagColor(tag.split(/\s+/)[0])}
          $selected={tagValue === tag}
          onClick={() => onClickTag(tag)}
        >
          {tag}
        </Tag>
      ))}
      <input
        type="hidden"
        {...register('tag', { required: 'Plaese select a tag' })}
      />
    </TagBoxWrapper>
  );
}

const TagBoxWrapper = styled.ul`
  width: 100%;
  height: 5.4rem;

  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 700px) {
    gap: 1rem;
  }

  text-align: center;
  font-size: 1.3rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.065rem;
`;

const Tag = styled.li<{ $selected: boolean; $color: string }>`
  color: ${({ theme, $selected }) =>
    $selected ? 'white' : theme.colors.gray400};
  display: flex;
  align-items: center;
  border-radius: 1.6rem;
  padding: 1rem;
  height: 2.2rem;
  cursor: pointer;
  background-color: ${({ theme, $selected, $color }) =>
    $selected ? `${theme.colors[$color]}` : ''};

  ${({ theme, $selected }) =>
    !$selected &&
    ` @media (hover: hover) and (pointer: fine) {
        &:hover {
        background-color: ${theme.colors.gray200};
        }
      }`}
`;
