import React, { Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Frag        from './FragComponent';

// npm install notistack
const styles = theme => ({
    tableOrder: {
	display: 'inline-block',
        marginRight: 'auto',
    },
    settings: {
        marginRight: 'auto',
	color:'red',
    },
    button:{color:'white'},
    content: {
        flex: '1 0 auto',
        paddingTop: '0rem',
        marginLeft: 'auto',
	alignItems:'right',
	cursor:'pointer',
    },
    align:{
	width: '100%',
	textAlign:'center',
    }
});

/**
 * The entire app get generated from this container.
 * We set the material UI theme by choosing a primary and secondary color from the metMuiThemes file
 * and creating a color palette with the createTheme method.
 * For information about using the different palettes see material UI documentation
 * 
 * This app contains the database, path and matrix states...
 */
class Status extends Component {
    constructor(props) {
	super(props);
	props.state.React.Status = this;
	this.state={msg:"", anchor:null};
    };
    // set dataset age
    setAge(state,age) {
	//console.log("Age...",state.Database.mod,age);
	//this.setState({msg:age});
    };
    setFootnote(state,msg) {
	//console.log("Setlog...",this.state.msg," -> ",msg);
	this.setState({msg:msg});
	//this.forceUpdate();
    };
    render() {
        const { state, classes } = this.props;
	this.onClose = () => {this.setState({ anchor: null });};
	this.onClick = (event) => {this.setState({ anchor: event.currentTarget });};
        return (
                <div className={classes.content}>
		   <div className={classes.align}
                    aria-owns={this.state.anchor ? 'settings-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.onClick}
		    title={"Fragment information"}>
		      <div>{this.state.msg}</div>
		   </div>
	           <Menu
		   className={classes.tableOrder}
                   id="settings-menu"
	           anchorEl={this.state.anchor}
                   open={Boolean(this.state.anchor)}
                   onClose={this.onClose}
	          >
		    <MenuItem key="reload" onClose={this.onClose}>
		       <Frag state={state}/>
		    </MenuItem>
		  </Menu>
                </div>
        );
    }
}
Status.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Status);

