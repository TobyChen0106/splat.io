import React, { Component } from 'react'
import './Result.css'
import { COLOR_ASSET } from '../components/ColorAssets'
import resultBarSVG from '../images/resultBar.svg'
import Win from '../images/win.png'
import Lose from '../images/loss.png'


class Result extends Component {
    constructor(props) {
        super(props)
        this.state = {
            teamAColor: COLOR_ASSET[this.props.location.state.teamColor['A']], //把[]裡面的數字換成teamColorA,
            teamBColor: COLOR_ASSET[this.props.location.state.teamColor['B']],
            teamAarea: this.props.location.state.result['A'],
            teamBarea: this.props.location.state.result['B'],
            winOrLose: this.props.location.state.winOrLose,
            resultImage: (this.props.location.state.winOrLose === "You Loss...")? Lose:Win,
        }
    }

    componentWillMount = () => {
        this.props.socket.emit('enterResult', {
            roomId: this.props.roomId,
            uid: this.props.uid
        })
        this.props.socket.once('kickOut', () => {
            this.props.socket.disconnect();
            this.props.socket.open();
            this.props.history.push('/home');
            this.props.setName();
            console.log("You've been kicked out because of your long waiting time. Press 'play' again to join a new game.")
        })
    }

    componentWillUnmount = () => {
        this.props.socket.off('kickOut');
    }

    handleOK = () => {
        this.props.socket.emit('backToWaitRoom', {
            roomId: this.props.roomId,
            uid: this.props.uid
        })
        this.props.history.push(`/wait/${this.props.roomId}`);
    }

    render() {
        const inkStyleA = {
            fill: this.state.teamAColor.main,
            filter: "drop-shadow(0px 0px 5px " + this.state.teamAColor.glow + ")"
        }
        const inkStyleB = {
            fill: this.state.teamBColor.main,
            filter: "drop-shadow(0px 0px 5px " + this.state.teamBColor.glow + ")"
        }
        var Afloat = this.state.teamAarea;
        var Bfloat = this.state.teamBarea;

        return (
            <div className='Result-container'>
                <h1>{this.state.winOrLose}</h1>
                <div className='Result-number-container'>
                    <div className='Result-number' style={{ color: this.state.teamAColor }}>
                        <h2>Team A</h2>
                        <h3>{Afloat}%</h3>
                    </div>
                    <div className='Result-number' style={{ color: this.state.teamBColor }}>
                        <h2>Team B</h2>
                        <h3>{Bfloat}%</h3>
                    </div>

                </div>
                <div>
                    <svg width="1200" height="100" x="200" y="200">
                        <rect className="inkBar"
                            x="40" y="20" width={1120 * Afloat / (Afloat + Bfloat + 0.0001)} height="60" style={inkStyleA} />

                        <rect className="inkBar"
                            x={40 + 1120 * Afloat / (Afloat + Bfloat + 0.0001)} y="20" width={1120 * Bfloat / (Afloat + Bfloat + 0.0001)} height="60" style={inkStyleB} />

                        <rect className="inkBar"
                            x={40 + 1120 * Afloat / (Afloat + Bfloat + 0.0001)} y="20" width="5" height="60" style={{ fill: "#FFFFFF" }} />

                        <image href={resultBarSVG} width="1200" height="100" />
                    </svg>
                </div>

                <div className = 'result-image'>
                    <img src={this.state.resultImage} />
                </div>
                <button className='App_button' onClick={this.handleOK}>OK!</button>
            </div>
        )
    }
}


export default Result;