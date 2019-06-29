import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './Wait.css'
import UserBlock from '../components/UserBlock'
import { COLOR_ASSET } from '../components/ColorAssets'

class Wait extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teamA: [],
            teamB: [],
            isRoomFull: [],
            teamAColor: COLOR_ASSET[this.props.teamColor['A']].shadow,
            teamBColor: COLOR_ASSET[this.props.teamColor['B']].shadow,
            waitingMessage: ''
        }

        this.props.socket.emit('getRoomPlayers', {
            roomId: this.props.roomId
        });

        this.props.socket.on('getRoomPlayers', (data) => {
            let waitingForPlayer = data.maxPlayers - data.teamA.length - data.teamB.length;
            if (waitingForPlayer < 0) waitingForPlayer = 0;

            this.setState({
                teamA: data.teamA.map(p => p.name),
                teamB: data.teamB.map(p => p.name),
                isRoomFull: data.isRoomFull,
                maxPlayers: data.maxPlayers,
                waitingMessage: `waiting for ${waitingForPlayer} more players to join...`
            });
        });
        
        this.props.socket.on('getWaitTime', (data) => {
            this.setState({
                waitTime: data.waitTime,
                waitingMessage: `left ${data.waitTime} seconds to begin...`
            })
            if (data.waitTime <= 0) {
                this.props.socket.off('getWaitTime');
            }
        })

        this.props.socket.once('startGaming', () => {
            this.props.history.push(`/game/${this.props.roomId}`);
        })
    }

    handleBack = () => {
        this.props.socket.disconnect();
        this.props.socket.open()
        this.props.history.push('/home');
        this.props.setName();
        console.log(this.props)
    }

    //61,67 playerRecord 的部分，如果有登入就送他的紀錄，不然就送個''，UserBlock物件裡面得到''就會印出guest

    render() {
        let teamA = this.state.teamA.map(name =>
            <li key={name}>
                <UserBlock userName={name} playerRecord=''/*playerRecord={ isLoggin? this.props.playerRecord : ''}*/ team='A' />
            </li>
        );

        let teamB = this.state.teamB.map(name =>
            <li key={name}>
                <UserBlock userName={name} playerRecord='' team='B' />
            </li>
        );

        return (
            <div className='Wait_container'>
                <h1>Game Lobby</h1>
                <h3 id='Wait_message'>{this.state.waitingMessage}</h3>
                <div id='Wait_wrapper'>
                    <div className='Wait_group' style={{background: this.state.teamAColor}} >
                        <h3 className='Wait_grouptitle' >TEAM A</h3>
                        <ul>
                            {teamA}
                        </ul>
                    </div>
                    <div className='Wait_group' style={{background: this.state.teamBColor}}>
                        <h3>TEAM B</h3>
                        <ul>
                            {teamB}
                        </ul>
                    </div>
                </div>
                <div id='Wait_button'>
                    <button className='App_button' onClick={this.handleBack}>
                        Back
                    </button>
                </div>
            </div>

        )
    }
}

export default Wait