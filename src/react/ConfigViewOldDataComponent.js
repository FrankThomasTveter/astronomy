import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import ViewOldDataIcon from '@material-ui/icons/Timer';
import NoViewOldDataIcon from '@material-ui/icons/TimerOff';

const styles = theme => ({
    button:{
	color:'white'
    },
    buttonInvisible:{
	color:'gray'
    },
});
function ViewOldDataIconMode (props) {
    const {state} = props;
    if (state.Database.viewOldData) {
	return (<ViewOldDataIcon/>);
    } else {
	return (<NoViewOldDataIcon/>);
    }
};
class View extends Component {
    render() {
	const {classes, state, visible}=this.props;
	var onclick, title;
	if (visible !== undefined && ! visible && state.Settings.isInvisible(state,"ViewOldData")) {
	    return null;
	} else if (visible !== undefined) {
	    onclick= () => state.Database.toggleDisplayOld(state);
	    title="Show old data";
	    return (<div className={classes.view}>
		<Button
	           className={classes.button}
                   onClick={onclick}
	           title={title}
		 >
	  	    {<ViewOldDataIconMode state={state}/>}
                 </Button>
	    </div>);
	} else {
	    onclick=() => {state.Settings.toggle(state,"ViewOldData");};
	    title="Show View";
	    if (state.Settings.isInvisible(state,"ViewOldData")) {
		return (<div className={classes.view}>
			<Button
			className={classes.buttonInvisible}
			onClick={onclick}
			title={title}
			>
	  		{<ViewOldDataIconMode state={state}/>}
			</Button>
		       </div>);
	    } else {
		return (<div className={classes.view}>
			<Button
			className={classes.button}
			onClick={onclick}
			title={title}
			>
	  		{<ViewOldDataIconMode state={state}/>}
			</Button>
		       </div>);
	    }
	}
    }
}

View.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(View);
