import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import RestValueMenu from './RestValueMenuComponent';

import SelectValueMenu from './SelectValueMenuComponent';

const styles = theme => ({
    config: {
        marginLeft: 'auto',
    },
    button:{},
    buttonInvisible:{},
    buttonDisabled:{},
});
function renderPathRest(classes,state,item,type,index,focusPoints) {
    //var remove='trash';
    var remove = () => {state.Navigate.pushRestToTrash(state,item);};
    var target="trash";
    var onclick, title, lab;
    var cls={button:classes.button,buttonInvisible:classes.buttonInvisible,buttonDisabled:classes.buttonDisabled};
    if (state.Path.keys.path.indexOf(item) !== -1) {
	//var vals=state.Path.select.val[item];
	//onclick=() => state.Navigate.onClickPath(state,'path',item);
	onclick=() => state.Navigate.pushPathToTable(state,item);
	title="'"+state.Path.where[index]+"'";
	return (<span key={`path-${item}`}>
		<SelectValueMenu state={state} classes={cls} label={item} keyitem={item} keytype={type} keyindex={index} remove={remove} target={target} onclick={onclick} title={item} focusPoints={focusPoints}/>
		</span>);
    } else if (state.Path.other.rest.indexOf(item) !== -1) {
	lab=item;
	//onclick=() => state.Navigate.onClickPath(state,'rest',item);
	onclick=() => state.Navigate.pushRestToTable(state,item);
	title="'"+item+"'";
	return (<span  key={`${item}`} title={title}>
		<RestValueMenu state={state} classes={cls} keyitem={item} keyindex={index} keytype={type} label={lab} remove={remove} target={target} onclick={onclick} title={title} focusPoints={focusPoints}/>
		</span>);
    } else if (state.Path.other.ignore.indexOf(item) !== -1) {
	lab=item;
	//onclick=() => state.Navigate.onClickPath(state,'rest',item);
	onclick=() => state.Navigate.pushRestToTable(state,item);
	title="'"+item+"'";
	return (<span  key={`${item}`} title={title}>
		<RestValueMenu state={state} classes={cls} keyitem={item} keyindex={index} label={lab} remove={remove} target={target} onclick={onclick} title={title} focusPoints={focusPoints}/>
		</span>);
    }
    //    return <RestKey state={state} key={`rest-${item}`} index={index} onclick={onclick} title={title} value={item}/>;
}

//
//

class PathRest extends Component {
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
		//console.log(" >>> Focusing on (Rest) ",pathFocus);
		fp.focus(); 
	    } else {
		//console.log(" >>> Not in focus (Rest) ",pathFocus);
	    }
	}
    }
    render() {
	const { classes, state } = this.props;
	var items=state.Path.other.rest.concat(state.Path.other.ignore);
	var type="otherRest";
	//console.log("PathRestComponent items:",JSON.stringify(items),JSON.stringify(state.Path.keys));
	var mapFunction= (item,index)=>renderPathRest(classes,state,item,type,index,this.focusPoints);
	if (items.length > 0) {
	    return items.map(mapFunction);
	} else {
	    return null;
	}
    }
};

PathRest.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PathRest);
