import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import PropTypes from  "prop-types";
import Draggable from 'react-draggable'; // Both at the same time
import Chart from './ChartComponent'; // Both at the same time

//console.log("Inside Location.")

const styles = theme => ({
    block:{},
    field:{},
    legend:{},
    button:{},
    buttonDisabled:{},
});
//        maxWidth: theme.spacing.getMaxWidth.maxWidth,

class Location extends Component {
    constructor(props) {
	super(props);
        const {state} = props;
	state.React.Location=this;
	this.state={lat:state.Astro.getLat(state),lon:state.Astro.getLon(state)};
	this.show=this.show.bind(this);
    };
    show(state) {
	this.forceUpdate();
    };
    handleChildClick(e) {
	e.stopPropagation();
	console.log('child');
    };
    render() {
        const { classes, state, layout } = this.props;
	var cls={location:classes.location,
		 content:classes.content,
		 button:classes.button,
		 buttonDisabled:classes.buttonDisabled};
	var visible;
	if (state.Astro.show(state,"location")) {
	    visible="visible";
	} else {
	    visible="hidden";
	};
	var setLat=function(e) {
	    console.log("Changed lat:",e.target.value);
	    this.setState({lat:e.target.value});
	    state.Astro.setLat(state,this.state.lat);
	};
	var setLon=function(e) {
	    console.log("Changed lon:",e.target.value);
	    this.setState({lon:e.target.value});
	    state.Astro.setLon(state,this.state.lon);
	};
	//onMouseDown={this.handleChildClick}
        return (
		<Draggable key="location">
		   <div className={classes.block} style={{visibility:visible}}>
		<fieldset className={classes.field}>
		<legend className={classes.legend}><small>location</small></legend>
		<div onMouseDown={this.handleChildClick} style={{display:'flex', flexDirection:'column'}}>
		 <div style={{display:'flex', justifyContent:'flex-start'}}>
		  <label>Latitude</label>
		  <input type="text" defaultValue={this.state.lat} onChange={this.setLat} maxLength="5" size="5"/>
		  <label>Longitude</label>
		  <input type="text" defaultValue={this.state.lon} onChange={this.setLon} maxLength="5" size="5"/>
	         </div>
		 <div style={{width:"100%"}}>
		  <Chart state={state} classes={{map:{}}}/>
	         </div>
	        </div>
	        </fieldset>
	        </div>
		</Draggable>
        );
    };
}
// disabled={false}


Location.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Location);
