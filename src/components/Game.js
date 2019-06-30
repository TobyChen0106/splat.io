import React from 'react';
import './Game.css';
import { drawPlayer, drawField, drawSplat, drawAimPoint, drawBullet, drawAllPlayers, } from '../draw'
import { COLOR_ASSET } from './ColorAssets'
import { weapons } from '../weapons'
import { Redirect } from 'react-router'
import { battleField_1 } from '../field'

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
    getGameResult,
    getPlayerHealth,
} from '../utils'

import InkBar from './inkBar';
import HP from './HP'
import fightSound from '../sounds/Fight.mp3'
import whistle from '../sounds/whistle.wav'
import { isJSXClosingFragment } from '@babel/types';


let audio = new Audio(fightSound);
audio.volume = 0.5;

let audio2 = new Audio(whistle);
audio.volume = 0.3;

class Game extends React.Component {
    constructor(props) {
        super(props);
        // data that most emit to server
        const spawnPoint_x = this.props.team === 'A' ? battleField_1.spawnPoint.teamA.x : battleField_1.spawnPoint.teamB.x;
        const spawnPoint_y = this.props.team === 'A' ? battleField_1.spawnPoint.teamA.y : battleField_1.spawnPoint.teamB.y;

        this.playerData = {
            roomId: this.props.roomId,
            teamColor: this.props.teamColor,

            playerName: this.props.name,
            playerUid: this.props.uid,
            playerTeam: this.props.team,

            playerColor: COLOR_ASSET[this.props.teamColor[this.props.team]],
            playerColorID: this.props.teamColor[this.props.team],

            playerPosition: { x: spawnPoint_x, y: spawnPoint_y },
            playerAngle: 0,
            playerStatus: PLAYER_STATUS.STANDING_SPACE,
            playerWeapon: weapons.splatterShot_v1,

            bullets: [],
            splats: [],
        };

        // data that only holded by local front end
        this.localPlayerData = {
            spawnPosition: { x: spawnPoint_x, y: spawnPoint_y },
            respawnTime: 2000,
            gameState: GAME_STATE.GAMING,
            roomId: this.props.roomId,

            playerMoveSpeed: 5,
            playerMoveDirection: { x: 0, y: 0 },
            inkAmount: 100,
            playerHealth: 100,
            keyStrokeState: { left: 0, right: 0, up: 0, down: 0, space: 0, g: 0 },
            mousePosition: { x: 0, y: 0 },
            mouseClient: { x: 0, y: 0 },
            mouseDownState: 0,

            timeStamp: Date.now(), // Date.now()
            gameTime: Date.now(), // remaining time for the game

            deadTime: 0, //record deadtime
            timeColor: "#FFFFFF",

            enemyColor: this.props.team === 'A' ? COLOR_ASSET[this.props.teamColor['B']] : COLOR_ASSET[this.props.teamColor['A']],
            result: { teamA: 0, teamB: 0 },

        }

        //data that recieved from the server
        this.otherPlayerData = [];

        this.calculateResultFlag = 0;
        this.mouseScale = 1;

        this.updateIntervalId = 0;
        this.anounceIntervalId = 0;

        this.state = {
            gameBoardWidth: 1600,
            gameBoardHeight: 900,
            cameraSize: 1000,

            playerPosition: { x: 100, y: 100 }, // to update camera position 
            inkAmount: 100, // to update inkbar 
            healthAmount: 100,
            anouncement: [],
            gameResult: { A: 0, B: 0 },
            winOrLose: "Tie",
            resultImage: null,
        }
    }

    componentWillMount = () => {
        this.props.socket.emit('enterGame', { ...this.playerData });

        this.props.socket.on('updateGame', (data) => {
            this.otherPlayerData = data.allPlayers.filter(p => p.playerUid !== this.playerData.playerUid);
        })

        this.props.socket.on('getGameTime', (data) => {
            this.localPlayerData.gameTime = data.gameTime;
        })

        this.props.socket.on('killEvent', (data) => {
            // console.log(data.killerName, data.killedName);

            var temp = this.state.anouncement;
            temp.push([data.killerName, data.killedName]);
            this.setState({ anouncement: temp });

            if (this.localPlayerData.gameState === GAME_STATE.GAMING) {
                this.anounceIntervalId = setTimeout(() => {
                    this.setState((prevState) => (
                        { anouncement: prevState.anouncement.splice(1) }
                    ))
                }, 3000);
            }
        })

        window.addEventListener("keyup", this.onKeyUp);
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("mousemove", this.trackMouse);
        window.addEventListener("mousedown", this.mouseDown);
        window.addEventListener("mouseup", this.mouseUp);

        audio.currentTime = 0;
        audio.play();
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
        if (this.localPlayerData.gameState === GAME_STATE.GAMING || this.localPlayerData.gameState === GAME_STATE.FREEZE) {
            // drawOtherPlayers(this.splatRef, this.bulletRef, this.playerRef, this.splatAnimationRef, this.otherPlayerData);

            // measure and update screen scale
            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;
            this.mouseScale = windowWidth > windowHeight ? this.state.cameraSize / windowWidth : this.state.cameraSize / windowHeight;

            // get and update mouse position
            let canvas = this.groundRef;
            let rect = canvas.getBoundingClientRect();
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
            if (this.playerData.playerStatus !== PLAYER_STATUS.DEAD) {
                getPlayerStatus(this.splatRef, this.playerData, this.localPlayerData);
            }
            // get and update player health according to 
            let killed_msg = getPlayerHealth(this.playerData, this.localPlayerData, this.otherPlayerData);
            if (killed_msg !== null) {
                // console.log(killed_msg);
                this.props.socket.emit('killEvent', killed_msg);
                this.localPlayerData.deadTime = this.localPlayerData.timeStamp;
            }

            //if dead, wait to respawn
            // console.log(this.playerData.playerStatus)
            if (this.playerData.playerStatus === PLAYER_STATUS.DEAD && this.localPlayerData.timeStamp - this.localPlayerData.deadTime >= this.localPlayerData.respawnTime) {
                // respawn 
                this.playerData.playerStatus = PLAYER_STATUS.STANDING_SPACE;
                this.playerData.playerPosition = this.localPlayerData.spawnPosition;
                this.localPlayerData.inkAmount = 100;
                this.localPlayerData.playerHealth = 100;
            }

            // update player speed 
            getPlayerSpeed(this.playerData, this.localPlayerData);

            // get player position
            const new_playerPosition = updatePlayerPosition(this.playerData, this.localPlayerData);

            if (this.localPlayerData.gameState === GAME_STATE.FREEZE) {
                let filedWidth = this.state.gameBoardWidth;
                let filedHeight = this.state.gameBoardHeight;

                this.setState({ cameraSize: filedWidth > filedHeight ? filedWidth : filedHeight });
                this.setState({ playerPosition: { x: filedWidth / 2, y: filedHeight / 2 } });
                audio.pause();
                

            } else {
                this.setState({ playerPosition: new_playerPosition });
            }

            // get splat (include draw bullet)
            let [aimPoints, inkConsumption] = getSplats(this.playerData, this.localPlayerData, this.otherPlayerData);

            //get and update ink amount  ******* and health 
            const new_inkAmountNhealth = getInkAmount(inkConsumption, this.playerData, this.localPlayerData);
            this.setState({ inkAmount: new_inkAmountNhealth[0], healthAmount: new_inkAmountNhealth[1] });

            this.otherPlayerData.push(this.playerData);
            //console.log(this.otherPlayerData);
            drawAllPlayers(this.splatRef, this.bulletRef, this.playerRef, this.splatAnimationRef, this.otherPlayerData,
                this.playerData.playerPosition.x, this.playerData.playerPosition.y, this.playerData.playerTeam);

            // draw aim point
            drawAimPoint(this.aimPointRef, this.playerData.playerPosition, this.localPlayerData.mousePosition, this.playerData.playerAngle, aimPoints);


        }
        else {
            this.setState({ cameraSize: 2000 });
        }
        // update time
        this.localPlayerData.timeStamp = Date.now();
        if (this.localPlayerData.gameTime < 10) this.localPlayerData.timeColor = "#c71585";
        if (this.localPlayerData.gameTime === 0){
            audio2.play()
        }
        if (this.localPlayerData.gameTime <= 0) {
            this.localPlayerData.gameState = GAME_STATE.FREEZE;

            if (this.localPlayerData.gameTime <= -5) {
                this.localPlayerData.gameState = GAME_STATE.FINISH;
            }
        }

        this.props.socket.emit('updateGame', { ...this.playerData });

        if (this.localPlayerData.gameState === GAME_STATE.FREEZE && this.calculateResultFlag === 0) {
            let gameResult = getGameResult(this.fieldRef, this.splatRef, this.playerData, this.localPlayerData);

            var Afloat = parseInt(gameResult.A * 1000) / 10;
            var Bfloat = parseInt(gameResult.B * 1000) / 10;

            this.setState({ gameResult: { A: Afloat, B: Bfloat } });
            this.setState({ resultImage: gameResult.resultImage });

            if (Afloat === Bfloat) {
                this.setState({ winOrLose: "Tie" });
            } else if (Afloat > Bfloat) {
                if (this.playerData.playerTeam === 'A') {
                    this.setState({ winOrLose: "You Win!!" });
                } else {
                    this.setState({ winOrLose: "You Loss..." });
                }
            } else if (Afloat < Bfloat) {
                if (this.playerData.playerTeam === 'B') {
                    this.setState({ winOrLose: "You Win!!" });
                } else {
                    this.setState({ winOrLose: "You Loss..." });
                }
            }
            this.calculateResultFlag = 1;

            // console.log(this.state.gameResult);
        }
    }

    componentDidMount = () => {
        this.updateIntervalId = setInterval(() => {
            this.updateGame();
        }, 20);
        drawField(this.fieldRef);

        window.addEventListener("keyup", this.onKeyUp);
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("mousemove", this.trackMouse);
        window.addEventListener("mousedown", this.mouseDown);
        window.addEventListener("mouseup", this.mouseUp);
    }

    render() {
        console.log(this.state.resultImage)
        let gameTime = this.localPlayerData.gameTime > 0 ? this.localPlayerData.gameTime : 0;
        let anouncement = [];
        for (let i = 0; i < this.state.anouncement.length; ++i) {
            anouncement.push(
                // needs some improvement
                <text id="anouncement" x="50" y={40 + 30 * i} width="300" height="200" key={i}>
                    {this.state.anouncement[i][0] + ' killed ' + this.state.anouncement[i][1]}
                </text>
            )
        }

        let timesUp = ''

        if (this.localPlayerData.gameState === GAME_STATE.FREEZE) {
            timesUp = (
                <div id='timesUp'>
                    <h1>Time's Up!</h1>
                </div>
            )
        }

        if (this.localPlayerData.gameState === GAME_STATE.GAMING || this.localPlayerData.gameState === GAME_STATE.FREEZE) {
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
                        <text id="timer" x="600" y="80" width="300" height="100" style={{ fill: this.localPlayerData.timeColor }}>{gameTime}</text>
                        <HP hp={this.localPlayerData.playerHealth} />
                        {anouncement}
                    </svg>
                    {timesUp}
                </div>
            )
        }
        else {
            // this.props.socket.disconnect();
            // this.props.socket.open();
            return (
                <Redirect to={{
                    pathname: `/result/${this.props.roomId}`,
                    state: {
                        result: this.state.gameResult,
                        teamColor: this.playerData.teamColor,
                        winOrLose: this.state.winOrLose,
                        // resultImage: this.state.resultImage,
                    }
                }}
                />
            );
        }
    }

    componentWillUnmount = () => {
        window.removeEventListener("keyup", this.onKeyUp);
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("mousemove", this.trackMouse);
        window.removeEventListener("mousedown", this.mouseDown);
        window.removeEventListener("mouseup", this.mouseUp);
        this.props.socket.off('updateGame');
        this.props.socket.off('getGameTime');
        this.props.socket.off('killEvent');
        clearInterval(this.updateIntervalId);
        clearInterval(this.anounceIntervalId);
    }
}

export default Game;

