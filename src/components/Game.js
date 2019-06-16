import React from 'react';
import './Game.css';
import { drawPlayer, drawField, drawSplat } from '../draw'

import { GAME_STATE, PLAYER_STATUS } from '../enum'
import {
    getKeyUpState,
    getKeyDownState,
    getMousePos,
    calculatePlayerAngle,
    updatePlayerPosition,
    getSplats,
} from '../utils'

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            gameBoardWidth: 1600,
            gameBoardHeight: 900,
            gameState: GAME_STATE.GAMING,

            //player info
            playerName: "player",
            playerColor: "#ff6666",
            playerHealth: 100,
            playerPosition: { x: 100, y: 100 },
            playerAngle: 0,
            playerStatus: PLAYER_STATUS.STANDING,
            playerMoveSpeed: 5,
            playerMoveDirection: { x: 0, y: 0 },
            playerEquipment: {
                mainWeapon: 0,
                sideWeapon: 0,
                items: [],
            },

            keyStrokeState: { left: 0, right: 0, up: 0, down: 0, space: 0, g: 0 },
            mouseMoveState: { x: 0, y: 0 },
            // refs: {
            //     groundRef: this.groundRef,
            //     splatRef: this.splatRef,
            //     fieldRef: this.fieldRef,
            //     playerRef: this.playerRef,
            //     itemRef: this.itemRef,
            // },
        }
    }

    onKeyDown = e => {
        const new_State = getKeyDownState(e, this.state);
        this.setState(new_State);
    }

    onKeyUp = e => {
        const new_State = getKeyUpState(e, this.state);
        this.setState(new_State);
    }

    trackMouse = e => {
        const c = this.playerRef;
        const mousePos = getMousePos(c, e)
        this.setState({ mouseMoveState: mousePos })
    }

    handleClick = e => {
        const splat = getSplats(this.state);
        drawSplat(this.splatRef, splat, this.state.playerColor);
    }

    updateGame = () => {
        // get cnavas

        // get player angle
        const playerAngle = calculatePlayerAngle(this.state.playerPosition.x, this.state.playerPosition.y, this.state.mouseMoveState.x, this.state.mouseMoveState.y)
        this.setState({ playerAngle: playerAngle })

        // get player position
        updatePlayerPosition(this.state.gameState, this.state.playerPosition, this.state.playerMoveDirection, this.state.playerMoveSpeed);
        
        //draw filed
        drawField(this.fieldRef);
        
        //draw player 
        drawPlayer(this.playerRef, this.state);
    }

    componentDidMount = () => {
        window.addEventListener("keyup", this.onKeyUp);
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("mousemove", this.trackMouse);
        window.addEventListener("click", this.handleClick);

        setInterval(() => {
            this.updateGame();
        }, 20);
    }

    render() {
        return (
            <div>
                <canvas id="groundLayer" width={this.state.gameBoardWidth} height={this.state.gameBoardHeight} ref={el => this.groundRef = el} />
                <canvas id="splatLayer" width={this.state.gameBoardWidth} height={this.state.gameBoardHeight} ref={el => this.splatRef = el} />
                <canvas id="fieldLayer" width={this.state.gameBoardWidth} height={this.state.gameBoardHeight} ref={el => this.fieldRef = el} />
                <canvas id="playerLayer" width={this.state.gameBoardWidth} height={this.state.gameBoardHeight} ref={el => this.playerRef = el} />
                <canvas id="itemLayer" width={this.state.gameBoardWidth} height={this.state.gameBoardHeight} ref={el => this.itemRef = el} />
            </div>
        );
    }
}

export default Game;

