import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Card, Image } from 'react-bootstrap';

export default function File({ file }) {
	return (
		<Card className='text-center' style={{ width: '250px' }}>
			<Card.Img variant='top' src={file.url} />
			<Card.Body
				className='btn-outline-dark text-truncate w-100'
				style={{
					justifyContent: 'center',
					alignContent: 'center',
				}}>
				<Card.Title style={{ fontSize: 'calc(.75rem + .5vh)' }}>
					<hr />
					{file.name}
				</Card.Title>
				<Button
					variant='light'
					href={file.url}
					target='_blank'
					rel='noreferrer'
					className='btn btn-outline-dark text-truncate w-100'>
					<FontAwesomeIcon icon={faFile} className='mr-2' />
					{file.name}
				</Button>
			</Card.Body>
		</Card>
	);
}
