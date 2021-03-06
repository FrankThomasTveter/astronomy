import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import PropTypes from  "prop-types";

import moment from 'moment';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
//import "./Datepicker.css";

import Button from '@material-ui/core/Button';

import PauseIcon from '@material-ui/icons/Pause';
import PlayIcon from '@material-ui/icons/PlayArrow';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import TimeIcon from '@material-ui/icons/AccessTime';

//console.log("Inside Time.")


const styles = theme => ({
    block:{},
    field:{},
    legend:{},
    button:{},
    buttonDisabled:{},
    reactDatepicker__inputContainer: {height:"inherit"},
    reactDatepickerWrapper:{height:"100%"},
});
//        maxWidth: theme.spacing.getMaxWidth.maxWidth,

function PlayOrPauseIcon(props) {
    const {state}=props;
    if (state.Events.isPlaying(state)) {
	return <PlayIcon/>;
    } else {
	return <PauseIcon/>;
    };
};

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
	this.state={speed:state.Events.getSpeed(state),
		    targetDate: state.Events.getModelMoment(state)};
	this.setModelMoment=this.setModelMoment.bind(this);
    };
    show(state) {
	this.setModelMoment(state); // undefined date will be reloaded...
	//this.forceUpdate();
    };
    setModelMoment(state,date){
	//console.log("Date:",date);
	state.Events.setModelMoment(state,date);
	this.setState({
	    targetDate: state.Events.getModelMoment(state)
	});
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
        const {state} = this.props;
	var speed=e.target.value;
	this.setState({ speed:speed });
	state.Events.setSpeed(state,speed);
    };
    handleChildClick(e) {
	e.stopPropagation();
	//console.log('Stopped propagation from child');
    };
    render() {
        const { classes, state } = this.props; // layout,  , zIndex
	var setModelMoment=function(date){
	    this.setModelMoment(state,date);
	}.bind(this);
	var forward=function(state) {
	    state.Events.forward(state);
	}.bind(this);
	var rewind=function(state) {
	    state.Events.rewind(state);
	}.bind(this);
	var togglePlay=function(state) {
	    state.Events.togglePlay(state);
	    this.show(state);
	}.bind(this);
	// var setEndDt=function(dt){
	//     this.setState({
	// 	endDt: dt //)moment(date).format(this.frm)
	//     });
	//     state.Events.setEndDt(state,this.state.endDt);
	// }.bind(this);
	//var cls={time:classes.time,
	//	 content:classes.content,
	//	 button:classes.button,
	//	 buttonDisabled:classes.buttonDisabled};
	var visible, events;
	if (state.Events.show(state,"time")) {
	    visible="visible";
	    events="auto";
	} else {
	    visible="hidden";
	    events="none";
	};
        return (
	   <span onClick={this.openDate}
	      className={classes.block} 
	      style={{visibility:visible, pointerEvents:events}}>
	    <fieldset className={classes.field}>
	      <legend className={classes.legend}><small>time</small></legend>
	      <div onMouseDown={this.handleChildClick}
	       style={{color:"black",
		    width:"100%",
		    display:"flex",
		    justifyContent:"space-between"}} 
	            className="cancel">
	      <DateTime
	        dateFormat="YYYY-MM-DD"
	        timeFormat="HH:mm:ss"
	        inputProps={{ disabled: false }}
	        value={this.state.targetDate}
	        onChange={setModelMoment}
	        onClick={this.handleChildClick}
	        style={{height:"100%"}}
	       />
	       <Button
	         className={classes.button}
                 onClick={function(e) {
		     var now=new moment();
		     setModelMoment(now)}}
	         title={"Now"}
	         disabled={false}> <TimeIcon/> </Button>
	      </div>
	      <div onMouseDown={this.handleChildClick}
	         style={{width:"100%",
		    display:"flex",
		    justifyContent:"space-between"}}
	            className="cancel">
	       <Button
	         className={classes.button}
                 onClick={function(e) {rewind(state);}}
	         title={"Rewind"}
	         disabled={false}> <FastRewindIcon/> </Button>
	       <Button
	          className={classes.button}
                  onClick={function(e) {togglePlay(state);}}
	          title={"Play"}
	          disabled={false}> <PlayOrPauseIcon state={state}/> </Button>
	       <Button
	          className={classes.button}
                  onClick={function(e) {forward(state)}}
		  title={"Forward"}
	          disabled={false}> <FastForwardIcon/> </Button>
	       <select defaultValue={this.state.speed} onChange={this.changeSpeed}>
	         <option value="1">Sec/Sec</option>
	         <option value="60">Min/Sec</option>
	         <option value="3600">Hour/Sec</option>
	         <option value="86400">Day/Sec</option>
	       </select>
	      </div>
	    </fieldset>
	   </span>
	);
    }
};

Time.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Time);
