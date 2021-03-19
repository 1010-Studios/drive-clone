import { faFile, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import {
	Button,
	ButtonGroup,
	Card,
	Image,
	Modal,
	Form,
	OverlayTrigger,
	Tooltip,
} from 'react-bootstrap';
import { storage, database } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { ROOT_FOLDER } from '../../hooks/useFolder';

export default function File({ file, folder }) {
	const { currentUser } = useAuth();
	const currentFolder = folder;

	const filePath =
		currentFolder === ROOT_FOLDER
			? `${currentFolder.path.join('/')}`
			: `${currentFolder.path.join('/')}/${currentFolder.name}`;

	//Edit Button
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');

	function openModal() {
		setOpen(true);
	}

	function closeModal() {
		setOpen(false);
	}

	function handleSubmit(e) {
		e.preventDefault();

		database.files
			.where('name', '==', file.name)
			.where('userID', '==', currentUser.uid)
			.where('folderID', '==', currentFolder.id)
			.get()
			.then((renameFile) => {
				renameFile.docs[0].ref.update({ name: name });
			})
			.catch((error) => {
				console.log(`Error! ${error}`);
			});

		setName('');
		closeModal();
	}

	//Delete Button
	function deleteItems() {
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
		<>
			<Card className='text-center w-250 p-0' style={{ flex: '1' }}>
				<Card.Header /> {/*Purely for stylistic purposes*/}
				<Card.Body
					className='w-100 p-1'
					style={{
						display: 'flex',
						overflow: 'hidden',
						justifyContent: 'center',
						alignContent: 'center',
					}}>
					<Image src={file.url} />
				</Card.Body>
				<Card.Footer className='pt-0'>
					<hr />
					<Button
						variant='light'
						href={file.url}
						target='_blank'
						rel='noreferrer'
						className='btn btn-outline-dark text-truncate w-100'>
						<FontAwesomeIcon icon={faFile} className='mr-2' />
						{file.name}
					</Button>
					<ButtonGroup className='w-50 mt-1'>
						<OverlayTrigger
							placement='top'
							overlay={<Tooltip id='tt-addfile'>Delete File</Tooltip>}>
							<Button variant='danger' onClick={deleteItems}>
								<FontAwesomeIcon icon={faTrash} />
							</Button>
						</OverlayTrigger>
						<OverlayTrigger
							placement='top'
							overlay={<Tooltip id='tt-addfile'>Edit File Name</Tooltip>}>
							<Button variant='primary' onClick={openModal}>
								<FontAwesomeIcon icon={faEdit} />
							</Button>
						</OverlayTrigger>
					</ButtonGroup>
				</Card.Footer>
			</Card>

			<Modal show={open} onHide={closeModal}>
				<Form onSubmit={handleSubmit}>
					<Modal.Body>
						<Form.Group>
							<Form.Label>Rename File</Form.Label>
							<Form.Control
								type='text'
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</Form.Group>
					</Modal.Body>
					<Modal.Footer>
						<Button variant='secondary' onClick={closeModal}>
							Cancel
						</Button>
						<Button variant='success' type='submit'>
							Rename!
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	);
}
