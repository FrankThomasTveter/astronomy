import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {teal_palette} from '../mui/metMuiThemes';

import Grid from "@material-ui/core/Grid/Grid";
import Adress from "./AdressComponent";
import LevelBar from "./LevelBarComponent";
import Status from "./StatusComponent";
import Path      from  "./PathComponent";

const styles = theme => ({
    footer: {
//	height: '10px',
	zIndex:999999,
	padding:'0px',
    },
    banner: {
	backgroundColor:teal_palette.main,
	color:'white',
    },
    text: {
//	maxWidth: "100%",
//	margin: "1%",
//	width:'90%',
    },
    path:{
//	position:'absolute',
	border:  '0px solid blue',
	zIndex: 999999,
    },
    button:{zIndex:999999},
    buttonInvisible:{zIndex:999999},
    buttonDisabled:{zIndex:999999},
});

//text        maxWidth: theme.spacing.getMaxWidth.maxWidth,
//text        margin: theme.spacing.getMaxWidth.margin,



function Footer(props) {
    const { classes, state } = props;
    var cls={button:classes.button,
	     buttonDisabled:classes.buttonDisabled};
    return (
	    <div className={classes.footer}>
	    <div className={classes.path}>
                <Path  state={state}  className={classes.path} classes={cls} />
	      </div>
	    <div className={classes.banner} style={{height:classes.footer.bannerheight}}>
	    <div style={{padding:'5px', height:'100%'}}>
            <Grid container className={classes.text}>
	       <Grid item xs={2} style={{bottom: 1}}>
 	          <Adress />
	       </Grid>
	       <Grid item xs={6} style={{bottom: 1}}>
	          <LevelBar state={state}/>
	       </Grid>
	       <Grid item xs={4} style={{position: 'absolute', right: 5, bottom: 5}}>
	          <Status state={state}/>
	       </Grid>
	    </Grid>
	    </div>
	    </div>
        </div>
    );
}

Footer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Footer);
