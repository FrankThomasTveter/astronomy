import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
//import SelIcon from '@material-ui/icons/Done';
//import NullIcon from '@material-ui/icons/Clear';
import PathSelectIcon from '@material-ui/icons/Done';
import TableIcon from '@material-ui/icons/Apps';
import OtherFullIcon from '@material-ui/icons/HourglassFull';
import OtherEmptyIcon from '@material-ui/icons/HourglassEmpty';
import TrashFullIcon from '@material-ui/icons/Delete';
import TrashEmptyIcon from '@material-ui/icons/DeleteOutline';
import TrashIgnoreIcon from '@material-ui/icons/DeleteForever';
import {teal_palette} from '../mui/metMuiThemes';

const styles = theme => ({
    key: {
	display: 'inline-block',
        marginRight: 'auto',
    },
    selectchip: {
        margin: theme.spacing(0),
	cursor: "pointer",
        color:"black",
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
    tablechip: {
        margin: theme.spacing(0),
	cursor: "pointer",
        color:"black",
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
    restchip: {
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
    otherfullchip: {
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
    otheremptychip: {
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
    trashfullchip: {
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
    trashemptychip: {
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
    trashignorechip: {
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
    othchip: {
        margin: theme.spacing(0),
        color:"red",
        borderColor:"red",
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
function getChipClass(classes,keytype,keyactive) {
    if (keytype === "select") {
	if (keyactive) {
	    return classes.selectchip;
	} else {
	    return classes.trashfullchip
	};
    } else if (keytype === "otherTable") {
	return classes.tablechip
    } else if (keytype === "otherRest") {
	return classes.restchip
    } else if (keytype === "otherIgnore") {
	return classes.otheremptychip
    } else if (keytype === "trashFound") {
	return classes.trashfullchip
    } else if (keytype === "trashRest") {
	return classes.trashemptychip
    } else if (keytype === "trashIgnore") {
	return classes.trashignorechip
    } else  {
	return classes.othchip
    };
};
function getChipIcon(keytype) {
    if (keytype === "select") {
	return <PathSelectIcon/>;
    } else if (keytype === "otherTable") {
	return <TableIcon/>;
    } else if (keytype === "otherRest") {
	return <OtherFullIcon/>;
	//return null;
    } else if (keytype === "otherIgnore") {
	return <OtherEmptyIcon/>;
    } else if (keytype === "trashFound") {
	return <TrashFullIcon/>;
    } else if (keytype === "trashRest") {
	return <TrashEmptyIcon/>;
    } else if (keytype === "trashIgnore") {
	return <TrashIgnoreIcon/>;
    } else  {
	return null;
    };
}

class SelectKey extends Component {
    render() {
	const { classes, state, title, keytype, keyitem, keyactive } = this.props;//state, key, index, onclick, title, 
	//var vals=state.Database.getKeyValues(state,keyitem);
	var chip=getChipClass(classes,keytype,keyactive);
	var icon=getChipIcon(keytype);
	var onclick=() => state.Layout.increaseSelect(state,keyitem,keytype);
	return (
	    <div className={classes.key}>
	       <Chip
                  icon={icon}
                  label={keyitem}
                  onClick={onclick}
                  title={title}
                  className={chip}
                  variant="outlined"
	       />
	    </div>
	);
    };
}

SelectKey.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectKey);
