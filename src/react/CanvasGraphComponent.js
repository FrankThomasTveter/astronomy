import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

//	width:"100%",
//	height:'100%',
//	minHeight:'100%',
const styles = theme => ({
    canvas: {
	overflow:"hidden",
	width:"100%",
	height:"100%",
	//margin:"0px",
	//padding:"0px",
	//border:"0px solid red",
    },
    pointer: {
	cursor:"pointer",
	padding: theme.spacing(0),
    },
    nopointer: {
	padding: theme.spacing(0),
    },
    div :{},
});
function drawThresholds(state,elements,colkey,colvalue,range,plan,level,ctx,height,offset,dwidth) {
    //console.log("Canvas:",xmin,dx);
    var elen=elements.length;
    //var maxlev=-1;
    //var minlev=0;
    var min=range[0]
    var max=range[1];
    var ee;
    // determine cnt, number of elements for this colvalue
    var cnt=0;
    for (ee=0;ee<elen;ee++) {   // loop over elements
	var el=elements[ee];
	var docs=el.docs;
	if (docs===undefined) {
	    console.log("Corrupt element:",JSON.stringify(el));
	} else {
	    var dlen=docs.length;
	    for (var jj=0;jj<dlen;jj++) {   // loop over segments in each element
		var d=docs[jj];
		var thr=d._thr;
		//console.log("Colvalue:",JSON.stringify(colvalue));
		if (colvalue==="" || colvalue===null || d[colkey]  === colvalue) {
		    var vals; // array of thresholds
		    if (thr.min !== undefined && thr.val !== undefined) {
			vals=thr.min;
		    }
		    if (thr.max !== undefined && thr.val !== undefined) {
			vals=thr.max;
		    }
		    if (vals !== undefined) {
			var vlen=vals.length;
			for (var ll=0;ll<vlen;ll++) {
			    var tyval=vals[ll];
			    var tzval=state.Show.scale(tyval,min,max,height,0);
			    var scolor=undefined;
			    if (ll === level) {
				scolor=state.Colors.getLevelFgColor(ll);
			    } else {
				scolor=state.Colors.getLevelBgColor(ll);
			    };
			    var xmin=offset+cnt*dwidth;
			    var xmax=offset+(cnt+1)*dwidth;
			    ctx.beginPath();
			    ctx.lineWidth=1;
			    if (scolor !== undefined) {ctx.strokeStyle=scolor;}
			    ctx.moveTo(xmin,tzval);
			    ctx.lineTo(xmax,tzval);
			    ctx.stroke();
			    //console.log("Stroke color:",sbgcolor,ll,tzval,cnv.width);
			}
		    };
		    if (thr.val !== undefined) {
			cnt=cnt+1;
		    }
		};
	    };
	};
    };
};
function drawData(state,elements,colkey,colvalue,range,plan,level,ctx,height,offset,dwidth) {
    //console.log("Canvas:",xmin,dx);
    var elen=elements.length;
    var maxlev=-1;
    var minlev=0;
    var min=range[0]
    var max=range[1];
    var ee;
    // determine cnt, number of elements for this colvalue
    var cnt=0;
    //console.log("Found ",elen," elements...");
    for (ee=0;ee<elen;ee++) {   // loop over elements
	var el=elements[ee];
	var docs=el.docs;
	if (docs===undefined) {
	    console.log("Corrupt element:",JSON.stringify(el));
	} else {
	    var dlen=docs.length;
	    for (var jj=0;jj<dlen;jj++) {   // loop over segments in each element
		var d=docs[jj];
		var thr=d._thr;
		if (colvalue==="" || colvalue===null || d[colkey]  === colvalue) {
		    //var vals;
		    //console.log("Making canvas:",ii,colvalues[ii],color,JSON.stringify(d),
		    //	    " Thr=",JSON.stringify(t),width,height,JSON.stringify(range));
		    //console.log("CanvasGraph:",ii,jj,d.dtg,color,el.maxlev,JSON.stringify(t));
		    var ymin=min;
		    if (thr.min !== undefined && thr.val !== undefined) {
			ymin=thr.val
		    }
		    var ymax=max;
		    if (thr.max !== undefined && thr.val !== undefined) {
			ymax=thr.val;
		    }
		    var xmin=offset+cnt*dwidth;
		    var xmax=offset+(cnt+1)*dwidth;
		    var zmin=state.Show.scale(ymin,min,max,height,0);
		    var zmax=state.Show.scale(ymax,min,max,height,0);
		    //console.log("Fill:",xmin,xmax,zmin,zmax,ymin,ymax,min,max,height);
		    //ctx.fillStyle="cornflowerblue";
                    var lev=state.Threshold.getLevel(state,d);
                    var col=state.Colors.getLevelFgColor(lev);
		    //console.log("Fill:",xmin,xmax,zmin,(zmax-zmin),height,col);
		    if (col !== undefined) {
			if (thr.level === undefined) { //  || Math.random() > 0.8

			    console.log("Found undefined:",JSON.stringify(d));

			    minlev=Math.min(minlev,-2);
			} else {
			    maxlev=Math.max(maxlev,thr.level);
			    minlev=Math.min(minlev,thr.level);
			};
			var dx=Math.max(1,xmax-xmin);
			var dz=zmax-zmin;
			ctx.strokeStyle=col;
			ctx.strokeRect(xmin,zmin,dx,dz);
		    } else {
			minlev=Math.min(minlev,-2);
		    }
		    if (thr.val !== undefined) {
			cnt=cnt+1;
		    };
		}
	    }
	};
    };
    if (minlev < 0) {
	return minlev;
    } else {
	return maxlev;
    }
};
function drawMarker(ctx,height,offset,width) {
    ctx.strokeStyle='blue';
    ctx.beginPath();
    ctx.moveTo(offset,0);
    ctx.lineTo(offset+width,height);
    ctx.moveTo(offset+width,0);
    ctx.lineTo(offset,height);
    ctx.strokeRect(offset,0,offset+width,height);
    ctx.stroke();
};
function updateCanvas(item) {
    const {state,elements,colkey,colvalues,index,range,plan,level} = item.props;
    const cnv=item.refs.canvas;        // canvas
    const ctx = cnv.getContext('2d');  // context
    //console.log("Canvas:",cnv.width,cnv.height);
    //console.log("Canvas matrix:",JSON.stringify(state.React.matrix));
    //console.log("Canvas range:",JSON.stringify(range),colkey,colvalues);
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    //var elen=elements.length;
    var clen=1; if (colvalues !== undefined) {clen=colvalues.length;}; // number of columns
    //console.log("Update plan:",JSON.stringify(plan),cnv.width,cnv.height);
    const step=plan.step;
    var height = cnv.height;
    var width = cnv.width/Math.max(1,step); // width of graph segment
    var minlev=0;
    if (range !== undefined) {
	// loop over column segments...
	//console.log("Segments:",index,clen,step,JSON.stringify(colvalues));
	for (var ii=index;ii<Math.min(index+step,clen);ii++) { // loop over segments
	    var tot=state.Utils.cntDocs(elements,colkey,colvalues[ii]);
	    //console.log("Canvas:",ii,index," val=",colvalues[ii]," tot=",tot," key=",colkey,JSON.stringify(elements));
	    var offset=(ii-index)*width;       // width/10;
	    var dwidth=width/Math.max(1,tot);
	    drawThresholds(state,elements,colkey,colvalues[ii],range,plan,level,ctx,height,offset,dwidth);
	    var lev=drawData(state,elements,colkey,colvalues[ii],range,plan,level,ctx,height,offset,dwidth);
	    minlev=Math.min(minlev,lev);
	}
    } else {
	minlev=-2;
    };
    if (item.invalid) { //minlev < 0
	drawMarker(ctx,cnv.height,0,cnv.width);
    }
};
class CanvasGraphComponent extends React.Component {
    componentDidMount() {
        updateCanvas(this);
    }
    componentDidUpdate() {
        updateCanvas(this);
    }
    render() {
        const { classes, onclick, title, plan, ...other } = this.props;
	//console.log("Rendering CanvasGraphComponent...");
	//console.log("Graph plan:",JSON.stringify(plan));
        return (
 		<canvas {...other} className={classes.canvas} classes={classes} onClick={onclick} title={title} 
 	            plan={plan} width={plan.width} height={plan.height-1} ref="canvas"/>
        );
    }
};


// width={plan.width} height={plan.height}

CanvasGraphComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CanvasGraphComponent);
