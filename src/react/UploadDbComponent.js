import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
    button:{},
    loadDb: {
	width: '100%',
    }
});

class LoadDb extends Component {
    constructor(props) {
	super(props);
	this.state={anchor:null};
	this.loaded="";
    };
    render() {
	const { classes, state, append, icon, title } = this.props;
	let fileReader;
	const handleFileRead = (e) => {
	    const content = fileReader.result;
	    state.Database.setLoaded(state,this.loaded);
	    state.Database.setAppend(state,append);
	    state.Database.resetDb(state,content);
	    // resetDb will reset append to false...
	};
	const handleFileChosen = (target) => {
	    let file=target.files[0];
	    state.Html.broadcast(state,"Uploading "+file.name);
	    //console.log("File:",file.name);
	    this.loaded=file.name;
	    fileReader = new FileReader();;
	    fileReader.onloadend = handleFileRead;
	    fileReader.readAsText(file);
	};
 	this.onClick = event => {this.setState({ anchor: event.currentTarget });};
	this.onClose = () => {this.setState({ anchor: null });};
	return (
		<div className={classes.load}>
                   <Button
                      className={classes.button}
                      aria-owns={this.state.anchor ? 'keys-menu' : undefined}
                      aria-haspopup="true"
                      onClick={this.onClick}
                      title={title}
                    >
                       {icon}
                     </Button>
                     <Menu
                        id="keys-menu"
                        anchorEl={this.state.anchor}
                        open={Boolean(this.state.anchor)}
                        onClose={this.onClose}
                     >	    
		        <MenuItem key="input">
   	  	           <input type='file' id='file'
	                    onChange={e=>handleFileChosen(e.target)}
	                    onClick={e=> {e.target.value = null}}/>
		        </MenuItem>
                     </Menu>
                </div>		
	);
    }
}

LoadDb.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoadDb);
