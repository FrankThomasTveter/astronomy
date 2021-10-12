import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import PathSelectIcon from '@material-ui/icons/Done';
import TableIcon from '@material-ui/icons/Apps';
import RestIcon from '@material-ui/icons/HourglassFull';
import IgnoreIcon from '@material-ui/icons/HourglassEmpty';
import TrashIcon from '@material-ui/icons/Delete';
import JunkIcon from '@material-ui/icons/DeleteOutline';
import PassIcon from '@material-ui/icons/DeleteForever';
import {teal_palette} from '../mui/metMuiThemes';

const styles = theme => ({
    key: {
	display: 'inline-block',
        marginRight: 'auto',
    },
    inactive: {
        margin: theme.spacing(0),
	cursor: "pointer",
        color:"gray",
        borderColor:"gray",
	backgroundColor:'white',
	"&&:hover":{
	    backgroundColor:teal_palette.light,
	},
	"&&:focus":{
	    backgroundColor:teal_palette.light,
	}
    },
    select: {
        margin: theme.spacing(0),
	cursor: "pointer",
        color:"black",
        borderColor:"blue",
	backgroundColor:'white',
	"&&:hover":{
	    backgroundColor:teal_palette.light,
	},
	"&&:focus":{
	    backgroundColor:teal_palette.light,
	}
    },
    table: {
        margin: theme.spacing(0),
	cursor: "pointer",
        color:"green",
        borderColor:"blue",
	backgroundColor:'white',
	"&&:hover":{
	    backgroundColor:teal_palette.light,
	},
	"&&:focus":{
	    backgroundColor:teal_palette.light,
	}
    },
    rest: {
        margin: theme.spacing(0),
	cursor: "pointer",
        color:"blue",
        borderColor:"blue",
	backgroundColor:'white',
	"&&:hover":{
	    backgroundColor:teal_palette.light,
	},
	"&&:focus":{
	    backgroundColor:teal_palette.light,
	}
    },
    ignore: {
        margin: theme.spacing(0),
	cursor: "pointer",
        color:"red",
        borderColor:"blue",
	backgroundColor:'white',
	"&&:hover":{
	    backgroundColor:teal_palette.light,
	},
	"&&:focus":{
	    backgroundColor:teal_palette.light,
	}
    },
    trash: {
        margin: theme.spacing(0),
	cursor: "pointer",
        color:"red",
        borderColor:"red",
	backgroundColor:'white',
	"&&:hover":{
	    backgroundColor:teal_palette.light,
	},
	"&&:focus":{
	    backgroundColor:teal_palette.light,
	}
    },
    junk: {
        margin: theme.spacing(0),
	cursor: "pointer",
        color:"orange",
        borderColor:"orange",
	backgroundColor:'white',
	"&&:hover":{
	    backgroundColor:teal_palette.light,
	},
	"&&:focus":{
	    backgroundColor:teal_palette.light,
	}
    },
    pass: {
        margin: theme.spacing(0),
	cursor: "pointer",
        color:"white",
        borderColor:"blue",
	backgroundColor:'orange',
	"&&:hover":{
	    backgroundColor:teal_palette.light,
	},
	"&&:focus":{
	    backgroundColor:teal_palette.light,
	}
    },
    othchip: {
        margin: theme.spacing(0),
        color:"white",
        borderColor:"blue",
	backgroundColor:'red',
	"&&:hover":{
	    backgroundColor:'black',
	},
	"&&:focus":{
	    backgroundColor:'black',
	}
  },
});
function getChipClass(classes,keytype,active) {
    if (active !== undefined && !active ) {
	return classes.inactive;
    } else if (keytype === "select") {
	return classes.select;
    } else if (keytype === "table") {
	return classes.table;
    } else if (keytype === "rest") {
	return classes.rest;
    } else if (keytype === "ignore") {
	return classes.ignore;
    } else if (keytype === "trash") {
	return classes.trash;
    } else if (keytype === "junk") {
	return classes.junk;
    } else if (keytype === "pass") {
	return classes.pass;
    } else  {
	return classes.other;
    };
};
function getChipIcon(keytype,filled) {
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
	return null;
    };
}

class Key extends Component {
    render() {
        const {classes,state,key,name,active,onclick,title}=this.props;
	var keytype=state.Path.getKeyType(state,name)
	var icon=getChipIcon(keytype);
	var chip=getChipClass(classes,keytype,active);
	//console.log("Rendering:", name,keytype,active,key);
	return (
		<div key={key} className={classes.key} title={title}>
	 	   <Chip
	              icon={icon}
	              label={name}
	              onClick={onclick}
	              className={chip}
	              variant="outlined"
		   />
		</div>
	);
    }
}

Key.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Key);
