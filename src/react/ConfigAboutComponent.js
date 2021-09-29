import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import About         from './AboutComponent';

import InfoIcon from '@material-ui/icons/Info';

const styles = theme => ({
    order: {
	display: 'inline-block',
        marginRight: 'auto',
	height:'100%',
    },
    tableOrder: {
	display: 'inline-block',
        marginRight: 'auto',
    },
    button:{
	color:'white'
    },
    buttonInvisible:{
	color:'gray'
    },
});

class AboutMenu extends Component {
    show(state) {
	//console.log("Called Config.show...");
	this.forceUpdate();
    };
    state={anchor:null};
    render() {
        const { classes, state,visible } = this.props;
	var onclick, title;
	if (visible !== undefined && ! visible && state.Settings.isInvisible(state,"About")) {
	    return null;
	} else if (visible !== undefined) {
	    this.onClick = event => {this.setState({ anchor: event.currentTarget });};
	    this.onClose = () => {this.setState({ anchor: null });};
	    title="About";
	    var cls={button:classes.button};
	    return (<div className={classes.tableOrder}>
		   <Button
                      className={classes.button}
                      aria-owns={this.state.anchor ? 'tablecollects-menu' : undefined}
                      aria-haspopup="true"
                      onClick={this.onClick}
	              title={title}
		   >
	  	       {<InfoIcon state={state}/>}
                     </Button>
		     <Menu
	                className={classes.tableOrder}
                        id="tablecollects-menu"
	                anchorEl={this.state.anchor}
                        open={Boolean(this.state.anchor)}
                        onClose={this.onClose}
		     >
		    <MenuItem className={classes.order} key="auto" onClose={this.onClose}>
		       <About state={state} classes={cls}/>
		    </MenuItem>
	             </Menu>
		</div>
		   );
	} else {
	    onclick=() => {state.Settings.toggle(state,"About");};
	    title="Show about";
	    if (state.Settings.isInvisible(state,"About")) {
		return <Button key="about" className={classes.buttonInvisible} onClick={onclick} title={title}><InfoIcon/></Button>;
	    } else {
		return <Button key="about" className={classes.button} onClick={onclick} title={title}><InfoIcon/></Button>;
	    };
	};
    }
}

AboutMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AboutMenu);
