import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import AutoFocusIcon from '@material-ui/icons/CenterFocusStrong';
import ManualFocusIcon from '@material-ui/icons/CenterFocusWeak';

const styles = theme => ({
    button:{
	color:'white'
    },
    buttonInvisible:{
        color:'gray'
    },
});
function FocusIconMode (props) {
    const {state} = props;
    if (state.Path.inFocus(state)) {
	return (<AutoFocusIcon/>);
    } else {
	return (<ManualFocusIcon/>);
    }
};
class Focus extends Component {
    render() {
	const {classes, state, visible}=this.props;
	var title, onclick;
	if (visible !== undefined && ! visible && state.Settings.isInvisible(state,"Focus")) {
	    return null;
	} else if (visible !== undefined) {
	    onclick = (event) => {state.Path.toggleFocus(state);if (state.Path.inFocus(state)) {state.Show.showFocus(state)}};
            title="Focus map on data";
	    return (<div className={classes.view}>
		   <Button
                      className={classes.button}
                      onClick={onclick}
	              title={title}
		    >
	  	       {<FocusIconMode state={state}/>}
                    </Button>
		    </div>);
	} else {
            onclick=() => {state.Settings.toggle(state,"Focus");};
            title="Show focus";
            if (state.Settings.isInvisible(state,"Focus")) {
		return (<div className={classes.view}>
		   <Button
                      className={classes.buttonInvisible}
                      onClick={onclick}
	              title={"Center focus"}
		    >
	  	       {<FocusIconMode state={state}/>}
                    </Button>
			</div>);
	    } else {
		return (<div className={classes.view}>
		   <Button
                      className={classes.button}
                      onClick={onclick}
	              title={"Center focus"}
		    >
	  	       {<FocusIconMode state={state}/>}
                    </Button>
		</div>);
	    };
	};
    }
}

Focus.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Focus);
