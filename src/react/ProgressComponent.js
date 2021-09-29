import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
//import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
    content: {
	padding: '10%',
	textAlign:'center',
    },
});

function Progress(props) {
  const { classes, color } = props;
  if (color === "") {
      return null;
  } else {
      return (
	  <div className={classes.content}>
	      <CircularProgress/> 
 	  </div>
     );
  }
}

Progress.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Progress);
