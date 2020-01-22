import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {authenticate, getUserProfile} from "../services/user";

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            loggedIn: false,
            error: false,
            token: '',
            gifs: []
        };
    }

    handleChange = e => {
        const {name, value} = e.target;
        this.setState({[name]: value});
    };

    handleSubmit = async e => {
        e.preventDefault();

        const {username, password} = this.state;
        if (username && password) {
            const response = await authenticate({username, password});
            if (!response.isValid) {
                this.setState({error: true});
            } else {
                const user = getUserProfile({username, token: response.token});
                this.setState({loggedIn: response.isValid, token: response.token, error: false, gifs: user.gifs});
            }
        } else {
            this.setState({error: true});
        }
    };

    render() {
        const {username, password, loggedIn, token, error, gifs} = this.state;
        if (loggedIn) {
            return <Redirect to={{
                pathname: '/profile',
                state: {username, token, gifs}
            }}/>
        }

        return (
            <form name="sign-in-form" onSubmit={this.handleSubmit}>
                <h3>Sign In</h3>

                <div className='form-group'>
                    <label>Username</label>
                    <input type='text'
                           autoFocus={true}
                           required
                           className='form-control rounded-0'
                           placeholder='Enter username'
                           name="username"
                           value={username} onChange={this.handleChange}/>
                </div>

                <div className='form-group'>
                    <label>Password</label>
                    <input type='password'
                           required
                           className='form-control rounded-0'
                           placeholder='Enter password'
                           value={password}
                           name="password"
                           onChange={this.handleChange}/>
                </div>

                {error ? <div className="invalid text-right">Invalid username or password</div> : ''}
                <button type='submit' className='rounded-0 btn btn-primary btn-block'>Submit</button>
                <p className='register text-right'>
                    Not registered yet? <a href='/register'>Register</a>
                </p>
            </form>
        );
    }
}

export default Login;