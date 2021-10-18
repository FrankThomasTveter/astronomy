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

//console.log("Inside Time.")

const styles = theme => ({
    block:{},
    field:{},
    legend:{},
    button:{},
    buttonDisabled:{},
});
//        maxWidth: theme.spacing.getMaxWidth.maxWidth,

function ToTime(props){
    const { state,classes,parent } = props;
    var decreaseEndDt=function() {
	state.Astro.decreaseEndDt(state);
	parent.setState({endDt:state.Astro.getEndDt(state)});
    };
    var increaseEndDt=function() {
	state.Astro.increaseEndDt(state);
	parent.setState({endDt:state.Astro.getEndDt(state)});
    };
    var disabled=state.Astro.getPrev(state) || state.Astro.getNext(state);
    var visible=! disabled;
    var btncls=classes.button;
    if (disabled) { 
	btncls=classes.buttonDisabled 
    };
    return (<>
	    <button
	    className={btncls}
            onClick={decreaseEndDt}
	    title={"Increase end date"}
	    disabled={disabled}> - </button>
	    <button
	    className={btncls}
            onClick={increaseEndDt}
	    title={"Increase end date"}
	    disabled={disabled}> + </button>
	    <input type="text" className={btncls}
	    value={state.Astro.getEndDt(state)} maxLength="1" size="1" disabled/>
	    </>);
};
class Time extends Component {
    constructor(props) {
	super(props);
	this.Dateformat="YYYY-MM-DD";
	this.Timeformat="HH:mm:ss";
        const {state} = props;
	this.openDate = this.openDate.bind(this);
	this.show=this.show.bind(this);
	this.state={startDate: state.Astro.getStartDate(state), // new Date(),
		    prev:! state.Astro.getPrev(state),
		    next:! state.Astro.getNext(state),
		    endDt: state.Astro.getEndDt(state)};   //undefined //moment().format(this.frm)
	state.React.Time=this;
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
    openDate(){
	this.setState({ open: true, currentView: "days" });
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
	var togglePrev=function(){
	     this.setState({
	          prev: ! this.state.prev //)moment(date).format(this.frm)
	      });
	    state.Astro.setPrev(state,this.state.prev);
	}.bind(this);
	var toggleNext=function(){
	     this.setState({
	          next: ! this.state.next //)moment(date).format(this.frm)
	      });
	    state.Astro.setNext(state,this.state.next);
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
		<div style={{color:"black"}}>
		<DateTime
		    dateFormat="YYYY-MM-DD"
		    timeFormat="HH:mm:ss"
		    inputProps={{ disabled: false }}
		    value={this.state.startDate}
		    onChange={setStartDate}
		    isValidDate={current => current.isAfter(moment().subtract(1, "days"))}
		/>
		</div>
		<div style={{width:"100%",display:"flex", justifyContent:"space-around"}}>
		<input name="prev" type="checkbox" defaultChecked={! this.state.prev} onTouchEnd={togglePrev} onClick={togglePrev}/><label>Prev</label>
		<input name="next" type="checkbox" defaultChecked={! this.state.next} onTouchEnd={toggleNext} onClick={toggleNext}/><label>Next</label>
		<ToTime parent={this} state={state} classes={classes} style={{marginLeft:"auto", marginRight:"0"}}/>
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
