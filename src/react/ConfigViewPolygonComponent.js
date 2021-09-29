import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import ViewPolygonIcon from '@material-ui/icons/InvertColors';
import NoViewPolygonIcon from '@material-ui/icons/InvertColorsOff';
//import ViewPolygonIcon from '@material-ui/icons/Visibility';
//import NoViewPolygonIcon from '@material-ui/icons/VisibilityOff';

const styles = theme => ({
    button:{
	color:'white'
    },
    buttonInvisible:{
	color:'gray'
    },
});
function ViewPolygonIconMode (props) {
    const {state} = props;
    var active=state.Polygon.active;
    if (active) {
	return (<ViewPolygonIcon/>);
    } else {
	return (<NoViewPolygonIcon/>);
    }
};
class View extends Component {
    render() {
	const {classes, state, visible}=this.props;
	var onclick, title;
	if (visible !== undefined && ! visible && state.Settings.isInvisible(state,"ViewPolygon")) {
	    return null;
	} else if (visible !== undefined) {
	    onclick= () => state.Polygon.togglePolygon(state);
	    title="Show polygon";
	    return (<div className={classes.view}>
		<Button
	           className={classes.button}
                   onClick={onclick}
	           title={title}
		 >
	  	    {<ViewPolygonIconMode state={state}/>}
                 </Button>
	    </div>);
	} else {
	    onclick=() => {state.Settings.toggle(state,"ViewPolygon");};
	    title="Show View";
	    if (state.Settings.isInvisible(state,"ViewPolygon")) {
		return (<div className={classes.view}>
			<Button
			className={classes.buttonInvisible}
			onClick={onclick}
			title={title}
			>
	  		{<ViewPolygonIconMode state={state}/>}
			</Button>
		       </div>);
	    } else {
		return (<div className={classes.view}>
			<Button
			className={classes.button}
			onClick={onclick}
			title={title}
			>
	  		{<ViewPolygonIconMode state={state}/>}
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
