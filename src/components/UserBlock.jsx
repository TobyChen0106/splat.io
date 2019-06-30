import React from 'react'
// import green from '../images/player/green/p-01.svg'
// import orange from '../images/player/orange/p-01.svg'
import { COLOR_ASSET } from './ColorAssets'

import greenPlayer from '../images/player/green/p-01.svg'
import purplePlayer from '../images/player/purple/p-01.svg'
import bluePlayer from '../images/player/blue/p-01.svg'
import pinkPlayer from '../images/player/pink/p-01.svg'

import './UserBlock.css'

class UserBlock extends React.Component {

    render() {
        var img_src = "";
        switch (this.props.color) {
            case COLOR_ASSET[0].main:
                img_src = pinkPlayer;
                break;
            case COLOR_ASSET[1].main:
                img_src = bluePlayer
                break;
            case COLOR_ASSET[2].main:
                img_src = greenPlayer;
                break;
            case COLOR_ASSET[3].main:
                img_src = purplePlayer;
                break;
            default:
                break;
        }
        var style = {}
        if(this.props.isSelf){
            style = {filter: "drop-shadow(0px 0px 3px rgb(0,0,0,0.7))", border: "solid 2px"}
        }
        return (
            <div className='UserBlock-container' style={style}>
                <img src={img_src} alt={this.props.userName} />
                <h3>{this.props.userName}   <i id ="record">{this.props.playerRecord || 'guest'}</i> </h3>
                
                <h4>{this.props.status? 'Online!':'Waiting...' }</h4>
                
            </div>
        )
    }
}

export default UserBlock