import React, {Component} from 'react'
import './Result.css'
import {COLOR_ASSET} from '../components/ColorAssets'
import resultBarSVG from '../images/resultBar.svg'


class Result extends Component {
    constructor(props) {
        super(props)
        console.log(this.props.location.state)
        this.state = {
            teamAColor: COLOR_ASSET[this.props.location.state.teamColor['A']], //把[]裡面的數字換成teamColorA,
            teamBColor: COLOR_ASSET[this.props.location.state.teamColor['B']],
            teamAarea: this.props.location.state.result['A'],
            teamBarea: this.props.location.state.result['B']
        }
    }

    handleOK = () => {
        this.props.history.push(`/wait/${this.props.roomId}`);
    }

    render() {
        console.log(this.state.result)
        const inkStyleA = {
            fill: this.state.teamAColor.main,
            filter: "drop-shadow(0px 0px 5px " + this.state.teamAColor.glow + ")"
        }
        const inkStyleB = {
            fill: this.state.teamBColor.main,
            filter: "drop-shadow(0px 0px 5px " + this.state.teamBColor.glow + ")"
        }
        var Afloat = parseInt(this.state.teamAarea*100) / 100
        //Afloat = Afloat === NaN ? 0 : Afloat
        var Bfloat = parseInt(this.state.teamBarea*100) / 100
        //Bfloat = Bfloat === NaN ? 0 : Bfloat
        var Whitefloat = 1 - Afloat - Bfloat

        console.log(Afloat, Bfloat)
        //var Apercentage = parseInt(Afloat*1000) / 10
        //var Bpercentage = this.state.teamBarea / (this.state.teamAarea + this.state.teamBarea)
        return(
            <div className='Result-container'>
                <h1>Result</h1>
                    <div className='Result-number-container'>
                        <div className='Result-number' style={{color: this.state.teamAColor}}>
                            <h2>Team A</h2>
                            <h3>{Afloat}%</h3>
                        </div>
                        <div className='Result-number'  style={{color: this.state.teamBColor}}>
                            <h2>Team B</h2>
                            <h3>{Bfloat}%</h3>
                        </div>
                        
                    </div>
                    <div>
                        <svg width="1200" height="100" x="200" y="200">
                            <rect className="inkBar"
                                x="40" y="20" width={1120 * Afloat} height="60" style={inkStyleA} />
                            
                            <rect className="inkBar"
                                x={40 + 1120*Afloat + 5} y="20" width={1120*Bfloat} height="60" style={inkStyleB} />

                            <rect className="inkBar"
                                x={40 + 1120*Afloat} y="20" width="5" height="60" style={{fill: "#FFFFFF"}} />
                            
                            <image href={resultBarSVG} width="1200" height="100" />
                        </svg>
                    </div>
                    
                <div>

                </div>
                <button className='App_button' onClick={this.handleOK}>OK!</button>
            </div>
        )
    }
}


export default Result;