import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import SelectValueMenu from './SelectValueMenuComponent';

const styles = theme => ({
    settings:{},
    config: {
     marginLeft: 'auto',
    },
    span:{},
    button:{},
    buttonInvisible:{},
    buttonDisabled:{},
});
function renderPathSelect(classes,state,keyitem,keyindex,focusPoints) {
    var key=state.Path.keys.path[keyindex]; //=keyitem
    var vals=state.Path.select.val[key];
    var lab="";
    if (vals !== undefined && vals.length > 0) {
	lab=vals[0];
    };
    var target="rest";
    var remove = () => {state.Navigate.pushSelectToRest(state,key);};
    var title="'"+state.Path.where[key]+"'";
    var cls={button:classes.button,buttonInvisible:classes.buttonInvisible,buttonDisabled:classes.buttonDisabled};
    return (<span key={`select-${key}`} className={classes.span}>
	    <SelectValueMenu state={state} classes={cls} keyitem={keyitem} label={lab} target={target} title={title} focusPoints={focusPoints} focusType={"_selected"} remove={remove}/>
	    </span>);
}

class PathSelect extends Component {
    constructor() {
        super();
        this.focusPoints={};
    };	
    state={anchor:null};
    componentDidUpdate(){
	const { state } = this.props;//classes, 
	var pathFocus=state.Path.getPathFocus(state);
	if (pathFocus !== undefined && pathFocus !== null) {
	    var fp=this.focusPoints[pathFocus];
	    if (fp !== undefined && fp !== null) {
		//console.log(" >>> Focusing on (Select) ",pathFocus);
		//console.log("Possibilities:",JSON.stringify(Object.keys(this.focusPoints)));
		fp.focus(); 
	    } else {
		//console.log(" >>> Not in focus (Select) ",pathFocus);
		//console.log("Possibilities:",JSON.stringify(Object.keys(this.focusPoints)));
	    }
	}
    }
    render() {
	const { classes, state } = this.props;
	var items=state.Path.keys.path;
	var mapFunction= (item,index)=>renderPathSelect(classes,state,item,index,this.focusPoints);
	return items.map(mapFunction);
    }
}

PathSelect.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PathSelect);
