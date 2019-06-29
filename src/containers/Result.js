import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'
import './Result.css'


class Result extends Component {
    render() {
        console.log('result')
        return(
            <div className='Result-container'>
                <h1>Result</h1>
                {/*<h1>Splat.io</h1>*/}
                <div>

                </div>
                <NavLink to='/home'>
                    <button className='App_button'>OK!</button>
                </NavLink>
            </div>
        )
    }
}

export default Result;