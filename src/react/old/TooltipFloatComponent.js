import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tooltip  from './TooltipDataComponent';
//import Button from '@material-ui/core/Button';
//import Chip from '@material-ui/core/Chip';

const styles = theme => ({
    button:{},
});
class TooltipFloatComponent extends Component {
    constructor(props) {
	super(props);
	const {state} = props;
	state.React.TooltipFloatComponent=this;
	this.update=this.update.bind(this);
	this.visible=false;
	this.data=null;
	this.cnt=0;
    };
    toggle(visible) {
	if (visible !== undefined) {
	    this.visible=visible;
	} else {
	    this.visible=!this.visible;
	}
    }
    update(state,marker) {
	var el=marker.element;
	if (el !== undefined) {
	    if (this.data !== null && this.data.id === marker.id) {
		this.data=null;
		this.toggle(false);
	    } else {
		this.toggle(this.data === null || this.data.id !== marker.id)
		var vals=state.Matrix.getVals(el);
		//console.log("Element:",JSON.stringify(Object.keys(el)));
		//console.log("Keys:",JSON.stringify(el.keys)," values:",JSON.stringify(el.values)," vals:",JSON.stringify(vals));
		this.data={keys:el.keys,vals:vals,id:marker.id};
	    }
	    //console.log("Updating tooltip...");
	    this.forceUpdate();
	} else {
	    console.log("Invalid marker...",JSON.stringify(Object.keys(marker)));
	}
    };
    render() {
	const { state, update } = this.props; //classes, 
	if (state.Layout.state.tooltip!==0 && this.visible) {
	    return (
		    <div style={{position:'absolute',right:'0px',zIndex:100000, backgroundColor:"white"}} >
		    <Tooltip state={state} data={this.data} update={update}/>
		    </div> );
	} else {
	    return null;
	}
    }
};



TooltipFloatComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TooltipFloatComponent);
