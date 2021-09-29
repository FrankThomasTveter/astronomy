//console.log("Loading AutoLib.js");

function Auto() {
    this.debug=false;//false
    this.complete=true;
    this.toggle=function(state) {
	console.log("Pressed toggle");
	state.Auto.complete=!state.Auto.complete;
	if (! state.Auto.complete) {
	    state.Path.table.ntarget=2;
	    if (state.Path.table.nmanual !== undefined) {state.Path.table.ntarget=Math.min(state.Path.table.ntarget,state.Path.table.nmanual);}
	}
	state.Show.showConfig(state);
    };
    // re-arrange path...
    this.setKeyNumber=function(state) {
	state.Path.table.ntarget=2;
	if (state.Auto.complete) { // test 2 keys...
	    state.Path.exportAllKeys(state);
	    var first=state.Path.getFirstKey(state);
	    var second=state.Path.getSecondKey(state);
	    var where=state.Database.getWhere(state);
	    var othdep=this.getDependancy(state,where,
					  state.Path.other.table);
	    // check if keys are inter-dependent...
	    if ((othdep.dep[first]==="dependent" &
		 othdep.dep[second]==="unique") ||
		(othdep.dep[first]==="unique" &
		 othdep.dep[second]==="dependent")) {
		//console.log("**** Reordering anyways:",JSON.stringify(othdep));
		this.reorderKeys(state);
	    };
	    if (this.debug) {console.log("Keys:",JSON.stringify(state.Path.other.table),
					 JSON.stringify(othdep));}
	}
    };
    this.reorderKeys=function(state) {
	if (this.debug) {console.log("############# Reordering keys:",JSON.stringify(state.Path.keys));}
	if (state.Auto.complete) {
	    state.Path.exportAllKeys(state);
	    var analysis=this.analyse(state);
	    this.applyAnalysis(state,analysis);
	    state.Path.exportAllKeys(state);
	    //console.log("############# Reordered keys:",JSON.stringify(state.Path.keys));
	    //console.log("############# Reordered other:",JSON.stringify(state.Path.other));
	};
    };
    // push selected key back to table...
    this.pushSelectToTable=function(state,key,inc) {
	var ret=false;
	var src=state.Navigate.removeKey(state,key,state.Path.keys.path);
	if (src !== undefined) {
	    var jnk=state.Navigate.removeKey(state,key,state.Path.keys.other); // remove if it exists
	    var pos=0;
	    if (state.Auto.complete) {// check if key is redundant
		//var keywhere=state.Path.select.where[key];
		//var keyrange=state.Path.select.range[key];
		//var keycnt=state.Path.select.cnt[key];
		var where=state.Database.getWhere(state);
		var testtable=state.Path.getTableKeys(state);
		if (testtable.length>0) {testtable.pop();};
		state.Utils.pushKey(testtable,key,0);
		var testdep=this.getDependancy(state,where,testtable);
		if (testdep.intprt[key] === "redundant") {
		    pos=Math.max(0,state.Path.table.nkeys);
		};
		//console.log("Dep:",key,JSON.stringify(testtable),JSON.stringify(testdep),pos);
	    };
	    state.Utils.pushKey(state.Path.keys.other,src,pos);
	    state.Navigate.implementKeyChange(state,true);
	    ret= (inc !== undefined && jnk === undefined);
	};
	return ret;
    };
    // select given table key...
    this.selectTableKey=function(state,key,keyval,keywhere,keycnt,keep) { // keep abscissa
	if(this.debug){console.log("selectTableKey Entering:",key,keyval,keywhere,keycnt,JSON.stringify(state.Path.other));};
	var ret=false;
	var sid = state.Path.keys.other.indexOf(key);
	//console.log("SelectTableKey:",key,sid,JSON.stringify(state.Path.keys.other));
	if (sid !== -1 && key !== "") { // key is selectable, but maybe not in table...
	    // why do you need duplicates of the target key (that will be removed)? 
	    // - to check if the new selection makes your table keys redundant...
	    // You need to check the table keys again. 
	    // We duplicate the target key into the table array and then remove both copies. 
	    // This brings the old table keys back again, making them subject to a redundancy check.
	    var othkeys=state.Path.getOtherTableKeys(state);
	    var restkeys=state.Path.getRestTableKeys(state);
	    var leno=othkeys.length;
	    var lenr=restkeys.length;
	    if (keep !== undefined & keep) { // only move key, no auto select
		if(this.debug){console.log("Move-key");};
		ret = state.Path.addTableKeyToPath(state,key,keyval,keywhere);
	    } else if (lenr===0 || leno===0 || ! state.Auto.complete ) { // nothing to consider
		if(this.debug){console.log("Single-select");};
		ret = state.Path.tableKeyToPath(state,key,keyval,keywhere,keycnt);
	    } else if (!state.Path.isTableKey(state,key)) { // plain select...
		if(this.debug){console.log("Plain-select");};
		ret = state.Path.tableKeyToPath(state,key,keyval,keywhere,keycnt);
	    } else { // auto-select
		if(this.debug){console.log("Auto-select:",JSON.stringify(state.Path.other));}
		//if(this.debug){console.log("Before:",JSON.stringify(state.Path.keys));};
                state.Path.moveOther2Table(state,key);   // move target key to front of array
                state.Path.exportAllKeys(state);
		ret = state.Auto.tableKeyToPath(state,key,keyval,keywhere,keycnt);
		state.Path.exportAllKeys(state);
                //state.Path.duplicateTableKey(state,key); // make duplicate
		//ret = state.Auto.tableKeyToPath(state,key,keyval,keywhere,keycnt); // remove duplicate
	    }
	};
	if (ret) {state.Path.exportAllKeys(state);};
	if(this.debug){console.log("selectTableKey Done:",JSON.stringify(state.Path.keys),JSON.stringify(ret));};
	return ret;
    };
    this.tableKeyToPath=function (state,key,keyval,keywhere,keycnt) {
	if(this.debug){console.log("tableKeyToPath Entering key=",key," val=",keyval," where='",keywhere,"' other=",JSON.stringify(state.Path.other));};
	// look for table-key candidates in the rest-stack
	var analysis=this.analyse(state,key,keywhere);
	// move the key
	var ret=state.Path.tableKeyToPath(state,key,keyval,keywhere,keycnt);
	//state.Path.exportAllKeys(state);
	this.applyAnalysis(state,analysis);
	if(this.debug){console.log("Analysis:",JSON.stringify(analysis));};
	if(this.debug){console.log("tableKeyToPath Path:",JSON.stringify(state.Path.keys));};
	if(this.debug){console.log("tableKeyToPath Done:",JSON.stringify(ret));};
	return ret;
    };
    this.applyAnalysis=function(state,analysis) {
	var lens, jj, jkey, jkeyval, jkeywhere;
	var rest=[];
	var ignore=state.Path.other.ignore;
	if (analysis.tblkey !== "" || (analysis.sel.length > 0 || analysis.rest.length > 0)) {
	    lens=analysis.sel.length;
	    for (jj=0;jj<lens;jj++) {
		jkey=analysis.sel[jj];
		jkeyval=analysis.val[jj];
		jkeywhere=jkey + "='" + jkeyval+"'";
		if (jkeyval !== null) {
                    state.Path.tableKeyToPath(state,jkey,jkeyval,jkeywhere,1);
		} else {
		    console.log("Panick-mode:",jkey);
		    analysis.rest.push(jkey);
		}
	    }
	    if(this.debug){console.log("tableKeyToPath Init:",JSON.stringify(state.Path.keys));};
	    rest=state.Utils.clean(analysis.rest);
	}
	if (analysis.tblkey !== "") {
	    state.Path.table.ntarget=1+analysis.othkeys.length
	    state.Path.keys.other=state.Utils.clean(analysis.othkeys.concat([analysis.tblkey]).concat(rest));
	    state.Path.keys.trash=state.Utils.clean(analysis.trash.concat(ignore).concat(state.Path.keys.trash));
            if(this.debug){console.log("Table key present:",JSON.stringify(state.Path.keys.other),state.Path.table.nkeys);};
	} else if (analysis.othkeys !== undefined) {
	    state.Path.table.ntarget=analysis.othkeys.length;
	    state.Path.keys.other=state.Utils.clean(analysis.othkeys.concat(rest));
	    state.Path.keys.trash=state.Utils.clean(analysis.trash.concat(ignore).concat(state.Path.keys.trash));
            if(this.debug){console.log("Other key present:",JSON.stringify(state.Path.keys.other),state.Path.table.nkeys);};
	} else {
	    state.Path.table.ntarget=1;
	    state.Path.keys.other=state.Utils.clean([].concat(rest));
	    state.Path.keys.trash=state.Utils.clean(analysis.trash.concat(ignore).concat(state.Path.keys.trash));
            if(this.debug){console.log("No key present:",JSON.stringify(state.Path.keys.other),state.Path.table.nkeys);};
	};
	if (state.Path.table.nmanual !== undefined) {state.Path.table.ntarget=Math.min(state.Path.table.ntarget,state.Path.table.nmanual);}
	//console.log("Cleaning:",JSON.stringify(state.Path.keys.other));
    };
    this.analyse=function(state,trgkey,trgwhere) {
        if(this.debug){console.log("analyseOther Entering:",JSON.stringify(state.Path.other));};
	//console.log("path-other:",JSON.stringify(state.Path.other));
	//other key
	var where=state.Database.getWhere(state);
	var soft=false;
	if (trgkey===undefined) {
	    soft=true;
	    trgkey="";
	    trgwhere="";
	};
	var othkeys=state.Path.getOtherTableKeys(state,trgkey);
	var restkeys=state.Path.getRestTableKeys(state,trgkey);
	//if(this.debug){console.log(">>>Key:",trgkey," Other:",JSON.stringify(othkeys),
	//			   " Rest=",JSON.stringify(restkeys));};
	var sel=[]; // selected
	var val=[]; // values
	var rest=[]; //rest
	var trash=[]; //trash
	var tblkey=""; // target key
	var lenk=restkeys.length;
	var keywhere=state.Database.addWhere(where,trgwhere);
	// redundant keys => selected
	// insignificant keys => pushed back
	// control keys => used in table
	for (var ii = 0; ii< lenk; ii++) {
	    // first key dependencies
	    var testkey=restkeys[ii];
	    var testtable=othkeys.concat([testkey]);
	    if(this.debug){console.log(">>> Checking:",testkey,":",JSON.stringify(testtable),
				       " vs Table:(",JSON.stringify(restkeys),
				       ") where=",where,trgwhere);};
	    var testdep=this.getDependancy(state,keywhere,testtable);
	    if(this.debug){console.log("        Dependency:   ",JSON.stringify(othkeys),testkey,":",JSON.stringify(testdep));};
	    // in case there are no targets
	    if (testdep.intprt[testkey]==="unknown") { // select redundant testkey
		if(this.debug){console.log("****  Trash:",testkey,":",
					   JSON.stringify(sel),JSON.stringify(trash),tblkey);};
		trash.push(testkey);
	    } else if (this.hasAnyDependancy(state,testdep,testtable,"insignificant") ||
		testdep.intprt[testkey]==="insignificant" || tblkey !== "") {
		rest.push(testkey);
		if(this.debug){console.log("****  Postpone:",testkey,":",
					   JSON.stringify(sel),JSON.stringify(rest),tblkey);};
	    } else if (testdep.intprt[testkey]==="redundant") { // select redundant testkey
		var testval=testdep.val[testkey];
		var sid=-1;
		if (soft) {// force move
		    sid = state.Path.keys.path.indexOf(testkey);
		    //console.log("Soft move:",testkey,sid,JSON.stringify(state.Path.keys.path));
		};
		if (testval !== null & sid===-1) { // single value & "not" in path
		    sel.push(testkey);
		    val.push(testval);
		    if(this.debug){console.log("****  Select:",testkey,":",JSON.stringify(sel),JSON.stringify(rest),tblkey,JSON.stringify(testdep),where);};
		} else {
		    rest.push(testkey);
		    if(this.debug){console.log("****  Rest:",testkey,":",JSON.stringify(sel),JSON.stringify(rest),tblkey,JSON.stringify(testdep),where);};
		}
	    } else { // control key, only if testdep.intprt[othkey]!=="redundant", otherwise postpone...
		tblkey=testkey;                    // we have found a good candidate
		// when we have a tblkey, all other keys are ignored....

		
		if(this.debug){console.log("****  Control:",testkey,":",JSON.stringify(sel),JSON.stringify(rest),tblkey);};
	    }
	}
	//if(this.debug){console.log("Sel/Val:",JSON.stringify(sel),JSON.stringify(val));};
	var ret={sel:sel,val:val,rest:rest,trash:trash,tblkey:tblkey,othkeys:othkeys};
	if(this.debug){console.log("analyse Done:",JSON.stringify(ret));};
	return ret;
    };
    // check if keys are inter-dependent, ("common", "unique", "dependent", "unknown") 
    this.hasAnyDependancy=function(state,dep,keys,str) {
	var ret=false;
	var lenk=keys.length;
	for (var ii=0;ii<lenk;ii++) {
	    var key=keys[ii];
	    if (dep.intprt[key]===str) {ret=true;}
	}
	return ret;
    }
    this.hasAllDependancy=function(state,dep,keys,str) {
	var ret=true;
	var lenk=keys.length;
	for (var ii=0;ii<lenk;ii++) {
	    var key=keys[ii];
	    if (dep.intprt[key]!==key) {ret=false;}
	}
	return ret;
    };
    this.getDependancy=function(state,where,keys) {
	//if(this.debug){console.log("getDependancy Entering:",where,JSON.stringify(keys));};
	var key;
	//var where = state.Database.getWhere(state);
	var ret={dep:{},val:{}};
	var hits={};
	var maxhits={};
	var docs=state.Database.getDocsCnt(state,where,keys); // current table keys
	//if(this.debug){console.log("getDependancy:",JSON.stringify(docs));};
	var slen=keys.length;
	var dlen = docs.length;
	for (var ii = 0; ii < dlen; ii++) {
    	    var doc=docs[ii];
	    for (var jj=0;jj<slen;jj++) {
		key=keys[jj];
		if (doc[key] !== undefined) {
		    var val=doc[key];
		    ret.val[key]=val;
		    if (hits[key]  === undefined) {hits[key]={};}
		    hits[key][val] = 1+ (hits[key][val]||0);
		    if (hits[key][val] > (maxhits[key]||0)) {
			maxhits[key]=hits[key][val];
		    }
		};
	    }
	};
	//if(this.debug){console.log("Hits:",dlen,JSON.stringify(hits),where);};
	for (var kk=0;kk<slen;kk++) {
	    key=keys[kk];
	    if (maxhits[key] !== undefined) {
		if (maxhits[key]  === 1) {          // every entry has unique value
		    ret.dep[key]="unique";
		} else if (maxhits[key]  === dlen) {
		    ret.dep[key]="common";    // all entries have same value
		} else {
		    ret.dep[key]="dependent";    // entries depend on values
		}
	    } else {
		ret.dep[key]="unknown"; // not found in database
	    }
	    if (hits[key]  !== undefined) {
		if (Object.keys(hits[key]).length > 1) {
		    ret.val[key]=null;
		}
	    } else {
		//console.log("No hits for key:",key);
	    }
	};
	ret.intprt=this.getInterpretation(state,keys,ret.dep);
	//if(this.debug){console.log("getDependancy Done:",JSON.stringify(ret));};
	return ret;
    };
    this.getInterpretation=function(state,keys,dep){
	var key;
	var interpretation={};
	var slen=keys.length;
	for (var kk=0;kk<slen;kk++) {
	    var kkey=keys[kk];
	    interpretation[kkey]="control";
	};
	for (var jj=0;jj<slen;jj++) {
	    key=keys[jj];
	    if (dep[key]  === "unique") {// "unique" keys depend on the other keys...
		for (var rr=0;rr<slen;rr++) {
		    var rkey=keys[rr];
		    if (dep[rkey] === "unique") { // do not remove every "unique" key
			if (rr > jj) {
			    interpretation[rkey]="redundant"; // later control variables are redundant
			};
		    } else { // remove all other variables
			if (rr !== jj) {
			    if (dep[rkey] === "common") {
				interpretation[rkey]="redundant"; // 
			    } else if (dep[rkey] === "unknown") {
				interpretation[rkey]="unknown"; // 
			    } else {
				interpretation[rkey]="insignificant"; //
			    };
			};
		    }
		}
	    }
	}
	var cnt=0;
	for (var ll=slen-1;ll>=0;ll--) {
	    key=keys[ll];
	    if (dep[key]  === "common") { // common keys have only one value
		cnt=cnt+1;
		if (cnt < slen) { // leave at least one redundant variable
		    interpretation[key]="redundant";
		}
	    }
	};
	return interpretation;
    };
};
export default Auto;
