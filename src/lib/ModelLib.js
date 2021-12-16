//
// The chain runs continuously.
// The "run" subroutine calls sub-processes for
//  * input,
//  * server-requests, 
//  * config-update, 
//  * 3D-configling and 
//  * display. 
// The "run" subroutine finally re-calls itself.
// Some chain - elements are called every time the
// "run" subroutine is called, while some are only
// called at certain "step"s (like the orbit update).
//

//import Vector2 from './Vector2Lib';
import Vector3 from './Vector3Lib';
//import * as TWEEN from './tween';
import * as THREE from 'three';

console.log("Loading ModelLib");

function Model() { 
    // This object maintains the state while drawing is done in state.React.Model,
    // use the following flags to communicate changes in state...
    this.initialised=false;
    this.redraw={backdrop:false,
		 bodies:false,
		 model:false,
		 controls:false,
		 config:false};
    // other data...
    this.modelRedraw=false; 
    this.controlsRedraw=false; 
    this.configRedraw=false; 
    this.redraw = true;
    // update 3D model of the solar system...
    this.model={};
    this.scenes={};
    this.controls=undefined;
    this.consTime = (new Date().getTime())-10000.0;
    this.consReq = 0;
    this.lastCon = 0;
    this.lastTime = (new Date().getTime())-10000.0;
    this.reqId=undefined;
    this.speed = 0.0;
    this.step = 0;
    this.requests = { state:{0:{location : {latitude : 60.0,
					  longitude: 10.0,
					  height   : 0.0},
			      play : { event : 0,
				       speed : 0.0,       // configEpoch = (epoch-e0) * speed + m0
				       e0 : 0.0,
				       m0 : 0.0 },
			      events : [{ reqId : 1,
					  label: "Sunrise", 
					  pointAt : "The Sun",
					  viewAngle : 25.0,
					  dtg : "2016-01-02T16:56:00Z"
					}
				       ],
			      current : 0
			     },
			     1:{}},
                      current : 0,
		      };
    this.config = { reqId : -1,
		    play : { },
		    state : {0:{bodies:{},
				observer:{}}, // first config state goes here
			     1:{bodies:{},
				observer:{}}}, // second config state goes here
		    current : 1,// current state (0 or 1)?
		    newTarget : false,
		  };
    this.hello=function () {
	console.log("Hello world!");
    };
    this.init = function (state) {
	for (var key in this.redraw) {
	    if (this.redraw.hasOwnProperty(key)) {
		this.redraw[key]=true;
	    }
	};
	this.initialised=true;
    }
    // this.initRequest = function (state) {
    // 	var url=this.getUrlVars();
    // 	this.launch(state,url["lat"],url["lon"],url["dtg"],url["hrs"],url["label"],url["target"],url["fov"],url["dir"],url["con"],url["speed"]);
    // };
    //this.fType = this.getUrlVars()["type"];
    this.getCurrentConfig = function (state) {
	//this.requestAnimFrame(this.update);
	this.nowMsec=new Date().getTime();
	if (this.lastMsec === undefined) {this.lastTimeMsec=this.nowMsec;};
	//var deltaMsec   = Math.min(200, this.nowMsec - this.lastMsec)
	if (this.tweentime > this.nowMsec) {
	    //TWEEN.update();
	    this.redraw=true;
	} else {
	    if (this.controlsUpdate()) { this.step=0;};
	    if (this.controlsRedraw) {
		this.controlsRedraw=false;
		this.redraw=true;
	    };
	}
	if (this.requestUpdate(state)) { this.step=0;};
	if (this.processNewRequests()) { 
	    this.offzoom(0.5);
	    this.step=0;
	};
	if (this.step === 0) {
	    this.configUpdate(state);
	    if (this.configRedraw) {
		this.redraw=true;
		this.configRedraw=false;
	    };
	    //this.updateScene(state);
	};
	this.lastTimeMsec= this.nowMsec;
	if (this.reqId !== -1 && this.speed > 0) {
	    this.step=(this.step+1)%2;    
	} else {
	    this.step=(this.step+1)%100;    
	};
	if (this.reqId !== -1 && state.React !== undefined && state.React.Model !== undefined) {
	    return this.config.state[this.config.current];
	};
    };
    this.offzoom = function (delta) {
        //_zoomStart.y = _zoomStart.y + delta;
        //console.log("OffZoom:",delta,this.object.getFovX());
    };
    this.initScene = function (state) {
	state.Scene.display=0;
	state.Scene.axis=0;
	state.Scene.position=0;
	state.Milkyway.init(state,'sky/data/stars.json','sky/data/const.json','sky/data/descr.json');
    };
    this.updateScene = function (state) {
	// update position of all bodies
	if (this.reqId !== -1 && state.React !== undefined && state.React.Model !== undefined) {
	    console.log("Update scene..");
	    state.Scene.defined=true;
	} else {
	    state.Scene.defined=false;
	}
    };
    this.updateCamera = function (state) {
	// update camera position
	if (state.Scene.defined) {
	    this.camera.position.copy(state.Scene.observer.position);
	    this.camera.setUp(state.Scene.observer.zenith); // up is always towards observer zenith...
	}
    };
    this.play  = function (state) {
	//this.play();
    };
    this.pushUrl  = function (state) {
	this.pushUrl();
    };
    this.toggleConstellations  = function (state) {
	this.consTime=new Date().getTime();
	this.consReq = (+this.consReq+1)%2;
    };
    this.toggleFullScreen  = function () {
	var pos=0;
	if (!document.fullscreenElement &&    // alternative standard method
	    !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
	    if (document.documentElement.requestFullscreen) {
		document.documentElement.requestFullscreen();
		pos=1;
	    } else if (document.documentElement.msRequestFullscreen) {
		document.documentElement.msRequestFullscreen();
		pos=2;
	    } else if (document.documentElement.mozRequestFullScreen) {
		document.documentElement.mozRequestFullScreen();
		pos=3;
	    } else if (document.webkitRequestFullscreen) {
		document.webkitRequestFullscreen();
		pos=4;
	    } else {
		pos=5;
	    }
	} else {
	    if (document.exitFullscreen) {
		document.exitFullscreen();
		pos=6;
	    } else if (document.msExitFullscreen) {
		document.msExitFullscreen();
		pos=7;
	    } else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
		pos=8;
	    } else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
		pos=9;
	    } else {
		pos=10;
	    }
	}
	//    var documentLog = document.getElementById("log");
	//    document.getElementById("log").innerHTML="Chain done...";
	//    documentLog.innerHTML="Pos: "+pos;
	console.log("pos:",pos);
    };
    this.shiftDisplay= function(state) {
	state.Scene.display=(state.Scene.display+1)%2;
    };
    this.shiftAxis= function(state) {
	state.Scene.axis=(state.Scene.axis+1)%2;
    };
    this.shiftPosition= function(state) {
	state.Scene.position=(state.Scene.position+1)%2;
    };
    this.getUrlVars= function() {
	var vars = {};
	window.location.href.replace(
	    /[?&]+([^=&]+)=([^&]*)/gi,
	    function(m,key,value) {
		//console.log("URL item:",key," ",value)
		vars[key] = value;
	    });
	return vars;
    };
    this.launch= function (state,lat, lon, dtg, hrs, label, target, fov, dir, con, speed) {
	if (hrs===undefined) {hrs=1.0;};
	if (speed===undefined) {speed=this.speed;}
	console.log("*** launching model:",lat, lon, dtg, hrs, label, target, fov, dir, con, speed);
	lat=(lat || 51.5);
	lon=(lon || 0.0);
	con=(con || 0);
	hrs=Math.max(0,Math.min(24,(hrs || 1)));
	var dtgdate;
	var m0;
	if (dtg) {
	    dtgdate=new Date(dtg);
	    m0=dtgdate.getTime();
	} else {
	    dtgdate=new Date();
	};
	var dtgs=[];
	dtgs.push(dtgdate.toISOString());
	var tt;
	for ( tt = 0; tt < hrs; tt++) {
	    dtgs.push(state.Utils.addHours(state,dtgdate,1.0).toISOString());
	};
	if (dir !== undefined) { // direction in J2000 (the star coordinate system)
	    var items=dir.split(',');
	    if (items.length === 3) {
		dir = new Vector3(items[0],items[1],items[2]);
	    } else {
		console.log("Unable to interpred dir:",dir);
		dir=undefined;
	    }
	}
	var newRequest=this.requests.current + 1;
	this.requests.state[newRequest]={ location : {latitude : lat,
					   longitude : lon,
					   height : 0.0},
			       play : {  } ,
			       events : [],
			       current : 0
			     };
	for ( tt = 0; tt < dtgs.length; tt++) {
	    this.requests.state[newRequest]["events"].push({reqId : tt+1,
						 label: label,
						 target : target,
						 dir : dir,
						 fov : fov,
						 con : con,
						 dtg : dtgs[tt] 
						});
	};
	if (speed !== undefined) {
	    this.requests.state[newRequest]["play"]["event"] = 0;
	    this.requests.state[newRequest]["play"]["speed"] = speed;
	    this.requests.state[newRequest]["play"]["hrs"] = hrs;
	    this.requests.state[newRequest]["play"]["m0"] = m0;
	    
	    console.log("New request:",this.requests.state[newRequest]);

	} else {
	    this.requests.state[newRequest]["play"]["event"] = 0;
	};
	this.requests.current=newRequest;
    };
    this.controlsUpdate = function (state) {
    };
    this.requestUpdate = function (state) {
	var ret=false;
	var reqId=this.requests.current;
	var req = this.requests.state[reqId]
	if ( ! req.sent) { // we have a new target
	    console.log("Sending new request.",reqId);
	    this.sendRequest(state,reqId,req,[]);
	    req.sent= true;
	}
	return ret;
    };
    this.getRequestPar=function(state,request) {
	// send server request for data
	var req=new this.request();
	req.addLat(request.location.latitude);
	req.addLon(request.location.longitude);
	req.addHgt(request.location.height);
	var dtgs = [];
	for ( var tt = 0; tt < request.events.length; tt++) {
	    dtgs.push(request.events[tt]["dtg"]);
	};
	if (dtgs.length === 0) { // add "now"...
	    var dtgdate=new Date();
	    dtgs.push(dtgdate.toISOString());
	};
	req.addDtg(dtgs);
	req.wipe();
	console.log("State-request :",req);
	return req;
    };
    this.sendRequest = function(state, reqId, request, callbacks) {
	if (this.bdeb) {console.log("Loading state.");};
	var req=this.getRequestPar(state,request);
	if (req !==undefined) {
	    var url="cgi-bin/state.pl";
	    var sequence = Promise.resolve();
	    sequence = sequence.then(
		function() {
		    return state.File.get(url,req);
		}
	    ).then(
		function(result) {
		    this.processState(state,result,reqId,request);
		}.bind(this)
	    ).catch(
		function(err) {
		    console.log("Unable to load state. ("+err.message+")");
		}
	    );
	    sequence.then(function() {
		//state.Model.changed=false;
		//state.Model.lastUpdate=new moment().valueOf();
		//state.Model.lastCnt=1;
		//state.Model.setStateTime(state);
		//console.log("Normal end...");
	    }).catch(function(err) { // Catch any error that happened along the way
		console.log("Error msg: " + err.message);
	    }).then(function() { // always do this
		//console.log("This is the end...",callbacks.length);
		state.File.next(state,"",callbacks);
	    })
	} else {
	    //no data requested, clean event-arrays...
	};
	//console.log("Polygons:",JSON.stringify(state.Polygon.names));
    }.bind(this);
    this.setInfo = function (state,dtg,lat,lon) {
	//var info=document.getElementById("info");
	//info.innerHTML = dtg+" lat:"+parseFloat(lat).toFixed(2)+" lon:"+parseFloat(lon).toFixed(2);
	console.log(dtg+" lat:"+parseFloat(lat).toFixed(2)+" lon:"+parseFloat(lon).toFixed(2));
    };
    this.processState = function (state,result,reqId,req) {
	//console.log("Received request '",reqId,"'");
	var xmlDoc;
	// update info
	this.setInfo(state,
		     req.events[req.current].dtg,
		     req.location.latitude,
		     req.location.longitude);
	// update data
	//var d=new Date();
	//var tnow=d.getTime();
	var regex=/(<solarsystem[\s\S]*\/solarsystem>)/mg;
	var match=result.match(regex);
	if (match !== null && match.length > 0) {
	    if (window.DOMParser) {
		var parser = new DOMParser();
		xmlDoc = parser.parseFromString(result, "text/xml");
		try {
		    this.dataToRequest(state,xmlDoc,req,reqId);
		    //console.log("Loaded state data:",result);
		} catch (err) {
		    console.log(err);
		};
	    } else {
		console.log("No DOM parser for XML available.");
	    };
	} else {
	    console.log("Error while loading state of solar system.");
	};
    };
    this.dataToRequest=function(state,data,req,reqId) {
	var ss=data.getElementsByTagName("solarsystem")[0];
	var error=ss.getElementsByTagName("Error");
	if (error.length === 0) {
	    // store initial data
	    // var loc=ss.getElementsByTagName("location")[0];
	    // store initial data
	    var ini=ss.getElementsByTagName("initial")[0];
	    var inibod=ini.getElementsByTagName("body");
	    var inino=ini.getAttribute("no");
	    req["initial"]={};
	    var ii;
	    for (ii=0; ii<inino; ii++) {
		let bod=inibod[ii];
		let name=bod.getAttribute("name");
		req["initial"][name]={};
		req["initial"][name]["rotation"]={};
		req["initial"][name]["rotation"]["ra"]=+bod.getAttribute("ra");
		req["initial"][name]["rotation"]["dec"]=+bod.getAttribute("dec");
		req["initial"][name]["rotation"]["w"]=+bod.getAttribute("w")*Math.PI/180.0;
		req["initial"][name]["rotation"]["dwdt"]=+bod.getAttribute("dwdt")*Math.PI/180.0;
		req["initial"][name]["main"]=bod.getAttribute("main");
		req["initial"][name]["xmu"]=+bod.getAttribute("xmu");
	    }
	    // store time data
	    var tis=ss.getElementsByTagName("times")[0];
	    var tistim=tis.getElementsByTagName("time");
	    var tisno=tis.getAttribute("no");
	    console.log("Times ",tisno);
	    for (var tt=0; tt<tisno; tt++) {
		var tim = tistim[tt];
		// store observer data
		var dtg  = tim.getAttribute("dtg");
		var dtg_ = req["events"][tt]["dtg"];
		if (dtg !== dtg_) { // check if dtg in reply matches dtg in request
		    console.log("Date mismatch: ",dtg," !== ",dtg_);
		} else {
		    var jd2000=tim.getAttribute("jd2000");
		    var obs=tim.getElementsByTagName("observer")[0];
		    var obsi=obs.getElementsByTagName("i")[0];
		    var obsj=obs.getElementsByTagName("j")[0];
		    var obsk=obs.getElementsByTagName("k")[0];
		    var obsloc=obs.getElementsByTagName("location")[0];
		    var obszen=obs.getElementsByTagName("zenith")[0];
		    req["events"][tt]["observer"]={};
		    req["events"][tt]["observer"]["i"]=new Vector3();
		    req["events"][tt]["observer"]["i"]["x"]=+obsi.getAttribute("x");
		    req["events"][tt]["observer"]["i"]["y"]=+obsi.getAttribute("y");
		    req["events"][tt]["observer"]["i"]["z"]=+obsi.getAttribute("z");
		    req["events"][tt]["observer"]["j"]=new Vector3();
		    req["events"][tt]["observer"]["j"]["x"]=+obsj.getAttribute("x");
		    req["events"][tt]["observer"]["j"]["y"]=+obsj.getAttribute("y");
		    req["events"][tt]["observer"]["j"]["z"]=+obsj.getAttribute("z");
		    req["events"][tt]["observer"]["k"]=new Vector3();
		    req["events"][tt]["observer"]["k"]["x"]=+obsk.getAttribute("x");
		    req["events"][tt]["observer"]["k"]["y"]=+obsk.getAttribute("y");
		    req["events"][tt]["observer"]["k"]["z"]=+obsk.getAttribute("z");
		    req["events"][tt]["observer"]["position"]=new Vector3();
		    req["events"][tt]["observer"]["position"]["x"]=+obsloc.getAttribute("x");
		    req["events"][tt]["observer"]["position"]["y"]=+obsloc.getAttribute("y");
		    req["events"][tt]["observer"]["position"]["z"]=+obsloc.getAttribute("z");
		    req["events"][tt]["observer"]["position"]["origo"]=obsloc.getAttribute("origo");
		    req["events"][tt]["observer"]["zenith"]=new Vector3();
		    req["events"][tt]["observer"]["zenith"]["x"]=+obszen.getAttribute("x");
		    req["events"][tt]["observer"]["zenith"]["y"]=+obszen.getAttribute("y");
		    req["events"][tt]["observer"]["zenith"]["z"]=+obszen.getAttribute("z");
		    var pointAt = req["events"][tt]["pointAt"];
		    req["events"][tt]["pointId"] = -1;
		    var sta=tim.getElementsByTagName("state")[0];
		    var stabod=sta.getElementsByTagName("body");
		    var stano=sta.getAttribute("no");
		    req["events"][tt]["state"]={};
		    for (ii=0; ii<stano; ii++) {
			let bod=stabod[ii];
			let name=bod.getAttribute("name");
			if (name === pointAt) {req["events"][tt]["pointId"] = ii;}
			//console.log("Added state for ",name," at ",dtg);
			req["events"][tt]["state"][name]={"position":new Vector3(),"rotation":new Vector3()};
			req["events"][tt]["state"][name]["position"]["x"]=+bod.getAttribute("x");
			req["events"][tt]["state"][name]["position"]["y"]=+bod.getAttribute("y");
			req["events"][tt]["state"][name]["position"]["z"]=+bod.getAttribute("z");
			req["events"][tt]["state"][name]["position"]["vx"]=+bod.getAttribute("vx");
			req["events"][tt]["state"][name]["position"]["vy"]=+bod.getAttribute("vy");
			req["events"][tt]["state"][name]["position"]["vz"]=+bod.getAttribute("vz");
			req["events"][tt]["state"][name]["rotation"]["ra"]=+req["initial"][name]["rotation"]["ra"]; 
			req["events"][tt]["state"][name]["rotation"]["dec"]=+req["initial"][name]["rotation"]["dec"]; 
			req["events"][tt]["state"][name]["rotation"]["w"]=+req["initial"][name]["rotation"]["w"]
			    + req["initial"][name]["rotation"]["dwdt"] * jd2000;
			req["events"][tt]["state"][name]["name"]=name;
		    }
		}
	    }
	    req.received= true;
	    console.log("Received request:",req);
	} else {
	    console.log("Received error:",error);
	    // we never receive data, stop processing here...
	}
	//console.log("Requests:",JSON.stringify(this.requests));
    };
    this.pushUrl = function (state) {
	var reqId=this.requests.current;
	var req = this.requests.state[reqId]
	if ( req.elements) { // we have a target
	    var reqLocation=this.requests.state[reqId]["location"];
	    if (reqLocation !== undefined && this.config.state[this.config.current] !== undefined) {
		var lat=reqLocation.latitude;
		var lon=reqLocation.longitude;
		var dtg=this.config.state[this.config.current].dtg;
		var dir=this.camera.getDir();
		var fov=this.camera.getFovX();
		var con=this.consReq;
		var speed=(this.config.play.speed||0);
		var hrs=(this.config.play.hrs||1);
		//var lab="";
		var url="sky.html";
		var first=true;
		if (dir !== undefined) {
		    if (first) {url=url+"?";first=false;} else {url=url+"&";};
		    url=url + "dir=" + parseFloat(dir.x).toFixed(5)
			+","+parseFloat(dir.y).toFixed(5)
			+","+parseFloat(dir.z).toFixed(5);
		}
		if (fov !== undefined) {
		    if (first) {url=url+"?";first=false;} else {url=url+"&";};
		    url=url + "fov=" + parseFloat(fov).toFixed(4);
		}
		if (lat !== undefined) {
		    if (first) {url=url+"?";first=false;} else {url=url+"&";};
		    url=url + "lat=" + parseFloat(+lat).toFixed(3);
		}
		if (lon !== undefined) {
		    if (first) {url=url+"?";first=false;} else {url=url+"&";};
		    url=url + "lon=" + parseFloat(+lon).toFixed(3);
		}
		if (dtg !== undefined) {
		    if (first) {url=url+"?";first=false;} else {url=url+"&";};
		    url=url + "dtg=" + dtg;
		}
		if (hrs !== undefined) {
		    if (first) {url=url+"?";first=false;} else {url=url+"&";};
		    url=url + "hrs=" + hrs;
		}
		if (speed !== undefined) {
		    if (first) {url=url+"?";first=false;} else {url=url+"&";};
		    url=url + "speed=" + speed;
		}
		if (con !== undefined) {
		    if (first) {url=url+"?";first=false;} else {url=url+"&";};
		    url=url + "con=" + con;
		}
		console.log("Setting URL to:",url);
		window.history.replaceState("", "js", url);
	    }
	}
    };
    this.play = function (state) {
	if (this.config.play !== undefined) {
	    var tnow=(new Date()).getTime();
	    if (this.config.play.speed === undefined) { // start simulation first time
		this.config.play.speed = 1.0;
		this.config.play.e0 = tnow;
		this.config.play.m0 = (new Date(this.config.state[this.config.current].epoch)).getTime();
	    } else if (this.config.play.halt === undefined){ // stop running simulation, store time
		this.config.play.m0 = this.config.play.m0 + (tnow-this.config.play.e0)*this.config.play.speed;
		this.config.play.e0 = tnow;
		this.config.play.halt = this.config.play.speed;
		this.config.play.speed = 0.0;
	    } else  { // start stopped simulation
		this.config.play.e0 = tnow;
		this.config.play.speed = this.config.play.halt;
		this.config.play.halt=undefined;
	    }
	}
    };
    // check if we have a new request to process.
    this.processNewRequests = function (state) {
	var ret=false;
	var reqId=this.requests.current;
	var req = this.requests.state[reqId]
	if ( req.received & ! req.elements) { // we have a new target
	    //console.log("Calculating orbital elements:",req);
	    // calculate osculating orbital elements
	    for ( var tt = 0; tt < req["events"].length; tt++) {
		req["events"][tt]["epoch"]=(new Date(req["events"][tt]["dtg"])).getTime();// get epoch
		if (req["events"][tt]["state"] !== undefined) {
		    var reqState=req["events"][tt]["state"];
		    req["events"][tt]["elements"]={};
		    var elements=req["events"][tt]["elements"];
		    for (var name in reqState) {
			elements[name]={};
			//var s = reqState[name].position;
			//var e=elements[name];
			var main =  req["initial"][name]["main"];
			if (main !== "") { // body orbits another body...
			    //var r, xmu;
			    //r=reqState[main].position;
			    //xmu=req["initial"][main]["xmu"];
			    //this.state2elements(s,e,r,xmu);
			    //this.elements2anomalies(e);
			}
		    };
		};
		//document.getElementById("log").innerHTML="orbit loop end";
	    };
	    req.elements = true;
	    //console.log("Calculated orbital elements:",req);
	    ret=true;
	}
	return ret;
    };
    // update 3D config of the solar system...
    this.configUpdate = function (state) {
	var ret = false;
	var reqId = this.requests.current;
	var req = this.requests.state[reqId]
	if (req.elements & this.config.reqId !== reqId ) { // process new request
	    //console.log("Constructing config from orbital elements.");
	    // get times
	    this.config.epochs = [];
	    for ( var tt = 0; tt < req["events"].length; tt++) {
		this.config.epochs[tt]=req["events"][tt]["epoch"];
	    };
	    this.config.play={};
	    if (req.play.event !== undefined) {
		this.config.play.event=req.play.event;
	    };
	    if (req.play.speed !== undefined) {
		var tnow=(new Date()).getTime();
		this.config.play.speed=req.play.speed;
		if (req.play.m0 !== undefined) {
		    this.config.play.m0=req.play.m0;
		} else {
		    this.config.play.m0=tnow;
		};
		this.config.play.e0=tnow;
		if (this.config.play.speed > 0 ) {
		    this.config.play.halt=undefined;
		} else {
		    this.config.play.halt=1.0;
		};
	    }
	    this.config.young=(this.config.current+1)%2;
	    if (this.getState(state,req,this.config.state[this.config.young])) {
		this.config.old=this.config.current;
		this.config.current=this.config.young;
		if (this.config.state[this.config.old]["bodies"] !== undefined) {
		    // "tween" config from oldState to newState
		};
		//  point camera
		if (req.play.event !== undefined) {
		    this.config.state[this.config.current].dtg = new Date(
			this.requests.state[reqId]["events"][req.play.event]["dtg"]).toISOString();
		    this.config.newTarget=true;
		}
		// delete old requests
		for (var key in this.requests.state) {
		    if (this.requests.state.hasOwnProperty(key)) {
			if (key !== this.config.old &&this.requests.state[key]["events"] !== undefined) {
			    // delete this.requests.state[key];			    
			}
		    }
		}
		this.reqId=reqId;
	    };
	    req.orbit = false;
            this.setInfo(state,this.config.state[this.config.current].dtg,
			 this.config.state[this.config.current].lat,
			 this.config.state[this.config.current].lon);
	    this.configRedraw=true;
	} else if (req.elements & this.config.play.speed!==undefined) { // time lapse...
	    //console.log("Time lapse.",config.play.speed);
	    this.config.young=(this.config.current+1)%2;
	    if (this.getState(state,req, this.config.state[this.config.young])) {
		this.setInfo(state,this.config.state[this.config.current].dtg,
			     this.config.state[this.config.current].lat,
			     this.config.state[this.config.current].lon);
		this.config.old=this.config.current;
		this.config.current=this.config.young;
		this.configRedraw=true;
	    }
	    //    } else {
	    //	console.log("Nothing to do:",req.elements,config.play.speed);
	}
	return ret;
    };
    this.getState = function (state,req, newconfig){
	var ret=true;
	var tnow=(new Date()).getTime();
	if (this.config.play.speed !== undefined) { // propagate state to right epoch using elliptical orbits
	    var ttrg = (tnow-this.config.play.e0) * this.config.play.speed + this.config.play.m0;
	    newconfig.lat=req.location.latitude;
	    newconfig.lon=req.location.longitude;
	    this.config.play.prev=-1;
	    this.config.play.next=-1;
	    this.config.play.prevEpoch=0;
	    this.config.play.nextEpoch=0;
	    // find correct epoch
	    for ( var tt = 0; tt < req["events"].length; tt++) {
		if (req["events"][tt]["epoch"] <= ttrg &  
		    (this.config.play.prev < 0 || req["events"][tt]["epoch"] >=  this.config.play.prevEpoch)) {
		    this.config.play.prev=tt;
		    this.config.play.prevEpoch=req["events"][this.config.play.prev]["epoch"];
		};
		if (req["events"][tt]["epoch"] >= ttrg &  
		    (this.config.play.next < 0 || req["events"][tt]["epoch"] <=  this.config.play.nextEpoch)) {
		    this.config.play.next=tt;
		    this.config.play.nextEpoch=req["events"][this.config.play.next]["epoch"];
		};
	    };
	    if (this.config.play.prev !== -1 & this.config.play.next !== -1) { // success!
		var dt = ttrg-this.config.play.prevEpoch;
		var dt0 = this.config.play.nextEpoch - this.config.play.prevEpoch;
		var f = dt/Math.max(1e-10,dt0);
		this.interpolateBodies(state,req["events"][this.config.play.prev],
				       req["events"][this.config.play.next],
				       dt,f,newconfig.bodies);
		this.interpolateObserver(state,req["events"][this.config.play.prev],
					 req["events"][this.config.play.next],
					 dt,f,newconfig.observer,newconfig.bodies);
		newconfig.epoch = ttrg;
		newconfig.dtg=new Date(newconfig.epoch).toISOString();
	    } else if (this.config.play.prev !== -1 ) {  // found epoch before, but not after
		this.getBodies(req["events"][this.config.play.prev],newconfig.bodies);
		this.getObserver(req["events"][this.config.play.prev],newconfig.observer,newconfig.bodies);
		newconfig.epoch = req["events"][this.config.play.prev].epoch;
		newconfig.dtg=new Date(newconfig.epoch).toISOString();
	    } else if (this.config.play.next !== -1) {  // found epoch before, but not after
		this.getBodies(req["events"][this.config.play.next],newconfig.bodies);
		this.getObserver(req["events"][this.config.play.next],newconfig.observer,newconfig.bodies);
		newconfig.epoch = req["events"][this.config.play.next].epoch;
		newconfig.dtg=new Date(newconfig.epoch).toISOString();
	    } else {
		//console.log("Times:",+ttrg,"|",+this.config.play.e0 ,"|",+this.config.play.speed, "|",+this.config.play.m0);
		console.log("Unable to find interval:",+ttrg,req["events"]);
		ret=false;
	    }
	    //console.log("Pos:",+ttrg,req["events"][0]," REQ:",this.config.play.prev,this.config.play.next," DTG:",newconfig.dtg,this.config.play.prev,this.config.play.next);
	} else {
	    //console.log("******************getState fixed: ",newConfig);
	    this.getBodies(req["events"][this.config.play.event],newconfig.bodies);
	    this.getObserver(req["events"][this.config.play.event],newconfig.observer,newconfig.bodies);
	    newconfig.epoch = req["events"][this.config.play.event].epoch;
	    newconfig.dtg=new Date(newconfig.epoch).toISOString();
	    newconfig.lat=req.location.latitude;
	    newconfig.lon=req.location.longitude;
	}
	//console.log("******************getState: ",newConfig);
	return ret;
    };
    this.getBodies = function (state,reqState,configBodies) {
	for (var name in reqState["state"]) {
	    var reqBody = reqState["state"][name];
	    if (configBodies[name] === undefined) {
		configBodies[name]={position:new Vector3(),rotation:new Vector3()};
	    };
	    //console.log("getConfigBodies State:",state,s,name);
	    configBodies[name].position.copy(reqBody.position);
	    configBodies[name].position.vx = +reqBody.position.vx;
	    configBodies[name].position.vy = +reqBody.position.vy;
	    configBodies[name].position.vz = +reqBody.position.vz;
	    configBodies[name].rotation.ra = +reqBody.rotation.ra;
	    configBodies[name].rotation.dec = +reqBody.rotation.dec;
	    configBodies[name].rotation.w = +reqBody.rotation.w;
	    configBodies[name].rotation.lon = configBodies[name].rotation.ra;
	    configBodies[name].rotation.lat = configBodies[name].rotation.dec;
	    configBodies[name].rotation.r = 1.0;
	    configBodies[name].rotation.spherical2cartesian();
	    configBodies[name].name=name;
	} 
    }
    this.interpolateBodies = function (state,reqStatePrev,reqStateNext,dt,f,configBodies) {
	for (var name in reqStatePrev["state"]) {
	    var reqPrev = reqStatePrev["state"][name];
	    var reqNext = reqStateNext["state"][name];
	    if (configBodies[name] === undefined) {
		configBodies[name]={position:new Vector3(),rotation:new Vector3()};
	    };
	    configBodies[name].position.interpolate(reqPrev.position,reqNext.position,f);
	    configBodies[name].position.vx =  this.intlin(reqPrev.position.vx,reqNext.position.vx,f);
	    configBodies[name].position.vy =  this.intlin(reqPrev.position.vy,reqNext.position.vy,f);
	    configBodies[name].position.vz =  this.intlin(reqPrev.position.vz,reqNext.position.vz,f);
	    configBodies[name].rotation.ra =  this.intlin(reqPrev.rotation.ra,reqNext.rotation.ra,f);
	    configBodies[name].rotation.dec = this.intlin(reqPrev.rotation.dec,reqNext.rotation.dec,f);
	    configBodies[name].rotation.w =   this.intlin(reqPrev.rotation.w,reqNext.rotation.w,f);
	    configBodies[name].rotation.lon = configBodies[name].rotation.ra;
	    configBodies[name].rotation.lat = configBodies[name].rotation.dec;
	    configBodies[name].rotation.r = 1.0;
	    configBodies[name].rotation.spherical2cartesian();
	    configBodies[name].name=name;
	} 
    };
    this.intlin = function (p,n,f) { // linear interpolation
	return ( p + (n-p)*f );
    };
    this.int2pi = function (p,n,f,t) { // targetted cyclic interpolation
	if (t === undefined) { t=0.0; };
	var diff = (n-p)%(2.0*Math.PI);
	var norb = Math.floor(0.5+(t -diff)/(2.0*Math.PI));
	return ( p + (diff + norb*2.0*Math.PI)*f ); 
    };
    // get observer position and EF-coordinate system...
    this.getObserver = function (state,reqState,configObserver,configBodies) { 
	if (configObserver.position === undefined) configObserver.position=new Vector3(); 
	if (configObserver.i === undefined) configObserver.i=new Vector3(); 
	if (configObserver.j === undefined) configObserver.j=new Vector3(); 
	if (configObserver.k === undefined) configObserver.k=new Vector3(); 
	if (configObserver.zenith === undefined) configObserver.zenith=new Vector3(); 
	var reqObserver=reqState["observer"];
	var reqOrigo=reqObserver.position.origo;
	if (configBodies[reqOrigo] === undefined ) {
	    configObserver.position.copy(reqObserver.position);
	} else {
	    configObserver.position.origo=reqOrigo;
	    configObserver.position.copy(reqObserver.position).add(configBodies[reqOrigo].position);
	}
	configObserver.zenith.copy(reqObserver.zenith);
	configObserver.zenith.normalize();
	configObserver.i.copy(reqObserver.i);
	configObserver.j.copy(reqObserver.j);
	configObserver.k.copy(reqObserver.k);

	//console.log("setting axis:", configObserver.i.x,configObserver.i.y,configObserver.i.z);
    };
    // get observer position and EF-coordinate system...
    this.interpolateObserver = function (state,reqStatePrev,reqStateNext,dt,f,configObserver,configBodies) { 
	if (configObserver.position === undefined) configObserver.position=new Vector3(); 
	if (configObserver.i === undefined) configObserver.i=new Vector3(); 
	if (configObserver.j === undefined) configObserver.j=new Vector3(); 
	if (configObserver.k === undefined) configObserver.k=new Vector3(); 
	if (configObserver.zenith === undefined) configObserver.zenith=new Vector3();
	var reqPrev = reqStatePrev["observer"];
	var reqNext = reqStateNext["observer"];
	var reqOrigo=reqPrev.position.origo;
	if (configBodies[reqOrigo] === undefined ) {
	    configObserver.position.interpolate(reqPrev.position, reqNext.position, f);
	} else {
	    configObserver.position.origo=reqOrigo;
	    configObserver.position.interpolate(reqPrev.position, reqNext.position, f);
	    configObserver.position.add(configBodies[reqOrigo].position);
	}
	configObserver.zenith.interpolate(reqPrev.zenith,reqNext.zenith,f);
	configObserver.zenith.normalize();
	configObserver.i.interpolate(reqPrev.i,reqNext.i,f);
	configObserver.j.interpolate(reqPrev.j,reqNext.j,f);
	configObserver.k.interpolate(reqPrev.k,reqNext.k,f);

	//console.log("setting axis:", configObserver.i.x,configObserver.i.y,configObserver.i.z);
    };
    this.interpolateBodies2 = function(req,dt,f,configBodies) {
	// interpolate body positions between times
	//console.log(">>> interpolating body positions.")
	var reqStatePrev = req["events"][req.play.prev]["state"];
	var reqStateNext = req["events"][req.play.next]["state"];
	if (reqStatePrev === undefined || reqStateNext === undefined) {
	    console.log("THIS SHOULD NEVER HAPPEN!.");
	    return;
	};
	for (var name in req["events"][req.play.next]["state"]) {
	    //var name_ = reqStatePrev[name].name;
	    configBodies[name]={position:new Vector3(),
			       rotation:new Vector3()};
	    var main =  req["initial"][name]["main"];
	    if (main !== "") { // use orbit to interpolate position
		var ep=req["events"][req.play.prev]["elements"][name];
		var en=req["events"][req.play.next]["elements"][name];
		// interpolate elements
		var el = {};
		el.a = this.intlin(ep.a, en.a, f);
		el.e = this.intlin(ep.e, en.e, f);
		el.i = this.int2pi(ep.i, en.i, f);
		el.w = this.int2pi(ep.w, en.w, f);
		el.n = this.intlin(ep.n, en.n, f);
		var trg = dt * el.n;
 		el.m = this.int2pi(ep.m, en.m, f, trg);
		// get state
		this.anomalies2elements(el);
		
		var r=configBodies[main];
		var xmu=req["initial"][main]["xmu"];
		this.elements2state(configBodies[name], el, r, xmu);
		//console.log("Prev elements:",ep);
		//console.log("Next elements:",en);
		//console.log("Intp elements:",el);
		//console.log("State main:",r,xmu);
		//console.log("State elements:",configBodies[name]);
	    } else { // no orbit available, interpolate state directly
		configBodies[name].position.set( this.intlin(reqStatePrev[name].position.x,reqStateNext[name].position.x,f),
						this.intlin(reqStatePrev[name].position.y,reqStateNext[name].position.y,f),
						this.intlin(reqStatePrev[name].position.z,reqStateNext[name].position.z,f));
		configBodies[name].position.vx = this.intlin(reqStatePrev[name].position.vx,reqStateNext[name].position.vx,f);
		configBodies[name].position.vy = this.intlin(reqStatePrev[name].position.vy,reqStateNext[name].position.vy,f);
		configBodies[name].position.vz = this.intlin(reqStatePrev[name].position.vz,reqStateNext[name].position.vz,f);
		//console.log("ConfigBodies fixed:",configBodies[name].position);
	    };
	    configBodies[name].rotation.ra =    this.intlin(reqStatePrev[name].ra,reqStateNext[name].ra,f);
	    configBodies[name].rotation.dec =   this.intlin(reqStatePrev[name].dec,reqStateNext[name].dec,f);
	    configBodies[name].rotation.w =     this.intlin(reqStatePrev[name].w,reqStateNext[name].w,f);
	    configBodies[name].rotation.lon = configBodies[name].rotation.ra;
	    configBodies[name].rotation.lat = configBodies[name].rotation.dec;
	    configBodies[name].rotation.r = 1.0;
	    configBodies[name].rotation.spherical2cartesian();
	    configBodies[name].name=name;
	}
    };
    // interpolate observer position and EF-coordinate system...
    this.interpolateObserver2 = function(req,dt,f,configObserver) {
	if (configObserver.position === undefined) configObserver.position=new Vector3(); 
	if (configObserver.i === undefined) configObserver.i=new Vector3(); 
	if (configObserver.j === undefined) configObserver.j=new Vector3(); 
	if (configObserver.k === undefined) configObserver.k=new Vector3(); 
	if (configObserver.zenith === undefined) configObserver.zenith=new Vector3(); 
	var reqObsPrev=req["events"][req.play.prev]["observer"];
	var reqObsNext=req["events"][req.play.next]["observer"];
	var origo=reqObsPrev.position.origo;
	if (origo === undefined) {origo="earth";};
	//console.log("Origo is now: ",origo);
	var rot = req["initial"][origo]["rotation"];
	//
	// make rotation from start to the final coordinate system
	var m=new THREE.Matrix4();
	if (m.elements.te === undefined) {m.elements.te=[];};
	m.elements.te[ 0]= reqObsPrev.i.x*reqObsNext.i.x + reqObsPrev.j.x*reqObsNext.j.x + reqObsPrev.k.x*reqObsNext.k.x;
	m.elements.te[ 4]= reqObsPrev.i.y*reqObsNext.i.x + reqObsPrev.j.y*reqObsNext.j.x + reqObsPrev.k.y*reqObsNext.k.x;
	m.elements.te[ 8]= reqObsPrev.i.z*reqObsNext.i.x + reqObsPrev.j.z*reqObsNext.j.x + reqObsPrev.k.z*reqObsNext.k.x;
	m.elements.te[ 1]= reqObsPrev.i.x*reqObsNext.i.y + reqObsPrev.j.x*reqObsNext.j.y + reqObsPrev.k.x*reqObsNext.k.y;
	m.elements.te[ 5]= reqObsPrev.i.y*reqObsNext.i.y + reqObsPrev.j.y*reqObsNext.j.y + reqObsPrev.k.y*reqObsNext.k.y;
	m.elements.te[ 9]= reqObsPrev.i.z*reqObsNext.i.y + reqObsPrev.j.z*reqObsNext.j.y + reqObsPrev.k.z*reqObsNext.k.y;
	m.elements.te[ 2]= reqObsPrev.i.x*reqObsNext.i.z + reqObsPrev.j.x*reqObsNext.j.z + reqObsPrev.k.x*reqObsNext.k.z;
	m.elements.te[ 6]= reqObsPrev.i.y*reqObsNext.i.z + reqObsPrev.j.y*reqObsNext.j.z + reqObsPrev.k.y*reqObsNext.k.z;
	m.elements.te[10]= reqObsPrev.i.z*reqObsNext.i.z + reqObsPrev.j.z*reqObsNext.j.z + reqObsPrev.k.z*reqObsNext.k.z;
	//
	// make quaternion from the rotation matrix
	var q=new THREE.Quaternion();
	q.setFromRotationMatrix(m);
	//
	// re-scale rotation angle depending on time elapsed
	//q.scaleAngle(f,rot);
	//
	// get average axis and add quaternion for closest complete number of revolutions
	var angle= f * Math.floor((dt/1000) * rot.rw/360.0 + 0.5) * 2.0 * Math.PI; // absolute rotation since prev
	var qn=new THREE.Quaternion();
	qn.setFromAxisAngle(rot,angle);
	//
	// calculate resulting quaternion
	//q.multiply(qn);
	//
	// apply resulting rotation to observer position and axis.
	var pos=new THREE.Vector3();
	pos.set(reqObsPrev.position.x,reqObsPrev.position.y,reqObsPrev.position.z);

	//console.log("**** Body before:",reqObsPrev.position.x,reqObsPrevos.x);

	pos.applyQuaternion(q);// gives undefined position ***************************************

	//console.log("**** Body after:",reqObsPrev.position.x,reqObsPrevos.x,origo);

	//console.log("*** configObserver:",configObserver);

	if (configObserver[origo] === undefined ) {
	    configObserver.position.copy(pos);
	} else {
	    configObserver.position.copy(pos).add(configObserver[origo].position);
	    //console.log("**** Body origo:",reqObsPrev.position.x,reqObsPrevos.x,configObserver[origo].x,origo);
	}
	//console.log("**** Interpolating observer:",configObserver.x,configObserver.y,configObserver.z);
	if (configObserver.i === undefined) configObserver.i=new Vector3(); 
	pos.set(reqObsPrev.i.x,reqObsPrev.i.y,reqObsPrev.i.z);
	pos.applyQuaternion(q);
	configObserver.i.copy(pos);
	if (configObserver.j === undefined) configObserver.j=new Vector3(); 
	pos.set(reqObsPrev.j.x,reqObsPrev.j.y,reqObsPrev.j.z);
	pos.applyQuaternion(q);
	configObserver.j.copy(pos);
	if (configObserver.k === undefined) configObserver.k=new Vector3(); 
	pos.set(reqObsPrev.k.x,reqObsPrev.k.y,reqObsPrev.k.z);
	pos.applyQuaternion(q);
	configObserver.k.copy(pos);
    };
    this.modelUpdate = function (state) {
	var ret = false;
	var reqId=this.requests.current;
	var req = this.requests.state[reqId]
	if (req.elements & this.model.reqId !== reqId ) { // process new request
	    console.log("Constructing model from orbital elements.");
	    this.model.reqId=reqId;
	    // get times
	    this.model.epochs = [];
	    for ( var tt = 0; tt < req["events"].length; tt++) {
		this.model.epochs[tt]=req["events"][tt]["epoch"];
	    };
	    this.model.play={};
	    if (req.play.event !== undefined) {this.model.play.event=req.play.event;}
	    if (req.play.speed !== undefined) {this.model.play.speed=req.play.speed;}
	    if (req.play.e0 !== undefined) {this.model.play.e0=req.play.e0;}
	    if (req.play.m0 !== undefined) {this.model.play.m0=req.play.m0;}
	    this.model.old=this.model.current;
	    this.model.current=(this.model.current+1)%2;
	    state.Orbit.getState(req,this.model[this.model.current]);
	    if (this.model[this.model.old]["bodies"] !== undefined) {
		// "tween" model from oldState to newState
	    }
	    // delete old requests
	    for (var key in this.requests) {
		if (this.requests.hasOwnProperty(key)) {
		    if (key !== this.model.old & this.requests.state[key]["events"] !== undefined) {
		    }
		}
	    }
	    req.orbit = false;
	    this.modelRedraw=true;
	} else if (req.elements&this.model.play.event === undefined&this.model.play.speed > 0.0) { // time lapse...
	    console.log("Re-calculating orbit state :",this.model.play.speed);
	    this.model.old=this.model.current;
	    this.model.current=(this.model.current+1)%2;
	    state.Orbit.getState(req, this.model[this.model.current]);
	    this.modelRedraw=true;
	}
	return ret;
    };
    this.request=function(state) {
	this.wipe = function () {var obj=Object.keys(this);for (var ii=0; ii<obj.length;ii++) 
				 {if (typeof this[obj[ii]] === 'function') {delete this[obj[ii]];}}}
	this.addLat = function(val) {this["lat"]=val;};
	this.addLon = function(val) {this["lon"]=val;};
	this.addHgt = function(val) {this["hgt"]=val;};
	this.addDtg = function(val) {this["dtg"]=val;};
    };
    this.draw = function (state) {
    };
    this.scene = function(state) {
	this.items=[];
	this.defined=false;
	this.add = function () { // object
	    for (var i = 0; i < arguments.length; i++) {
		var object=arguments[i];
		this.items.push(object);
		//console.log(object);
	    };
	};
	this.addDistance = function (pos) {
 	    var itemLen=this.items.length;
	    for(var ii = 0; ii < itemLen; ii++){
		var item=this.items[ii];
		if (item.position !== undefined) {
		    item.distance = item.position.distanceTo(pos);
		}
	    }
	};
	this.sort = function (pos) {
	    this.addDistance(pos);
	    this.items.sort(function(a,b){return b.distance-a.distance;});
	}
    };
    // requestAnim shim layer by Paul Irish
    this.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
	    window.webkitRequestAnimationFrame || 
	    window.mozRequestAnimationFrame    || 
	    window.oRequestAnimationFrame      || 
	    window.msRequestAnimationFrame     || 
	    function(/* function */ callback, /* DOMElement */ element){
		window.setTimeout(callback, 1000 / 30);
	    };
    })();
};

export default Model;
