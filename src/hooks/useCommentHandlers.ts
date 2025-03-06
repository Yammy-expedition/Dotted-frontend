import { useReducer } from 'react';
import useCommentActions from '@/hooks/useCommentActions';
import { commentReducer, initialCommentState } from '@/reducers/commentReducer';
import { initialModalState, modalReducer } from '@/reducers/modalReducer';
import { Comment } from '@/pages/market/DetailMarketPage';

export function useCommentHandlers(comment: Comment, postId: number) {
  const {
    likeMutation,
    updateMutation,
    recommentMutation,
    deleteMutation,
    reportMutation
  } = useCommentActions({ comment, postId });

  const [commentState, commentDispatch] = useReducer(commentReducer, {
    ...initialCommentState,
    editedContent: comment.content
  });

  const [modalState, modalDispatch] = useReducer(
    modalReducer,
    initialModalState
  );

  const onClickCommentLike = () => likeMutation.mutate();

  const handleEditSubmit = () => {
    if (!commentState.editedContent.trim()) return;
    commentDispatch({ type: 'TOGGLE_EDIT' });
    updateMutation.mutate({
      editedContent: commentState.editedContent,
      isSecret: comment.is_secret
    });
  };

  const handleRecommentSubmit = () => {
    if (!commentState.recomment.trim()) return;
    recommentMutation.mutate({
      recomment: commentState.recomment,
      isSecret: commentState.isSecret
    });
  };

  const handleDelete = () => {
    modalDispatch({ type: 'CLOSE_DELETE_MODAL' });
    deleteMutation.mutate();
  };

  const ReportMutation = () => {
    if (!modalState.reportType) {
      alert('Please select a report type.');
      return;
    }
    if (!modalState.reportContent.trim()) {
      alert('Please enter a reason for the report.');
      return;
    }
    reportMutation.mutate({
      reportType: modalState.reportType,
      reportContent: modalState.reportContent
    });
  };

  return {
    commentState,
    commentDispatch,
    modalState,
    modalDispatch,
    onClickCommentLike,
    handleEditSubmit,
    handleRecommentSubmit,
    handleDelete,
    ReportMutation
  };
}
