import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import PropTypes from  "prop-types";
import Button from '@material-ui/core/Button';

import EventsTable from './EventsTable'; // list of events

import ReloadIcon from '@material-ui/icons/Replay';
import UpIcon from '@material-ui/icons/ArrowUpward';
import DownIcon from '@material-ui/icons/ArrowDownward';

//console.log("Inside Events.")

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
    //var visible=! disabled;
    var btncls=classes.button;
    if (disabled) { 
	btncls=classes.buttonDisabled 
    };
    return (<>
	    <Button
	    className={btncls}
            onClick={decreaseEndDt}
	    title={"Increase end date"}
	    disabled={disabled}><DownIcon/></Button>
	    <Button
	    className={btncls}
            onClick={increaseEndDt}
	    title={"Increase end date"}
	    disabled={disabled}><UpIcon/> </Button>
	    <input type="text" className={btncls} style={{height:"100%"}}
	    value={state.Astro.getEndDt(state)} maxLength="1" size="1" disabled/>
	    </>);
};
class Events extends Component {
    constructor(props) {
	super(props);
        const {state} = props;
	state.React.Events=this;
	this.show=this.show.bind(this);
	this.state={prev:! state.Astro.getPrev(state),
		    next:! state.Astro.getNext(state),
		    auto:! state.Astro.getUpdate(state),
		    endDt: state.Astro.getEndDt(state)};   //undefined //moment().format(this.frm)
    };
    show(state) {
	this.forceUpdate();
    };
    handleChildClick(e) {
	e.stopPropagation();
	//console.log('child');
    };
    render() {
        const { classes, state, height } = this.props; //layout
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
	var toggleAuto=function(){
	     this.setState({
	          auto: ! this.state.auto //)moment(date).format(this.frm)
	      });
	    state.Astro.setUpdate(state,this.state.auto);
	}.bind(this);
	//var cls={events:classes.events,
	//	 content:classes.content,
	//	 button:classes.button,
	//	 buttonDisabled:classes.buttonDisabled};
	var visible;
	if (state.Astro.show(state,"events")) {
	    visible="visible";
	} else {
	    visible="hidden";
	};
	var data=state.Astro.getData(state);
	var sheight=(height-50) + "px";
	//console.log("Data:",data) ;
        return (
		<div  className={classes.block} style={{visibility:visible}}>
		<fieldset className={classes.field}>
		<legend className={classes.legend}><small>events</small></legend>
		<div style={{maxHeight:sheight,overflowY:'auto'}}>
		<div onMouseDown={this.handleChildClick} style={{color:'white',width:"100%",
								 display:"flex", 
								 justifyContent:"left", 
								 alignItems:'center'}} className="cancel">
		<Button
	          className={classes.button}
            onClick={function() {state.Astro.loadEvents(state,"",[state.Show.showAll]);}}
	          title={"Reload events"}
	          disabled={false}> <ReloadIcon/> </Button>
		<input name="prev" type="checkbox" defaultChecked={! this.state.prev} onTouchEnd={togglePrev} onClick={togglePrev}/><label>Prev</label>
		<input name="next" type="checkbox" defaultChecked={! this.state.next} onTouchEnd={toggleNext} onClick={toggleNext}/><label>Next</label>
		<ToTime parent={this} state={state} classes={classes} style={{marginLeft:"auto", marginRight:"0"}}/>
		<input name="auto" type="checkbox" defaultChecked={! this.state.auto} onTouchEnd={toggleAuto} onClick={toggleAuto}/><label>Auto</label>
		</div>
		<EventsTable state={state} classes={classes}/>
		</div>
	    </fieldset>
		    </div>
        );
    }
}
// disabled={false}


Events.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Events);
