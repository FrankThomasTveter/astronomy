import React, {Component} from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

//import {teal_palette} from '../mui/metMuiThemes';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import EmptyCell   from './EmptyCellComponent';
import SummaryCell from './SummaryCellComponent';
import SeriesCell  from './SeriesCellComponent';
import CanvasText  from './CanvasTextComponent';
import Tooltip  from './TooltipFixedComponent';

const styles = theme => ({
    content:{
    	backgroundColor: 'transparent',
    },
    divHdrLeft : {
	display: 'inline-block',
	justifyContent: 'left',
	cursor: "pointer",
    },
    divHdrRight : {
	display: 'inline-block',
	justifyContent: 'right',
	cursor: "pointer",
    },
    paper: {
	backgroundColor:'transparent',
//	backgroundColor: teal_palette.main,
//	overflow: 'hidden',
//	border:  '1px solid blue',
	tableLayout: 'fixed',
	padding:0,
	margin:0,
	outlined:"0px",
    },
    divEmpty :{
	width: '100%',
	height: '100%',
    },
    divCustom :{
	display: 'table',
	width: '100%',
	backgroundColor: 'transparent',
//	border:  '1px solid red',
    },
    divCustomRow:  {
	backgroundColor:'transparent',
	border: '0px solid #999999',
	display: 'table-row',
	padding: '0px',
    },
    divCustomCell:{
	border: '0px solid #999999',
	display: 'table-cell',
	padding: '0px',
	backgroundColor: 'transparent',
    },
    divCustomCellCursor:{
	cursor: "pointer",
	border: '0px solid #999999',
	display: 'table-cell',
	padding: '0px',
    },
    divCustomHead : {
	border: '0px',
	display: 'table-cell',
	padding: '0px',
    },
    divCustomHeading : {
	display: 'table-header-group',
    },
    divCustomHeadingCenter : {
	display: 'flex',
	justifyContent: 'center',
    },
    divCustomFoot : {
	backgroundColor: '#DDD',
	display: 'table-footer-group',
	fontWeight: 'bold',
    },
    divCustomBody : {
	display: 'table-row-group',
    },
    paperImage: {
        textAlign: 'center',
        padding: theme.spacing(2),
    },
    dataset:{},
    button:{},
    buttonInvisible:{},
    buttonDisabled:{},
});

//const mui = createTheme({palette:teal_palette});

// ---------------- DATA
//{rowval}
function DataCell(props) {
    const {classes,state,index,elements,mode,layout,plan,rowindex,rowval,colvalues,...other}=props;
    var map, cell, label;
    if (elements===undefined) {
	return <EmptyCell {...other} state={state} plan={plan}/>
    } else if (mode===state.Layout.modes.cell.Sum) {
	map=state.Custom.getMap(state,layout);
	cell=state.Custom.getCell(state,map,colvalues[index],rowval);
	label=state.Custom.getCellLabel(state,cell)||"?";
	return <SummaryCell {...other} state={state} elements={elements} plan={plan}
	        index={index} colvalues={colvalues} rowval={rowval} label={label}
	        layout={layout}/>
	//return null;
    } else {
	map=state.Custom.getMap(state,layout);
	cell=state.Custom.getCell(state,map,colvalues[index],rowval);
	label=state.Custom.getCellLabel(state,cell)||"?";
	return <SeriesCell {...other} state={state} elements={elements} plan={plan}
	        index={index} colvalues={colvalues} rowval={rowval} label={label}
	        layout={layout}/>
	//return null;
    }
}
function renderDataCell(classes,state,colkey,colvalues,rowkey,rowval,rowindex,rowwhere,range,mode,layout,plan,val,index) {
    //console.log("Making data cell:",rowval,val,index,plan,JSON.stringify(colvalues));
    if (index%plan.step === 0) {
	// get elements and range
	//console.log("Processing DataCell:",colkey,val,colvalues[index],plan.step);
	var matrix=state.React.matrix;
	var elements=state.Cell.getElements(state,matrix,colkey,rowkey,
					    colvalues,rowval,index,plan.step);
	//console.log("Elements:",rowval,index,' =>',JSON.stringify(elements));
	// make onclick
	var onclick=() => state.Navigate.selectElements(state,elements);
        var colwhere = state.Cell.getColWhere(state,colkey,colvalues,index,plan.step);
	return (<DataCell classes={classes} state={state} key={`col-${index}`} rowindex={rowindex} index={index} onclick={onclick}
		colkey={colkey} rowkey={rowkey} colvalues={colvalues} rowval={rowval} colwhere={colwhere} rowwhere={rowwhere} 
		elements={elements} mode={mode} layout={layout} plan={plan} range={range}
	    />);
    } else {
	return null;
    }
}
//{{rowkey:'test1',colkey:'test2'}}
function dataRow(classes,state,colkey,rowkey,colvalues,mode,layout,plans,rowval,rowindex) {
    //console.log("Processing Row:",rowkey,rowval);
    var rowwhere=state.Database.getWhereValue(rowkey,rowval);
    //var onclick=() => {state.Navigate.selectKey(state,rowkey,rowval,rowwhere,1);}
    var range=[undefined,undefined];
    if (state.React.matrix!==undefined) {
	var keys=[colkey,rowkey];
	var vals=[colvalues,[rowval]];
	range=state.Matrix.getRanges(state,state.React.matrix,keys,vals);
    };
    //console.log("Making data cols.",rowval,colkey,JSON.stringify(colvalues));
    //console.log("We have a matrix(",rowval,") with range:",JSON.stringify(range));
    var mapFunction= (val,index)=>renderDataCell(classes,state,colkey,colvalues,rowkey,rowval,rowindex,rowwhere,range,mode,layout,plans.cell,val,index);
    return (<div className={classes.divCustomRow} key={rowindex.toString()}>
	       {colvalues.map(mapFunction)}
	    </div>);
};
function renderZeroRow(classes,state,colkey,colvalues,plans) {
    return (<div className={classes.divCustomRow} key={1}>
	       <div className={classes.divCustomCell} width={plans.cell.width}>No data available</div>
	    </div>);
};
function DataRows(props) {
    const { classes, state, plans, colkey, colvalues, rowkey, rowvalues, mode, layout } = props;
    //console.log("Making data cols.",colkey,JSON.stringify(colvalues));
    var mapFunction= (val,index)=>dataRow(classes,state,colkey,rowkey,colvalues,mode,layout,plans,val,index);
    if (rowvalues.length===0) {
	return renderZeroRow(classes,state,colkey,colvalues,plans);
    } else {
	return (rowvalues.map(mapFunction));
    }
}
// ---------------- HDR
//
// ---------------- Details
function Details(props) {
    const { classes, state } = props; // classes, element
    var colkey = state.Path.getColKey(state)||"";
    var rowkey = state.Path.getRowKey(state)||"";
    var colvalues = state.Path.getValues(state,colkey).sort(function(a, b){return a-b});;
    var rowvalues = state.Path.getValues(state,rowkey).sort(function(a, b){return b-a});;
    var layoutMode  = state.Layout.getLayoutMode(state);
    var cellMode  = state.Layout.getCellMode(state);
    //var ncol=colvalues.length + 1;
    //var nrow=rowvalues.length + 1;
    //DOM.style.font
    var border=0;
    var width=0.9*window.innerWidth;
    var height=0.94*window.innerHeight - 100;
    var plans=state.Layout.makePlans(colkey,rowkey,colvalues,rowvalues,width,height,border);
    //console.log("Plans:",JSON.stringify(plans));
    //console.log("Heights:",window.innerHeight,height,plans.hdr.height,plans.cell.height);
    //console.log("Details => Width/Height:",window.innerWidth,window.innerHeight,plan.cell.width,plan.hdr.height)
    console.log("Colkey:",colkey," colval:",JSON.stringify(colvalues));
    console.log("Rowkey:",rowkey," rowval:",JSON.stringify(rowvalues));
    if (state.React.matrix === undefined) {
	var label="No data available."
	var plan=state.Layout.makePlan(label,width,height);
	return (<div className={classes.divEmpty}>
		   <CanvasText state={state} label={label} plan={plan}/>
		</div>);
    } else {
	return (<div className={classes.divCustom}>
		 <div className={classes.divCustomBody}>
	        <DataRows classes={classes} state={state} plans={plans} colkey={colkey} colvalues={colvalues} rowkey={rowkey} rowvalues={rowvalues} mode={cellMode} layout={layoutMode}/>
		 </div>
		</div>);
    }
}
class Custom extends Component {
    constructor(props) {
	super(props);
	const {state} = props;
	state.React.Custom=this;
	this._ismounted=false;
    };
    showCustom() {
	//console.log("Rebuilding custom.",this._ismounted);
	if (this._ismounted) {
	    this.forceUpdate();
	};
    };
    componentDidMount() { 
	this._ismounted = true;
        window.addEventListener("resize", this.updateWindowDimensions);
    }
    componentWillUnmount() {
	this._ismounted = false;
    }
    updateWindowDimensions = () => {
        this.width= window.innerWidth;
	this.height=window.innerHeight;
	this.bbx=this.el.getBoundingClientRect();
	//console.log("Width/Height:",this.width,this.height,this.bbx.width,this.bbx.height)
    };
    element(el) {
	if (el !== undefined && el !== null) {
	    this.el=el;
	    this.bbx=this.el.getBoundingClientRect();
	    //console.log("BBX width/height:",this.bbx.width,this.bbx.height);
	};
    };
    render() {
	const { classes, state } = this.props;
	//console.log("##### Rendering Custom.");
	var cls={button:classes.button};
	return (<div ref={el=>{this.element(el)}} className={classes.content}>
		   <Grid container spacing={0}>
		      <Grid item xs={12}> 
                         { <Paper className={classes.paper}>
		              <Details state={state} classes={classes} element={this}/>
                           </Paper>}
                      </Grid>
                   </Grid>
		   <Tooltip state={state} classes={cls} element={this} type={'cell'}/>
	        </div>);
    }
}

Custom.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Custom);
