import React, {Component} from 'react';
import {search} from "../services/gif";
import GifDisplay from "./GifDisplay";
import AddGif from "./AddGif";
import userEvent from "@testing-library/user-event";

class SearchGift extends Component {
    constructor(props) {
        super(props);

        this.state = {
            token: this.props.location.state.token,
            username: this.props.location.state.username,
            term: '',
            gifs: []
        };
    }

    handleChange = e => {
        const {name, value} = e.target;
        this.setState({[name]: value});
    };

    handleSearchClick = async () => {
        const {username, token, term} = this.state;
        if (term) {
            // TODO pagination
            const response = await search({term, pageNumber: 1, token});
            if (response.error) {
                this.setState({error: true})
            } else {
                this.setState({gifs: response.data})
            }
        }
    };

    render() {
        const {gifs, term, username, token} = this.state;

        return (
            <div className="search-wrapper">
                <div className="search">
                    <div className='form-group'>
                        <label>Search Term</label>
                        <input type='text'
                               autoFocus={true}
                               required
                               className='form-control rounded-0'
                               placeholder='Enter term'
                               name="term"
                               value={term} onChange={this.handleChange}/>
                    </div>

                    <button type='button'
                            onClick={this.handleSearchClick}
                            className='rounded-0 btn btn-dark btn-block'>Search
                    </button>

                </div>

                <div className="results row">
                    {gifs && gifs.length > 0 && gifs.map((gif, i) =>
                        <AddGif key={i} gif={gif} token={token} username={username}/>
                    )}
                </div>
            </div>
        );
    }
}

export default SearchGift;