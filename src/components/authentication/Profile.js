import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Alert, Card, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import CenteredContainer from './CenteredContainer';

export default function Profile() {
	const [error, setError] = useState('');
	const { currentUser, logout } = useAuth();
	const history = useHistory();

	async function handleLogOut() {
		setError('');

		try {
			await logout();
			history.pushState('/login');
		} catch {
			setError('Failed to Log out....');
		}
	}

	return (
		<CenteredContainer>
			<Card>
				<Card.Body>
					<h2 className='text-center mb-4'>Profile</h2>
					{error && <Alert variant='danger'>{error}</Alert>}
					<strong>Email:</strong>
					{currentUser.email}
					<Link to='/update-profile' className='btn btn-primary w-100 mt-3'>
						Update Profile
					</Link>
				</Card.Body>
			</Card>

			<div className='w-100 text-center mt-2'>
				<Button
					variant='outline-primary'
					className='mr-2'
					onClick={handleLogOut}>
					Log Out
				</Button>
				{/* </div>
			<div className='w-100 text-center mt-2'> */}
				<Link to='/' className='btn btn-outline-primary'>
					Back
				</Link>
			</div>
		</CenteredContainer>
	);
}
