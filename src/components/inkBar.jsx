import React from 'react';
import './inkBar.css';

class InkBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inkColor: this.props.inkColor,
            inkAmount: this.props.inkAmount,
            inkBarPosition: { x: window.innerWidth / 2 - 200, y: window.innerHeight - 80 },
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
                <rect className="inkBarBase" x={this.state.inkBarPosition.x} y={this.state.inkBarPosition.y}
                    width="400" height="50" style={inkBarBaseStyle} />

                <rect className="inkBar" x={this.state.inkBarPosition.x} y={this.state.inkBarPosition.y}
                    width={4 * this.props.inkAmount} height="50" style={inkBarStyle} />
            </g>

        );
    }
}

export default InkBar;