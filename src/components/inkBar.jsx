import React from 'react';
import './inkBar.css';
import inkBarSVG from '../images/inkBar.svg'
import ReactSVG from 'react-svg'
import { COLOR_ASSET } from './ColorAssets'


class InkBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inkColor: this.props.inkColor,
            inkAmount: this.props.inkAmount,
            inkBarPosition: { x: window.innerWidth-80, y: window.innerHeight - 400 },
        }

        console.log(this.state.inkColor)
    }
    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }
    render() {
        const inkBarStyle = {
            //fill: this.state.inkColor.main,
            stroke: 'none',
        };
        const inkBarGlow = {
            fill: this.state.inkColor.main,
            filter: "drop-shadow(0px 0px 5px " + this.state.inkColor.glow + ")"
        }
        const inkBarBaseStyle = {
            fill: 'rgba(50,50,50,0.3)',
            'stroke-width': 5,
            stroke: '#888888',
        };
        return (
            <g>
                {/* <text className="inkBarNum" x={this.state.inkBarPosition.x} y={this.state.inkBarPosition.y}>
                    {this.props.inkAmount}
                </text> */}
                {/*<rect className="inkBarBase" x={this.state.inkBarPosition.x} y={this.state.inkBarPosition.y}
                    width="400" height="50" style={inkBarBaseStyle} />
                */}
                <rect className="inkBar" x={this.state.inkBarPosition.x } y={this.state.inkBarPosition.y + 3.4*(100-this.props.inkAmount)}
                    width="50" height={3.4 * this.props.inkAmount} style={inkBarGlow} />
                <svg width="1000" height="1000" style={inkBarStyle} x={this.state.inkBarPosition.x - 10} y={this.state.inkBarPosition.y-330}>
                <image href={inkBarSVG} width="70" height="1000" style={inkBarStyle}/>
                </svg>
            </g>

        );
    }
}

export default InkBar;