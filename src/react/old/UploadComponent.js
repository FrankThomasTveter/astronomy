import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
    load: {
	width: '100%',
    },
    button: {},
});

class Load extends Component {
    constructor() {
        super();
	this.state={anchor:null};
    }; 
    render() {
	const { classes, state, icon, title } = this.props;
	let fileReader;
	const handleFileRead = (e) => {
	    const content = fileReader.result;
	    state.Default.resetSetup(state,content);
	}
	const handleFileChosen = (target) => {
	    let file=target.files[0];
	    state.Html.broadcast(state,"Uploading "+file.name);
	    fileReader = new FileReader();
	    fileReader.onloadend = handleFileRead;
	    fileReader.readAsText(file);
	    state.Default.path=file;
	}
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

Load.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Load);
