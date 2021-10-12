import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
//import Chip from '@material-ui/core/Chip';

import Icon from '@material-ui/icons/Apps';
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

function DimIcon (props) {
    const {state,dim} = props; //classes,
    //console.log("Classes:",JSON.stringify(classes));
    var cdim=state.Path.getDim(state);
    if (dim === cdim) {
	return (<Icon/>);
    } else {
	return null;
    }
};

function renderDim (state,classes,onclose,dim,index) {
    var onclick = (event) => {
	state.Path.setDim(state,dim);
	onclose();
    };
    var cls={root:classes.button};
    return (<MenuItem key={dim} onClose={onclose}>
	       <Button classes={cls} onClick={onclick} title={dim}>
	          {dim} <DimIcon state={state} classes={classes} dim={dim}/>
	       </Button>
	    </MenuItem>);
};

class Dim extends Component {
    state = {anchor: null,};
    render() {
	const {classes, state, visible}=this.props;
	var title;
	var cdim=state.Path.getDim(state);
	if (visible !== undefined && ! visible && state.Settings.isInvisible(state,"Dim")) {
	    return null;
	} else if (visible !== undefined) {
	    var dims=[0,1,2,3,4];
	    state.Custom.addMaps(state,dims);
	    this.onClose = () => {this.setState({ anchor: null });};
	    this.onClick = (event) => {this.setState({ anchor: event.currentTarget });};
	    title="Select number of dims";
	    var mapFunction= (dim,index)=>renderDim(state,classes,this.onClose,dim,index);
	    return (<div className={classes.view}>
		    <Button
                      className={classes.button}
                      aria-owns={this.state.anchor ? 'dim-menu' : undefined}
                      aria-haspopup="true"
                      onClick={this.onClick}
	              title={"Select dim."}
		   >
		    {cdim} <Icon/>
                   </Button>
	          <Menu
                   id="dim-menu"
	           anchorEl={this.state.anchor}
                   open={Boolean(this.state.anchor)}
                   onClose={this.onClose}
	          >
		    {dims.map(mapFunction)}
	          </Menu>
		    </div>);
	} else {
	    title="Show dim";
	    var onclick = (event) => {state.Settings.toggle(state,"Dim");}
	    if (state.Settings.isInvisible(state,"Dim")) {
		return (<Button key="dim" className={classes.buttonInvisible} onClick={onclick} title={title}>
			{cdim}<Icon/>
			</Button>);
	    } else {
		return (<Button key="dim" className={classes.button} onClick={onclick} title={title}>
			{cdim}<Icon/>
			</Button>);
	    };
	}
    }
};
Dim.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Dim);
