import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
//import FragmentIcon from '@material-ui/icons/VpnFragment';
import FragmentIcon from '@material-ui/icons/Filter';
import Fragment from './FragmentCheckboxTree';
import ReloadIcon from '@material-ui/icons/Autorenew';

//import TreeView from 'material-ui-treeview/TreeView';
//import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
//import ChevronRightIcon from '@material-ui/icons/ChevronRight';
//import TreeItem from 'material-ui-treeview/TreeItem';

const styles = theme => ({
    settings:{},
    order:{},
    tableOrder:{},
    buttonInvisible:{},
    config: {
        marginLeft: 'auto',
    },
    button:{
	color:'white'
    },
});

class FragmentMenu extends Component {
    state={anchor:null};
    render() {
	//console.log("Rendering FragmentComponents...");
        const { classes, state } = this.props;
	//console.log("Fragments.starting:",JSON.stringify(state.Path.other));
 	this.onClick = event => {
	    this.setState({ anchor: event.currentTarget });
	};
 	this.onClose = () => {
	    this.setState({ anchor: null });
	};
	// 
	this.onLoad = () => {
	    console.log("Reloading fragments...");
	    state.Database.loadDataFragments(state,undefined,undefined,"verbose");}
	;
	this.force = () => {
	    this.forceUpdate();
	};
	// get available DTG....
	this.items=state.Database.getFragmentList(state);
	var title="Select fragments.";
	return (
		<div className={classes.view} key={"frag"}>
		<Button
                  className={classes.button}
                  aria-owns={this.state.anchor ? 'fragment-menu' : undefined}
                  aria-haspopup="true"
                  onClick={this.onClick}
	          title={title}
		>
	  	 {<FragmentIcon state={state}/>}
               </Button>
		<Menu
                id="fragment-menu"
	        anchorEl={this.state.anchor}
                open={Boolean(this.state.anchor)}
                onClose={this.onClose}
		>
		   <MenuItem key={"fragment"}>
		      <Fragment classes={classes} state={state}
	                 items={this.items} force={this.force}/>
		   </MenuItem>
		   <MenuItem key={"load"}>
		      <Button className={classes.button}
             	         onClick={this.onLoad}>
		         <ReloadIcon state={state}/>
		      </Button>
		   </MenuItem>
		</Menu>
	        </div>
	);
    };
};

FragmentMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FragmentMenu);
