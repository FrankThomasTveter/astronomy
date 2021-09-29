import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import SelectIcon from '@material-ui/icons/Done';
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
    tablechip: {
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
    restchip: {
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
    voidchip: {
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
    trashchip: {
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
    emptychip: {
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
    ignorechip: {
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
    othchip: {
        margin: theme.spacing(0),
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
    selectchipvisible: {
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
    tablechipvisible: {
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
    restchipvisible: {
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
    voidchipvisible: {
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
    trashchipvisible: {
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
    emptychipvisible: {
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
    ignorechipvisible: {
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
    othchipvisible: {
        margin: theme.spacing(0),
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
});
function getChipClass(classes,keytype,keyactive,visible) {
    var suff="";
    if (visible) {suff="visible";}
    if (keytype === "select") {
	if (keyactive) {
	    return classes["selectchip"+suff];
	} else {
	    return classes["selectchip"+suff];
	};
    } else if (keytype === "otherTable") {
	return classes["tablechip"+suff];
    } else if (keytype === "otherRest") {
	return classes["restchip"+suff];
    } else if (keytype === "otherIgnore") {
	return classes["voidchip"+suff];
    } else if (keytype === "trashFound") {
	return classes["trashchip"+suff];
    } else if (keytype === "trashRest") {
	return classes["emptychip"+suff];
    } else if (keytype === "trashIgnore") {
	return classes["ignorechip"+suff];
    } else  {
	return classes["othchip"+suff];
    };
};
function getChipIcon(keytype) {
    if (keytype === "select") {
	return <SelectIcon/>;
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

class CollectList extends Component {
    render() {
        const { classes, state, keyitem, keytype, keyactive } = this.props;
	//console.log("Rendering CollectList...",keyitem,keytype,keyactive);
	var visible=state.Path.isVisible(state,keyitem);
	var chip=getChipClass(classes,keytype,keyactive,visible);
	var icon=getChipIcon(keytype);
	var onclick=() => {
	    //console.log("Chip:",keyitem,keytype,keyactive);
	    state.Path.toggleVisibleKeys(state,keyitem);
	};
	return (
		<div className={classes.key}>
	 	   <Chip
	              icon={icon}
	              label={keyitem}
	              onClick={onclick}
	              className={chip}
	              variant="outlined"
		/>
		</div>
	);
    }
}

CollectList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CollectList);
