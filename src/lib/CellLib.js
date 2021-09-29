function Cell() {
    this.bdeb=false;
    this.selectValues=function(colvalues,index,step) {
	var ret=[];
	if (Array.isArray(colvalues)) {
	    var clen=colvalues.length;
	    if (index === undefined) {index=0;};
	    if (step === undefined) {step=clen;};
	    for (var kk=index;kk<Math.min(clen,index+step);kk++) {
		ret.push(colvalues[kk]);
            }
	};
	return ret;
    };
    this.getColWhere=function(state,key,values,index,step) {
	var vals=this.selectValues(values,index,step);
	var vlen=vals.length;
	var where="";
        for (var kk=index;kk<vlen;kk++) {
	    if (where !== "") {where=where + " or ";}
	    where=where + state.Database.getWhereValue(key,vals[kk]);
        };               
	return where;
    };
    this.getElements=function(state,matrix,colkey,rowkey,colvalues,rowval,index,step) {
	var elements=[];
	var m=matrix;
	//console.log("Matrix:",JSON.stringify(m));
	if (m !== undefined && m !== null) {
	    if (index === undefined) {index=0;}
	    if (step === undefined) { step=1;};
	    // get elements
	    var keys=[colkey,rowkey];
	    var vals=[this.selectValues(colvalues,index,step),[rowval]];
	   // console.log("getElements keys:",JSON.stringify(keys),
	   // 		" vals:",JSON.stringify(vals));
	    elements=state.Matrix.getMatrixElements(state,m,keys,vals)||[];
	}
	//console.log("Elements:",colkey,"=",JSON.stringify(colvalues),":",rowkey,"=",rowval,":",index,plan.step,' =>',JSON.stringify(elements));
	return elements;
    };
    this.addTooltip=function(state,data) {
	//data={rowkey,rowval,colkey,colvalues,index,step,layout}
	if (this.bdeb) {console.log("Updated Matrix with tooltip.",JSON.stringify(data));};
	//console.log("Map:",JSON.stringify(data.map),JSON.stringify(data.layout));
	var m=state.React.matrix;
	if (m === undefined || m === null || data === undefined || data === null) {
	    console.log("No data available...",data);
	} else {
	    // get elements
	    var keys=data.keys;
	    var vals=data.vals;
	    var elements=state.Matrix.getMatrixElements(state,m,keys,vals)||[];
	    var lene=elements.length;
	    //console.log("AddTooltip elements:",lene,JSON.stringify(keys),JSON.stringify(vals));
	    for (var ee=0; ee<lene; ee++) {
		// check if elements have tooltip set
		if (elements[ee].tooltip===undefined) {
		    //console.log("AddTooltip:",JSON.stringify(data));
		    var layout=data.layout;
		    state.Matrix.addElementTooltip(state,elements[ee],layout);
		}
	    };
	}
    };
    this.getTooltipInfo=function(state,data) {
	// get elements
	var elements;
	var available;
	var m=state.React.matrix;
	if (m === undefined || m === null || data === undefined || data === null) {
	    console.log("No data available...");
	} else  {
	    //console.log("Data keys:",JSON.stringify(Object.keys(data)));
	    //console.log("Data:",JSON.stringify(data));
	    elements=state.Matrix.getMatrixElements(state,m,data.keys,data.vals);
	    // loop over elements	
	    var lene=elements.length;
	    available=(lene>0);
	    //console.log("Elements:",lene,available,JSON.stringify(data));
	    for (var ee=0; ee<lene; ee++) {
		// check if elements have tooltip set
		if (elements[ee].tooltip===undefined) {
		    available=false;
		}
		//console.log("Element:",ee,JSON.stringify(elements[ee]),lene);
	    };
	}
	var info=state.Matrix.getTooltipInfo(state,elements);
	info.available=available;
	return info;
    };
    this.getClickableTooltipKeys=function(state,data) {
	var click=[];
	if (data.keys !== undefined) {state.Utils.cpArray(click,data.keys)};
	state.Utils.cpArray(click,state.Path.tooltip.click);
	return click;
    }
    this.getTooltipKeys=function(state,data,tooltip) {
	var keys=[];
	if (data.keys !== undefined) {state.Utils.cpArray(keys,data.keys)};
	state.Utils.cpArray(keys,state.Path.tooltip.keys);
	// state.Utils.remArray(keys,state.Path.keys.path);
	// remove "unique" keys from the path
	var path=state.Path.keys.path
	var lent=path.length;
	for (var ii=0;ii<lent;ii++) {
	    var ind=keys.indexOf(path[ii]);
	    // check if path has only 1 value...
	    var vals=state.Path.select.val[path[ii]]
	    if (vals === undefined || vals.length!==1) {ind=-1;} // include multiple vals...
	    if (ind!==-1) {
		keys.splice(ind,1);
	    }
	};
	keys=state.Utils.keepHash(keys,tooltip);
	return keys;
    }
    this.getCellWhere=function(state,el,colval,rowval,mode) {
	var del="'";
	var where = state.Database.getWhere(state);
	//console.log("Element:",JSON.stringify(el));
	var colkey= state.Path.getColKey(state);
	var rowkey= state.Path.getRowKey(state);
	if (el !== undefined) {
	    if (mode === undefined ||  ! state.Custom.mapHasCells(state,mode)) {
		rowval=this.getRowVal(state,el.values);
		colval=this.getColVal(state,el.values);
		if (colkey.substring(0,1)==="_" && rowkey.substring(0,1)==="_") {del="";}; // numerical value
	    }
	    if (rowkey !== undefined && rowkey !== "") {
		where=state.Database.addWhere(where,rowkey+"="+del +rowval+del);
	    };
	    if (colkey !== undefined && colkey !== "") {
		where=state.Database.addWhere(where,colkey+"="+del+ colval+del);
	    };
	};
	//console.log("Where:",where,JSON.stringify(state.React.matrix));
	//console.log("Data:",mode,JSON.stringify(state.Database.db.tables.alarm));
	return where;
    };
};
export default Cell;
