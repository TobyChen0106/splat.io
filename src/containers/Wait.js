import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Redirect } from 'react-router'
import './Wait.css'
import UserBlock from '../components/UserBlock'

const player_number = 4;

class Wait extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teamA: [],
            teamB: [],
            isRoomFull: []
        }
        this.props.socket.emit('getRoomPlayers', {
            roomId: this.props.roomId
        });
        this.props.socket.on('getRoomPlayers', (data) => {
            this.setState({
                teamA: data.teamA.map(p => p.name),
                teamB: data.teamB.map(p => p.name),
                isRoomFull: data.isRoomFull
            })
        })
    }

    handleBack = () => {
        // this.props.socket.emit('disconnect');
        this.props.socket.disconnect();
        this.props.socket.open()
        this.props.history.push('/home');
        this.props.setName();
    }

    render() {
        var waitingforplayer = player_number - this.state.teamA.length - this.state.teamB.length

        if(waitingforplayer === 0) {
            return(
                <Redirect to={`/game/${this.props.roomId}`} />
            )
        }

        console.log(this.state.isRoomFull)
        let teamA = this.state.teamA.map(name =>
            <li key={name}>
                <UserBlock userName={name} />
            </li>
        );
        let teamB = this.state.teamB.map(name =>
            <li key={name}>
                <UserBlock userName={name} />
            </li>
        );

        return (
            <div className='Wait_container'>
                <h1>Game Lobby</h1>
                <h3 id='Wait_message'>waiting for {waitingforplayer} more players to join...</h3>
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
                    {/*<NavLink style={{display: "none"}} to={`/game/${this.props.roomId}`}>
                        <button className='App_button'>
                            Start!
                        </button>
        </NavLink>*/}
                    <button className='App_button' onClick={this.handleBack}>
                        Back
                    </button>
                </div>
            </div>

        )
    }
}

export default Wait