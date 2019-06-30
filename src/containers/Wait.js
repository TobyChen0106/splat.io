import React, { Component } from 'react'
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
            teamAColor: COLOR_ASSET[this.props.teamColor['A']],
            teamBColor: COLOR_ASSET[this.props.teamColor['B']],
            waitingMessage: '',
        }
    }

    componentWillMount = () => {
        this.props.socket.emit('getRoomPlayers', {
            roomId: this.props.roomId,
            uid: this.props.uid
        });

        this.props.socket.on('getRoomPlayers', (data) => {
            let waitingForPlayer = data.maxPlayers - data.teamA.length - data.teamB.length;
            if (waitingForPlayer < 0) waitingForPlayer = 0;

            this.setState({
                teamA: data.teamA, //.map(p => p.name),
                teamB: data.teamB, //.map(p => p.name),
                isRoomFull: data.isRoomFull,
                maxPlayers: data.maxPlayers,
                waitingMessage: `waiting for ${waitingForPlayer} more players to join...`
            });
            if(waitingForPlayer === 0){
                this.setState({waitingMessage: "Waiting... press back and re-enter if you don't wanna wait"})
            }
        });
        
        this.props.socket.on('getWaitTime', (data) => {
            this.setState({
                waitTime: data.waitTime,
                waitingMessage: `${data.waitTime} seconds before starts...`
            })
            if (data.waitTime <= 0) {
                this.props.socket.off('getWaitTime');
            }
        })

        this.props.socket.on('startGaming', () => {
            this.props.history.push(`/game/${this.props.roomId}`);
        })
    }

    handleBack = () => {
        this.props.socket.disconnect();
        this.props.socket.open()
        this.props.history.push('/home');
        this.props.setName();
    }

    //61,67 playerRecord 的部分，如果有登入就送他的紀錄，不然就送個''，UserBlock物件裡面得到''就會印出guest

    render() {
        console.log(this.state)
        let teamA = this.state.teamA.map(e =>
            <li key={e.name}>
                <UserBlock userName={e.name} playerRecord=''/*playerRecord={ isLoggin? this.props.playerRecord : ''}*/ 
                status={e.inWaitingRoom} team='A' color = {this.state.teamAColor.main}/>
            </li>
        );

        let teamB = this.state.teamB.map(e =>
            <li key={e.name}>
                <UserBlock userName={e.name}  playerRecord=''
                 status={e.inWaitingRoom}  team='B'  color = {this.state.teamBColor.main}/>
            </li>
        );

        console.log(this.state.teamA)

        return (
            <div className='Wait_container'>
                <h1>Game Lobby</h1>
                <h3 id='Wait_message'>{this.state.waitingMessage}</h3>
                <div id='Wait_wrapper'>
                    <div className='Wait_group' style={{background: this.state.teamAColor.shadow}} >
                        <h3 className='Wait_grouptitle' >TEAM A</h3>
                        <ul>
                            {teamA}
                        </ul>
                    </div>
                    <div className='Wait_group' style={{background: this.state.teamBColor.shadow}}>
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

    componentWillUnmount = () => {
        this.props.socket.off('getRoomPlayers');
        this.props.socket.off('getWaitTime');
        this.props.socket.off('startGaming');
    }
}

export default Wait