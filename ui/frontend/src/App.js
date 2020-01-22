import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Profile from "./components/Profile";

import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import SearchGift from "./components/SearchGif";

function App() {
    return (<Router>
            <div className='App'>
                <nav className='navbar navbar-expand-lg navbar-light fixed-top'>
                    <div className='container'>
                        <Link className='navbar-brand' to={'/sign-in'}>HEB Coding Challenge</Link>
                        <div className='collapse navbar-collapse'>
                            <ul className='navbar-nav ml-auto'>
                                <li className='nav-item'>
                                    <Link className='nav-link' to={'/sign-in'}>Login</Link>
                                </li>
                                <li className='nav-item'>
                                    <Link className='nav-link' to={'/sign-up'}>Register</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className='wrapper'>
                    <div className='wrapper-inner'>
                        <Switch>
                            <Route exact path='/' component={Login}/>
                            <Route path='/sign-in' component={Login}/>
                            <Route path='/register' component={Register}/>
                            <Route path='/profile' component={Profile}/>
                            <Route path='/search' component={SearchGift}/>
                        </Switch>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;
