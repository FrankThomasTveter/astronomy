import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
//import Grid from "@material-ui/core/Grid/Grid";

import LevelColor from './LevelColorComponent';

const styles = theme => ({
    divTable :{
	display: 'table',
	width: '100%',
	cursor: 'pointer',
//	border:  '1px solid red',
    },
    divTableBody : {
	display: 'table-row-group',
    },
    divTableRow:  {
	border: '0px solid #999999',
	display: 'table-row',
	cursor: 'pointer',
	padding: '0px',
    },
    divTableCell:{
	border: '0px solid #999999',
	display: 'table-cell',
	padding: '0px',
	cursor: 'pointer',
	width: '25%',
//	border:  '1px solid blue',
    },
});
function renderItem(classes,state,bg,fg,level,cnt) {
    //var plans=state.Layout.makePlans();
    //console.log("Showing palette:",bg,fg,JSON.stringify(plans.hd2));
    var cls={divTableCell:classes.divTableCell};
    return (<LevelColor key={level} state={state} bg={bg} fg={fg} level={level} classes={cls}/>);
//  style={{color:fg,backgroundColor:bg,textAlign:'center'}} onClick={onclick} 
};
class LevelBar extends Component {
    constructor(props) {
        super(props);
        const {state} = props;
        state.React.LevelBar=this;
    };
    showLevelBar(state) {
	//console.log("Called LevelBar.show...");
	this.forceUpdate();
    };
    render() {
        const { classes, state } = this.props;
	var bgcolors=[];
	var fgcolors=[];
	if (state.Colors.colors !== undefined) {
	    bgcolors=state.Colors.colors.background;
	    fgcolors=state.Colors.colors.foreground;
	    //console.log("Found colors...");
	//} else {
	    //console.log("No colors...");
	}
	var cnt=bgcolors.length;
	var mapFunction= (val,index)=>renderItem(classes,state,bgcolors[index],fgcolors[index],index,cnt);
	//console.log("Rendering LevelBar...");
	return (   <div className={classes.divTable}>
		      <div className={classes.divTableBody}>
		         <div className={classes.divTableRow}>
	    	            {bgcolors.map(mapFunction)}
	                 </div>
	              </div>
		   </div>);
    }
}

LevelBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LevelBar);



