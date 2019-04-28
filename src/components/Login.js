import React from 'react';
import Navbar from "./Navbar";
import { Redirect } from "@reach/router";

class Login extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			username: '',
			password: '',
			userNiceName: '',
			userEmail: '',
			loggedIn: false,
			error: ''
		}
	}

	createMarkup = ( data ) => ({
		__html: data
	});

	onFormSubmit = ( event ) => {
		event.preventDefault();

		const siteUrl = 'http://localhost:8888/wordpress';

		const loginData = {
			username: this.state.username,
			password: this.state.password
		};

		fetch( `${siteUrl}/wp-json/jwt-auth/v1/token`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify( loginData )
		} )
			.then( ( res ) => {
				res.json()
					.then( ( data ) => {

						if (  undefined === data.token ) {
							this.setState( { error: data.message } );
							return;
						}

						sessionStorage.setItem( 'token', data.token );
						console.warn( typeof data.token );

						const userNiceName = ( data.user_nicename ) ? data.user_nicename : '';
						const userEmail = ( data.user_email ) ? data.user_email : '';
						this.setState( { userNiceName, userEmail, loggedIn: true } )

					} )
			} )
			.catch( err => this.setState( { error: err.message } ) );
	};

	handleOnChange = ( event ) => {
		this.setState( { [event.target.name]: event.target.value } );
	};

	render() {

		const { username, password, userNiceName, loggedIn, error } = this.state;

		if ( loggedIn || sessionStorage.getItem( 'token' ) ) {
			return ( <Redirect to={`/dashboard${userNiceName}`} noThrow /> )
		} else {
			return (
				<React.Fragment>
					<Navbar/>
					<div className="jumbotron">
						<h4>Login</h4>
						{ error && <div className="alert alert-danger" dangerouslySetInnerHTML={ this.createMarkup( error ) }/> }
						<form onSubmit={ this.onFormSubmit }>
							<label className="form-group">
								Username:
								<input
									type="text"
									className="form-control"
									name="username"
									value={ username }
									onChange={ this.handleOnChange }
								/>
							</label>
							<br/>
							<label className="form-group">
								Password:
								<input
									type="password"
									className="form-control"
									name="password"
									value={ password }
									onChange={ this.handleOnChange }
								/>
							</label>
							<br/>
							<button className="btn btn-primary" type="submit">Login</button>
						</form>
					</div>
				</React.Fragment>
			)
		}

	}
}

export default Login;
