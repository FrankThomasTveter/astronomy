import React, {Component} from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {teal_palette} from '../mui/metMuiThemes';

import ReactTooltip from 'react-tooltip'
import Tooltip from './TooltipDataComponent'

const styles = theme => ({
    tooltip:{
	border: '0px solid #999999',
	backgroundColor:teal_palette.main,
	color:'white',
	zIndex:100,
    },
    button: {
	color:'white',
	"&$buttonDisabled": {
            color: theme.palette.primary.main,
	},
    },
    buttonInvisible:{},
    buttonDisabled: {},
});
class TooltipFixedComponent extends Component {
    constructor(props) {
	super(props);
	const {state} = props;
	state.React.Tooltip=this;
	this.update=this.update.bind(this);
    };
    rebuild() {
	//console.log("Rebuilding tooltip.");
	//ReactTooltip.rebuild();
    };
    update() {
	//console.log("Rebuilding tooltip.");
	this.forceUpdate();
	ReactTooltip.rebuild();
    };
    componentDidUpdate(){
	ReactTooltip.rebuild()
    } 
    render() {
	const { classes, state, type } = this.props;
	var overridePosition = ({ left, top },currentEvent, currentTarget, node) => {
	    const d = document.documentElement;
	    //console.log("Top:",top,node.clientHeight," left:",left,node.clientWidth," window:",d.clientHeight,d.clientWidth);
	    left = Math.min(d.clientWidth - node.clientWidth, left);
	    top = Math.min(d.clientHeight - node.clientHeight, top);
	    left = Math.max(0, left);
	    top = Math.max(100, top);
	    top = Math.min(d.clientHeight - node.clientHeight-100, top);
	    return { top, left }
	};
	var getContent= function(dataTip) {
	    if (dataTip==null) {
		//console.log("Tooltip no datatip...");
		return null;
	    } else {
		const data=JSON.parse(dataTip);
		//console.log("Tooltip:",JSON.stringify(dataTip));
		var cls={tooltip:classes.tooltip};
		return (<Tooltip state={state} classes={cls} data={data} update={this.update}/>);
	    }
	}.bind(this);
	//console.log("##### Rendering TooltipFixedComponent.");
	if (state.Layout.state.tooltip===0) {
	    return null;
	} else {
	    return (<ReactTooltip id={type}
		    className={classes.tooltip}
		    overridePosition={overridePosition}
		    getContent={getContent}
		    effect='solid'
		    delayHide={500}
		    delayShow={300}
		    delayUpdate={200}
		    place={'bottom'}
		    border={true}
		    type={'light'}
		    />);
	}
    };
};
TooltipFixedComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TooltipFixedComponent);
