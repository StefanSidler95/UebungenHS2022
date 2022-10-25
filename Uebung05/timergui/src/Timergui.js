import React, {Component} from "react";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

class Timergui extends Component {
    constructor(props) {
        super(props);

        this.state = {count: this.props.count, t:"", render: true};
        
           this.counter = this.counter.bind(this);
        this.update = this.update.bind(this); 
        this.buttonClicked = this.buttonClicked.bind(this);
        this.updateValue = this.updateValue.bind(this);        
    }

    buttonClicked(event){
        this.setState({render: false});
        this.setState({count: this.state.count, t:""});
        this.interval = setInterval(this.update, 1000)
    }

    update() {
        this.setState({count: this.state.count-1});
        
        if (this.state.count >=1) {
            this.setState({t: ""});
        }
        
        if (this.state.count < 1) {
            this.setState({t: "Finished"});
            this.setState({count: ""});
            clearInterval(this.interval);
            this.interval = null;
            this.setState({render: true})
        }
    }

    updateValue(event){
        this.setState({count: event.target.value});
    }

    counter() {
        this.setState({count: this.props.count})
        if (this.interval != null) {
            clearInterval(this.interval);
        }
        this.interval = setInterval(this.update, 1000)
    }

    render(){
        return(
        <>
            {this.state.render &&
            <Grid container>
                <Grid style={{marign: 20}}>
                    <TextField value={this.state.count} style={{margin: 20}} onChange={this.updateValue} label="Seconds"  variant="filled" inputProps={{type: "number"}}></TextField>
                </Grid>
            </Grid>
            }

        <Button variant="contained" style={{margin: 20}} onClick={this.buttonClicked}>Start</Button>

        <Typography style={{margin: 20}} variant="h6">{this.state.count}</Typography>
        <Typography style={{margin: 20}} variant="h6">{this.state.t}</Typography>
    
        </>)
        }
}


export default Timergui;