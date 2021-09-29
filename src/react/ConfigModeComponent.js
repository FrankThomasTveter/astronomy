import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
//import Chip from '@material-ui/core/Chip';

import FlagIcon from '@material-ui/icons/Flag';
import BarIcon from '@material-ui/icons/BarChart';
import ListIcon from '@material-ui/icons/ViewList';//Details
import ChartIcon from '@material-ui/icons/Map';
import GlobeIcon from '@material-ui/icons/Public';
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

function getModes(state,mode) {
    if (mode !== undefined) {
	var layoutMode=0;
	var cellMode=0;
	if (mode === "Flags") {
	    layoutMode=state.Layout.modes.layout.Table;
	    cellMode=state.Layout.modes.cell.Sum;
	} else if (mode === "Bars") {
	    layoutMode=state.Layout.modes.layout.Table;
	    cellMode=state.Layout.modes.cell.Series;
	} else if (mode === "List") {
	    layoutMode=state.Layout.modes.layout.List;
	} else if (mode === "Chart") {
	    layoutMode=state.Layout.modes.layout.Chart;
	} else if (mode === "Globe") {
	    layoutMode=state.Layout.modes.layout.Globe;
	} else {
	    layoutMode=mode;
	    cellMode=state.Layout.modes.cell.Sum;
	}
	return {layout:layoutMode,cell:cellMode};
    } else {
	return {layout:state.Layout.state.layoutMode,cell:state.Layout.state.cellMode};
    };
};

function ModeIcon (props) {
    const {state,classes,mode} = props;
    //console.log("Classes:",JSON.stringify(classes));
    var modes=getModes(state,mode);
    var layoutMode=modes.layout;
    var cellMode=modes.cell;
    if (layoutMode === state.Layout.modes.layout.Table) {
	if (cellMode === state.Layout.modes.cell.Sum) {
	    return (<FlagIcon/>);
	} else {
	    return (<BarIcon/>);
	}
    } else if (layoutMode === state.Layout.modes.layout.List) {
	return (<ListIcon/>);
    } else if (layoutMode === state.Layout.modes.layout.Chart) {
	return (<ChartIcon/>);
    } else if (layoutMode === state.Layout.modes.layout.Globe) {
	return (<GlobeIcon/>);
    } else {
	return (<div className={classes.chip}> {layoutMode} </div>);
    }
};

function renderMode (state,classes,onclose,mode,index) {
    var modes=getModes(state,mode);
    var layoutMode=modes.layout;
    var cellMode=modes.cell;
    var onclick = (event) => {
	state.Layout.toggleMode(state,layoutMode,cellMode);
	onclose();
    };
    var cls={root:classes.button};
    return (<MenuItem key={mode} onClose={onclose}>
	       <Button classes={cls} onClick={onclick} title={mode}>
	          <ModeIcon state={state} classes={classes} mode={mode}/>
	       </Button>
	    </MenuItem>);
};

class Mode extends Component {
    state = {anchor: null,};
    render() {
	const {classes, state, visible}=this.props;
	var title;
	if (visible !== undefined && ! visible && state.Settings.isInvisible(state,"Mode")) {
	    return null;
	} else if (visible !== undefined) {
	    var modes=["Flags","Bars","List","Chart","Globe"];
	    state.Custom.addMaps(state,modes);
	    this.onClose = () => {this.setState({ anchor: null });};
	    this.onClick = (event) => {this.setState({ anchor: event.currentTarget });};
	    title="Select mode";
	    var mapFunction= (mode,index)=>renderMode(state,classes,this.onClose,mode,index);
	    return (<div className={classes.view}>
		    <Button
                      className={classes.button}
                      aria-owns={this.state.anchor ? 'mode-menu' : undefined}
                      aria-haspopup="true"
                      onClick={this.onClick}
	              title={"Select mode."}
		   >
		{<ModeIcon state={state} classes={classes}/>}
                   </Button>
	          <Menu
                   id="mode-menu"
	           anchorEl={this.state.anchor}
                   open={Boolean(this.state.anchor)}
                   onClose={this.onClose}
	          >
		    {modes.map(mapFunction)}
	          </Menu>
		    </div>);
	} else {
	    title="Show mode";
	    var onclick = (event) => {state.Settings.toggle(state,"Mode");}
	    if (state.Settings.isInvisible(state,"Mode")) {
		return (<Button key="mode" className={classes.buttonInvisible} onClick={onclick} title={title}>
			{<ModeIcon state={state} classes={classes}/>}
			</Button>);
	    } else {
		return (<Button key="mode" className={classes.button} onClick={onclick} title={title}>
			{<ModeIcon state={state} classes={classes}/>}
			</Button>);
	    };
	}
    }
};
Mode.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Mode);
