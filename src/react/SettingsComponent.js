import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import SettingsIcon from '@material-ui/icons/Settings';

import Time         from './ConfigTimeComponent';
import Location     from './ConfigLocationComponent';
import Criteria     from './ConfigCriteriaComponent';
import Events       from './ConfigEventsComponent';
import FullScreen   from './ConfigFullScreenComponent';
import SettingsMenu from './SettingsMenuComponent';
import About        from './ConfigAboutComponent';
import QRCode       from './ConfigQRComponent';

const styles = theme => ({
    tableOrder: {
	display: 'inline-block',
        marginRight: 'auto',
    },
    settings: {
        marginRight: 'auto',
	color:'red',
    },
    button:{color:'white'},
});

class Settings extends Component {
    constructor(props) {
        super(props);
        const {state} = props;
        state.React.Settings=this;
    };
    show(state) {
	//console.log("Called Config.show...");
	this.forceUpdate();
    };
    state = {anchor: null,};
    render() {
        const { state,classes } = this.props;
	//console.log("Rendering Settings...",JSON.stringify(state.Path.other));
	this.onClose = () => {this.setState({ anchor: null });};
	this.onClick = (event) => {this.setState({ anchor: event.currentTarget });};
	var cls={button:classes.button};
	//		<Menu   settings={{float:'right'}}
	return (<div className={classes.tableOrder}>
		  <Button
		    className={classes.button}
                    aria-owns={this.state.anchor ? 'settings-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.onClick}
		    title={"Settings"}
		   >
		   {<SettingsIcon />}
                  </Button>
	        <Menu
		   className={classes.tableOrder}
                   id="settings-menu"
	           anchorEl={this.state.anchor}
                   open={Boolean(this.state.anchor)}
                   onClose={this.onClose}
	          >
		    <MenuItem key="time" onClose={this.onClose}>
		       <Time state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="location" onClose={this.onClose}>
		       <Location state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="criteria" onClose={this.onClose}>
		       <Criteria state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="events" onClose={this.onClose}>
		       <Events state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="fullscreen" onClose={this.onClose}>
		       <FullScreen state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="settings" onClose={this.onClose}>
		       <SettingsMenu state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="about" onClose={this.onClose}>
		        <About state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="qr" onClose={this.onClose}>
		       <QRCode state={state} classes={cls} visible={true}/>
		    </MenuItem>
		</Menu>
		</div>
	       );
    }
}

Settings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Settings);
