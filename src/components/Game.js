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
        var mouseScale = 1;
        this.state = {
            gameBoardWidth: 1600,
            gameBoardHeight: 900,
            cameraSize: 1000,

            gameState: GAME_STATE.GAMING,
            roomId: this.props.roomId,

            //player info
            playerName: this.props.name,
            playerUid: this.props.uid,
            playerTeam: this.props.team,
            playerColor: [255, 102, 102, 1],
            playerHealth: 100,
            playerPosition: { x: 100, y: 100 },
            playerAngle: 0,
            playerStatus: PLAYER_STATUS.STANDING_SPACE,
            playerMoveSpeed: 5,
            playerMoveDirection: { x: 0, y: 0 },
            playerEquipment: {
                items: [],
            },
            playerWeapon: weapons.splatterShot_v1,
            inkAmount: 100,

            keyStrokeState: { left: 0, right: 0, up: 0, down: 0, space: 0, g: 0 },
            mousePosition: { x: 0, y: 0 },
            mouseClient: { x: 0, y: 0 },
            mouseDownState: 0,

            allPlayers: [],

            timeStamp: Date.now(),
        }
        
        this.props.socket.emit('enterGame', {
            ...this.state,
        });
        
        this.props.socket.on('updateGame', (data) => {
            this.setState({
                allPlayers: data
            });
        })
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
        var mouseClient = getMousePos(e);
        this.setState({ mouseClient: mouseClient })
    }

    mouseDown = e => {
        this.setState({ mouseDownState: 1 });
    }
    mouseUp = e => {
        this.setState({ mouseDownState: 0 });
    }

    updateGame = () => {
        // measure screen scale
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        this.mouseScale = windowWidth > windowHeight ? this.state.cameraSize / windowWidth : this.state.cameraSize / windowHeight;

        // get and set mouse position
        var canvas = this.groundRef;
        var rect = canvas.getBoundingClientRect();
        this.setState({ mousePosition: { x: (this.state.mouseClient.x - rect.left) * this.mouseScale, y: (this.state.mouseClient.y - rect.top) * this.mouseScale } });

        // get and set player angle
        const playerAngle = calculatePlayerAngle(this.state.playerPosition.x, this.state.playerPosition.y, this.state.mousePosition.x, this.state.mousePosition.y)
        this.setState({ playerAngle: playerAngle })

        // get & update new player status according field property
        var new_player_status = getPlayerStatus(this.splatRef, this.state);
        this.setState({ playerStatus: new_player_status });

        // update player speed 
        var new_playerMoveSpeed = getPlayerSpeed(new_player_status, this.state);
        this.setState({ playerMoveSpeed: new_playerMoveSpeed });

        // get player position
        const new_playerPosition = updatePlayerPosition(this.state.gameState, this.state.playerPosition, this.state.playerMoveDirection, this.state.playerMoveSpeed);
        this.setState({ new_playerPosition });

        //draw filed
        drawField(this.fieldRef);

        // get splat (include draw bullet)
        var [bullets, splats, aimPoints, inkConsumption] = getSplats(this.state);


        //get and update ink amount
        var new_inkAmount = getInkAmount(inkConsumption, this.state);
        this.setState({ inkAmount: new_inkAmount });

        // draw splat
        drawSplat(this.splatRef, this.splatAnimationRef, splats, this.state.playerColor, this.state.playerAngle, this.state.playerPosition);

        // draw bullet 
        drawBullet(this.bulletRef, bullets, this.state.playerColor);

        //draw player 
        drawPlayer(this.playerRef, this.state);

        // draw aim point
        drawAimPoint(this.aimPointRef, this.state.playerPosition, this.state.mousePosition, this.state.playerAngle, aimPoints);

        // update time
        var new_time = Date.now();
        // console.log(1/(new_time-this.state.timeStamp)*1000);
        this.setState({ timeStamp: new_time });

        this.props.socket.emit('updateGame', {...this.state});
    }

    componentDidMount = () => {
        window.addEventListener("keyup", this.onKeyUp);
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("mousemove", this.trackMouse);
        window.addEventListener("mousedown", this.mouseDown);
        window.addEventListener("mouseup", this.mouseUp);

        setInterval(() => {
            this.updateGame();
        }, 25);
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
                    <InkBar inkColor={this.state.playerColor} inkAmount={this.state.inkAmount} />
                </svg>
            </div>
        );
    }
}

export default Game;

