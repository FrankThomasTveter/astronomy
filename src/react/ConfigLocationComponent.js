import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import LocationIcon from '@material-ui/icons/Public';

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
class ConfigLocation extends Component {
    render() {
        const { classes, state, visible, onClose } = this.props;
	if ( visible !== undefined && ! visible && state.Settings.isInvisible(state,"Location")) {
	    return null;
	} else if (visible !== undefined) {
	    var cls={button:classes.button};
 	    this.onClick = event => {state.Astro.toggle(state,"location");};
	    var classname;
	    if (state.Astro.show(state,"location")) {
		classname=classes.button;
	    } else {
		classname=classes.buttonInvisible;
	    };
	    return (<div className={classes.buttonWrapper}>
		    <Button
                    className={classname}
                    onClick={this.onClick}
	            title={"Show Location Config"}
		    >
	  	    {<LocationIcon state={state}/>}
                    </Button>
		    </div>
		   );
	} else {
	    var onclick = () => {state.Settings.toggle(state,"Location");};
	    var title="Toggle Show Location Config";
	    if (state.Settings.isInvisible(state,"Location")) {
		return <Button key="location" className={classes.buttonInvisible} onClick={onclick} title={title}><LocationIcon/></Button>;
	    } else {
		return <Button key="location" className={classes.button} onClick={onclick} title={title}><LocationIcon/></Button>;
	    }
	}
    }
}

ConfigLocation.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ConfigLocation);
