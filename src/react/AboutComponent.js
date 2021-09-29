import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography/Typography";
import Grid from "@material-ui/core/Grid/Grid";

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.primary.main,
        marginTop: theme.spacing(8),
        bottom: 0,
        padding: theme.spacing(6),
        color: '#FFF'
    },
    button:{},
    text: {
	maxWidth: "100%",
	margin: "1%",
    },
});

const { REACT_APP_DATE } = process.env;

//text        maxWidth: theme.spacing.getMaxWidth.maxWidth,
//text        margin: theme.spacing.getMaxWidth.margin,

function About(props) {
//    const { state } = props;
    return (

            <Grid item xs={12} sm={12} key={'info'}>
             <Typography color={"inherit"} key={'W'}>
            WARNING BOARD
             </Typography>
             <Typography color={"inherit"} key={'C'}>
               Created {REACT_APP_DATE} by <a href="https://met.no"> met.no </a>
             </Typography>
             <Typography color={"inherit"} key={'T'}>
	    This is one of many tools provided to the on-duty forecasters.
             </Typography>
             <Typography color={"inherit"} key={'O'}>
            Colors are not the official warning level colors.
             </Typography>
            </Grid>
    );
}

About.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(About);
