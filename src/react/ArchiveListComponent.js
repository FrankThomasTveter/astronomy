import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
//import ArchiveIcon from '@material-ui/icons/VpnArchive';
import ArchiveIcon from '@material-ui/icons/Storage';
import Archive     from './ArchiveComponent';

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

function renderMenuItem(classes,state,item,index) {
    if (item[0]==="" || item[0] === null || item[0]===undefined) {
	return null;
    } else {
	//console.log("Archive:",JSON.stringify(item),JSON.stringify(index));
	return (<MenuItem key={item[0]}>
		  <Archive state={state} item={item[0]}  index={item[1]} active={item[2]} title={item[3]}/> 
		</MenuItem>);
    }
}
class ArchiveMenu extends Component {
    state={anchor:null};
    render() {
	//console.log("Rendering ArchiveComponents...");
        const { classes, state } = this.props;
	//console.log("Archives.starting:",JSON.stringify(state.Path.other));
 	this.onClick = event => {
	    this.setState({ anchor: event.currentTarget });
	};
 	this.onClose = () => {
	    this.setState({ anchor: null });
	};

	// get available DTG....
	var title=state.Database.getIndexTitle(state);
	var items=[["Latest",undefined, state.Database.indexDtg===undefined,title]];
	var dtgs=state.Database.getDtgs(state);
	var lend=dtgs.length;
	for (var ii=0;ii<lend;ii++) {
	    var dtg=dtgs[ii];
	    title=state.Database.getIndexTitle(state,dtg);
	    items.push([dtg,dtg,state.Database.indexDtg===dtg,title]);
	}
	var mapFunction= (item,index)=>renderMenuItem(classes,state,item,index);
	//console.log("Archives.rendering:",JSON.stringify(state.Path.other));
	//console.log("Archives.rendering",items.length,JSON.stringify(anchor),Boolean(anchor));
	title="Archived database files.";
	return (
		<div className={classes.view}>
		<Button
                 className={classes.button}
                 aria-owns={this.state.anchor ? 'archive-menu' : undefined}
                 aria-haspopup="true"
                 onClick={this.onClick}
	         title={title}
		>
	  	 {<ArchiveIcon state={state}/>}
                </Button>
		<Menu
                id="archive-menu"
	         anchorEl={this.state.anchor}
                open={Boolean(this.state.anchor)}
                onClose={this.onClose}
		>
		 {items.map(mapFunction)}
	        </Menu>
		</div>
	);
    };
}

ArchiveMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};




export default withStyles(styles)(ArchiveMenu);
