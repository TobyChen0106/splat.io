import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'
import temp from '../images/temp.gif'
import logo from '../images/logo.png'
import './Home.css'

class Home extends Component {
    render() {
        return(
            <div className='Home_container'>
                <div className='Home_main'>
                    <img src={logo}></img>
                    <input></input>
                    <NavLink to='/wait' style={{"text-decoration": "none"}}>
                        <button className='App_button'>
                            Play!
                        </button>
                    </NavLink>

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