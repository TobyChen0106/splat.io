import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'
import temp from '../images/temp.gif'
import logo from '../images/logo.png'
import './Home.css'

class Home extends Component {
    handlePlay = () => {
        this.props.socket.emit('newPlayer', {
            name: this.props.name
        })
        this.props.socket.on('getPlayerBasicInfo', (data) => {
            this.props.setRoomId(data.roomId);
            this.props.setUid(data.uid);
            this.props.setTeam(data.team);
            this.props.history.push(`/wait/${this.props.roomId}`);
        })
    }

    render() {
        return(
            <div className='Home_container'>
                <div className='Home_main'>
                    <img src={logo}></img>
                    <input 
                        id="Name"
                        autoComplete="off"
                        spellCheck="false"
                        onKeyUp={this.props.setName}
                    />
                    {/* <NavLink to={`/wait/${this.props.roomId}`} style={{"text-decoration": "none"}}> */}
                        <button className='App_button' onClick={this.handlePlay}>
                            Play!
                        </button>
                    {/* </NavLink> */}
                </div>
                <div className='Home_mask'></div>
                <div id='bg_wrapper'>
                    <img src={temp} id='bg_img'></img>
                </div>
            </div>
        )
    }
}

export default Home