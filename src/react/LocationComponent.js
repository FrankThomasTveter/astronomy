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
    map:{},
});
//        maxWidth: theme.spacing.getMaxWidth.maxWidth,

class Location extends Component {
    constructor(props) {
	super(props);
        const {state} = props;
	state.React.Location=this;
	this.state={lat:state.Astro.getLat(state),lon:state.Astro.getLon(state)};
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
	//console.log('Stopped propagation from child');
    };
    setLat(e) {
        const { classes, state, layout } = this.props;
	//console.log("Changed lat:",e.target.value);
	var lat=parseFloat(e.target.value);
	if (isNaN(lat)) {lat=60.0;};
	this.setState({lat:lat});
	state.Astro.setLat(state,this.state.lat);
    };
    setLon(e) {
        const { classes, state, layout } = this.props;
	//console.log("Changed lon:",e.target.value);
	var lon=parseFloat(e.target.value);
	if (isNaN(lon)) {lon=0.0;};
	this.setState({lon:lon});
	state.Astro.setLon(state,this.state.lon);
    };
    onClick(event) {
        const { classes, state, layout } = this.props;
	const { lat, lng } = event.latlng;
	this.setState({lat:lat, lon:lng});
	state.Astro.setLat(state,this.state.lat);
	state.Astro.setLon(state,this.state.lon);
	//console.log("Click:",this.state);
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
	//onMouseDown={this.handleChildClick}
	var cls={map:classes.map};
        return (
		<Draggable key="location" bounds="parent" cancel=".cancel">
		   <div className={classes.block} style={{visibility:visible}}>
		<fieldset className={classes.field}>
		<legend className={classes.legend}><small>location</small></legend>
		<div onMouseDown={this.handleChildClick} style={{display:'flex', flexDirection:'column'}} className="cancel">
		 <div style={{display:'flex', justifyContent:'flex-start'}}>
		  <label>Latitude</label>
		  <input type="text" value={this.state.lat} onChange={this.setLat} maxLength="5" size="5"/>
		  <label>Longitude</label>
		  <input type="text" value={this.state.lon} onChange={this.setLon} maxLength="5" size="5"/>
	         </div>
		<div style={{width:"100%",height:"100px"}}>
		<Chart state={state} classes={cls}
	           position={[this.state.lat,this.state.lon]}
	           onClick={this.onClick}/>
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
