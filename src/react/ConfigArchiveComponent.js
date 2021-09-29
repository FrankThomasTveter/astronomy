import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
//import ArchiveIcon from '@material-ui/icons/VpnArchive';
import ArchiveIcon from '@material-ui/icons/Storage';
import Fragment   from './FragmentListComponent';
import Archive    from './ArchiveListComponent';
import Upload     from './UploadDbComponent';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import UploadIcon from '@material-ui/icons/CloudUpload';
import SelectedIcon from '@material-ui/icons/CloudDone';
import AppendIcon from '@material-ui/icons/PlaylistAdd';
import ReplaceIcon from '@material-ui/icons/PlaylistAddCheck';

const styles = theme => ({
    settings:{},
    order: {
	display: 'inline-block',
        marginRight: 'auto',
	height:'100%',
    },
    tableOrder: {
	display: 'inline-block',
        marginRight: 'auto',
    },
    config: {
        marginLeft: 'auto',
    },
    button:{
	color:'white'
    },
    buttonInvisible:{
	color:'gray'
    },
});

function Append(props) {
    const {classes,append,onclick}=props; //state,
    var title="Toggle append or replace";
    if (append) {
	return <Button className={classes.button} onClick={onclick} title={title}><AppendIcon/></Button>;
    } else {
	return <Button className={classes.button} onClick={onclick} title={title}><ReplaceIcon/></Button>;
    };
};
function Download(props) {
    const {state,classes}=props;
    var onclick=() => {state.Database.saveDb(state);};
    var title="Download database";
    return <Button className={classes.button} onClick={onclick} title={title}><DownloadIcon/></Button>;
};
function Selected(props) {
    const {state,classes}=props;
    var onclick=() => {state.Database.saveSelectedDb(state);};
    var title="Download database subset";
    return <Button className={classes.button} onClick={onclick} title={title}><SelectedIcon/></Button>;
};
class ArchiveMenu extends Component {
    state={anchor:null, append:false};
    render() {
	//console.log("Rendering ArchiveComponents...");
        const { classes, state, visible } = this.props;
	//console.log("Archives.starting:",JSON.stringify(state.Path.other));
	var title;
	//console.log("Archive visible:",visible);
	if (visible !== undefined && ! visible && state.Settings.isInvisible(state,"Archive")) {
	    return null;
	} else if (visible !== undefined) {
 	    this.onClick = event => {this.setState({ anchor: event.currentTarget });};
 	    this.onClose = () => {this.setState({ anchor: null });};
 	    this.onAppend = event => {this.setState({ append: ! this.state.append });};
	    //console.log("Archives.rendering:",JSON.stringify(state.Path.other));
	    //console.log("Archives.rendering",items.length,JSON.stringify(anchor),Boolean(anchor));
	    title="Available database files.";
	    var cls={button:classes.button};
	    //classes.view
	    return (
		    <div className={classes.tableOrder} key={"archive"}>
		   <Button
                      className={classes.button}
                      aria-owns={this.state.anchor ? 'archiveconfig-menu' : undefined}
                      aria-haspopup="true"
                      onClick={this.onClick}
	              title={title}
		    >
	  	       {<ArchiveIcon state={state}/>}
                     </Button>
		      <Menu
                         id="archiveconfig-menu"
	                 anchorEl={this.state.anchor}
                         open={Boolean(this.state.anchor)}
                         onClose={this.onClose}
		      >
		       <MenuItem className={classes.order} key="fragment" onClose={this.onClose}>
		           <Fragment state={state} classes={classes}/>
		       </MenuItem>
		       <MenuItem className={classes.order} key="append" onClose={this.onClose}>
		           <Append state={state} classes={classes} append={this.state.append} onclick={this.onAppend}/>
		       </MenuItem>
		       <MenuItem className={classes.order} key="upload" onClose={this.onClose}>
		    <Upload classes={{button:classes.button}} state={state} append={this.state.append} icon={<UploadIcon/>} title={"Upload data"}/>
		       </MenuItem>
		       <MenuItem className={classes.order} key="download" onClose={this.onClose}>
		           <Download state={state} classes={cls}/>
		       </MenuItem>
 	               <MenuItem className={classes.order} key="selected" onClose={this.onClose}>
		           <Selected state={state} classes={cls}/>
		       </MenuItem>
		       <MenuItem className={classes.order} key="archive" onClose={this.onClose}>
		           <Archive state={state} classes={classes}/>
		        </MenuItem>
	              </Menu>
		</div>
	    );
	} else {
	    var onclick=() => {state.Settings.toggle(state,"Archive");};
	    title="Show Archive";
	    if (state.Settings.isInvisible(state,"Archive")) {
		return <Button key="archive" className={classes.buttonInvisible} onClick={onclick} title={title}><ArchiveIcon/></Button>;
	    } else {
		return <Button key="archive" className={classes.button} onClick={onclick} title={title}><ArchiveIcon/></Button>;
	    };
	};
    }
}


ArchiveMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ArchiveMenu);
