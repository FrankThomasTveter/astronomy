import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import PropTypes from  "prop-types";
import Draggable from 'react-draggable'; // Both at the same time

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
        return (
		<Draggable key="location">
		   <div className={classes.block} style={{visibility:visible}}>
		<fieldset className={classes.field}>
		<legend className={classes.legend}><small>location</small></legend>
		<div onMouseDown={this.handleChildClick} >
		LOCATION
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
