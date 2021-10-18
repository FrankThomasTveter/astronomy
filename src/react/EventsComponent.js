import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import PropTypes from  "prop-types";
import Draggable from 'react-draggable'; // Both at the same time

//console.log("Inside Events.")

const styles = theme => ({
    block:{},
    field:{},
    legend:{},
    button:{},
    buttonDisabled:{},
});
//        maxWidth: theme.spacing.getMaxWidth.maxWidth,

class Events extends Component {
    constructor(props) {
	super(props);
        const {state} = props;
	state.React.Events=this;
	this.show=this.show.bind(this);
    };
    show(state) {
	this.forceUpdate();
    };
    render() {
        const { classes, state, layout } = this.props;
	var cls={events:classes.events,
		 content:classes.content,
		 button:classes.button,
		 buttonDisabled:classes.buttonDisabled};
	var visible;
	if (state.Astro.show(state,"events")) {
	    visible="visible";
	} else {
	    visible="hidden";
	};
        return (
		<Draggable key="events">
		    <div  className={classes.block} style={{visibility:visible}}>
		<fieldset className={classes.field}>
		<legend className={classes.legend}><small>events</small></legend>
			EVENTS
	        </fieldset>
		    </div>
		</Draggable>
        );
    }
}
// disabled={false}


Events.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Events);
