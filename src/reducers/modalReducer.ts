// src/reducers/modalReducer.ts
export type ModalState = {
  openMore: boolean;
  openDeleteModal: boolean;
  openReportModal: boolean;
  reportType: string;
  reportContent: string;
};

export type ModalAction =
  | { type: 'TOGGLE_MORE' }
  | { type: 'CLOSE_MORE' }
  | { type: 'OPEN_DELETE_MODAL' }
  | { type: 'CLOSE_DELETE_MODAL' }
  | { type: 'OPEN_REPORT_MODAL' }
  | { type: 'CLOSE_REPORT_MODAL' }
  | { type: 'SET_REPORT_TYPE'; payload: string }
  | { type: 'SET_REPORT_CONTENT'; payload: string };

export const initialModalState: ModalState = {
  openMore: false,
  openDeleteModal: false,
  openReportModal: false,
  reportType: '',
  reportContent: ''
};

export function modalReducer(
  state: ModalState,
  action: ModalAction
): ModalState {
  switch (action.type) {
    case 'TOGGLE_MORE':
      return { ...state, openMore: !state.openMore };
    case 'CLOSE_MORE':
      return { ...state, openMore: false };
    case 'OPEN_DELETE_MODAL':
      return { ...state, openDeleteModal: true };
    case 'CLOSE_DELETE_MODAL':
      return { ...state, openDeleteModal: false };
    case 'OPEN_REPORT_MODAL':
      return { ...state, openReportModal: true, openMore: false };
    case 'CLOSE_REPORT_MODAL':
      return { ...state, openReportModal: false };
    case 'SET_REPORT_TYPE':
      return { ...state, reportType: action.payload };
    case 'SET_REPORT_CONTENT':
      return { ...state, reportContent: action.payload };
    default:
      return state;
  }
}
