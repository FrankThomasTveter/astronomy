import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import PropTypes from  "prop-types";
import Draggable from 'react-draggable'; // Both at the same time

//console.log("Inside Criteria.")

const styles = theme => ({
    block:{},
    field:{},
    legend:{},
    button:{},
    buttonDisabled:{},
});
//        maxWidth: theme.spacing.getMaxWidth.maxWidth,
class Criteria extends Component {
    constructor(props) {
	super(props);
        const {state} = props;
	state.React.Criteria=this;
	this.show=this.show.bind(this);
    };
    show(state) {
	this.forceUpdate();
    };
    render() {
        const { classes, state, layout } = this.props;
	var cls={criteria:classes.criteria,
		 content:classes.content,
		 button:classes.button,
		 buttonDisabled:classes.buttonDisabled};
	var visible;
	if (state.Astro.show(state,"criteria")) {
	    visible="visible";
	} else {
	    visible="hidden";
	};
        return (
		<Draggable key="criteria">
		   <div className={classes.block} style={{visibility:visible}}>
		<fieldset className={classes.field}>
		<legend className={classes.legend}><small>criteria</small></legend>
		      CRITERIA
	        </fieldset>
	           </div> 
		</Draggable>
        );
    };
}
// disabled={false}


Criteria.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Criteria);
