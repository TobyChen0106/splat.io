import React from 'react'
import green from '../images/player/green/p-01.svg'
import orange from '../images/player/orange/p-01.svg'
import './UserBlock.css'

class UserBlock extends React.Component {
    render() {
        return(
            <div className='UserBlock-container'>
                <img src={this.props.team === 'A'? green:orange} alt={this.props.userName} />
                <h3>{this.props.userName}</h3>
                <h4>{this.props.playerRecord || 'guest'}</h4>
            </div>
        )
    }
}

export default UserBlock