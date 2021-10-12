import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CanvasGraph from './CanvasGraphComponent';

//	textAlign: "center",
const styles = theme => ({
    pointer: {
	textAlign: "center",
	cursor:"pointer",
	padding: 0,
	overflow: 'hidden',
	tableLayout: 'fixed',
    },
    nopointer: {
	textAlign: "center",
	padding: 0,
	overflow: 'hidden',
	tableLayout: 'fixed',
    },
    div: {
	overflow: 'hidden',
	tableLayout: 'fixed',
    },
    divTableCell:{
	display: 'table-cell',
	padding: '0px 0px',
	//overflow: 'hidden',
    },
    divTableCellCursor:{
	cursor: "pointer",
	display: 'table-cell',
	padding: '0px 0px',
	//overflow: 'hidden',
	//backgroundClip:'content-box',
    },
});
//	padding: "0px";
//	textAlign: "center",
function SeriesCell(props) {
    const { classes,state,onclick,index,rowindex,
	    colwhere,rowwhere,colkey,rowkey,colvalues,rowval,
	    elements,range,plan,key,layout,...other } = props;

    var style0={height:(plan.height)+"px",backgroundColor:'#FFF',border:'1px solid #FFF'};
    var style1={height:(plan.height)+"px",backgroundColor:'#EEE',border:'1px solid #EEE'};
    if (elements===undefined) {
	if (rowindex%2===1) {
	    return <div className={classes.divTableCell} style={style1}/>
	} else {
	    return <div className={classes.divTableCell} style={style0}/>
	}
    };
    var info=state.Matrix.getTooltipInfo(state,elements);
    //var cnt=info.cnt;
    var maxlev=info.maxlev;
    //var minlev=info.minlev;
    var bgcolor=state.Colors.getLevelBgColor(maxlev);
    var fgcolor=state.Colors.getLevelFgColor(maxlev);
    //console.log("SeriesCell:",JSON.stringify(elements));
    //console.log("SeriesCell:",maxlev," range:",JSON.stringify(range));
    //console.log("Series height:",plan.height);
    //console.log("Series Plan:",JSON.stringify(plan));
    var colvals=state.Cell.selectValues(colvalues,index,plan.step);
    var data=JSON.stringify({keys:[colkey,rowkey],vals:[colvals,[rowval]],layout:layout});
    var sheight=(plan.height)+'px';
    var swidth=(plan.width)+'px';
    var style={color:fgcolor,backgroundColor:bgcolor,height:sheight,maxHeight:sheight,width:swidth,border:'1px solid '+bgcolor}; //#EEE
    //console.log("Series:",JSON.stringify(style));
    return( <div className={(onclick !== undefined?classes.divTableCellCursor:classes.divTableCell)} key={key}
	    style={style} onClick={onclick} 
	    data-for='cell' data-tip={data}>
  	    <CanvasGraph {...other} state={state} plan={plan} range={range} onclick={onclick} elements={elements} index={index}
	                            colkey={colkey} colvalues={colvalues} level={maxlev} fgcolor={fgcolor} bgcolor={bgcolor}/>  
	     </div>
    );
}



SeriesCell.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SeriesCell);
