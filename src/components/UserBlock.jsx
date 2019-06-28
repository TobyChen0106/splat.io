import React from 'react'
import temp from '../images/player/p-01.svg'

class UserBlock extends React.Component {
    render() {
        return(
            <div>
                <img src={temp} />
                <h3>NAME</h3>
                <h4>STATUS</h4>
            </div>
        )
    }
}

export default UserBlock