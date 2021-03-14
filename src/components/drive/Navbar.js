import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NavbarComponent() {
	return (
		<Navbar bg='light' expand='mid'>
			<Navbar.Brand as={Link} to='/'>
				WDS Drive
			</Navbar.Brand>
			<Nav>
				<Nav.Link as={Link} to='/user'>
					User
				</Nav.Link>
			</Nav>
		</Navbar>
	);
}
