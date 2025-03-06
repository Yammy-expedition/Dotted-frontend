import Locker from '@/assets/svg/MarketPage/Locker.svg?react';
import { CommentAction, CommentState } from '@/reducers/commentReducer';
import styled from 'styled-components';

type CommentInputProps = {
  commentState: CommentState;
  commentDispatch: React.Dispatch<CommentAction>;
  handleRecommentSubmit: () => void;
  origin?: string;
};

export default function CommentInput({
  commentState,
  commentDispatch,
  handleRecommentSubmit,
  origin
}: CommentInputProps) {
  return (
    <CommentInputWrapper>
      <label htmlFor="comment">
        <textarea
          name="comment"
          placeholder="Write a reply..."
          value={commentState.recomment}
          onChange={(e) =>
            commentDispatch({
              type: 'SET_RECOMMENT',
              payload: e.target.value
            })
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleRecommentSubmit();
            }
          }}
        />
        {origin === 'market' && (
          <SecretButton
            onClick={() => commentDispatch({ type: 'TOGGLE_SECRET' })}
            $isSecret={commentState.isSecret}
          >
            <Locker />
            <span>secret comment</span>
          </SecretButton>
        )}
      </label>
      <CommentButton onClick={handleRecommentSubmit}>Reply</CommentButton>
    </CommentInputWrapper>
  );
}

const SecretButton = styled.button<{ $isSecret: boolean }>`
  cursor: pointer;
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.8rem;
  border-radius: 0.5rem;
  border: 1px solid
    ${({ theme, $isSecret }) =>
      $isSecret ? theme.colors.purple600 : theme.colors.gray300};
  color: ${({ theme, $isSecret }) =>
    $isSecret ? theme.colors.purple600 : theme.colors.gray400};
  text-align: center;

  font-size: 1.6rem;
  @media (max-width: 460px) {
    font-size: 1.3rem;
  }
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  letter-spacing: -0.08rem;
  > svg {
    > path {
      fill: ${({ theme, $isSecret }) =>
        $isSecret ? theme.colors.purple600 : theme.colors.gray400};
    }
  }

  > span {
    @media (max-width: 700px) {
      display: none;
    }
  }
`;

const CommentButton = styled.button`
  cursor: pointer;
  border: none;
  padding: 0 2rem;
  height: 10rem;
  border-radius: 0.4rem;
  background: ${({ theme }) => theme.colors.purple600};
  color: ${({ theme }) => theme.colors.gray50};
  text-align: center;
  font-size: 1.6rem;
  @media (max-width: 460px) {
    font-size: 1.3rem;
  }
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.08rem;
`;

const CommentInputWrapper = styled.div`
  width: 100%;
  height: 10rem;
  @media (max-width: 400px) {
    height: 12rem;
  }
  display: flex;
  justify-content: space-between;
  gap: 1.8rem;
  label {
    position: relative;
    width: 100%;
    textarea {
      resize: none;
      border: none;
      padding: 2rem;
      width: 100%;
      height: 100%;
      border-radius: 0.4rem;
      background: ${({ theme }) => theme.colors.gray100};
      font-size: 1.6rem;
      @media (max-width: 460px) {
        font-size: 1.3rem;
      }
      font-style: normal;
      font-weight: 300;
      letter-spacing: -0.08rem;
    }
  }
`;
