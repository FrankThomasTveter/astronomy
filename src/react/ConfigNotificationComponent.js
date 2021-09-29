import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import NoNotificationIcon from '@material-ui/icons/NotificationsNone';
import LoadNotificationIcon from '@material-ui/icons/Notifications';
import LevelNotificationIcon from '@material-ui/icons/NotificationImportant';

const styles = theme => ({
    view: {
        marginLeft: 'title',
    },
    button:{
	color:'white'
    },
    buttonInvisible:{
	color:'gray'
    },
});
function NotificationIconMode (props) {
    const {state} = props;
    //console.log("ConfigNotificationComponent:",state.Layout.state.notification);
    var mode=state.Database.getNotificationMode(state);
    if (mode===0) {
	return (<NoNotificationIcon/>);
    } else if (mode===1) {
	return (<LoadNotificationIcon/>);
    } else if (mode===2) {
	return (<LevelNotificationIcon/>);
    } else {
	return (<NoNotificationIcon/>);
    }
};
class Notification extends Component {
    render() {
	const {classes, state, visible}=this.props;
	var onclick, title;
	if (visible !== undefined && ! visible && state.Settings.isInvisible(state,"Notification")) {
	    return null;
	} else if (visible !== undefined) {
	    onclick = (event) => state.Database.toggleNotification(state);
	    title="Show notification";
	    return (
		<div className={classes.view}>
		   <Button
                      className={classes.button}
                      onClick={onclick}
	              title={title}
		    >
	  	       {<NotificationIconMode state={state}/>}
                    </Button>
		</div>
	    );
	} else {
	    title="Show Notification";
	    onclick = (event) => state.Settings.toggle(state,"Notification");
	    if (state.Settings.isInvisible(state,"Notification")) {
		return <Button key="notification" className={classes.buttonInvisible} onClick={onclick} title={title}><NotificationIconMode state={state}/></Button>;
	    } else {
		return <Button key="notification" className={classes.button} onClick={onclick} title={title}><NotificationIconMode state={state}/></Button>;
	    };
	};
    }
}

Notification.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Notification);
