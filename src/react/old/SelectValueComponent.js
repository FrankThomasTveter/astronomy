import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import {teal_palette} from '../mui/metMuiThemes';
import UndefinedIcon from '@material-ui/icons/CallMissedOutgoing';
import MaxIcon from '@material-ui/icons/ArrowUpward';
import MinIcon from '@material-ui/icons/ArrowDownward';

const styles = theme => ({
    value: {
	display: 'inline-block',
        marginRight: 'auto',
    },
    selchip: {
        margin: theme.spacing(0),
	cursor: "pointer",
        color:"blue",
        borderColor:"blue",
	backgroundColor:'white',
	"&&:hover":{
	    backgroundColor:teal_palette.light,
	},
	"&&:focus":{
	    backgroundColor:teal_palette.main,
	    color:'white',
	}
    },
    othchip: {
        margin: theme.spacing(0),
	cursor: "pointer",
        color:"gray",
        borderColor:"gray",
	backgroundColor:'white',
	"&&:hover":{
	    backgroundColor:teal_palette.light,
	},
	"&&:focus":{
	    backgroundColor:teal_palette.main,
	    color:'white',
	}
  },
});
class Value extends Component {
    render() {
        const { classes, state, keyitem, valueitem, tpos } = this.props;
	var label=valueitem;
	var onclick=() => {
	    state.Path.setPathFocus(state,keyitem+"_selected");
	    //console.log("Select->focus:",keyitem+"_selected");
	    state.Path.toggleSelect(state,keyitem,valueitem);
	};
	var chip=(tpos!==-1 ? classes.selchip : classes.othchip);
	var icon=null;
	if (label === "") {
	    label="<none>";
	    icon=<UndefinedIcon/>;
	} else if (label.substring(0,3) === "MAX") {
	    label=label.substring(4).slice(0,-1)
	    icon=<MaxIcon/>;
	} else if (label.substring(0,3) === "MIN") {
	    label=label.substring(4).slice(0,-1)
	    icon=<MinIcon/>;
	};
	return (
		<div className={classes.value}>
		   <Chip
	              icon={icon}
	              label={label}
	              onClick={onclick}
	              className={chip}
	              variant="outlined"
		   />
		</div>
	);
    }
}

Value.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Value);
