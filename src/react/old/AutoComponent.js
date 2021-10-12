import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import AutoIcon from '@material-ui/icons/Label';
import NoAutoIcon from '@material-ui/icons/LabelOff';

const styles = theme => ({
    view: {
        marginLeft: 'auto',
    },
    button:{
	color:'white'
    },
});
function AutoIconMode (props) {
    const {state} = props;
    if (state.Auto.complete) {
	return (<AutoIcon/>);
    } else {
	return (<NoAutoIcon/>);
    }
};
class Auto extends Component {
    render() {
	const {classes, state}=this.props;
	var onclick = (event) => state.Auto.toggle(state);
	return (
		   <Button
                      className={classes.button}
                      onClick={onclick}
	              title={"Autocomplete path"}
		    >
	  	       {<AutoIconMode state={state}/>}
                    </Button>
	);
    }
}

Auto.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Auto);
