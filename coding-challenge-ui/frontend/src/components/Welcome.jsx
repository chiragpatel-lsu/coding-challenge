import React, {Component} from 'react';

class Welcome extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {username} = this.props.location.state;

        return (
            <div>
                {username}
            </div>
        );
    }
}

export default Welcome;