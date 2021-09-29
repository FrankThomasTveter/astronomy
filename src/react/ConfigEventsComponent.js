import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import EventsIcon from '@material-ui/icons/ViewList';

import Popup from 'react-popup';
import './react-popup.css';

const styles = theme => ({
    file: {
	display: 'inline-block',
        marginRight: 'auto',
	height:'100%',
    },
    tableFile: {
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
class ConfigEvents extends Component {
    render() {
        const { classes, state, visible, onClose } = this.props;
	if ( visible !== undefined && ! visible && state.Settings.isInvisible(state,"Events")) {
	    return null;
	} else if (visible !== undefined) {
	    var cls={button:classes.button};
 	    this.onClick = event => {console.log("Launch events...");};
	    return (<div className={classes.tableFile}>
		    <Button
                    className={classes.button}
                    onClick={this.onClick}
	            title={"Show Events Config"}
		    >
	  	    {<EventsIcon state={state}/>}
                    </Button>
		    </div>
		   );
	} else {
	    var onclick = () => {state.Settings.toggle(state,"Events");};
	    var title="Toggle Show Events Config";
	    if (state.Settings.isInvisible(state,"Events")) {
		return <Button key="events" className={classes.buttonInvisible} onClick={onclick} title={title}><EventsIcon/></Button>;
	    } else {
		return <Button key="events" className={classes.button} onClick={onclick} title={title}><EventsIcon/></Button>;
	    }
	}
    }
}

ConfigEvents.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ConfigEvents);
