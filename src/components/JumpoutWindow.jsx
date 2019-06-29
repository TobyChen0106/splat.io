import React, {Component} from 'react'
import './JumpOutWindow.css'


function myForm(e){
    return(
        <div className='Jump-component'>
            <h3>{e}</h3>
            <input></input>
        </div>
    )
}



class JumpOutWindow extends Component {

    constructor(props) {
        super(props)
        this.state = {
            show: this.props.display
        }
        console.log("constr", this.state.show)
    }
/*
    componentWillMount() {
        console.log("mount", this.state.show)
        this.setState({show: this.props.display})
    }
*/
    componentDidUpdate(prevProps) {
        //console.log(this.props, prevProps)
        if (this.props.display !== prevProps.display) {
          //this.fetchData(this.props.userID);
          this.setState({show: this.props.display})
        }
    }

    closeJumpOut = () => {
        console.log(this.state.show)
        this.setState({show: {display: "none"}})
    }

    render() {
        return(
            <div style={this.state.show} className='Jump-bg'>
                <div className="Jump-container">
                    <button onClick={this.closeJumpOut} className='Jump-closeButton'>
                        X
                    </button>
                    <h2>{this.props.title}</h2>
                    {this.props.form.map( e => {
                        //console.log(e)
                        return myForm(e) 
                    })}
                    <button className='App_button'>{this.props.submit}</button>
                </div>
            </div>
            
        )
    }
}

export default JumpOutWindow