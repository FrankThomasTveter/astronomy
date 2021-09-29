import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Time         from './ConfigTimeComponent';
import Location     from './ConfigLocationComponent';
import Criteria     from './ConfigCriteriaComponent';
import Events       from './ConfigEventsComponent';
import FullScreen   from './ConfigFullScreenComponent';
import About        from './ConfigAboutComponent';

import SettingsIcon from '@material-ui/icons/Visibility';

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
// 
class SettingsMenu extends Component {
    show(state) {
	//console.log("Called Config.show...");
	this.forceUpdate();
    };
    state={anchor:null};
    

    render() {
        const { classes, state } = this.props;
	this.onClick = event => {this.setState({ anchor: event.currentTarget });};
	this.onClose = () => {this.setState({ anchor: null });};
	var cls={button:classes.button};
	return (<div className={classes.tableOrder}>
		   <Button
                      className={classes.button}
                      aria-owns={this.state.anchor ? 'tablecollects-menu' : undefined}
                      aria-haspopup="true"
                      onClick={this.onClick}
	              title={"Visible options"}
		   >
	  	       {<SettingsIcon state={state}/>}
                     </Button>
		     <Menu
	                className={classes.tableOrder}
                        id="tablecollects-menu"
	                anchorEl={this.state.anchor}
                        open={Boolean(this.state.anchor)}
                        onClose={this.onClose}
		     >
		    <MenuItem className={classes.order} key="time" onClose={this.onClose}>
		       <Time state={state} classes={cls}/>
		    </MenuItem>
		    <MenuItem className={classes.order} key="location" onClose={this.onClose}>
		       <Location state={state} classes={cls}/>
		    </MenuItem>
		    <MenuItem className={classes.order} key="criteria" onClose={this.onClose}>
		       <Criteria state={state} classes={cls}/>
		    </MenuItem>
		    <MenuItem className={classes.order} key="events" onClose={this.onClose}>
		       <Events state={state} classes={cls}/>
		    </MenuItem>
		    <MenuItem className={classes.order} key="fullscreen" onClose={this.onClose}>
		       <FullScreen state={state} classes={cls}/>
		    </MenuItem>
		    <MenuItem className={classes.order} key="about" onClose={this.onClose}>
		       <About state={state} classes={cls}/>
		    </MenuItem>
	             </Menu>
		</div>
	);
    }
}

SettingsMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SettingsMenu);
