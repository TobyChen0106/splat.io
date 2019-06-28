import React, {Component} from 'react'
import {Switch, Route} from 'react-router-dom'
import {Redirect} from 'react-router'
import io from 'socket.io-client';
import Game from '../components/Game'
import Home from './Home'
import Wait from './Wait'

class Index extends Component {
    constructor(props) {
        super(props);
        this.socket = io('http://localhost:8080');
        this.state = {
            roomId: 'temp',
            name: 'Player',
            uid: null,
            team: null
        }
    }

    setName = (e) => {
        if (e.target.value !== '') { this.setState( {name: e.target.value} ); }
        else { this.setState( {name: 'Player'} ); }
    }
    setUid = (uid) => { this.setState( {uid: uid} ); }
    setRoomId = (id) => { this.setState( {roomId: id} ); }
    setTeam = (team) => { this.setState( {team: team} ); }

    render(){
        return (
            <Switch>
                <Route exact path='/' render={() => 
                    <Redirect to='/home' />} 
                />
                <Route path='/home' render={(props) => <Home {...props} {...this.state}
                    socket={this.socket}
                    setName={this.setName} 
                    setUid={this.setUid}
                    setRoomId={this.setRoomId}
                    setTeam={this.setTeam} />}
                />
                <Route path={`/wait/${this.state.roomId}`} render={(props) => <Wait {...props} {...this.state}
                    socket={this.socket} />}
                />
                <Route path={`/game/${this.state.roomId}`} render={(props) => <Game {...props} {...this.state}
                    socket={this.socket} />}
                />
            </Switch>
        )
    }
}

export default Index