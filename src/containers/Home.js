import React, {Component} from 'react'
import temp from '../images/temp.gif'
import logo from '../images/logo.png'
import JumpOutWindow from '../components/JumpoutWindow'
import './Home.css'

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            login_display : {display: "none"},
            signup_display: {display: "none"},
            isLoggediI: false,
            userName: 'Player',
            userStatus: 'Guest'
        }
    }

    componentWillMount() {
        this.props.socket.on('recievedlogin', (data) => {
            if (data.message === 'OK'){
                this.setState({
                    isLoggedIn: true,
                    userName: data.userName,
                    userStatus: data.userStatus
                })
            }
            else {
                console.log(data.message);
            }
        })

        this.props.socket.on('recievedsignup', (data) => {
            if (data.message === 'OK'){
                this.setState({
                    isLoggedIn: true,
                    userName: data.userName,
                    userStatus: data.userStatus
                })
            }
            else {
                console.log(data.message);
            }
            
        })
    }

    handleInputName = (e) => {
        if (e.target.value !== '') { this.props.setName(e.target.value); }
        if (e.key === 'Enter') { this.handlePlay() }
    }

    handlePlay = () => {
        this.props.socket.emit('newPlayer', {
            name: this.props.name
        })
        this.props.socket.once('getFirstInInfo', (data) => {
            this.props.setRoomId(data.roomId);
            this.props.setUid(data.uid);
            this.props.setTeam(data.team);
            this.props.setTeamColor(data.teamColor);
            this.props.history.push(`/wait/${this.props.roomId}`);
        })
    }

    handleDisplay(id) {
        if(id === 'login'){
            this.setState({login_display: {display: "block"}})
        }
        else if(id === 'signup') {
            this.setState({signup_display: {display: "block"}})
        } 
    }

    render() {
        return(
            <div className='Home_container'>
                
                <button className='App_button top-button' onClick={() => this.handleDisplay('signup')}>
                    Sign up
                </button>
                <button className='App_button top-button' onClick={() => this.handleDisplay('login')}>
                    Log in
                </button>
                <h3  id='hiMessage'>Hi, {this.state.userName}</h3>
                
                <JumpOutWindow 
                    display={this.state.login_display} 
                    title="Log in" form={{email: '', password: ''}} list={["email", "password"]}
                    submit="Log in!" id="login"
                    socket={this.props.socket}
                    />
                <JumpOutWindow 
                    display={this.state.signup_display}
                    title='Sign up' form={{name: '', email:'', password: ''}} list={["name", "email", "password"]}
                    submit="Sign up!" id='signup'
                    socket={this.props.socket}
                    />
                <div className='Home_main'>
                    <img src={logo}></img>
                    <input 
                        id="Name"
                        autoComplete="off"
                        spellCheck="false"
                        onKeyUp={this.handleInputName}
                    />
                    <button className='App_button' onClick={this.handlePlay}>
                        Play!
                    </button>
                </div>
                <div className='Home_mask'></div>
                <div id='bg_wrapper'>
                    <img src={temp} id='bg_img'></img>
                </div>
            </div>
        )
    }

    componentWillUnmount = () => {
        this.props.socket.off('recievedlogin');
        this.props.socket.off('recievedsignup');
    }
}

export default Home