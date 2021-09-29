import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import PathSelectIcon from '@material-ui/icons/Done';
import TableIcon from '@material-ui/icons/Apps';
import RestIcon from '@material-ui/icons/HourglassFull';
import IgnoreIcon from '@material-ui/icons/HourglassEmpty';
import TrashIcon from '@material-ui/icons/Delete';
import JunkIcon from '@material-ui/icons/DeleteOutline';
import PassIcon from '@material-ui/icons/DeleteForever';
import ErrorIcon from '@material-ui/icons/Error';

const styles = theme => ({
    button: {},
    buttonInvisible: {},
    buttonDisabled: {},
    remove: {
        marginLeft: 'auto',
    },
});
function getChipIcon(keytype) {
    if (keytype === "select") {
	return <PathSelectIcon/>;
    } else if (keytype === "table") {
	return <TableIcon/>;
    } else if (keytype === "rest") {
	return <RestIcon/>;
    } else if (keytype === "ignore") {
	return <IgnoreIcon/>;
    } else if (keytype === "trash") {
	return <TrashIcon/>;
    } else if (keytype === "junk") {
	return <JunkIcon/>;
    } else if (keytype === "pass") {
	return <PassIcon/>;
    } else  {
	console.log("Unknown type:",keytype);
	return <ErrorIcon/>;
    };
}
function getNewType(keytype,target) {
    if (keytype==="rest" && target==="trash") {
	return "trash";
    } else if (keytype==="ignore" && target==="trash") {
	return "junk";
    } else {
	return target;
    };
}

class MoveKey extends Component {
    render() {
	const {state, classes, keyitem, target, onclick }=this.props;
	var keytype=state.Path.getKeyType(state,keyitem);
	var newtype=getNewType(keytype,target);
	//console.log("Type:",keytype," (",keyitem,":",target,")");
	var icon=getChipIcon(newtype);
	return (
		   <Button
	              className={classes.button}
                      onClick={onclick}
	              title={"Move key"}
		    >
	  	       {icon}
                    </Button>
	);
    }
}

MoveKey.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MoveKey);
