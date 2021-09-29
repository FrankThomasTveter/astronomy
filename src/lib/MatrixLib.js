//console.log("Loading MatrixLib.js");

function Matrix() {
    this.bdeb=false;
    this.cnt=0;
    this.keyCnt={};
    this.values={};
    this.limit=100;     // displayed data
    this.popSingle=2000;//0000;
    this.popSeries=2000;//0000;
    this.maxLevel=-1;
    this.showLevels=1; // level shown in tooltip
    this.init=function(state){
	//var par="Matrix";
	//state.Utils.init(par,this);
    };
    this.initKeyCnt=function(state) {
	this.values={};
	this.keyCnt={};
    };
    this.getShowLevels=function(state) {
	return state.Matrix.showLevels;
    };
    this.setShowLevels=function(state,lev) {
	state.Matrix.showLevels=lev;
    };
    this.getLevels=function(state) {
	//console.log("Matrix maxLevel:",state.Matrix.maxLevel);
	var ret=[];
	for (var ii=0; ii<= state.Matrix.maxLevel;ii++) {
	    ret.push(ii);
	}
	return ret;
    };
    this.cntKey=function(state,key,nrec,where) {
	var val;
	if (this.values[key]  === undefined) {
	    this.keyCnt[key]=0;
	    this.values[key]=[];
	}
	if (state.Path.ignore.indexOf(key)  === -1 && key !== "") {//ignore special words... 
	    var tcnt=0;
	    var docs=state.Database.getKeyCnt(state,key,where)
	    //console.log("Count:",sql,JSON.stringify(docs));
	    var dlen = docs.length;
	    for (var jj = 0; jj < dlen; jj++) {
    		var doc=docs[jj];
    		val=doc[key];
		var cnt=doc.cnt;
		if (val !== undefined) {
		    //console.log("Found key:",key,this.getDocVal(state,doc,key));
    		    this.keyCnt[key]=this.keyCnt[key]+cnt;
		    this.values[key].push(val);
		    tcnt=tcnt+cnt;
		}
	    };
	    if (tcnt < nrec) { // insert undefined...
		val="";
		this.values[key].push(val);
	    };
	} else if (key === "") {
	    console.log("Key error...",new Error().stack);
	}
    };
    this.makeKeyCntMapAreaSql=function(state,where,nrec) {
	var keys=state.Path.getActiveKeys(state);
	state.Utils.cpArray(keys,["lat","lon","level","rank","unit"]);
	if (keys !== undefined) {
	    var plen = keys.length;
	    for (var ii = 0; ii < plen; ii++) {
		var key=keys[ii];
		if (key !== undefined && key !== null && key !== "" && key.substr(0,1) !== "_") {
		    this.cntKey(state,key,nrec,where);
		}
	    }
	};
	this.setMapArea(state,where);
    };
    this.updateKeyCnt=function(state,key){
	if (this.keyCnt[key]  === undefined) {
    	    this.keyCnt[key]=1;
	    this.values[key]=[];
	} else {
    	    this.keyCnt[key]++;
	}
	//console.log("Update key cnt:",key,this.keyCnt[key]);
    };
    this.updateValues=function(state,key,val) {
	 // check if value not in range
	if (state.Path.ignore.indexOf(key)  === -1 && key !== "" &&
	    val !== undefined && this.values[key].indexOf(val)  === -1 ) {
		//console.log("Checking val=",JSON.stringify(val)," key=",key," doc=",JSON.stringify(doc));
		//console.log("range=",state.Utils.toString(state.Path.keys.trash));
    		this.values[key].push(val);
	};
    }

    // add "undefined" range of keys that are not present in every doc...
    this.addUndefinedKeyCnt=function(state,docs){
	var dlen = docs.length;
	for (var key in this.keyCnt) {
	    if (this.keyCnt[key] < dlen) {
		var val="";
		this.values[key].push(val);
	    }
	}
    };
    // parent path keys are always present (undefined parents can be used)...
    this.addUndefinedKeyCntValues=function(state) {
	var plen = state.Path.keys.path.length;
	for (var ii = 0; ii < plen; ii++) {
	    var key=state.Path.keys.path[ii];
	    if (this.keyCnt[key]  === undefined) {
    		this.keyCnt[key]=0;
		this.values[key]=[];
	    }
	}
    };
    this.makeKeyCntMapArea=function(state,docs) {
	//console.log("Visible keys:",JSON.stringify(keys));
	var key;
	var maxlat,minlat,maxlon,minlon;
	var dlen = docs.length;
	//console.log("MakeKeyCntMapArea:",dlen);
	for (var ii = 0; ii < dlen; ii++) {
    	    var doc=docs[ii];
    	    //var vals=[];
	    var dkeys=Object.keys(doc);
	    if (dkeys.indexOf("unit") === -1 ) {state.Utils.cpArray(dkeys,["unit"]);}
	    if (dkeys.indexOf("lat") === -1 ) {state.Utils.cpArray(dkeys,["lat"]);}
	    if (dkeys.indexOf("lon") === -1 ) {state.Utils.cpArray(dkeys,["lon"]); }
	    if (dkeys.indexOf("level") === -1 ) {state.Utils.cpArray(dkeys,["level"]); }
	    if (dkeys.indexOf("rank") === -1 ) {state.Utils.cpArray(dkeys,["rank"]); }
	    var lend=dkeys.length;
	    for (var kk=0;kk<lend;kk++) {
		key=dkeys[kk];
		var val=this.getDocVal(state,doc,key);
		if (val !== undefined) {
		    this.updateKeyCnt(state,key);
		    this.updateValues(state,key,val)
		    if (key  === "lat") {
			if (maxlat  === undefined) {
			    maxlat=val
			}else {
			    maxlat=Math.max(val,maxlat)
			};
			if (minlat  === undefined) {
			    minlat=val
			}else {
			    minlat=Math.min(val,minlat)
			};
			this.updateKeyCnt(state,"_lat");
		    } else if (key  === "lon") {
			if (maxlon  === undefined) {
			    maxlon=val
			}else {
			    maxlon=Math.max(val,maxlon)
			};
			if (minlon  === undefined) {
			    minlon=val
			}else {
			    minlon=Math.min(val,minlon)
			};
			this.updateKeyCnt(state,"_lon");
		    }
		}
    	    };
	    //console.log("Trash doc=",ii,JSON.stringify(doc),minlat,maxlat,minlon,maxlon);
	}
	state.Grid.setArea(minlat,maxlat,minlon,maxlon);
	return;
    };
    this.setMapArea=function(state,where) {
	var docs=state.Database.getDocsCnt(state,where);
	var dlen=docs.length;
	for (var ii = 0; ii < dlen; ii++) {
    	    var doc=docs[ii];
	    var minlon=this.getDocVal(state,doc,"minlon");
	    var maxlon=this.getDocVal(state,doc,"maxlon");
	    var minlat=this.getDocVal(state,doc,"minlat");
	    var maxlat=this.getDocVal(state,doc,"maxlat");
	    state.Grid.setArea(minlat,maxlat,minlon,maxlon);
	    if (this.bdeb) {console.log("setMapArea:",JSON.stringify(state.Grid.area),JSON.stringify(doc));};
	}
    }
    this.makeMapRange=function(state){
	const distinct=(value, index, self) => {
	    return self.indexOf(value) === index;
	};
	var lats, lons;
	//var layoutMode=state.Layout.getLayoutMode(state);
	// var map=state.Custom.getMap(state,layoutMode);
	// if (map !== undefined && map.cells !== undefined) {
	//     //console.log("Found custom map...",JSON.stringify(map));
	//     lats=state.Custom.getLats(state,map);
	//     lons=state.Custom.getLons(state,map);
	// } else {
	    lats=state.Grid.getLats(state);
	    lons=state.Grid.getLons(state);
	// };
	lats=lats.filter(distinct); lats=lats.sort();
	this.values["_lat"]=lats;
	lons=lons.filter(distinct); lons=lons.sort();
	this.values["_lon"]=lons;
	//console.log("Made lat values... ",JSON.stringify(lats));
	//console.log("Made lon values... ",JSON.stringify(lons));
    };
    this.hasSelected=function(state) {
	var keys=state.Path.keys.path;
	var klen=keys.length;
	return (klen>0);
    };
    this.checkSelected=function(state,doc,ignore) {
	var keys=state.Path.keys.path;
	var values=state.Path.select.val;
	var ranges=state.Path.select.range;
	var klen=keys.length;
	for (var kk=0 ;kk<klen;kk++) {
	    var key=keys[kk];
	    var vals=values[key];
	    var range=ranges[key];
	    var val=doc[key];
	    if (range !== undefined) {
		if (val <= range[0] && val > range[1]) {
		    //console.log("Out of range...",val,key);
		    return false;
		}
	    } else if (val === undefined) {
		//console.log("No value...",val,key);
		if (ignore === undefined) {
		    return false;
		};
	    } else if (vals.indexOf(val) === -1) {
		//console.log("Wrong value...",val,key);
		return false;
	    }
	};
	return true;
    };
    this.setCntLatLon=function(state,cntdocs,docs) {
	var m={};
	// get max/min positions
	var dlen = docs.length;
	for (var ii = 0; ii < dlen; ii++) {
    	    var doc=docs[ii];
	    if (this.checkSelected(state,doc)) {
		this.makeMatrixElement(state,m,doc);
	    }
	};
	// set max/min positions	
	//console.log("Found latlon matrix:",JSON.stringify(m),dlen);
	var clen = cntdocs.length;
	for (var jj = 0; jj < clen; jj++) {
    	    var cntdoc=cntdocs[jj];
	    //console.log("cntdoc:",JSON.stringify(cntdoc));
	    var el=this.getMatrixElement(state,m,cntdoc);
	    if (el !== undefined) {
		cntdoc.lat=el.lat;
		cntdoc.lon=el.lon;
		//console.log(">>>>> Setting element:",JSON.stringify(cntdoc));
	    } else if (this.bdeb) {
		var vals=state.Path.getTableVals(state,cntdoc);
		console.log("No element for:",JSON.stringify(vals)," (",JSON.stringify(state.Path.other.table),")");
	    }
	}
    };
    this.addMapAreaKeys=function(state,docs) {
	// var layoutMode=state.Layout.getLayoutMode(state);
	// var map=state.Custom.getMap(state,layoutMode);
	var dlen,ii,doc,ilat,ilon;
	// if (map !== undefined && map.cells !== undefined) {
	//     dlen = docs.length;
	//     for (ii = 0; ii < dlen; ii++) {
    	// 	doc=docs[ii];
	// 	var cell=state.Custom.findCell(state,map,doc);
	// 	if (cell !== undefined) {
	// 	    ilat=state.Custom.getCellRow(state,cell);
	// 	    ilon=state.Custom.getCellCol(state,cell);
	// 	    doc._lat=ilat
	// 	    doc._lon=ilon
	// 	    this.updateKeyCnt(state,"_lat");
	// 	    this.updateKeyCnt(state,"_lon");
	// 	}
	//     }
	// } else {
	    dlen = docs.length;
	    for (ii = 0; ii < dlen; ii++) {
    		doc=docs[ii];
    		//var vals=[];
		//var lat=docs["lat"];
		var latpos=state.Grid.latToPos(state,doc.lat);
		ilat=state.Grid.posToLat(state,latpos);
		//console.log("Lat:",doc.lat,latpos,ilat);
		//var lon=docs["lon"];
		var lonpos=state.Grid.lonToPos(state,doc.lon);
		ilon=state.Grid.posToLon(state,lonpos);
		doc._lat=ilat
		doc._lon=ilon
		this.updateKeyCnt(state,"_lat");
		this.updateKeyCnt(state,"_lon");
		//console.log("AddMapAreaKeys=",doc.lon,lonpos,ilon,doc._lon);
	    }
         // }
    };
    this.makeMatrixCntMap=function(state,cntDocs,matrix) {
	//console.log("MatrixCnt:",JSON.stringify(cntDocs));
	//var lonmin,lonmax,latmin,latmax;
	state.Matrix.maxLevel=-1;
	state.Matrix.maxRank=-1;
	state.Matrix.ltooltip=false;
	var found=false;
	var dlen=cntDocs.length;
	for (var ii = 0; ii < dlen; ii++) {
    	    var doc=cntDocs[ii];
	    var cnt=this.getDocVal(state,doc,"cnt");
	    var maxlev=this.getDocVal(state,doc,"maxlev");
	    var maxrank=this.getDocVal(state,doc,"maxrank");
	    //console.log("Cnt item:",maxlev,state.Matrix.maxLevel,JSON.stringify(doc));
	    if (maxlev > state.Matrix.maxLevel || maxrank > state.Matrix.maxRank){
		state.Matrix.maxLevel=maxlev;
		state.Matrix.maxRank=maxrank;
	    };
	    var minlev=this.getDocVal(state,doc,"minlev");
	    var svgid=state.Svg.getId(state,doc);
    	    //console.log ("Processing:",JSON.stringify(doc),maxlev,minlev,cnt);
    	    var arr=this.makeMatrixElement(state,matrix,doc);
    	    // update matrix array element
	    if (maxlev >= 0) { found=true;}
	    if (arr !== undefined) {
		if (arr.maxlev===undefined || arr.maxlev < maxlev || arr.maxrank < maxrank) {
		    arr.maxlev=maxlev;
		    arr.maxrank=maxrank;
		    arr.svgid=svgid;
		    arr.svgcnt=cnt;
		} else if ( arr.svgcnt===undefined || (arr.svgcnt < cnt && arr.maxlev===maxlev && arr.maxrank < maxrank)) {
		    arr.maxrank=maxrank;
		    arr.svgid=svgid;
		    arr.svgcnt=cnt;
		};
		if (arr.minlev===undefined || arr.minlev > minlev) {arr.minlev=minlev;}
		if (arr.maxrank===undefined || arr.maxrank < maxrank) {arr.maxrank=maxrank;}
		if (arr.cnt===undefined) {arr.cnt=0;};
		arr.cnt=arr.cnt+cnt;
		arr.def=0;
		//arr.docs=[];
    		//console.log ("Array:",JSON.stringify(arr));
	    }
	    // 	state.Grid.setArea(minlat,maxlat,minlon,maxlon);
	}
	//console.log("Cnt maxLevel:",state.Matrix.maxLevel);
	if (! found) {
	    console.log("No valid data available for Matrix.");
	    state.Html.setFootnote(state,"No data with valid threshold was found.");
	}
	if (state.Layout.state.tooltip === 1) { // pre-generate all tooltips
	    state.Matrix.addAllTooltip(state,matrix);
	};
    };
    this.makeMatrix=function(state,docs,matrix) {
	state.Matrix.maxLevel=-1;
	state.Matrix.maxRank=-1;
	state.Matrix.ltooltip=true;
	var found=false;
	//var svgkey=state.Svg.getKey(state);
	//var pos=[];
	var dlen=docs.length;
	for (var ii = 0; ii < dlen; ii++) {
    	    var doc=docs[ii];
	    //console.log("Found doc:",doc["lon"],doc["lat"])
    	    // find matrix array element
    	    var arr=this.makeMatrixElement(state,matrix,doc);
    	    // update matrix array element
    	    //console.log ("Processing:",JSON.stringify(doc));
	    var dlev=state.Threshold.getLevel(state,doc);
	    var drank=state.Threshold.getRank(state,doc);
	    //console.log("Level and Rank:",dlev,drank,JSON.stringify(doc));
	    if (dlev === undefined) {dlev=-2;};
	    if (dlev >= 0) { found=true;}
	    if (dlev > state.Matrix.maxLevel || drank > state.Matrix.maxRank) {
		state.Matrix.maxLevel=dlev;
		state.Matrix.maxRank=drank;
	    };
	    var svgid=state.Svg.getId(state,doc);
    	    this.updateMatrixElement(state,arr,dlev,drank,svgid,doc);
	}
	if (! found) {
	    state.Html.broadcast(state,"No valid data found.",'warning');
	    console.log("No valid data available for Matrix.");
	    state.Html.setFootnote(state,"No data with valid threshold was found.");
	}
	//console.log("Maxlev:",state.Matrix.maxLevel,state.Matrix.maxRank);	
	//console.log ("makeMatrix tooltip-keys:",JSON.stringify(state.Path.tooltip));
	//console.log ("makeMatrix:",JSON.stringify(matrix));
    };
    this.setSelectParameters=function(state,m,vals) {
	m.keys=state.Utils.cp(state.Path.other.table);
	m.values={};
	m.ranges={};
	m.where={};
	var lenk=m.keys.length;
	for (var kk=0;kk<lenk;kk++) {
	    var key=m.keys[kk];
	    if (key==="_lat") {
		var ilat=m.values[key];
		m.keys[kk]="lon";
		m.latRange=state.Grid.getLatRange(state,ilat);
		m.ranges[m.keys[kk]]=m.latRange;
		m.where[m.keys[kk]]=state.Grid.getLatWhere(state,m.keys[kk],m.ranges[m.keys[kk]]);
	    } else if (key==="_lon") {
		var ilon=m.values[key];
		m.keys[kk]="lon";
		m.lonRange=state.Grid.getLonRange(state,ilon);
		m.ranges[m.keys[kk]]=m.lonRange;
		m.where[m.keys[kk]]=state.Grid.getLonWhere(state,m.keys[kk],m.ranges[m.keys[kk]]);
	    } else {
		m.values[key]=vals[kk];
		m.where[key]=state.Database.getWhereValue(key,vals[kk]);
	    }
	};
    };
    this.makeMatrixElement=function(state,matrix,doc) {
	var vals=state.Path.getTableVals(state,doc);
	var lenv=vals.length;
	var m=matrix;
	var first=(lenv===0 && Object.keys(m).length===0);//no keys...
	//console.log("MakeMatrixElement vals:",JSON.stringify(vals));
	//console.log("Initial Matrix:",JSON.stringify(m));
	for (var ii=0; ii < lenv; ii++ ) {
	    var val=vals[ii];
	    if (m[val] === undefined) {first=true;m[val]={};};
	    m=m[val];
	};
	if (first) {
	    //console.log("Setting first pars:",JSON.stringify(doc));
	    this.setSelectParameters(state,m,vals)
	    m.lat=doc.lat;
	    m.lon=doc.lon;
	    m.rank=doc.rank;
	    m.slat=0;
	    m.slon=0;
	    m.scnt=0;
	} else if (m.rank < doc.rank) {
	    m.lat=doc.lat;
	    m.lon=doc.lon;
	    m.rank=doc.rank;
	}
	m.slat=m.slat+doc.lat;
	m.slon=m.slon+doc.lon;
	m.scnt=m.scnt+1;
	//console.log("Final Matrix:",JSON.stringify(m));
	return m;
    };
    this.getMatrixElement=function(state,matrix,doc) {
	var vals=state.Path.getTableVals(state,doc);
	//console.log("Search for:",JSON.stringify(Object.keys(vals)));
	var lenv=vals.length;
	var m=matrix;
	for (var ii=0; ii < lenv; ii++ ) {
	    var val=vals[ii];
	    if (m[val] === undefined) {
		//console.log("Did not find:",val,"(",JSON.stringify(Object.keys(m)),")");
		return;
	    } else {
		//console.log("Did find:",val,"(",JSON.stringify(Object.keys(m)),")");
		m=m[val];
	    }
	};
	return m;
    };
    this.getMatrixElements=function(state,matrix,keys,kvals,pos) {
	//console.log("getMatrixElements table:",JSON.stringify(state.Path.other.table));
	//console.log("getMatrixElements Entering:",JSON.stringify(keys),
	//	    " kvals:",JSON.stringify(kvals),pos,
	//	    " tb:",JSON.stringify(state.Path.other.table));
	var els=[];
	if (keys===undefined) {keys=[];}
	if (kvals===undefined) {kvals=[];}
	if (pos===undefined) {pos=0;}
	var lel;
	if (matrix === undefined || state.Path.other === undefined) {return els;};
	var m=matrix;
	var lpos=(state.Path.other.table.length);
	//console.log("getMatrixElements pos:",pos,lpos);
	if (pos >= lpos) {
	    els.push(m);
	} else {
	    var key=state.Path.other.table[pos];
	    var kid=keys.indexOf(key);
	    var vals=kvals[kid]||[];
	    if (kid === -1 || vals.length===0) {
		vals=Object.keys(m);
	    }
	    //console.log("getMatrixElements Process=",key," vals=",JSON.stringify(vals),kid);
	    var lenv=vals.length;
	    for ( var jj=0 ;jj < lenv; jj++) {
		var val=vals[jj];
		lel=this.getMatrixElements(state,m[val],keys,kvals,pos+1);
		if (lel !== undefined) {
		    state.Utils.cpArray(els,lel);
		};
	    };
	};
	//console.log("getMatrixElements els:",JSON.stringify(els));
	return els;
    };
    this.printElements=function(matrix) {};
/////////////////////
    this.isTooltipDoc=function(state,doc,maxlev) {
	var dlev=state.Threshold.getLevel(state,doc);
	if (dlev <= maxlev) { // return true if undefined...
	    return false;
	} else {
	    return true;
	};
    }
    this.isInterestingTooltipDoc=function(state,docs,doc,dlev,drank) {
	if ((dlev > 0  &&
	     dlev < state.Threshold.getMaxLevel(doc) && 
	     docs.length < 3) || docs.length < 1) {
	    return true;
	} else {
	    return false;
	};
    }
    this.getDocVal=function(state,doc,key) {
	if (key === undefined || key === null) { return null; };
	var val = doc[key];if (val  === undefined) {val="";};return val;
    };
    this.updateMatrixElement=function(state,arr,dlev,drank,svgid,doc) { // called once for every hit
	if (arr  === undefined) {
	    console.log("Undefined matrix element.");
	    return;
	};
	var nn=arr.cnt||0;
	var dd=arr.def||0;
	if (arr.maxlev  === undefined || arr.maxlev === -1 ||
	    (dlev !== -1 && arr.maxlev < dlev) ||
	    arr.maxrank  === undefined || arr.maxrank === -1 ||
	    (drank !== -1 && arr.maxrank < drank)) {
	    arr.maxlev=dlev;
	    arr.maxrank=drank;
	    arr.svgid=svgid;
	    arr.svgcnt=1;
	} else if (arr.svgcnt===undefined || arr.maxlev===dlev) {
	    arr.svgid=svgid;
	    arr.svgcnt=1; // oh well, just use the icon from the last one...
	};
	if (arr.minlev === undefined || (arr.minlev > dlev)) {
	    arr.minlev=dlev;
	};
	if (arr.docs === undefined) {arr.docs=[];};
	arr.cnt=nn+1;
	//console.log("Matrix doc:",JSON.stringify(doc),dlev);
	if (doc._thr !== undefined && doc._thr.val !== undefined) {
	    arr.def=dd+1;
	    if (arr.def <= this.limit) {arr.docs.push(doc);};
	} else if (nn === dd) { // make sure at least 1 undef is added...
	    arr.docs.push(doc);
	}
	//if (state.Layout.state.tooltip === 1) {
	//var drank=state.Threshold.getRank(state,doc);	
	if (arr.tooltip === undefined) {arr.tooltip={};};
	var el=this.getTooltipElement(state,arr.tooltip,doc);
	if ( dlev !== -1 &&
	     ((el.maxrank === undefined && el.maxlev === undefined) || 
	      (el.maxlev < dlev || (el.maxlev===dlev && el.maxrank < drank)))
	   ) {
	    el.maxlev=dlev;
	    el.maxrank=drank;
	    el.docs=[];
	    el.docs.push(doc);
	    //console.log("Resetting doc:",dlev,drank,el.docs.length);
	} else if (el.maxlev === dlev && el.maxrank === drank && dlev > 0) {
	    if (this.isInterestingTooltipDoc(state,el.docs,doc,dlev,drank)) {
		el.docs.push(doc);
		//console.log("Adding doc:",dlev,drank);
	    };
	};
	//}
	//console.log ("Updating:",JSON.stringify(arr),dlev,rank,JSON.stringify(doc));
    };
    this.getTooltipElement=function(state,tooltip,doc) {
	var ret=tooltip;
	var keys=state.Path.tooltip.select;
	var lenk=keys.length;
	//console.log("Select-keys: ",lenk,JSON.stringify(keys));
	for (var ii=0;ii < lenk;ii++) {
	    var key=keys[ii];
	    var val=doc[key];
	    if (ret[val]=== undefined) {ret[val]={};};
	    ret=ret[val];
	    //console.log("Selecting: ",ii,key,val,JSON.stringify(ret));
	};
	return ret;
    };
    this.getRange=function(state,element) {
	var range;
	if (element !== undefined) {
	    //console.log("Looking for range:",ii,"='",colvalues[ii],"' ",
	    //                                jj,"='",rowvalues[jj],"'",
	    //	    JSON.stringify(element));
	    var docs=element.docs;
	    if (docs !== undefined) {
		var dlen = docs.length;
		for (var dd = 0; dd < dlen; dd++) {
    		    var doc = docs[dd];
		    if  (doc._thr !== undefined && doc._thr.val !== undefined) {
			var val = doc._thr.val;
			range=state.Grid.setRange(range,val);
			var ts,dr;
			if (doc._thr.max !== undefined) {
			    //console.log("GetRange:",JSON.stringify(doc._thr));
			    ts=doc._thr.max;
			    dr=ts[0]-ts[ts.length-1];
			    if (ts[ts.length-1]>0 && ts[ts.length-1]-dr<0) { // include zero
				range=state.Grid.setRange(range,0);
			    }
			    //console.log("Found max:",ts[0],ts[ts.length-1],dr,JSON.stringify(range),thr,key,val);
			} else if (doc._thr.min !== undefined) {
			    ts=doc._thr.min;
			    if (ts[ts.length-1]<0 && ts[ts.length-1]+dr>0) { // include zero
				range=state.Grid.setRange(range,0);
			    }
			    //console.log("Found min:",ts[0],ts[ts.length-1],dr,JSON.stringify(range),thr,key,val);
			}
			range=state.Grid.setRange(range,ts[0]); // include lowest level
			range=state.Grid.setRange(range,ts[ts.length-1]); // include highest level
			//console.log("After adjustment:",tlev,ts.length,JSON.stringify(ts[tlev]),"range=",JSON.stringify(range));
		    };
		}
	    } else {
		//console.log("No matrix-element found:",
		//	    JSON.stringify(colvalues[ii]),
		//	    JSON.stringify(rowvalues[jj]),
		//	    matrix.length,JSON.stringify(Object.keys(matrix))
		//	   );
	    }
	}
	return range;
    };
    this.noDataAvailable=function(state) {
	return (state.Matrix.cnt===0);
    };
    this.getRanges=function(state,matrix,keys,kvals) {
	var range;
	var elements=this.getMatrixElements(state,matrix,keys,kvals);
	elements.forEach( element=> {
	    var lrange=this.getRange(state,element);
	    //console.log("getRanges:",JSON.stringify(lrange));
	    range=state.Grid.combineRange(range,lrange); // include lowest level
	});
	//console.log("getRanges All:",JSON.stringify(range));
	range=state.Grid.adjustRange(range);
	//console.log("getRanges Final:",JSON.stringify(range));
	return range;
    };
    this.sortTooltipDocs=function(state,docs) {
	var sort=state.Path.tooltip.sort||[];
	var lens=sort.length;
	var order=state.Path.order;
	var funk=function(a,b){
	    for (var ss=0;ss<lens;ss++) {
		var key=sort[ss];
		var va=a[key];
		var vb=b[key];
		if (order[key] !== undefined) { // we have a predefined order
		    var ia=order[key].indexOf(va);
		    var ib=order[key].indexOf(vb);
		    if (ia !==-1 && ib !== -1) {
			return ia-ib
		    } else if (ia !== -1) {
			return 1;
		    } else if (ia !== -1) {
			return -1;
		    } else if (va !== vb) {
			return (va > vb) - (va < vb);
		    }
		} else {
		    if (va !== vb) {
			return (va > vb) - (va < vb);
		    }
		}
	    }
	    return 0;
	};
	var ret=docs.sort(funk);
	return ret; 
    };
    this.sortKeyValues=function(state) {
	var tlen=state.Path.other.table.length;
	//console.log("this.sortKeyValues row/column:",JSON.stringify(state.Path.other.table),tlen);
	// sort values
	for (var jj = 0; jj < tlen; jj++) {
    	    var key=state.Path.other.table[jj];
	    if (this.values[key] !== undefined) {
		//console.log("Key:",key,"Values:",JSON.stringify(this.values[key]),jj,
	    	//	    " sort:",JSON.stringify(state.Database.keyCnt));
		if (state.Database.keyCnt[key]===undefined) {
		    console.log("**** Undefined keycnt:",key);
		} else if (state.Database.keyCnt[key].order  === state.Database.casc) {
    		    this.values[key]=this.values[key].sort(state.Utils.ascending);
		} else if (state.Database.keyCnt[key].order  === state.Database.nasc) {
    		    this.values[key]=this.values[key].sort(state.Utils.descendingN);
		} else if (state.Database.keyCnt[key].order  === state.Database.cdes) {
    		    this.values[key]=this.values[key].sort(state.Utils.descending);
		} else if (state.Database.keyCnt[key].order  === state.Database.ndes) {
    		    this.values[key]=this.values[key].sort(state.Utils.descendingN);
		};
		//console.log("Sorted keys:",key,JSON.stringify(this.values[key]),state.Database.keyCnt[key].order);
		// override sort
		if (state.Path.order !== undefined &&
		    state.Path.order[key] !== undefined) { // we have a predefined order
			var buff=[];
		    var olen=state.Path.order[key].length;
		    var kk,val;
		    //console.log("Order length:",olen,jj);
		    // add ordered values (not in trash)
		    for (kk = 0; kk < olen; kk++) {
			val=state.Path.order[key][kk];
			if (this.values[key].indexOf(val) !== -1) {
			    //console.log("Adding:",kk,val);
			    buff.push(val);
			}
		    }
		    // add remaining this.values values (not in trash)
		    var rlen=this.values[key].length;
		    for (kk = 0; kk < rlen; kk++) {
			val=this.values[key][kk];
			if (buff.indexOf(val)  === -1) { // not in sub
			    buff.push(val);
			    state.Path.order[key].push(val);
			}
		    };
		    this.values[key]=buff; // use requested order
		    //console.log("Using requested order:",key);
		};
	    };
    	    //console.log("Found values:",key,JSON.stringify(this.values[key]));
	};
    };
    this.sortedKeys=function(state,obj) {
	var key;
	var skeys = [];
	for(key in obj){
	    if (obj.hasOwnProperty(key) && key.substring(0,1) !== "_") {skeys.push(key);}
	};
	skeys=skeys.sort(state.Utils.ascending);
	var ks=[];
	var slen=skeys.length;
	for (var jj = 0; jj < slen; jj++) {
	    key=skeys[jj];
	    if (key.substr(state,0,1) !== "_" && ks.indexOf(key) === -1) {
		ks.push(key);
	    }
	}
	//console.log("state.Utils.sortedKeys...",JSON.stringify(skeys),JSON.stringify(ks));
	return ks;
    }
    this.getVals=function(el) {
	var keys=el.keys||[];
	var values=el.values;
	var vals=[];
	var lenk=keys.length;
	for (var ii=0;ii<lenk;ii++) {
	    var key=keys[ii];
	    var val=values[key];
	    if (val === undefined) {
		vals.push([]);
	    } else {
		vals.push([values[key]]);
	    };
	}
	return vals;
    }
    this.getTooltipTitle=function(state,doc,key) {
	return state.Threshold.getTooltipTitle(state,doc,key);
    };
    this.getTooltipInfo=function(state,elements) {
	var tooltip={}; // list of maxrank-docs
	var cnt=0;
	var maxlev=-1;
	var minlev=0;
	var docs=[];
	if (elements === undefined) {
	    console.log("No elements found.");
	} else {
	    //console.log("getInfo element:",JSON.stringify(elements));
	    var elen=elements.length;
	    // find maxlev...
	    for (var ee=0;ee<elen;ee++) {
		cnt=cnt+elements[ee].cnt;
		if (elements[ee].maxlev === undefined || elements[ee].minlev === undefined) {
		    minlev=Math.min(minlev,-2);
		} else {
		    maxlev=Math.max(maxlev,elements[ee].maxlev);
		    minlev=Math.min(minlev,elements[ee].minlev);
		}
		// loop over tooltips and put maxrank-docs into tooltip array
		this.mergeTooltipElement(state,elements[ee].tooltip,tooltip,state.Path.tooltip.select.length);
		//console.log(">>> New tooltip:",ee,maxlev,JSON.stringify(tooltip));
		//console.log("RRR Result tooltip:",ee,maxlev,JSON.stringify(tooltip));
	    }
	    docs=this.getTooltipDocs(state,tooltip,maxlev-this.showLevels);
	    //console.log("Tooltip docs:",JSON.stringify(tooltip),JSON.stringify(docs));
	}
	//console.log("getInfo maxlev:",maxlev,cnt);
	return {cnt:cnt,
		minlev:minlev,
		maxlev:maxlev,
		docs:this.sortTooltipDocs(state,docs)};
    }
    this.mergeTooltipElement=function(state,nel,mel,pos) {
	if (nel === undefined) {return;} // nothing to merge
	var ipos=pos;
	if (ipos === undefined) {ipos=state.Path.tooltip.select.length;}
	//console.log("Merging tooltip:",ipos,JSON.stringify(nel));
	if (ipos > 0) {
	    var vals=Object.keys(nel);
	    var lenv=vals.length;
	    for (var ii=0;ii<lenv;ii++) {
		var val=vals[ii];
		if (mel[val]===undefined) {mel[val]={}};
		this.mergeTooltipElement(state,nel[val],mel[val],ipos-1);
	    }
	} else {
	    if (mel.maxrank === undefined || mel.maxrank < nel.maxrank) {
		mel.maxrank=nel.maxrank;
		mel.docs=nel.docs;
	    };
	}
    };
    this.getTooltipDocs=function(state,el,maxlev,pos) {
	var docs=[];
	var ipos=pos;
	if (ipos === undefined) {ipos=state.Path.tooltip.select.length;}
	if (el !== undefined) {
	    if (ipos > 0) {
		var vals=Object.keys(el);
		var lenv=vals.length;
		for (var ii=0;ii<lenv;ii++) {
		    var val=vals[ii];
		    var ndocs=this.getTooltipDocs(state,el[val],maxlev,ipos-1);
		    state.Utils.cpArray(docs,ndocs);
		}
	    } else if (el.docs !== undefined) {
		var dlen=el.docs.length;
		for (var jj=0;jj < dlen; jj++) {
		    var doc=el.docs[jj];
		    if (this.isTooltipDoc(state,doc,maxlev)) {
			docs.push(doc);
		    }
		};
		//state.Utils.cpArray(docs,el.docs);
	    };
	};
	return docs;
    };
    this.makeCntTooltip=function(state,docs) {
	// called when matrix is made if tooltip mode is toggled
	var tooltip={};
	var dlen=docs.length;
	for (var ii = 0; ii < dlen; ii++) {
    	    var doc=docs[ii];
	    var drank=doc.rank;
	    var dlev=doc.level;
	    var el=this.getTooltipElement(state,tooltip,doc);
	    if (el.maxrank === undefined || el.maxrank < drank) {
		el.maxrank=drank;
		el.docs=[];
		el.docs.push(doc);
	    } else if (el.maxlev === dlev && el.maxrank === drank && dlev > 0) {
		if (this.isInterestingTooltipDoc(state,el.docs,doc,dlev,drank)) {
		    el.docs.push(doc);
		}
	    }
	    //console.log("$$$ MakeCntTooltip Rank:",drank,el.maxrank,JSON.stringify(tooltip));
	}
	return tooltip;
    };
    this.getElementWhere=function(state,el) { //,mode
	var del="'";
	var where = state.Database.getWhere(state);
	//console.log("Element:",JSON.stringify(el));
	if (el !== undefined) {
	    var keys=el.keys||[];
	    var values=el.values;
	    var ranges=el.ranges;
	    var lenk=keys.length;
	    for (var ii=0;ii<lenk;ii++) {
		var key=keys[ii];
		var val=values[key];
		var range=ranges[key];
		//if (mode === undefined ||  ! state.Custom.mapHasCells(state,mode)) {
		    // this happens if there is no custom map, or custom map is map...
		    if (key.substring(0,1)==="_" ) {del="";}; // numerical value
		//}
		if (key !== undefined && key !== "") {
		    if (range === undefined) {
			where=state.Database.addWhere(where,key+"="+del +val+del);
		    } else {
			where=state.Database.addWhere(where,key+">"+del +range[0]+del);
			where=state.Database.addWhere(where,key+"<"+del +range[1]+del);
		    }
		};
	    };
	};
	//console.log("Where:",where,JSON.stringify(where));
	//console.log("Data:",JSON.stringify(state.Database.db.tables.alarm)); //mode,
	return where;
    };
    this.addAllTooltip=function(state,matrix) {
	//var mode=state.Custom.getLayoutMode(state);
	//console.log(">>> Adding all tooltips...",mode); // 
	// loop over all elements and add tooltips
	var elements=this.getMatrixElements(state,matrix); // all elements
	var lenc=elements.length;
	for (var cc=0;cc<lenc;cc++) {
	    var el=elements[cc];
	    this.addElementTooltip(state,el); //,mode
	}
	state.Matrix.ltooltip=true;
    };
    this.addElementTooltip=function(state,el) { //,mode
	// called when info-button is pressed - to add tooltip to element...
	var where = this.getElementWhere(state,el); //,mode
	//console.log(">>> Adding ElementTooltip:",JSON.stringify(el),mode," where:",where); // 
	var docs=[];
	if (el.cnt>0) {docs=state.Database.getDocs(state,where);};
	//console.log("addElementTooltip:",where,el.cnt,docs.length);
	el.tooltip=this.makeCntTooltip(state,docs);
	//console.log(">>> Added tooltip for element:",docs.length,where,JSON.stringify(el)); // 
    };
};
export default Matrix;
