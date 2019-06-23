import React, {Component} from 'react'
import {Switch, Route} from 'react-router-dom'
import {Redirect} from 'react-router'
import Game from '../components/Game'
import Home from './Home'
import Wait from './Wait'


class Index extends Component {
    render(){
        return (
            <Switch>
                <Route exact path='/' render={() => (
                    <Redirect to='/home'></Redirect>
                )}>
                </Route>
                <Route path='/home' component={Home} />
                <Route path='/wait' component={Wait} />
                <Route path='/game' component={Game} />
            </Switch>
        )
    }
}

export default Index