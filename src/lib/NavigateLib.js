//console.log("Loading NavigateLib.js");

function Navigate() {
    this.bdeb=false;
    this.history={pos:0, // position of next snapshot
		  track:[]
		 };
    this.home=undefined;
    this.rank={};          // key rank
    this.trash={};          // key trash
    this.maxStore=1000;       // max number of states stored
    this.reset=function(state) { // store state
	//state.Navigate.history={pos:0,track:[]};
	this.store(state);
    };
    this.store=function(state,focus) { // store state
	var snapshot=state.Path.getSnapshot(state,focus)
	// remove old data...
	if (state.Navigate.history.track.length>state.Navigate.history.pos+1) {
	    state.Navigate.history.track.length=state.Navigate.history.pos+1;
	} else if (state.Navigate.history.track.length > this.maxStore) {
	    var keep=this.maxStore;
	    state.Navigate.history.track=state.Navigate.history.track.splice(-keep,keep);
	};
	if (state.Navigate.history.track.length>0) {
	    var old=state.Navigate.history.track[state.Navigate.history.track.length-1];
	    if (JSON.stringify(snapshot)===JSON.stringify(old)) {
		//console.log("History:",JSON.stringify(snapshot),JSON.stringify(state.Navigate.history.track));
		//console.log("Ignoring old image.");
		return false;
	    }
	}
	state.Navigate.history.track.push(snapshot);
	state.Navigate.history.pos=state.Navigate.history.track.length-1;
	//console.log(">>>>>> Stored state...",JSON.stringify(state.Navigate.history),
	//	    this.canUndo(state),this.canRedo(state),
	//	    state.Navigate.history.pos,state.Navigate.history.track.length);
	//console.log(">>>>> stored state.",this.snapshotToString(state,snapshot));
	//this.printSnapshot(state);
	this.refreshHistory(state);
    };
    this.refreshHistory=function(state) {
	if (state.React.Config !== undefined) {
	    state.React.Config.show();
	};
    };
    this.canRedoPath=function(state) {
	return (state.Path.keys.path.length > 0);
    };
    this.redoPath=function(state) {
	var len=state.Path.keys.path.length;
	if (len>0) {
	    var key=state.Path.keys.path[len-1];
	    //console.log("Undoing:",key);
	    //this.onClickPath(state,"path",key);
	    if (state.Auto.pushSelectToTable(state,key)) {	    
		state.Path.table.ntarget=Math.min(state.Path.table.ntarget+1,
						  state.Path.maxtarget);
		state.Path.table.nkeys=Math.min(state.Path.table.nkeys+1,
						state.Path.table.ntarget);
	    }
	}
    }
    this.canUndoHistory=function(state) {
	return (state.Navigate.history.pos && state.Navigate.history.pos>0);
    };
    this.undoHistory=function(state) {
	//console.log(">>>>>> Undo:",this.canUndo(state));
	state.Navigate.history.pos=state.Navigate.history.pos-1;
	var snapshot=state.Navigate.history.track[state.Navigate.history.pos]
	//console.log("Setting snapshot:",this.snapshotToString(state,snapshot));
	state.Path.setSnapshot(state,snapshot);
	this.refreshHistory(state);
	state.Path.setLabel(state);
	state.Show.show(state);
    };
    this.canUndo=function(state) {
	return (this.canUndoHistory(state));
    };
    this.undo=function(state) {
	//console.log(">>>>>> Undo:",this.canUndo(state));
	if (this.canUndoHistory(state)) {
	    this.undoHistory(state);
	};
    };
    this.canRedoHistory=function(state) {
	return (state.Navigate.history.pos < state.Navigate.history.track.length-1);
    };
    this.canRedo=function(state) {
	return (this.canRedoHistory(state) || this.canRedoPath(state));
    };
    this.redoHistory=function(state) {
	//console.log(">>>>>> Redo:",this.canRedo(state),state.Navigate.history.pos,JSON.stringify(state.Navigate.history.track));
	state.Navigate.history.pos=state.Navigate.history.pos+1;	
	var snapshot=state.Navigate.history.track[state.Navigate.history.pos]
	//console.log("Setting snapshot:",this.snapshotToString(state,snapshot));
	state.Path.setSnapshot(state,snapshot);
	this.refreshHistory(state);
	state.Path.setLabel(state);
	state.Show.show(state);
    };
    this.redo=function(state) {
	//console.log(">>>>>> Redo:",this.canRedo(state),state.Navigate.history.pos,JSON.stringify(state.Navigate.history.track));
	if (this.canRedoHistory(state)) {
	    this.redoHistory(state)
	} else if (this.canRedoPath(state)) {
	    this.redoPath(state)
	};
    };
    this.removeKey=function(state,key,array) {
	var sid=array.indexOf(key);
	if (sid !== -1) {
	    return array.splice(sid, 1);  // remove from path
	} else {
	    return;
	}
    };
    this.implementKeyChange=function(state,reload) {
	state.Path.exportAllKeys(state);
	state.Navigate.store(state);
	state.Html.setFootnote(state,"Extracting data.");
	state.Html.setProgress(state, true);
	//console.log("Showing:",JSON.stringify(state.Path.other));
	state.Path.setLabel(state);
	state.Show.show(state,reload);
    };
    /// move key between tables ////////////////////////////////
    this.pushSelectToTable=function(state,key,inc) {
	var src=this.removeKey(state,key,state.Path.keys.path);
	if (src !== undefined) {
	    var jnk=this.removeKey(state,key,state.Path.keys.other); // remove if it exists
	    state.Utils.pushKey(state.Path.keys.other,src,0);
	    if (inc !== undefined && jnk === undefined) {
		state.Path.table.ntarget=Math.min(state.Path.table.ntarget+1,
						  state.Path.maxtarget);
		state.Path.table.nkeys=Math.min(state.Path.table.nkeys+1,
						state.Path.table.ntarget);
	    };
	    this.implementKeyChange(state,true);
	}
	//console.log("Push:",JSON.stringify(state.Path.keys));
    };
    this.pushSelectToRest=function(state,key) {
	var src=this.removeKey(state,key,state.Path.keys.path);
	if (src !== undefined) {
	    this.removeKey(state,key,state.Path.keys.other); // remove if it exists
	    state.Utils.pushKey(state.Path.keys.other,src);
	    this.implementKeyChange(state,true);
	}
    };
    this.pushTableToRest=function(state,key,inc) {
	if (state.Path.other.table.indexOf(key)!==-1) {
	    var src=this.removeKey(state,key,state.Path.keys.other);
	    state.Utils.pushKey(state.Path.keys.other,src);
	    if (inc !== undefined) {
		state.Path.table.ntarget=Math.min(state.Path.table.ntarget-1,
						  state.Path.maxtarget);
		state.Path.table.nkeys=Math.min(state.Path.table.nkeys-1,
						state.Path.table.ntarget);
	    };
	    this.implementKeyChange(state,true);
	};
    };
    this.pushTableToTrash=function(state,key,inc) {
	if (state.Path.other.table.indexOf(key)!==-1) {
	    var src=this.removeKey(state,key,state.Path.keys.other);
	    state.Utils.pushKey(state.Path.keys.trash,src,0);
	    if (inc !== undefined) {
		state.Path.table.ntarget=Math.min(state.Path.table.ntarget-1,
						  state.Path.maxtarget);
		state.Path.table.nkeys=Math.min(state.Path.table.nkeys-1,
						state.Path.table.ntarget);
	    };
	    this.implementKeyChange(state,true);
	};
    };
    this.pushRestToTrash=function(state,key) {
	var src=this.removeKey(state,key,state.Path.keys.other);
	if (src !== undefined) {
	    state.Utils.pushKey(state.Path.keys.trash,src,0);
	    this.implementKeyChange(state,true);
	};
    };
    this.pushTrashToRest=function(state,key) {
	var src=this.removeKey(state,key,state.Path.keys.trash);
	if (src !== undefined) {
	    state.Utils.pushKey(state.Path.keys.rest,src,0);
	    this.implementKeyChange(state,true);
	};
    };
    this.pushRestToTable=function(state,key,inc) {
	if (state.Path.other.table.indexof(key)===-1) {
	    var src=this.removeKey(state,key,state.Path.keys.other);
	    if (src !== undefined) {
		state.Utils.pushKey(state.Path.keys.other,src,0);
		if (inc!==undefined) {
		    state.Path.table.ntarget=Math.min(state.Path.table.ntarget+1,
						      state.Path.maxtarget);
		    state.Path.table.nkeys=Math.min(state.Path.table.nkeys+1,
						    state.Path.table.ntarget);
		};
		this.implementKeyChange(state,true);
	    };
	};
    };

    this.replaceTableKey=function(state,skey,tkey) {
	var reload=false;
	var sid=state.Path.keys.other.indexOf(skey);
	var tid=state.Path.keys.other.indexOf(tkey);
	//console.log("Table path: Sid:",sid," tid:",tid,skey,tkey);
	if (sid !== -1 && tid !== -1) {
	    if (sid > tid) {
		var src=state.Path.keys.other.splice(sid, 1);                 // remove from path
		var trg=state.Path.keys.other.splice(tid, 1);                 // remove from path
		state.Utils.pushKey(state.Path.keys.other,src,tid);
		state.Utils.pushKey(state.Path.keys.other,trg,sid);
 		//state.Utils.spliceArray(state.Path.keys.other,tid,0,src); // first position (table)
		//state.Utils.spliceArray(state.Path.keys.other,sid,0,trg); // first position (table)
		state.Path.exportAllKeys(state);
		reload=true;
	    }
	}
	state.Html.setFootnote(state,"Extracting data.");
	state.Html.setProgress(state, true);
	state.Navigate.store(state);
	state.Path.setLabel(state);
	state.Show.show(state,reload);
    };
    this.onClickRestValue=function(state,val,key,where) {
	//console.log("onClickRestValue:",val,key,JSON.stringify(state.Path.keys));
	if (state.Auto.selectTableKey(state,key,val,where,1,true)) {
	    state.Html.setFootnote(state,"Extracting data.");
	    state.Html.setProgress(state, true);
	    state.Navigate.store(state);
	    state.Path.setLabel(state);
	    state.Show.show(state);
	};
	//console.log("onClickRestValue done:",val,key,JSON.stringify(state.Path.keys));
    };
    this.pushTableKey=function(state,key) {
	var reload=true;
	var src=this.removeKey(state,key,state.Path.keys.path);
	if (src !== undefined) {
	    state.Utils.pushKey(state.Path.keys.other,src,0);
	} else if (state.Path.other.rest.indexof(key)!==-1 ||
		   state.Path.other.ignore.indexof(key)!==-1) {
	    src=this.removeKey(state,key,state.Path.keys.other);
	    if (src !== undefined) {
		state.Utils.pushKey(state.Path.keys.trash,src,0);
	    } else {
		reload=false;
	    }
	} else {
	    src=this.removeKey(state,key,state.Path.keys.trash);
	    if (src !== undefined) {
		state.Utils.pushKey(state.Path.keys.trash,src,0);
	    } else {
		reload=false;
	    };
	};
	if (reload) {
	    state.Path.table.ntarget=Math.min(state.Path.table.ntarget+1,
					      state.Path.maxtarget);
	    state.Path.table.nkeys=Math.min(state.Path.table.nkeys+1,
					    state.Path.table.ntarget);
	    this.implementKeyChange(state,reload);
	}
    }
    this.pushKeyToTable=function(state,tkey) {
	var tid=state.Path.keys.other.indexOf(tkey);
	var sid=state.Path.other.table.indexOf(tkey);
	if (tid !== -1 && sid === -1) {
	    var reload=true; // matrix changed?
	    var src=state.Path.keys.other.splice(tid, 1);  // remove from path
	    state.Utils.pushKey(state.Path.keys.other,src,0);
	    state.Path.table.ntarget=Math.min(state.Path.table.ntarget+1,state.Path.maxtarget);
	    state.Path.table.nkeys=Math.min(state.Path.table.nkeys+1,state.Path.table.ntarget);
	    this.implementKeyChange(state,reload);
	};
    };
    this.pushToOther=function(state,tkey) {
	var tid=state.Path.keys.other.indexOf(tkey);
	var sid=state.Path.other.table.indexOf(tkey);
	if (tid !== -1 && sid !== -1) {
	    var reload=true; // matrix changed?
	    var src=state.Path.keys.other.splice(tid, 1);  // remove from path
	    state.Utils.pushKey(state.Path.keys.other,src);
	    state.Path.table.ntarget=Math.max(state.Path.table.ntarget-1,0);
	    state.Path.table.nkeys=Math.max(state.Path.table.nkeys-1,0);
	    this.implementKeyChange(state,reload);
	};
    };
    this.pushKeyToOther=function(state,tkey) { // add key to other
	var ntab=state.Path.other.table.length;
	var reload=(ntab!==2); // matrix changed?
	var tid,tin,tib,sin,src;
	//console.log("Clicked:",ttyp,tkey,JSON.stringify(state.Path.keys),JSON.stringify(state.Path.other));
	//ttyp "select", "rest", "trash"
	//console.log("Adding start:",tkey,JSON.stringify(state.Path.keys.trash),JSON.stringify(state.Path.keys));
	sin=state.Path.keys.path.indexOf(tkey);
	tin=state.Path.keys.other.indexOf(tkey);
	tid=state.Path.keys.trash.indexOf(tkey);
	tib=state.Path.other.table.indexOf(tkey);
	if (tib !== -1) {reload=true;};
	if (tin === -1) { // add if not already in state.Path.keys.other
	    if (tid !== -1) {                                // trash => other
		src=state.Path.keys.trash.splice(tid, 1);
		state.Utils.pushKey(state.Path.keys.other,src); // last position
		state.Path.exportAllKeys(state);
		state.Auto.setKeyNumber(state);
		//if ( tin === -1 ) {
		//    state.Path.keys.other=state.Path.keys.other.concat(src);  // last position
		//};
	    } else if (sin !== -1) {                         // select => other
		state.Utils.pushKey(state.Path.keys.other,tkey); // last position
		//state.Path.keys.other=state.Path.keys.other.concat(tkey); // last position
		state.Path.exportAllKeys(state);
		state.Auto.setKeyNumber(state);
	    } else { // not in trash,select or other, how strange
		console.log("Strange key:",tkey,
			    JSON.stringify(state.Path.keys.trash),
			    JSON.stringify(state.Path.keys));
	    };
	} else { // remove if in state.Path.keys.other
	    if (sin !== -1) { // is already in selected list
		src=state.Path.keys.other.splice(tin, 1);
		state.Path.exportAllKeys(state);
		state.Auto.setKeyNumber(state);
	    } else if ( tid === -1) { // move to trash if its not already there
		src=state.Path.keys.other.splice(tin, 1);
		state.Utils.pushKey(state.Path.keys.trash,src);
		state.Path.exportAllKeys(state);
		state.Auto.setKeyNumber(state);
	    } else { // its already in trash, just delete it
		src=state.Path.keys.other.splice(tin, 1);
		state.Path.exportAllKeys(state);
		state.Auto.setKeyNumber(state);
	    }
	};
	this.implementKeyChange(state,reload);
	//console.log("Keys:",reload,JSON.stringify(state.Path.keys));
	//console.log("Trash:",reload,JSON.stringify(state.Path.trash));
	//console.log("Other:",JSON.stringify(state.Path.other));
    };
    // this.onClickPath=function(state,ttyp,tkey) {
    // 	var reload=false; // matrix changed?
    // 	var tid,tin,sin,src,tib;
    // 	//console.log("Clicked:",ttyp,tkey,JSON.stringify(state.Path.keys),JSON.stringify(state.Path.other));
    // 	if (ttyp  === "path") { // path -> table
    // 	    tid=state.Path.keys.path.indexOf(tkey);
    // 	    if (tid !== -1) {
    // 		var range=state.Path.getRange(state,tkey);
    // 		src=state.Path.keys.path.splice(tid, 1);                 // remove from path
    // 		if (range === undefined) { // remove if this is a range (lat/lon)
    // 		    state.Utils.pushKey(state.Path.keys.other,src,1);
    // 		};
    // 		//state.Utils.spliceArray(state.Path.keys.other,0,0,src); // first position (table)
    // 		state.Path.cleanSelect(state);
    // 		state.Auto.setKeyNumber(state);
    // 		//state.Auto.reorderKeys(state);
    // 		state.Navigate.store(state);
    // 		reload=true;
    // 	    }
    // 	} else if (ttyp  === "table") { // other -> table
    // 	    tid=state.Path.keys.other.indexOf(tkey);
    // 	    //console.log("Tin:",tin," tid:",tid);
    // 	    if (tid !== -1) {
    // 		src=state.Path.keys.other.splice(tid, 1);                 // remove from path
    // 		state.Utils.pushKey(state.Path.keys.other,src,0);
    // 		//state.Utils.spliceArray(state.Path.keys.other,0,0,src); // first position (table)
    // 		state.Auto.reorderKeys(state);
    // 		state.Path.exportAllKeys(state);
    // 		state.Navigate.store(state);
    // 		reload=true;
    // 	    }
    // 	} else if (ttyp === "rest") { // rest -> table
    // 	    tid=state.Path.keys.other.indexOf(tkey);
    // 	    if (tid !== -1) {
    // 		src=state.Path.keys.other.splice(tid, 1);                 // remove from path
    // 		state.Utils.pushKey(state.Path.keys.trash,src);
    // 		//state.Utils.spliceArray(state.Path.keys.other,0,0,src); // first position (table)
    // 		state.Auto.reorderKeys(state);
    // 		state.Navigate.store(state);
    // 		reload=true;
    // 	    };
    // 	} else if (ttyp === "trash") {
    // 	    tid=state.Path.keys.trash.indexOf(tkey);
    // 	    tin=state.Path.keys.other.indexOf(tkey);
    // 	    sin=state.Path.keys.path.indexOf(tkey);
    // 	    tib=state.Path.other.table.indexOf(tkey);
    // 	    console.log("Trashing start:",JSON.stringify(state.Path.keys.trash),tkey,tid,tin,sin,tib);
    // 	    if (tid !== -1) {                                             // trash => other
    // 		src=state.Path.keys.trash.splice(tid, 1);
    // 		state.Utils.pushKey(state.Path.keys.other,src);
    // 		//if ( tin === -1 ) {
    // 		//    state.Path.keys.other=state.Path.keys.other.concat(src);  // last position
    // 		//};
    // 	    } else if (tin !== -1 && tib !== -1) {                        // table => trash
    // 		src=state.Path.keys.other.splice(tin, 1);
    // 		state.Utils.pushKey(state.Path.keys.trash,src);
    // 		state.Auto.reorderKeys(state);
    // 		reload=true;
    // 		//state.Path.keys.trash=state.Path.keys.trash.concat(src);            // last position
    // 	    } else if (sin !== -1 && tin === -1) {                         // select => other
    // 		state.Utils.pushKey(state.Path.keys.other,tkey);
    // 		//state.Path.keys.other=state.Path.keys.other.concat(tkey); // last position
    // 	    } else if (sin !== -1 && tin !== -1) {                        // other => select
    // 		src=state.Path.keys.other.splice(tin, 1);
    // 	    } else if (sin === -1 && tin !== -1) {                        // other => trash
    // 		src=state.Path.keys.other.splice(tin, 1);
    // 		state.Utils.pushKey(state.Path.keys.trash,src);
    // 		//state.Path.keys.trash=state.Path.keys.trash.concat(src);            // last position
    // 	    };
    // 	    state.Path.exportAllKeys(state);
    // 	    state.Navigate.store(state);
    // 	    //console.log("Trashed:",JSON.stringify(state.Path.keys.trash),JSON.stringify(state.Path.keys));
    // 	}
    // 	state.Html.setFootnote(state,"Extracting data.");
    // 	state.Html.setProgress(state, true);
    // 	//console.log("Showing:",JSON.stringify(state.Path.other));
    // 	state.Path.setLabel(state);
    // 	state.Show.show(state,reload);
    // };
    this.switchTableKey=function(state,key) {
	var tid=state.Path.keys.other.indexOf(key);
	if (tid !== -1) {
	    var src=state.Path.keys.other.splice(tid, 1);                 // remove from path
	    state.Path.keys.other=state.Path.keys.other.concat(src);  // last position
	    //state.Utils.pushKey(state.Path.keys.other,src,0);       // first position
	    //state.Utils.spliceArray(state.Path.keys.other,0,0,src); // first position (table)
	    state.Path.exportAllKeys(state);
	    var colkey=state.Path.getColKey(state);
	    var rowkey=state.Path.getRowKey(state);
	    state.Navigate.store(state);
	    var reload=(src[0]!==colkey && src[0]!==rowkey);
	    //console.log("Switched:",JSON.stringify(src[0]),colkey,rowkey,reload);
	    state.Path.setLabel(state);
	    state.Show.show(state,reload);
	}	
    };
    this.selectElements=function(state,elements) {
	// only select common values/ranges...
	var keys;
	var values;
	var ranges;
	var where;
	var cnt;
	var lene=elements.length;
	//console.log("Elements:",lene,JSON.stringify(elements));
	for (var ee=0; ee<lene; ee++) {
	    var el=elements[ee];
	    if (keys===undefined) {
		keys=state.Utils.cp(el.keys);
		where=state.Utils.cp(el.where);
		cnt=state.Utils.cp(el.cnt);
	    };
	    if (keys !== undefined) {
		var lenk=keys.length;
		for (var kk=0;kk<lenk;kk++) {
		    var key=keys[kk];
		    var val=el.values[key];
		    if (val !== undefined) {
			if (values===undefined) {values={};};
			if (values[key]===undefined) {values[key]=[];};
			//console.log("Values:",key,JSON.stringify(values));
			if (values[key].indexOf(val)===-1) {values[key].push(val);}
		    };
		    var range=el.ranges[key];
		    if (ranges !== undefined) {
			if (ranges===undefined) {ranges={};};
			if (ranges[key]===undefined) {ranges[key]=[];};
			ranges[key]=state.Grid.combineRange(ranges[key],range);
		    };
		}
	    }
	}
	//console.log("Key:",JSON.stringify(keys),JSON.stringify(values));
	if (keys !== undefined) { // we have common keys...
	    this.selectKeys(state,keys,values,range,where,cnt);
	}
    };
    this.selectElement=function(state,el) {
	this.selectKeys(state,el.keys,el.values,el.ranges,el.where,el.cnt);
    };
    this.selectKeys=function(state,keys,val,range,where,cnt,pp) {
	//console.log("SelectKeys keys:",JSON.stringify(keys)," val:",JSON.stringify(val),
	//	    " range:",JSON.stringify(range)," where:",JSON.stringify(where));
	if (state.Path.focusHasChanged(state)) {state.Navigate.store(state,false);};
	if (pp===undefined) {pp=true;};
	var bok=true;
	var changed=false;
	if (Array.isArray(keys)) { // multiple keys
	    if (val === undefined)   {val={};};
	    if (range === undefined) {range={};};
	    if (where === undefined) {where={};};
	    if (cnt === undefined)   {cnt={};};
	    //console.log("SelectKeys:",JSON.stringify(keys),JSON.stringify(val),
		//	JSON.stringify(range),JSON.stringify(where));
	    keys.forEach( key=> {
		if (bok) {
		    var stat=this.selectKeys(state,key,val[key],range[key],where[key],cnt[key],false);
		    if (! bok) {bok=false;}
		    if (stat.changed) {changed=true;};
		};
	    });
	} else { // single
	    var rank;
	    //console.log("Select Key:",JSON.stringify(keys),JSON.stringify(val),
	    //		JSON.stringify(range),JSON.stringify(where));
	    var key=keys;
	    if (range !== undefined) { // select range
		rank=state.Utils.cp(state.Path.keys.other);
		if (this.setKeyRange(state,key,range,where)) {
		    this.rank[key]=state.Utils.cp(rank);
		    changed=true;
		}
	    } else { // select values (val defined or undefined
		rank=state.Utils.cp(state.Path.keys.other);
		if (state.Auto.selectTableKey(state,key,val,where,cnt)) {
		    //console.log("Selected:",JSON.stringify(state.Path.keys),JSON.stringify(state.Path.other));
		    this.rank[key]=state.Utils.cp(rank);
		    changed=true;
		} else if (state.Path.table.nkeys < 2) {
		    state.Auto.reorderKeys(state);
		} else {
		    bok=false;
		    console.log("Unable to select:",key,state.Path.table.nkeys,JSON.stringify(val),where,cnt);
		};
	    };
	    if (pp && changed) { // check if other keys are redundant..
		rank=state.Utils.cp(state.Path.keys.other);
		var othkeys=state.Path.getOtherTableKeys(state,key);
		//loop over keys and check if redundant
		var leno=othkeys.length;
		for (var ii=0;ii<leno;ii++) {
		    var okey=othkeys[ii];
		    var vals=state.Database.getValues(state,okey);
		    if (vals.length===1) { // select
			var oval=vals[0];
			var owhere=state.Database.getWhereDynamic(state,okey,oval)
			//console.log("Key is redundant:",okey," val:",oval," ",owhere);
			if (this.bdeb) {console.log("Checking ",okey," -> ",oval," ",owhere);};
			if (state.Auto.selectTableKey(state,okey,oval,owhere,1)) {
			    //console.log("Selected:",JSON.stringify(state.Path.keys),JSON.stringify(state.Path.other));
			    this.rank[okey]=state.Utils.cp(rank);
			    changed=true;
			} else if (state.Path.table.nkeys < 2) {
			    state.Auto.reorderKeys(state);
			} else {
			    bok=false;
			    console.log("Unable to select:",key,state.Path.table.nkeys,JSON.stringify(val),where,cnt);
			};
		    }
		}
	    }
	}
	if (changed && pp) {
	    //this.trash[key]=state.Path.checkTableKeys(state);
	    //console.log("state.Path.checkTableKeys Done.",key,JSON.stringify(this.trash[key]));
	    this.implementKeyChange(state);
	}
	return {bok:bok,changed:changed};
    };
    this.selectItemRange=function(state,colkey,rowkey,colrange,rowrange,colwhere,rowwhere,colcnt,rowcnt) {
	//console.log("SelectItemRange:",colkey,JSON.stringify(colrange)," row=",rowkey,JSON.stringify(rowrange));
	if (state.Path.focusHasChanged(state)) {
	    //console.log("Stored focus...",JSON.stringify(state.Path.focus));
	    state.Navigate.store(state,false);
	};
	var rank=state.Utils.cp(state.Path.keys.other);
	if (this.setKeyRange(state,colkey,colrange,colwhere)) {
	    this.rank[colkey]=state.Utils.cp(rank);
	    //this.flip[colkey]=this.getFlip(state);
	    if (this.setKeyRange(state,rowkey,rowrange,rowwhere)) {
		this.rank[rowkey]=state.Utils.cp(rank);
		//this.last.flip[rowkey]=this.getFlip(state);
	    }
	    //this.trash[colkey]=state.Path.checkTableKeys(state);
	    //console.log("state.Path.checkTableKeys Done.",colkey,JSON.stringify(this.trash[colkey]));
	};
	//console.log("Path:",JSON.stringify(state.Path))
	state.Html.setFootnote(state,"Extracting data.");
	state.Html.setProgress(state, true);
	state.Navigate.store(state);
	state.Path.setLabel(state);
	state.Show.show(state);		
    };
    this.selectCustom=function(state,layout,colkey,rowkey,colval,rowval,colwhere,rowwhere,colcnt,rowcnt) {
	//console.log("SelectCustom:",layout,colkey,rowkey,colval,rowval,colwhere,rowwhere,colcnt,rowcnt);
	var rank=state.Utils.cp(state.Path.keys.other);
	var criteria=state.Custom.getCriteria(state,layout,colval,rowval);
	if (criteria !== undefined) {
	    var changed=false;
	    var keys=Object.keys(criteria);
	    var lenk=keys.length;
	    for (var kk=0; kk< lenk; kk++) {
		var key=keys[kk];
		var vals=criteria[key];
		if (state.Auto.selectTableKey(state,key,vals,colwhere,colcnt)) {
		    //console.log("Selected:",colkey,colval,JSON.stringify(state.Path.keys),JSON.stringify(state.Path.other));
		    this.rank[key]=state.Utils.cp(rank);
		    changed=true;
		};
	    };
	    if (changed) {
		//this.trash[colkey]=state.Path.checkTableKeys(state);
		//console.log("state.Path.checkTableKeys Done.",colkey,JSON.stringify(this.trash[colkey]));
		state.Html.setFootnote(state,"Extracting data.");
		state.Html.setProgress(state, true);
		state.Navigate.store(state);
		state.Path.setLabel(state);
		state.Show.show(state);
	    }
	    //console.log("Found criteria:",JSON.stringify(criteria));
	} else {
	    this.selectItem(state,colkey,rowkey,colval,rowval,colwhere,rowwhere,colcnt,rowcnt);
	}
    };
    this.selectItem=function(state,colkey,rowkey,colval,rowval,colwhere,rowwhere,colcnt,rowcnt) {
	//console.log("Selectitem:",colkey,rowkey,colval,rowval,colwhere,rowwhere,colcnt,rowcnt);
	//var colkey=state.Path.getColKey(state);
	//var rowkey=state.Path.getRowKey(state);
	var rank=state.Utils.cp(state.Path.keys.other);
	//console.log("SelectItem:",colkey,"=",colval,"  ",rowkey,"=",rowval);
	var changed=false;
	if (state.Auto.selectTableKey(state,colkey,colval,colwhere,colcnt)) {
	    //console.log("Selected:",colkey,colval,JSON.stringify(state.Path.keys),JSON.stringify(state.Path.other));
	    this.rank[colkey]=state.Utils.cp(rank);
	    changed=true;
	} else if (state.Path.table.nkeys < 2) {
	    state.Auto.reorderKeys(state);
	} else {
	    console.log("Unable to select:",colkey,state.Path.table.nkeys);
	};
	if (state.Auto.selectTableKey(state,rowkey,rowval,rowwhere,rowcnt)) {
	    //console.log("Selected:",rowkey,rowval,JSON.stringify(state.Path.keys),JSON.stringify(state.Path.other));
	    this.rank[rowkey]=state.Utils.cp(rank);
	    changed=true;
	} else if (state.Path.table.nkeys < 2) {
	    state.Auto.reorderKeys(state);
	} else {
	    console.log("Unable to select:",rowkey,state.Path.table.nkeys);
	}
	if (changed) {
	    //this.trash[colkey]=state.Path.checkTableKeys(state);
	    //console.log("state.Path.checkTableKeys Done.",colkey,JSON.stringify(this.trash[colkey]));
	    state.Html.setFootnote(state,"Extracting data.");
	    state.Html.setProgress(state, true);
	    state.Navigate.store(state);
	    state.Path.setLabel(state);
	    state.Show.show(state);
	}
	//console.log("Selectitem Done:",rowwhere,colwhere);
    };
    this.setKeyRange=function(state,key,range,where) { // keep abscissa
	//console.log("Table.Selecting:",key,"=",val,", where=",where);
	state.Path.select.range[key]=[range.min,range.max];
	state.Path.where[key]=where;
	//console.log("setKeyRange:",key,JSON.stringify(state.Path.select.range[key]));
	if (state.Utils.missing(state.Path.keys.path,key)) {
	    //console.log("Adding to path:",key);
	    state.Utils.pushKey(state.Path.keys.path,key);
	    //state.Path.keys.path=state.Path.keys.path.concat(key); // last path position
	};
	return true;
    };
    this.selectKeyRange=function(state,key,range,where) {
	var rank=state.Utils.cp(state.Path.keys.other);
	if (this.setKeyRange(state,key,range,where)) {
	    this.rank[key]=state.Utils.cp(rank);
	}
	state.Html.setFootnote(state,"Extracting data.");
	state.Html.setProgress(state, true);
	state.Navigate.store(state);
	state.Path.setLabel(state);
	state.Show.show(state);
    };
    this.selectKey=function(state,key,val,where,cnt) {
	var rank=state.Utils.cp(state.Path.keys.other);
	//console.log("SelecRow: rowkey=",key," val=",val);
	if (state.Auto.selectTableKey(state,key,val,where,cnt)) {
	    //console.log("Auto-SelectKey:",key,val,where,cnt);
	    this.rank[key]=rank;
	    //this.trash[key]=state.Path.checkTableKeys(state);
	    //console.log("state.Path.checkTableKeys Done.",rowkey,JSON.stringify(this.trash[key]));
	    state.Html.setFootnote(state,"Extracting data.");
	    state.Html.setProgress(state, true);
	    state.Navigate.store(state);
	    state.Path.setLabel(state);
	    state.Show.show(state);
	} else if (state.Path.table.nkeys < 2) {
	    //console.log("Static-SelectKey:",key,val,where,cnt);
	    state.Auto.reorderKeys(state);
	} else {
	    console.log("Unable to select:",key,state.Path.table.nkeys);
	}
	//console.log("Finally:",JSON.stringify(state.Path.keys.other));
    };
    this.snapshotToString=function(state,snapshot) {
	return ("Snapshot: " + JSON.stringify(snapshot.keys.path));
    };
    this.printSnapshot=function(state) {
	var lenv=state.Navigate.history.track.length;
	for (var ii=0;ii<lenv;ii++) {
	    var snapshot=state.Navigate.history.track[ii];
	    if (ii===state.Navigate.history.pos) {
		console.log("@@@@",ii," => ",this.snapshotToString(state,snapshot));
	    } else {
		console.log("    ",ii," => ",this.snapshotToString(state,snapshot));
	    }
	};
    };
};
export default Navigate;
