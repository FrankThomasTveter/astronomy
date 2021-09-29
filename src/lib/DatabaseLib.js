//console.log("Loading DatabaseLib.js");
import addNotification from 'react-push-notification';

//import {alasql} from "alasql";
//const alasql = window.alasql;
const alasql = require('alasql');

function Database() {
    this.bdeb=false;
    this.processing=false;
    var ret;
    this.files={};
    this.summarydir="";
    this.summaries=["summary"];
    this.summary=[];
    this.sumcnt={};
    this.fragments=[];        // frags to be loaded
    this.fragload=[];         // active loaded
    this.fragjson={};         // json[frag]
    this.fragfile={};         // file[frag]
    this.fragcnt={};          // cnt[frag]
    this.fragthr=[{background:"LightSalmon",foreground:"Black",range:[23*3600*1000,null]}, 
		  {background:"Lime",foreground:"Black",range:[null,3600*1000]}, 
		  {background:"Yellow",foreground:"Black",range:[null,null]}];
    this.notification={mode:0,maxLevel:0};
    this.fragdtg=null;
    this.loaded="";
    this.append=false;
    this.indexDtg=undefined; // undefined is first element, otherwise dtg, null is custom
    this.keyCnt={};
    this.values= {};
    this.epoch0=0;
    this.jsonOrg={};
    this.arrayConstructor=[].constructor;
    this.objectConstructor={}.constructor;
    this.casc=0; // key is sorted ascending
    this.cdes=1; // key is sorted descending
    this.nasc=2; // key is sorted ascending
    this.ndes=3; // key is sorted descending
    //this.delay=5*1000; // step length in ms (film reel period)
    //this.step=2;       // steps between each server polling
    this.delay=10*1000;  // step length in ms (film reel)
    this.step=6;         // steps between each server polling
    this.stepCnt=0;      // current step count
    this.loadcnt=0;      // polling count
    this.loadfile=0;      // polling count
    this.maxLevel=-99;
    this.dbcnt=0;        // records in database
    this.ready=true;     // can we poll server or is another poll running
    this.viewOldData=false;  //  keep old data?
    this.log="";
    this.mod="";
    this.keytrg={Missing:-1,
		 Null:0,
		 Value:1,
		 Min:2,
		 Max:3
		};
    this.db=null;
    this.init=function(state){
	//state.Utils.init("Database",this);
    };
    this.toggleDisplayOld=function(state) {
	//console.log("Show.view before:",this.state.viewMode,JSON.stringify(this.state),JSON.stringify(this.modes));
	state.Database.viewOldData=!state.Database.viewOldData;
	state.Show.showAll(state);
    };
    this.toggleNotification=function(state) {
	//console.log("Show.view before:",this.state.viewMode,JSON.stringify(this.state),JSON.stringify(this.modes));
	state.Database.notification.mode=(state.Database.notification.mode+1)%3
	state.Show.showConfig(state);
    };
    this.getNotificationMode=function(state) {
	//console.log("Show.view before:",this.state.viewMode,JSON.stringify(this.state),JSON.stringify(this.modes));
	return state.Database.notification.mode;
    };
    this.newDb=function(state) {
	if (state.Database.append && this.db !== null) {
	    // keep old database...
	    //console.log("Keeping old database...");
	} else {
	    this.db=new alasql.Database();
	    //console.log("Alasql:",JSON.stringify(this.db));
	    this.dbcnt=0;
	};
    };
    this.saveOrg=function(state,json) {
	if (state.Database.append && this.jsonOrg !== undefined) {
	    var keys=Object.keys(json);
	    var lenk=keys.length;
	    for (var ii=0;ii<lenk;ii++) {
		var key=keys[ii];
		if (this.jsonOrg[key] !== undefined) {
		    if (Array.isArray(this.jsonOrg[key]) && Array.isArray(json[key])) {
			state.Utils.appendArray(this.jsonOrg[key],json[key]);
		    } else {
			this.jsonOrg[key]=json[key];
		    }
		} else {
		    this.jsonOrg[key]=json[key];
		}
	    }
	} else {
	    this.jsonOrg=state.Utils.cp(json);
	}
    };
    this.makeTable=function(state) {
	if (state.Database.append) {
	    //console.log("Keeping data...");
	    this.query('CREATE TABLE IF NOT EXISTS alarm;');
	} else {
	    //console.log("Deleting data...");
	    this.query('DROP TABLE IF EXISTS alarm; CREATE TABLE alarm;');
	    this.dbcnt=0;
	};
    };
    this.updateLoop=function(state) {
	if (this.bdeb) {console.log("Updating database...");}
	this.setTime(state);
	if (this.stepCnt%this.step===0) {
	    this.load(state);
	} else {
	    state.Path.nextFilm(state);
	};
	this.stepCnt=(this.stepCnt+1)%this.step;
	setTimeout(function() {
	    state.Database.updateLoop(state)
	},state.Database.delay); //state.Database.delay
    }.bind(this);
    this.getDtg=function(state) {
	var now = new Date();
	var yyyy = now.getFullYear();
	var mm = String(now.getMonth() + 1).padStart(2, '0'); //January is 0!
	var dd = String(now.getDate()).padStart(2, '0');
	var hh =  String(now.getHours()).padStart(2, '0');
	var mi =  String(now.getMinutes()).padStart(2, '0');
	var ret = ''+yyyy+mm+dd+hh+mi;
	//console.log("Date:",ret," -> ",yyyy,"/",mm,"/",dd,"T",hh,":",mi);
	return (ret);
    };
    this.getDbDtg=function(state) {
	var now = new Date();
	var yyyy = now.getFullYear();
	var mm = String(now.getMonth() + 1).padStart(2, '0'); //January is 0!
	var dd = String(now.getDate()).padStart(2, '0');
	var hh =  String(now.getHours()).padStart(2, '0');
	//var mi =  String(now.getMinutes()).padStart(2, '0');
	var ret = ''+yyyy+"-"+mm+"-"+dd+"_"+hh; // 2021-02-03_12
	//console.log("Date:",ret," -> ",yyyy,"/",mm,"/",dd,"T",hh,":",mi);
	return (ret);
    };
    this.getPrettyDtg=function(state) {
	var now = new Date();
	var yyyy = now.getFullYear();
	var mm = String(now.getMonth() + 1).padStart(2, '0'); //January is 0!
	var dd = String(now.getDate()).padStart(2, '0');
	var hh =  String(now.getHours()).padStart(2, '0');
	var mi =  String(now.getMinutes()).padStart(2, '0');
	var ret = ''+yyyy+"/"+mm+"/"+dd+" "+hh+":"+mi;
	//console.log("Date:",ret," -> ",yyyy,"/",mm,"/",dd,"T",hh,":",mi);
	return (ret);
    };
    this.getFileDtg=function(state,file) {
	if (file === undefined) {
	    console.log("Invalid call to getFileDtg...");
	} else {
	    var regex = /\d+_(?<dtg>\d{8}T\d{4}).json/;
	    var mm = file.match(regex);
	    if (mm !== undefined && mm !== null) {
		var found = mm.groups;
		if (found !== null && found !== undefined && found.dtg !== undefined) {
		    return found.dtg;
		} else {
		    return;
		}
	    } else {
		//console.log("Invalid file dtg:",file);
		return;
	    }
	};
    };
    this.getDataFile=function(state,frag,files,index) {
	var file=this.getIndexFile(state,frag,files,index);
	//console.log("Checking file:",frag,file," loaded:",state.Database.fragfile[frag]);
	if (file !== undefined && state.Database.fragfile[frag] !== file) {
	    return file;      // file should be reloaded
	} else if (file === undefined) {
	    return undefined; // file should be ignored
	} else {
	    return null;      // file should not be reloaded
	}
    };
    this.getIndexFile=function(state,frag,files,index) {
	// no file returns undefined
	// ok file returns file name
	var file;
	if (index === undefined) {
	    if (files.length>0) {
		file=files[0];
	    }
	} else {
	    var lenf=files.length;
	    var indx={};
	    // sort files
	    var ii;
	    var dtg;
	    for (ii=1;ii<lenf;ii++) {
		file=files[ii];
		dtg=this.getFileDtg(state,file);
		if (dtg !== undefined) {
		    //console.log("Indexing:",dtg,"->",file);
		    indx[dtg]=file;
		};
	    };
	    file=undefined;
	    var dtgs=Object.keys(indx).sort();
	    var lend=dtgs.length;
	    for (ii=0;ii<lend;ii++) {
		dtg=dtgs[ii];
		//console.log("Dtg:",dtg,index,dtg>=index,indx[dtg]);
		if (dtg !== undefined && dtg <=  index) {
		    file=indx[dtg];
		} else {
		    break;
		}
	    }
	}
	//console.log("getIndexFile:",frag,file,"   ",index);
	return file;
    };
    this.getDtgs=function(state) {
	var ret=[];
	var frags=this.getFragmentActive(state);//Object.keys(state.Database.files);
	var lenp=frags.length;
	for (var ii=0;ii<lenp;ii++) {
	    var frag=frags[ii];
	    var files=state.Database.files[frag]
	    var lenf=files.length;
	    for (var jj=0;jj<lenf;jj++) {
		var file=files[jj];
		var dtg=this.getFileDtg(state,file);
		if (ret.indexOf(dtg)===-1) {
		    ret.push(dtg);
		};
	    };
	};
	return ret.sort().reverse();
    };
    this.cleanFrag=function(state,frag) {
	if (state.Database.fragfile[frag] !== undefined) {
	    delete state.Database.fragfile[frag];
	};
	if (state.Database.fragjson[frag] !== undefined) {
	    delete state.Database.fragjson[frag];
	};
    };
    this.getDate=function(epoch) {
	//2021-06-18_05-00-01.000Z
	if (epoch===undefined) {return new Date();};
	var yy=parseInt(epoch.substring(0,4));
	var mm=parseInt(epoch.substring(5,7));
	var dd=parseInt(epoch.substring(8,10));
	var hh=parseInt(epoch.substring(11,13));
	var mi=parseInt(epoch.substring(14,16));
	var ss=parseInt(epoch.substring(17,23));
	return (new Date(Date.UTC(yy,mm-1,dd,hh,mi,ss)));
    };
    this.getFragThr=function(state) {
	return this.fragthr;
    };
    this.getFragTimes=function(state) {
	var ret={};
	var fragments=state.Database.getFragments(state);
	var lenr=fragments.length;
	for (var ii=0;ii<lenr;ii++) {
	    var frag=fragments[ii];
	    var json=state.Database.fragjson[frag];
	    var cnt,epoch,ifirst,ilast,dfirst,dlast;
	    if (json !== undefined) { // epoch,cnt,ifirst,ilast,dfirst,dlast,data
		cnt=parseInt(json.cnt,0);
		epoch=(typeof json.epoch === 'undefined') ? null : json.epoch ;
		ifirst=(typeof json.ifirst === 'undefined') ? null : json.ifirst ;
		ilast=(typeof json.ilast === 'undefined') ? null : json.ilast ;
		dfirst=(typeof json.dfirst === 'undefined') ? null : json.dfirst ;
		dlast=(typeof json.dlast === 'undefined') ? null : json.dlast ;
	    } else {
		cnt=null;
		epoch=null;
		ifirst=null;
		ilast=null;
		dfirst=null;
		dlast=null;
	    };
	    //var hrs=(millis/3600000).toFixed(2); // hours
	    //var hst=("          " + hrs).slice(-10) + "h";
	    ret[frag]= {epoch:epoch,
			ifirst:ifirst,ilast:ilast,
			dfirst:dfirst,dlast:dlast,
			frag:frag,cnt:cnt};
	};
	return ret;
    };
    this.combineJsons=function(state,nfrags,frags) {
	var data=[];
	var epoch,ifirst,ilast,dfirst,dlast;
	var lenp=frags.length;
	for (var ii=0;ii<lenp;ii++) {
	    var frag=frags[ii];
	    if (nfrags.indexOf(frag)===-1) { // ignore old stuff
		console.log("Ignoring:",frag);
		this.cleanFrag(state,frag);
	    } else { // join data
		var json=state.Database.fragjson[frag];
		if (json !==undefined && json.data !==undefined) {
		    state.Utils.cpArray(data,json.data);
		    if (epoch !== undefined && epoch < json.epoch) {
			epoch=json.epoch;
		    } else if (epoch === undefined) {
			epoch=json.epoch;
		    }
		    if (ifirst !== undefined && ifirst < json.ifirst) {
			ifirst=json.ifirst;
		    } else if (ifirst === undefined) {
			ifirst=json.ifirst;
		    }
		    if (ilast !== undefined && ilast > json.ilast) {
			ilast=json.ilast;
		    } else if (ilast === undefined) {
			ilast=json.ilast;
		    }
		    if (dfirst !== undefined && dfirst < json.dfirst) {
			dfirst=json.dfirst;
		    } else if (dfirst === undefined) {
			dfirst=json.dfirst;
		    }
		    if (dlast !== undefined && dlast > json.dlast) {
			dlast=json.dlast;
		    } else if (dlast === undefined) {
			dlast=json.dlast;
		    }
		} else {
		    console.log("Undefined fragment:",frag);
		}
	    }
	}
	return {data:data,epoch:epoch,
		ifirst:ifirst,ilast:ilast,
		dfirst:dfirst,dlast:dlast};
    };
    this.load=function(state) { // autoload function
	if (state.Database.indexDtg === undefined) {
	    state.Database.loadDataFragments(state);
	};
    };
    this.lastLoad=function(state) {
	var fragments=state.Database.getFragments(state);
	var lenr=fragments.length;
	var last;
	for (var ii=0;ii<lenr;ii++) {
	    var frag=fragments[ii];
	    var cnt=state.Database.fragcnt[frag];
	    if (cnt !== undefined) {
		if (last === undefined) {
		    last=cnt;
		} else {
		    last=Math.max(last,cnt);
		};
	    };
	};
	return last;
    };
    this.processSummary=function(state,file,summary) {
	var lines=summary.split(/\r?\n/);
	var reg = /^(?<frag>\S+)\s+(?<size>\d+)$/;
	var lenl=lines.length;
	for (var ii=0;ii<lenl;ii++) {
	    var line=lines[ii];
	    var mm=line.match(reg).groups;
	    if (mm.frag !== undefined) {
		state.Database.summary.push(mm.frag);
		state.Database.sumcnt[mm.frag]=mm.size;
	    }
	}
    };
    this.loadSummary=function(state, response, callbacks ) {
	if (this.bdeb) {console.log("Loading summary.");};
	state.Database.summary=[];
	state.Database.sumcnt={};
	var sequence = Promise.resolve();
	// loop over polygons and collect promises
	var lens=state.Database.summaries.length;
	for (var ii=0;ii<lens;ii++) {
	    let file=state.Database.summaries[ii];
	    if (file !==undefined && file!=="") {
		let path=state.Database.summarydir + file;
		const complete=function(result) {
		    //console.log(file,result);
		    state.Database.processSummary(state,file,result);
		};
		sequence = sequence.then(
		    function() {
			return state.File.get(path);
		    }
		).then(complete).catch(
		    function(err) {
			//console.log("Unable to load:"+name," ("+err.message+")");
		    });
	    };
	};
	sequence.then(function() {
	    if (state.Database.summary.length === 0) {
		state.Html.broadcast(state,"Summary contains no fragments.",'warning');
	    };
	    //console.log("Normal end...");
	    //console.log(JSON.stringify(state.Database.sumcnt));
	}).catch(function(err) {
	    // Catch any error that happened along the way
	    console.log("Error msg: " + err.message);
	}).then(function() {
	    // always do this
	    //console.log("This is the end...",callbacks.length);
	    state.File.next(state,"",callbacks);
	})
	//console.log("Polygons:",JSON.stringify(state.Polygon.names));
    }.bind(this);
    // extract parent path relative to granny
    this.getParentName=function(state,granny,parent) {
	var grn = new RegExp("^" + granny + "(?<name>.*)$");
	var mm=parent.match(grn);
	if (mm !== undefined && mm !== null) {
	    var found = mm.groups;
	    if (found !== null && found !== undefined && found.name !== undefined) {
		return (found.name);
	    };
	};
	return "Bastard";
    };
    this.getName=function(frag,gl,mg) {
	var name="";
	if (frag !== undefined) {
	    if (gl===undefined) { gl=0;};
	    var lenf=frag.length;
	    if (mg===undefined) { mg=lenf;};
	    mg=Math.min(mg,lenf);
	    for (var ii=gl;ii<mg;ii++) {
		if (name !== "") {name=name+"/";};
		name=name + frag[ii];
	    };
	}
	return name
    };
    this.fragmentMatch=function(f1,f2,gg) {
	if (f1 === undefined || f2 === undefined) {
	    //console.log("Invalid match",f1,f2,gg);
	    return (true);
	} else {
	    var len1=f1.length;
	    var len2=f2.length;
	    if (gg === undefined) { gg= len1;};
	    for (var ii=0; ii< Math.min(len1,len2,gg);ii++) {
		if (f1[ii] !== f2[ii]) { return false;}
	    };
	    return (true);
	}
    };
    //return	([{
    //	    value: 'data/cape',
    //	    label: 'cape',
    //	    children: [
    //		{ value: 'phobos', label: 'Phobos' },
    //		{ value: 'deimos', label: 'Deimos' },
    //	    ]}]);
    // get a list of all the fragments...
    this.getFragmentList=function(state) {
	var bdeb=false; // false
	var makeMap= function(map,summary) {
	    var ss=summary.replace(/\/+$/, ""); // path must not end with "/"
	    var parts=ss.split("/");
	    var pos=map;
	    parts.forEach((part) => {
		if (pos.sub===undefined) {pos.sub={};};
		if (pos.sub[part]===undefined) {pos.sub[part]={};};
		pos=pos.sub[part];
	    });
	    pos["value"]=summary;
	};
	var makeLabels= function(map,summary) {
	    var ss=summary.replace(/\/+$/, ""); // path must not end with "/"
	    var parts=ss.split("/");
	    var pos=map;
	    var val="";
	    var lab="";
	    parts.forEach((part) => {
		if (pos.sub===undefined || pos.sub[part]===undefined) {
		    console.log("System error:",part,JSON.stringify(pos),
				JSON.stringify(parts));
		} else if (Object.keys(pos.sub).length > 1) {
		    pos["value"]=val;
		    pos["label"]=lab;
		    lab=part;
		    pos=pos.sub[part];
		} else if (Object.keys(pos.sub).length > 0)  {
		    if (lab==="") { lab=part;};
		    pos=pos.sub[part];
		};
		if (val!=="") { val=val+"/";};
		val=val+part;
	    });
	    pos["label"]=lab;
	};
	var makeTree=function(map) {
	    var tree={};
	    var value=map["value"];
	    var label=map["label"];
	    var sub=map["sub"];
	    var keys;
	    if (label!==undefined) {
		tree["value"]=value||"";
		tree["label"]=label;
		if (sub!==undefined) {
		    var children=[];
		    keys=Object.keys(sub);
		    keys.forEach((key, index) => {
			children.push(makeTree(sub[key]))
		    });
		    tree["children"]=children;
		};
	    } else { // there is zero or one key....
		keys=Object.keys(sub);
		keys.forEach((key, index) => {
		    tree=makeTree(sub[key]);
		});
	    };
	    return tree;
	};
	// make map
	var map={};
	var summary=state.Database.summary.sort();
	var lens=summary.length;
	var jj;
	for (jj=0; jj<lens;jj++) {
	    if (bdeb) {console.log("Fragment:",jj,JSON.stringify(summary[jj]));};
	    makeMap(map,summary[jj]);
	};
	for (jj=0; jj<lens;jj++) {
	    if (bdeb) {console.log("Fragment:",jj,JSON.stringify(summary[jj]));};
	    makeLabels(map,summary[jj]);
	};
	if (bdeb) {console.log("Map:",JSON.stringify(map));};
	// create structure...
	var tree=makeTree(map);
	if (bdeb) {console.log("Fragmentlist:",JSON.stringify(tree));};
	return [tree];
    };
    this.getFragmentActive=function(state) {
	var bdeb=false;
	var ret=[];
	var frags=state.Database.fragload.sort();
	var lenf=frags.length;
	for (var ii=0;ii<lenf;ii++) {
	    var frag=frags[ii];
	    ret.push(frag);
	};
	if (bdeb) {console.log("Active:",JSON.stringify(ret));};
	return	(ret);
    };
    this.setFragmentActive=function(state,items) {
	//console.log("Setting active fragments:",JSON.stringify(items));
	state.Database.fragments=state.Utils.cp(items);
    };
    this.getFragments=function(state) {
	var ret=[];
	var lens=state.Database.summary.length;
	var lenf=state.Database.fragments.length;
	var regs=[];
	for (var kk=0;kk<lenf;kk++) {
	    let frag=state.Database.fragments[kk]||"data";
	    regs.push(new RegExp(frag));
	};
	for (var jj=0;jj<lens;jj++) {
	    let sum=state.Database.summary[jj]||"";
	    var found=false;
	    for (var ii=0;ii<lenf;ii++) {
	    	var reg = regs[ii];
		let mm=sum.match(reg);
		if (mm !== undefined && mm !== null && mm.length>0) {
		    //console.log("Summary:",jj,sum,frag,JSON.stringify(mm));
		    found=true;
		}
	    };
	    if (found) {ret.push(sum);}
	};
	if (ret.length===0) {
	    console.log("No valid DB-fragments specified!");
	} else if (this.bdeb) {
	    console.log("Fragments found:",ret.length);
	}
	return ret;
    };
    // remove active fragments from internal database
    this.clearDataFragments=function(state) {
	state.Database.fragload=[];
    };
    // executed after Default-URL has been loaded and before other URL load
    this.loadDataFragments=function(state,index,callbacks,verbose) {
	// loop over all register files, read content, load data...
	// Start off with a promise that always resolves
	state.Database.loadcnt=state.Database.loadcnt+1;
	state.Database.loadfile=0
	var sequence = Promise.resolve();
	// loop over register files and collect promises
	var newfrags=[];
	var oldfrags=state.Database.getFragmentActive(state); // active fragments
	var fragments=state.Database.getFragments(state); // requested fragments...
	let lenf=fragments.length;
	if (lenf===0) {
	    if (verbose === "verbose") {
		state.Html.broadcast(state,"No valid DB-fragments specified.",'warning');
	    };
	    console.log("No valid DB-fragments specified.");
	} else {
	    //console.log("Processing fragments: ",lenf);
	    for (let ii=0;ii<lenf;ii++) {
		let frag=fragments[ii]||"data";
		//newfrags.push(frag);
		let path=frag + "/register"; // register dir
		//console.log("Fragment ",ii,frag);
		let file;
		let readRegister=function() {
		    return state.File.get(path);
		};
		let processRegister=function(result) {
		    var files=result.split('\n');
		    state.Database.files[frag]=files;
		    file=state.Database.getDataFile(state,frag,files,index);
		    if (file === undefined || file === null) {
			return file;
		    } else  {
			return file; // get name of data file
		    }
		};
		let errorRegister=function(err) {
		    //state.Html.broadcast(state,"Register error: "+frag,'warning');
		    state.Html.broadcast(state,frag+":"+err.message,'warning');
		    console.log("Unable to load: "+path+" ("+err.message+")");
		};
		let readData=function(file) {
		    if (file === undefined) { // file is obsolete
			state.Database.fragfile[frag]=undefined;
			return null;
		    } else if  (file === null) { // file is loaded
			newfrags.push(frag);
			return null; //state.Database.fragjson[frag]; //file;
		    } else { // load new file
			newfrags.push(frag);
			var path=frag+"/"+file;
			state.Database.fragfile[frag]=file;
			if (ii===0) {
			    state.Html.broadcast(state,"Checking "+lenf+" DB-fragments.");
			};
			state.Database.loadfile=state.Database.loadfile+1;
			//console.log("Loading: "+path);
			return state.File.getJSON(path);
		    }
		};
		let processData=function(result) {
		    if (result !== null) {
			state.Database.fragcnt[frag]=state.Database.loadcnt;
			state.Database.fragjson[frag]=result;
		    };
		};
		let errorData=function(err) {
		    //state.Html.broadcast(state,"Data error: "+frag,'warning');
		    state.Html.broadcast(state,"Unable to load:"+frag+":"+file,'warning');
		    console.log("Unable to load: "+frag+":"+file+" ("+err.message+")");
		};
		//console.log(">>> Need data for:",frag);
		sequence = sequence.then(
		    readRegister
		).then(
		    processRegister
		).catch(
		    errorRegister
		).then(
		    readData
		).then(
		    processData
		).catch(
		    errorData
		);
	    };
	    if (callbacks !== undefined) {
		var callback=callbacks.shift();
		if (callback !== undefined) {
		    setTimeout(callback(state,callbacks),0.1);
		}
	    };
	};
	const processAll=function() {
	    // And we're all done!
	    var last=state.Database.lastLoad(state);
	    var olddata= (last !== undefined && last !== state.Database.loadcnt);
	    var oldfrag= state.Utils.matchArray(newfrags,oldfrags);
	    //console.log("Old fragments:",JSON.stringify(oldfrags));
	    //console.log("New fragments:",JSON.stringify(newfrags));
	    var olddtg= (state.Database.fragdtg===undefined &&
			 state.Database.indexDtg===undefined ) ||
		state.Database.fragdtg === state.Database.indexDtg;
	    //console.log("Dtg:",state.Database.fragdtg,state.Database.indexDtg,
		//	olddata,oldfrag,olddtg,last,state.Database.loadcnt);
	    //console.log("Change to DB?",last,state.Database.loadcnt,changed);
	    //console.log("Old DB frags:",JSON.stringify(oldfrag));
	    //console.log("Req DB frags:",JSON.stringify(fragments));
	    //console.log("New DB frags:",JSON.stringify(newfrags));
	    if (olddata && oldfrag && olddtg) { // nothing added, nothing removed and same dtg...
		if (verbose === "verbose") {
		    state.Html.broadcast(state,"No changes to DB.",'warning');
		};
		console.log("DB unchanged:", state.Database.loadcnt,
			    " (",state.Database.getPrettyDtg(state),")");
		return;
	    } else {
		state.Html.broadcast(state,"Loaded "+state.Database.loadfile
				     +" DB-fragments.");
		console.log("DB changed:  ", state.Database.loadcnt,
			    " (",state.Database.getPrettyDtg(state),") ->",
			    state.Database.loadfile," frags");
		state.Database.fragdtg=state.Database.indexDtg;
		state.Database.fragload=newfrags;
		// collect all data into database
		var frags=Object.keys(state.Database.fragfile);
		if (frags.length>0) {
		    state.Html.broadcast(state,"Updating database.");
		};
		var json=state.Database.combineJsons(state,newfrags,frags);
		// insert into database
		state.Database.dbInsert(state,json);
		// update where-expressions...
		state.Database.makeWhere(state);
		// put data into database...
		state.Show.showAll(state);
		if (frags.length>0) {
		    var ttl,stl,msg;
		    if (state.Database.notification.mode === 2 &&
			(state.Database.notification.maxLevel === undefined ||
			 state.Database.notification.maxLevel < state.Database.maxLevel)) {
			state.Database.notification.maxLevel=state.Database.maxLevel;
			ttl='Warning tablau: Load cnt ' + state.Database.loadcnt;
			stl= 'Level increased';
			msg='Maximum level: ' + state.Database.notification.maxLevel;
			addNotification({
			    title: ttl,
			    subtitle: stl,
			    message:  msg ,
			    theme: 'red',
			    duration: 10000,
			    native: true // when using native, your OS will handle theming.
			});
		    } else if (state.Database.notification.mode === 1) {
			ttl='Warning tablau: Load cnt ' + state.Database.loadcnt;
			stl= 'Data loaded.';
			msg="Loaded: " + state.Database.dbcnt;
			addNotification({
			    title: ttl,
			    subtitle: stl,
			    message: msg,
			    theme: 'red',
			    duration: 10000,
			    native: true // when using native, your OS will handle theming.
			});
		    };
		};
		//console.log("Normal end...")
	    };
	    // set status...
	    if (state.Database.indexDtg === undefined) {
	    	state.Database.setLoaded(state,"Latest");
	    } else if (state.Database.indexDtg === null) {
	    	state.Database.setLoaded(state,"Custom");
	    } else {
	    	state.Database.setLoaded(state,state.Database.indexDtg);
	    };
	};
	const errorAll=function(err) {
	    state.Html.broadcast(state,err.message,'warning');
	    console.log("Error msg: " + err.message);
	};
	const endAll=function() {
	    // send notification...
	    //console.log("Done..");
	};
	// wrap up
	sequence.then(
	    processAll
	).catch(
	    errorAll
	).then(
	    endAll
	);
    };
    this.processData=function(state,response,callbacks) {
	setTimeout(function() {
	    try {
		state.Database.json=JSON.parse(response);
		console.log("Database processData.");
	    } catch (e) {
		alert("Data '"+state.Database.files[0]+"' contains Invalid JSON:"+e.name+":"+e.message);
	    }
	    if (state.Database.json !== undefined) {
		state.Database.processJson(state,state.Database.json,callbacks);
	    }
	},0.1);
    };
    this.processJson=function(state,json,callbacks) {
	state.Database.dbInsert(state,json);
	state.Html.setFootnote(state,"Extracting data.");
	setTimeout(function() {
	    state.Database.makeWhere(state); // update where-expressions...
	    state.Show.showAll(state);
	    state.Html.setFootnote(state);
	    state.File.next(state,"",callbacks);
	},0.1);
    };
    this.resetSetup=function(state) {
	if (state.Database.json !== undefined) {
	    console.log("Reprocessing data...");
	    state.Database.processJson(state,state.Database.json);
	} else {
	    console.log("No data to reprocess...");
	};
    };
    this.saveDb=function(state) {
	var name=this.getDtg() + '_' + this.loaded;
	state.Utils.save(state.Utils.prettyJson(this.jsonOrg),name,"json");
	state.Html.broadcast(state,"Database was downloaded.");
    };
    this.pushDocs=function(state,doc,check) {
	var ret=[];
	if (doc === undefined || doc === null) {
	    // do nothing
	} else if (Array.isArray(doc)) {
	    var lend=doc.length;
	    for (var jj=0;jj<lend;jj++) {
		var d=doc[jj];
		var ds=this.pushDocs(state,d,check);
		if (ds !== undefined) {
		    state.Utils.appendArray(ret,ds);
		};
	    }
	} else if (state.Matrix.checkSelected(state,doc,check)) {
	    ret.push(state.Utils.cp(doc));
	};
	return ret;
    }
    
    this.saveSelectedDb=function(state) {
	var sub=state.Matrix.hasSelected(state);
	var json={};
	if (this.jsonOrg !== undefined) {
	    var keys=Object.keys(this.jsonOrg);
	    var lenk=keys.length;
	    for (var ii=0;ii<lenk;ii++) {
		var key=keys[ii];
		if (key === "data" && sub) {
		    var docs=this.jsonOrg[key];
		    var ret=this.pushDocs(state,docs,true);
		    json[key]=ret;
		    //console.log("Selected: ",JSON.stringify(ret));
		} else {
		    json[key]=this.jsonOrg[key];
		    //console.log("Other: ",key,json[key].length);
		}
	    };
	};
	var pjson=state.Utils.prettyJson(json,"data");
	//console.log("Json:",json.data.length);
	var name=this.getDtg() + '_selected';
	state.Utils.save(pjson,name,"json");
    };
    this.setAppend=function(state,append) {
	//console.log("Setting append to...",append);
	state.Database.append=append;
    };
    this.resetDb=function(state,response,callbacks) {
	state.Database.indexDtg=null;
	state.Database.processData(state,response,callbacks);
    };
    this.setLoaded=function(state,loaded) {
	this.loaded=loaded;
    };
    this.selectIndex=function(state,item,index) {
	//console.log("Setting file index:",item,"(",index,")");
	if (index === undefined || state.Database.indexDtg !== index) {
	    if (state.Database.indexDtg === index) {
		//do nothing
	    } else if (index === undefined) {
		state.Html.broadcast(state,"Loading Latest.");
	    } else {
		state.Html.broadcast(state,"Loading "+index);
	    };
	    setTimeout(function() {
		state.Database.loadDataFragments(state,index,[function(state){
		    state.Database.indexDtg=index;
		}],"verbose");
	    },0.1);
	} else {
	    console.log("Omitting DB-load:",state.Database.indexDtg, index);
	    state.Html.broadcast(state,"Data already loaded.","warning");
	};
    };
    this.getIndexFiles=function(state,index) {
	var ret=[];
	//console.log("Get index files:",index,JSON.stringify(state.Database.files));
	// loop over all register files, read content, load data...
	var fragments=state.Database.getFragments(state);
	var lenr=fragments.length;
	// loop over register files
	for (var ii=0;ii<lenr;ii++) {
	    let frag=fragments[ii]||"data";
	    var files=state.Database.files[frag]||[];
	    var file=state.Database.getIndexFile(state,frag,files,index);
	    //console.log("Files:",frag,"(",index,") -> ",file,JSON.stringify(files),files.length);
	    if (file !== null && file !== undefined) {
		ret.push(frag+"/"+file);
	    };
	}
	return (ret);
    };
    this.getIndexTitle=function(state,index) {
	var files=this.getIndexFiles(state,index)||[];
	var s="";
	var lenf=files.length;
	for (var ii=0;ii<lenf;ii++) {
	    var file=files[ii];
	    if (file !== undefined && file !== "") {
		if (s !== "") { s=s+"\n";};
		s=s+file;
	    };
	};
	return s;
    };
    this.getTime=function(state,s) {
	if (s === undefined) {
	    console.log("Invalid call to getTime...");
	} else {
	    var nn = s.match(/\d+/g).map(Number);
	    var date0 = new Date(Date.UTC(nn[0],nn[1]-1,nn[2],nn[3],nn[4],nn[5],
					  ((nn[6]||'')+'000').slice(0,3))); // modification time
	    //console.log("Gettime:",s,JSON.stringify(nn));
	    return date0.getTime();
	};
    };
    this.setTime=function(state) {
	var d = new Date();
	var epoch=d.getTime();
	//console.log("Times:",epoch,this.epoch0);
	if (this.epoch0 !== undefined) {
	    var age = epoch - this.epoch0;
	    this.mod=this.getTimeDiff(state,age);
	    if (state.React !== undefined && state.React.Status !== undefined) {
		state.React.Status.setAge(state,this.mod);
		//console.log("Age:",epoch,this.epoch0,age);
	    }
	}
    };
    this.getKeyValues=function(state, key) {
	//console.log("Database:",JSON.stringify(state.Database.values));
	var vals=state.Database.values[key];
	if (vals !== undefined) {
	    return vals;
	} else {
	    return [];
	}
    };
    // check if key is redundant
    this.getValues=function(state,key) {
	var where=state.Database.getWhere(state);
	//console.log("Redundant?",key," where=",where);
	var docs=state.Database.getKeyCnt(state,key,where);
	//console.log("Key cnt",JSON.stringify(docs));
	var vals=[];
	var lend=docs.length;
	for (var ii=0;ii<lend;ii++) {
	    var doc=docs[ii];
	    vals.push(doc[key]);
	}
	//console.log("Key vals",JSON.stringify(vals));
	return vals;
    };
    this.getKeytrg=function(state,key,val) {
	if (Array.isArray(val)) {
	    //console.log(">>>Is array:",key,JSON.stringify(val));
	    ret=this.keytrg.Missing;
	    var lenv=val.length;
            for (var ii=0;ii<lenv;ii++) {
		ret=Math.max(ret,this.getKeytrg(state,key,val[ii]));
            }
	    //console.log(">>>return:",key,ret);
	} else { 
	    if (val === "null") {
		ret=this.keytrg.Null;
	    } else if (val==="MIN("+key+")") { // this is a function
		ret=this.keytrg.Min;
	    } else if (val==="MAX("+key+")") { // this is a function
		ret=this.keytrg.Max;
	    } else if (val === undefined) {
		ret=this.keytrg.Missing;
	    } else if (val === null) {
		ret=this.keytrg.Null;
	    } else {
		ret=this.keytrg.Value;
	    };
	    //console.log("---return:",key,ret);
	};
	return ret;
    };
    this.makeKeytrg=function(state,key,keytrg,val) {
	if (keytrg === this.keytrg.Missing) {
	    return "missing";
	} else if (keytrg === this.keytrg.Null) {
	    return "null";
	} else if (keytrg === this.keytrg.Min) {
	    return "MIN("+key+")"
	} else if (keytrg === this.keytrg.Max) {
	    return "MAX("+key+")"
	} else {
	    return val;
	};
    };
    this.dbReset=function(state) {
	state.Database.maxLevel=-1;
	var docs=this.db.tables.alarm.data;
	var len=docs.length
	for (var ii=0;ii<len;ii++) {
	    var doc=docs[ii];
	    doc._thr=undefined;
	    state.Threshold.setThresholds(state,doc);
	    state.Threshold.importVariables(state,doc);
	    var lev=doc.level;
	    if (lev > state.Database.maxLevel) {
		state.Database.maxLevel=lev;
	    }
	};
	state.Show.showAll(state);
    };
    this.dbInsert=function(state,json) {
	state.Database.maxLevel=-1;
	var ii,key;
	try {
	    // preprocess
	    var docs=json.data;
	    var len=docs.length
	    for (ii=0;ii<len;ii++) {
		var doc=docs[ii];
		doc["cnt"]=ii;
		state.Threshold.importVariables(state,doc);
		var lev=doc.level
		if (lev > state.Database.maxLevel) {
		    state.Database.maxLevel=lev;
		}
	    };
	    // get modified date
	    //console.log("Setting time.");
	    this.saveOrg(state,json);
	    this.epoch0=this.getTime(state,json.epoch);     // data file time
	    this.setTime(state);     // data file time
	    this.newDb(state);
	    // make database for raw data
	    this.makeTable(state);
	    // reset key counts and range
	    this.keyCnt={}; // reset key-count
	    // put data into databse
	    //console.log("inserting");
	    var data=[];
	    // get home key targets... (max, min)
	    var home=state.Path.home.val;
	    var hkeys=state.Path.home.path;//Object.keys(home);
	    var homeKeys=[];
	    var delayKeys=[];
	    var lenh=hkeys.length;
            for (ii=0;ii<lenh;ii++) {
		key=hkeys[ii];
		var keytrg=this.getKeytrg(state,key,home[key]);
		//console.log("Keytrg:",key,keytrg,JSON.stringify(home[key]));
		if (keytrg <= this.keytrg.Value) {
		    homeKeys.push(key);
		} else {
		    delayKeys.push(key);
		}
            }
	    // this is where data comes into the system, strange things may happen...
	    try {
		//console.log("Home keys:",JSON.stringify(homeKeys)," delayed:",JSON.stringify(delayKeys));
		this.dbcnt=this.dbcnt+this.extractData(state,data,{},"",json.data,homeKeys,home);
	    } catch (e) {
		//console.log("Data:",JSON.stringify(data));
		console.log("Extract error: "+e);
		throw (e);
	    };
	    // put data-array into database...
	    this.dataToDb(state,data);
	    //var nrec=this.sanityCheck(state)	    // sanity check
	    //console.log("Initially:",data.length," Extracted:",rcnt,' Database:',nrec);
	    this.postProcess(state); // update distinct Database.values[key]
	    //console.log("Delay keys:",JSON.stringify(delayKeys));
	    if (delayKeys.length > 0) {// delayed home selection (MAX() and MIN())
		this.makeWhere(state,delayKeys,home);
		var where=this.getWhere(state,delayKeys,home);
		docs=this.getDocs(state,where);
		this.dataToDb(state,docs)
		this.postProcess(state); // update distinct Database.values[key]
	    };
	    //console.log("Make path...");
	    state.Path.makePath(state); // initialise path
	    //console.log("Indexing and cleaning up.");
	    this.dbindex(state,state.Path.other.table); // make indexes
	    this.dbindex(state,state.Path.other.rest); // make indexes
	    //state.Path.checkTableKeys(state);
	    state.Html.broadcast(state,"Loaded "+this.dbcnt+" records into database");
	    //console.log("Database is ready.");
	    state.Default.storeStartState(state);
	} catch (e) {
	    alert("Db-insert error:"+e);
	    throw (e);
	};
    };
    this.updateKeyCnt=function(state,key,val) {
	if (this.keyCnt[key] === undefined) {
	    this.keyCnt[key]={cnt:0,type:"string",order:this.nasc};
	}
	this.keyCnt[key].cnt=(this.keyCnt[key].cnt)+1;
	if (this.keyCnt[key].type  === "string" && isNaN(val)) {
	    this.keyCnt[key].type="nan";
	    this.keyCnt[key].order=this.casc;
	}
    };
    this.postProcess=function(state) { // update meta-data
	var keys=Object.keys(state.Database.keyCnt);
	//console.log("Entering postProcess.", JSON.stringify(keys));
	var lenk=keys.length;
	for (var ii=0;ii<lenk;ii++) {
	    var key=keys[ii];
	    // make list of values in Database for each key
	    state.Database.values[key]=[];
	    var sql="select DISTINCT "+key+" AS "+key+" FROM alarm";
	    var dd0=this.query(sql);
	    var lend=dd0.length;
	    for (var jj=0;jj<lend;jj++) {
		var doc=dd0[jj];
		state.Database.values[key].push(doc[key]);
	    };
	};
	//console.log("Done postProcess.");
    };
    this.extractData=function(state,data,parent,key,raw,hkeys,home) { // insert records into db (recursive)
	var rcnt=0;
	var kk,ii,kii,child,dkey;
	//console.log("Processing {",state.Utils.toString(parent),"} '",key,"' (",state.Utils.toString(raw),")");
	var wii=this.whatIsIt(raw);
	if (wii  === "Object" && key  === "") {
	    //console.log("Found object (",state.Utils.toString(parent),")");
	    child=state.Utils.cp(parent);
	    // loop over plain values first
	    for (kk in raw) {
		kii=this.whatIsIt(raw[kk]);
		if (kii  === "value") {
		    child[kk]=raw[kk];
		}
	    }
	    // loop over sub-objects
	    var nn=0;
	    for (kk in raw) {
		kii=this.whatIsIt(raw[kk]);
		if (kii !== "value") {
		    nn=nn+1;
		    rcnt=rcnt+this.extractData(state,data,child,kk,raw[kk],hkeys,home);
		}
	    }
	    if (nn  === 0) { // insert 
		//console.log("Object was empty.");
		rcnt=rcnt+this.extractData(state,data,child,null,null,hkeys,home);
	    }
	} else if (wii  === "Object" && key !== "") {
	    //console.log("Found object key '",key,"' (",state.Utils.toString(parent),")");
	    child=state.Utils.cp(parent);
	    // loop over plain values first
	    for (kk in raw) {
		child[key]=kk;
		rcnt=rcnt+this.extractData(state,data,child,"",raw[kk],hkeys,home);
	    }
	} else if (wii  === "Array") {
	    //console.log("Found array key '",key,"' (",state.Utils.toString(parent),")");
	    var dlen = raw.length;
	    for (ii = 0; ii < dlen; ii++) {
		rcnt=rcnt+this.extractData(state,data,parent,key,raw[ii],hkeys,home);
	    }
	} else {
	    //console.log("Found key '",key,"' ",wii," (",state.Utils.toString(parent),")");
	    var keep=true;
	    var doc=state.Utils.cp(parent);
	    if (raw !== null) {
		if (key  === "") {
		    doc.value=raw;
		} else {
		    doc[key]=raw;
		}
	    }
	    // check if home criteria is met
	    var lenh=hkeys.length;
	    for (ii=0;ii<lenh;ii++) {
		key=hkeys[ii];
		var vals=home[key];
		var lenv=vals.length;
		var found=false;
		for (var jj=0;jj<lenv;jj++){
		    if (vals[jj]===doc[key] || (vals[jj]==="" && doc[key]===undefined)) {
			found=true;
		    }
		}
		if (!found) {
		    keep=false;
		};
	    }
	    if (keep) {
		//console.log("Updating internal raw structure",JSON.stringify(setup));
		for (dkey in doc) {
		    var val=doc[dkey];
		    this.updateKeyCnt(state,dkey,val);
		    //// this takes too much time...
		    //if (this.values[dkey]  === undefined) {
		    //	this.values[dkey]=[];
		    //  };
		    ////console.log("Setup:",JSON.stringify(setup));
		    ////console.log("Key:",key,JSON.stringify(this.values));
    		    //if (this.values[dkey].indexOf(val)  === -1 ) { // value not in range
		    //    this.values[dkey].push(val); // add value to range
		    //};
		};
		//console.log(">>> Inserting:",state.Utils.toString(doc));
		rcnt=rcnt+1;
		state.Threshold.setThresholds(state,doc);
		doc._title=state.Layout.makeDocTitle(state,doc);
		//if (this.dbcnt < 10) { // debug purposes
		//for (key in keys) {
		//this.updateKeyCnt(state,key,doc[key]);
		//};
		data.push(doc);
	    //} else {
		//console.log("Ignoring:",lenh,JSON.stringify(hkeys),JSON.stringify(home),JSON.stringify(doc));
	    }
	}
	return rcnt;
    };
    this.dbextract=function(state,showFunc) { // extract data from db and show
	this.bdeb=false;
	// extract data from db and insert into data-array
	// var parent={};//{test:{$exists:false}};
	if (this.processing) {return};
	var where = this.getWhere(state);
	//console.log("dbextract Path:",JSON.stringify(state.Path.keys));
	var cntDocs0=this.getDocsCnt(state,where);
	var nrec= (cntDocs0.length===0?0:cntDocs0[0].cnt);
	var m={};
	state.Matrix.cnt=nrec;
	//console.log("Database:",JSON.stringify(this.db.tables.alarm.data));
	//console.log("dbextract Where:",where," => ",nrec);
	if (nrec > state.Matrix.popSeries) { // maintain keyCnt
	    state.Matrix.initKeyCnt(state);
	    state.Matrix.makeKeyCntMapAreaSql(state,where,nrec);
	    state.Grid.setResolution(state,state.Grid.resolution);
	    state.Path.exportAllKeys(state); // can not export keys before we have a keyCnt
	    state.Matrix.sortKeyValues(state);
	    if (this.bdeb) {console.log("Count:",JSON.stringify(cntDocs0));}
	    // add "undefined" range of keys that are not present in every doc...
	    state.Matrix.addMapAreaKeys(state,this.db.tables.alarm.data); // add lat_/lon_
	    var svgkey=state.Svg.getKey(state);
	    var keys=state.Path.getTableKeys(state);
	    keys.push(svgkey);
	    var cntDocs=state.Database.getDocsCnt(state,where,keys);
	    state.Matrix.setCntLatLon(state,cntDocs,this.db.tables.alarm.data);
	    if (this.bdeb) {console.log("dbextract cntDocs:",JSON.stringify(cntDocs));}
	    state.Matrix.makeMatrixCntMap(state,cntDocs,m);
	    state.Matrix.makeMapRange(state);
	    if (this.bdeb) {console.log("dbextract maprange:",JSON.stringify(state.Matrix.values["_lon"]),JSON.stringify(state.Matrix.values["_lat"]));};
	    if (this.bdeb) {console.log("dbextract matrix:",JSON.stringify(m));};
	    //var docs=this.getDocs(state,where); // get all docs
	    //console.log("Docs:",JSON.stringify(this.db.tables.alarm.data));
	} else {                              // maintain map data and keyCnt...
	    //console.log("Database where:",where);
	    var docs=this.getDocs(state,where); // get all docs
	    //console.log(">>>Extraction key (where='",where,"') Docs:",docs.length);
	    state.Matrix.initKeyCnt(state);
	    state.Matrix.makeKeyCntMapArea(state,docs);      // makes mapArea
	    state.Grid.setResolution(state,state.Grid.resolution);
	    state.Matrix.makeMapRange(state);
	    state.Matrix.addUndefinedKeyCnt(state,docs); // add "undefined"
	    state.Matrix.addUndefinedKeyCntValues(state);
	    state.Matrix.addMapAreaKeys(state,docs); // add lat_/lon_
	    state.Path.exportAllKeys(state); // can not export keys before we have a keyCnt
	    state.Matrix.sortKeyValues(state);
	    state.Matrix.makeMatrix(state,docs,m);
	    //console.log ("Matrix:",JSON.stringify(m));
	}
	state.Show.showPolygons(state);
	this.processing=false;
	showFunc(state,m);
    };
    this.dbindex=function(state,ks) { // make indexes on all keys
	var s="";
	var klen = ks.length;
	for (var ii = 0; ii < klen; ii++) {
	    //this.query("CREATE INDEX ? ON TABLE alarm.?",ks[ii],ks[ii]);
	    s=s+" "+ks[ii];
	};
	//console.log("Indexes:",s);
    };
    this.getLing=function(val,lng) {
	if (lng === undefined) {
	    return val;
	} else {
	    return lng + "=" + val;
	}
    }
    this.getTitleDynamic=function(state,key,val,lng) {
	var ret,parse;
	if (state.Database.values[key] === undefined) {
	    if (val === "null" || val==="") {
		ret= "!"+key;
	    } else {
		val=this.getLing(val,lng);
	    };
	} else {
	    var keytrg=this.getKeytrg(state,key,val);
	    if (val === "null" || val === "") {
		ret="!"+key;
	    } else if (keytrg === this.keytrg.Max) { // this is a function
		parse=state.Utils.getMax(state.Database.values[key]);
		if (parse === undefined) {
		    ret=key + " is NULL";
		} else {
		    ret=parse;
		};
	    } else if (keytrg === this.keytrg.Min) { // this is a function
		parse=state.Utils.getMin(state.Database.values[key]);
		if (parse === undefined) {
		    ret=key + " is NULL";
		} else {
		    ret=parse;
		};
	    } else {
		ret=this.getLing(val,lng);
	    };
	};
	return ret;
    };
    this.getWhereDynamic=function(state,key,val) {
	var ret,parse;
	if (state.Database.values[key] === undefined) {
	    ret=state.Database.getWhereNull(key);
	} else {
	    var keytrg=this.getKeytrg(state,key,val);
	    //console.log("parseWhere:",key,JSON.stringify(val),keytrg);
	    if (keytrg === this.keytrg.Max) { // this is a function
		parse=state.Utils.getMax(state.Database.values[key]);
		//console.log("parseWhere:",key,parse,JSON.stringify(state.Database.values[key]));
		if (parse === undefined) {
		    ret=key + " is NULL";
		} else {
		    ret=key + "='"+parse+"'";
		};
	    } else if (keytrg === this.keytrg.Min) { // this is a function
		parse=state.Utils.getMin(state.Database.values[key]);
		if (parse === undefined) {
		    ret=key + " is NULL";
		} else {
		    ret=key + "='"+parse+"'";
		};
	    } else if (keytrg !== undefined && val !== "") {
		//console.log("Key trg:",keytrg,key,val);
		ret=state.Database.getWhereValue(key,val);
	    } else {
		ret=state.Database.getWhereNull(key);
	    }
	};
	//console.log("GetWhere:",key,val,ret);
	return ret;
    };
    this.getWhereRange=function(key,range) {
	if (range  !== undefined &&
	    range  !== null &&
	    range  !== "" &&
	    range[0] < range[1]
	   ) {
	    //console.log("getWhereRange:",key,JSON.stringify(range),range[0],range[2]);
	    if (range[0] !== undefined && range[1] !== undefined) {
		return key +' >= '+range[0]+' AND ' + key + ' < '+range[1]+'';
	    } else if (range[0] !== undefined) {
		return key +' >= '+range[0]+'';
	    } else if (range[1] !== undefined) {
		return key +' < '+range[1]+'';
	    } else {
		return "";
	    }
	} else {
	    return "";
	};
    };
    this.getWhereDbDtg=function(state,where) {
	var dtg=state.Database.getDbDtg(state);
	return state.Database.addWhere(where,"dtg>='" + dtg+ "'");
    };
    this.getWhereValue=function(key,val) {
	if (val  !== undefined ||
	    val  !== null ||
	    val  !== "") {
	    return key + '="'+val+'"'
	} else {
	    return;
	};
    };
    this.getWhereNull=function(key) {
	return key + ' is NULL';
    };
    this.getWhere=function(state,keys,vals,ranges) {
	var where="";
	//console.log("Path:",JSON.stringify(state.Path.keys));
	if (keys === undefined) {
	    keys=state.Path.keys.path;
	    vals=state.Path.select.val;
	    ranges=state.Path.select.range;
	    //console.log("getWhere ranges:",JSON.stringify(ranges));
	};
	if (vals === undefined) {vals={};};
	if (ranges === undefined) {ranges={};};
	if (keys !== undefined) {
	    var plen = keys.length;
	    for (var ii = 0; ii < plen; ii++) {
		var key=keys[ii];
		var whereKey=state.Database.parseWhere(state,key,vals[key],ranges[key])
		//console.log("Wherekey:",ii,key,JSON.stringify(vals),
		//	    JSON.stringify(vals[key]),JSON.stringify(ranges[key]),"'"+whereKey+"'");
		if (whereKey  === undefined ||
		    whereKey  === null ||
		    whereKey  === "" ) {
		    if (where !== "") { where = where +  ' AND ';};
		    where= where + key +' is NULL';
		} else {
		    if (where !== "") { where = where +  ' AND ';};
		    where=where + "("+ whereKey+")";
		}
	    };
	    if (where !== "") {where=" WHERE "+where;}
	};
	//console.log("Where=|"+where+"|")
	return where;
    };
    this.addWhere=function(iwhere,whereKey) {
	var where=iwhere;
	if (whereKey  !== undefined &&
	    whereKey  !== null &&
	    whereKey  !== "" ) {
	    if (where !== "") {
		where = where +  " AND ("+ whereKey+")";
	    } else {
		where = " WHERE ("+ whereKey+")";
	    }
	}
	return where;
    };
    this.makeWhere=function(state,keys,vals) {
	//console.log("Make where:",JSON.stringify(keys),JSON.stringify(vals));
	if (keys === undefined) {
	    state.Path.keys.path.forEach(function(item,index) {this.setWhere(state,item,state.Path.select.val[item]);}.bind(this));
	} else {
	    keys.forEach(function(item,index) {this.setWhere(state,item,vals[item]);}.bind(this));
	}
    };
    this.setWhere=function(state,key,vals,range) {
	//console.log("Setting where:",key,JSON.stringify(vals));
	var where=this.parseWhere(state,key,vals,range);
	//console.log("Setting where:",key,JSON.stringify(vals),"'"+where+"'");
	state.Path.where[key]=where;
    };
    this.parseWhere=function(state,key,vals,range) {
	var where="";
	if (vals === undefined) {vals=[];};
	var lenv=vals.length
	for (var ii=0;ii<lenv;ii++) {
	    var val=vals[ii]
	    if (where !== "") { where=where + " OR ";};
	    where = where + state.Database.getWhereDynamic(state,key,val);
	    //console.log("From getWhereDynamic:",key,":",val,":",where);
	};
	if (range !== undefined) {
	    if (where !== "") { where=where + " OR ";};
	    where = where + state.Database.getWhereRange(key,range);
	}
	return where;
    };
    this.getGroup=function(keys) {
	var group="";
	var plen = keys.length;
	for (var ii = 0; ii < plen; ii++) {
	    var key=keys[ii];
	    if (group !== "") { group = group +  ',';};
	    group= group + key;
	};
	if (group !== "") {group=" GROUP BY "+group;}
	return group;
    };
    this.getCols=function(ikeys) {
	var cols="";
	if (ikeys.length===0){return cols;};
	var onlyUnique=function(value, index, self) { 
	    return self.indexOf(value) === index;
	};
	var keys = ikeys.filter( onlyUnique );
	var plen = keys.length;
	for (var ii = 0; ii < plen; ii++) {
	    var key=keys[ii];
	    cols= cols + key;
	    if (cols !== "") { cols = cols +  ',';};
	};
	return cols;
    };
    this.getAll=function(state) {
	var cols="";
	var plen = state.Path.keys.other.length;
	for (var ii = 0; ii < plen; ii++) {
	    var key=state.Path.keys.other[ii];
	    cols= cols + key;
	    if (cols !== "") { cols = cols +  ',';};
	};
	return cols;
    };
    this.getUnique=function(state,whereInn,keys,level) {
	var whereLev=this.getWhereRange("level",[level,undefined]);
	var where=this.addWhere(whereInn,whereLev);
	if (!state.Database.viewOldData) {
	    where=state.Database.getWhereDbDtg(state,where);
	    //console.log("Where:",where);
	};
	var group=this.getGroup(keys);
	var cols=this.getCols(keys);
	var qry="select "+cols+"max(level) AS maxlev FROM alarm"+where+group;
	//console.log("Query:",qry);
	var dd=this.query(qry);
	return (dd===undefined?[]:dd);
    };
    this.getDocsRank=function(state,where,keys,maxrank) {
	if (!state.Database.viewOldData) {
	    where=state.Database.getWhereDbDtg(state,where);
	    //console.log("Where:",where);
	};
	var dd;
	dd=this.query("select * FROM alarm"+where);
	return (dd===undefined?[]:dd);
    };

    this.getRankCnt=function(state,where,keys,maxrank) {
	if (!state.Database.viewOldData) {
	    where=state.Database.getWhereDbDtg(state,where);
	    //console.log("Where:",where);
	};
	where=this.addWhere(where,"rank='" + maxrank.toString()+"'");
	var sql,dd;
	var body="* FROM alarm";
	if (keys  === undefined) {
	    sql="select "+body+where;
	    //console.log("SQL:",sql,":",body,":",where);
	    dd=this.query(sql);
	    //console.log("initial count:",dd[0].cnt,JSON.stringify(dd0));
	    //console.log("Cnt:",JSON.stringify(dd));
	} else {
	    var cols = this.getCols(keys);
	    var group = this.getGroup(keys);
	    sql="select "+cols+body+
    		where+group;
	    //console.log("SQL:",sql,":",body,":",where);
	    dd=this.query(sql);
	    //console.log("Cnt:",JSON.stringify(dd),JSON.stringify(keys));
	}
	return (dd===undefined?[]:dd);
    };
    this.getDocsCnt=function(state,where,keys,group) {
	if (!state.Database.viewOldData) {
	    where=state.Database.getWhereDbDtg(state,where);
	    //console.log("Where:",where);
	};
	var sql,dd;
	//console.log("Docs:",JSON.stringify(this.db.tables.alarm.data));
	var body='count(*) AS cnt, max(level) AS maxlev, max(rank) AS maxrank, min(level) AS minlev, '
            +'max(lat) AS maxlat, min(lat) AS minlat, max(lon) AS maxlon, min(lon) AS minlon, avg(lat) as lat, avg(lon) as lon '
	    +'FROM alarm';
	if (keys  === undefined) {
	    group="";
	    sql="select "+body+where;
	    //console.log("SQL:",sql,":",body,":",where);
	    dd=this.query(sql);
	    //console.log("initial count:",dd[0].cnt,JSON.stringify(dd0));
	    //console.log("Cnt-A:",JSON.stringify(dd));
	} else {
	    var cols = this.getCols(keys);
	    if (group===undefined) {group = this.getGroup(keys);};
	    sql="select "+cols+body+where+group;
	    //console.log("SQL:",sql);
	    //console.log("Body:",body,":",where,",group:",group,",keys:",JSON.stringify(keys));
	    dd=this.query(sql);
	    //console.log("Cnt-B:",JSON.stringify(dd),",keys:",JSON.stringify(keys));

	}
	//console.log("sql:",JSON.stringify(sql));
	//console.log("Running select...");
	//sql="SELECT * from alarm WHERE rank= ( SELECT MAX(rank) FROM alarm "+group+")";
	//var dd2=this.query(sql);
	//console.log("sql:",JSON.stringify(dd2));
	
	// )
	// SELECT * FROM alarm WHERE (level,rank) IN 
	// ( SELECT level, MAX(rank)
	//   FROM alarm
	//   GROUP BY level
	// )

	return (dd===undefined?[]:dd);
    };
    this.getDocs=function(state,where) {
	if (!state.Database.viewOldData) {
	    where=state.Database.getWhereDbDtg(state,where);
	    //console.log("Where:",where);
	};
	var query="select * FROM alarm"+where;
	//query="select * FROM alarm WHERE (_lat=69.00631578947369) AND (_lon=17.206315789473685)";
	var dd=this.query(query);
	//console.log("getDocs q:",query,JSON.stringify(dd));
	return (dd===undefined?[]:dd);
    };
    this.dataToDb=function(state,data) {
	if (state.Database.append &&
	    this.db.tables !== undefined &&
	    this.db.tables.alarm !== undefined &&
	    this.db.tables.alarm.data !== undefined ) {
	    //console.log("Appending data...",this.db.tables.alarm.data.length,data.length);
	    state.Utils.appendArray(this.db.tables.alarm.data,data);
	} else {
	    //console.log("Replacing data...",this.db.tables.alarm.data.length,data.length);
	    this.db.tables.alarm.data = data;
	};
	this.setAppend(state,false);
    };
    this.getKeyCnt=function(state,key,where){
	if (!state.Database.viewOldData) {
	    where=state.Database.getWhereDbDtg(state,where);
	    //console.log("Where:",where);
	};
	var sql="select "+key+",count(*) AS cnt FROM alarm"+
	    where+" GROUP BY "+key;
	return this.query(sql);
    };
    this.whatIsIt=function(object) { // determine object type
	if (object === undefined || object  === null ) {
	    return "null";
	} else if (object.constructor  === this.arrayConstructor) {
	    return "Array";
	}
	else if (object.constructor  === this.objectConstructor) {
	    return "Object";
	}
	else {
	    return "value";
	}
    };
    this.getTimeDiff=function(state,dt) {
	var s="";
	if (dt  === undefined || isNaN(state,dt)) {return s;};
	var msec=Math.abs(state,dt);
	var dd = Math.floor(state,((state,(msec / 1000) / 60) / 60) / 24);
	msec -= dd * 1000 * 60 * 60 * 24;
	var hh = Math.floor(state,((state,msec / 1000) / 60) / 60);
	msec -= hh * 1000 * 60 * 60;
	var mm = Math.floor(state,(msec / 1000) / 60);
	msec -= mm * 1000 * 60;
	var ss = Math.floor(state,msec / 1000);
	msec -= ss * 1000;
	if (dt<0) {
	    s="-";
	} else if (dt > 0) {
	    s="+";
	} else {
	    s="0";
	}
	if (dd !== 0) s=s+" "+state.Utils.numberWithCommas(dd)+"d";
	if (hh !== 0) s=s+" "+hh+"h";
	if (mm !== 0) s=s+" "+mm+"m";
	//if (ss !== 0) s=s+" "+ss+"s";
	return s;
    }
    this.sanityCheck=function(state) {
	var sql='select count(*) AS cnt, max(level) AS lev FROM alarm';
	var dd0=this.query(sql);
	var nrec= dd0[0].cnt;
	return nrec;
    }
    this.query=function(sql) {
	try {
	    return this.db.exec(sql);
	} catch (e) {
	    alert(sql + ":" + e);
	};
    }

};

export default Database;
