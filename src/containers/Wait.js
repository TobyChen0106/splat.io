import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'
import './Wait.css'

class Wait extends Component {
    render() {
        return(
            <div className='Wait_container'>
                <h1>Game Lobby</h1>
                <h3 id='Wait_message'>waiting for teammates...</h3>
                <div id='Wait_wrapper'>
                    <div className='Wait_group'>
                        <h3 className='Wait_grouptitle'>TEAM A</h3>
                        <ul>
                            <li>TobyChen</li>
                            <li>cc41516</li>
                            <li>andyh0913</li>
                            <li>iampeach</li>
                        </ul>
                    </div>
                    <div className='Wait_group'>
                        <h3>TEAM B</h3>
                        <ul>
                            <li>VivianChan1998</li>
                            <li>LilyLiu0719</li>
                            <li>perry0513</li>
                        </ul>
                    </div>
                </div>
                <div id='Wait_button'>
                    <NavLink to='/game'>
                        <button className='App_button'>
                            Start!
                        </button>
                    </NavLink>
                </div>
                
            </div>
            
        )
    }
}

export default Wait