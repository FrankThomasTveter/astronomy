import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import PropTypes from  "prop-types";
import Table     from  "./TableComponent";
import List      from  "./ListComponent";
import Globe     from  "./GlobeComponent";
import Chart     from  "./ChartComponent";
import Custom    from  "./CustomComponent";
import Progress  from './ProgressComponent';
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time

//console.log("Inside Dataset.")

const styles = theme => ({
    dataset:{
	border:  '0px solid blue',
    },
    path:{
	border:  '0px solid blue',
    },
    content:{},
    button:{},
    buttonInvisible:{},
    buttonDisabled:{},
});
//        maxWidth: theme.spacing.getMaxWidth.maxWidth,

function Switcher(props) {
    const { state, classes, progress, layout } = props;
    //var skeys=state.Matrix.sortedKeys(state,state.Matrix.keyCnt);
    //var dim        = state.Layout.getDim(state)
    var mode       = state.Layout.getLayoutMode(props.state);
    //console.log(">>>>>> Switcher Dim:",dim," mode:",mode);
    if (mode === state.Layout.modes.layout.Chart) {
	//console.log("Showing map...");
	return (<Chart   state={state}   classes={classes}/>);
    } else if (mode === state.Layout.modes.layout.Globe) {
	//console.log("Showing map...");
	return (<Globe   state={state}   classes={classes}/>);
    } else if (progress) { // processing
	return (<div style={{width:'100%',margin:'0 auto'}}>
	          <Progress/>
	       </div>);
    } else if (mode === state.Layout.modes.layout.Table) {
	return (<Table state={state}  classes={classes} layout={layout}/>);
    } else if (mode === state.Layout.modes.layout.List) {
	return (<List  state={state}  classes={classes}/>);
    } else {
	return (<Custom state={state} classes={classes}/>);
    }
};

class Dataset extends Component {
    constructor(props) {
        super(props);
        const {state} = props;
        state.React.Dataset=this;
	this.state={progress:false,mode:0};
    };
    showMatrix(state,matrix) {
	state.React.matrix=matrix;
	this.forceUpdate();
	//console.log("Datacomponent matrix:",JSON.stringify(state.React.matrix));
    };
    setProgress(state,active) {
	var mode       = state.Layout.getLayoutMode(state);
	//console.log(">>>>>> Switcher Dim:",dim," mode:",mode);
	//console.log("Setting progress:",active,mode);
	if (mode === state.Layout.modes.layout.Globe && mode===this.state.mode) {
	    this.setState({progress:active});
	    //this.state.progress=active;
	} else if (mode === state.Layout.modes.layout.Chart && mode===this.state.mode) {
	    this.setState({progress:active});
	} else {
	    state.React.Dataset.setState({progress:active,mode:mode});
	    //this.forceUpdate();
	}
    };
    render() {
        const { classes, state, layout } = this.props;
	var cls={dataset:classes.dataset,
		 content:classes.content,
		 button:classes.button,
		 buttonDisabled:classes.buttonDisabled};
        return (
		<div className={classes.dataset}>
		<Draggable className={classes.dataset}>
		<div className={classes.dataset}>
		<Switcher state={state} classes={cls} layout={layout}
	                   progress={this.state.progress}/>
		</div>
		</Draggable>
		<div style={{position:"absolute", top:0, left:0, width:"100%",height:"100%", zIndex:-999999}}>
		<Globe   state={state}   classes={classes}/>
		</div>
		</div>
        );
    }

}
// disabled={false}


Dataset.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dataset);
