//console.log("Loading UtilsLib.js");
		    
function Utils() {
    this.version="1";
    this.type={"any"  :0,
	       "force":1,
	       "fill" :2,
	       "splice":3};
    this.bdeb=false;
    this.debug=function(state,val) {
	if (val!==undefined && val !== null && val) { 
	    state.Utils.bdeb=true;
	} else {
	    state.Utils.bdeb=false;
	};
    };
    this.getType=function(state,type) {
	var keys=Object.keys(state.Utils.type);
	var lenk=keys.length;
	for (var jj=0;jj<lenk;jj++) {
	    var key=keys[jj];
	    var val=state.Utils.type[key];
	    if ( val === type) {
		return key;}
	}
	return "***";
    };
    this.invertArray=function(arr) {
	var alen=arr.length;
	var xlen=Math.floor(alen/2);
	for (var ii=0; ii<xlen;ii++) {
	    var jj=alen-ii-1
	    var buff=arr[ii];
	    arr[ii]=arr[jj];
	    arr[jj]=buff;
	}
    };
    this.invertedArray=function(arr) {
	var ret=[];
	var alen=arr.length;
	for (var ii=alen-1; ii>=0;ii--) {
	    ret.push(arr[ii]);
	}
	return ret;
    };
    this.getMin=function(arr) {
	var len = arr.length, min = undefined;
	while (len--) {
	    if (min === undefined || arr[len] < min) {
		min = arr[len];
	    }
	}
	return min;
    };
    this.getMax=function(arr) {
	var len = arr.length, max = undefined;
	while (len--) {
	    if (max === undefined || arr[len] > max) {
		max = arr[len];
	    }
	}
	return max;
    };
    this.unique=function(arr) {
	function onlyUnique(value, index, self) { 
	    return self.indexOf(value) === index;
	}
	var unique = arr.filter( onlyUnique ); // returns ['a', 1, 2, '1']
	return unique;
    };
    this.equal=function(o1,o2) {
	return JSON.stringify(o1)===JSON.stringify(o2);
    };
    this.smear=function(setup,newsetup) { // both must be object
	//console.log("Processing:",JSON.stringify(newsetup))
	if (typeof newsetup === 'object' && newsetup !== null) {
	    for (var ss in newsetup) {
		var v=newsetup[ss];
		if (v===undefined) {
		    //do nothing
		} else if (typeof v === 'object' && ! Array.isArray(v) && v !== null) {
		    if (setup[ss] === undefined) {setup[ss]={};}
		    //console.log("Sub-process:",ss);
		    this.smear(setup[ss],v)
		} else {
		    setup[ss]=v;
		}
	    }
	} else {
	    console.log("Invalid setup...");
	}
    };
    this.clean=function(arr,max) {
	if (max === undefined) {max=0;};
	//console.log("Arr:",JSON.stringify(arr),max);
	for (var ii=max;ii<arr.length;ii++) {
	    if (arr[ii]===undefined || arr[ii]===null || arr[ii]==="") {
		//console.log("Removing:",arr[ii]);
		arr.splice(ii, 1);
	    } else {
		//console.log("Keeping:",arr[ii]);
	    }
	}
	return arr;
    }
    this.moveTo=function(arr,src,trg) {
	var isrc=arr.indexOf(src);
	var itrg=arr.indexOf(trg);
	if (isrc !== -1 && itrg !== -1) {
	    var csrc=arr.splice(isrc, 1);
	    this.spliceArray(arr,itrg,0,csrc);
	}
    };
    this.matchArray=function(sarr,tarr) {
	var match=true;
	if (match) {match=(sarr.length === tarr.length);};
	if (match) {
	    var leng=sarr.length;
	    var ii=0;
	    while(match && ii <leng) {
		match=(sarr[ii]===tarr[ii]);
		ii=ii+1;
	    }
	}
	return match;
    }
    this.merge=function(sarr,tarr,ignore) {
	var ii;
	if (ignore===undefined) {ignore=[];};
	var ret=[];
	if (sarr !== undefined) {
	    var lens=sarr.length;
	    for (ii=0;ii<lens;ii++) {
		if (ret.indexOf(sarr[ii])===-1 && ignore.indexOf(sarr[ii])===-1) {
		    ret.push(sarr[ii]);
		}
	    }
	};
	if (tarr !== undefined) {
	    var lent=tarr.length;
	    for (ii=0;ii<lent;ii++) {
		if (ret.indexOf(tarr[ii])===-1 && ignore.indexOf(tarr[ii])===-1) {
		    ret.push(tarr[ii]);
		}
	    }
	};
	return ret;
    };
    this.cpArray=function(sarr,tarr,iarr) {
	var lent,ind,indx,ii;
	if (tarr !== undefined && iarr !== undefined) {
	    lent=tarr.length;
	    for (ii=0;ii<lent;ii++) {
		ind=sarr.indexOf(tarr[ii]);
		indx=iarr.indexOf(tarr[ii]);
		//console.log("Debug:",JSON.stringify(tarr),JSON.stringify(iarr));
		if (ind===-1 && indx === -1) {
		    sarr.push(tarr[ii]);
		}
	    }
	} else if (tarr !== undefined) {
	    lent=tarr.length;
	    for (ii=0;ii<lent;ii++) {
		ind=sarr.indexOf(tarr[ii]);
		if (ind===-1) {
		    sarr.push(tarr[ii]);
		}
	    }
	};
    };
    this.ppArray=function(sarr,tarr) {
	var lent=tarr.length;
	for (var ii=lent-1;ii>=0;ii--) {
	    var ind=sarr.indexOf(tarr[ii]);
	    if (ind===-1) {
		this.spliceArray(sarr,0,0,tarr[ii]); // first position (table)
	    }
	}
    };
    this.apArray=function(tarr,sarr) {
	this.ppArray(sarr,tarr);
    };
    this.addArray=function(sarr,tarr) {
	this.cpArray(sarr,tarr);
	tarr=[];
    };
    this.prepArray=function(sarr,tarr) {
	this.ppArray(sarr,tarr);
	tarr=[];
    };
    this.appendArray=function(sarr,tarr) {
	var lent=tarr.length;
	for (var ii=0;ii<lent;ii++) {
	    sarr.push(tarr[ii]);
	};
	return sarr;
    };
    this.remArray=function(sarr,tarr) {
	var lent=tarr.length;
	for (var ii=0;ii<lent;ii++) {
	    var ind=sarr.indexOf(tarr[ii]);
	    if (ind!==-1) {
		sarr.splice(ind,1);
	    }
	}
    };
    this.moveToArray=function(sarr,tarr,key,tpos) {
	var sid=sarr.indexOf(key);
	if (sid !== -1) {
	    var src=sarr.splice(sid, 1);    // remove from path
	    if (tpos  === undefined || tpos  < 0) {
		this.spliceArray(tarr,tarr.length, 0, src);
	    } else {
		this.spliceArray(tarr,tpos, 0, src);
	    }
	    return true;
	}else {
	    return false;
	}
    };
    this.keepHash=function(sarr,tarr) {
	var ret=[];
	var lent=tarr.length;
	var keep={};
	for (var ii=0;ii<lent;ii++) {
	    var hsh=tarr[ii];
	    var keys=Object.keys(hsh);
	    var lenk=keys.length;
	    for (var jj=0;jj<lenk;jj++) {
		var key=keys[jj];
		keep[key]=true;
	    }
	}
	var lens=sarr.length;
	for (var kk=0;kk<lens;kk++) {
	    var arr=sarr[kk];
	    if (keep[arr] !== undefined && keep[arr]) {
		ret.push(arr);
	    };
	}
	return ret;
    }
    this.missing=function(arr,src){
	//console.log("Missing:",src,JSON.stringify(arr));
	if (arr === undefined) {
	    console.log("Invalid array specified in this.missing:",JSON.stringify(src));
	    return false;
	} else {
	    if (Array.isArray(src)) {
		return (arr.indexOf(src[0])  === -1);
	    } else {
		return (arr.indexOf(src)  === -1);
	    }
	}
    };
    this.restore=function(state,arr,obj) { // restore state from snapshot
	//console.log("Restoring:",JSON.stringify(obj));
	//this.debug(state,true);
	this.copyMap(state,this.type.any,obj,arr);
	state.Path.cleanSelect(state);
	//this.debug(state,false);
	// for (var key in obj) {
        //     if (Object.prototype.hasOwnProperty.call(obj, key)) {
	// 	arr[key]=this.cpSoft(arr[key],obj[key]);
	//     }
	// };
    };
    this.cp=function(obj) {
	if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
            return obj;
	var temp;
	if (obj instanceof Date) {
	    temp = new obj.constructor(); //or new Date(obj);
	} else {
	    temp = obj.constructor();
	};
	for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
		obj['isActiveClone'] = null;
		temp[key] = this.cp(obj[key]);
		delete obj['isActiveClone'];
            }
	}
	return temp;
    }.bind(this);
    this.getStatusString=function(state) {
	return this.numberWithCommas(state.Database.dbcnt)+ " in database, "
	    + this.numberWithCommas(state.Matrix.cnt)+" in table"
	    + " ["+state.Database.loaded + "]";
    };
    this.getLoadString=function(state,loaded) {
	return state.Utils.numberWithCommas(Math.round(loaded/1000))+" Kb"
	    + " ["+state.Database.loaded + "]";
    };
    this.toString=function(setup) {
	var s="->";
	for (var kk in setup) {
	    s = s + "|"+ kk + ":" + setup[kk];
	};
	return s;
    };
    this.basename=function(path) {
	var ic=path.indexOf(":");
	var is=path.indexOf("/");
	var ii=Math.max(ic,is);
	console.log("Basename:",path,"->",path.substring(ii+1));
	if (ii >= 0) {
	    return path.substring(ii+1);
	} else {
	    return path;
	};
    };
    this.numberWithCommas=function(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    this.cntDocs=function(elements,key,val) {
	var cnt=0;
	var elen=elements.length;
	for (var ee=0;ee<elen;ee++) {   // loop over elements
	    var el=elements[ee];
	    var docs=el.docs;
	    if (docs === undefined) {
		console.log("Corrupt element:",JSON.stringify(el));
	    } else {
		var dlen=docs.length;
		if (val==="") {
		    cnt=cnt+dlen;
		} else {
		    for (var jj=0;jj<dlen;jj++) {   // loop over segments in each element
			var d=docs[jj];
			var thr=d._thr;
			//console.log("cntDocs:",key,d[key],val,dlen);
			if (d[key]===val) {
			    if (thr.val !== undefined) {
				cnt=cnt+1;
			    };
			}
		    }
		}
	    }
	}
	//console.log("cntDocs:",JSON.stringify(elements),key,cnt,elen);
	return cnt;
    };
    this.getUrlVars=function(state) {
	var vars = {};
	window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
				     function(m,key,value) {
					 //console.log("URL item:",key," ",value)
					 var str=decodeURIComponent(value); //Component
					 try {
					     vars[key]=JSON.parse(str);
					     //console.log("Found json:",key,vars[key]);
					 } catch (e) {
					     vars[key]=str;
					     //console.log("Found scalar:",key,vars[key]);
					 };
				     });
	return vars;
    };
    this.uniq=function(state,a) {
	var seen = {};
	return a.filter(function(item) {
	    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
	});
    };
    this.pushKey=function(arr,key,pos) {
	if (Array.isArray(key)) {
	    var len=key.length;
	    for (var ii=0; ii<len; ii++) {
		if (arr.indexOf(key[ii])===-1) {
		    if (pos === undefined) {
			arr.push(key[ii]);
		    } else {
			arr.splice(pos,0,key[ii])
		    };
		    
		}
	    }
	} else {
	    if (arr.indexOf(key)===-1) {
		if (pos === undefined) {
		    arr.push(key);
		} else {
		    arr.splice(pos,0,key)
		};
	    }
	}
	this.clean(arr);
    };
    this.spliceArray=function(arr,index,n,child){
	if (Array.isArray(child)) {
	    var len=child.length;
	    for (var ii=0; ii<len; ii++) {
		arr.splice(index,n,child[ii])
		n=0
		index=index+1
	    }
	} else {
	    arr.splice(index,n,child)
	}
    }
    this.ascendingArr=function(a,b) {
	if (a[0]  === "") { 
	    return 1;
	} else if (b[0]  === "") {
	    return -1;
	} else if (a[0]<b[0]) { 
	    return -1;
	} else if (a[0]>b[0]) {
	    return 1;
	} else {
	    return 0;
	}
    };
    this.descendingArr=function(a,b) {
	if (a[0]  === "") { 
	    return -1;
	} else if (b[0]  === "") {
	    return 1;
	} else if (a[0]<b[0]) { 
	    return 1;
	} else if (a[0]>b[0]) {
	    return -1;
	} else {
	    return 0;
	}
    };
    this.ascending=function(a,b) {
	if (a  === "") { 
	    return 1;
	} else if (b  === "") {
	    return -1;
	} else if (a<b) { 
	    return -1;
	} else if (a>b) {
	    return 1;
	} else {
	    return 0;
	}
    };
    this.descending=function(a,b) {
	if (a  === "") { 
	    return -1;
	} else if (b  === "") {
	    return 1;
	} else if (a<b) { 
	    return 1;
	} else if (a>b) {
	    return -1;
	} else {
	    return 0;
	}
    };
    this.ascendingN=function(a,b) {
	if (a  === null) { 
	    return 1;
	} else if (b  === null) {
	    return -1;
	} else if (Number(a)<Number(b)) { 
	    return -1;
	} else if (Number(a)>Number(b)) {
	    return 1;
	} else {
	    return 0;
	}
    };
    this.descendingN=function(a,b) {
	if (a  === null) { 
	    return -1;
	} else if (b  === null) {
	    return 1;
	} else if (Number(a)<Number(b)) { 
	    return 1;
	} else if (Number(a)>Number(b)) {
	    return -1;
	} else {
	    return 0;
	}
    }
    this.prettyJson=function(obj,key) {
	var f=function(k,v){
	    if (Array.isArray(v) && (key ===undefined || k !== key)) {
		return JSON.stringify(v);
	    } else if (typeof v === "string") {
		var s=v.replace(/"/g,'@"');
		return s;
	    } else {
		return v;
	    };
	};
	var json=JSON.stringify(obj,f,"  ");
	json=json.replace(/"\[/g,'[');
	json=json.replace(/\]"/g,']');
	json=json.replace(/\\"/g,'"');
	json=json.replace(/@"/g,'\\"');
	//console.log("Replaced:",json);
	//console.log("Original:",JSON.stringify(obj));
	return json;
    };
    this.clipboard=function(copyText) {
	if (navigator.clipboard) {
	    navigator.clipboard.writeText(copyText).then(
		() => {
		    console.log("copy success");
		},
		error => {
		    console.log(error);
		}
	    );
	} else {
	    alert("Unable to use clipboard.");
	};
    };
    this.save=function(data, filename, type) {
	//console.log("Saving data:",data);
	//console.log("Saving file:",filename);
	//return;
	var file = new Blob([data], {type: type});
	if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
	else { // Others
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);  
            }, 0);
	};
    };
    this.size = function(state) {
	var obj=state.React.matrix;
	var size = 0, key;
	for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
	}
	console.log("Matrix size:",size);
	return size;
    };
    this.sortArrays=function () {
	var narg=arguments.length;
	if (narg===0) {return [];}
	var nlen=arguments[0].length;
	var toSort=[];
	for (var i = 0; i < nlen; i++) {
	    toSort[i] = [];
	    for (var jj=0;jj<narg;jj++) {
		toSort[i].push(arguments[jj][i])
	    };
	    toSort[i].push(i);
	};
	toSort.sort(function(left, right) {
	    return left[0] < right[0] ? -1 : 1;
	});
	var ret=[];
	for (var ll=0;ll<narg;ll++) {
	    ret[ll] = [];
	    for (var j = 0; j < nlen; j++) {
		ret[ll].push(toSort[j][ll])
	    };
	};
	return ret;
    }
    // copy object-structure
    this.isEmpty=function(obj) { // check if obj has any string/number children
	var ret=true;
	var k;
	if (obj===undefined) {
	    ret=true;
	} else {
	    var typ=typeof obj;
	    if (typ === "Array") { // check array children
		for (k in obj) {
		    if (! this.isEmpty(obj[k])) {
			ret=false;
			//console.log("    =",typ,ret,k,JSON.stringify(obj[k]));
			break;
		    }
		}
	    } else if (typ === "object") { // check hash children
		for (k in obj) {
		    if (obj.hasOwnProperty(k)) {
			if (! this.isEmpty(obj[k])) { 
			    ret=false;
			    //console.log("    =",typ,ret,k,JSON.stringify(obj[k]));
			    break;
			}
		    }
		}
	    } else {
		ret=false;
	    }
	}
	//console.log("Type:",ret,JSON.stringify(obj));
	return ret;
    }.bind(this);
    // get map element
    this.getMapItem=function(state,map,ii) {
	let s=map[ii][0];
	let t=map[ii][1];
	if ( (s===undefined || ! Array.isArray(s)) &&
	     (t===undefined || ! Array.isArray(t)) ) {
	    s=map[ii];
	    t=map[ii];
	} else if (t===undefined) {
	    t=s;
	};
	return {"src":s,"trg":t};
    }
    // map src onto target always
    this.copyMap=function(state,type,src,trg,map) {
	if (this.bdeb) {console.log("Map:",JSON.stringify(map),type,this.getType(state,type));}
	if (type===undefined) {
	    throw new Error("ERROR: MapForce with no type.");
	} else if (src===undefined) {
	    throw new Error("ERROR: MapForce with no src.");
	} else if (trg===undefined) {
	    throw new Error("ERROR: MapForce with no trg.");
	} else if (map===undefined) {
	    let keys=Object.keys(src);
	    let lenk=keys.length;
	    if (this.bdeb) {console.log("   keys:",JSON.stringify(keys));};
	    for (let ii=0;ii<lenk;ii++) {
		let key=keys[ii];
		if (this.bdeb) {console.log("Src:",key,JSON.stringify(src[key]),JSON.stringify(trg[key]));}
		if (typeof src[key]==="object" && // next level
		    src[key] !== null &&
		    !Array.isArray(src[key])) {
		    if (trg[key]===undefined) {trg[key]={};};
		    if (this.bdeb) {console.log("Object cp:",key,JSON.stringify(trg),JSON.stringify(src[key]));}
		    this.copyMap(state,type,src[key],trg[key]);
		} else if ( Array.isArray(src[key]) && (type===this.type.fill && trg[key]===undefined)) {
		    if (this.bdeb) {console.log("Fill array cp:",key,JSON.stringify(src[key]));}
		    trg[key]=state.Utils.cp(src[key]);		    
		} else if ( Array.isArray(src[key]) && (type===this.type.force)  ) {
		    if (this.bdeb) {console.log("Force array cp:",key,JSON.stringify(src[key]));}
		    trg[key]=state.Utils.cp(src[key]);		    
		} else if ( Array.isArray(src[key]) && (type===this.type.any) ) {
		    if (this.bdeb) {console.log("Any array cp:",key,JSON.stringify(src[key]));}
		    trg[key]=state.Utils.cp(src[key]);		    
		} else if (type===this.type.fill && trg[key]===undefined) {
		    if (this.bdeb) {console.log("Fill cp:",key,JSON.stringify(src[key]));}
		    trg[key]=src[key];		    
		} else if (type===this.type.force) {
		    if (this.bdeb) {console.log("Force cp:",key,JSON.stringify(src[key]));}
		    trg[key]=src[key];		    
		} else if (type===this.type.any) {
		    if (this.bdeb) {console.log("Any cp:",key,JSON.stringify(src[key]));}
		    trg[key]=src[key];		    
		} else {
		    if (this.bdeb) {console.log("Omitting:",key,JSON.stringify(src[key]));}
		}
	    }
	} else {
	    let len=map.length
	    for (let ii=0;ii<len;ii++){
		let mm=this.getMapItem(state,map,ii);
		this.cpMap(state,mm.trg,mm.src,trg,src,type)
	    }
	}
    }.bind(this);
    this.cpMap=function(state,t,s,trg,src,type) {
	var ss=this.getItem(state,s,src);
        if (ss !== undefined || type===this.type.force) {
	    if (this.bdeb) {console.log("Filling:",s,'->',t,! this.isEmpty(ss));}
	    this.setMap(state,t,trg,ss,type);
	};
    }.bind(this);
    this.setMap=function(state,t,trg,ss,type) {
	var ll=t.length;
	if (trg===undefined) { 
	    return;
	} else if (ll===0) {
	    trg=ss;
	    return trg;
	} else {
	    var tt=trg;
	    for (var ii=0;ii<ll-1;ii++) {
		if (tt[t[ii]]===undefined) { tt[t[ii]]={} };
		tt=tt[t[ii]];
	    }
	    if (type===this.type.force ||
		type===this.type.any ||
		(type===this.type.fill && this.isEmpty(tt[t[ll-1]]))) {
		tt[t[ll-1]]=state.Utils.cp(ss)
	    }
	    if (this.bdeb) {
		console.log("Copied:",type,JSON.stringify(t),JSON.stringify(tt[t[ll-1]]));
	    };
	}
    };
    this.setForce=function(state,t,trg,ss) {
	var ll=t.length;
	if (trg===undefined) { 
	    return;
	} else if (ll===0) {
	    trg=ss;
	    return trg;
	} else {
	    var tt=trg;
	    for (var ii=0;ii<ll-1;ii++) {
		if (tt[t[ii]]===undefined) { tt[t[ii]]={} };
		tt=tt[t[ii]];
	    }
	    tt[t[ll-1]]=state.Utils.cp(ss)
	    if (this.debug) {console.log("Force copied:",JSON.stringify(t),JSON.stringify(tt[t[ll-1]]));}
	    return tt[t[ll-1]];
	}
    };
    this.setFill=function(state,t,trg,ss) {
	var ll=t.length;
	if (trg===undefined) { 
	    return;
	} else if (ll===0) {
	    trg=ss;
	    return trg;
	} else {
	    if (this.debug) {console.log("Trg:",JSON.stringify(t),":",JSON.stringify(trg),":",JSON.stringify(ss));}
	    var tt=trg;
	    for (var ii=0;ii<ll-1;ii++) {
		if (tt[t[ii]]===undefined) { tt[t[ii]]={} };
		tt=tt[t[ii]];
	    }
	    if (this.isEmpty(tt[t[ll-1]])) {
		tt[t[ll-1]]=state.Utils.cp(ss);
	    }
	    return tt[t[ll-1]];
	}
    }.bind(this);
    this.cpForce=function(state,t,s,trg,src) {
	var ss=this.getItem(state,s,src);
	this.setForce(state,t,trg,ss);
    }.bind(this);
    this.cpAnything=function(state,t,s,trg,src) {
	var ss=this.getItem(state,s,src);
        if (ss !== undefined) {
	    this.setForce(state,t,trg,ss);
	};
    }.bind(this);
    this.cpFill=function(state,t,s,trg,src) {
	var ss=this.getItem(state,s,src);
	if (this.debug) {console.log("Filling:",s,'->',t,! this.isEmpty(ss));}
	//if (! this.isEmpty(ss) ) {
        if (ss !== undefined) {
	    this.setFill(state,t,trg,ss);
	}
    }.bind(this);
    // map src onto target always
    this.copyForce=function(state,src,trg,map) {
	if (src===undefined) {
	    throw new Error("ERROR: MapForce with no src.");
	} else if (trg===undefined) {
	    throw new Error("ERROR: MapForce with no trg.");
	} else if (map===undefined) {
	    let keys=Object.keys(src);
	    let lenk=keys.length;
	    for (let ii=0;ii<lenk;ii++) {
		let key=keys[ii];
		if (typeof src[key]==="object" && src[key] !== null) {
		    if (trg[key]===undefined) {trg[key]={};};
		    this.copyForce(state,src[key],trg[key]);
		} else if (Array.isArray(src[key])) {
		    trg[key]=state.Utils.cp(src[key]);		    
		} else {
		    trg[key]=src[key];		    
		}
	    }
	} else {
	    let len=map.length
	    for (let ii=0;ii<len;ii++){
		let mm=this.getMapItem(state,map,ii);
		this.cpForce(state,mm.trg,mm.src,trg,src)
	    }
	}
    }.bind(this);
    // map src onto target always
    this.copyAnything=function(state,src,trg,map) {
	if (src===undefined) {
	    throw new Error("ERROR: MapForce with no src.");
	} else if (trg===undefined) {
	    throw new Error("ERROR: MapForce with no trg.");
	} else if (map===undefined) {
	    let keys=Object.keys(src);
	    let lenk=keys.length;
	    for (let ii=0;ii<lenk;ii++) {
		let key=keys[ii];
		if (typeof src[key]==="object" && src[key] !== null) {
		    if (trg[key]===undefined) {trg[key]={};};
		    this.copyAnything(state,src[key],trg[key]);
		} else if (Array.isArray(src[key])) {
		    trg[key]=state.Utils.cp(src[key]);		    
		} else {
		    trg[key]=src[key];		    
		}
	    }
	} else {
	    let len=map.length
	    for (let ii=0;ii<len;ii++){
		let mm=this.getMapItem(state,map,ii);
		this.cpAnything(state,mm.trg,mm.src,trg,src)
	    }
	}
    }.bind(this);
    // map src onto target if target is empty and src is not
    this.copyFill=function(state,src,trg,map) {
	if (src===undefined) {
	    throw new Error("ERROR: MapFill with no src.");
	} else if (trg===undefined) {
	    throw new Error("ERROR: MapFill with no trg.");
	} else if (map===undefined) {
	    //if (this.cnt++>10) { return;}
	    let keys=Object.keys(src);
	    let lenk=keys.length;
	    if (this.debug) {console.log("   keys:",JSON.stringify(keys));};
	    for (let ii=0;ii<lenk;ii++) {
		let key=keys[ii];
		if (src[key]!==null && typeof src[key]==="object" && ! Array.isArray(src[key])) {
		    if (trg[key]===undefined) {trg[key]={};};
		    //console.log(this.cnt,"   ",ii," -> ",key)
		    if (key==="visible") {console.log("Object cp:",key,JSON.stringify(trg),JSON.stringify(src[key]));}
		    this.copyFill(state,src[key],trg[key]);
		} else if (trg[key]===undefined && Array.isArray(src[key])) {
		    if (key==="visible") {console.log("Array cp:",key,JSON.stringify(src[key]));}
		    trg[key]=state.Utils.cp(src[key]);		    
		} else if (trg[key]===undefined) {
		    if (key==="visible") {console.log("Item cp:",key,JSON.stringify(src[key]));}
		    trg[key]=src[key];		    
		}
	    }
	} else {
	    var len=map.length
	    for (let ii=0;ii<len;ii++){
		let mm=this.getMapItem(state,map,ii);
		if (mm.src!==undefined) { // never copy undefined...
		    this.cpFill(state,mm.trg,mm.src,trg,src);
		};
	    }
	}
    }.bind(this);
    this.getItem=function(state,s,src) {
	var ss=src;
	var ll=s.length;
	for (var ii=0;ii<ll;ii++) {
	    if (ss===undefined) { return ss};
	    ss=ss[s[ii]];
	}
	return ss;
    };
    this.printItem=function(state,s,src) {
	console.log("Printing:",JSON.stringify(s));
	var bok=false;
	if (s===undefined) {console.log("Invalid map-path...");};
	if (src===undefined) {console.log("Invalid map-source...");};
	var ss=this.getItem(state,s,src);
	//console.log("Filling:",s,'->',t,! this.isEmpty(ss),JSON.stringify());
	//if (! this.isEmpty(ss) ) {
        if (ss !== undefined) {
	    bok=true;
	    console.log("Item:",JSON.stringify(s),"->",JSON.stringify(ss));
	} else {
	    console.log("Missing Item:",JSON.stringify(s),"->",JSON.stringify(src));
	}
	return bok;
    }.bind(this);
    this.printMap=function(state,src,map) {
	var bok=false;
	var lenm=map.length
	for (var ii=0;ii<lenm;ii++){
	    let mm=this.getMapItem(state,map,ii);
	    bok=this.printItem(state,mm.src,src) || bok;
	};
	if (!bok) {
	    console.log(">>>> printMap: No mapped-data found..."+lenm);
	};
    };
    this.getSource=function(state,map) {
	var ret=[];
	var len=map.length;
	for (var ii=0;ii<len;ii++){
	    let mm=this.getMapItem(state,map,ii);
	    ret.push(mm.src);
	}
	return ret;
    };
    this.getUrlPath=function(state) {
	var path=window.location.href;
	return (path);
    };
    this.pushUrl=function(state) {
	var url=this.getUrl(state);
	window.history.replaceState("", "js", url);
    };
    this.getUrl=function(state) {
	var path = window.location.pathname;
	//console.log("Path:",path);
	var page = path.split("/").pop();
	page.split('#').shift();
	//console.log( page );
	var url=page+"?setup="+state.Default.setup+"&";
	//console.log("Actual Keys:",JSON.stringify(state.Path.keys));
	var uri=state.Default.pushUrl(state)
	for (var key of Object.keys(uri)) {
	    var val=uri[key];
	    //console.log("KV:",key,val);
	    if (val !== undefined) {
		var raw=JSON.stringify(val);
		//console.log("Raw:",raw, JSON.parse(raw));
		var str=encodeURIComponent(raw)+"&";
		url=url + key + "=" + str;
	    }
	};
	//console.log("Setting URL to: (",url.length,"):",decodeURI(url));
	//console.log("New URL: (",url.length,"):",this.prettyJson(uri));
	    return url;
    };
    this.getQRUrl=function(state) {
	var path = window.location.pathname;
	//console.log("Path:",path);
	var page = path.split("/").pop();
	page.split('#').shift();
	//console.log( page );
	var url=page+"?setup="+state.Default.setup+"&";
	//console.log("Actual Keys:",JSON.stringify(state.Path.keys));
	var uri=state.Default.pushQRUrl(state)
	for (var key of Object.keys(uri)) {
	    var val=uri[key];
	    //console.log("KV:",key,val);
	    if (val !== undefined) {
		var raw=JSON.stringify(val);
		//console.log("Raw:",raw, JSON.parse(raw));
		var str=encodeURIComponent(raw)+"&";
		url=url + key + "=" + str;
	    }
	};
	//console.log("Setting URL to: (",url.length,"):",decodeURI(url));
	//console.log("New URL: (",url.length,"):",this.prettyJson(uri));
	    return url;
    };
    this.pushChanged=function(state,url,map,type) {
	if (type===undefined) {type=this.type.fill;};
	//console.log("PushUrlDetails:",url,JSON.stringify(map));
	if (url===undefined) {
	    throw new Error("ERROR: pushUrl with no src.");
	} else if (map===undefined) {
	    throw new Error("ERROR: pushUrl with no map.");
	} else {
	    var len=map.length
	    //console.log("PushUrlDetails...",map.length);
	    for (var ii=0;ii<len;ii++){
		//console.log("PushUrlDetails...",ii,map.length);
		let mm=this.getMapItem(state,map,ii);
		let cc=state.Default.hasChanged(state,mm.trg);
		if (cc === null || cc) {  // already in URL or changed
		    var ss=this.getItem(state,mm.trg,state);
		    if (ss === undefined) { // item does not exist any more, how strange...
			// do nothing
		    // } else if (type === this.type.splice) {
		    //  	var tt=this.getItem(state,mm.trg,state.Default.config.setup);
		    //  	var dd=state.Utils.deepDiff(ss,tt);
		    //  	console.log("SS:",JSON.stringify(ss),this.type.fill);
		    //  	console.log("TT:",JSON.stringify(tt));
		    //  	console.log("DD:",JSON.stringify(dd));
		    //  	this.setMap(state,mm.trg,url,ss,this.type.fill);
		    } else {
		    //	console.log("SS:",JSON.stringify(ss),type);
		 	this.setMap(state,mm.trg,url,ss,type);
		    }
		}
	    }
	};
	return url;
    };
    this.loadUrlDetails=function(state,setup,map) {
	var url=this.getUrlVars();
	this.copyMap(state,this.type.fill,url,setup,map);
    };
    this.init=function(par,setup){
	var url=this.getUrlVars();
	if (par in url) {
	    var code;
	    try {
		code=url[par];
		//console.log("Processing url:",par,JSON.stringify(newsetup));
		var newsetup=JSON.parse(code);
		this.smear(setup,newsetup);
	    } catch (e) { // is a value, not json
		setup[par]=url[par];
	    }
	    //if (par==="Path") {
		//console.log("Path after:", JSON.stringify(setup.select));
	    //}
	} else {
	    console.log("No '"+par+"' in URL.",JSON.stringify(Object.keys(url||{})));
	}

    };
    this.isObject=function(object) {
	return object != null && typeof object === 'object';
    };
    this.getDefinedKeys=function(object) {
	var ret=[];
	for (var key in object) {
            if (hasOwnProperty.call(object, key) && object[key]!==undefined) {
		ret.push(key);
	    }
        }
	return ret.sort();
    };
    this.deepEqual=function(object1, object2) {
	if ((object1 === null && object2 === null) ||
	    (object1 === undefined && object2 === undefined)) {
	    return true;
	} else if (object1===null || object1===undefined ||
		   object2===null || object2===undefined) {
	    return false;
	};
	if (typeof(object2) === 'object') {
	    var keys1 = this.getDefinedKeys(object1);
	    var keys2 = this.getDefinedKeys(object2);
	    if (keys1.length !== keys2.length) {
		return false;
	    };
	    for (var key of keys1) {
		var val1 = object1[key];
		var val2 = object2[key];
		var areObjects = this.isObject(val1) && this.isObject(val2);
		if (areObjects) {
		    if (!this.deepEqual(val1, val2)) {
			return false;
		    };
		} else {
		    if (val1 !== val2) {
			return false;
		    };
		}
	    }
	} else if (object1 !== object2) {
	    return false;
	}
	return true;
    }.bind(this);
    // splice 
    this.spliceDiff=function(object,diff) {
	var ret;
	if (diff === null || diff === undefined) {
	    return this.cp(object);
	} else if (object===null || object===undefined) {
	    return; // need object structure
	};
	if (typeof(object) === 'object') {
	    if (Array.isArray(object)) {
		ret=[];
	    } else {
		ret={};
	    };
	    //var keys1 = this.getDefinedKeys(object);
	    var okeys = this.getDefinedKeys(object);
	    for (var okey of okeys) {
		var val1 = object[okey];
		var val2 = diff[okey];
		var areObjects = this.isObject(val1) && this.isObject(val2);
		if (areObjects) {
		    ret[okey]=this.spliceDiff(val1, val2);
		} else {
		    if (val2 !== undefined && val1 !== val2) { // use new value
			ret[okey]=this.cp(val2);
		    } else { // use old value
			ret[okey]=this.cp(val1);
		    };
		}
	    }
	    // add missing diff-keys...
	    var dkeys = this.getDefinedKeys(diff);
	    for (var dkey of dkeys) {
		var dal1 = object[dkey];
		var dal2 = diff[dkey];
		var dareObjects = this.isObject(dal1) && this.isObject(dal2);
		if (!dareObjects) {
		    if (dal2 !== undefined && dal1 !== dal2) { // use new value
			ret[dkey]=this.cp(dal2);
		    };
		}
	    }
	} else if (object !== diff) {
	    ret=this.cp(diff);
	};
	return ret;
    }.bind(this);
    this.deepDiff=function(object1,object2) {
	var ret;
	if ((object1 === null && object2 === null) ||
	    (object1 === undefined && object2 === undefined)) {
	    return;
	} else if (object1===null || object1===undefined ||
		   object2===null || object2===undefined) {
	    return this.cp(object2);
	};
	if (typeof(object2) === 'object') {
	    ret={};
	    var keys2 = this.getDefinedKeys(object2);
	    for (var key of keys2) {
		var val1 = object1[key];
		var val2 = object2[key];
		var areObjects = this.isObject(val1) && this.isObject(val2);
		if (areObjects) {
		    if (!this.deepEqual(val1, val2)) {
			ret[key]=this.deepDiff(val1, val2);
		    };
		} else {
		    if (val1 !== val2) {
			ret[key]=val2;
		    };
		}
	    }
	} else if (object1 !== object2) {
	    ret=object2;
	};
	return ret;
    }.bind(this);
};
export default Utils;
    
