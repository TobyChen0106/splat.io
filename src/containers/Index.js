import React, {Component} from 'react'
import {Switch, Route} from 'react-router-dom'
import {Redirect} from 'react-router'
import io from 'socket.io-client';
import Game from '../components/Game'
import Home from './Home'
import Wait from './Wait'
import Result from './Result'

let host = '140.112.244.155:8080' // server ip (andyh0913 for temporary use)

class Index extends Component {
    constructor(props) {
        super(props);
        // this.socket = io(host);
        this.socket = io('http://localhost:8080');
        this.state = {
            roomId: null,
            name: 'Player',
            uid: null,
            team: null,
            teamColor: [],
        }
    }

    changeStatus = {
        setRoomId: (roomId) => { this.setState( {roomId: roomId} ); },
        setName: (name) => { 
            if (name) this.setState( {name: name} ); 
            else this.setState( {name: 'Player'})
        },
        setUid: (uid) => { this.setState( {uid: uid} ); },
        setTeam: (team) => { this.setState( {team: team} ); },
        setTeamColor: (teamColor) => { this.setState( {teamColor: teamColor} ); }
    }

    render(){
        return (
            <Switch>
                <Route exact path='/' render={() => 
                    <Redirect to='/home' />} 
                />
                <Route path='/home' render={(props) => <Home {...props} {...this.state}
                    {...this.changeStatus}
                    socket={this.socket} />}
                />
                <Route path={`/wait/${this.state.roomId}`} render={(props) => <Wait {...props} {...this.state}
                    socket={this.socket}
                    setName={this.changeStatus.setName} />}
                />
                <Route path={`/game/${this.state.roomId}`} render={(props) => <Game {...props} {...this.state}
                    socket={this.socket} />}
                />
                <Route path='/result' render={() => <Result />} />
            </Switch>
        )
    }
}

export default Index