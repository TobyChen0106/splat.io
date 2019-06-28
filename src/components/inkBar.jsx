import React from 'react';
import './inkBar.css';
import inkBarSVG from '../images/inkBar.svg'
import ReactSVG from 'react-svg'

class InkBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inkColor: this.props.inkColor,
            inkAmount: this.props.inkAmount ,
            inkBarPosition: { x: window.innerWidth-80, y: window.innerHeight - 400 },
        }
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
                <rect className="inkBar" x={this.state.inkBarPosition.x } y={this.state.inkBarPosition.y + 3.4*(100-this.props.inkAmount)}
                    width="50" height={3.4 * this.props.inkAmount} style={inkBarStyle} />
                <svg width="1000" height="1000" style={inkBarStyle} x={this.state.inkBarPosition.x - 10} y={this.state.inkBarPosition.y-330}>
                <image href={inkBarSVG} width="70" height="1000" style={inkBarStyle}/>
                </svg>
            </g>

        );
    }
}

export default InkBar;