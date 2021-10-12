import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import CanvasText  from './CanvasTextComponent';

const styles = theme => ({
    divTableCell:{
	display: 'table-cell',
	padding: '0px 0px',
	//overflow: 'hidden',
	//boxShadow: '0px -3px 0px red inset',
	//backgroundClip:'content-box',
    },
    divTableCellCursor:{
	cursor: "pointer",
	display: 'table-cell',
	padding: '0px 0px',
	//overflow: 'hidden',
	//backgroundClip:'content-box',
    },
});

//	borderCollapse: 'collapse',

function SummaryCell(props) {
    const { classes,state,onclick,index,rowindex,
	    colkey,rowkey,colvalues,rowval,
	    elements,plan,key,label,layout } = props;
    //console.log("Summary height:",plan.height);
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
    //console.log(info);
    var cnt=info.cnt;
    var maxlev=info.maxlev;
    var minlev=info.minlev;
    var lab="";
    if (label === undefined) {
	if (cnt > 1) {
	    if (plan.brief) {
		lab="";// "+"
	    } else {
		lab="";// "+"+(cnt);
	    }
	} else {
	    lab="";
	};
    } else {
	lab=label;
    };
    var invalid=(minlev < 0); 
    var bgcolor=state.Colors.getLevelBgColor(maxlev);
    var fgcolor=state.Colors.getLevelFgColor(maxlev);
    //console.log("Sending color:",fgcolor,maxlev);
    //var stylec={height:plan.height+"px",backgroundColor:bgcolor};
    //console.log("SummaryCell:'"+lab+"' lev=",lev,elements.length,bgcolor,lab);
    //console.log("Found invalid.",invalid,minlev,maxlev,JSON.stringify(elements));
    //console.log("Summary Plan:",JSON.stringify(plan));
    //console.log("SummaryCell:",JSON.stringify(plan));
    var colvals=state.Cell.selectValues(colvalues,index,plan.step);
    var data=JSON.stringify({keys:[colkey,rowkey],vals:[colvals,[rowval]],layout:layout}); 
    //console.log("SummaryCell data:",JSON.stringify(data),layout);
    var sheight=(plan.height)+'px';
    var swidth=(plan.width)+'px';
    var style={color:fgcolor,backgroundColor:bgcolor,height:sheight,maxHeight:sheight,width:swidth,border:'1px solid #EEE'};
    //console.log("Summary:",JSON.stringify(style));
    return (
            <div className={(onclick !== undefined?classes.divTableCellCursor:classes.divTableCell)} key={key}
	         style={style} onClick={onclick} height={plan.height} width={plan.width}
	         data-for='cell' data-tip={data}>
		<CanvasText state={state} label={lab} plan={plan} key={key} invalid={invalid} index={index}
					   colkey={colkey} colvalues={colvalues} rowkey={rowkey} rowval={rowval} color={fgcolor}/>
	    </div>
           );
}

SummaryCell.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SummaryCell);
