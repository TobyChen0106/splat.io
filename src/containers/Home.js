import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'
import temp from '../images/temp.gif'
import logo from '../images/logo.png'
import JumpOutWindow from '../components/JumpoutWindow'
import './Home.css'

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            login_display : {display: "none"},
            signup_display: {display: "none"}
        }
    }
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

    handleDisplay(id) {
        if(id === 'login'){
            this.setState({login_display: {display: "block"}})
            //console.log("login")
        }
        else if(id === 'signup') {
            this.setState({signup_display: {display: "block"}})
            //console.log('signup')
        } 
    }

    render() {
        return(
            <div className='Home_container'>
                <button className='App_button' onClick={() => this.handleDisplay('login')}>
                    Log in
                </button>
                <button className='App_button' onClick={() => this.handleDisplay('signup')}>
                    Sign up
                </button>
                <JumpOutWindow display={this.state.login_display} title="Log in" form={["id", "pw"]} submit="Log in!" />
                <JumpOutWindow display={this.state.signup_display} title='Sign up' form={["email","id", "pw", "pw again"]} submit="Sign up!" />
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