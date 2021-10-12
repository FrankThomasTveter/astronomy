import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
//import Chip from '@material-ui/core/Chip';

import Icon from '@material-ui/icons/Help';
import {teal_palette} from '../mui/metMuiThemes';

const styles = theme => ({
    button:{
	color:'white'
    },
    buttonInvisible:{
	color:'gray'
    },
    chip: {
        margin: theme.spacing(0),
        cursor: "pointer",
	color:'white',
	backgroundColor:'white',
	"&&:hover":{
	    backgroundColor:teal_palette.light,
	},
	"&&:focus":{
	    backgroundColor:teal_palette.main,
	    color:'white',
	}
    },
});

function LevIcon (props) {
    const {state,lev} = props; //classes,
    //console.log("Classes:",JSON.stringify(classes));
    var clev=state.Matrix.getShowLevels(state);
    if (lev === clev) {
	return (<Icon/>);
    } else {
	return null;
    }
};

function renderLev (state,classes,onclose,lev,index) {
    var onclick = (event) => {
	state.Matrix.setShowLevels(state,lev);
	onclose();
    };
    var cls={root:classes.button};
    return (<MenuItem key={lev} onClose={onclose}>
	       <Button classes={cls} onClick={onclick} title={lev}>
	          {lev} <LevIcon state={state} classes={classes} lev={lev}/>
	       </Button>
	    </MenuItem>);
};

class Lev extends Component {
    state = {anchor: null,};
    render() {
	const {classes, state, visible}=this.props;
	var title;
	var clev=state.Matrix.getShowLevels(state);
	if (visible !== undefined && ! visible && state.Settings.isInvisible(state,"Lev")) {
	    return null;
	} else if (visible !== undefined) {
	    var levs=[1,2,3,4];
	    state.Custom.addMaps(state,levs);
	    this.onClose = () => {this.setState({ anchor: null });};
	    this.onClick = (event) => {this.setState({ anchor: event.currentTarget });};
	    title="Select number of tooltip show levels";
	    var mapFunction= (lev,index)=>renderLev(state,classes,this.onClose,lev,index);
	    return (<div className={classes.view}>
		    <Button
                      className={classes.button}
                      aria-owns={this.state.anchor ? 'lev-menu' : undefined}
                      aria-haspopup="true"
                      onClick={this.onClick}
	              title={"Select lev."}
		   >
		    {clev} <Icon/>
                   </Button>
	          <Menu
                   id="lev-menu"
	           anchorEl={this.state.anchor}
                   open={Boolean(this.state.anchor)}
                   onClose={this.onClose}
	          >
		    {levs.map(mapFunction)}
	          </Menu>
		    </div>);
	} else {
	    title="Show tooltip show level";
	    var onclick = (event) => {state.Settings.toggle(state,"Lev");}
	    if (state.Settings.isInvisible(state,"Lev")) {
		return (<Button key="lev" className={classes.buttonInvisible} onClick={onclick} title={title}>
			{clev}<Icon/>
			</Button>);
	    } else {
		return (<Button key="lev" className={classes.button} onClick={onclick} title={title}>
			{clev}<Icon/>
			</Button>);
	    };
	}
    }
};
Lev.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Lev);
