import React, {Component} from 'react'
import './Result.css'
import {COLOR_ASSET} from '../components/ColorAssets'
import resultBarSVG from '../images/resultBar.svg'


class Result extends Component {
    constructor(props) {
        super(props)
        this.state = {
            teamAColor: COLOR_ASSET[1], //把[]裡面的數字換成teamColorA,
            teamBColor: COLOR_ASSET[2],
            teamAarea: 1234, //直接給算好的面積之類的，前端算成％數，這樣也比較方便顯示其他統計資料
            teamBarea: 1998
        }
    }

    handleOK = () => {
        this.props.history.push(`/home`);
        // this.props.history.push(`/wait/${this.props.roomId}`);
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
        var Afloat = this.state.teamAarea / (this.state.teamAarea + this.state.teamBarea)
        var Apercentage = parseInt(Afloat*1000) / 10
        //var Bpercentage = this.state.teamBarea / (this.state.teamAarea + this.state.teamBarea)
        return(
            <div className='Result-container'>
                <h1>Result</h1>
                    <div>
                        <div>
                            <h2>Team A</h2>
                            <h3>{Apercentage}%</h3>
                        </div>
                        <div>
                            <h2>Team B</h2>
                            <h3>{100-Apercentage}%</h3>
                        </div>
                        
                    </div>
                    <div>
                        <svg width="1200" height="100" x="200" y="200">
                            <rect className="inkBar"
                                x="40" y="20" width={1120 * Afloat} height="60" style={inkStyleA} />
                            
                            <rect className="inkBar"
                                x={40 + 1120*Afloat + 5} y="20" width={1120*(1-Afloat)} height="60" style={inkStyleB} />

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