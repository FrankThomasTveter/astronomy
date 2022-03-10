import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import PropTypes from  "prop-types";
import Chart from './ChartComponent'; // Both at the same time

//console.log("Inside Location.")

const styles = theme => ({
    block:{},
    field:{},
    legend:{},
    button:{},
    buttonDisabled:{},
    map:{},
});
//        maxWidth: theme.spacing.getMaxWidth.maxWidth,

class Location extends Component {
    constructor(props) {
	super(props);
        const {state} = props;
	state.React.Location=this;
	this.state={lat:state.Events.getLat(state),lon:state.Events.getLon(state),
		    ilat:state.Events.getLat(state),ilon:state.Events.getLon(state)};
	this.show=this.show.bind(this);
	this.setLat=this.setLat.bind(this);
	this.setLon=this.setLon.bind(this);
	this.onClick=this.onClick.bind(this);
    };
    show(state) {
	this.forceUpdate();
    };
    handleChildClick(e) {
	e.stopPropagation();
	console.log('Stopped propagation from child');
    };
    setLat(e) {
        const { state } = this.props; // , classes, layout
	//console.log("Changed lat:",e.target.value);
	var lat=parseFloat(e.target.value) || 0.0;
	if (isNaN(lat)){lat=0.0;};
	this.setState({lat:e.target.value,ilat:lat});
	state.Events.setLat(state,lat);
	state.React.Chart.flyTo(state.Events.getLat(state),state.Events.getLon(state));
	state.Events.triggerUpdate(state);
    };
    setLon(e) {
        const { state } = this.props; // classes, layout 
	//console.log("Changed lon:",e.target.value);
	this.setState({lon:e.target.value});
	var lon=parseFloat(e.target.value) || 0.0;
	if (isNaN(lon)){lon=0.0;};
	this.setState({lon:e.target.value,ilon:lon});
	state.Events.setLon(state,lon);
	state.React.Chart.flyTo(state.Events.getLat(state),state.Events.getLon(state));
	state.Events.triggerUpdate(state);
    };
    onClick(event) {
	//console.log("Event:",event);
        const { state } = this.props; // , classes, layout
	const { lat, lng } = event.latlng;
	this.setState({lat:lat, lon:lng, ilat:lat, ilon:lng});
	state.Events.setLat(state,this.state.lat);
	state.Events.setLon(state,this.state.lon);
	state.Events.triggerUpdate(state);
	//console.log("Click:",this.state);
    };
    render() {
        const { classes, state } = this.props; // , layout
	//var cls={location:classes.location,
	//	 content:classes.content,
	//	 button:classes.button,
	//	 buttonDisabled:classes.buttonDisabled};
	var visible,events;
	if (state.Events.show(state,"location")) {
	    visible="visible";
	    events="auto";
	} else {
	    visible="hidden";
	    events="none";
	};
	//onMouseDown={this.handleChildClick}
	var cls={map:classes.map};
	//
        return (
		   <div className={classes.block} style={{visibility:visible, pointerEvents:events}}>
		<fieldset className={classes.field}>
		<legend className={classes.legend}><small>location</small></legend>
		<div onMouseDown={this.handleChildClick} style={{display:'flex', flexDirection:'column'}} className="cancel">
		 <div style={{display:'flex', justifyContent:'flex-start'}}>
		  <label>Latitude</label>
		  <input type="text" value={this.state.lat} onChange={this.setLat} onBlur={this.setLat} maxLength="10" size="5"/>
		  <label>Longitude</label>
		  <input type="text" value={this.state.lon} onChange={this.setLon} onBlur={this.setLon} maxLength="10" size="5"/>
	         </div>
		<div style={{width:"100%",height:"100px"}}>
		<Chart state={state} classes={cls}
	           position={[this.state.ilat,this.state.ilon]}
	           onClick={this.onClick}/>
	         </div>
	        </div>
	        </fieldset>
	        </div>
        );
    };
}
// disabled={false}
// this.state.lat,this.state.lon

Location.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Location);
