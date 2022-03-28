//import Vector2 from './Vector2Lib';
import Vector3 from './Vector3Lib';
//import * as TWEEN from './tween';
import * as THREE from 'three';
import moment from 'moment';

console.log("Loading ModelLib");

function Model() { 
    // This object maintains the state while drawing is done in state.React.Model,
    // use the following flags to communicate changes in state...
    this.bdeb=false;
    this.initialised=false;
    this.redraw={backdrop:false,
		 bodies:false,
		 model:false,
		 controls:false,
		 config:false};
    // other data...
    this.deg2rad = Math.PI/180.0;
    this.controlsRedraw=false; 
    this.redraw = true;
    // update 3D model of the solar system...
    this.scenes={};
    this.controls=undefined;
    this.consTime = (new moment().valueOf())-10000.0;
    this.consReq = 0;
    this.lastCon = 0;
    this.lastTime = (new moment().valueOf())-10000.0;
    this.seq=0;
    // time is contained in Events: targettime=state.Events.getModelTime(state)
    // new requests are pushed to "this.requests"
    // events are updated async with body state
    // downloaded events are put into the stack
    // the config contains the state interpolated from the stack
    this.requests = {state:[]};
    this.stack={};
    this.config = { reqId : -1,
		    event : 0,
		    bodies:{},
		    observer:{},
		    epochs:[],
		    dtgs:[],
		    newTarget : false,
		  };
    this.AU = 149597870;
    // xmu = G * Mass
    this.xmu = { sun     : 132712440018.0,
		 Mercury :        22032.0,
		 Venus   :       324859.0,
		 Earth   :       398601.3,
		 Mars    :        42828.0,
		 Ceres   :           63.0,
		 Jupiter :    126686534.0,
		 Saturn  :     37931187.0,
		 Uranus  :      5793947.0,
		 Neptune :      6836529.0,
		 Pluto   :         1001.0 
	       };
    this.MU= {sun:1.32712440018e11, // gravitational constant (μ) km3/s2, gaussian - k = 0.01720209895 rad/day, //
	      mercury:	2.2032e4,
	      venus:	3.24859e5,
	      earth:	3.986004418e5,
	      moon:	4.9048695e3,
	      mars:	4.282837e4,
	      ceres:	6.26325e1,
	      jupiter:	1.26686534e8,
	      saturn:	3.7931187e7,
	      uranus:	5.793939e6,
	      neptune:	6.836529e6,
	      pluto:	8.71e2,
	      eris:	1.108e3};
    // satellites with analytical orbits...
    this.orbits = [
	{name:"phobos",
	 rotation: {ra:0.0, dec:90.0,w0:0.0,dwdt:0.001},
	 orbit:{
	     around:"mars",
	     a : 55989, // semi-major axis
	     e : 0.0554, // eccentricity
	     i : 5.16*this.deg2rad,   // inclination
	     w : 318.15*this.deg2rad, // argument of periapsis
	     m0: 135.27*this.deg2rad, // mean anomaly at epoch
	     o : 125.08*this.deg2rad  // longitude of ascending node
	 }},
	{name:"deimos",
	 rotation: {ra:0.0, dec:90.0,w0:0.0,dwdt:0.001},
	 orbit:{
	     around:"mars",
	     a : 23463.2, // semi-major axis
	     e : 0.00033, // eccentricity
	     i : 0.93*this.deg2rad,   // inclination
	     w : 318.15*this.deg2rad, // argument of periapsis
	     m0: 135.29*this.deg2rad, // mean anomaly at epoch
	     o : 125.08*this.deg2rad  // longitude of ascending node
	 }},
	{name:"charon",
	 rotation: {ra:0.0, dec:90.0,w0:0.0,dwdt:0.001},
	 orbit:{
	     around:"pluto",
	     a : 19591.4, // semi-major axis
	     e : 0.0002, // eccentricity
	     i : 0.08*this.deg2rad,   // inclination
	     w : 318.15*this.deg2rad, // argument of periapsis
	     m0: 135.27*this.deg2rad, // mean anomaly at epoch
	     o : 125.08*this.deg2rad  // longitude of ascending node
	 }},
	{name:"mercury",
	 rotation:{ra:0.0, dec:90.0,w0:0.0,dwdt:0.001},
	 orbit : { 
	     a:0.38709927*this.AU , // semi-major axis
	     e : 0.20563593,        // eccentricity
	     i: 7.00497902*this.deg2rad,         // inclination
	     l : 252.25032350*this.deg2rad,      // mean longitude
	     lp : 77.45779628*this.deg2rad,      // longitude of perihelion
	     o : 48.33076593*this.deg2rad        // longitude of ascending node
	 },
	 cydrift : {a : 0.00000037 * this.AU ,
		    e : 0.00001906,
		    i: -0.00594749*this.deg2rad,
		    l : 149472.67411175*this.deg2rad,
		    lp : 0.16047689*this.deg2rad,
		    o : -0.12534081*this.deg2rad}},
	{name:"venus",
	 rotation:{ra:0.0, dec:90.0,w0:0.0,dwdt:0.001},
	 orbit : { 
	     a : 0.72333566 * this.AU ,
	     e : 0.00677672,
	     i: 3.39467605*this.deg2rad,
	     l : 181.97909950*this.deg2rad,
	     lp : 131.60246718*this.deg2rad,
	     o : 76.67984255*this.deg2rad
	 },
	 cydrift:{a : 0.00000390 * this.AU ,
		  e : -0.00004107,
		  i: -0.00078890*this.deg2rad,
		  l : 58517.81538729*this.deg2rad,
		  lp : 0.00268329*this.deg2rad,
		  o : -0.27769418*this.deg2rad}},
	{name:"earth",
	 rotation:{ra:0.0, dec:90.0,w0:0.0,dwdt:0.001},
	 orbit: {
	     a : 1.00000261 * this.AU,
	     e : 0.01671123,
	     i : -0.00001531*this.deg2rad,
	     l : 100.46457166*this.deg2rad,
	     lp : 102.93768193*this.deg2rad,
	     o : 0.0
	 },
	 cydrift: {a : 0.00000562 * this.AU,
		   e : -0.00004392,
		   i : -0.01294668*this.deg2rad,
		   l : 35999.37244981*this.deg2rad,
		   lp : 0.32327364*this.deg2rad,
		   o : 0.0*this.deg2rad
		  }},
	{name:"mars",
	 rotation:{ra:0.0, dec:90.0,w0:0.0,dwdt:0.001},
	 orbit: {
	     a : 1.52371034 * this.AU ,
	     e : 0.09339410,
	     i: 1.84969142*this.deg2rad,
	     l : -4.55343205*this.deg2rad,
	     lp : -23.94362959*this.deg2rad,
	     o : 49.55953891*this.deg2rad
	 },
	 cydrift: {a : 0.00001847 * this.AU ,
		   e : 0.00007882,
		   i: -0.00813131*this.deg2rad,
		   l : 19140.30268499*this.deg2rad,
		   lp : 0.44441088*this.deg2rad,
		   o : -0.29257343*this.deg2rad
		  }},
	{name:"jupiter",
	 rotation:{ra:0.0, dec:90.0,w0:0.0,dwdt:0.001},
	 orbit: {
	     a : 5.20288700 * this.AU ,
	     e : 0.04838624,
	     i: 1.30439695*this.deg2rad,
	     l : 34.39644051*this.deg2rad,
	     lp : 14.72847983*this.deg2rad,
	     o : 100.47390909*this.deg2rad
	 },
	 cydrift: {a : -0.00011607 * this.AU ,
		   e : -0.00013253,
		   i: -0.00183714*this.deg2rad,
		   l : 3034.74612775*this.deg2rad,
		   lp : 0.21252668*this.deg2rad,
		   o : 0.20469106*this.deg2rad
		  }},
	{name:"saturn",
	 rotation:{ra:0.0, dec:90.0,w0:0.0,dwdt:0.001},
	 orbit: {
	     a : 9.53667594 * this.AU ,
	     e : 0.05386179,
	     i: 2.48599187*this.deg2rad,
	     l : 49.95424423*this.deg2rad,
	     lp : 92.59887831*this.deg2rad,
	     o : 113.66242448*this.deg2rad
	 },
	 cydrift: {a : -0.00125060 * this.AU ,
		   e : -0.00050991,
		   i: 0.00193609*this.deg2rad,
		   l : 1222.49362201*this.deg2rad,
		   lp : -0.41897216*this.deg2rad,
		   o : -0.28867794*this.deg2rad
		  }},
	{name:"uranus",
	 rotation:{ra:0.0, dec:90.0,w0:0.0,dwdt:0.001},
	 orbit: {
	     a : 19.18916464 * this.AU ,
	     e : 0.04725744,
	     i: 0.77263783*this.deg2rad,
	     l : 313.23810451*this.deg2rad,
	     lp : 170.95427630*this.deg2rad,
	     o : 74.01692503*this.deg2rad
	 },
	 cydrift: {a : -0.00196176 * this.AU ,
		   e : -0.00004397,
		   i: -0.00242939*this.deg2rad,
		   l : 428.48202785*this.deg2rad,
		   lp : 0.40805281*this.deg2rad,
		   o : 0.04240589*this.deg2rad
		  }},
	{name:"neptune",
	 rotation:{ra:0.0, dec:90.0,w0:0.0,dwdt:0.001},
	 orbit: {
	     a : 30.06992276  * this.AU,
	     e : 0.00859048,
	     i: 1.77004347*this.deg2rad,
	     l : -55.12002969*this.deg2rad,
	     lp : 44.96476227*this.deg2rad,
	     o : 131.78422574*this.deg2rad
	 },
	 cydrift: {a : 0.00026291  * this.AU,
		   e : 0.00005105,
		   i: 0.00035372*this.deg2rad,
		   l : 218.45945325*this.deg2rad,
		   lp : -0.32241464*this.deg2rad,
		   o : -0.00508664*this.deg2rad
		  }},
	{name:"pluto",
	 rotation:{ra:0.0, dec:90.0,w0:0.0,dwdt:0.001},
	 orbit: {
	     a : 39.48211675 * this.AU ,
	     e : 0.24882730,
	     i: 17.14001206*this.deg2rad,
	     l : 238.92903833*this.deg2rad,
	     lp : 224.06891629*this.deg2rad,
	     o : 110.30393684*this.deg2rad
	 },
	 cydrift: {a : -0.00031596 * this.AU ,
		   e : 0.00005170,
		   i: 0.00004818*this.deg2rad,
		   l : 145.20780515*this.deg2rad,
		   lp : -0.04062942*this.deg2rad,
		   o : -0.01183482*this.deg2rad
		  }},
	{name:"deathstar",
	 rotation: {ra:0.0, dec:90.0,w0:0.0,dwdt:-0.001},
	 orbit:{
	     around:"saturn",
	     x:-100000,
	     y:20000,
	     z:20000}}
    ];
    this.hello=function () {
	console.log("Hello world!");
    };
    this.init = function (state) {
	for (var key in this.redraw) {
	    if (this.redraw.hasOwnProperty(key)) {
		this.redraw[key]=true;
	    }
	};
	// make standard orbital parameters
	this.orbits.forEach((sat,i) => {
	    this.standardOrbit(state,sat);
	});
	this.initialised=true;
    }
    this.getOrbits=function(state) {
	return state.Model.orbits;
    };
    this.getCurrentConfig = function (state) {
	var ttrg=state.Events.getModelTime(state); // current target time
	//
	//this.requestAnimFrame(this.update);
	var config=undefined;
	this.nowMsec=new moment().valueOf();
	//if (this.lastMsec === undefined) {this.lastTime=this.nowMsec;};
	//var deltaMsec   = Math.min(200, this.nowMsec - this.lastMsec)
	if (this.tweentime > this.nowMsec) {
	    //TWEEN.update();
	    this.redraw=true;
	} else {
	    // if (this.controlsUpdate()) { this.step=0;};
	    // if (this.controlsRedraw) {
	    // 	this.controlsRedraw=false;
	    // 	this.redraw=true;
	    // };
	}
	this.sendRequests(state);
	if (this.completeRequests(state)) { 
	    this.offzoom(0.5);
	    this.step=0;
	};
	this.cleanRequests(state);	
	//if (this.step === 0) {
	this.updateConfig(state,ttrg);
	 if (state.React !== undefined && state.React.Model !== undefined) {
	     config=this.config;
	 };
	//console.log("Config:",ttrg,JSON.stringify(config));
	//var dir=config.observer.zenith;
	//if (dir !== undefined) {
	//    console.log("Zenith:",dir.x,dir.y,dir.z);
	//};
	return  config;
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
	if (state.React !== undefined && state.React.Model !== undefined) {
	    console.log("Update scene..");
	    state.Scene.defined=true;
	} else {
	    state.Scene.defined=false;
	}
    };
    this.play  = function (state) {
	//this.play();
    };
    this.pushUrl  = function (state) {
	//this.pushUrl();
    };
    this.toggleConstellations  = function (state) {
	this.consTime=new moment().valueOf();
	this.consReq = (+this.consReq+1)%2;
    };
    this.toggleFullScreen  = function () {
	var pos=0;
	if (!document.fullscreenElement &&    // alternative standard method
	    !document.mozFullScreenElement && !document.webkitFullscreenElement &&
	    !document.msFullscreenElement ) {  // current working methods
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
    this.setDefaults=function(state,cfg) {
	if (cfg===undefined){cfg={};};
	cfg.lat=cfg.lat || state.Events.getLat(state);
	cfg.lon=cfg.lon || state.Events.getLon(state);
	cfg.epoch=cfg.epoch;
	cfg.hrs=Math.max(0,Math.min(24,(cfg.hrs || 24)));
	cfg.label=cfg.label || "";
	cfg.target=cfg.target;
	cfg.fov=cfg.fov;
	cfg.dir=cfg.dir;
	cfg.con=cfg.con || 0;
	cfg.speed=cfg.speed;	
	return cfg;
    };
    this.cleanStack=function(state,stack,target) {
	var ttrg=state.Events.getModelTime(state); // current target time
	let events=stack.events.filter(function (event) {
	    return (Math.abs(event.epoch - target) < 86400*1000 ||  // new time
		    Math.abs(event.epoch - ttrg)  < 86400*1000 );  // old time
	});
	events.sort(function(a, b) {
	    return a.epoch - b.epoch;
	});
	var index=-1;
	stack.dtgs=[];
	stack.epochs=[];
	events.forEach( (event,ind) => {
	    stack.dtgs.push(event.dtg);
	    stack.epochs.push(event.epoch);
	    if (event.epoch === target) {index=stack.epochs.length-1;}
	});
	stack.events=events;
	stack.epoch=target;
	stack.event=stack.epochs.indexOf(target);
    };
    this.cleanRequests=function(state) {
	// remove garbage from request queue, keep current and target, returns new target
	var now=new moment().valueOf();
	var state=[];
	var current=undefined;
	//console.log("Cleaning all:",this.requests.state.length);
	this.requests.state.forEach((req,id) => {
	    var iscurrent= (this.requests.current === id);
	    //console.log("Cleaning:",id,other,now-req.sent,now-req.used,req.sent,req.received,req.processed);
	    if (req.sent !== undefined && 
		now-req.sent > 6*1000 &&
		req.received === undefined) {
		console.log("Stale request found:",id,now-req.sent);
	    } else if (req.processed!==undefined) {
		//console.log("Inactive request found:",id,now-req.used);
	    } else {
		//console.log("Found valid request:",id,now-req.used, req.received,req.processed);
		state.push(req);
		if (iscurrent) {current=state.length-1;};
	    }
	});
	this.requests.state=state;
	this.requests.current=current;
    };
    this.getRequest=function(state,reqId) {
	if (this.requests.state !== undefined && reqId !== undefined && reqId >= 0 )  {
	    var req=this.requests.state[reqId];
	    return req;
	} else {
	    return;
	};
    };
    this.getRequestId=function(state,cfg) {
	var reqId=undefined;
	// check if there is a request with similar config...
	if (this.requests.state !== undefined) {
	    this.requests.state.forEach((req,id) => {
		var ll=req.location;
		var rr=req.events[req.event];
		// console.log("Checking...",id,		
		// 		cfg.lat===ll.latitude,
		// 		cfg.lon===ll.longitude,
		// 		cfg.epoch===rr.epoch,
		// 		cfg.target===rr.target,
		// 		cfg.fov===rr.fov,
		// 		cfg.dir===rr.dir,
		// 		cfg.con===rr.con,ll,rr,cfg);
		if (req.sent !== undefined &&
		    req.received !== undefined &&
		    req.processed !== undefined &&
		    cfg.lat===ll.latitude &&
		    cfg.lon===ll.longitude &&
		    cfg.epoch===rr.epoch &&
		    cfg.target===rr.target &&
		    cfg.fov===rr.fov &&
		    cfg.dir===rr.dir &&
		    cfg.con===rr.con
		   ) {
		    req.used= new moment().valueOf();
		    req.seq=++this.seq;
		    //console.log("Found match...",id,cfg);
		    reqId=id;
		};
	    });
	};
	return reqId;
    };
    this.launch= function (state,cfg) {
	cfg=this.setDefaults(state,cfg);
	// check if request is already launched...
	var reqId=this.getRequestId(state,cfg);
	if (reqId !== undefined) { 
	    let req=this.getRequest(state,reqId);
	    if (req !== undefined &&
		req.sent !== undefined &&
		req.processed === undefined) {
		req.processed=new moment().valueOf();
		this.requests.current=reqId;
		return; // use old request...
	    };
	};
	if (cfg.lat===undefined) {cfg.lat=state.Events.getLat(state);}
	if (cfg.lon===undefined) {cfg.lat=state.Events.getLon(state);}
	if (cfg.epoch===undefined) {cfg.epoch=state.Events.getModelTime(state);}
	if (cfg.speed!==undefined) {state.Events.setSpeed(state,cfg.speed);}
	this.seq=this.seq+1;
	var dtgdate=new moment(cfg.epoch);
	var trg=dtgdate.toISOString();
	var dtgs=state.Utils.addHours(state,dtgdate,cfg.hrs,cfg.dir)
	var event=dtgs.indexOf(trg);
	//console.log("Hours:",dtgs,event);
	var dir=cfg.dir;
	if (dir !== undefined) { // direction in J2000 (the star coordinate system)
	    var items=dir.split(',');
	    if (items.length === 3) {
		dir = new Vector3(items[0],items[1],items[2]);
	    } else {
		console.log("Unable to interpred dir:",dir);
		dir=undefined;
	    }
	}
	var events=[];
	var epochs=[];
	for ( var tt = 0; tt < dtgs.length; tt++) {
	    let epoch=(new moment(dtgs[tt])).valueOf();
	    events.push({reqId : tt+1,
			 label: cfg.label,
			 target : cfg.target,
			 dir : dir,
			 fov : cfg.fov,
			 con : cfg.con,
			 dtg : dtgs[tt],
			 epoch:epoch
			});
	    epochs.push(epoch);
	};
	//epoch: dtgdate.getTime()
	var newreq={ location : {latitude : cfg.lat,
				 longitude : cfg.lon,
				 height : 0.0
				},
		     requested  : new moment().valueOf(),
		     sent: undefined,
		     received: undefined,
		     processed: undefined,
		     used:  new moment().valueOf(),  // when last used
		     seq:  this.seq,                 // sequence number
		     epochs: epochs,
		     event : event,
		     type  : cfg.type,
		     events : events // ,current:0
		   };
	this.requests.state.push(newreq);
	this.requests.current=this.requests.state.length-1;
	//if (this.bdeb) {
	//console.log("*** launching model:",this.seq,(new moment(cfg.epoch)).toISOString(), 
	//	    JSON.stringify(cfg),event);
	//};
    };
    this.sendRequests = function (state) {
	// if (this.requests.state===undefined) {
	//     this.requests.state=[];
	//     this.launch(state);
	//     console.log("Making default request...",this.request);
	// };
	this.requests.state.forEach((req,id) => {
	    if (req !== undefined && req.sent == undefined) { // we have a new target
		if (this.bdeb) {console.log("Sending new request.",req.seq);}
		this.sendRequest(state,req,[]);
		req.sent= new moment().valueOf();
	    }
	});
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
	    var dtgdate=new moment();
	    dtgs.push(dtgdate.toISOString());
	};
	req.addDtg(dtgs);
	req.wipe();
	//console.log("State-request :",req);
	return req;
    };
    this.sendRequest = function(state, req, callbacks) {
	if (this.bdeb) {console.log("Loading state.");};
	var par=this.getRequestPar(state,req);
	if (par !==undefined) {
	    var url="cgi-bin/state.pl";
	    var sequence = Promise.resolve();
	    sequence = sequence.then(
		function() {
		    return state.File.get(url,par);
		}
	    ).then(
		function(result) {
		    this.processResult(state,result,req);
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
    this.controlsUpdate = function (state) {
    };
    this.setInfo = function (state,dtg,lat,lon) {
	//var info=document.getElementById("info");
	//info.innerHTML = dtg+" lat:"+parseFloat(lat).toFixed(2)+" lon:"+parseFloat(lon).toFixed(2);
	//console.log(dtg+" lat:"+parseFloat(lat).toFixed(2)+" lon:"+parseFloat(lon).toFixed(2));
    };
    this.processResult = function (state,result,req) {
	if (this.bdeb) {console.log("Processing request ",req);};
	var xmlDoc;
	// update info
	this.setInfo(state,
		     req.events[req.event].dtg,
		     req.location.latitude,
		     req.location.longitude);
	// update data
	//var d=new moment();
	//var tnow=d.valueOf();
	var regex=/(<solarsystem[\s\S]*\/solarsystem>)/mg;
	var match=result.match(regex);
	if (match !== null && match.length > 0) {
	    if (window.DOMParser) {
		var parser = new DOMParser();
		xmlDoc = parser.parseFromString(result, "text/xml");
		try {
		    this.pushToStack(state,xmlDoc,req);
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
    this.pushToStack=function(state,data,req) {
	var ss=data.getElementsByTagName("solarsystem")[0];
	var error=ss.getElementsByTagName("Error");
	if (error.length === 0) {
	    // store initial data
	    // var loc=ss.getElementsByTagName("location")[0];
	    // store initial data
	    var ini=ss.getElementsByTagName("initial")[0];
	    var inibod=ini.getElementsByTagName("body");
	    var inino=ini.getAttribute("no");
	    var stack=this.getStack(state,req);
	    // work on copy in case other thread is using it
	    stack["initial"]={};
	    var changed=false;
	    var ii;
	    for (ii=0; ii<inino; ii++) { // this does not change....
		let bod=inibod[ii];
		let name=bod.getAttribute("name");
		stack["initial"][name]={};
		stack["initial"][name]["rotation"]={};
		stack["initial"][name]["rotation"]["ra"]=+bod.getAttribute("ra");
		stack["initial"][name]["rotation"]["dec"]=+bod.getAttribute("dec");
		stack["initial"][name]["rotation"]["w"]=+bod.getAttribute("w")*this.deg2rad;
		stack["initial"][name]["rotation"]["dwdt"]=+bod.getAttribute("dwdt")*this.deg2rad;
		stack["initial"][name]["main"]=bod.getAttribute("main");
		stack["initial"][name]["xmu"]=+bod.getAttribute("xmu");
		//console.log("Rotation:",name,req.initial[name].rotation,bod);
	    }
	    // store time data
	    var event=req.event; // target event
	    var target=req.epochs[req.event];
	    var tis=ss.getElementsByTagName("times")[0];
	    var tistim=tis.getElementsByTagName("time");
	    var tisno=tis.getAttribute("no");
	    //console.log("Times ",tisno);
	    for (var tt=0; tt<tisno; tt++) {
		var tim = tistim[tt];
		// store observer data
		var dtg  = tim.getAttribute("dtg");
		var dtg_ = req["events"][tt]["dtg"];
		var epoch_=(new moment(dtg_)).valueOf();// get epoch
		var epoch=req.events[tt].epoch;
		if (dtg !== dtg_ || epoch !== epoch_) { // check if dtg in reply matches dtg in request
		    console.log("Date mismatch: ",dtg," !== ",dtg_);
		} else if (stack.epochs.indexOf(epoch) === -1 ) { // does not exist already
		    changed=true;
		    var ss= stack.epochs.length;
		    if (stack.epochs.length !== stack.events.length) {
			console.log("Invalid stack:",stack,JSON.stringify(stack));
		    };
		    stack.epochs.push(epoch); // append to last
		    stack.events.push({}); // new dtg...
		    stack.events[ss].dtg=dtg;
		    stack.events[ss].epoch=epoch;
		    var jd2000=tim.getAttribute("jd2000");
		    // check if epoch already exists, otherwise push and later sort the stack
		    var obs=tim.getElementsByTagName("observer")[0];
		    var obsi=obs.getElementsByTagName("i")[0];
		    var obsj=obs.getElementsByTagName("j")[0];
		    var obsk=obs.getElementsByTagName("k")[0];
		    var obsloc=obs.getElementsByTagName("location")[0];
		    var obszen=obs.getElementsByTagName("zenith")[0];
		    var obs={};
		    obs["i"]=new Vector3();
		    obs["i"]["x"]=+obsi.getAttribute("x");
		    obs["i"]["y"]=+obsi.getAttribute("y");
		    obs["i"]["z"]=+obsi.getAttribute("z");
		    obs["j"]=new Vector3();
		    obs["j"]["x"]=+obsj.getAttribute("x");
		    obs["j"]["y"]=+obsj.getAttribute("y");
		    obs["j"]["z"]=+obsj.getAttribute("z");
		    obs["k"]=new Vector3();
		    obs["k"]["x"]=+obsk.getAttribute("x");
		    obs["k"]["y"]=+obsk.getAttribute("y");
		    obs["k"]["z"]=+obsk.getAttribute("z");
		    obs["position"]=new Vector3();
		    obs["position"]["x"]=+obsloc.getAttribute("x");
		    obs["position"]["y"]=+obsloc.getAttribute("y");
		    obs["position"]["z"]=+obsloc.getAttribute("z");
		    obs["position"]["origo"]=obsloc.getAttribute("origo");
		    obs["zenith"]=new Vector3();
		    obs["zenith"]["x"]=+obszen.getAttribute("x");
		    obs["zenith"]["y"]=+obszen.getAttribute("y");
		    obs["zenith"]["z"]=+obszen.getAttribute("z");
		    stack["events"][ss]["observer"]=obs;
		    var pointAt = req["events"][tt]["pointAt"];
		    stack.events[ss].pointId = -1;
		    var sta=tim.getElementsByTagName("state")[0];
		    var stabod=sta.getElementsByTagName("body");
		    var stano=sta.getAttribute("no");
		    stack.events[ss].state={};
		    for (ii=0; ii<stano; ii++) {
			let bod=stabod[ii];
			let name=bod.getAttribute("name");
			if (name === pointAt) {stack["events"][ss]["pointId"] = ii;}
			//console.log("Added state for ",name," at ",dtg);
			let body={"position":new Vector3(),"rotation":new Vector3()};
			body["position"]["x"]=+bod.getAttribute("x");
			body["position"]["y"]=+bod.getAttribute("y");
			body["position"]["z"]=+bod.getAttribute("z");
			body["position"]["vx"]=+bod.getAttribute("vx");
			body["position"]["vy"]=+bod.getAttribute("vy");
			body["position"]["vz"]=+bod.getAttribute("vz");
			body["rotation"]["ra"]=+stack["initial"][name]["rotation"]["ra"]; 
			body["rotation"]["dec"]=+stack["initial"][name]["rotation"]["dec"]; 
			body["rotation"]["w"]=+stack["initial"][name]["rotation"]["w"]
			    + stack["initial"][name]["rotation"]["dwdt"] * jd2000;
			body["name"]=name;
			stack["events"][ss]["state"][name]=body;

		    };
		    // add analytical orbits for satellites...
		    this.orbits.forEach( (sat,ind) => {
			if (stack.events[ss].state[sat.name]===undefined) { // no orbit yet
			    var around=sat.orbit.around;
			    if (around === undefined) { around="sun";};
			    stack.events[ss].target=req.events[tt].around;
			    stack.events[ss].state[sat.name]={"position":new Vector3(),"rotation":new Vector3()};
			    //console.log("Around:",around,req,stack);
			    let mainbody=stack.events[ss].state[around];
			    let body=stack.events[ss].state[sat.name];
			    let orbit=sat.orbit;
			    let rotation=sat.rotation;
			    if (sat.orbit.x !== undefined && sat.orbit.y !== undefined && sat.orbit.z !== undefined) {
				body["position"].x=sat.orbit.x + mainbody.position.x;
				body["position"].y=sat.orbit.y + mainbody.position.y;
				body["position"].z=sat.orbit.z + mainbody.position.z;
				body["position"].vx=0.0;
				body["position"].vy=0.0;
				body["position"].vz=0.0;
			    } else if (body !== undefined && mainbody !== undefined){ // sat.orbital elements
				// get mean motion
				let mu = this.MU[around];
				sat.orbit.n=state.Orbit.getMeanMotion(sat.orbit.a,mu);
				sat.orbit.m = sat.orbit.m0 + jd2000 * sat.orbit.n;
				state.Orbit.anomalies2elements(sat.orbit); // get v and c
				state.Orbit.elements2state(body["position"],sat.orbit,mainbody["position"],mu);
				//console.log("Orbit:",sat.name,around,sat,jd2000,body.position);
			    }
			    body["rotation"]["ra"]=+rotation.ra;
			    body["rotation"]["dec"]=+rotation.dec
			    body["rotation"]["w"]=+rotation.w0+rotation.dwdt*jd2000;
			    body.name=sat.name;
			};
		    });
		};
	    };
	    req.received= new moment().valueOf();
	    if (changed && stack !== undefined) {
		// sort stack
		this.cleanStack(state,stack,target);
		stack.received= req.received;
		this.stack=stack;
		// console.log("Stack changed...",new moment(target).toISOString(),stack.event,this.stack.dtgs.length-1);
		// for (var ii=0; ii < stack.dtgs.length;ii=ii+5) {
		//     var ss="";
		//     for (var jj=0; jj<Math.min(5,stack.dtgs.length-ii);jj++) {
		// 	var pp=ii + jj;
		// 	ss=ss+"   "+stack.dtgs[pp];
		//     };
		//     console.log("    ",ii,ss);
		// };
	    } else {
		console.log("Stack did not change...",dtg);
	    };
	    if (this.bdeb) {console.log("Completed request:",req);};
	} else {
	    console.log("Received error:",error);
	    // we never receive data, stop processing here...
	}
	//console.log("Requests:",JSON.stringify(this.requests));
    };
    this.getStack=function(state,req){
	var stack;
	if (this.stack.location !== undefined &&
	    this.stack.location.latitude===req.location.latitude &&
	    this.stack.location.longitude===req.location.longitude) {
	    stack= state.Utils.cp(this.stack);
	} else {
	    var stack=state.Utils.cp(req);
	    stack.epoch=undefined;
	    stack.epochs=[];
	    stack.events=[];
	}
	return stack
    };
    this.standardOrbit=function(state,sat) {
	var around=sat.orbit.around;
	if (around === undefined) { around="sun";};
	state.Orbit.standardOrbit(sat.orbit,sat.cydrift,this.MU[around]);
    }
    // check if we have a new request to process.
    this.completeRequests = function (state) {
	var ret=false;
	this.requests.state.forEach((req,id) => {
	    if ( req.received !== undefined &&
		 req.processed === undefined) { // we have a new target
		let request=req.events[req.event]
		let ttrg=request.epoch;
		let target=request.target;
		//console.log("Setting model time:",ttrg,target,req,new moment(ttrg).toISOString());
		state.Events.setModelTime(state,ttrg);
		this.setNewTarget(state,target);
		req.processed = new moment().valueOf();
		this.stack.processed=req.processed;
		//console.log("Calculated orbital elements:",req);
		ret=true;
	    };
	});
	return ret;
    };
    this.setNewTarget=function(state,target) {
	if ( target !== undefined) {
	    let body=this.config.bodies[target];
	    let origo=this.config.observer.position;
	    if (body !== undefined && body.position !== undefined && origo !== undefined &&
		state.React !== undefined && state.React.Model !== undefined) {
		let x=body.position.x-origo.x;
		let y=body.position.y-origo.y;
		let z=body.position.z-origo.z;
		state.React.Model.setNewTarget(state,x,y,z);
	    };
	};
    };
    // update 3D config of the solar system...
    this.updateConfig = function (state,ttrg) {
	var ret = false;
	var stack=this.stack;
	var reqId=stack.current;
	if (stack.events !== undefined &&
	    stack.processed !== undefined &&
	    this.config.reqId !== reqId ) { // process new request
	    //console.log("Constructing config from orbital elements.");
	    // get times
	    this.config.dtgs = [];
	    this.config.epochs = [];
	    for ( var tt = 0; tt < stack.events.length; tt++) {
		this.config.dtgs[tt]=stack.events[tt].dtg;
		this.config.epochs[tt]=stack.events[tt].epoch;
	    };
	    if (stack.event !== undefined) { this.config.event=stack.event;};
	    //this.config.young=(this.config.current+1)%2;
	    if (this.makeConfig(state,this.stack,this.config,ttrg)) { //
		//console.log("Config:",this.config);
		//  point camera
		if (stack.event !== undefined) {
		    //this.config.dtg = new moment(ttrg).toISOString();
		    if (this.bdeb) {console.log("Dtg:",ttrg,this.config.dtg,this.config.dtgs);};
		    this.config.newTarget=true;
		}
 		this.config.reqId=reqId;
	    };
	} else if (stack.processed !== undefined) { // time lapse...
	    //console.log("Time lapse.");
	    // this.config.young=(this.config.current+1)%2;
	    if (this.makeConfig(state,this.stack, this.config,ttrg)) {
		// this.setInfo(state,this.config.dtg,
		// 	     this.config.lat,
		// 	     this.config.lon);
	    }
	    //    } else {
	    //	console.log("Nothing to do:",stack.processed);
	}
	//console.log("Config:",ttrg,ret);
	return ret;
    };
    this.isExpanding=function(state) {
	var ret=false;
	this.requests.state.every(req => {
	    if (req.type === "expanding") {
		ret=true;
		return false; // stop checking
	    } else {
		return true;  // check next
	    };
	});
	return ret;
    };
    this.makeConfig = function (state,stack,config,ttrg){
	var ret=false;
	if (stack===undefined) {return ret;};
	config.lat=stack.location.latitude;
	config.lon=stack.location.longitude;
	var now = (new moment().valueOf());
	let first=-1;
	let last=-1;
	var firstEpoch=0;
	var lastEpoch=0;
	var prev=-1;
	var next=-1;
	var prevEpoch=0;
	var nextEpoch=0;
	// find correct epoch
	for ( var tt = 0; tt < stack["events"].length; tt++) {
	    if ((first < 0 || stack["events"][tt]["epoch"] >=  firstEpoch)) {
		first=tt;
	    };
	    if ((last < 0 || stack["events"][tt]["epoch"] <=  lastEpoch)) {
		last=tt;
	    };
	    if (stack["events"][tt]["epoch"] <= ttrg &  
		(prev < 0 || stack["events"][tt]["epoch"] >=  prevEpoch)) {
		prev=tt;
		prevEpoch=stack["events"][prev]["epoch"];
	    };
	    if (stack["events"][tt]["epoch"] >= ttrg &  
		(next < 0 || stack["events"][tt]["epoch"] <=  nextEpoch)) {
		next=tt;
		nextEpoch=stack["events"][next]["epoch"];
	    };
	};
	//console.log("Dtg:",ttrg,new moment(ttrg).toISOString(),JSON.stringify(this.config.epochs),
	//		f,prev,next,stack.events.length-1,
	//		JSON.stringify(this.config.dtgs));
	if (prev !== -1 && next !== -1) { // success!!!! ... or?
	    var dt = ttrg-prevEpoch;
	    var dt0 = nextEpoch - prevEpoch;
	    var f = dt/Math.max(1e-10,dt0);
	    ret=true;
	    if (dt0 > 1.5*3600*1000.0) { // to big skip (max is 1.5 hours)...
		if (! this.isExpanding(state)) { // check if we are already expanding
		    if (f < 0.5 && dt < 1.0*3600*1000.0) { // expand 
			console.log("Send next request A...",dt,dt0,f);
			this.launch(state,{epoch:ttrg,hrs:24,dir:"next",type:"expanding"});
		    } else if (f >= 0.5  && dt0-dt < 1.0*3600*1000.0) {
			console.log("Send prev request A...",dt,dt0,f);
			this.launch(state,{epoch:ttrg,hrs:24,dir:"prev",type:"expanding"});
		    } else {
			console.log("Send center request A...",dt,dt0,f);
			this.launch(state,{epoch:ttrg,hrs:24,dir:"center",type:"expanding"});
		    };
		};
	    };
	} else if (prev !== -1 ) {  // found epoch before, but not after
	    var dt = ttrg-prevEpoch;
	    if (! this.isExpanding(state)) {
		if (dt < 1.0*3600*1000.0) {
		    console.log("Send next request C...",dt);
		    this.launch(state,{epoch:ttrg,hrs:24,xdir:"next",type:"expanding"});
		} else {
		    console.log("Send center request C...",dt);
		    this.launch(state,{epoch:ttrg,hrs:24,xdir:"center",type:"expanding"});
		};
	    };
	    next=first;
	    prev=first;
	    f=0.0;
	    // stop clock, set clock to first time
	    ret=true;
	} else if (next !== -1) {  // found epoch after, but not before
	    var dt = nextEpoch-ttrg;
	    if (! this.isExpanding(state)) {
		if (dt > 1.0*3600*1000.0) {
		    console.log("Send prev request D...",dt);
		    this.launch(state,{epoch:ttrg,hrs:24,xdir:"prev",type:"expanding"});
		} else {
		    console.log("Send center request D...",dt);
		    this.launch(state,{epoch:ttrg,hrs:24,xdir:"center",type:"expanding"});
		};
	    };
	    next=last;
	    prev=last;
	    f=0.0;
	    // stop clock, set clock to last time
	    ret=true;
	} else if (now-stack.sent<1000) { // (prev==-1 && next===-1) re-send original request in case of timeout...
	    // send new request if we have a timeoout...
	    stack.sent=now;
	    //console.log("Times:",+ttrg,"|",+e0 ,"|",+speed, "|",+m0);
	    console.log("Unable to find interval:",+ttrg,prev,next,stack["events"]);
	    this.launch(state,{epoch:ttrg,hrs:24});
	    ret=false;
	};
	if (ret) {

	    
	    //console.log("Before:",JSON.stringify(stack.events[prev].observer.position));

	    //console.log("F:",f,prev,next);
	    this.interpolateBodies(state,stack["events"][prev],
				   stack["events"][next],
				   f,config.bodies);
	    this.interpolateObserver(state,stack["events"][prev],
				     stack["events"][next],
				     f,config.observer,config.bodies);
	    config.epoch = ttrg;
	    config.dtg=new moment(config.epoch).toISOString();


	    //console.log("After:",JSON.stringify(stack.events[prev].observer.position));


	    //console.log("Config:",JSON.stringify(config.observer));
	    //console.log("Config:",prev,next,f,stack.events.length,config.epoch,config.dtg,JSON.stringify(stack.events[prev]));
	}
	//console.log("Pos:",+ttrg,stack["events"][0]," STACK:",prev,next," DTG:",config.dtg,prev,next);
	//console.log("******************getState: ",ttrg);//config
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
    this.interpolateBodies = function (state,reqStatePrev,reqStateNext,f,configBodies) {
	for (var name in reqStatePrev["state"]) {
	    var reqPrev = reqStatePrev["state"][name];
	    var reqNext = reqStateNext["state"][name];
	    if (configBodies[name] === undefined) {
		configBodies[name]={position:new Vector3(),rotation:new Vector3()};
	    };
	    configBodies[name].position.lerpVectors(reqPrev.position,reqNext.position,f);
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
	};
    };
    this.intlin = function (p,n,f) { // linear interpolation
	return ( p + (n-p)*f );
    };
    // this.intsph = function (trg,p,n,f) { // spherical interpolation
    // 	if (this.work===undefined) {this.work=new THREE.Vector3();};
    // 	this.work.crossVectors(p,n).normalize();
    // 	var angle=p.angleTo(n)*f;
    // 	trg.set(p.x,p.y,p.z);
    // 	trg.applyAxisAngle(this.work,angle);
    // };
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
	if (reqObserver !== undefined) {
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
	};
	//console.log("setting axis:", configObserver.i.x,configObserver.i.y,configObserver.i.z);
    };
    // get observer position and EF-coordinate system...
    this.interpolateObserver = function (state,reqStatePrev,reqStateNext,f,configObserver,configBodies) { 
	if (configObserver.position === undefined) configObserver.position=new Vector3(); 
	if (configObserver.i === undefined) configObserver.i=new Vector3(); 
	if (configObserver.j === undefined) configObserver.j=new Vector3(); 
	if (configObserver.k === undefined) configObserver.k=new Vector3(); 
	if (configObserver.zenith === undefined) configObserver.zenith=new Vector3();
	var reqPrev = reqStatePrev["observer"];
	var reqNext = reqStateNext["observer"];
	if (reqPrev === undefined || reqNext === undefined) {return;}
	var reqOrigo=reqPrev.position.origo;
	if (configBodies[reqOrigo] === undefined ) {
	    configObserver.position.slerpVectors(reqPrev.position, reqNext.position, f);
	} else {
	    configObserver.position.origo=reqOrigo;
	    configObserver.position.slerpVectors(reqPrev.position, reqNext.position, f);
	    configObserver.position.add(configBodies[reqOrigo].position);
	}
	configObserver.zenith.slerpVectors(reqPrev.zenith,reqNext.zenith,f);
	configObserver.zenith.normalize();
	configObserver.i.slerpVectors(reqPrev.i,reqNext.i,f);
	configObserver.i.normalize();
	configObserver.j.slerpVectors(reqPrev.j,reqNext.j,f);
	configObserver.j.normalize();
	configObserver.k.slerpVectors(reqPrev.k,reqNext.k,f);
	configObserver.k.normalize();
	
	// console.log("Zenith:",JSON.stringify(configObserver)," prev:",JSON.stringify(reqPrev)," next:",JSON.stringify(reqNext));

	//console.log("setting axis:", configObserver.i.x,configObserver.i.y,configObserver.i.z);
    };
    this.interpolateBodies2 = function(req,dt,f,configBodies) {
	// interpolate body positions between times
	//console.log(">>> interpolating body positions.")
	var reqStatePrev = req["events"][req.prev]["state"];
	var reqStateNext = req["events"][req.next]["state"];
	if (reqStatePrev === undefined || reqStateNext === undefined) {
	    console.log("THIS SHOULD NEVER HAPPEN!.");
	    return;
	};
	for (var name in req["events"][req.next]["state"]) {
	    //var name_ = reqStatePrev[name].name;
	    configBodies[name]={position:new Vector3(),
			       rotation:new Vector3()};
	    var main =  req["initial"][name]["main"];
	    if (main !== "") { // use orbit to interpolate position
		var ep=req["events"][req.prev]["elements"][name];
		var en=req["events"][req.next]["elements"][name];
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
	var reqObsPrev=req["events"][req.prev]["observer"];
	var reqObsNext=req["events"][req.next]["observer"];
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
    // this.pushUrl = function (state) {
    // 	var reqId=this.requests.current;
    // 	var req = this.getRequest(state,reqId);
    // 	if ( req.processed) { // we have a target
    // 	    var reqLocation=this.requests.state[reqId]["location"];
    // 	    if (reqLocation !== undefined && this.config !== undefined) { //
    // 		var lat=reqLocation.latitude;
    // 		var lon=reqLocation.longitude;
    // 		var dtg=this.config.dtg; //
    // 		var dir=this.camera.getDir();
    // 		var fov=this.camera.getFovX();
    // 		var con=this.consReq;
    // 		var speed=state.Events.getSpeed(state);
    // 		var hrs=(this.config.hrs||1);
    // 		//var lab="";
    // 		var url="sky.html";
    // 		var first=true;
    // 		if (dir !== undefined) {
    // 		    if (first) {url=url+"?";first=false;} else {url=url+"&";};
    // 		    url=url + "dir=" + parseFloat(dir.x).toFixed(5)
    // 			+","+parseFloat(dir.y).toFixed(5)
    // 			+","+parseFloat(dir.z).toFixed(5);
    // 		}
    // 		if (fov !== undefined) {
    // 		    if (first) {url=url+"?";first=false;} else {url=url+"&";};
    // 		    url=url + "fov=" + parseFloat(fov).toFixed(4);
    // 		}
    // 		if (lat !== undefined) {
    // 		    if (first) {url=url+"?";first=false;} else {url=url+"&";};
    // 		    url=url + "lat=" + parseFloat(+lat).toFixed(3);
    // 		}
    // 		if (lon !== undefined) {
    // 		    if (first) {url=url+"?";first=false;} else {url=url+"&";};
    // 		    url=url + "lon=" + parseFloat(+lon).toFixed(3);
    // 		}
    // 		if (dtg !== undefined) {
    // 		    if (first) {url=url+"?";first=false;} else {url=url+"&";};
    // 		    url=url + "dtg=" + dtg;
    // 		}
    // 		if (hrs !== undefined) {
    // 		    if (first) {url=url+"?";first=false;} else {url=url+"&";};
    // 		    url=url + "hrs=" + hrs;
    // 		}
    // 		if (speed !== undefined) {
    // 		    if (first) {url=url+"?";first=false;} else {url=url+"&";};
    // 		    url=url + "speed=" + speed;
    // 		}
    // 		if (con !== undefined) {
    // 		    if (first) {url=url+"?";first=false;} else {url=url+"&";};
    // 		    url=url + "con=" + con;
    // 		}
    // 		console.log("Setting URL to:",url);
    // 		window.history.replaceState("", "js", url);
    // 	    }
    // 	}
    // };
};

export default Model;
