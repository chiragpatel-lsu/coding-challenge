import React, {Component} from 'react';
import {register} from "../services/user";
import {Redirect} from "react-router-dom";

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            token: '',
            loggedIn: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = e => {
        const {name, value} = e.target;
        this.setState({[name]: value});
    };

    handleSubmit(e) {
        e.preventDefault();

        const {
            username,
            password,
            firstName,
            lastName
        } = this.state;

        // TODO validate input
        if (username && password && firstName && lastName) {
            const response = register({
                username,
                password,
                firstName,
                lastName,
            });
            this.setState({loggedIn: response.isValid, token: response.token});
        }
    }

    render() {
        const {username, password, firstName, lastName, token, loggedIn} = this.state;

        if (loggedIn) {
            return <Redirect to={{
                pathname: '/profile',
                state: {username, token}
            }}/>
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <h3>Register</h3>

                <div className='form-group'>
                    <label>First Name</label>
                    <input type='text'
                           autoFocus
                           className='form-control rounded-0'
                           placeholder='First Name'
                           name="firstName"
                           value={firstName}
                           onChange={this.handleChange}/>
                </div>

                <div className='form-group'>
                    <label>Last Name</label>
                    <input type='text'
                           className='form-control rounded-0'
                           placeholder='Last Name'
                           name="lastName"
                           value={lastName}
                           onChange={this.handleChange}/>
                </div>

                <div className='form-group'>
                    <label>Username</label>
                    <input type='text'
                           className='form-control rounded-0'
                           placeholder='Username'
                           name="username"
                           value={username}
                           onChange={this.handleChange}/>
                </div>

                {/*TODO validate password strength*/}
                <div className='form-group'>
                    <label>Password</label>
                    <input type='password'
                           className='form-control rounded-0'
                           placeholder='Enter Password'
                           name="password"
                           value={password}
                           onChange={this.handleChange}/>
                </div>

                <button type='submit' className='rounded-0 btn btn-primary btn-block'>Sign Up</button>
                <p className='sign-in text-right'>
                    Already registered? <a href='/sign-in'>Sign In</a>
                </p>
            </form>
        );
    }
}

export default Register;