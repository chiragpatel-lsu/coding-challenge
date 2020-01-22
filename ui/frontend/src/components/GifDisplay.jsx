import React, {Component} from 'react';

class GifDisplay extends Component {
    constructor(props) {
        super(props);
    }

    handleInputChange = e => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };

    render() {
        const {favorite, url, categories, title} = this.props;

        return (
            <div className="gif-wrapper shadow-lg p-3 mb-5 bg-white">
                <div className="image-wrapper">
                    <img name="url" src={url} alt={title}/>
                </div>
                <div className="favorite-wrapper">
                    <input
                        name="favorite"
                        type="checkbox"
                        checked={favorite}
                        onChange={this.handleInputChange}/>
                    <label>Favorite</label>
                </div>
                <div className="categories-wrapper">
                    <label>Categories:</label>
                    <input
                        name="categories"
                        type="text"
                        readOnly
                        className="display-block border-0"
                        value={categories}
                        onChange={this.handleInputChange}/>
                </div>
            </div>
        );
    }
}

export default GifDisplay;