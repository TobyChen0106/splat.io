import React from 'react';
import './Game.css';
import { drawPlayer, drawField } from '../draw'

import { GAME_STATE, PLAYER_STATUS } from '../enum'
import {
    getKeyUpState,
    getKeyDownState,
    getMousePos,
    calculatePlayerAngle,
    updatePlayerPosition,
} from '../utils'

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            gameBoardWidth: 1500,
            gameBoardHeight: 800,
            gameState: GAME_STATE.GAMING,

            //player info
            playerName: "player",
            playerColor: "#ff6666",
            playerPosition: { x: 100, y: 100 },
            playerAngle: 0,
            playerStatus: PLAYER_STATUS.STANDING,
            playerMoveSpeed: 10,
            playerMoveDirection: { x: 0, y: 0 },
            playerEquipment: {
                mainWeapon: 0,
                sideWeapon: 0,
                items: [],
            },

            keyStrokeState: { left: 0, right: 0, up: 0, down: 0, space: 0, g: 0 },
            mouseMoveState: { x: 0, y: 0 },
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
        const c = this.canvasRef;

        const mousePos = getMousePos(c, e)

        this.setState({ mouseMoveState: mousePos })
    }

    handleClick = e => {

    }

    updateGame = () => {
        // get cnavas
        var c = this.canvasRef;

        // get player angle
        const playerAngle = calculatePlayerAngle(this.state.playerPosition.x, this.state.playerPosition.y, this.state.mouseMoveState.x, this.state.mouseMoveState.y)
        this.setState({ playerAngle: playerAngle })

        // get player position
        updatePlayerPosition(this.state.gameState, this.state.playerPosition, this.state.playerMoveDirection, this.state.playerMoveSpeed);

        var context = c.getContext("2d");

        context.clearRect(0, 0, c.width, c.height);

        drawField(c)
        drawPlayer(c, this.state)
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
                <canvas id="gameCanvas" width={this.state.gameBoardWidth} height={this.state.gameBoardHeight} ref={el => this.canvasRef = el} />
            </div>
        );
    }
}

export default Game;

