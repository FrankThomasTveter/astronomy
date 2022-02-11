import moment from 'moment';
function Events() {
    this.bdeb=false;
    this.rawData = [];
    // old html-stuff....
    //this.start_dt=undefined;
    //this.start_tm=undefined;
    //this.end_p=undefined;
    //this.end_m=undefined;
    //this.end_dt=undefined;
    //
    this.lat=60.0;             // latitude
    this.lon=10.0;             // longitude
    this.lastLat=999;
    this.lastLon=999;
    this.updateCheck=false;    // auto load data
    this.previousCheck=false;  // should we search for previous?
    this.nextCheck=false;      // should we search for next?
    this.endDt=1;              // time difference between start and end
    this.speed=1.0;
    this.cost=0;
    this.delay=250;
    //
    this.lastTime=new moment().valueOf();
    this.lastCnt=0;
    this.dtime=1;
    this.documentLog = this.log;
    this.documentPos = this.pos;
    this.initialised=false;
    this.positionIsSet=false;
    this.totalCost=0.00;
    this.window3D=undefined;
    this.map=undefined; //Will contain map object.
    this.marker=undefined; //Has the user plotted their location marker? 
    //
    this.manager= {
	minimum: 100,
	names:[],
	indexes:[],
	nodes:{},
	prevDraggedNode: null,
	prevDraggedNodeZIndex: null
    };
    this.targetSet=false;      // is a target time set?
    this.targetId=undefined;   // target time event id
    this.modelTime=new moment().valueOf();   // target time is now
    this.targetZone=new Date().getTimezoneOffset() * 60000;// client time zone
    this.refTime=this.modelTime;        // reference time so we dont drift during play...
    this.playing=true;
    this.changed=false;
    // offset=target-now
    // target=target0+dt
    // dt0 =  now-target0+offset
    // dt=dt0*speed
    // offset1=target-now=target0+dt-now=target0+dt0*speed-now
    //        = target0 + (now-target0+offset)*speed - now
    // target2 = offset1+now ^ offset2=0;
    this.drawAll=true;           // must redraw event list?
    this.lastUpdate=new moment().valueOf()-10000000; // time of last update
    //
    this.visible={time:true,location:true,criteria:true,events:true};
    //
    this.events=["sunRise","sunSet","sunEleMax","sunEleMin","civil","nautical",
		 "astronomical","night","polarSunDayStart","polarSunDayStop","polarSunNightStart",
		 "polarSunNightStop","sunEclipse","moonRise","moonSet","moonEleMax","moonEleMin",
		 "polarMoonDayStart","polarMoonDayStop","polarMoonNightStart","polarMoonNightStop","moonNew",
		 "moonFirstQuart","moonFull","moonLastQuart","moonIllMin","moonIllMax","southLunastice",
		 "ascLunarEquinox","northLunastice","descLunarEquinox","moonPerigee","moonApogee",
		 "lunarEclipseMinMax","southSolstice","ascSolarEquinox","northSolstice","descSolarEquinox",
		 "earthPerihelion","earthAphelion","mercInfConj","mercSupConj","mercWestElong",
		 "mercEastElong","venusInfConj","venusSupConj","venusWestElong","venusEastElong",
		 "marsConj","marsWestQuad","marsOpp","marsEastQuad","jupiterConj","jupiterWestQuad",
		 "jupiterOpp","jupiterEastQuad","saturnConj","saturnWestQuad","saturnOpp","saturnEastQuad",
		 "mercTransit","venusTransit"];
    this.expanded=["sun","sunDiurnal"];
    this.criteria={"sunRise":true,"sunSet":true};
    this.nodes=[
	{value:"sun",label:"Sun",children: [
	    { value:"sunDiurnal", label:"Diurnal effects",children:[
		{value: "sunRise",label:"Rise"},
		{value: "sunSet",label:"Set"},
		{value: "sunEleMax",label:"Max elevation"},
		{value: "sunEleMin",label:"Min elevation"},
		{value: "civil",label:"Civil Twilight"},
		{value: "nautical",label:"Nautical Twilight"},
		{value: "astronomical",label:"Astronomical Twilight"},
		{value: "night",label:"Night"}
	    ]},
	    { value:"sunOrbit", label:"Orbital effects",children:[
		{value: "sunEclipse",label:"Solar eclipse"},
		{value: "southSolstice",label:"Southern solstice"},
		{value: "ascSolarEquinox",label:"Ascending equinox"},
		{value: "northSolstice",label:"Northern solstice"},
		{value: "descSolarEquinox",label:"Descending equinox"},
		{value: "earthPerihelion",label:"Periheilion"},
		{value: "earthAphelion",label:"Aphelion"}
	    ]},
	    { value:"sunPolar", label:"Polar effects",children:[
		{value: "polarSunDayStart",label:"Polar day start"},
		{value: "polarSunDayStop",label:"Polar day stop"},
		{value: "polarSunNightStart",label:"Polar night start"},
		{value: "polarSunNightStop",label:"Polar night stop"}
	    ]}
	]},
	{value:"moon",label:"Moon",children: [
	    { value:"moonDiurnal", label:"Diurnal effects",children:[
		{value: "moonRise",label:"Rise"},
		{value: "moonSet",label:"Set"},
		{value: "moonEleMax",label:"Max elevation"},
		{value: "moonEleMin",label:"Min elevation"},
	    ]},
	    { value:"moonPhase", label:"Phase effects",children:[
		{value: "moonNew",label:"New moon"},
		{value: "moonFirstQuart",label:"First quarter"},
		{value: "moonFull",label:"Full moon"},
		{value: "moonLastQuart",label:"Last quarter"},
		{value: "moonIllMin",label:"Min illumination"},
		{value: "moonIllMax",label:"Max illumination"},
	    ]},
	    { value:"moonOrbit", label:"Orbital effects",children:[
		{value: "mouthLunastice",label:"Southern lunastice"},
		{value: "ascLunarEquinox",label:"Ascending moon"},
		{value: "northLunastice",label:"Northern lunastice"},
		{value: "descLunarEquinox",label:"Descending moon"},
		{value: "moonPerigee",label:"Perigee"},
		{value: "moonApogee",label:"Apogee"},
		{value: "lunarEclipseMinMax",label:"Eclipse"}
	    ]},
	    { value:"moonPolar", label:"Polar effects",children:[

		{value: "polarMoonDayStart",label:"Lunar day start"},
		{value: "polarMoonDayStop",label:"Lunar day stop"},
		{value: "polarMoonNightStart",label:"Lunar night start"},
		{value: "polarMoonNightStop",label:"Lunar night stop"}
	    ]}
	]},
	{value:"planets",label:"Planets",children: [
	    { value:"mercury", label:"Mercury",children:[
		{value: "mercInfConj",label:"Inferior conjunction"},
		{value: "mercSupConj",label:"Superior conjunction"},
		{value: "mercWestElong",label:"Western elongation"},
		{value: "mercEastElong",label:"Eastern elongation"},
		{value: "mercTransit",label:"Transig"},
	    ]},
	    { value:"venus", label:"Venus",children:[
		{value: "venusInfConj",label:"Inferior conjunction"},
		{value: "venusSupConj",label:"Superior conjunction"},
		{value: "venusWestElong",label:"Western elongation"},
		{value: "venusEastElong",label:"Eastern elongation"},
		{value: "venusTransit", label:"Transit"}
	    ]},
	    { value:"mars", label:"Mars",children:[
		{value: "marsConj",label:"Conjunction"},
		{value: "marsWestQuad",label:"Western quadrature"},
		{value: "marsOpp",label:"Opposition"},
		{value: "marsEastQuad",label:"Eastern quadrature"},
	    ]},
	    { value:"jupiter", label:"Jupiter",children:[
		{value: "jupiterConj",label:"Conjunction"},
		{value: "jupiterWestQuad",label:"Western quadrature"},
		{value: "jupiterOpp",label:"Opposition"},
		{value: "jupiterEastQuad",label:"Eastern quadrature"},
	    ]},
	    { value:"saturn", label:"Saturn",children:[
		{value: "saturnConj",label:"Conjunction"},
		{value: "saturnWestQuad",label:"Western quadrature"},
		{value: "saturnOpp",label:"Opposition"},
		{value: "saturnEastQuad",label:"Eastern quadrature"},
	    ]}
	]}
    ];
    this.init = function(state){
	//console.log("Init");
	var baseURL="/astro/media/sounds/";
	this.beep0s = new Audio(baseURL+"beep0s.mp3");
	this.beep1s = new Audio(baseURL+"beep1s.mp3");
	this.beep2s = new Audio(baseURL+"beep2s.mp3");
	this.beep3s = new Audio(baseURL+"beep3s.mp3");
	this.beep10s= new Audio(baseURL+"beep10s.mp3");
	this.beep1m = new Audio(baseURL+"beep1m.mp3");
	this.launchModel(state);
	//state.Utils.init("Database",this);
	this.initialised=true;
    };
    this.launchModel=function(state,dtg) {
	if (dtg === undefined) {
            if (this.targetSet) {
		dtg=new Date(this.modelTime).toISOString();
            } else {
		dtg = new Date().toISOString();
            }
	}
	var hrs;
	var lat=this.lat;
	var lon=this.lon;
	var label = "Now";
	var target = this.getTarget(this.targetId);
	var fov = this.getFov(this.targetId);
	var dir;   // direction
	var con=0; // show contellations?
	var speed; // speed of model, undefined => no speed
	state.Model.launch(state,lat,lon,dtg,hrs,label,target,fov,dir,con,speed);
    };
    this.updateLoop = function(state) {
	if (this.bdeb) {console.log("Updating Event...");}
	if (state.Events.isPlaying(state) || state.Events.changed) {
	    // reload if necessary
	    state.Events.changed=false;
	    if (! state.Events.countdown(state)) { // are we in a countdown?
		state.Events.setEventTime(state);
	    };
	    state.Show.showTime(state);
	    state.Show.showEvents(state);
	};
	setTimeout(function() {
	    state.Events.updateLoop(state)
	},state.Events.delay);
    }.bind(this);
    this.countdown = function(state) {
	var active=false;
	if (this.initialised) {
	    var now=new moment().valueOf();
	    if (Math.abs(state.Events.modelTime-state.Events.eventTime) < 65*1000) {
		active=true;
		//console.log("We are in a countdown...",state.Events.eventTime);
		// load new data if we just passed countdown...
		if (state.Events.getUpdate(state) && // should we update automatically?
		    (now-state.Events.lastUpdate) > 10000*state.Events.lastCnt && // wait for previous retry
		    state.Events.lastCnt < 10) {  // retry 10 times
		    state.Events.lastCnt++;
		    state.Events.sendRequest(state,"",[state.Show.showAll]);
		    console.log("Updating...");
		} else {
		    if (state.Events.modelTime - state.Events.lastTime > 1000)  { // code suspended during event 
		    } else if (state.Events.eventTime-999 > state.Events.lastTime && 
			       state.Events.eventTime-999 < state.Events.modelTime) {       // T   0s
			state.Events.playAudio(state,state.Events.beep0s);
		    } else if (state.Events.eventTime-1999 > state.Events.lastTime &&
			       state.Events.eventTime-1999 < state.Events.modelTime) {	  // T -1s
			state.Events.playAudio(state,state.Events.beep1s);
		    } else if (state.Events.eventTime-2999 > state.Events.lastTime &&
			       state.Events.eventTime-2999 < state.Events.modelTime) {	  // T -2s
			state.Events.playAudio(state,state.Events.beep2s);
		    } else if (state.Events.eventTime-3999 > state.Events.lastTime &&
			       state.Events.eventTime-3999 < state.Events.modelTime) {	  // T -3s
			state.Events.playAudio(state,state.Events.beep3s);
		    } else if (state.Events.eventTime-10999 > state.Events.lastTime &&
			       state.Events.eventTime-10999 < state.Events.modelTime) {	  // T -10s
			state.Events.playAudio(state,state.Events.beep10s);
		    } else if (state.Events.eventTime-60999 > state.Events.lastTime &&
			       state.Events.eventTime-60999 < state.Events.modelTime) {	  // T -60s
			state.Events.playAudio(state,state.Events.beep1m);
		    }
		    state.Events.lastTime=state.Events.modelTime;
		}
	    } else {
		//console.log("Not in a countdown...",state.Events.modelTime,state.Events.eventTime);
	    };
	};
	return active;
    }
    this.sendRequest = function(state, response, callbacks) {
	if (this.bdeb) {console.log("Sending event request.");};
	var req=this.getRequestPar(state);
	if (req !==undefined) {
	    var url="cgi-bin/event.pl";
	    var sequence = Promise.resolve();
	    sequence = sequence.then(
		function() {
		    return state.File.get(url,req);
		}
	    ).then(
		function(result) {
		    state.Events.processEvents(state,url,result);
		}
	    ).catch(
		function(err) {
		    console.log("Unable to load event. ("+err.message+")");
		}
	    );
	    sequence.then(function() {
		state.Events.changed=false;
		state.Events.lastUpdate=new moment().valueOf();
		state.Events.lastCnt=1;
		state.Events.setEventTime(state);
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
    this.processEvents = function(state,url,result){
	//console.log("Result:",result);
	var xmlDoc;
	if (typeof result === "string") {
	    //var regex=/(.*)/mg;
	    var regex=/(<astrodata[\s\S]*\/astrodata>)/mg;
	    var match=result.match(regex);
	    if (match !== null && match.length > 0) {
		//console.log("Matches:",match[0]);
		if (window.DOMParser) {
		    var parser = new DOMParser();
		    xmlDoc = parser.parseFromString(result, "text/xml");
		    try {
			this.rawData=this.dataToArray(state,xmlDoc);
			console.log("Loaded event data:",JSON.stringify(this.rawData));
		    } catch (err) {
			console.log(err);
		    };
		} else {
		    console.log("No DOM parser for XML available.");
		};
	    } else {
		console.log("Error while loading event.");
	    };
	} else {
	    console.log("Invalid event result.");
	};
	//console.log("XML:",xmlDoc);
    };
    this.show = function(state,type) {
	if (this.visible[type] === undefined) { this.visible[type]=false;}
	return this.visible[type];
    }.bind(this);
    this.toggle = function(state,type) {
	if (this.visible[type] === undefined) { this.visible[type]=false;}
	if (!this.visible[type] || this.isPromoted(state,type)) {
	    this.visible[type]=! this.visible[type];
	};
	if (this.visible[type]) {
	    this.promoteType(state,type);
	} else {
	    this.demoteType(state,type);
	}
	state.Show.showDataset(state,true);
	return this.visible[type];
    }.bind(this);
    this.promoteNode = function(state,node) {
	var regex=/(.*)/;
	var name=regex.exec(node.outerText)[0]||[];
	var index=Math.max((node.style.zIndex||0),this.manager.minimum);
 	//console.log("Node:",this.manager.names.length,name,"=>",index,node);
 	var pos = this.manager.names.indexOf(name);
	if (pos===-1) { // add node
	    this.manager.nodes[name]=node;
	    this.manager.names.push(name);
	    this.manager.indexes.push(index);
	} else {
	    this.manager.names.splice(pos,1);
	    this.manager.names.push(name);
	}
	this.promote(state);
    };
    this.isPromoted = function(state,name) {
 	var pos = this.manager.names.indexOf(name);
	var len = this.manager.names.length;
	return (pos === -1 || pos+1 === len);
    };
    this.promoteType = function(state,name) {
 	var pos = this.manager.names.indexOf(name);
	if (pos !== -1) {
	    this.manager.names.splice(pos,1);
	    this.manager.names.push(name);
	};
	this.promote(state);
    };
    this.demoteType = function(state,name) {
 	var pos = this.manager.names.indexOf(name);
	if (pos !== -1) {
	    this.manager.names.splice(pos,1);
	    this.manager.names.unshift(name);
	};
	this.promote(state);
    };
    this.promote = function(state) {
	// make sure indexes are unique
	var last;
	this.manager.indexes.sort(function(a, b) {return a - b;});
	this.manager.indexes.map(function(v,i){
	    if (last===undefined) {
		last=v;
	    } else if( last >= v)  {
		last=last+1;
		this.manager.indexes[i]=last;
	    }
	}.bind(this));
	this.manager.names.forEach(function(v,i){
	    this.manager.nodes[v].style.zIndex=this.manager.indexes[i];
	}.bind(this));
    };
    this.isPlaying = function(state) {
	return state.Events.playing;
    };
    this.togglePlay = function(state) {
	var now=new moment().valueOf();
	if (state.Events.isPlaying(state)) { // stop clock
	    state.Events.setModelClock(state,now);
	    state.Events.setEventTime(state);
	    state.Events.playing=false;
	} else { // start clock
	    state.Events.refTime=now;
	    state.Events.playing=true;
	};
	state.Events.changed=true;
    };
    this.setSpeed = function(state,speed) {
	state.Events.setModelClock(state);
	state.Events.setEventTime(state);
	state.Events.speed=speed;
	//console.log("Speed:",state.Events.speed);
    };
    this.getSpeed = function(state) {
	return state.Events.speed;
    };
    this.rewind = function(state) {
	state.Events.incrementModelTime(state,-state.Events.speed*1000);
    };
    this.forward = function(state) {
	state.Events.incrementModelTime(state,+state.Events.speed*1000);
    };
    this.incrementModelTime = function(state,dt) {
	state.Events.changed=true;
	state.Events.modelTime=state.Events.modelTime+dt;
    };
    this.getData = function(state) {
	return state.Events.rawData;
    };
    this.bodyFocus = function(state,id) {
	// set focus on the body i.e. sun, moon
	console.log("Focus on id:",id);
    };
    this.setModelClock = function(state,now) {
	if (state.Events.isPlaying(state)) {
	    if (now === undefined) { now=new moment().valueOf(); }
	    var dt=now-state.Events.refTime;
	    state.Events.modelTime=state.Events.modelTime + dt*state.Events.speed;
	    state.Events.refTime=now;
	};
    };    
    this.getModelTime = function(state,now) {
	if (state.Events.isPlaying(state)) {
	    if (now === undefined) { now=new moment().valueOf(); }
	    var dt=now-state.Events.refTime;
	    return state.Events.modelTime + dt*state.Events.speed;
	} else {
	    return state.Events.modelTime;
	}
    };
    this.getModelMoment = function(state) {
	return new moment(this.getModelTime(state));
    };
    this.setModelMoment = function(state,date) {
	if (date!==undefined) {
	    state.Events.changed=true;
	    state.Events.modelTime=date.valueOf();
	    state.Events.refTime=new moment().valueOf();
	};
    };

    this.getNodes = function(state) {
	return state.Events.nodes;
    };
    this.getExpanded = function(state) {
	return state.Events.expanded;
    };
    this.setExpanded = function(state,expanded) {
	state.Events.expanded=expanded;
	//console.log("Expanded:",expanded);
    };
    this.getChecked = function(state) {
	return Object.keys(state.Events.criteria);
    };
    this.setChecked = function(state,checked) {
	var criteria={};
	checked.forEach((x,i) => {criteria[x]=true;});
	state.Events.criteria=criteria;
    };
    //
    // this.setModelClock = function(state) {
    // 	var d = new moment();
    // 	var epoch=d.valueOf();
    // 	//console.log("Times:",epoch,this.epoch0);
    // 	if (this.epoch0 !== undefined) {
    // 	    var age = epoch - this.epoch0;
    // 	    this.mod=this.getTimeDiff(state,age);
    // 	    if (state.React !== undefined && state.React.Events !== undefined) {
    // 		// update event timer...
    // 		state.React.Events.setAge(state,this.mod);
    // 		//console.log("Age:",epoch,this.epoch0,age);
    // 	    }
    // 	};
    // 	state.Show.
    // };
    
    this.getRequestPar = function(state) {
	//console.log("Updating data.");
	var now=new moment().valueOf();
	var req=new this.request();
	var requestTime=now;
	var replace=true;
	if (this.targetSet) {replace=false;requestTime=this.modelTime;};
	req.addDebug();
	req.addPosition("",state.Events.lat,state.Events.lon,0)
	if(this.getPrev(state)) {
	    if (this.getNext(state)) {
		if (replace) {
		    req.addStartTime("",new moment(requestTime).toISOString());
		    req.addSearch("",0);
		} else { // add
		    req.addStartTime("",new moment(requestTime).toISOString());
		    req.addSearch("",-2);
		}
	    } else {
		if (replace) {
		    req.addStartTime("",new moment(requestTime).toISOString());
		    req.addSearch("",-1);
		} else { // add
		    req.addStartTime("",new moment(requestTime-1000).toISOString());
		    req.addSearch("",-1);
		}
	    }
	} else if (this.getNext(state)) {
	    if (replace) {
		req.addStartTime("",new moment(requestTime).toISOString());
		req.addSearch("",1);
	    } else { // add
		req.addStartTime("",new moment(requestTime+1000).toISOString());
		req.addSearch("",1);
	    }
	} else { // time interval...
	    if (replace) {
		req.addStartTime("",new moment(requestTime).toISOString());
		req.addStopTime("",new moment(requestTime+this.dtime*86400000).toISOString());
		req.addSearch("",2);
	    } else {
		req.addStartTime("",new moment(requestTime+1000).toISOString());
		req.addStopTime("",new moment(requestTime+1000+this.dtime*86400000).toISOString());
		req.addSearch("",2);
	    }
	}
	if (this.addEvents(state,req)) {
	    req.wipe();
	    return req;
	} else {
	    return; // nothing to do...
	}
    };
    this.addEvents = function(state,req) {
	if (this.getUpdate(state)){this.setCookie("updateCheck","t",10);}    else {this.setCookie("updateCheck","f",0);};
	if (this.getPrev(state))  {this.setCookie("previousCheck","t",10);}  else {this.setCookie("previousCheck","f",0);};
	if (this.getNext(state))  {this.setCookie("nextCheck","t",10);}      else {this.setCookie("nextCheck","f",0);};
	var id=1;
	this.events.forEach(function(x,i) {
	    if (this.criteria[x]) {
		this.setCookie(x,"t",10);
		if (req.add[x] === undefined) {
		    console.log("*** Missing event ",x);
		} else {
		    id=req.add[x](id);
		};
	    } else {
		this.setCookie(x,"f",10);
	    };
	}.bind(this));
	this.setCookie("latitudeCheck",this.lat,10)
	this.setCookie("longitudeCheck",this.lon,10)
	return id-1;
    }.bind(this);
    this.processData = function(data) {
    };
    this.setPositionData = function(state,position) {
	this.setPosition(position);
	var newpos=this.isNewPos(position.coords.latitude,position.coords.longitude);
	var d=new moment();
	var now=d.valueOf();
	//console.log("Got position."+this.refTime+"  "+now);
	if (newpos || this.refTime < now) {
	    this.lastUpdate=now+10000; 
	    //console.log("Updating data.");
	    var req=new this.request();
	    //var dt = 86400000.0;
	    var requestTime=now;
	    var replace=true;
	    if (this.targetSet) {replace=false;requestTime=this.modelTime;};
	    if (newpos) {replace=true;};
	    req.addDebug();
	    req.addPosition("",position.coords.latitude,position.coords.longitude,0)
	    if(this.prev(state)) {
		if (this.getNext(state)) {
		    if (replace) {
			req.addStartTime("",new moment(requestTime).toISOString());
			req.addSearch("",0);
		    } else { // add
			req.addStartTime("",new moment(requestTime).toISOString());
			req.addSearch("",-2);
		    }
		} else {
		    if (replace) {
			req.addStartTime("",new moment(requestTime).toISOString());
			req.addSearch("",-1);
		    } else { // add
			req.addStartTime("",new moment(requestTime-1000).toISOString());
			req.addSearch("",-1);
		    }
		}
	    } else if (this.getNext(state)) {
		if (replace) {
		    req.addStartTime("",new moment(requestTime).toISOString());
		    req.addSearch("",1);
		} else { // add
		    req.addStartTime("",new moment(requestTime+1000).toISOString());
		    req.addSearch("",1);
		}
	    } else { // time interval...
		if (replace) {
		    req.addStartTime("",new moment(requestTime).toISOString());
		    req.addStopTime("",new moment(requestTime+this.dtime*86400000).toISOString());
		    req.addSearch("",2);
		} else {
		    req.addStartTime("",new moment(requestTime+1000).toISOString());
		    req.addStopTime("",new moment(requestTime+1000+this.dtime*86400000).toISOString());
		    req.addSearch("",2);
		}
	    }
	    if (this.addEvents(state,req)) {
		req.wipe();
		//console.log(req);
		//this.documentLog.innerHTML = "<em>Server-request: sent</em>";
		console.log("Sending event-request :",req);
		if (replace) {
		    // $.get("cgi-bin/event.pl",req,function(data, status){this.rawData=dataToArray(state,data);});
		} else {
		    // $.get("cgi-bin/event.pl",req,function(data, status){this.rawData=addDataToArray(state,data);});
		}
	    } else {
		this.clearArray();
	    }
	}
    };
    this.setEndDt = function(state,dt) {
	state.Events.endDt=dt;
    };
    this.getEndDt = function (state) {
	return state.Events.endDt;
    };
    this.getUpdate = function(state) {
	return state.Events.updateCheck;
    };
    this.setUpdate = function(state,update) {
	state.Events.updateCheck=update;
    };
    this.getPrev = function(state) {
	return state.Events.previousCheck;
    };
    this.setPrev = function(state,prev) {
	state.Events.previousCheck=prev;
    };
    this.getNext = function(state) {
	return state.Events.nextCheck;
    };
    this.setNext = function(state,next) {
	state.Events.nextCheck=next;
    };
    this.getLat = function(state) {
	return state.Events.lat;
    };
    this.setLat = function(state,lat) {
	state.Events.lat=lat;
    };
    this.getLon = function(state) {
	return state.Events.lon;
    };
    this.setLon = function(state,lon) {
	state.Events.lon=lon;
    };
    this.setTargetDateOld = function(target) {
	var tzoffset = (new moment(target)).getTimezoneOffset() * 60000; //offset in milliseconds
	var dtg=new moment(target - tzoffset).toISOString();
	var d=dtg.substring(0,10);
	var t=dtg.substring(11,19);
	this.start_dt=d;
	this.start_tm=t;
    };
    this.getISODate = function(target) {
	var tzoffset = this.targetZone; //offset in milliseconds
	var dt=target-tzoffset;
	var date=new moment(dt);
	var dtg=date.toISOString();
	//console.log("Iso date:",date,dtg,target,tzoffset,dt);
	var d=dtg.substring(0,10);
	var t=dtg.substring(11,19);
	return d + " " + t;
    };
    this.increaseEndDt = function(state) {
	state.Events.endDt=Math.min(99,state.Events.endDt+1);
    };
    this.decreaseEndDt = function(state) {
	state.Events.endDt=Math.max(1,state.Events.endDt-1);
    };
    this.getEndDt = function(state) {
	return state.Events.endDt;
    };
    // this.drawData = function (documentTable, id) {
    // 	if (this.rawData === undefined) {
    // 	    //documentTable.innerHTML="<em>No data available.</em>";
    // 	} else {
    // 	    var d=new moment();
    // 	    var now=d.valueOf();
    // 	    var cellCnt=4;
    // 	    var reportCnt=0;
    // 	    var documentReportCnt=documentTable.rows.length;
    // 	    this.clean(this.rawData,undefined);
    // 	    var dataReportsCnt=this.rawData.length;
    // 	    if (dataReportsCnt !== documentReportCnt) {
    // 		//console.log("Must redraw."+dataReportsCnt+" "+documentReportCnt);
    // 		this.drawAll=true;
    // 	    };
    // 	    if (this.drawAll && documentReportCnt === 0) {
    // 		//documentTable.innerHTML="";
    // 	    };
    // 	    for (var jj=0; jj< dataReportsCnt;jj++) {
    // 		if (this.drawAll) {
    // 		    if (reportCnt >= documentReportCnt) { // create row
    // 			//console.log("Report:"+reportCnt+"  "+jj+" "+dataReportsCnt+this.rawData[jj][0]);
    // 			var row=documentTable.insertRow(reportCnt);
    // 			for (var kk=0; kk < cellCnt;kk++) {
    // 			    var cell=row.insertCell(kk);
    // 			    //cell.innerHTML="init"+reportCnt;
    // 			}
    // 		    };
    // 		};
    // 		var dataReport=this.rawData[jj];
    // 		var documentReport=documentTable.rows[reportCnt];
    // 		var documentCells=documentReport.cells;
    // 		var t=new moment(dataReport[0]);
    // 		var repid=dataReport[3];
    // 		if (this.drawAll) {
    //                 //console.log("Drawing buttons.");
    // 		    //documentCells[0].innerHTML="<button class=\"delete\" onclick=\"deleteRow("+
    // 			//id+","+reportCnt+")\">X</button>";
    // 		    //documentCells[1].innerHTML="<button class=\"hot\" onclick=\"setTarget("+
    // 			//(t*1)+","+(repid)+")\">"+this.nice(t)+"</button>";
    // 		    //console.log("drawing button:"+this.nice(t));
    // 		}
    // 		var dt=t-now;
    // 		if (this.targetSet) {dt=t-this.modelTime;}
    // 		//documentCells[2].innerHTML=this.getTimeDiff(dt);
    // 		//documentCells[4].innerHTML=dataReport[0];
    // 		if (this.drawAll) {
    // 		    //documentCells[3].innerHTML="<button class=\"launch\" onclick=\"setTargetId("+
    // 			//(t*1)+","+(repid)+");launch();\">"+dataReport[5].substring(20)+"</button>";
    // 		    //documentCells[3].innerHTML=dataReport[5].substring(20);
    // 		}
    // 		if (Math.abs(dt) < 1100) {
    // 		    documentReport.style.backgroundColor="#FFFFFF";
    // 		} else if (dt < 0) {
    // 		    documentReport.style.backgroundColor="#AAAAAA";
    // 		} else {
    // 		    documentReport.style.backgroundColor="#00FF00";
    // 		}
    // 		reportCnt=reportCnt+1;
    // 	    }
    // 	    if (this.drawAll) {
    // 		if (documentReportCnt > reportCnt) {
    // 		    for (var ii=documentReportCnt-1; ii>= reportCnt;ii--) {
    // 			documentTable.deleteRow(ii);
    // 		    }
    // 		}
    // 	    }
    // 	    if (this.drawAll && reportCnt === 0) {
    // 		//documentTable.innerHTML="<em>No data available.</em>";
    // 	    }
    // 	    if (this.drawAll) {
    // 		this.drawAll=false;
    // 		//console.log("Stopped redrawing."+documentTable.rows.length);
    // 	    }
    // 	    //console.log(this.rawData[0][0]);
    // 	    // documentPos.innerHTML="Data:" + this.rawData;
    // 	}
    // }
    this.removeItem = function(state,item,index) {
	state.Events.rawData[index]=undefined;
	state.Events.clean(state.Events.rawData,undefined);
    };
    this.deleteRow = function(id,row) {
	//console.log("Deleting row:"+row);
	this.this.rawData[row]=undefined;
	this.drawAll=true;
    }
    this.setTarget = function(tt,id) {
	//console.log("Setting target to:"+tt+" "+this.targetSet);
	if (this.targetSet && tt === this.modelTime) {
	    this.targetSet=false;
	    this.targetId=undefined;
	} else {
	    this.targetSet=true;
	    this.modelTime=tt;
	    this.setTargetDateOld(this.modelTime);
	    this.setEndDate(this.modelTime);
	    this.targetId=id;
	}
    }
    this.setTargetId = function(tt,id) {
	//console.log("Setting target to:"+tt+" "+this.targetSet);
	this.targetSet=true;
	this.modelTime=tt;
	this.setTargetDateOld(this.modelTime);
	this.setEndDate(this.modelTime);
	this.targetId=id;
    }

    this.getTimeDiff = function(dt) {
	var s="";
	var msec=Math.abs(dt);
	var dd = Math.floor(msec / 1000 / 60 / 60 / 24);
	msec -= dd * 1000 * 60 * 60 * 24;
	var hh = Math.floor(msec / 1000 / 60 / 60);
	msec -= hh * 1000 * 60 * 60;
	var mm = Math.floor(msec / 1000 / 60);
	msec -= mm * 1000 * 60;
	var ss = Math.floor(msec / 1000);
	msec -= ss * 1000;
	if (dt <= -1000) {
	    s="-";
	} else if (dt >= 1000) {
	    s="+";
	} else {
	    s="0";
	    return s;
	}
	if (dd !== 0) s=s+" "+this.numberWithCommas(dd)+"d";
	if (hh !== 0) s=s+" "+hh+"h";
	if (mm !== 0) s=s+" "+mm+"m";
	if (ss !== 0) s=s+" "+ss+"s";
	return s;
    }

    this.numberWithCommas = function(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    this.isNewPos = function(lat,lon) {
	var ret= (Math.abs(this.lastLat-lat)+Math.abs(this.lastLon-lon) > 1./40000000.0);
	//console.log("Lat:"+lat+" Lon:"+lon+"  "+ret);
	if (ret) {
	    this.lastLat=lat;
	    this.lastLon=lon;
	}
	return ret;
    }
    this.addDataToArray = function(state,data) {
	//console.log("adding data to array.");
	if (this.rawData !== undefined) {
	    var raw=this.dataToArray(state,data);
	    this.rawData=this.dataMerge(this.rawData,raw);
	} else {
	    this.rawData=this.dataToArray(state,data);
	}
    }
    this.dataMerge = function(raw1,raw2) {
	return this.unique(raw1.concat(raw2)).sort(function(a, b){return a[0]-b[0]});
    }
    this.clearArray = function() {
	this.rawData = [];
	this.drawAll=true;
    }
    this.setEventTime = function(state) {
	state.Events.eventTime=undefined;
	//loop over raw array, use time after refTime...
	//var now=new moment().valueOf();
	state.Events.rawData.forEach(function(v,i) {
	    var time=v[0];
	    if (time > state.Events.modelTime && 
		(state.Events.eventTime===undefined || state.Events.eventTime < state.Events.modelTime || time < state.Events.eventTime)) {
		state.Events.eventTime=time;
	    }
	});
    };
    this.dataToArray = function(state,data) {
	this.lastCnt=1;
	var ret=[];
	//var len=ret.length; // old length
	//var now=new moment().valueOf();
	//console.log("Adding data to array");
	var cnt=0;
	//var log="";
	var events=data.getElementsByTagName("Event");
	for (var ii = 0; ii < events.length; ii++) {
	    var event=events[ii];
	    //var eventSeq = event.getAttribute("Seq");
	    var eventId = event.getAttribute("Id");
	    //var eventStart = event.getAttribute("Start");
	    //var eventSearch = event.getAttribute("Search");
	    //var eventStop = event.getAttribute("Stop");
	    //var eventVal1 = event.getAttribute("Val1");
	    //var eventVal2 = event.getAttribute("Val2");
	    //var eventVal3 = event.getAttribute("Val3");
	    //var eventReports = event.getAttribute("reports");
	    var costms=event.getAttribute("cost")||[];
	    var reports=event.getElementsByTagName("Report");
	    var cost = 0;
	    if (costms.length > 0) cost=costms.match(/^[\d.]+/g);
	    this.updateCost(cost);
	    for (var jj = 0; jj < reports.length; jj++) {
		var report=reports[jj];
		var error=report.getAttribute("error");
		if (error === null) {
		    var reportDtg=report.getAttribute("time");
		    var t=new moment(reportDtg);
		    var localDtg=t.valueOf();
		    //console.log("Got date: "+reportDtg+" => "+localDtg);
		    var reportId=report.getAttribute("repId");
		    var reportVal=report.getAttribute("repVal");
		    var reportHint=report.getAttribute("hint");
		    var localSort=this.getSortTime(localDtg,eventId,reportId);
		    ret[cnt++]=[localDtg,localSort,eventId,reportId,reportVal,reportHint];
		} else {
		    // var hint=report.getAttribute("hint");
		    // log="<em>Server-request:"+hint+"</em>";
		};
	    };
	};
	//if (cnt < len) {ret.splice(cnt, len-cnt);}
	ret.sort(function(a, b){return a[1]-b[1]});
	this.drawAll=true;
	return ret;	
    };
    this.request = function() {
	this.wipe = function () {var obj=Object.keys(this);for (var ii=0; ii<obj.length;ii++) 
				 {if (typeof this[obj[ii]] === 'function' || typeof this[obj[ii]] === 'object') {delete this[obj[ii]];}}}
	//this.wipe             = function () {var obj=Object.keys(this);for (var ii=0; ii<obj.length;ii++) 
	//				      {if (! obj[ii].match(/^event/g) && ! obj[ii].match(/^debug/g)) {delete this[obj[ii]];}}}
	this.addDebug          = function(id,val) {this["debug"]=1;};
	this.addSearch         = function(id,val) {this["event"+id+"Search"]=val;};
	this.addStartTime      = function(id,val) {this["event"+id+"Start"]=val;};
	this.addStopTime       = function(id,val) {this["event"+id+"Stop"]=val;};
	this.addPosition       = function(id,lat,lon,hgt) {this["event"+id+"Val1"]=lat;
							   this["event"+id+"Val2"]=lon;
							   this["event"+id+"Val3"]=hgt;}
	this.add= {"sunRise" :          function(id) {id++;this["event"+id+"Id"]=600;return id;}.bind(this),		  
		   "sunSet" :           function(id) {id++;this["event"+id+"Id"]=610;return id;}.bind(this),
		   "moonState" :        function(id) {id++;this["event"+id+"Id"]=100;return id;}.bind(this),
		   "moonTcEf" :         function(id,dt) {id++;this["event"+id+"Id"]=110;
							 this["event"+id+"Val4"]=dt;return id;}.bind(this),
		   "sunState" :         function(id) {id++;this["event"+id+"Id"]=120;return id;}.bind(this),
		   "sunVisible" :       function(id) {id++;this["event"+id+"Id"]=125;return id;}.bind(this),
		   "sunTcEf" :          function(id,dt) {id++;this["event"+id+"Id"]=130;
							 this["event"+id+"Val4"]=dt;return id;}.bind(this),
		   "southSolstice" :    function(id) {id++;this["event"+id+"Id"]=150;return id;}.bind(this),
		   "ascSolarEquinox" :  function(id) {id++;this["event"+id+"Id"]=160;return id;}.bind(this),
		   "northSolstice" :    function(id) {id++;this["event"+id+"Id"]=170;return id;}.bind(this),
		   "descSolarEquinox" : function(id) {id++;this["event"+id+"Id"]=180;return id;}.bind(this),
		   "earthPerihelion" :  function(id) {id++;this["event"+id+"Id"]=190;return id;}.bind(this),
		   "earthAphelion" :    function(id) {id++;this["event"+id+"Id"]=195;return id;}.bind(this),
		   
		   "southLunastice" :   function(id) {id++;this["event"+id+"Id"]=290;return id;}.bind(this),
		   "ascLunarEquinox" :  function(id) {id++;this["event"+id+"Id"]=292;return id;}.bind(this),
		   "northLunastice" :   function(id) {id++;this["event"+id+"Id"]=294;return id;}.bind(this),
		   "descLunarEquinox" : function(id) {id++;this["event"+id+"Id"]=296;return id;}.bind(this),
		   "moonPerigee" :      function(id) {id++;this["event"+id+"Id"]=200;return id;}.bind(this),
		   "moonApogee" :       function(id) {id++;this["event"+id+"Id"]=205;return id;}.bind(this),
		   "moonNew" :          function(id) {id++;this["event"+id+"Id"]=210;return id;}.bind(this),
		   "moonFirstQuart" :   function(id) {id++;this["event"+id+"Id"]=220;return id;}.bind(this),
		   "moonFull" :         function(id) {id++;this["event"+id+"Id"]=230;return id;}.bind(this),
		   "moonLastQuart" :    function(id) {id++;this["event"+id+"Id"]=240;return id;}.bind(this),
		   "moonPhase" :        function(id) {id++;this["event"+id+"Id"]=250;return id;}.bind(this),
		   "moonIllMin" :       function(id) {id++;this["event"+id+"Id"]=260;return id;}.bind(this),
		   "moonIllMax" :       function(id) {id++;this["event"+id+"Id"]=270;return id;}.bind(this),
		   "moonIll" :          function(id,val) {id++;this["event"+id+"Id"]=280;return id;}.bind(this),
		   "mercInfConj" :      function(id) {id++;this["event"+id+"Id"]=300;return id;}.bind(this),
		   "mercSupConj" :      function(id) {id++;this["event"+id+"Id"]=310;return id;}.bind(this),
		   "mercWestElong" :    function(id) {id++;this["event"+id+"Id"]=320;return id;}.bind(this),
		   "mercEastElong" :    function(id) {id++;this["event"+id+"Id"]=330;return id;}.bind(this),
		   "venusInfConj" :     function(id) {id++;this["event"+id+"Id"]=340;return id;}.bind(this),
		   "venusWestElong" :   function(id) {id++;this["event"+id+"Id"]=350;return id;}.bind(this),
		   "venusSupConj" :     function(id) {id++;this["event"+id+"Id"]=360;return id;}.bind(this),
		   "venusEastElong" :   function(id) {id++;this["event"+id+"Id"]=370;return id;}.bind(this),
		   "marsConj" :         function(id) {id++;this["event"+id+"Id"]=380;return id;}.bind(this),
		   "marsWestQuad" :     function(id) {id++;this["event"+id+"Id"]=390;return id;}.bind(this),
		   "marsOpp" :          function(id) {id++;this["event"+id+"Id"]=400;return id;}.bind(this),
		   "marsEastQuad" :     function(id) {id++;this["event"+id+"Id"]=410;return id;}.bind(this),
		   "jupiterConj" :      function(id) {id++;this["event"+id+"Id"]=420;return id;}.bind(this),
		   "jupiterWestQuad" :  function(id) {id++;this["event"+id+"Id"]=430;return id;}.bind(this),
		   "jupiterOpp" :       function(id) {id++;this["event"+id+"Id"]=440;return id;}.bind(this),
		   "jupiterEastQuad" :  function(id) {id++;this["event"+id+"Id"]=450;return id;}.bind(this),
		   "saturnConj" :       function(id) {id++;this["event"+id+"Id"]=460;return id;}.bind(this),
		   "saturnWestQuad" :   function(id) {id++;this["event"+id+"Id"]=470;return id;}.bind(this),
		   "saturnOpp" :        function(id) {id++;this["event"+id+"Id"]=480;return id;}.bind(this),
		   "saturnEastQuad" :   function(id) {id++;this["event"+id+"Id"]=490;return id;}.bind(this),
		   "mercTransit" :      function(id) {id++;this["event"+id+"Id"]=500;return id;}.bind(this),
		   "venusTransit" :     function(id) {id++;this["event"+id+"Id"]=520;return id;}.bind(this),
		   "lunarEclipseMinMax" : function(id, min,max) {id++;this["event"+id+"Id"]=550;
								 this["event"+id+"Val1"]=min;
								 this["event"+id+"Val2"]=max;return id;}.bind(this),
		   "lunarEclipse" : function(id, min,max) {this["event"+id+"Id"]=560;return id;}.bind(this),
		   "sunEleMax" :    function(id) {id++;this["event"+id+"Id"]=620;return id;}.bind(this),
		   "sunEleMin" :    function(id) {id++;this["event"+id+"Id"]=630;return id;}.bind(this),
		   "civil" :        function(id, min,max) {id++;this["event"+id+"Id"]=640;
							   id++;this["event"+id+"Id"]=650;return id;}.bind(this),
		   "nautical" :     function(id, min,max) {id++;this["event"+id+"Id"]=660;
							   id++;this["event"+id+"Id"]=670;return id;}.bind(this),
		   "astronomical" : function(id, min,max) {id++;this["event"+id+"Id"]=680;
							   id++;this["event"+id+"Id"]=690;return id;}.bind(this),
		   "night" :        function(id, min,max) {id++;this["event"+id+"Id"]=700;
							   id++;this["event"+id+"Id"]=710;return id;}.bind(this),
		   "twilightCivilStart" :        function(id) {id++;this["event"+id+"Id"]=640;return id;}.bind(this),
		   "twilightCivilStop" :         function(id) {id++;this["event"+id+"Id"]=650;return id;}.bind(this),
		   "twilightNauticalStart" :     function(id) {id++;this["event"+id+"Id"]=660;return id;}.bind(this),
		   "twilightNauticalStop" :      function(id) {id++;this["event"+id+"Id"]=670;return id;}.bind(this),
		   "twilightAstronomicalStart" : function(id) {id++;this["event"+id+"Id"]=680;return id;}.bind(this),
		   "twilightAstronomicalStop" :  function(id) {id++;this["event"+id+"Id"]=690;return id;}.bind(this),
		   "nightStart" : function(id) {id++;this["event"+id+"Id"]=700;return id;}.bind(this),
		   "nightStop" :  function(id) {id++;this["event"+id+"Id"]=710;return id;}.bind(this),
		   "sunAzi" :     function(id,target) {id++;this["event"+id+"Id"]=750;
						       this["event"+id+"Val4"]=target;return id;}.bind(this),
		   "sunTime" :    function(id,target) {id++;this["event"+id+"Id"]=760;
						       this["event"+id+"Val4"]=target;return id;}.bind(this),
		   "moonTime" :   function(id,target) {id++;this["event"+id+"Id"]=770;
						       this["event"+id+"Val4"]=target;return id;}.bind(this),
		   "moonRise" :   function(id) {id++;this["event"+id+"Id"]=800;return id;}.bind(this),
		   "moonSet" :    function(id) {id++;this["event"+id+"Id"]=810;return id;}.bind(this),
		   "moonEleMax" : function(id) {id++;this["event"+id+"Id"]=820;return id;}.bind(this),
		   "moonEleMin" : function(id) {id++;this["event"+id+"Id"]=830;return id;}.bind(this),
		   "moonAzi" :    function(id,target) {id++;this["event"+id+"Id"]=840;
						    this["event"+id+"Val4"]=target;return id;}.bind(this),
		   "polarSunDayStart" :   function(id) {id++;this["event"+id+"Id"]=900;return id;}.bind(this),
		   "polarSunDayStop" :    function(id) {id++;this["event"+id+"Id"]=910;return id;}.bind(this),
		   "polarSunNightStart" : function(id) {id++;this["event"+id+"Id"]=920;return id;}.bind(this),
		   "polarSunNightStop" :  function(id) {id++;this["event"+id+"Id"]=930;return id;}.bind(this),
		   "polarMoonDayStart" :  function(id) {id++;this["event"+id+"Id"]=940;return id;}.bind(this),
		   "polarMoonDayStop" :   function(id) {id++;this["event"+id+"Id"]=950;return id;}.bind(this),
		   "polarMoonNightStart" :function(id) {id++;this["event"+id+"Id"]=960;return id;}.bind(this),
		   "polarMoonNightStop" : function(id) {id++;this["event"+id+"Id"]=970;return id;}.bind(this),
		   "sunEclipseMinMax" :   function(id,min,max) {id++;this["event"+id+"Id"]=980;
								this["event"+id+"Val4"]=min;
								this["event"+id+"Val5"]=max;return id;}.bind(this),
		   "sunEclipse" :      function(id) {id++;this["event"+id+"Id"]=990;return id;}.bind(this),
		   "solarSystemTcEf" : function(id,dt) {id++;this["event"+id+"Id"]=1000;
							this["event"+id+"Val4"]=dt;}.bind(this)
		  };
    };
    this.getSortTime = function(localDtg,eventId,reportId) {
	if (eventId === 640 ) { // civil twilight start
	    return localDtg+1;
	} else if (eventId === 650) {
	    return localDtg-1;
	} else {
	    return localDtg;
	}
    }

    //Function called to initialize / create the map.
    //This is called when the page has loaded.
    this.initMap = function() {
	// //console.log("Initialising map.");
	// //The center location of our map.
	// var lat= +(this.lat);
	// var lon= +(this.lon);
	// var centerOfMap = new google.maps.LatLon(lat,lon);
	
	// //Map options.
	// var options = {
	//     mapTypeId: google.maps.MapTypeId.ROADMAP,
	//     mapTypeControl: false,
	//     disableDoubleClickZoom: true,
	//     zoomControlOptions: true,
	//     streetViewControl: false,
	//     center: centerOfMap, //Set center.
	//     zoom: 3 //The zoom value.
	// };

	// //Create the map object.
	// this.map = new google.maps.Map(document.getElementById('map'), options);
	// this.map.setCenter(centerOfMap);

	// var styleOptions = {name: "Dummy Style"};
	// var MAP_STYLE = [{
        //     featureType: "road",
        //     elementType: "all",
        //     stylers: [{ visibility: "on" }]
	// }];
	// var mapType = new google.maps.StyledMapType(MAP_STYLE, styleOptions);
	// this.map.mapTypes.set("Dummy Style", mapType);
	// this.map.setMapTypeId("Dummy Style");

	// var latlon = new google.maps.LatLon(lat,lon);
	// this.marker = new google.maps.marker({
	//     position: latlon,
	//     draggable: true //make it draggable
	// });
	// this.marker.setMap(this.map);
	// google.maps.event.addListener(this.marker, 'dragend', function(event){this.markerLocation();});

	// //Listen for any clicks on the map.
	// google.maps.event.addListener(this.map, 'click', function(event) {                
        //     //Get the location that the user clicked.
        //     var clickedLocation = event.latLon;
        //     //If the marker hasn't been added.
        //     if(this.marker === undefined){
	// 	//Create the marker.
	// 	this.marker = new google.maps.Marker({
        //             position: clickedLocation,
        //             map: this.map,
        //             draggable: true //make it draggable
	// 	});
	// 	//Listen for drag events!
	// 	google.maps.event.addListener(this.marker, 'dragend', function(event){
        //             this.markerLocation();
	// 	});
        //     } else{
	// 	//Marker has already been added, so just change its location.
	// 	this.marker.setPosition(clickedLocation);
        //     }
        //     //Get the marker's location.
        //     this.markerLocation();
	// });
	// //console.log("Initialised map.");
	this.mapReady=true;
    }
    
    //This function will get the marker's current location and then add the lat/long
    //values to our textfields so that we can save the location.
    this.markerLocation = function(){
	//Get location.
	var currentLocation = this.marker.getPosition();
	//Add lat and lon values to a field that we can save.
	document.getElementById('lat').value = currentLocation.lat(); //latitude
	document.getElementById('lon').value = currentLocation.lon(); //longitude
    }
    this.geoloc = function(latitude, longitude)
    {
	this.coords={latitude:latitude,longitude:longitude};
    }    
    this.setMapPosition = function() {
	if (this.mapReady) {
	    // var lat= +(this.lat);
	    // var lon= +(this.lon);
	    // if (lat !== undefined && lon !== undefined) {
	    // 	var latlon = new google.maps.LatLon(lat,lon);
	    // 	this.marker.setPosition(latlon);
	    // 	this.map.setCenter(latlon);   
	    // }
	}
    }

    // //Load the map when the page has finished loading.
    // google.maps.event.addDomListener(window, 'load', this.initMap);
    this.setCookie = function(cname, cvalue, exdays) {
	var d = new moment();
	d=new moment(d.valueOf() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toISOString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    this.getCookie = function(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(name) === 0) return c.substring(name.length,c.length);
	}
	return "";
    } 
    this.updateCost = function(cost) {
	if (cost === -1) {
	    this.totalCost=0;  
	} else {
	    var oldCost=this.getCookie("costCheck")
	    if (oldCost !== "") {
		this.totalCost=oldCost;
	    }
	    this.totalCost=Math.min(99.99,+this.totalCost + (+cost*0.00345));
	}
	// $("#cost").fadeIn(1000);
	this.cost="$"+(+this.totalCost).toFixed(2);
	this.setCookie("costCheck",this.totalCost,365);
    }
    this.minus = function() {
	this.dtime=Math.max(1,this.dtime-1);
	if (this.targetSet) {
	    this.setEndDate(this.modelTime);
	} else {
	    this.setEndDate(Date.now());
	}
    }
    this.pluss = function() {
	this.dtime=Math.min(365,this.dtime+1);
	if (this.targetSet) {
	    this.setEndDate(this.modelTime);
	} else {
	    this.setEndDate(Date.now());
	}
    }
    this.setTargetDateOld = function(target) {
	var tzoffset = (new moment(target)).getTimezoneOffset() * 60000; //offset in milliseconds
	var dtg=new moment(target - tzoffset).toISOString();
	var d=dtg.substring(0,10);
	var t=dtg.substring(11,19);
	this.start_dt=d;
	this.start_tm=t;
    }
    this.startfocus = function() {
	this.targetSet=true;
    }
    this.startblur = function() {
	this.targetSet=true;
	var dtg=this.start_dt+"T"+this.start_tm+"Z"
	var tzoffset = (new moment(dtg)).getTimezoneOffset() * 60000; //offset in milliseconds
	this.modelTime=new moment(dtg).valueOf()+tzoffset;
	this.setEndDate(this.modelTime);
    }
    this.setEndDate = function(target) {
	var tzoffset = (new moment(target)).getTimezoneOffset() * 60000; //offset in milliseconds
	var dtg=new moment(target - tzoffset + this.dtime*86400000).toISOString();
	var d=dtg.substring(0,10);
	this.end_dt=d;
    }
    this.getData2 = function(state) {
	var d=new moment();
	var now=d.valueOf();
	this.eventTime=now-1000;
	//var pos = new geoloc(this.lat, 
	//		     this.lon); 
	var pos = undefined;
	this.setPositionData(state,pos);
    }
    this.searchPosition = function(state) {
	// var string=this.search;
	// var geocoder = new google.maps.Geocoder();
	// geocoder.geocode(
	//     {"address": string},
	//     function(results, status) {
	// 	if (status === google.maps.GeocoderStatus.OK) {
	// 	    var loc=results[0].geometry.location;
	// 	    var pos = new geoloc(loc.lat(),loc.lon()); 
	// 	    this.setPosition( pos );
	// 	}
	//     }
	// );
    }
    this.getPosition = function(state) {
	// if (navigator.geolocation) {
	//     //console.log("Getting position.");
	//     navigator.geolocation.getCurrentPosition(this.setPosition);
	// }
    }
    this.setPosition = function(state,position) {
	this.lat=position.coords.latitude;
	this.lon=position.coords.longitude;
	this.positionIsSet=true;
	this.setMapPosition();
    }
    this.getPositionData = function(state) {
	// if (navigator.geolocation) {
	//     navigator.geolocation.getCurrentPosition(this.setPositionData);
	// }
    }
    this.checkEnd = function(state) {
	// disable end-time...
	if (!this.prev(state) && !this.getNext(state)) {
	    // this.end_p.style.display = "block";
	    // this.end_m.style.display = "block";
	    // this.end_dt.style.display = "block";
	    //$("#end_m").fadeIn();
	} else {
	    // this.end_p.style.display = "none";
	    // this.end_m.style.display = "none";
	    // this.end_dt.style.display = "none";
	    //$("#end_dt").fadeOut();
	}
    }
    this.getTarget = function(id) {
	var ret;
	if ((id >= 200 && id <= 299)||
	    (id >= 550 && id <= 570)||
	    (id >= 770 && id <= 840)) {
	    ret="moon";
	} else if ((id >= 300 && id <= 330) || 
		   (id >= 500 && id <= 510)) {
	    ret="mercury";
	} else if ((id >= 340 && id <= 370) || 
		   (id >= 520 && id <= 530)) {
	    ret="venus";
	} else if (id >= 390 && id <= 410) {
	    ret="mars";
	} else if (id >= 420 && id <= 450) {
	    ret="jupiter";
	} else if (id >= 460 && id <= 490) {
	    ret="saturn";
	} else {
	    ret="sun";
	}
	return ret;
    }
    this.getFov = function(id) {
	var ret;
	if ((id >= 200 && id <= 299)||
	    (id >= 550 && id <= 570)||
	    (id >= 770 && id <= 840)||
            (id >= 980 && id <= 999)) {
	    ret=0.05;
	} else if ((id >= 300 && id <= 330) || 
		   (id >= 500 && id <= 510)) {
	    ret=0.01;
	} else if ((id >= 340 && id <= 370) || 
		   (id >= 520 && id <= 530)) {
	    ret=0.01;
	} else if (id >= 390 && id <= 410) {
	    ret=0.01;
	} else if (id >= 420 && id <= 450) {
	    ret=0.01;
	} else if (id >= 460 && id <= 490) {
	    ret=0.01;
	} else {
	    ret=0.5;
	}
	return ret;
    }
    this.init_old = function(state) {
	// read cookies
	var masterCookie=this.getCookie("cookieCheck");
	if ( masterCookie === "t") {
	    this.setUpdate(state,this.getCookie("updateCheck") === "t");
	    this.setPrev(state,this.getCookie("previousCheck") === "t");
	    this.setNext(state,this.getCookie("nextCheck") === "t");
	    this.events.forEach(function(x,i) {
		if (this.getCookie(x) === "t") {
		    this.criteria[x]=true;
		}
	    });
	    var lat=this.getCookie("latitudeCheck");
	    var lon=this.getCookie("longitudeCheck");
	    if (lat !== "" && lon !== "") {
		this.lat=lat;
		this.lon=lon;
		this.positionIsSet=true;
	    }
	    this.updateCost(0);
	}
	this.checkEnd();
    }
    this.unique = function(array) {
	var a = array.concat();
	for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
		//[localDtg,eventId,reportId,reportVal,reportHint]
		if(Math.abs(a[i][0]-a[j][0]) < 2000 && a[i][1] === a[j][1] &&a[i][2] === a[j][2])
                    a.splice(j--, 1);
            }
	}
	return a;
    };
    this.nice = function(date) {
	var yyyy = date.getFullYear().toString();
	var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = date.getDate().toString();
	var hh  = date.getHours().toString();
	var mi  = date.getMinutes().toString();
	var ss  = date.getSeconds().toString();
	return yyyy+"-"+(mm[1]?mm:"0"+mm[0])+"-"+(dd[1]?dd:"0"+dd[0])+" "
	    +(hh[1]?hh:"0"+hh[0])+":"+(mi[1]?mi:"0"+mi[0])+":"+(ss[1]?ss:"0"+ss[0]); // padding
    };
    this.clean = function(array,deleteValue) {
	for (var i = 0; i < array.length; i++) {
	    if (array[i] === deleteValue) {         
		array.splice(i, 1);
		i--;
	    }
	}
	return array;
    };
    this.playAudio = function(state,beep) {
        var playPromise;
        if (beep !== undefined) {
            // beep.muted=true;
	    //console.log("Playing...");
            playPromise=beep.play();
        } else {
            console.log("Invalid sounds...");
        };
        if (playPromise !== undefined) {
            playPromise
                .then(_ => {
                    console.log("Audio played.");
                })
                .catch(error => {
                    if (error.name === "NotAllowedError") {
                        state.Html.broadcast(state,"Audio permission denied.",'warning');
                    } else {
                        state.Html.broadcast(state,"Unable to play audio.",'warning');
                    }
                    console.log("playback prevented." );
                });
        } else {
            console.log("No sound available...");
        }
    }; // .bind(this)
};

export default Events;
