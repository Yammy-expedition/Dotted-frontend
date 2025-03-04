import styled from 'styled-components';
import { Comment } from '@/pages/community/DetailCommunityPage';
import AReply from './AReply';

interface ReplySectionProps {
  replies: Comment[];
  postIsMine: boolean;
}

export default function ReplySection({
  replies,
  postIsMine
}: ReplySectionProps) {
  return (
    <CommentInputWrapper>
      {replies.map((reply, idx) => (
        <AReply reply={reply} key={idx} postIsMine={postIsMine} />
      ))}
    </CommentInputWrapper>
  );
}

const CommentInputWrapper = styled.div`
  width: 100%;
`;
