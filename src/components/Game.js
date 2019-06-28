import React from 'react';
import './Game.css';
import { drawPlayer, drawField, drawSplat, drawAimPoint, drawBullet, } from '../draw'
import { COLOR_ASSET } from './ColorAssets'
import { weapons } from '../weapons'

import { GAME_STATE, PLAYER_STATUS } from '../enum'
import {
    getKeyUpState,
    getKeyDownState,
    getMousePos,
    calculatePlayerAngle,
    updatePlayerPosition,
    getSplats,
    getPlayerStatus,
    getPlayerSpeed,
    getInkAmount,
} from '../utils'

import InkBar from './inkBar';

class Game extends React.Component {
    constructor(props) {

        super(props);
        // data that most emit to server
        this.playerData = {
            playerName: this.props.name,
            playerUid: this.props.uid,
            playerTeam: this.props.team,

            playerColor: COLOR_ASSET[0],
            playerHealth: 100,
            playerPosition: { x: 100, y: 100 },
            playerAngle: 0,
            playerStatus: PLAYER_STATUS.STANDING_SPACE,
            playerWeapon: weapons.splatterShot_v1,

            bullets: [],
            splats: [],
        };

        // data that only holded by local front end
        this.localPlayerData = {
            gameState: GAME_STATE.GAMING,
            roomId: this.props.roomId,

            playerMoveSpeed: 5,
            playerMoveDirection: { x: 0, y: 0 },
            inkAmount: 100,
            keyStrokeState: { left: 0, right: 0, up: 0, down: 0, space: 0, g: 0 },
            mousePosition: { x: 0, y: 0 },
            mouseClient: { x: 0, y: 0 },
            mouseDownState: 0,
            timeStamp: Date.now(),
        }

        //data that recieved from the server
        this.otherPlayerData = [];

        this.mouseScale = 1;
        this.state = {
            gameBoardWidth: 1600,
            gameBoardHeight: 900,
            cameraSize: 1000,

            playerPosition: { x: 100, y: 100 }, // to update camera position 
            inkAmount: 100, // to update inkbar 
        }

        this.props.socket.emit('enterGame', {
            ...this.playerData,
        });

        this.props.socket.on('updateGame', (data) => {
            this.otherPlayerData = data;
        })

        setInterval(() => {
            this.props.socket.emit('updateGame', { ...this.playerData });
        }, 100);
    }

    onKeyDown = e => {
        getKeyDownState(e, this.localPlayerData);
    }

    onKeyUp = e => {
        getKeyUpState(e, this.localPlayerData);
    }

    trackMouse = e => {
        getMousePos(e, this.localPlayerData);
    }

    mouseDown = e => {
        this.localPlayerData.mouseDownState = 1;
    }
    mouseUp = e => {
        this.localPlayerData.mouseDownState = 0;
    }

    updateGame = () => {
        // measure and update screen scale
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        this.mouseScale = windowWidth > windowHeight ? this.state.cameraSize / windowWidth : this.state.cameraSize / windowHeight;

        // get and update mouse position
        var canvas = this.groundRef;
        var rect = canvas.getBoundingClientRect();
        this.localPlayerData.mousePosition = {
            x: (this.localPlayerData.mouseClient.x - rect.left) * this.mouseScale,
            y: (this.localPlayerData.mouseClient.y - rect.top) * this.mouseScale
        };

        // get and update player angle
        this.playerData.playerAngle = calculatePlayerAngle(
            this.playerData.playerPosition.x, this.playerData.playerPosition.y,
            this.localPlayerData.mousePosition.x, this.localPlayerData.mousePosition.y
        );

        // get and update new player status according field property
        getPlayerStatus(this.splatRef, this.playerData, this.localPlayerData);

        // update player speed 
        getPlayerSpeed(this.playerData, this.localPlayerData);

        // get player position
        const new_playerPosition = updatePlayerPosition(this.playerData, this.localPlayerData);
        this.setState({ playerPosition: new_playerPosition });

        // get splat (include draw bullet)
        var [aimPoints, inkConsumption] = getSplats(this.playerData, this.localPlayerData);

        //get and update ink amount
        const new_inkAmount = getInkAmount(inkConsumption, this.playerData, this.localPlayerData);
        this.setState({ inkAmount: new_inkAmount });

        // draw splat
        drawSplat(this.splatRef, this.splatAnimationRef, this.playerData.splats, this.playerData.playerColor, this.playerData.playerAngle, this.playerData.playerPosition);

        // draw bullet 
        drawBullet(this.bulletRef, this.playerData.bullets, this.playerData.playerColor);

        //draw player
        drawPlayer(this.playerRef, this.splatAnimationRef, this.playerData);

        // draw aim point
        drawAimPoint(this.aimPointRef, this.playerData.playerPosition, this.localPlayerData.mousePosition, this.playerData.playerAngle, aimPoints);

        // update time
        this.localPlayerData.timeStamp = Date.now();
    }

    componentDidMount = () => {
        window.addEventListener("keyup", this.onKeyUp);
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("mousemove", this.trackMouse);
        window.addEventListener("mousedown", this.mouseDown);
        window.addEventListener("mouseup", this.mouseUp);

        setInterval(() => {
            this.updateGame();
        }, 20);
        drawField(this.fieldRef);
    }

    render() {
        return (
            <div id="game-container">
                <svg id="svg-container"
                    width={Math.max(window.innerWidth, window.innerHeight)}
                    height={Math.max(window.innerWidth, window.innerHeight)}
                    preserveAspectRatio="xMidYMid slice"
                    viewBox={
                        [this.state.cameraSize / -2 + this.state.playerPosition.x,
                        this.state.cameraSize / -4 + this.state.playerPosition.y,
                        this.state.cameraSize,
                        this.state.cameraSize]}>
                    <foreignObject x="0" y="0" width="10000" height="10000">
                        <canvas id="groundLayer" width={this.state.gameBoardWidth} height={this.state.gameBoardHeight} ref={el => this.groundRef = el} />
                        <canvas id="splatLayer" width={this.state.gameBoardWidth} height={this.state.gameBoardHeight} ref={el => this.splatRef = el} />
                        <canvas id="splatAnimationLayer" width={this.state.gameBoardWidth} height={this.state.gameBoardHeight} ref={el => this.splatAnimationRef = el} />
                        <canvas id="fieldLayer" width={this.state.gameBoardWidth} height={this.state.gameBoardHeight} ref={el => this.fieldRef = el} />
                        <canvas id="playerLayer" width={this.state.gameBoardWidth} height={this.state.gameBoardHeight} ref={el => this.playerRef = el} />
                        <canvas id="itemLayer" width={this.state.gameBoardWidth} height={this.state.gameBoardHeight} ref={el => this.itemRef = el} />
                        <canvas id="bulletLayer" width={this.state.gameBoardWidth} height={this.state.gameBoardHeight} ref={el => this.bulletRef = el} />
                        <canvas id="aimPointLayer" width={this.state.gameBoardWidth} height={this.state.gameBoardHeight} ref={el => this.aimPointRef = el} />
                    </foreignObject>
                </svg>
                <svg id="info-container"
                    x="0" y="0"
                    width={window.innerWidth}
                    height={window.innerHeight} >
                    <InkBar inkColor={this.playerData.playerColor} inkAmount={this.localPlayerData.inkAmount} />
                </svg>
            </div>
        );
    }
}

export default Game;

