import React from 'react';
import { Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useFolder } from '../../hooks/useFolder';
import AddFolderButton from './AddFolderButton';
// import FolderBreadCrumbs from './FolderBreadCrumbs';
import Navbar from './Navbar';
import Folder from './Folder';
import File from './File';
import { useParams, useLocation } from 'react-router-dom';
import AddFileButton from './AddFileButton';

export default function Dashboard() {
	const { folderId } = useParams();
	const { state = {} } = useLocation();
	const { folder, childFolders, childFiles } = useFolder(
		folderId,
		state.folder
	);
	return (
		<>
			<Navbar />
			<Container fluid>
				{/* New Stuff Section */}
				<div className='d-flex align-items-center'>
					{/* <FolderBreadCrumbs currentFolder={folder} /> */}

					<AddFileButton currentFolder={folder} />
					<AddFolderButton currentFolder={folder} />
				</div>
				<hr />
				{/* Folders */}
				Folders
				{childFolders.length > 0 && (
					<div className='d-flex flex-wrap'>
						{childFolders.map((childFolder) => (
							<div
								key={childFolder.id}
								style={{ maxWidth: '250px' }}
								className='p-2'>
								<Folder folder={childFolder} />
							</div>
						))}
					</div>
				)}
				{/* Files Section */}
				{childFolders.length > 0 && childFiles.length > 0 && (
					<>
						<hr /> <span>Files</span>
					</>
				)}
				{/* Files */}
				{childFiles.length > 0 && (
					<div className='d-flex flex-wrap'>
						{childFiles.map((childFile) => (
							<div
								key={childFile.id}
								style={{ maxWidth: '250px' }}
								className='p-2'>
								<File file={childFile} />
							</div>
						))}
					</div>
				)}
			</Container>
		</>
	);
}
