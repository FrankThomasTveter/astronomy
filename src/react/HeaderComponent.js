import React from 'react';
import PropTypes from 'prop-types';
import AppBar    from '@material-ui/core/AppBar';
import Toolbar   from '@material-ui/core/Toolbar';
import logoImg   from '../images/Met_RGB_Horisontal_NO.png';
import { withStyles } from '@material-ui/core/styles';
//import Location  from    "./LocationComponent";
import Config    from    "./ConfigComponent";


const styles = theme => ({
    header:{
	zIndex: 999999,
    },
    logo: {
        padding:'1%',
        width: 150,
        [theme.breakpoints.up('sm')]: {
            width: 200
        },
    },
});

function Header(props) {
    const { classes, state } = props;
    return (
        <div className={classes.header}>
            <AppBar position={"fixed"} className={classes.header}>
               <Toolbar>
                    <img alt={"homepage"} className={classes.logo} src={logoImg}></img>
	            <Config state={state}/>
               </Toolbar>
            </AppBar>
         </div>
    );
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
