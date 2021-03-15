import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FolderBreadCrumbs from './FolderBreadCrumbs';
import { useFolder } from '../../hooks/useFolder';
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function NavbarComponent() {
	const { currentUser } = useAuth();
	const { folderId } = useParams();
	const { state = {} } = useLocation();
	const { folder } = useFolder(folderId, state.folder);
	return (
		<Navbar bg='light' expand='mid'>
			<div>
				<FolderBreadCrumbs currentFolder={folder} />
			</div>
			<Nav>
				<Nav.Link as={Link} to='/user'>
					{currentUser.email}
				</Nav.Link>
			</Nav>
		</Navbar>
	);
}
