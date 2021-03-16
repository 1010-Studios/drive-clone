import { faFile, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import { storage, database } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { ROOT_FOLDER } from '../../hooks/useFolder';

export default function File({ file, folder }) {
	const { currentUser } = useAuth();
	const currentFolder = folder;

	//Delete Button
	function deleteItems() {
		const filePath =
			currentFolder === ROOT_FOLDER
				? `${currentFolder.path.join('/')}`
				: `${currentFolder.path.join('/')}/${currentFolder.name}`;

		storage
			.ref(`/files/${currentUser.uid}/${filePath}/${file.name}`)
			.delete(file)
			.then(() => console.log('Deleted!'))
			.catch((error) => console.log(`ERROR! ${error}`));

		database.files
			.where('name', '==', file.name)
			.where('userID', '==', currentUser.uid)
			.where('folderID', '==', currentFolder.id)
			.get()
			.then((querySnapshot) => {
				querySnapshot.docs[0].ref.delete();
			})
			.catch((error) => {
				console.log(`ERROR! ${error}`);
			});
	}

	return (
		<Card className='text-center' style={{ width: '250px' }}>
			<Card.Img variant='top' src={file.url} />
			<Card.Body
				className='text-truncate w-100'
				style={{
					justifyContent: 'center',
					alignContent: 'center',
				}}>
				<Card.Title style={{ fontSize: 'calc(.75rem + .5vh)' }}>
					<hr />
					{/* {file.name} */}
				</Card.Title>
				<Card.Text></Card.Text>
				<ButtonGroup className='w-100'>
					<Button
						variant='light'
						href={file.url}
						target='_blank'
						rel='noreferrer'
						className='btn btn-outline-dark text-truncate w-100'>
						<FontAwesomeIcon icon={faFile} className='mr-2' />
						{file.name}
					</Button>
					<Button variant='danger' onClick={deleteItems}>
						<FontAwesomeIcon icon={faTrash} />
					</Button>
				</ButtonGroup>
			</Card.Body>
		</Card>
	);
}
