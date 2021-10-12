import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import TooltipIcon from '@material-ui/icons/Help';
import ClickTooltipIcon from '@material-ui/icons/HelpOutline';
import NoTooltipIcon from '@material-ui/icons/HighlightOff';

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
function TooltipIconMode (props) {
    const {state} = props;
    //console.log("ConfigTooltipComponent:",state.Layout.state.tooltip);
    if (state.Layout.state.tooltip===0) {
	return (<NoTooltipIcon/>);
    } else if (state.Layout.state.tooltip===2) {
	return (<ClickTooltipIcon/>);
    } else {
	return (<TooltipIcon/>);
    }
};
class Tooltip extends Component {
    render() {
	const {classes, state, visible}=this.props;
	var onclick, title;
	if (visible !== undefined && ! visible && state.Settings.isInvisible(state,"Tooltip")) {
	    return null;
	} else if (visible !== undefined) {
	    onclick = (event) => state.Layout.toggleTooltip(state);
	    title="Show tooltip";
	    return (
		<div className={classes.view}>
		   <Button
                      className={classes.button}
                      onClick={onclick}
	              title={title}
		    >
	  	       {<TooltipIconMode state={state}/>}
                    </Button>
		</div>
	    );
	} else {
	    title="Show Tooltip";
	    onclick = (event) => state.Settings.toggle(state,"Tooltip");
	    if (state.Settings.isInvisible(state,"Tooltip")) {
		return <Button key="tooltip" className={classes.buttonInvisible} onClick={onclick} title={title}><TooltipIconMode state={state}/></Button>;
	    } else {
		return <Button key="tooltip" className={classes.button} onClick={onclick} title={title}><TooltipIconMode state={state}/></Button>;
	    };
	};
    }
}

Tooltip.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Tooltip);
