import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TimeIcon from '@material-ui/icons/Timer';

import Popup from 'react-popup';
import './react-popup.css';

const styles = theme => ({
    buttonWrapper: {
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
class ConfigTime extends Component {
    render() {
        const { classes, state, visible, onClose } = this.props;
	if ( visible !== undefined && ! visible && state.Settings.isInvisible(state,"Time")) {
	    return null;
	} else if (visible !== undefined) {
	    var cls={button:classes.button};
 	    this.onClick = event => {state.Astro.toggle(state,"time");};
	    var classname;
	    if (state.Astro.show(state,"time")) {
		classname=classes.button;
	    } else {
		classname=classes.buttonInvisible;
	    };
	    return (<div className={classes.buttonWrapper}>
		    <Button
                    className={classname}
                    onClick={this.onClick}
	            title={"Show Time Config"}
		    >
	  	    {<TimeIcon state={state} style={{strokeWidth:0}}/>}
                    </Button>
		    </div>
		   );
	} else {
	    var onclick = () => {state.Settings.toggle(state,"Time");};
	    var title="Toggle Show Time Config";
	    if (state.Settings.isInvisible(state,"Time")) {
		return <Button key="time" className={classes.buttonInvisible} onClick={onclick} title={title}><TimeIcon/></Button>;
	    } else {
		return <Button key="time" className={classes.button} onClick={onclick} title={title}><TimeIcon/></Button>;
	    }
	}
    }
}

ConfigTime.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ConfigTime);
