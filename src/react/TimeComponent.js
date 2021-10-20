import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import PropTypes from  "prop-types";
import Draggable from 'react-draggable'; // Both at the same time

import moment from 'moment';
import DatePicker from 'react-datepicker';
import DateTime from 'react-datetime';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datetime/css/react-datetime.css';
import TimePicker from "rc-time-picker";
import 'rc-time-picker/assets/index.css';
import Button from '@material-ui/core/Button';

import PauseIcon from '@material-ui/icons/Pause';
import PlayIcon from '@material-ui/icons/PlayArrow';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';

//console.log("Inside Time.")

const styles = theme => ({
    block:{},
    field:{},
    legend:{},
    button:{},
    buttonDisabled:{},
});
//        maxWidth: theme.spacing.getMaxWidth.maxWidth,

class Time extends Component {
    constructor(props) {
	super(props);
	this.Dateformat="YYYY-MM-DD";
	this.Timeformat="HH:mm:ss";
        const {state} = props;
	state.React.Time=this;
	this.openDate = this.openDate.bind(this);
	this.show=this.show.bind(this);
	this.changeSpeed=this.changeSpeed.bind(this);
	this.state={startDate: state.Astro.getStartDate(state), // new Date(),
		    speed:1};
    };
    show(state) {
	this.forceUpdate();
    };
    // Draggable functions
    trackPos(data) {
	console.log("x:", data.x, " y:", data.y );
    };    
    handleStart(data) {
	//console.log("Starting x:", data.x, " y:", data.y);
    };
    handleEnd(data) {
	//console.log("Ending x:", data.x, " y:", data.y);
    };
    // Time functions
    openDate(e){
	this.setState({ open: true, currentView: "days" });
    };
    changeSpeed(e){
	this.setState({ speed:e.target.value });
    };
    handleChildClick(e) {
	e.stopPropagation();
	console.log('child');
    };
    render() {
        const { classes, state, layout } = this.props;
	var setStartDate=function(date){
            this.setState({
		startDate: date //)moment(date).format(this.frm)
            });
	    state.Astro.setStartDate(state,this.state.startDate);
	}.bind(this);
	var setEndDt=function(dt){
	    this.setState({
		endDt: dt //)moment(date).format(this.frm)
	    });
	    state.Astro.setEndDt(state,this.state.endDt);
	}.bind(this);
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
		<div onClick={this.openDate}
			      className={classes.block} 
			      style={{visibility:visible}}>
		<fieldset className={classes.field}>
		<legend className={classes.legend}><small>time</small></legend>
		<div onMouseDown={this.handleChildClick} style={{color:"black",width:"100%",display:"flex", justifyContent:"space-between"}}>
		<DateTime
		    dateFormat="YYYY-MM-DD"
		    timeFormat="HH:mm:ss"
		    inputProps={{ disabled: false }}
		    value={this.state.startDate}
		    onChange={setStartDate}
	            onClick={this.handleChildClick}
	            isValidDate={current => current.isAfter(moment().subtract(1, "days"))}
		/>
		</div>
		<div onMouseDown={this.handleChildClick} style={{width:"100%",display:"flex", justifyContent:"space-between"}}>
		<button
	    className={classes.button}
            onClick={function(e) {console.log("Clicked me");}.bind(this)}
	    title={"Rewind"}
	    disabled={false}> <FastRewindIcon/> </button>
		<button
	    className={classes.button}
            onClick={function(e) {console.log("Clicked me");}.bind(this)}
	    title={"Play"}
	    disabled={false}> <PlayIcon/> </button>
		<button
	    className={classes.button}
            onClick={function(e) {console.log("Clicked me");}.bind(this)}
	    title={"Forward"}
	    disabled={false}> <FastForwardIcon/> </button>
		<select defaultValue={this.state.speed} onChange={this.changeSpeed}>
		<option value="1">Sec/Sec</option>
		<option value="60">Min/Sec</option>
		<option value="3600">Hour/Sec</option>
		<option value="86040">Day/Sec</option>
		</select>
		</div>
		</fieldset>
	    </div>
	   </Draggable>
	);
    }
};
	    // 	<Picker
            // value={moment(this.state.startDate,this.frm)}
	    // 	/>

	    // allowEmpty={false}
            // onChange={this.handleTime}
            // showSecond={true}
	    // use12Hours={false}
	    // format={this.frm}
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
