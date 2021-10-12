import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import ViewPathIcon from '@material-ui/icons/Explore';
import NoViewPathIcon from '@material-ui/icons/ExploreOff';
//import ViewPathIcon from '@material-ui/icons/Visibility';
//import NoViewPathIcon from '@material-ui/icons/VisibilityOff';

const styles = theme => ({
    button:{
	color:'white'
    },
    buttonInvisible:{
	color:'gray'
    },
});
function ViewPathIconMode (props) {
    const {state} = props;
    var mode=state.Layout.state.viewMode;
    if (mode === state.Layout.modes.view.path) {
	return (<ViewPathIcon/>);
    } else {
	return (<NoViewPathIcon/>);
    }
};
class View extends Component {
    render() {
	const {classes, state, visible}=this.props;
	var onclick, title;
	if (visible !== undefined && ! visible && state.Settings.isInvisible(state,"ViewPath")) {
	    return null;
	} else if (visible !== undefined) {
	    onclick= () => state.Layout.toggleView(state);
	    title="Show path";
	    return (<div className={classes.view}>
		<Button
	           className={classes.button}
                   onClick={onclick}
	           title={title}
		 >
	  	    {<ViewPathIconMode state={state}/>}
                 </Button>
		    </div>);
	} else {
	    onclick=() => {state.Settings.toggle(state,"ViewPath");};
	    title="Show View";
	    if (state.Settings.isInvisible(state,"ViewPath")) {
		return  (<div className={classes.view}>
			 <Button
			className={classes.buttonInvisible}
			onClick={onclick}
			title={title}
			>
	  		{<ViewPathIconMode state={state}/>}
			</Button>
		       </div>);
	    } else {
		return  (<div className={classes.view}>
			 <Button
			className={classes.button}
			onClick={onclick}
			title={title}
			>
	  		{<ViewPathIconMode state={state}/>}
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
