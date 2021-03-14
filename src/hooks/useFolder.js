import { useReducer, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

import { database } from '../firebase';

const ACTIONS = {
	SELECT_FOLDER: 'select-folder',
	UPDATE_FOLDER: 'update-folder',
	SET_CHILD_FOLDERS: 'set-child-folders',
};

export const ROOT_FOLDER = {
	name: `Home`,
	id: null,
	path: [],
};

function reducer(state, { type, payload }) {
	switch (type) {
		case ACTIONS.SELECT_FOLDER:
			return {
				folderID: payload.folderID,
				folder: payload.folder,
				childFolders: [],
				childFiles: [],
			};
		case ACTIONS.UPDATE_FOLDER:
			return {
				...state,
				folder: payload.folder,
			};
		case ACTIONS.SET_CHILD_FOLDERS:
			return {
				...state,
				childFolders: payload.childFolders,
			};
		default:
			return state;
	}
}

export function useFolder(folderID = null, folder = null) {
	const [state, dispatch] = useReducer(reducer, {
		folderID,
		folder,
		childFolders: [],
		childFiles: [],
	});

	const { currentUser } = useAuth();

	useEffect(() => {
		dispatch({ type: ACTIONS.SELECT_FOLDER, payload: { folderID, folder } });
	}, [folderID, folder]);

	useEffect(() => {
		if (folderID == null) {
			return dispatch({
				type: ACTIONS.UPDATE_FOLDER,
				payload: { folder: ROOT_FOLDER },
			});
		}

		database.folders
			.doc(folderID)
			.get()
			.then((doc) => {
				dispatch({
					type: ACTIONS.UPDATE_FOLDER,
					payload: { folder: database.formatDoc(doc) },
				});
			})
			.catch(() => {
				dispatch({
					type: ACTIONS.UPDATE_FOLDER,
					payload: { folder: ROOT_FOLDER },
				});
			});
	}, [folderID]);

	useEffect(() => {
		return database.folders
			.where('parentID', '==', folderID)
			.where('userID', '==', currentUser.uid)
			.orderBy('createdAt')
			.onSnapshot((snapshot) => {
				dispatch({
					type: ACTIONS.SET_CHILD_FOLDERS,
					payload: { childFolders: snapshot.docs.map(database.formatDoc) },
				});
			});
	}, [folderID, currentUser]);

	return state;
}
