import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import RemoveIcon from '@material-ui/icons/Delete';

const styles = theme => ({
    button: {},
    buttonInvisible: {},
    buttonDisabled: {},
    remove: {
        marginLeft: 'auto',
    },
});
class Remove extends Component {
    render() {
	const {state, classes, onclick }=this.props;
	return (
		   <Button
	              className={classes.button}
                      onClick={onclick}
	              title={"Remove key"}
		    >
	  	       {<RemoveIcon state={state}/>}
                    </Button>
	);
    }
}

Remove.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Remove);
