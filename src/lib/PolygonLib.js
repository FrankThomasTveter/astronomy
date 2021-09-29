//console.log("Loading PathLib.js");

function Polygon() {
    this.dir="simplified/";
    this.seperator="_";
    this.keys=[];
    this.positions={};
    this.levels={};
    this.names=[];
    this.format="txt";
    this.modes={clip:0,file:1};
    this.mode=this.modes.file;
    this.active=true;
    this.togglePolygon=function(state) {
	state.Polygon.active=!state.Polygon.active;
	state.Show.showConfig(state);
	state.Show.showChart(state,true);
    };
    this.hasPolygon=function(state,name) {
	return (state.Polygon.positions[name] !== undefined);
    }
    this.getNames=function(state) {
	if (state.Polygon.active) {
	    var levels=this.names.map((name) => this.levels[name]);
	    var ret=state.Utils.sortArrays(levels, this.names);
	    //console.log(">>> Sorted names:",JSON.stringify(ret[1]));
	    return ret[1];
	} else {
	    return [];
	};
    }
    this.getPolygonName=function(state,doc) {
	var name="";
	var lenk=state.Polygon.keys.length;
	for (var jj=0;jj<lenk;jj++) {
	    var key=state.Polygon.keys[jj];
	    if (doc[key]!== undefined) {
		if (name !== "") {name=name+state.Polygon.seperator;};
		name=name + doc[key];
	    }
	};
	if (name ==="") {
	    return "";
	} else {
	    return state.Polygon.dir + name + ".json";
	};
    };
    this.combinePolygons=function(state,names) {
	var ret=[];
	var lenn=names.length;
	for (var nn=0;nn<lenn;nn++){
	    var name=names[nn];
	    var polygon=state.Polygon.positions[name];
	    //console.log("Processing:",name,JSON.stringify(polygon));
	    var lenp=polygon.length;
	    for (var pp=0;pp<lenp;pp++) {
		var pos=polygon[pp];
		ret.push(pos);
	    };
	}
	//console.log("Result:",JSON.stringify(ret));
	return ret;
    };
    this.outputPolygons=function(state,result,sep,inv) {
	//console.log("Making output from:",JSON.stringify(result));
	if (sep===undefined) {sep=" ";};
	if (inv===undefined) {inv=false;};
	var ret="";
	var lenr=result.length;
	for (var ii=0;ii<lenr;ii++) {
	    if (ret !== "") {ret=ret + "\n";};
	    var polygon=result[ii];
	    var lenp=polygon.length;
	    for (var jj=0;jj<lenp;jj++) {
		var pos=polygon[jj];
		if (inv) {
		    ret=ret + pos[1] + sep + pos[0] + "\n";
		} else {
		    ret=ret + pos[0] + sep + pos[1] + "\n";
		}
	    }
	}
	return ret;
    };
    this.savePolygon=function(state,name,names) {
	//console.log("Saving polygon...",name,JSON.stringify(names));
	var result=state.Polygon.combinePolygons(state,names);
	var output;
	if (state.Polygon.mode === state.Polygon.modes.clip) {
	    output=state.Polygon.outputPolygons(state,result,",",true);
	    console.log("Saving clipboard:",result.length);
	    state.Utils.clipboard(output);//  "json", "text/plain"
	} else {
	    output=state.Polygon.outputPolygons(state,result);
	    var file=name+"."+state.Polygon.format;
	    console.log("Saving file:",file,result.length);
	    state.Utils.save(output,file,"text");//  "json", "text/plain"
	    state.Html.broadcast(state,"Polygon was downloaded.");
	};
    };
    this.getPositions=function(state,result) {
	var ret=[];
	var json=JSON.parse(result);
	var poly=[];
	var ipos;
	var icnt=0;
	var lenj=json.length;
	// loop over json, look for individual polygons
	// first position (ipos) is used to identify new polygons...
	for (var jj=0;jj<lenj;jj++) {
	    var pos=json[jj];
	    if (icnt===0) {
		ipos=pos;
		icnt=1;
		poly.push(pos); // keep first ipos
	    } else if (state.Utils.equal(ipos,pos)) {
		if (icnt===1) { // keep second ipos
		    icnt=2;
		    poly.push(pos);
		};              // discard later ipos
		if (poly.length > 0) {
		    ret.push(poly);
		    poly=[];
		}
	    } else { // keep ordinary positions...
		poly.push(pos);
	    }
	};
	if (poly.length > 0) {
	    ret.push(poly);
	    poly=[];
	};
	return ret;
    };
    this.makePolygon=function(state,level,show) {
	var keys=state.Polygon.keys;
	var where=state.Database.getWhere(state);
	var docs = state.Database.getUnique(state,where,keys,level)
	//console.log("Polygon docs:",JSON.stringify(docs),where,JSON.stringify(keys),level);
	state.Polygon.changed=false;
	var lend=docs.length;
	state.Polygon.names=[];
	// Start off with a promise that always resolves
	var sequence = Promise.resolve();
	// loop over polygons and collect promises
	for (var ii=0;ii<lend;ii++) {
	    var doc=docs[ii];
	    let maxlev=doc.maxlev;
	    let name=this.getPolygonName(state,doc);
	    if (name !==undefined && name!=="") {
		state.Polygon.levels[name]=maxlev;
		const complete=function(result) {
		    state.Polygon.changed=true;
		    state.Polygon.positions[name]=state.Polygon.getPositions(state,result);
		};
		//console.log(">>> Need polygon for:",name);
		if (! this.hasPolygon(state,name)) {
		    sequence = sequence.then(
			function() {
			    return state.File.get(name);
			}
		    ).then(complete).catch(
			function(err) {
			    state.Polygon.positions[name]=[];
			    //console.log("Unable to load:"+name," ("+err.message+")");
			});
		};
		state.Polygon.names.push(name);
	    };
	};
	sequence.then(function() {
	    // And we're all done!
	    if (show !== undefined) {show(state,state.Polygon.names,state.Polygon.changed);};
	    //console.log("Normal end...");
	}).catch(function(err) {
	    // Catch any error that happened along the way
	    console.log("Error msg: " + err.message);
	}).then(function() {
	    // always do this
	    //console.log("This is the end...");
	})
	//console.log("Polygons:",JSON.stringify(state.Polygon.names));
    };
};
export default Polygon;
