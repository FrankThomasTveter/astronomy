import React, {Component} from 'react';
import ReactTooltip from 'react-tooltip'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {teal_palette} from '../mui/metMuiThemes';

const styles = theme => ({
    tooltip:{
	border: '0px solid #999999',
	backgroundColor:teal_palette.main,
	zIndex:100,
    },
});
			 
class TooltipWrapper extends Component {
    constructor (props) {
	super(props);
	this.tooltipRef=React.createRef();
	this.divRef=React.createRef();
	this.showing=false;
	this.marker=null;
	this.state={content:null};
    }
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
   
    destroy() {
	//this.tooltipRef.destroy();
	this.showing=false;
	this.marker=null;
    };

    hide() {
	document.body.style.cursor = 'inherit';
	this.divRef.style.position = 'fixed';
	this.divRef.style.left = '0';
	this.divRef.style.top = '0';
	//this.tooltipRef.hide();
	this.showing=false;
	this.marker=null;
	this.setState({content:null});
	ReactTooltip.hide(this.divRef);
    };

    show(clientX, clientY, marker) {
	if (! this.showing || this.marker === null) {
	    this.marker=marker;
	    document.body.style.cursor = 'pointer';
	    this.divRef.style.width = '20px';
	    this.divRef.style.height = '20px';
	    this.divRef.style.border = '0px solid #FFF';
	    this.divRef.style.position = 'fixed';
	    var posx=Math.max(clientX-10,1);
	    var posy=Math.max(clientY-15,1);
	    this.divRef.style.left = `${posx}px`;//`${clientX + TOOLTIP_OFFSET}px`;
	    this.divRef.style.top = `${posy}px`;
	    this.setState({content:this.props.getTooltipContent(marker)});
	    //console.log("Showing:",marker.id,posx,posy);
	    ReactTooltip.show(this.divRef);
	    this.forceUpdate(); // do we need this???
	};
    };
    
    render() {
	const { classes } = this.props;
	//console.log("Rendering ToolWrapper...");
	var getContent= function(dataTip) {
	    return this.state.content;
	}.bind(this);
	var onClickMarker=function (event) {
	    if (this.marker !== null) {
		var marker=this.marker;
		var state = marker.state;
		//var location=marker.location;
		// //console.log("Clicked marker...",marker.id)
		// var cnt   = marker.cnt;
		// var colkey   = location.colrangekey;
		// var colrange = location.colrange;
		// var colwhere = location.colwhere;
		// var rowkey   = location.rowrangekey;
		// var rowrange = location.rowrange;
		// var rowwhere = location.rowwhere;
		console.log("Clicked marker...",marker.id);
		state.Navigate.selectElement(state,marker.element);
		//state.Navigate.selectItemRange(state,colkey,rowkey,colrange,rowrange,colwhere,rowwhere,cnt,1);
		//state.Show.showAll(state);
	   // } else {
	   //	console.log("Clicked empty marker...");
	    }
	}.bind(this);
	var afterShow= function() {
	    //console.log("Showing ",this.marker.id);
	    this.showing=true;
	}.bind(this);
	var afterHide= function() {
	    //console.log("Hiding ",this.marker.id);
	    this.showing=false;
	}.bind(this);
	return (<div>
		<div ref={element=>this.divRef=element}
	             data-for={"map"}
	             data-tip="test"
		     onClick={onClickMarker}
		     style={{display: 'flex', justifyContent: 'center'}}></div>
		<ReactTooltip
	             id={"map"}
	             ref={element=>this.tooltipRef=element}
	             className={classes.tooltip}
                     effect='solid'
                     delayHide={500}
                     delayShow={200}
                     delayUpdate={500}
                     place={'right'}
                     border={true}
                     type={'light'}
	             afterShow={afterShow}
	             afterHide={afterHide}
		     getContent={getContent}/>
		</div>);
    }
}



TooltipWrapper.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TooltipWrapper);
