import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'
import './Wait.css'

class Wait extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teamA: [],
            teamB: []
        }
        this.props.socket.emit('getRoomPlayers', {
            roomId: this.props.roomId
        });
        this.props.socket.on('getRoomPlayers', (data) => {
            this.setState({
                teamA: data.teamA.map(p => p.name),
                teamB: data.teamB.map(p => p.name)
            })
        })
    }

    render() {
        let teamA = this.state.teamA.map(name => <li>{name}</li>);
        let teamB = this.state.teamB.map(name => <li>{name}</li>);

        return(
            <div className='Wait_container'>
                <h1>Game Lobby</h1>
                <h3 id='Wait_message'>waiting for teammates...</h3>
                <div id='Wait_wrapper'>
                    <div className='Wait_group'>
                        <h3 className='Wait_grouptitle'>TEAM A</h3>
                        <ul>
                            {teamA}
                        </ul>
                    </div>
                    <div className='Wait_group'>
                        <h3>TEAM B</h3>
                        <ul>
                            {teamB}
                        </ul>
                    </div>
                </div>
                <div id='Wait_button'>
                    <NavLink to={`/game/${this.props.roomId}`}>
                        <button className='App_button'>
                            Start!
                        </button>
                    </NavLink>
                    <NavLink to={`/home`}>
                        <button className='App_button'>
                            Back
                        </button>
                    </NavLink>
                </div>
                
            </div>
            
        )
    }
}

export default Wait