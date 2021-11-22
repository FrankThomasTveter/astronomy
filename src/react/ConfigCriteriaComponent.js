import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CriteriaIcon from '@material-ui/icons/CheckBox';

//import Popup from 'react-popup';
//import './react-popup.css';

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
class ConfigCriteria extends Component {
    render() {
        const { classes, state, visible } = this.props; // , onClose
	if ( visible !== undefined && ! visible && state.Settings.isInvisible(state,"Criteria")) {
	    return null;
	} else if (visible !== undefined) {
	    //var cls={button:classes.button};
 	    this.onClick = event => {state.Events.toggle(state,"criteria");};
	    var classname;
	    if (state.Events.show(state,"criteria")) {
		classname=classes.button;
	    } else {
		classname=classes.buttonInvisible;
	    };
	    return (<div className={classes.buttonWrapper}>
		    <Button
                    className={classname}
                    onClick={this.onClick}
	            title={"Show Criteria Config"}
		    >
	  	    {<CriteriaIcon state={state}/>}
                    </Button>
		    </div>
		   );
	} else {
	    var onclick = () => {state.Settings.toggle(state,"Criteria");};
	    var title="Toggle Show Criteria Config";
	    if (state.Settings.isInvisible(state,"Criteria")) {
		return <Button key="criteria" className={classes.buttonInvisible} onClick={onclick} title={title}><CriteriaIcon/></Button>;
	    } else {
		return <Button key="criteria" className={classes.button} onClick={onclick} title={title}><CriteriaIcon/></Button>;
	    }
	}
    }
}

ConfigCriteria.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ConfigCriteria);
