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
} from '../utils'

import InkBar from './inkBar';
import fightSound from '../sounds/Fight.mp3'

const GAME_INTERVAL = 40;

var audio = new Audio(fightSound);
audio.volume = 0.5;


class Game extends React.Component {
    constructor(props) {
        super(props);
        // data that most emit to server
        this.playerData = {
            roomId: this.props.roomId,
            teamColor: this.props.teamColor,

            playerName: this.props.name,
            playerUid: this.props.uid,
            playerTeam: this.props.team,

            playerColor: COLOR_ASSET[this.props.teamColor[this.props.team]],
            playerColorID: this.props.teamColor[this.props.team],
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

            timeStamp: Date.now(), // Date.now()
            initTime: Date.now(), // game start time
            gameRemainTime: Date.now(), // remaining time for the game
            timeColor: "#FFFFFF",

            enemyColor: this.props.team === 'A'? COLOR_ASSET[this.props.teamColor['B']] : COLOR_ASSET[this.props.teamColor['A']],
            result: { teamA: 0, teamB: 0 }
        }

        //data that recieved from the server
        this.otherPlayerData = [];

        this.calculateResultFlag = 0;
        this.mouseScale = 1;
        this.state = {
            gameBoardWidth: 1600,
            gameBoardHeight: 900,
            cameraSize: 1000,

            playerPosition: { x: 100, y: 100 }, // to update camera position 
            inkAmount: 100, // to update inkbar 
            anouncement: ['Nothing~~', 'thissss'],
            gameResult: {A:0, B:0},
        }

        this.props.socket.emit('enterGame', { ...this.playerData });

        this.props.socket.on('updateGame', (data) => {
            this.otherPlayerData = data.allPlayers.filter(p => p.playerUid !== this.playerData.playerUid);
        })

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

            if (this.localPlayerData.gameState === GAME_STATE.FREEZE) {
                var filedWidth = this.state.gameBoardWidth;
                var filedHeight = this.state.gameBoardHeight;

                this.setState({ cameraSize: filedWidth > filedHeight ? filedWidth : filedHeight });
                this.setState({ playerPosition: { x: filedWidth / 2, y: filedHeight / 2 } });
            } else {
                this.setState({ playerPosition: new_playerPosition });
            }

            // get splat (include draw bullet)
            var [aimPoints, inkConsumption] = getSplats(this.playerData, this.localPlayerData, this.otherPlayerData);

            //get and update ink amount
            const new_inkAmount = getInkAmount(inkConsumption, this.playerData, this.localPlayerData);
            this.setState({ inkAmount: new_inkAmount });

            this.otherPlayerData.push(this.playerData);
            //console.log(this.otherPlayerData);
            drawAllPlayers(this.splatRef, this.bulletRef, this.playerRef, this.splatAnimationRef, this.otherPlayerData);

            /*  
                    // draw splat
                    drawSplat(this.splatRef, this.splatAnimationRef, this.playerData.splats, this.playerData.playerColor, this.playerData.playerAngle, this.playerData.playerPosition);
            
                    // draw bullet 
                    drawBullet(this.bulletRef, this.playerData.bullets, this.playerData.playerColor);
            
                    //draw player
                    drawPlayer(this.playerRef, this.splatAnimationRef, this.playerData);
            */
            // draw aim point
            drawAimPoint(this.aimPointRef, this.playerData.playerPosition, this.localPlayerData.mousePosition, this.playerData.playerAngle, aimPoints);

            var temp = this.state.anouncement
            if(Math.floor(Math.random() * 20) === 0/* 這邊的random只是為了方便測試，要改成if收到新訊息*/) {
                
                temp.push('new')
                this.setState({ anouncement: temp })
            
                setTimeout(() => {
                    this.setState((prevState) => (
                        {anouncement: prevState.anouncement.splice(1)}
                    ))
                }, 1000)
            }
            

        }
        else {
            this.setState({ cameraSize: 2000 });
        }
        // update time
        var t = GAME_INTERVAL - parseInt((Date.now() - this.localPlayerData.initTime) / 1000);
        this.localPlayerData.timeStamp = Date.now();
        this.localPlayerData.gameRemainTime = t;
        if (t < 10) this.localPlayerData.timeColor = "#c71585";
        if (t <= -1) {
            this.localPlayerData.gameState = GAME_STATE.FREEZE;
            // console.log("GAME FREEZE!!");

            if (t <= -5) {
                this.localPlayerData.gameState = GAME_STATE.FINISH;
                // console.log("GAME FINISH!!");
            }
        }

        this.props.socket.emit('updateGame', { ...this.playerData });
        // console.log(t);

        //calculate result
        
        if (this.localPlayerData.gameState === GAME_STATE.FREEZE && this.calculateResultFlag === 0) {
            var gameResult = getGameResult( this.fieldRef, this.splatRef, this.playerData, this.localPlayerData);
            this.setState({gameResult: gameResult});
            this.calculateResultFlag = 1;
        }

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
        audio.currentTime = 0;
        audio.play();
    }

    render() {
        // console.log(this.otherPlayerData)
        //turn the this.state.anouncement to <text />...
        var anouncement = [];
        for(var i=0; i<this.state.anouncement.length; ++i) {
            anouncement.push(
                <text id="anouncement" x="50" y={40+30*i} width="300" height="200" >{this.state.anouncement[i]}</text>
            )
        }
        
        var timesUp = ''
        
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
                    {timesUp}
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
                        <text id="timer" x="600" y="80" width="300" height="100" style={{ fill: this.localPlayerData.timeColor }}>{this.localPlayerData.gameRemainTime}</text>
                        { anouncement }
                    </svg>
                </div>
            )
        }
        else {
            audio.pause();
            return (<Redirect to='/result' />);
        }
    }
}

export default Game;

