import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {black_palette} from '../mui/metMuiThemes';  // teal_palette

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
import Notification from './ConfigNotificationComponent';
import About        from './ConfigAboutComponent';
import QRCode       from './ConfigQRComponent';

import Settings from './SettingsComponent';

//	justifyContent: 'flex-end',
const styles = theme => ({
    horisontal: {
        marginLeft: 'auto',
	alignItems:'center',
	display: 'flex',
	justifyContent: 'center',
    },
    button: {
	backgroundColor:black_palette.main,
	color:'white',
	"&$buttonDisabled": {
            color: theme.palette.primary.main,
	},
    },
    buttonInvisible:{},
    buttonDisabled: {},
});

class Config extends Component {
    constructor(props) {
        super(props);
        const {state} = props;
        state.React.Config=this;
    };
    show(state) {
	//console.log("Called Config.show...");
	this.forceUpdate();
    };
    render() {
        const { classes, state } = this.props;
	//console.log("Rendering Config...");
	var cls={button:classes.button};
	return (<div className={classes.horisontal}>
		<Reload state={state} classes={cls} visible={false}/>
		<Home state={state} classes={cls} visible={false}/>
		<Undo state={state} classes={classes} visible={false}/>
                <Redo state={state} classes={classes} visible={false}/>
		<Mode state={state} classes={cls} visible={false}/>
		<ViewPath state={state} classes={cls} visible={false}/>
		<Collect state={state} classes={cls} visible={false}/>
		<Tooltip state={state} classes={cls} visible={false}/>
		<Order state={state} classes={cls} visible={false}/>
		<Film state={state} classes={cls} visible={false}/>
		<Star state={state} classes={cls} visible={false}/>
		<Setup state={state} classes={cls} visible={false}/>
		<ViewPolygon state={state} classes={cls} visible={false}/>
		<Polygon state={state} classes={cls} visible={false}/>
		<Archive state={state} classes={cls} visible={false}/>
		<ViewOld state={state} classes={cls} visible={false}/>
		<Font state={state} classes={cls} visible={false}/>
		<Dims state={state} classes={cls} visible={false}/>
		<Levs state={state} classes={cls} visible={false}/>
		<Focus state={state} classes={cls} visible={false}/>
		<FullScreen state={state} classes={cls} visible={false}/>
		<Notification state={state} classes={cls} visible={false}/>
		<About state={state} classes={cls} visible={false}/>
	        <QRCode state={state} classes={cls} visible={false}/>
                <Settings state={state} classes={cls} visible={false}/>
		</div>);
    }
}

Config.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Config);



