import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import PropTypes from  "prop-types";
import Draggable from 'react-draggable'; // Both at the same time

//console.log("Inside Time.")

const styles = theme => ({
    block:{},
    button:{},
    buttonDisabled:{},
});
//        maxWidth: theme.spacing.getMaxWidth.maxWidth,

class Time extends Component {
    constructor(props) {
	super(props);
	this.state = {time: ''};
        const {state} = props;
	state.React.Time=this;
	this.handleChange = this.handleChange.bind(this);
	this.show=this.show.bind(this);
    };
    show(state) {
	this.forceUpdate();
    };
    handleChange(event) {
	console.log("time:", event.target.value);
    }
    trackPos(data) {
	console.log("x:", data.x, " y:", data.y );
    };
    
    handleStart(data) {
	console.log("Starting x:", data.x, " y:", data.y);
    };
    handleEnd(data) {
	console.log("Ending x:", data.x, " y:", data.y);
    };
    render() {
        const { classes, state, layout } = this.props;
	var cls={time:classes.time,
		 content:classes.content,
		 button:classes.button,
		 buttonDisabled:classes.buttonDisabled};
	var visible;
	if (state.Astro.show(state,"time")) {
	    visible="visible";
	} else {
	    visible="hidden";
	};
        return (
	   <Draggable key="time"
	    onnDrag={(e, data) => this.trackPos(data)}
	    onStart={this.handleStart}
	    onStop={this.handleEnd}>
	      <div className={classes.block} style={{visibility:visible}}>
		<label> Time: <input type="text" value={this.state.time} onChange={this.handleChange}/></label> 
		<label> Time: <input type="text" value={this.state.time} onChange={this.handleChange}/></label> 
	      </div>
	   </Draggable>
	);
    }
};
// disabled={false}


Time.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Time);
