import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
//import Typography from "@material-ui/core/Typography/Typography";
//import Grid from "@material-ui/core/Grid/Grid";


const styles = theme => ({
    root: {
        backgroundColor: theme.palette.primary.main,
    },
    info: {
	position: "absolute",
	top: "0px",
	left: "0px",
        marginTop: theme.spacing(0),
        padding: theme.spacing(1),
        bottom: 0,
        color: '#000',
	fontSize: '100%',
	pointerEvents: 'none',
	zIndex: 10000,
    },
});

class MapInfo extends Component {
    constructor(props) {
	super(props);
	const {state} = props;
	state.React.MapInfo=this;
	this.update=this.update.bind(this);
	this.showMapInfo=this.showMapInfo.bind(this);
    }
    update() {
	this.forceUpdate();
    };
    showMapInfo(state,force) {
	//console.log("ShowMapInfo:",force);
	if (force !== undefined && force) {
	    this.update();
	};
    };
    render() {
	const { classes, state } = this.props;
	var font=state.Layout.getExtraLargeFont();
	var label="";
	//console.log("Label:",label);
	return (
		<div className={classes.info} style={{font:font}}> {label} </div>
	);
    }
}

MapInfo.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MapInfo);
