import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { storage, database } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { ROOT_FOLDER } from '../../hooks/useFolder';
import { v4 as uuidV4 } from 'uuid';
import { Toast, ProgressBar } from 'react-bootstrap';

export default function AddFileButton({ currentFolder }) {
	const { currentUser } = useAuth();
	const [uploadingFiles, setUploadingFiles] = useState([]);

	function handleUpload(e) {
		const file = e.target.files[0];
		if (currentFolder == null || file == null) return;

		const id = uuidV4();
		setUploadingFiles((preUploadingFiles) => [
			...preUploadingFiles,
			{ id: id, name: file.name, progress: 0, error: false },
		]);

		const filePath =
			currentFolder === ROOT_FOLDER
				? `${currentFolder.path.join('/')}/${file.name}`
				: `${currentFolder.path.join('/')}/${currentFolder.name}/${file.name}`;

		const uploadTask = storage
			.ref(`/files/${currentUser.uid}/${filePath}}`)
			.put(file);

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress = snapshot.bytesTransferred / snapshot.totalBytes;
				setUploadingFiles((preUploadingFiles) => {
					return preUploadingFiles.map((uploadFile) => {
						if (uploadFile.id === id) {
							return { ...uploadFile, progress: progress };
						}
						return uploadFile;
					});
				});
			},
			() => {
				setUploadingFiles((preUploadingFiles) => {
					return preUploadingFiles.map((uploadFile) => {
						if (uploadFile.id === id) {
							return { ...uploadFile, error: true };
						}
						return uploadFile;
					});
				});
			},
			() => {
				setUploadingFiles((preUploadingFiles) => {
					return preUploadingFiles.filter((uploadFile) => {
						return uploadFile.id !== id;
					});
				});

				uploadTask.snapshot.ref.getDownloadURL().then((url) => {
					database.files
						.where('name', '==', file.name)
						.where('userID', '==', currentUser.uid)
						.where('folderID', '==', currentFolder.id)
						.get()
						.then((existingFiles) => {
							const existingFile = existingFiles[0];
							if (existingFile) {
								existingFile.ref.update({ url: url });
							} else {
								database.files.add({
									url: url,
									name: file.name,
									createdAt: database.getCurrentTimeStamp,
									folderID: currentFolder.id,
									userID: currentUser.uid,
								});
							}
						});
				});
			}
		);
	}

	return (
		<>
			<label className='btn btn-outline-success btn-sm m-0 mr-2'>
				<FontAwesomeIcon icon={faFileUpload} />
				<input
					type='file'
					onChange={handleUpload}
					style={{ opacity: 1, position: 'absolute', left: '-9999px' }}
				/>
			</label>

			{/* Upload status -- only shows on document upload*/}
			{uploadingFiles.length > 0 &&
				ReactDOM.createPortal(
					<div
						style={{
							position: 'absolute',
							bottom: '1rem',
							right: '1 rem',
							maxWidth: '250px',
						}}>
						{uploadingFiles.map((file) => (
							<Toast
								key={file.id}
								onClose={() => {
									setUploadingFiles((preUploadingFiles) => {
										return preUploadingFiles.filter((uploadFile) => {
											return uploadFile.id !== file.id;
										});
									});
								}}>
								<Toast.Header
									closeButton={file.error}
									className='text-truncate w-100 d-block'>
									{file.name}
								</Toast.Header>
								<Toast.Body>
									<ProgressBar
										animated={!file.error}
										variant={file.error ? 'danger' : 'primary'}
										now={file.error ? 100 : file.progress * 100}
										label={
											file.error
												? `Error`
												: `${Math.round(file.progress * 100)}%`
										}
									/>
								</Toast.Body>
							</Toast>
						))}
					</div>,
					document.body
				)}
		</>
	);
}
