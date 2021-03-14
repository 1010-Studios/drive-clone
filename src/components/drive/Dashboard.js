import React from 'react';
import { Container } from 'react-bootstrap';
import { useFolder } from '../../hooks/useFolder';
import AddFolderButton from './AddFolderButton';
import FolderBreadCrumbs from './FolderBreadCrumbs';
import Navbar from './Navbar';
import Folder from './Folder';
import { useParams, useLocation } from 'react-router-dom';

export default function Dashboard() {
	const { folderId } = useParams();
	const { state = {} } = useLocation();
	const { folder, childFolders } = useFolder(folderId, state.folder);
	return (
		<>
			<Navbar />
			<Container fluid>
				<div className='d-flex align-items-center'>
					<FolderBreadCrumbs currentFolder={folder} />
					<AddFolderButton currentFolder={folder} />
				</div>
				{/* <Folder folder={folder} /> */}
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
			</Container>
		</>
	);
}
