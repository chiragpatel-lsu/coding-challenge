import React, {Component} from 'react';
import GifDisplay from "./GifDisplay";
import {Redirect} from "react-router-dom";
import {getUserProfile} from "../services/user";

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            token: this.props.location.state.token,
            username: this.props.location.state.username,
            gifs: this.props.location.state.gifs,
        };
    }

    componentDidMount = () => {
        const {username, token} = this.state;
        const userResp = getUserProfile({username, token: token});
        userResp.then((response) => {
            this.setState({gifs: response.gifs});
        })
    };

    handleSearchClick = () => {
        const {username, token} = this.state;
        this.setState({search: true, token: token, username: username});
    };

    render() {
        const {username, token, gifs, search} = this.state;

        if (search) {
            return <Redirect to={{
                pathname: '/search',
                state: {username, token}
            }}/>
        }

        return (
            <div>
                <h1>My Profile</h1>
                <div className="username">
                    <span>Username: </span> <span>{username}</span>
                </div>
                <br/>
                <div className="gifs">
                    <h2>
                        My Gifs
                    </h2>
                    {gifs && gifs.map((gif, i) =>
                        <GifDisplay key={i} url={gif.url}
                                    favorite={gif.favorite}
                                    title={gif.title}
                                    categories={gif.categories ? gif.categories.join(", ") : ""}/>
                    )}

                    <div className="actions">
                        <button type='button'
                                onClick={this.handleSearchClick}
                                className='rounded-0 btn btn-dark btn-block'>Search Gifs!
                        </button>
                    </div>

                </div>
            </div>
        );
    }
}

export default Profile;