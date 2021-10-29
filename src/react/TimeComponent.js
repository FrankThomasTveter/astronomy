import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import PropTypes from  "prop-types";
import Draggable from 'react-draggable'; // Both at the same time

import moment from 'moment';
import DateTime from 'react-datetime';
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

function PlayOrPauseIcon(props) {
    const {state}=props;
    if (state.Astro.isPlaying(state)) {
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
	this.state={speed:state.Astro.getSpeed(state)};
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
        const {state} = this.props;
	var speed=e.target.value;
	this.setState({ speed:speed });
	state.Astro.setSpeed(state,speed);
    };
    handleChildClick(e) {
	e.stopPropagation();
	//console.log('Stopped propagation from child');
    };
    render() {
        const { classes, state, layout, target, setTarget } = this.props;
	var setTargetDate=function(date){
            const { setTarget } = this.props;
	    setTarget(state,date);
	}.bind(this);
	var forward=function(state) {
            const { setTarget } = this.props;
	    setTarget(state,state.Astro.forward(state))
	}.bind(this);
	var rewind=function(state) {
            const { setTarget } = this.props;
	    setTarget(state,state.Astro.rewind(state))
	}.bind(this);
	var togglePlay=function(state) {
	    state.Astro.togglePlay(state);
	    this.show(state);
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
	//console.log("Target:",target);
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
	      <div onMouseDown={this.handleChildClick}
	       style={{color:"black",
		    width:"100%",
		    display:"flex",
		    justifyContent:"space-between"}}>
   	       <DateTime
	        dateFormat="YYYY-MM-DD"
	        timeFormat="HH:mm:ss"
	        inputProps={{ disabled: false }}
	        value={target}
	        onChange={setTargetDate}
	        onClick={this.handleChildClick}
	       />
	      </div>
	      <div onMouseDown={this.handleChildClick}
	         style={{width:"100%",
		    display:"flex",
		    justifyContent:"space-between"}}>
	       <button
	         className={classes.button}
                 onClick={function(e) {rewind(state);}.bind(this)}
	         title={"Rewind"}
	         disabled={false}> <FastRewindIcon/> </button>
	       <button
	          className={classes.button}
                  onClick={function(e) {togglePlay(state);}.bind(this)}
	          title={"Play"}
	          disabled={false}> <PlayOrPauseIcon state={state}/> </button>
	       <button
	          className={classes.button}
                  onClick={function(e) {forward(state)}.bind(this)}
		  title={"Forward"}
	          disabled={false}> <FastForwardIcon/> </button>
	       <select defaultValue={this.state.speed} onChange={this.changeSpeed}>
	         <option value="1">Sec/Sec</option>
	         <option value="60">Min/Sec</option>
	         <option value="3600">Hour/Sec</option>
	         <option value="86400">Day/Sec</option>
	       </select>
	      </div>
	    </fieldset>
	   </div>
	  </Draggable>
	);
    }
};

Time.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Time);
