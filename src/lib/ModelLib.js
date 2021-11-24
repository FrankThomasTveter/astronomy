//
// The chain runs continuously.
// The "run" subroutine calls sub-processes for
//  * input,
//  * server-requests, 
//  * stack-update, 
//  * 3D-stackling and 
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
    this.modelRedraw=false; 
    this.controlsRedraw=false; 
    this.stackRedraw=false; 
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
    this.requests = { 0 : {location : {latitude : 60.0,
                                       longitude: 10.0,
                                       height   : 0.0},
			   play : { event : 0,
				    speed : 0.0,       // stackEpoch = (epoch-e0) * speed + m0
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
                      1 : {},
                      current : 0
		    };
    this.hello=function () {
	console.log("Hello world!");
    };
    this.initRequest = function (state) {
	var url=this.getUrlVars();
	Request.launch(url["lat"],url["lon"],url["dtg"],url["hrs"],url["label"],url["target"],url["fov"],url["dir"],url["con"],url["play"]);
    };
    //this.fType = this.getUrlVars()["type"];
    this.init = function (state,canvas) {
	this.initCamera(state);
	this.initRequest(state);
	this.initRenderer(state,canvas);
	this.initScene(state);
	this.initControls(state);
    }
    this.run = function (state) {
	this.requestAnimFrame(this.run);
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
	if (this.requestUpdate()) { this.step=0;};
	if (this.processNewRequests()) { 
	    this.offzoom(0.5);
	    this.step=0;
	};
	if (this.step === 0) {
	    this.stackUpdate();
	    if (this.stackRedraw) {
		this.redraw=true;
		this.stackRedraw=false;
	    };
	    this.updateScene();
	};
	if (this.redraw) {
	    this.updateCamera();
	    this.redraw=false;
	};
	this.lastTimeMsec= this.nowMsec;
	if (this.reqId !== -1 && this.speed > 0) {
	    this.step=(this.step+1)%2;    
	} else {
	    this.step=(this.step+1)%100;    
	};
	this.render( state );
	//setTimeout(function(){ this.run();},10);

    };
    this.initRenderer = function (state,context) {
	//renderer = new Renderer(context);
	//renderer.setSize( window.innerWidth, window.innerHeight );
	//document.body.appendChild( renderer.domElement );
    };
    this.render = function (state) {
	//scene, camera...
    };
    this.initScene = function (state) {
	this.scenes["observer"]=state.Planets.observer; // hmmm....
	this.scenes["sun"]=new this.scene().add(state.Planets.sun);
	this.scenes["mercury"]=new this.scene().add(state.Planets.mercury);
	this.scenes["venus"]=new this.scene().add(state.Planets.venus);
	this.scenes["earth"]=new this.scene().add(state.Planets.earth,state.Planets.moon);
	this.scenes["mars"]=new this.scene().add(state.Planets.mars);
	this.scenes["jupiter"]=new this.scene().add(state.Planets.jupiter);
	this.scenes["saturn"]=new this.scene().add(state.Planets.saturn);
	this.scenes["uranus"]=new this.scene().add(state.Planets.uranus);
	this.scenes["neptune"]=new this.scene().add(state.Planets.neptune);
	this.scenes["pluto"]=new this.scene().add(state.Planets.pluto);
	state.Scene.display=0;
	state.Scene.axis=0;
	state.Scene.position=0;
	state.Milkyway.init(state,'sky/data/stars.json','sky/data/const.json','sky/data/descr.json');
    };
    this.initCamera = function (state) {
	//this.camera = state.Camera;
    };
    this.initControls = function (state) { 
	//this.controls = new Controls( this.camera );
	//this.controls.addEventListener( 'change', function () { 
	//renderer.render(scene,camera);
	//} );
	//this.offzoom(1.0);
    };
    this.offzoom = function (delta) {
        //_zoomStart.y = _zoomStart.y + delta;
        //console.log("OffZoom:",delta,this.object.getFovX());
    };
    this.updateScene = function (state) {
	// update position of all bodies
	if (this.reqId !== -1) {
	    var st=this.stack[this.stack.current];
	    state.Planets.copyObserver( st.observer,        state.Planets.observer);
	    state.Planets.copyBody(     st.bodies.sun,      state.Planets.sun);
	    state.Planets.copyBody(     st.bodies.mercury,  state.Planets.mercury);
	    state.Planets.copyBody(     st.bodies.sun,      state.Planets.sun);
	    state.Planets.copyBody(     st.bodies.mercury,  state.Planets.mercury);
	    state.Planets.copyBody(     st.bodies.venus,    state.Planets.venus);
	    state.Planets.copyBody(     st.bodies.earth,    state.Planets.earth);
	    state.Planets.copyBody(     st.bodies.moon,     state.Planets.moon);
	    state.Planets.copyBody(     st.bodies.mars,     state.Planets.mars);
	    state.Planets.copyBody(     st.bodies.jupiter,  state.Planets.jupiter);
	    state.Planets.copyBody(     st.bodies.saturn,   state.Planets.saturn);
	    state.Planets.copyBody(     st.bodies.uranus,   state.Planets.uranus);
	    state.Planets.copyBody(     st.bodies.neptune,  state.Planets.neptune);
	    state.Planets.copyBody(     st.bodies.pluto,    state.Planets.pluto);
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
	this.play();
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
    this.launch= function (state,lat, lon, dtg, hrs, label, target, fov, dir, con, play) {
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
	this.requests[newRequest]={ location : {latitude : lat,
					   longitude : lon,
					   height : 0.0},
			       play : {  } ,
			       events : [],
			       current : 0
			     };
	for ( tt = 0; tt < dtgs.length; tt++) {
	    this.requests[newRequest]["events"].push({reqId : tt+1,
						 label: label,
						 target : target,
						 dir : dir,
						 fov : fov,
						 con : con,
						 dtg : dtgs[tt] 
						});
	};
	if (play !== undefined) {
	    this.requests[newRequest]["play"]["event"] = 0;
	    this.requests[newRequest]["play"]["speed"] = play;
	    this.requests[newRequest]["play"]["hrs"] = hrs;
	    this.requests[newRequest]["play"]["m0"] = m0;
	    
	    console.log("New request:",this.requests[newRequest]);

	} else {
	    this.requests[newRequest]["play"]["event"] = 0;
	};
	this.requests.current=newRequest;
    };
    this.controlsUpdate = function (state) {
    };
    this.requestUpdate = function (state) {
	var ret=false;
	function urlrequest(state) {
	    this.clean_ = function () {var obj=Object.keys(this);for (var ii=0; ii<obj.length;ii++) 
				       {if (obj[ii].match(/_$/g)) {delete this[obj[ii]];}}}
	    this.addLat_ = function(val) {this["lat"]=val;};
	    this.addLon_ = function(val) {this["lon"]=val;};
	    this.addHgt_ = function(val) {this["hgt"]=val;};
	    this.addDtg_ = function(val) {this["dtg"]=val;};
	}
	var reqId=this.requests.current;
	var req = this.requests[reqId]
	if ( ! req.sent) { // we have a new target
	    console.log("Sending new request.");
	    // send server request for data
	    var urlreq=new urlrequest();
	    urlreq.addLat_(req.location.latitude);
	    urlreq.addLon_(req.location.longitude);
	    urlreq.addHgt_(req.location.height);
	    var dtgs = [];
	    for ( var tt = 0; tt < req["events"].length; tt++) {
		dtgs.push(req["events"][tt]["dtg"]);
	    };
	    urlreq.addDtg_(dtgs);
	    urlreq.clean_();
	    req.sent= true;
	    console.log("Sending state-request :",reqId,urlreq);
	    console.warn("Call to state.pl not implemented...");
	    //$.get("cgi-bin/state.pl",urlreq,function(data, status){Request.received(data,status,reqId);});
	}
	return ret;
    };
    this.setInfo = function (state,dtg,lat,lon) {
	var info=document.getElementById("info");
	info.innerHTML = dtg+" lat:"+parseFloat(lat).toFixed(2)+" lon:"+parseFloat(lon).toFixed(2);
    };
    this.received = function (state,data,status,reqId) {
	//console.log("Received response '"+status+"' for request '",reqId,"'");
	if (status === "success") {
	    var req=this.requests[reqId];
	    // update info
	    this.setInfo(req.events[req.current].dtg,
			 req.location.latitude,
			 req.location.longitude);
	    // update data
	    //var d=new Date();
	    //var tnow=d.getTime();
	    console.log("data",data);
	    var ss=data.getElementsByTagName("solarsystem")[0];
	    var error=ss.getElementsByTagName("Error")[0];
	    var bod,name;
	    if (error === null) {
		// store initial data
		// var loc=ss.getElementsByTagName("location")[0];
		// store initial data
		var ini=ss.getElementsByTagName("initial")[0];
		var inibod=ini.getElementsByTagName("body");
		var inino=ini.getAttribute("no");
		req["initial"]={};
		var ii;
		for (ii=0; ii<inino; ii++) {
		    bod=inibod[ii];
		    name=bod.getAttribute("name");
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
		//console.log("Times ",tisno);
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
			    bod=stabod[ii];
			    name=bod.getAttribute("name");
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
	    } else {
		// we never receive data, stop processing here...
	    }
	    //console.log("Requests:",JSON.stringify(this.requests));
	} else {
	    //console.log("Request failed.");
	}
    };
    this.pushUrl = function (state) {
	var reqId=this.requests.current;
	var req = this.requests[reqId]
	if ( req.elements) { // we have a target
	    var reqLocation=this.requests[reqId]["location"];
	    if (reqLocation !== undefined && this.stack.state[this.stack.current] !== undefined) {
		var lat=reqLocation.latitude;
		var lon=reqLocation.longitude;
		var dtg=this.stack.state[this.stack.current].dtg;
		var dir=this.camera.getDir();
		var fov=this.camera.getFovX();
		var con=this.consReq;
		var play=(this.stack.play.speed||0);
		var hrs=(this.stack.play.hrs||1);
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
		if (play !== undefined) {
		    if (first) {url=url+"?";first=false;} else {url=url+"&";};
		    url=url + "play=" + play;
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
	if (this.stack.play !== undefined) {
	    var tnow=(new Date()).getTime();
	    if (this.stack.play.speed === undefined) { // start simulation first time
		this.stack.play.speed = 1.0;
		this.stack.play.e0 = tnow;
		this.stack.play.m0 = (new Date(this.stack.state[this.stack.current].epoch)).getTime();
	    } else if (this.stack.play.halt === undefined){ // stop running simulation, store time
		this.stack.play.m0 = this.stack.play.m0 + (tnow-this.stack.play.e0)*this.stack.play.speed;
		this.stack.play.e0 = tnow;
		this.stack.play.halt = this.stack.play.speed;
		this.stack.play.speed = 0.0;
	    } else  { // start stopped simulation
		this.stack.play.e0 = tnow;
		this.stack.play.speed = this.stack.play.halt;
		this.stack.play.halt=undefined;
	    }
	}
    };
    // check if we have a new request to process.
    this.processNewRequests = function (state) {
	var ret=false;
	var reqId=this.requests.current;
	var req = this.requests[reqId]
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
    // update 3D stack of the solar system...
    this.stackUpdate = function (state) {
	var ret = false;
	var reqId = this.requests.current;
	var req = this.requests[reqId]
	if (req.elements & this.stack.reqId !== reqId ) { // process new request
	    //console.log("Constructing stack from orbital elements.");
	    // get times
	    this.stack.epochs = [];
	    for ( var tt = 0; tt < req["events"].length; tt++) {
		this.stack.epochs[tt]=req["events"][tt]["epoch"];
	    };
	    this.stack.play={};
	    if (req.play.event !== undefined) {
		this.stack.play.event=req.play.event;
	    };
	    if (req.play.speed !== undefined) {
		var tnow=(new Date()).getTime();
		this.stack.play.speed=req.play.speed;
		if (req.play.m0 !== undefined) {
		    this.stack.play.m0=req.play.m0;
		} else {
		    this.stack.play.m0=tnow;
		};
		this.stack.play.e0=tnow;
		if (this.stack.play.speed > 0 ) {
		    this.stack.play.halt=undefined;
		} else {
		    this.stack.play.halt=1.0;
		};
	    }
	    this.stack.young=(this.stack.current+1)%2;
	    if (this.getState(state,req,this.stack.state[this.stack.young])) {
		this.stack.old=this.stack.current;
		this.stack.current=this.stack.young;
		if (this.stack.state[this.stack.old]["bodies"] !== undefined) {
		    // "tween" stack from oldState to newState
		};
		//  point camera
		if (req.play.event !== undefined) {
		    this.stack.state[this.stack.current].dtg = new Date(this.requests[reqId]["events"][req.play.event]["dtg"]).toISOString();
		    this.camera.position.copy(this.stack.state[this.stack.current].observer.position);
		    this.camera.setUp(this.stack.state[this.stack.current].observer.zenith); // up is always towards observer zenith...
		    var target = this.requests[reqId]["events"][req.play.event]["target"]; // target could be mis-spelled...
		    var dir = this.requests[reqId]["events"][req.play.event]["dir"];
		    var fov = this.requests[reqId]["events"][req.play.event]["fov"];
		    var con = this.requests[reqId]["events"][req.play.event]["con"];
		    var stackBodies=this.stack.state[this.stack.current].bodies;
		    if (target !== undefined && stackBodies[target] !== undefined) {
			this.camera.pointAt(stackBodies[target].position);
		    } else if (dir !== undefined) {
			this.camera.pointDir(dir);
		    };
		    if (fov !== undefined) {
			this.camera.setFovX(fov);
		    };
		    if (con !== undefined) {
			if (con === 0) { // no constellations
			    this.consTime=new Date().getTime()-1000.0; // no fade
			} else {
			    this.consTime=new Date().getTime()+2000.0; // fade inn
			};
			this.consReq = con;
		    };
		}
		// delete old requests
		for (var key in this.requests) {
		    if (this.requests.hasOwnProperty(key)) {
			if (key !== this.stack.old & this.requests[key]["events"] !== undefined) {
			}
		    }
		}
		this.reqId=reqId;
	    };
	    req.orbit = false;
            this.setInfo(this.stack.state[this.stack.current].dtg,
				  this.stack.state[this.stack.current].lat,
				  this.stack.state[this.stack.current].lon);
	    this.stackRedraw=true;
	} else if (req.elements & this.stack.play.speed!==undefined) { // time lapse...
	    //console.log("Time lapse.",stack.play.speed);
	    this.stack.young=(this.stack.current+1)%2;
	    if (this.getState(state,req, this.stack.state[this.stack.young])) {
		Request.setInfo(this.stack.state[this.stack.current].dtg,
				this.stack.state[this.stack.current].lat,
				this.stack.state[this.stack.current].lon);
		this.stack.old=this.stack.current;
		this.stack.current=this.stack.young;
		this.stackRedraw=true;
	    }
	    //    } else {
	    //	console.log("Nothing to do:",req.elements,stack.play.speed);
	}
	return ret;
    };
    this.getState = function (state,req, newstack){
	var ret=true;
	var tnow=(new Date()).getTime();
	if (this.stack.play.speed !== undefined) { // propagate state to right epoch using elliptical orbits
	    var ttrg = (tnow-this.stack.play.e0) * this.stack.play.speed + this.stack.play.m0;
	    newstack.lat=req.location.latitude;
	    newstack.lon=req.location.longitude;
	    this.stack.play.prev=-1;
	    this.stack.play.next=-1;
	    this.stack.play.prevEpoch=0;
	    this.stack.play.nextEpoch=0;
	    // find correct epoch
	    for ( var tt = 0; tt < req["events"].length; tt++) {
		if (req["events"][tt]["epoch"] <= ttrg &  
		    (this.stack.play.prev < 0 || req["events"][tt]["epoch"] >=  this.stack.play.prevEpoch)) {
		    this.stack.play.prev=tt;
		    this.stack.play.prevEpoch=req["events"][this.stack.play.prev]["epoch"];
		};
		if (req["events"][tt]["epoch"] >= ttrg &  
		    (this.stack.play.next < 0 || req["events"][tt]["epoch"] <=  this.stack.play.nextEpoch)) {
		    this.stack.play.next=tt;
		    this.stack.play.nextEpoch=req["events"][this.stack.play.next]["epoch"];
		};
	    };
	    if (this.stack.play.prev !== -1 & this.stack.play.next !== -1) { // success!
		var dt = ttrg-this.stack.play.prevEpoch;
		var dt0 = this.stack.play.nextEpoch - this.stack.play.prevEpoch;
		var f = dt/Math.max(1e-10,dt0);
		this.interpolateBodies(req["events"][this.stack.play.prev],req["events"][this.stack.play.next],dt,f,newstack.bodies);
		this.interpolateObserver(req["events"][this.stack.play.prev],req["events"][this.stack.play.next],dt,f,newstack.observer,newstack.bodies);
		newstack.epoch = ttrg;
		newstack.dtg=new Date(newstack.epoch).toISOString();
	    } else if (this.stack.play.prev !== -1 ) {  // found epoch before, but not after
		this.getBodies(req["events"][this.stack.play.prev],newstack.bodies);
		this.getObserver(req["events"][this.stack.play.prev],newstack.observer,newstack.bodies);
		newstack.epoch = req["events"][this.stack.play.prev].epoch;
		newstack.dtg=new Date(newstack.epoch).toISOString();
	    } else if (this.stack.play.next !== -1) {  // found epoch before, but not after
		this.getBodies(req["events"][this.stack.play.next],newstack.bodies);
		this.getObserver(req["events"][this.stack.play.next],newstack.observer,newstack.bodies);
		newstack.epoch = req["events"][this.stack.play.next].epoch;
		newstack.dtg=new Date(newstack.epoch).toISOString();
	    } else {
		//console.log("Times:",+ttrg,"|",+this.stack.play.e0 ,"|",+this.stack.play.speed, "|",+this.stack.play.m0);
		console.log("Unable to find interval:",+ttrg,req["events"]);
		ret=false;
	    }
	    //console.log("Pos:",+ttrg,req["events"][0]," REQ:",this.stack.play.prev,this.stack.play.next," DTG:",newstack.dtg,this.stack.play.prev,this.stack.play.next);
	} else {
	    //console.log("******************getState fixed: ",newStack);
	    this.getBodies(req["events"][this.stack.play.event],newstack.bodies);
	    this.getObserver(req["events"][this.stack.play.event],newstack.observer,newstack.bodies);
	    newstack.epoch = req["events"][this.stack.play.event].epoch;
	    newstack.dtg=new Date(newstack.epoch).toISOString();
	    newstack.lat=req.location.latitude;
	    newstack.lon=req.location.longitude;
	}
	//console.log("******************getState: ",newStack);
	return ret;
    };
    this.getBodies = function (state,reqState,stackBodies) {
	for (var name in reqState["state"]) {
	    var reqBody = reqState["state"][name];
	    if (stackBodies[name] === undefined) {
		stackBodies[name]={position:new Vector3(),rotation:new Vector3()};
	    };
	    //console.log("getStackBodies State:",state,s,name);
	    stackBodies[name].position.copy(reqBody.position);
	    stackBodies[name].position.vx = +reqBody.position.vx;
	    stackBodies[name].position.vy = +reqBody.position.vy;
	    stackBodies[name].position.vz = +reqBody.position.vz;
	    stackBodies[name].rotation.ra = +reqBody.rotation.ra;
	    stackBodies[name].rotation.dec = +reqBody.rotation.dec;
	    stackBodies[name].rotation.w = +reqBody.rotation.w;
	    stackBodies[name].rotation.lon = stackBodies[name].rotation.ra;
	    stackBodies[name].rotation.lat = stackBodies[name].rotation.dec;
	    stackBodies[name].rotation.r = 1.0;
	    stackBodies[name].rotation.spherical2cartesian();
	    stackBodies[name].name=name;
	} 
    }
    this.interpolateBodies = function (state,reqStatePrev,reqStateNext,dt,f,stackBodies) {
	for (var name in reqStatePrev["state"]) {
	    var reqPrev = reqStatePrev["state"][name];
	    var reqNext = reqStateNext["state"][name];
	    if (stackBodies[name] === undefined) {
		stackBodies[name]={position:new Vector3(),rotation:new Vector3()};
	    };
	    stackBodies[name].position.interpolate(reqPrev.position,reqNext.position,f);
	    stackBodies[name].position.vx =  this.intlin(reqPrev.position.vx,reqNext.position.vx,f);
	    stackBodies[name].position.vy =  this.intlin(reqPrev.position.vy,reqNext.position.vy,f);
	    stackBodies[name].position.vz =  this.intlin(reqPrev.position.vz,reqNext.position.vz,f);
	    stackBodies[name].rotation.ra =  this.intlin(reqPrev.rotation.ra,reqNext.rotation.ra,f);
	    stackBodies[name].rotation.dec = this.intlin(reqPrev.rotation.dec,reqNext.rotation.dec,f);
	    stackBodies[name].rotation.w =   this.intlin(reqPrev.rotation.w,reqNext.rotation.w,f);
	    stackBodies[name].rotation.lon = stackBodies[name].rotation.ra;
	    stackBodies[name].rotation.lat = stackBodies[name].rotation.dec;
	    stackBodies[name].rotation.r = 1.0;
	    stackBodies[name].rotation.spherical2cartesian();
	    stackBodies[name].name=name;
	} 
    };
    // get observer position and EF-coordinate system...
    this.getObserver = function (state,reqState,stackObserver,stackBodies) { 
	if (stackObserver.position === undefined) stackObserver.position=new Vector3(); 
	if (stackObserver.i === undefined) stackObserver.i=new Vector3(); 
	if (stackObserver.j === undefined) stackObserver.j=new Vector3(); 
	if (stackObserver.k === undefined) stackObserver.k=new Vector3(); 
	if (stackObserver.zenith === undefined) stackObserver.zenith=new Vector3(); 
	var reqObserver=reqState["observer"];
	var reqOrigo=reqObserver.position.origo;
	if (stackBodies[reqOrigo] === undefined ) {
	    stackObserver.position.copy(reqObserver.position);
	} else {
	    stackObserver.position.origo=reqOrigo;
	    stackObserver.position.copy(reqObserver.position).add(stackBodies[reqOrigo].position);
	}
	stackObserver.zenith.copy(reqObserver.zenith);
	stackObserver.zenith.normalize();
	stackObserver.i.copy(reqObserver.i);
	stackObserver.j.copy(reqObserver.j);
	stackObserver.k.copy(reqObserver.k);

	//console.log("setting axis:", stackObserver.i.x,stackObserver.i.y,stackObserver.i.z);
    };
    // get observer position and EF-coordinate system...
    this.interpolateObserver = function (state,reqStatePrev,reqStateNext,dt,f,stackObserver,stackBodies) { 
	if (stackObserver.position === undefined) stackObserver.position=new Vector3(); 
	if (stackObserver.i === undefined) stackObserver.i=new Vector3(); 
	if (stackObserver.j === undefined) stackObserver.j=new Vector3(); 
	if (stackObserver.k === undefined) stackObserver.k=new Vector3(); 
	if (stackObserver.zenith === undefined) stackObserver.zenith=new Vector3();
	var reqPrev = reqStatePrev["observer"];
	var reqNext = reqStateNext["observer"];
	var reqOrigo=reqPrev.position.origo;
	if (stackBodies[reqOrigo] === undefined ) {
	    stackObserver.position.interpolate(reqPrev.position, reqNext.position, f);
	} else {
	    stackObserver.position.origo=reqOrigo;
	    stackObserver.position.interpolate(reqPrev.position, reqNext.position, f);
	    stackObserver.position.add(stackBodies[reqOrigo].position);
	}
	stackObserver.zenith.interpolate(reqPrev.zenith,reqNext.zenith,f);
	stackObserver.zenith.normalize();
	stackObserver.i.interpolate(reqPrev.i,reqNext.i,f);
	stackObserver.j.interpolate(reqPrev.j,reqNext.j,f);
	stackObserver.k.interpolate(reqPrev.k,reqNext.k,f);

	//console.log("setting axis:", stackObserver.i.x,stackObserver.i.y,stackObserver.i.z);
    };
    this.interpolateBodies2 = function(req,dt,f,stackBodies) {
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
	    stackBodies[name]={position:new Vector3(),
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
		
		var r=stackBodies[main];
		var xmu=req["initial"][main]["xmu"];
		this.elements2state(stackBodies[name], el, r, xmu);
		//console.log("Prev elements:",ep);
		//console.log("Next elements:",en);
		//console.log("Intp elements:",el);
		//console.log("State main:",r,xmu);
		//console.log("State elements:",stackBodies[name]);
	    } else { // no orbit available, interpolate state directly
		stackBodies[name].position.set( this.intlin(reqStatePrev[name].position.x,reqStateNext[name].position.x,f),
						this.intlin(reqStatePrev[name].position.y,reqStateNext[name].position.y,f),
						this.intlin(reqStatePrev[name].position.z,reqStateNext[name].position.z,f));
		stackBodies[name].position.vx = this.intlin(reqStatePrev[name].position.vx,reqStateNext[name].position.vx,f);
		stackBodies[name].position.vy = this.intlin(reqStatePrev[name].position.vy,reqStateNext[name].position.vy,f);
		stackBodies[name].position.vz = this.intlin(reqStatePrev[name].position.vz,reqStateNext[name].position.vz,f);
		//console.log("StackBodies fixed:",stackBodies[name].position);
	    };
	    stackBodies[name].rotation.ra =    this.intlin(reqStatePrev[name].ra,reqStateNext[name].ra,f);
	    stackBodies[name].rotation.dec =   this.intlin(reqStatePrev[name].dec,reqStateNext[name].dec,f);
	    stackBodies[name].rotation.w =     this.intlin(reqStatePrev[name].w,reqStateNext[name].w,f);
	    stackBodies[name].rotation.lon = stackBodies[name].rotation.ra;
	    stackBodies[name].rotation.lat = stackBodies[name].rotation.dec;
	    stackBodies[name].rotation.r = 1.0;
	    stackBodies[name].rotation.spherical2cartesian();
	    stackBodies[name].name=name;
	}
    };
    // interpolate observer position and EF-coordinate system...
    this.interpolateObserver2 = function(req,dt,f,stackObserver) {
	if (stackObserver.position === undefined) stackObserver.position=new Vector3(); 
	if (stackObserver.i === undefined) stackObserver.i=new Vector3(); 
	if (stackObserver.j === undefined) stackObserver.j=new Vector3(); 
	if (stackObserver.k === undefined) stackObserver.k=new Vector3(); 
	if (stackObserver.zenith === undefined) stackObserver.zenith=new Vector3(); 
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

	//console.log("*** stackObserver:",stackObserver);

	if (stackObserver[origo] === undefined ) {
	    stackObserver.position.copy(pos);
	} else {
	    stackObserver.position.copy(pos).add(stackObserver[origo].position);
	    //console.log("**** Body origo:",reqObsPrev.position.x,reqObsPrevos.x,stackObserver[origo].x,origo);
	}
	//console.log("**** Interpolating observer:",stackObserver.x,stackObserver.y,stackObserver.z);
	if (stackObserver.i === undefined) stackObserver.i=new Vector3(); 
	pos.set(reqObsPrev.i.x,reqObsPrev.i.y,reqObsPrev.i.z);
	pos.applyQuaternion(q);
	stackObserver.i.copy(pos);
	if (stackObserver.j === undefined) stackObserver.j=new Vector3(); 
	pos.set(reqObsPrev.j.x,reqObsPrev.j.y,reqObsPrev.j.z);
	pos.applyQuaternion(q);
	stackObserver.j.copy(pos);
	if (stackObserver.k === undefined) stackObserver.k=new Vector3(); 
	pos.set(reqObsPrev.k.x,reqObsPrev.k.y,reqObsPrev.k.z);
	pos.applyQuaternion(q);
	stackObserver.k.copy(pos);
    };
    this.modelUpdate = function (state) {
	var ret = false;
	var reqId=this.requests.current;
	var req = this.requests[reqId]
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
		    if (key !== this.model.old & this.requests[key]["events"] !== undefined) {
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
