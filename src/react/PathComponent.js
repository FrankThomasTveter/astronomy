import React, {Component} from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import PathSelect from './PathSelectComponent';
import PathTable from './PathTableComponent';
import PathRest from './PathRestComponent';
//console.log("Inside PathComponent.")
//calc(95% - 5px)

const styles = theme => ({
    root: {
	width:'100%',
	display:'flex',
	flexWrap:'wrap',
	alignContent:'flex-start',
	border:0,
	fontSize:'0px',
	zIndex:999999,
	//	border:  '1px solid red',
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'left',
    },
    paperImage: {
        textAlign: 'center',
        padding: theme.spacing(2),
    },
    button : {
	color: 'white',
    },
    buttonInvisible:{},
    buttonDisabled: {},
    dataset:{},
});
function Details(props) {
    const { state,classes } = props; // 
    if (state.Layout.state.viewMode === state.Layout.modes.view.path) {
	var cls={button:classes.button,buttonInvisible:classes.buttonInvisible,buttonDisabled:classes.buttonDisabled};
	return (
		<div className={classes.root}>
		 <PathSelect    state={state} key={"select"} classes={cls}/>
		 <PathTable  state={state} key={"table"} classes={cls}/>
		 <PathRest   state={state} key={"rest"} classes={cls}/>
		</div>
	);
    } else {
	return (null);
    };
}
class PathComponent extends Component {
    constructor(props) {
	super(props);
	const {state} = props;
	state.React.Path=this;
	this.showPath=this.showPath.bind(this);
    };
    showPath(state){
	//console.log("Showing PathComponent.",JSON.stringify(state.Path.keys));
	this.forceUpdate();
    };
    render() {
        const { classes, state } = this.props;
        return (
            <div className={classes.root}>
		       <Details classes={classes} state={state}/>
            </div>
        );
    }
}

PathComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PathComponent);
