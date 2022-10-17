import React, {Component} from "react";

class Timer extends Component {
    constructor(props) {
        super(props);

        this.state = {count: this.props.countdown, t:""};
        
        this.counter = this.counter.bind(this);
        this.update = this.update.bind(this);            
    }

    update() {
        this.setState({count: this.state.count-1});
        
        if (this.state.count >=1) {
            this.setState({t: ""});
        }
        
        if (this.state.count < 1) {
            this.setState({t: "FERTIG"});
            this.setState({count: ""});
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    counter() {
        this.setState({count: this.props.countdown})
        if (this.interval != null) {
            clearInterval(this.interval);
        }
        this.interval = setInterval(this.update, 1000)
    }

    render(){
        return(<>
        <p>Timer: {this.props.countdown} Seconds</p>
        {this.state.count}<br/>
        {this.state.t}<br/>
        <button onClick={this.counter}>Start</button>
        </>)
    }
}
export default Timer;