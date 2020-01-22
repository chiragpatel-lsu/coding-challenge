import React, {Component} from 'react';
import GifDisplay from "./GifDisplay";
import {addGif, getUserProfile} from "../services/user";
import {Link, Redirect} from "react-router-dom";
import {search} from "../services/gif";

class AddGif extends Component {
    constructor(props) {
        super(props);

        this.state = {
            token: this.props.token,
            username: this.props.username,
            gif: this.props.gif,
            categories: "",
            gifs: [],
            favorite: false,
        };
    }

    handleInputChange = e => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };

    handleAddClick = async () => {
        const {username, token, gif, categories, favorite} = this.state;
        gif.categories = categories;
        gif.favorite = favorite;
        await addGif({username, token, gif});

        // TODO handle errors
        const user = getUserProfile({username, token});

        this.setState({success: true, token: token, gifs: user.gifs});
    };

    render() {
        const {gif, success, username, token, gifs} = this.state;

        if (success) {
            return <Redirect to={{
                pathname: '/profile',
                state: {username, token, gifs}
            }}/>
        }

        return (
            <div className="add-gif-wrapper gif-wrapper col-12 shadow-lg p-3 mb-5 bg-white">
                <div className="image-wrapper">
                    <img name="url" src={gif.url} alt={gif.title}/>
                </div>
                <div className="favorite-wrapper">
                    <input
                        name="favorite"
                        type="checkbox"
                        checked={gif.favorite}
                        onChange={this.handleInputChange}/>
                    <label>Favorite</label>
                </div>
                <div className="categories-wrapper">
                    <label>Categories</label>
                    <input
                        name="categories"
                        type="text"
                        className="display-block"
                        placeholder="Enter comma separated categories"
                        value={gif.categories}
                        onChange={this.handleInputChange}/>
                </div>

                <button type='button'
                        onClick={this.handleAddClick}
                        className='rounded-0 btn btn-dark btn-block add-gif'>Add to profile
                </button>
            </div>
        );
    }
}

export default AddGif;