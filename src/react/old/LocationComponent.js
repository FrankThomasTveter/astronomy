import React, {Component} from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    location: {
	overflow: "hidden",
        whiteSpace: 'nowrap',
        textAlign: 'center',
	width:'100%',
    },
});

class LocationComponent extends Component {
    constructor(props) {
	super(props);
	const {state} = props;
	state.React.Location=this;
    };

    showLocation(state) {
	//console.log("Showing LocationComponent.",JSON.stringify(state.Path.keys));
	this.forceUpdate();
    };
    render() {
        const { classes, state } = this.props;
	var title=state.Path.getTitle(state);
	var tooltip=state.Path.getTooltipTitle(state);
	if (state.Layout.title !== undefined && state.Layout.title !== "") {
	    document.title = state.Layout.title;
	}
        return (
		<div className={classes.location} title={tooltip}>
     		{title}
            </div>
        );
    }
}

LocationComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LocationComponent);
