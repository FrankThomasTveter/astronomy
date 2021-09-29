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

    text: {
	maxWidth: "100%",
	margin: "1%",
    },
});

//text        maxWidth: theme.spacing.getMaxWidth.maxWidth,
//text        margin: theme.spacing.getMaxWidth.margin,

function Adress(props) {
    // const { classes } = props;
    return (

            <Grid item xs={12} sm={12}>
             <Typography color={"inherit"}>
	    <a href="https://docs.google.com/presentation/d/1SfaiGS2I04l0t0fZODwiPrJCgGo7CnKYAe1ocD_rU0w" rel="noopener noreferrer" target="_blank"> doc@ </a>
            <a href="https://met.no"> met.no </a>
        </Typography>
            </Grid>
    );
}
             //<Typography color={"inherit"}>
             //  Henrik Mohns Plass 1
             //</Typography>
             //<Typography color={"inherit"}>
             //  0313 Oslo
             //</Typography>
             //<Typography color={"inherit"}>
             //  Telefon 22 96 30 00
             //</Typography>

Adress.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Adress);
