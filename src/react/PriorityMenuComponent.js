import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PriorityIcon from '@material-ui/icons/VerticalAlignTop';
import Priority from './PriorityComponent';

const styles = theme => ({
    settings:{},
    prioritys: {
	display: 'inline-block',
        marginLeft: 'auto',
    },
    button:{
	color:'white'
    },
});
function renderMenuItem(classes,state,priorityitem,priorityindex) {
    return (<MenuItem priority={priorityitem} key={priorityitem}>
	       <Priority state={state} priorityitem={priorityitem}/> 
	    </MenuItem>);
}
class PriorityMenu extends Component {
    state={anchor:null};
    render() {
        const { classes, state } = this.props;
	this.onClick = event => {this.setState({ anchor: event.currentTarget });};
	this.onClose = () => {this.setState({ anchor: null })};
	var items=state.Layout.getPriorityKeys(state);
	var mapFunction= (item,index)=>renderMenuItem(classes,state,item,index);
	//console.log("Priorities.rendering",items.length,JSON.stringify(anchor),Boolean(anchor));
	return (
		<div>
		   <Button
                      className={classes.button}
                      aria-owns={this.state.anchor ? 'prioritys-menu' : undefined}
                      aria-haspopup="true"
                      onClick={this.onClick}
	              title={"Column priority"}
		    >
	  	       {<PriorityIcon state={state}/>}
                     </Button>
		     <Menu className={classes.prioritys}
                        id="prioritys-menu"
	                anchorEl={this.state.anchor}
                        open={Boolean(this.state.anchor)}
                        onClose={this.onClose}
		     >
		        {items.map(mapFunction)}
	             </Menu>
		</div>
	);
    }
}

PriorityMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PriorityMenu);
