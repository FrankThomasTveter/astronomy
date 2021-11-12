import {Component} from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

//import {teal_palette} from '../mui/metMuiThemes';

const styles = theme => ({
    tooltip:{
    },
});
			 
class TooltipWrapper extends Component {
    rebuild() {
	//console.log("Rebuilding tooltip.");
    };
    update() {
	//console.log("Rebuilding tooltip.");
	this.forceUpdate();
    };
    render() {
	return (null);
    }
}



TooltipWrapper.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TooltipWrapper);
