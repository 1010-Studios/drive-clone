import React from 'react';
import { Container } from 'react-bootstrap';
import { useFolder } from '../../hooks/useFolder';
import AddFolderButton from './AddFolderButton';
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
					<div className='w-100'>{/*Placeholder Div*/}</div>
					<AddFileButton currentFolder={folder} linkStyle='btn' />
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
				<>
					<hr /> <span>Files</span>
				</>
				{childFiles.length > 0 && (
					<div className='d-flex flex-wrap'>
						{childFiles.map((childFile) => (
							<div
								key={childFile.id}
								style={{
									display: 'flex',
									maxWidth: '250px',
									maxHeight: '300px',
								}}
								className='p-2 m-1'>
								<File file={childFile} folder={folder} />
							</div>
						))}
					</div>
				)}
				{!childFiles.length > 0 && (
					<div className='d-flex flex-wrap p-2 m-1'>
						<div>
							Such empty! Would you like to
							<AddFileButton currentFolder={folder} linkStyle='link' />
						</div>
					</div>
				)}
			</Container>
		</>
	);
}
