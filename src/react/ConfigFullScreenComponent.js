import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import FullscreenIcon from '@material-ui/icons/Fullscreen';
import NoFullscreenIcon from '@material-ui/icons/FullscreenExit';

const styles = theme => ({
    button:{
	color:'white'
    },
    buttonInvisible:{
	color:'gray'
    },
});
function FullscreenIconMode (props) {
    const {state} = props;
    if (state.Layout.fullscreen) {
	return (<NoFullscreenIcon/>);
    } else {
	return (<FullscreenIcon/>);
    }
};
class Fullscreen extends Component {
    render() {
	const {classes, state, visible}=this.props;
	var onclick, title;
	if (visible !== undefined && ! visible && state.Settings.isInvisible(state,"FullScreen")) {
	    return null;
	} else if (visible !== undefined) {
	    onclick = (event) => state.Layout.toggleFullScreen(state);
	    title="Toggle Full Screen";
	    return (<div className={classes.view}>
		<Button
	              key="screen" 
                      className={classes.button}
                      onClick={onclick}
	              title={title}
		    >
	  	       {<FullscreenIconMode state={state}/>}
                    </Button>
		    </div>);
	} else {
	    onclick=() => {state.Settings.toggle(state,"FullScreen");};
	    title="Show Screen";
	    if (state.Settings.isInvisible(state,"FullScreen")) {
		return (<div className={classes.view}>
		<Button
	              key="screen" 
                      className={classes.buttonInvisible}
                      onClick={onclick}
	              title={title}
		    >
	  	       {<FullscreenIconMode state={state}/>}
                    </Button>
			</div>);
	    } else {
		return (<div className={classes.view}>
		<Button
	              key="screen" 
                      className={classes.button}
                      onClick={onclick}
	              title={title}
		    >
	  	       {<FullscreenIconMode state={state}/>}
                    </Button>
			</div>);
	    }
	};
    }
}

Fullscreen.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Fullscreen);
