import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import SelIcon from '@material-ui/icons/Done';
import {teal_palette} from '../mui/metMuiThemes';

const styles = theme => ({
    key: {
	display: 'inline-block',
        marginRight: 'auto',
    },
    selectchip: {
        margin: theme.spacing(0),
	cursor: "pointer",
        color:"red",
        borderColor:"green",
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
function getChipClass(classes,active) {
    if (active) {
	return classes.selectchip;
    } else {
	return classes.restchip
    };
};
function getChipIcon(active) {
    if (active) {
	return <SelIcon/>;
    } else  {
	return null;
    };
}

class Archive extends Component {
    render() {
        const { classes, state, item, index, active, title } = this.props;
	//console.log("Rendering Archive...",item,index,active);
	var chip=getChipClass(classes,active);
	var icon=getChipIcon(active);
	var onclick=() => {
	    //console.log("Chip:",item,index,active);
	    state.Database.selectIndex(state,item,index);
	};
	//console.log("...archive:",JSON.stringify(item),JSON.stringify(index),active);
	return (
		<div className={classes.archive} title={title}>
	 	<Chip
	         icon={icon}
	         label={item}
	         title={title}
	         onClick={onclick}
	         className={chip}
	         variant="outlined"
		/>
		</div>
	);
    }
}

Archive.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Archive);
