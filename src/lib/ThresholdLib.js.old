//console.log("Loading ThresholdLib.js");

function Threshold() {
    this.thrs=undefined; // threshold parameter levels, set by Default
    //this.imax=0;        // threshold item types
    //this.ithr=1;
    //this.ikey=2;
    //this.ilev=3;
    //this.ival=4;
    this.init=function(state){
	state.Utils.init("Threshold",this);
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
	//if (debug) {console.log("Thresholds:",JSON.stringify(maxs),val);};
	var doclev=-1; // found thresholds, but will we find a valid level?
	var val = doc[thr["key"]];
	var docmax=Number(val);
	var mlen=maxs.length;
	// get new level
	for (var jj = 0; jj < mlen; jj++) {
	    if (docmax >= Number(maxs[jj])) {
		//if (debug) {console.log("Hit:",docmax,jj,maxs[jj],docmax>=maxs[jj],doclev);}
		doclev=jj;
	    }
	};
	var rank=0; // universal rank
	if (doclev > -1) {
	    rank= doclev+(docmax-Number(maxs[doclev]))/(Number(maxs[mlen-1])-Number(maxs[0]));
	    //console.log("Doclev:",doclev," max:",docmax,jj,mlen,maxs[doclev],maxs[mlen-1],maxs[0]);
	};
	//if (debug) {console.log("Level:",docmax,doclev,JSON.stringify(maxs));}
	var ret={};
	ret.level=doclev;
	ret.rank=rank;
	ret.val=docmax
	ret.key=thr["key"];
	ret.lat=doc[thr["lat"]];
	ret.lon=doc[thr["lon"]];
	ret.max=maxs;
	//ret.keys=["level","val","lat","lon","max"];
	return ret;
    };
    this.getMinThreshold=function(doc,thr,mins) {
	//if (debug) {console.log("Thresholds:",JSON.stringify(mins),val);};
	var doclev=-1; // found thresholds, but will we find a valid level?
	var val = doc[thr["key"]];
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
	ret.key=thr["key"];
	ret.lat=doc[thr["lat"]];
	ret.lon=doc[thr["lon"]];
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
	    //if (debug) {console.log("No Thresholds:",JSON.stringify(thrs),val);};
	}
    };
    this.getThresholds=function(state,doc,ithrs) { // returns keys...
	var ret;
	var thrs;
	var lret;
	if (ithrs === undefined) {
	    thrs=this.thrs;
	    ret=this.getDefaultThreshold();
	} else {
	    thrs=ithrs;
	};
	if (Array.isArray(thrs)) {
	    var lent=thrs.length;
	    for (var ii=0;ii<lent;ii++) {
		var obj=thrs[ii];
		lret=this.getThresholds(state,doc,obj);
		if (lret !== undefined) {
		    return lret;
		}
	    };
	} else if (typeof thrs === "object" && thrs !== null) {
	    for (var trgkey in thrs) { // loop over thresholds
		if (doc[trgkey] !== undefined) {
		    var trgval=doc[trgkey]; // trgval-value
		    if (thrs[trgkey][trgval] !== undefined) {
			//console.log("Found:",trgkey,trgval,JSON.stringify(thrs[trgkey][trgval]));
			if (thrs[trgkey][trgval].key === undefined) { // there is another level
			    //if (debug) {console.log("   Iterating with:",JSON.stringify(thrs[trgkey][trgval]));};
			    lret=this.getThresholds(state,doc,thrs[trgkey][trgval]);
			    if (lret !== undefined) {return lret;};
			} else if (doc[thrs[trgkey][trgval].key] !== undefined) {
			    var thr = thrs[trgkey][trgval];
			    lret=this.processThreshold(state,doc,thr);
			    if (lret !== undefined) {return lret;};
			}
		    }
		}
	    }
	};
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
	    doc.alarm_val=thr.val;
	    doc.alarm_key=thr.key;
	    doc._thr=thr;
	    //console.log("Doc:",JSON.stringify(doc));
	}
	return [];
    };
    this.setEssentials=function(state,doc) {
	//var debug = (doc.Phenomenon==="Regn" && doc.Duration==="12t" && doc.Region==="Innlandet" && doc.dtg==="2019-06-26_11");
	var thr=this.getThresholds(state,doc);
	doc.level=String(thr.level);
	//doc._rank=thr.rank;
	doc.rank=thr.rank;
	doc.lat=parseFloat(thr.lat);
	doc.lon=parseFloat(thr.lon);
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
	    return doc._rank;
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
