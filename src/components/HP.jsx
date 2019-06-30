import React, {Component} from 'react'


class HP extends Component {

    constructor(props) {
        super(props)
        this.state = {
            HPPosition: { x: window.innerWidth-140, y: window.innerHeight - 260 },
        }
    }
    render(){
        var Hpcolor = this.props.hp < 30? "#CC0033": "#FFFFFF"
        var hp = parseInt(this.props.hp)
        return(
            <g>
                <text x={this.state.HPPosition.x-10} y={this.state.HPPosition.y-30} width="45"
                    style={{fill: Hpcolor, fontSize: "30px"}}>
                    {hp}
                </text>
                <text x={this.state.HPPosition.x} y={this.state.HPPosition.y-10} width="30">
                    /100
                </text>
                <rect x={this.state.HPPosition.x} y={this.state.HPPosition.y + 2 * (100 - hp)}
                    width="30" height={2 * hp + 5} style={{fill: Hpcolor}} />
            </g>
        )
    }
}

export default HP