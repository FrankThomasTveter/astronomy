//console.log("Loading ThresholdLib.js");

function Threshold() {
    this.thrs=undefined; // threshold parameter levels, set by Default
    this.debug=false;
    this.def={};
    //this.imax=0;        // threshold item types
    //this.ithr=1;
    //this.ikey=2;
    //this.ilev=3;
    //this.ival=4;
    this.init=function(state){
	//state.Utils.init("Threshold",this);
    };
    this.getMaxLevel=function(doc) {
	if (doc._thr !== undefined) {
	    if (doc._thr.max !== undefined) {
		return doc._thr.max.length;
	    } else if (doc._thr.min !== undefined) {
		return doc._thr.min.length;
	    }
	} else {
	    return -1;
	}
    };
    this.getMaxThreshold=function(doc,thr,maxs) {
	if (this.debug) {console.log("Thresholds:",JSON.stringify(maxs));};
	var key=(thr["key"]===undefined)?this.def["key"]:thr["key"];
	var lat=(thr["lat"]===undefined)?this.def["lat"]:thr["lat"];
	var lon=(thr["lon"]===undefined)?this.def["lon"]:thr["lon"];
	var unit=(thr["unit"]===undefined)?this.def["unit"]:thr["unit"];
	var doclev=-1; // found thresholds, but will we find a valid level?
	var val = doc[key];
	var docmax=Number(val);
	var mlen=maxs.length;
	// get new level
	for (var jj = 0; jj < mlen; jj++) {
	    if (docmax >= Number(maxs[jj])) {
		if (this.debug) {console.log("Hit:",docmax,jj,maxs[jj],docmax>=maxs[jj],doclev);}
		doclev=jj;
	    }
	};
	var rank=0; // universal rank
	if (doclev > -1) {
	    rank= doclev+((docmax-Number(maxs[doclev]))/(Number(maxs[mlen-1])-Number(maxs[0])))/1000.0;
	    //console.log("Doclev:",doclev," max:",docmax,jj,mlen,maxs[doclev],maxs[mlen-1],maxs[0]);
	};
	if (this.debug) {console.log("Level:",docmax,doclev,JSON.stringify(maxs));}
	var ret={};
	ret.level=doclev;
	ret.rank=rank;
	ret.val=docmax
	ret.key=key;
	ret.lat=doc[lat];
	ret.lon=doc[lon];
	ret.unit=doc[unit];
	ret.max=maxs;
	//ret.keys=["level","val","lat","lon","max"];
	return ret;
    };
    this.getTooltipTitle=function(state,doc,key) {
	var title="";
	var thr=doc._thr;
	if (thr !== undefined) {
	    title=thr.key + "=" + thr.val + "\nThr=" +
		JSON.stringify(thr.max) + "\nLevel="+
		thr.level;
	};
	return title
    };
    this.getMinThreshold=function(doc,thr,mins) {
	if (this.debug) {console.log("Thresholds:",JSON.stringify(mins));};
	var key=(thr["key"]===undefined)?this.def["key"]:thr["key"];
	var lat=(thr["lat"]===undefined)?this.def["lat"]:thr["lat"];
	var lon=(thr["lon"]===undefined)?this.def["lon"]:thr["lon"];
	var unit=(thr["unit"]===undefined)?this.def["unit"]:thr["unit"];
	var doclev=-1; // found thresholds, but will we find a valid level?
	var val = doc[key];
	var docmin=Number(val);
	// get new level
	var mlen=mins.length;
	for (var jj = 0; jj < mlen; jj++) {
	    if (docmin <= Number(mins[jj])) {
		doclev=jj;
	    }
	}
	var rank=0; // universal rank
	if (doclev > 0) {rank=(Number(mins[0])-docmin)/(Number(mins[0])-Number(mins[mlen-1]));};
	var ret={};
	ret.level=doclev;
	ret.rank=rank;
	ret.val=docmin
	ret.key=key;
	ret.lat=doc[lat];
	ret.lon=doc[lon];
	ret.unit=doc[unit];
	ret.min=mins;
	//ret.keys=["level","val","lat","lon","min"];
	return ret;
    };
    this.getDefaultThreshold=function() {
	//,keys:["lat","lon"]
	return {level:-2,rank:-2,lat:0,lon:0};// no thresholds found...
    };
    this.processThreshold=function(state,doc,thr) {
	var maxs = thr[">"];
	var mins = thr["<"];
	if (maxs !== undefined) { // above thresholds
	    return this.getMaxThreshold(doc,thr,maxs)
	} else if (mins !== undefined) { // below thresholds
	    return this.getMinThreshold(doc,thr,mins)
	} else {
	    if (this.debug) {console.log("No Thresholds:",JSON.stringify(thr));};
	}
    };
    this.getThresholds=function(state,doc,ithrs) { // returns keys...
	var ret;
	var thrs;
	var lret;
	var ii;
	var lent;
	var obj;
	if (ithrs === undefined) {
	    thrs=this.thrs;
	    if (this.debug) {console.log("Entering...",JSON.stringify(doc));};
	} else {
	    if (this.debug) {console.log("Re-Entering...",JSON.stringify(ithrs));};
	    thrs=ithrs;
	};
	if (Array.isArray(thrs)) {
	    lent=thrs.length;
	    for (ii=0;ii<lent;ii++) {
		obj=thrs[ii];
		//console.log("GetThresholds array...",JSON.stringify(obj));
		lret=this.getThresholds(state,doc,obj);
		if (lret !== undefined) {
		    //console.log("Got result...",ii,JSON.stringify(lret));
		    return lret;
		}
	    };
	} else if (typeof thrs === "object" && thrs !== null) {
	    if (thrs.key === undefined) { // there is another level
		for (var trgkey in thrs) { // loop over thresholds
		    if (doc[trgkey] !== undefined) {
			var trgval=doc[trgkey]; // trgval-value
			obj=thrs[trgkey];
			if (Array.isArray(obj)) {
			    if (this.debug) {console.log("   Looping with:",trgkey,trgval,JSON.stringify(obj)!==undefined);};
			    lent=obj.length;
			    for (ii=0;ii<lent;ii++) {
				var thr=obj[ii][trgval];
				if (thr !== undefined) {
				    lret=this.getThresholds(state,doc,thr);
				    if (lret !== undefined) {return lret;};
				}
			    }
			} else {
			    if (this.debug) {console.log("   Iterating with:",trgkey,trgval,JSON.stringify(thrs[trgkey][trgval])!==undefined);};
			    if (thrs[trgkey][trgval] !== undefined) {
				lret=this.getThresholds(state,doc,thrs[trgkey][trgval]);
				if (lret !== undefined) {return lret;};
				//console.log("Found:",trgkey,trgval,JSON.stringify(thrs[trgkey][trgval]));
			    }
			}
		    }
		}
	    } else if (doc[thrs.key] !== undefined) {
		//console.log("GetThresholds array...",ii,JSON.stringify(obj));
		lret=this.processThreshold(state,doc,thrs);
		if (lret !== undefined) {return lret;};
	    }
	};
	if (ithrs === undefined && ret===undefined) {
	    ret=this.getDefaultThreshold();
	    //console.log("GetThresholds using defaults...",JSON.stringify(ret));
	};
	//console.log("GetThresholds done...",JSON.stringify(ret));
	return ret;
    };
    this.setThresholds=function(state,doc) {
	//var debug = (doc.Phenomenon==="Regn" && doc.Duration==="12t" && doc.Region==="Innlandet" && doc.dtg==="2019-06-26_11");
	if (doc._thr !== undefined) {
	    return [];
	} else {
	    var thr=this.getThresholds(state,doc);
	    doc.level=String(thr.level);
	    //doc._rank=thr.rank;
	    doc.rank=thr.rank;
	    doc.lat=parseFloat(thr.lat);
	    doc.lon=parseFloat(thr.lon);
	    doc.unit=thr.unit;
	    doc.alarm_val=thr.val;
	    doc.alarm_key=thr.key;
	    doc._thr=thr;
	    //console.log("Doc:",JSON.stringify(doc));
	}
	return [];
    }.bind(this);
    this.importVariables=function(state,doc) {
	//var debug = (doc.Phenomenon==="Regn" && doc.Duration==="12t" && doc.Region==="Innlandet" && doc.dtg==="2019-06-26_11");
	var thr=this.getThresholds(state,doc);
	doc.level=String(thr.level);
	//doc._rank=thr.rank;
	doc.rank=thr.rank;
	doc.lat=parseFloat(thr.lat);
	doc.lon=parseFloat(thr.lon);
	doc.unit=thr.unit;
    };
    // call after this.setThresholds
    this.getLevel=function(state,doc) {
	//console.log("GetLevel:",JSON.stringify(doc));
	if (doc._thr !== undefined) {
	    return doc._thr.level;
	} else {
	    return -1;
	}
    }
    this.getRank=function(state,doc) {
	if (doc._thr !== undefined) {
	    return doc._thr.rank;
	} else {
	    return 0;
	}
    };
    this.getLat=function(state,doc) {
	if (doc._thr !== undefined) {
	    return doc._thr.lat;
	} else {
	    return 0;
	}
    }
    this.getLon=function(state,doc) {
	if (doc._thr !== undefined) {
	    return doc._thr.lon;
	} else {
	    return 0;
	}
    };
};
export default Threshold;
