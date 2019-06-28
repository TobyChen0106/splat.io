import React, {Component} from 'react'

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        return(
            <g>
                <rect x="200" y="200" width="50" height="50" style={{fill:"#FFFFFF"}} />
            </g>
        )
    }

}

export default Timer