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
            team: null
        }
    }

    setName = (e) => {
        if (e.target.value !== '') { this.setState( {name: e.target.value} ); }
        else { this.setState( {name: 'Player'} ); }
    }
    setUid = (uid) => { this.setState( {uid: uid} ); }
    setRoomId = (roomId) => { this.setState( {roomId: roomId} ); }
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
                <Route path='/result' render={() => <Result />} />
            </Switch>
        )
    }
}

export default Index