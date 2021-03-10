import React from 'react';
import Dashboard from './Dashboard';
import Signup from './Signup';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import PrivateRoute from './PrivateRoute';
import UpdateProfile from './UpdateProfile';
import { Container } from 'react-bootstrap';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
	return (
		<Container
			className='d-flex align-items-center justify-content-center'
			style={{ minHeight: '100vh' }}>
			<div className='w-100' style={{ maxWidth: '400px' }}>
				<Router>
					<AuthProvider>
						<Switch>
							<PrivateRoute exact path='/' component={Dashboard} />
							<PrivateRoute
								exact
								path='/update-profile'
								component={UpdateProfile}
							/>
							<Route path='/signup' component={Signup} />
							<Route path='/login' component={Login} />
							<Route path='/forgotPassword' component={ForgotPassword} />
						</Switch>
					</AuthProvider>
				</Router>
			</div>
		</Container>
	);
}

export default App;
