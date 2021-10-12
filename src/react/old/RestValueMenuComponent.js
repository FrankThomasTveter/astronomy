import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
//import FullIcon from '@material-ui/icons/HourglassFull';
//import EmptyIcon from '@material-ui/icons/HourglassEmpty';
import MoveKey     from './MoveKeyComponent';
import OtherFullIcon from '@material-ui/icons/HourglassFull';
import OtherEmptyIcon from '@material-ui/icons/HourglassEmpty';
import {teal_palette} from '../mui/metMuiThemes';

import RestValue from './RestValueComponent';

const styles = theme => ({
    config: {
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
    remove: {
    },
    move:{},
    button:{},
    buttonInvisible:{},
    buttonDisabled:{},
});
function getChipIcon(keytype) {
    if (keytype === "otherRest") {
	return <OtherFullIcon/>;
    } else {
	return <OtherEmptyIcon/>;
    }
}
function renderMoveItem(classes,state,item,index,keyitem,onClose) {
    var cls={button:classes.button,buttonInvisible:classes.buttonInvisible,buttonDisabled:classes.buttonDisabled};
    return (<MenuItem key={item.target} onClose={onclose} className={classes.remove}>
	     <MoveKey state={state} keyitem={keyitem} onclick={item.onclick}
	        target={item.target} onclose={onclose} classes={cls}/>
	    </MenuItem>);
};

function renderMenuItem(classes,state,item,index,keyitem,keytype,onClose) {
    //console.log("KeyItem:",keyitem);
    if (item !== undefined) {
	return (<MenuItem key={'rest-'+item}>
		<RestValue state={state} keyvalue={item} keytype={keytype} target={keyitem} onclose={onClose}/> 
	    </MenuItem>);
    } else {
	return null;
    }
}
class RestValueMenu extends Component {
    state={anchor:null};
    render() {
        const {classes,state,keyitem,keytype,remove,target,focusPoints,focusType} = this.props;
	this.focusPoints=focusPoints;
	this.focusType=focusType;
	this.onClick = event => {
	    this.setState({ anchor: event.currentTarget });
	    state.Path.setPathFocus(state,keyitem+(this.focusType||""));
	};
	this.onClose = () => {this.setState({ anchor: null });};
	if (remove !== undefined) {
	    this.remove = () => {remove();this.onClose();};
	    this.target=target;
	} else {
	    //this.remove = () => {state.Navigate.onClickPath(state,'trash',keyitem);this.onClose();};
	    this.remove = () => {state.Navigate.pushRestToTrash(state,keyitem);this.onClose();};
	    this.target="trash";
	};
	this.pushToTable = () => {state.Navigate.pushKeyToTable(state,keyitem);this.onClose();};
	var items=state.Database.getKeyValues(state,keyitem);//state.Database.values[keyitem];
	items=items.sort(state.Utils.ascending);
	var icon=getChipIcon(keytype);
	//console.log("Rest key:",keyitem,keytype);
	var mapFunction= (item,index)=>renderMenuItem(classes,state,item,index,keyitem,keytype,this.onClose);
	//console.log("RestValueMenu.rendering:",keyitem,JSON.stringify(items));
	var moves=[{onclick:this.remove,target:this.target}];
	if (target!=="table" && state.Path.other.ignore.indexOf(keyitem)===-1) {
	    moves.push({onclick:this.pushToTable,target:"table"});
	};
	var moveFunction= (item,index)=>renderMoveItem(classes,state,item,index,keyitem,this.onClose);
	    return (<div className={classes.config} key={keyitem}>
		   <Chip key={keyitem}
                      label={keyitem}
	              icon={icon}
                      aria-owns={this.state.anchor ? 'keys-menu' : undefined}
                      aria-haspopup="true"
                      onClick={this.onClick}
                      className={classes.tabchip}
                      variant="outlined"
        	      ref={(input)=>{
	                 if (this.focusPoints !== undefined) {
			     var name=keyitem + (this.focusType||"");
			     //console.log("Found focus point:",name);
			     this.focusPoints[name]=input;
			 } else {
			     console.log("SVM-No focus points...");
			 }}}/>
		     <Menu
                        id="keys-menu"
	                anchorEl={this.state.anchor}
                        open={Boolean(this.state.anchor)}
                        onClose={this.onClose}
		>
		 {moves.map(moveFunction)}
		 {items.map(mapFunction)}
		 {mapFunction("",-1)}
	        </Menu>
	</div>);
    }
}


RestValueMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RestValueMenu);
