import React from 'react'
import temp from '../images/player/p-02-01.svg'
import './UserBlock.css'

class UserBlock extends React.Component {
    render() {
        return(
            <div className='UserBlock-container'>
                <img src={temp} />
                <h3>{this.props.userName}</h3>
                <h4>STATUS</h4>
            </div>
        )
    }
}

export default UserBlock