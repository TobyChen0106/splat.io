import React from 'react';
import './inkBar.css';
import inkBarSVG from '../images/inkBar.svg'
import ReactSVG from 'react-svg'


class InkBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inkColor: this.hexToRgb(this.props.inkColor.main),
            inkAmount: this.props.inkAmount,
            inkBarPosition: { x: window.innerWidth / 2 - 200, y: window.innerHeight - 80 },
        }
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
            fill: 'rgba(' + this.state.inkColor + ')',
            stroke: 'none',
        };
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
                <rect className="inkBar" x={this.state.inkBarPosition.x + 30 } y={this.state.inkBarPosition.y-40}
                    width={3.4 * this.props.inkAmount} height="50" style={inkBarStyle} />
                <svg width="1000" height="70" style={inkBarStyle} x={this.state.inkBarPosition.x - 300} y={this.state.inkBarPosition.y-50}>
                <image href={inkBarSVG} width="1000" height="70" style={inkBarStyle}/>
                </svg>
            </g>

        );
    }
}

export default InkBar;