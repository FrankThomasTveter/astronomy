import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import SettingsIcon from '@material-ui/icons/Settings';

import Reload       from './ConfigReloadComponent';
import Home         from './ConfigHomeComponent';
import Undo         from './ConfigUndoComponent';
import Redo         from './ConfigRedoComponent';
import Mode         from './ConfigModeComponent';
import ViewPath     from './ConfigViewPathComponent';
import Collect      from './ConfigCollectComponent';
import Tooltip      from './ConfigTooltipComponent';
import Order        from './ConfigOrderComponent';
import Film         from './ConfigFilmComponent';
import Star         from './ConfigStarComponent';
import Setup        from './ConfigSetupComponent';
import ViewPolygon  from './ConfigViewPolygonComponent';
import Polygon      from './ConfigPolygonComponent';
import Archive      from './ConfigArchiveComponent';
import ViewOld      from './ConfigViewOldDataComponent';
import Font         from './ConfigFontComponent';
import Dims         from './ConfigDimComponent';
import Levs         from './ConfigLevComponent';
import Focus        from './ConfigFocusComponent';
import FullScreen   from './ConfigFullScreenComponent';
import SettingsMenu from './SettingsMenuComponent';
import Notification from './ConfigNotificationComponent';
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
		    <MenuItem key="reload" onClose={this.onClose}>
		       <Reload state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="Home" onClose={this.onClose}>
		       <Home state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="undo" onClose={this.onClose}>
		       <Undo state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="redo" onClose={this.onClose}>
		       <Redo state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="mode" onClose={this.onClose}>
		       <Mode state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="viewPath" onClose={this.onClose}>
		       <ViewPath state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="key" onClose={this.onClose}>
		       <Collect state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="Tooltip" onClose={this.onClose}>
		       <Tooltip state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="Order" onClose={this.onClose}>
		       <Order state={state} classes={cls} visible={true}/>
		    </MenuItem>
                    <MenuItem key="Film" onClose={this.onClose}>
		       <Film state={state} classes={cls} visible={true}/>
		    </MenuItem>
                    <MenuItem key="Star" onClose={this.onClose}>
		       <Star state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="file" onClose={this.onClose}>
		       <Setup state={state} classes={cls} visible={true} onClose={this.onClose}/>
		    </MenuItem>
		    <MenuItem key="viewPolygon" onClose={this.onClose}>
		       <ViewPolygon state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="polygon" onClose={this.onClose}>
		       <Polygon state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="archive" onClose={this.onClose}>
		       <Archive state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="viewold" onClose={this.onClose}>
		       <ViewOld state={state} classes={cls} visible={true}/>
		    </MenuItem>
                    <MenuItem key="font" onClose={this.onClose}>
		       <Font state={state} classes={cls} visible={true}/>
		    </MenuItem>
                    <MenuItem key="dims" onClose={this.onClose}>
		       <Dims state={state} classes={cls} visible={true}/>
		    </MenuItem>
                    <MenuItem key="levs" onClose={this.onClose}>
		       <Levs state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="focus" onClose={this.onClose}>
		       <Focus state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="fullscreen" onClose={this.onClose}>
		       <FullScreen state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="set" onClose={this.onClose}>
		       <SettingsMenu state={state} classes={cls} visible={true}/>
		    </MenuItem>
		    <MenuItem key="notification" onClose={this.onClose}>
		        <Notification state={state} classes={cls} visible={true}/>
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
