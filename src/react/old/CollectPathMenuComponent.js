import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
//import KeyIcon from '@material-ui/icons/VpnKey';
import PathIcon from '@material-ui/icons/Explore';
import Key     from './KeyComponent';

const styles = theme => ({
    settings:{},
    config: {
        marginLeft: 'auto',
    },
    button:{
	color:'white'
    },
});
function uniq(a,ignore) {
    var ss=a.sort((a,b) => {
	if (a.name  === "") { 
	    return 1;
	} else if (b.name  === "") {
	    return -1;
	} else if (a.name<b.name) { 
	    return -1;
	} else if (a.name>b.name) {
	    return 1;
	} else {
	    return 0;
	}
    });
    //console.log("Sorted:",JSON.stringify(ss));
    var ff=ss.filter((item, pos,arr) => {
	if (ignore.indexOf(item.name) !== -1) {
	    //console.log("Keeping (unique):",pos,item.name);
	    return false;
	} else if (!pos) {
	    //console.log("Removing (invalid):",pos,item.name);
	    return true;
	} else {
	    if (item.name !== arr[pos-1].name) {
		//console.log("Keeping (name):",pos,item.name);
		return true;
	    } else {     // items are equal
		arr[pos-1].active=arr[pos-1].active || item.active;
		//console.log("Removing (equal):",pos,item.name);
		return false;
	    }
	}
    });
    //console.log("Filtered:",JSON.stringify(ff));
    return ff;
};
function renderMenuItem(classes,state,keyitem,keyindex) {
    //console.log("Keys:",keyitem,keyindex);
    var name=keyitem.name;
    var key=keyitem.key||name;
    var active=keyitem.active;
    var onclick=() => {
	//console.log("Chip:",keyitem,keytype,keyactive);
	state.Navigate.pushKeyToOther(state,name);
    };
    return (<MenuItem key={key}>
	    <Key state={state} key={key} name={name} active={active} onclick={onclick}/> 
	    </MenuItem>);
}
class CollectPathMenu extends Component {
    state={anchor:null};
    render() {
	//console.log("Rendering KeyComponents...");
        const { classes, state } = this.props;
	//console.log("Keys.starting:",JSON.stringify(state.Path.other));
	this.onClick = event => {this.setState({ anchor: event.currentTarget });};
	this.onClose = () => {this.setState({ anchor: null });};
	var itms=state.Path.keys.path.map(function(item,index) {return {name:item,key:item+"select"}}).concat(
	    state.Path.other.table.map(function(item,index) {return {name:item,active:true}}),
	    state.Path.other.rest.map(function(item,index) {return {name:item,active:true}}),
	    state.Path.other.ignore.map(function(item,index) {return {name:item,active:true}}),
//	    state.Path.trash.ignore.map(function(item,index) {return {name:item}}),
	    state.Path.trash.found.map(function(item,index) {return {name:item}}),
	    state.Path.trash.rest.map(function(item,index) {return {name:item}})
	);

	var items=uniq(itms,[]); // state.Path.other.table
	var mapFunction= (item,index)=>renderMenuItem(classes,state,item,index);
	//console.log("Keys.rendering:",JSON.stringify(state.Path.other));
	//console.log("Keys.rendering",items.length,JSON.stringify(anchor),Boolean(anchor));
	//console.log("Items",itms.length,JSON.stringify(items));
	return (
		<div className={classes.view}>
		   <Button
                      className={classes.button}
                      aria-owns={this.state.anchor ? 'keys-menu' : undefined}
                      aria-haspopup="true"
                      onClick={this.onClick}
	              title={"Path keys"}
		    >
	  	       {<PathIcon state={state}/>}
                     </Button>
		     <Menu
                        id="keys-menu"
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

CollectPathMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CollectPathMenu);
