import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import {teal_palette} from '../mui/metMuiThemes';

const styles = theme => ({
    priority: {
	display: 'inline-block',
        marginRight: 'auto',
    },
    othchip: {
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
	    backgroundColor:teal_palette.main,
	    color:'white',
	}
  },
});
class Priority extends Component {
    render() {
        const { classes, state, priorityitem } = this.props;
	var tpos=state.Path.keys.trash.indexOf(priorityitem);
	var onclick=() => state.Layout.increasePriority(state,priorityitem);
	var chip=(tpos!==-1 ? classes.trashchip : classes.othchip);
	return (
		<div className={classes.priority}>
	 	   <Chip
	              icon={null}
	              label={priorityitem}
	              onClick={onclick}
	              className={chip}
	              variant="outlined"
		   />
		</div>
	);
    }
}

Priority.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Priority);
