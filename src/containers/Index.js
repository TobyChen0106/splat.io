import React, {Component} from 'react'
import {Switch, Route} from 'react-router-dom'
import {Redirect} from 'react-router'
import io from 'socket.io-client';
import Game from '../components/Game'
import Home from './Home'
import Wait from './Wait'
import Result from './Result'

class Index extends Component {
    constructor(props) {
        super(props);
        this.socket = io('http://localhost:8080');
        this.state = {
            roomId: null,
            name: 'Player',
            uid: null,
            team: null,
            teamColor: [],
            userName: 'Guest',
            userStatus: {}
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
        setTeamColor: (teamColor) => { this.setState( {teamColor: teamColor} ); },
        setUserName: (userName) => { this.setState( {userName: userName} ); },
        setUserStatus: (userStatus) => { this.setState( {userStatus: userStatus} ); },
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
                    socket={this.socket}
                    setRoomId={this.changeStatus.setRoomId} />}
                />
                <Route path={`/result/${this.state.roomId}`} render={(props) => <Result {...props} {...this.state}
                    socket={this.socket}
                    setName={this.changeStatus.setName} />}
                />
            </Switch>
        )
    }
}

export default Index