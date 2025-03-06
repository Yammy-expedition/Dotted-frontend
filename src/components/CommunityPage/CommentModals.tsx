import { ModalAction, ModalState } from '@/reducers/modalReducer';
import DeleteModal from './DeleteModal';
import ReportModal from './ReportModal';

type CommentModalsProps = {
  modalState: ModalState;
  modalDispatch: React.Dispatch<ModalAction>;
  handleDelete: () => void;
  ReportMutation: () => void;
};

export default function CommentModals({
  modalState,
  modalDispatch,
  handleDelete,
  ReportMutation
}: CommentModalsProps) {
  return (
    <>
      <DeleteModal
        isOpen={modalState.openDeleteModal}
        onRequestClose={() => modalDispatch({ type: 'CLOSE_DELETE_MODAL' })}
        onDelete={handleDelete}
      />
      {/* 신고 모달 */}
      <ReportModal
        isOpen={modalState.openReportModal}
        onRequestClose={() => modalDispatch({ type: 'CLOSE_REPORT_MODAL' })}
        reportType={modalState.reportType}
        setReportType={(type) =>
          modalDispatch({ type: 'SET_REPORT_TYPE', payload: type })
        }
        reportContent={modalState.reportContent}
        setReportContent={(content) =>
          modalDispatch({ type: 'SET_REPORT_CONTENT', payload: content })
        }
        onSubmit={ReportMutation}
      />
    </>
  );
}
