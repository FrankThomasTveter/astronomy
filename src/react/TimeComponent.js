import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import PropTypes from  "prop-types";
import Draggable from 'react-draggable'; // Both at the same time

//import DateFnsUtils from '@date-io/date-fns'; // choose your lib
//import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

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
    state={startDate: new Date()};
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
    handleTime = (date,dateString) => {
        this.setState({
            startDate: date
        });
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
	    </div>
	   </Draggable>
	);
    }
};
// disabled={false}
// 	            disableToolbar={true}

	    	// <MuiPickersUtilsProvider utils={DateFnsUtils}>
		// <DateTimePicker
	        //     ampm={false}
		//     label="Time"
		//     clearable
	        //     hideTabs={true}
		//     inputVariant="outlined"
	        //     format="yyyy/mm/dd hh:mm:ss"
		//     value={this.state.startDate}
		//     onChange={this.handleTime}
		//     helperText="Clear Initial State"
	    	// 	/>
	     	// </MuiPickersUtilsProvider>

Time.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Time);
