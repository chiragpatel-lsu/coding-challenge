import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
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

        const {username, password} = this.state;
        if (username && password) {

            this.setState({loggedIn: true});
        }
    }


    render() {
        const {username, password, loggedIn} = this.state;

        if (loggedIn) {
            return <Redirect to={{
                pathname: '/welcome',
                state: {username}
            }}/>
        }

        return (
            <form name="sign-in-form" onSubmit={this.handleSubmit}>
                <h3>Sign In</h3>

                <div className='form-group'>
                    <label>Username</label>
                    <input type='text'
                           autoFocus={true}
                           className='form-control'
                           placeholder='Enter username'
                           name="username"
                           value={username} onChange={this.handleChange}/>
                </div>

                <div className='form-group'>
                    <label>Password</label>
                    <input type='password'
                           className='form-control'
                           placeholder='Enter password'
                           value={password}
                           name="password"
                           onChange={this.handleChange}/>
                </div>

                <button type='submit' className='btn btn-primary btn-block'>Submit</button>
                <p className='register text-right'>
                    Not registered yet? <a href='/register'>Register</a>
                </p>
            </form>
        );
    }
}

export default Login;