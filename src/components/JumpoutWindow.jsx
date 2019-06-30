import React, {Component} from 'react'
import './JumpOutWindow.css'


function myForm(e){
    return(
        <div className='Jump-component' key={e}>
            <h3>{e}</h3>
            <input></input>
        </div>
    )
}



class JumpOutWindow extends Component {

    constructor(props) {
        super(props)
        this.state = {
            show: this.props.display,
            list: this.props.list,
            form: this.props.form,
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.display !== prevProps.display) {
          this.setState({show: this.props.display})
        }
    }

    closeJumpOut = () => {
        console.log(this.state.show)
        this.setState({show: {display: "none"}})
    }

    handleInputChange(event, el){
        var formTemp = this.state.form
        formTemp[el] = event.target.value
        this.setState({form: formTemp})
    }

    handleSubmit(id) {
        console.log(id)
        this.props.socket.emit(id, {
            form: this.state.form
        })

        this.props.socket.once('recieved' + id, (data) => {
            console.log("recieved ",data)
            if(data.message === 'OK') 
                this.closeJumpOut()
        })
    }

    render() {
        //console.log(this.state.form)
        return(
            <div style={this.state.show} className='Jump-bg'>
                <div className="Jump-container">
                    <button onClick={this.closeJumpOut} className='Jump-closeButton'>
                        X
                    </button>
                    <h2>{this.props.title}</h2>
                    {this.props.list.map( el => 
                        <div className='Jump-component' key={el}>
                            <h3>{el}</h3>
                            <input onChange={(e) => this.handleInputChange(e, el)}></input>
                        </div>
                    )}
                    <button className='App_button' 
                            onClick={() => this.handleSubmit(this.props.id)}>
                        {this.props.submit}
                    </button>
                </div>
            </div>
            
        )
    }
}

export default JumpOutWindow