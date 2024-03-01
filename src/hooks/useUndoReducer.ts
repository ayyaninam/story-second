import {
	EditStoryAction,
	EditStoryDraft,
} from "@/features/scenes/reducers/edit-reducer";
// import { useReducer } from "react";
import { ImmerReducer, useImmerReducer } from "use-immer";

type UndoState = {
	past: EditStoryDraft[];
	present: EditStoryDraft;
	future: EditStoryDraft[];
};

const useUndoReducer = (
	reducer: ImmerReducer<EditStoryDraft, EditStoryAction>,
	initialState: EditStoryDraft
) => {
	const undoState: UndoState = {
		past: [],
		present: initialState,
		future: [],
	};

	const undoReducer = (state: UndoState, action: EditStoryAction) => {
		const newPresent = reducer(state.present, action) as EditStoryDraft;

		if (action.type === useUndoReducer.types.undo) {
			const [newPresent, ...past] = state.past;
			return {
				past,
				present: newPresent as EditStoryDraft,
				future: [state.present, ...state.future],
			};
		}
		if (action.type === useUndoReducer.types.redo) {
			const [newPresent, ...future] = state.future;
			return {
				past: [state.present, ...state.past],
				present: newPresent as EditStoryDraft,
				future,
			};
		}
		return {
			past: [state.present, ...state.past],
			present: newPresent as EditStoryDraft,
			future: [],
		};
	};

	// We can use react reducer here
	return useImmerReducer(undoReducer, undoState);
};

useUndoReducer.types = {
	undo: "UNDO",
	redo: "REDO",
};

export default useUndoReducer;
