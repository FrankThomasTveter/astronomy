import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import TabIcon from '@material-ui/icons/Apps';
import {teal_palette} from '../mui/metMuiThemes';

import Key from './KeyComponent';
import MoveKey  from './MoveKeyComponent';
//import Remove   from './RemoveComponent';

const styles = theme => ({
    config: {
	border:'0px',
        marginLeft: 'auto',
    },
    tabchip: {
        margin: theme.spacing(0),
	cursor: "pointer",
        color:"red",
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
    button:{},
    buttonInvisible:{},
    buttonDisabled:{},
});
function renderMenuItem(classes,state,keyitem,keyindex,key,onClose) {
    if (key === keyitem) {
	return null;
    } else {
	var onclick=() => {state.Navigate.replaceTableKey(state,keyitem,key);onClose();};
	return (<MenuItem key={keyitem}>
		<Key state={state} name={keyitem} onclick={onclick}/> 
		</MenuItem>);
    };
}
class TableKeyMenu extends Component {
    state={anchor:null};
    render() {
        const { classes, state, keyitem, focusPoints } = this.props;
	this.focusPoints=focusPoints;
	this.onClick = event => {
	    this.setState({ anchor: event.currentTarget });
	    state.Path.setPathFocus(state,keyitem);
	};
	this.onClose = () => {this.setState({ anchor: null });};
	this.pushToOther = () => {state.Navigate.pushTableToRest(state,keyitem,true);this.onClose();};
	var items=state.Utils.cp(state.Path.keys.other);
	items=items.sort(state.Utils.ascending);
	var mapFunction= (item,index)=>renderMenuItem(classes,state,item,index,keyitem,this.onClose);
	//console.log("TableKeyMenu.rendering:",key,JSON.stringify(items));
	var cls={button:classes.button,buttonInvisible:classes.buttonInvisible,buttonDisabled:classes.buttonDisabled};
	return (
		<div className={classes.config} key={keyitem}>
		   <Chip
                      icon={<TabIcon />}
                      label={keyitem}
                      aria-owns={this.state.anchor ? 'keys-menu' : undefined}
                      aria-haspopup="true"
                      onClick={this.onClick}
                      className={classes.tabchip}
                      variant="outlined"
	              ref={(input)=>{
			  if (this.focusPoints !== undefined) {
			      this.focusPoints[keyitem]=input;
			  } else {console.log("TKM-No focus points...");}}}/>
		     <Menu
                        id="keys-menu"
	                anchorEl={this.state.anchor}
                        open={Boolean(this.state.anchor)}
                        onClose={this.onClose}
		     >
		        <MenuItem key="pushToOther" onClose={this.onClose} className={classes.remove}>
		         <MoveKey state={state} keyitem={keyitem} onclick={this.pushToOther} target="rest" onclose={this.onClose}
	                  classes={cls}/>
		       </MenuItem>
		        {items.map(mapFunction)}
	             </Menu>
		</div>
	);
    }
}


// var cls={button:classes.button,buttonInvisible:classes.buttonInvisible,buttonDisabled:classes.buttonDisabled}
//this.remove = () => {state.Navigate.pushTableToTrash(state,keyitem,true);this.onClose();};
//         <MenuItem key="remove" onClose={this.onClose} className={classes.remove}>
// <Remove state={state} keyitem={keyitem} onclick={this.remove} onclose={this.onClose}
//         classes={cls}/>
//        </MenuItem>


TableKeyMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TableKeyMenu);
