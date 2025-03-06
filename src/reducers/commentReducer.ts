// src/reducers/commentReducer.ts
export type CommentState = {
  isEditing: boolean;
  isSecret: boolean;
  editedContent: string;
  isOpenRecomment: boolean;
  recomment: string;
};

export type CommentAction =
  | { type: 'TOGGLE_EDIT' }
  | { type: 'SET_EDITED_CONTENT'; payload: string }
  | { type: 'TOGGLE_SECRET' }
  | { type: 'TOGGLE_RECOMMENT' }
  | { type: 'SET_RECOMMENT'; payload: string };

export const initialCommentState: CommentState = {
  isEditing: false,
  isSecret: false,
  editedContent: '',
  isOpenRecomment: false,
  recomment: ''
};

export function commentReducer(
  state: CommentState,
  action: CommentAction
): CommentState {
  switch (action.type) {
    case 'TOGGLE_EDIT':
      return { ...state, isEditing: !state.isEditing };
    case 'SET_EDITED_CONTENT':
      return { ...state, editedContent: action.payload };
    case 'TOGGLE_SECRET':
      return { ...state, isSecret: !state.isSecret };
    case 'TOGGLE_RECOMMENT':
      return { ...state, isOpenRecomment: !state.isOpenRecomment };
    case 'SET_RECOMMENT':
      return { ...state, recomment: action.payload };
    default:
      return state;
  }
}
