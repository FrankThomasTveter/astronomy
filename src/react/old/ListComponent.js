import React, {Component} from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

//import SummaryCell from './SummaryCell';
//import CanvasText  from './CanvasTextComponent';
//import Text        from './TextComponent';

//	overflow: 'hidden',

const styles = theme => ({
    dataset: {},
    content: {},
    root: {
	height: '100%',
    },
    button:{},
    buttonDisabled:{},
    paper: {
	tableLayout: 'fixed',
	padding:0,
	margin:0,
    },
    divTable :{
	display: 'table',
	width: '100%',
    },
    divTableRow:  {
	display: 'table-row',
    },
    divTableCell:{
	border: '0px solid #999999',
	display: 'table-cell',
	padding: '3px 3px',
    },
    divTableCellCursor:{
	cursor: "pointer",
	border: '0px solid #999999',
	display: 'table-cell',
	padding: '0px 0px',
    },
    divTableHead : {
	border: '0px solid #999999',
	display: 'table-cell',
	padding: '0px 0px',
    },
    divTableHeading : {
	display: 'table-header-group',
    },
    divTableHeadingCenter : {
	display: 'flex',
	justifyContent: 'center',
    },
    divTableFoot : {
	backgroundColor: '#DDD',
	display: 'table-footer-group',
	fontWeight: 'bold',
    },
    divTableBody : {
	display: 'table-row-group',
    }
});
// ---------------- DATA
function renderDataList(classes,state,doc,plan,skey,fgcolor,bgcolor,index){
    if (doc===undefined) {
	return <div className={classes.divTableCell} style={{backgroundColor:'#EEE'}}/>
    } else {
	var val=doc[skey];
	var where=state.Database.getWhereValue(skey,val);
	var range;
	var title=state.Matrix.getTooltipTitle(state,doc,skey); // get threshold... ala 
	var onClick=()=>{state.Navigate.selectKeys(state,skey,val,range,where,1);};
	if (val === undefined) {val="";};
	//console.log("Key:",skey," Val:",JSON.stringify(val),JSON.stringify(doc[skey]));
	return (
		<div className={classes.divTableCell} style={{color:fgcolor,backgroundColor:bgcolor,cursor: "pointer"}} key={skey} onClick={onClick} title={title}>
		{val}
	    </div>
	);
    }
};
function renderDoc(classes,state,skeys,plan,doc,index) {
    //console.log("We have a matrix(",rowval,") with range:",JSON.stringify(range));
    //var lev=doc.level;
    var lev=doc.__lev;
    var bgcolor=state.Colors.getLevelBgColor(lev);
    var fgcolor=state.Colors.getLevelFgColor(lev);
    var mapFunction= (skey,index)=>renderDataList(classes,state,doc,plan,skey,fgcolor,bgcolor,index);
    return (<div className={classes.divTableRow} key={index.toString()}>
	    {skeys.map(mapFunction)}
	    </div>);
};
function getDataRowList(classes,state,skeys,plans) {
    const items=[];
    const docs=[];
    var matrix=state.React.matrix;
    //var ret=null;
    if (matrix!==undefined) {
	var elements=state.Matrix.getMatrixElements(state,matrix);
	elements.forEach( element => {
	    if (element !== undefined && element.docs !== undefined) {
		let lev=element.maxlev;
		element.docs.forEach((doc)=>{doc.__lev=lev;});
		docs.push.apply(docs,element.docs);
	    };
	});
    };
    // sort
    if (state.Path.shouldSort()) {
	var key=state.Path.getSortKey();
	var dir=state.Path.getSortDir();
	if (state.Path.isNumeric(key)) {
	    //console.log("Numeric sort:",key);
	    if (dir) { // ascending
		docs.sort((a,b) => b[key]-a[key]);
	    } else {
		docs.sort((a,b) => a[key]-b[key]);
	    }
	} else {
	    if (dir) { // ascending
		docs.sort((a,b) => {return (a[key] > b[key])?-1:((a[key]===b[key])?0:+1);});
	    } else {
		docs.sort((a,b) => {return (a[key] > b[key])?+1:((a[key]===b[key])?0:-1);});
	    }
	};
    }
    // make react-components...
    var mapFunction=(doc,index) =>renderDoc(classes,state,skeys,plans.cell,doc,index);
    items.push(docs.map(mapFunction));
    //console.log("Docs:",JSON.stringify(docs));
    return items;
};
// ---------------- HDR
function renderHdrList(classes,state,plan,val,index) {
    //console.log("HdrCell:",val);
    var up="↑";
    var down="↓";
    var label=val;
    var dir;
    if (state.Path.sortKey(val)) {
	dir=state.Path.sortDirUp(val)
	if (dir) {
	    label=label + up;
	} else {
	    label=label + down;
	}
    }
    var cursor=classes.divTableCell;
    var onClick=() => {state.Path.setSortKey(val);state.Show.showMatrix(state,state.React.matrix,true);};
    return (<div className={cursor} style={{backgroundColor:'#DDD',cursor: "pointer",}} key={`col-${index}`} onClick={onClick}>
	    {label}
 	    </div> );
}
function HdrRow(props) {
    const { classes, state, plans, skeys } = props; //, rowvalues, label, cellMode
    var mapFunction= (val,index)=>renderHdrList(classes,state,plans.col,val,index);
    //console.log("Making header List row.",JSON.stringify(skeys));
    return (<div className={classes.divTableRow} key={'hdr'}>
	    {skeys.map(mapFunction)}
	    </div>);
}
// ---------------- Details
function Details(props) {
    const { classes, state } = props; // classes, 
    var cellMode  = state.Layout.getCellMode(state);
    if (state.React.matrix === undefined) {
	return (<div className={classes.divTable}>
		   <div className={classes.divTableBody}>
		      <div className={classes.devTableCell}>
		         {"No Matrix defined"}
		      </div>
		   </div>
		</div>
	       );
    } else {
        var skeys = state.Path.getVisibleKeys(state);
	//console.log("Skeys:",skeys);
 	//DOM.style.font
	var border=2;
	var label="";
	var width=0.9*window.innerWidth;
	var height=0.94*window.innerHeight - 180;
	//var height=0.8*(window.innerHeight-200);
	var plans=state.Layout.makePlans(label,[""],[""],width,height,border,cellMode);
	var items=getDataRowList(classes,state,skeys,plans);
	//console.log("Details => Width/Height:",window.innerWidth,window.innerHeight,plan.cell.width,plan.hdr.height)
	return (<div className={classes.divTable}>
		   <div className={classes.divTableBody}>
		      <HdrRow classes={classes} state={state} key={"hdr"} plans={plans} label={label} cellMode={cellMode} skeys={skeys}/>
		      {items}
		   </div>
		</div>
	       );
    }
};

class List extends Component {
    componentDidMount() {
        window.addEventListener("resize", this.updateWindowDimensions);
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
	//console.log("##### Rendering List.");
	return (<div ref={el=>{this.element(el)}} className={classes.root}  style={{width: '100%', height: '100%'}}>
		 <Grid container>
		  <Grid item xs={12} > 
                   { <Paper className={classes.paper}>
		       <Details state={state} classes={classes} element={this}/>
                     </Paper>}
                  </Grid>
                 </Grid>
	        </div>);
	}
}

List.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(List);
