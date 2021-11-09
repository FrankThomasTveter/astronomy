//console.log("Loading AstroLib.js");
// $(".anydate").AnyTime_picker( {
//     format:  "%Y-%m-%d",
//     formatUtcOffset: "%: (%@)"} );
// $(".anytime").AnyTime_picker( {
//     format: "%H:%i:%s",
//     formatUtcOffset: "%: (%@)"} );
import moment from 'moment';
function Astro() {
    this.bdeb=false;
    this.rawData = [];
    //
    // old html-stuff....
    //this.start_dt=undefined;
    //this.start_tm=undefined;
    //this.end_p=undefined;
    //this.end_m=undefined;
    //this.end_dt=undefined;
    //
    this.lat=60.0;             // latitude
    this.lng=10.0;             // longitude
    this.lastLat=999;
    this.lastLon=999;
    this.updateCheck=false;    // auto load data
    this.previousCheck=false;  // should we search for previous?
    this.nextCheck=false;      // should we search for next?
    this.endDt=1;              // time difference between start and end
    this.speed=1.0;
    this.cost=0;
    this.delay=500;
    //
    this.targetSet=false;      // is a target time set?
    this.targetId=undefined;   // target time event id
    this.targetTime=new moment().valueOf();   // target time is now
    this.targetUpdate=this.targetTime;        // last target time update
    this.playing=true;
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
		 "astronomical","night","polarDayStart","polarDayStop","polarNightStart",
		 "polarNightStop","sunEclipse","moonRise","moonSet","moonEleMax","moonEleMin",
		 "lunarDayStart","lunarDayStop","lunarNightStart","lunarNightStop","moonNew",
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
		{value: "SouthSolstice",label:"Southern solstice"},
		{value: "AscSolarEquinox",label:"Ascending equinox"},
		{value: "NorthSolstice",label:"Northern solstice"},
		{value: "DescSolarEquinox",label:"Descending equinox"},
		{value: "EarthPerihelion",label:"Periheilion"},
		{value: "EarthAphelion",label:"Aphelion"}
	    ]},
	    { value:"sunPolar", label:"Polar effects",children:[
		{value: "polarDayStart",label:"Polar day start"},
		{value: "polarDayStop",label:"Polar day stop"},
		{value: "polarNightStart",label:"Polar night start"},
		{value: "polarNightStop",label:"Polar night stop"}
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

		{value: "lunarDayStart",label:"Lunar day start"},
		{value: "lunarDayStop",label:"Lunar day stop"},
		{value: "lunarNightStart",label:"Lunar night start"},
		{value: "lunarNightStop",label:"Lunar night stop"}
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
    //
    this.beep0s = new Audio("media/beep0s.mp3");
    this.beep1s = new Audio("media/beep1s.mp3");
    this.beep2s = new Audio("media/beep2s.mp3");
    this.beep3s = new Audio("media/beep3s.mp3");
    this.beep10s = new Audio("media/beep10s.mp3");
    this.beep1m = new Audio("media/beep1m.mp3");
    this.lastTime=new moment().valueOf();
    this.lastCnt=0;
    this.dtime=1;
    this.documentLog = this.log;
    this.documentPos = this.pos;
    this.initialise=true;
    this.positionIsSet=false;
    this.totalCost=0.00;
    this.window3D=undefined;
    this.map=undefined; //Will contain map object.
    this.marker=undefined; //Has the user plotted their location marker? 
    this.show=function(state,type) {
	if (this.visible[type] === undefined) { this.visible[type]=false;}
	return this.visible[type];
    }.bind(this);
    this.toggle=function(state,type) {
	if (this.visible[type] === undefined) { this.visible[type]=false;}
	this.visible[type]=! this.visible[type];
	state.Show.showDataset(state,true);
	return this.visible[type];
    }.bind(this);
    this.init=function(state){
	//state.Utils.init("Database",this);
    };
    this.isPlaying=function(state) {
	return state.Astro.playing;
    };
    this.togglePlay=function(state) {
	var now=new moment().valueOf();
	if (state.Astro.isPlaying(state)) { // stop clock
	    this.updateTime(state);
	    state.Astro.playing=false;
	} else { // start clock
	    state.Astro.targetUpdate=now;
	    state.Astro.playing=true;
	};
    };
    this.setSpeed=function(state,speed) {
	this.updateTime(state);
	state.Astro.speed=speed;
	//console.log("Speed:",state.Astro.speed);
    };
    this.getSpeed=function(state) {
	return state.Astro.speed;
    };
    this.rewind=function(state) {
	state.Astro.increment(state,-state.Astro.speed*1000);
    };
    this.forward=function(state) {
	state.Astro.increment(state,+state.Astro.speed*1000);
    };
    this.increment=function(state,dt) {
	state.Astro.targetTime=state.Astro.targetTime+dt;
    };
    this.updateLoop=function(state) {
	if (this.bdeb) {console.log("Updating Astro...");}
	if (state.Astro.isPlaying(state)) {
	    this.updateTime(state);
	    state.Show.showTime(state);
	    state.Show.showEvents(state);
	};
	setTimeout(function() {
	    state.Astro.updateLoop(state)
	},state.Astro.delay);
    }.bind(this);
    this.updateTime=function(state) {
	var now=new moment().valueOf();
	if (state.Astro.isPlaying(state)) {
	    var doff=now-state.Astro.targetUpdate;
	    state.Astro.increment(state,doff*state.Astro.speed);
	    state.Astro.targetUpdate=now;
	};
	return state.Astro.targetDate;
    };
    this.getTargetDate=function(state) {
	return new moment(state.Astro.targetTime);
    };
    this.setTargetDate=function(state,date) {
	if (date!==undefined) {
	    state.Astro.targetTime=date.valueOf();
	    state.Astro.targetUpdate=new moment().valueOf();
	};
    };

    this.getNodes=function(state) {
	return state.Astro.nodes;
    };
    this.getExpanded=function(state) {
	return state.Astro.expanded;
    };
    this.setExpanded=function(state,expanded) {
	state.Astro.expanded=expanded;
	console.log("Expanded:",expanded);
    };
    this.getChecked=function(state) {
	return Object.keys(state.Astro.criteria);
    };
    this.setChecked=function(state,checked) {
	var criteria={};
	checked.forEach((x,i) => {criteria[x]=true;});
	state.Astro.criteria=criteria;
    };
    //
    // this.updateTime=function(state) {
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

    this.getData=function(state) {
	var req=this.getRequest(state);	


    };

    this.getRequest=function(state,replace) {
	//console.log("Updating data.");
	var now=new moment().valueOf();
	var req=new this.request();
	var requestTime=now;
	var replace=true;
	if (this.targetSet) {replace=false;requestTime=this.targetTime;};
	req.addDebug();
	req.addPosition("",state.Astro.lat,state.Astro.lon,0)
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
    this.addEvents=function(state,req) {
	if (this.getUpdate(state)){this.setCookie("updateCheck","t",10);}    else {this.setCookie("updateCheck","f",0);};
	if (this.getPrev(state))  {this.setCookie("previousCheck","t",10);}  else {this.setCookie("previousCheck","f",0);};
	if (this.getNext(state))  {this.setCookie("nextCheck","t",10);}      else {this.setCookie("nextCheck","f",0);};
	var id=1;
	state.Astro.events.forEach(function(x,i) {
	    if (state.Astro.criteria[x]) {
		this.setCookie(x,"t",10);
		req.add[x](id++);
	    } else {
		this.setCookie(x,"f",10);
	    };
	});
	this.setCookie("latitudeCheck",this.lat,10)
	this.setCookie("longitudeCheck",this.lng,10)
	return id-1;
    };

    this.processData=function(data) {
    };
    this.setPositionData=function(state,position) {
	this.setPosition(position);
	var newpos=this.isNewPos(position.coords.latitude,position.coords.longitude);
	var d=new moment();
	var now=d.valueOf();
	//console.log("Got position."+this.targetUpdate+"  "+now);
	if (newpos || this.targetUpdate < now) {
	    this.lastUpdate=now+10000; 
	    //console.log("Updating data.");
	    var req=new this.request();
	    var dt = 86400000.0;
	    var requestTime=now;
	    var replace=true;
	    if (this.targetSet) {replace=false;requestTime=this.targetTime;};
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
		this.documentLog.innerHTML = "<em>Server-request: sent</em>";
		console.log("Sending event-request :",req);
		if (replace) {
		    // $.get("cgi-bin/event.pl",req,function(data, status){dataToArray(data,status,1,this.documentLog);});
		} else {
		    // $.get("cgi-bin/event.pl",req,function(data, status){addDataToArray(data,status,1,this.documentLog);});
		}
	    } else {
		this.clearArray();
	    }
	}
    };
    this.setEndDt=function(state,dt) {
	state.Astro.endDt=dt;
    };
    this.getEndDt=function (state) {
	return state.Astro.endDt;
    };
    this.getUpdate=function(state) {
	return state.Astro.updateCheck;
    };
    this.setUpdate=function(state,update) {
	state.Astro.updateCheck=update;
    };
    this.getPrev=function(state) {
	return state.Astro.previousCheck;
    };
    this.setPrev=function(state,prev) {
	state.Astro.previousCheck=prev;
    };
    this.getNext=function(state) {
	return state.Astro.nextCheck;
    };
    this.setNext=function(state,next) {
	state.Astro.nextCheck=next;
    };
    this.getLat=function(state) {
	return state.Astro.lat;
    };
    this.setLat=function(state,lat) {
	state.Astro.lat=lat;
    };
    this.getLon=function(state) {
	return state.Astro.lng;
    };
    this.setLon=function(state,lon) {
	state.Astro.lng=lon;
    };
    this.setTargetDateOld=function(target) {
	var tzoffset = (new moment(target)).getTimezoneOffset() * 60000; //offset in milliseconds
	var dtg=new moment(target - tzoffset).toISOString();
	var d=dtg.substring(0,10);
	var t=dtg.substring(11,19);
	this.start_dt=d;
	this.start_tm=t;
    };
    this.increaseEndDt=function(state) {
	state.Astro.endDt=Math.min(99,state.Astro.endDt+1);
    };
    this.decreaseEndDt=function(state) {
	state.Astro.endDt=Math.max(1,state.Astro.endDt-1);
    };
    this.getEndDt=function(state) {
	return state.Astro.endDt;
    };
    this.drawData=function (documentTable, id) {
	if (this.rawData[id] === undefined) {
	    documentTable.innerHTML="<em>No data available.</em>";
	} else {
	    var d=new moment();
	    var now=d.valueOf();
	    var cellCnt=4;
	    var reportCnt=0;
	    var documentReportCnt=documentTable.rows.length;
	    this.clean(this.rawData[id],undefined);
	    var dataReportsCnt=this.rawData[id].length;
	    if (dataReportsCnt !== documentReportCnt) {
		//console.log("Must redraw."+dataReportsCnt+" "+documentReportCnt);
		this.drawAll=true;
	    };
	    if (this.drawAll && documentReportCnt === 0) {
		documentTable.innerHTML="";
	    };
	    for (var jj=0; jj< dataReportsCnt;jj++) {
		if (this.drawAll) {
		    if (reportCnt >= documentReportCnt) { // create row
			//console.log("Report:"+reportCnt+"  "+jj+" "+dataReportsCnt+this.rawData[id][jj][0]);
			var row=documentTable.insertRow(reportCnt);
			for (var kk=0; kk < cellCnt;kk++) {
			    var cell=row.insertCell(kk);
			    cell.innerHTML="init"+reportCnt;
			}
		    };
		};
		var dataReport=this.rawData[id][jj];
		var documentReport=documentTable.rows[reportCnt];
		var documentCells=documentReport.cells;
		var t=new moment(dataReport[0]);
		var repid=dataReport[3];
		if (this.drawAll) {
                    //console.log("Drawing buttons.");
 		    documentCells[0].innerHTML="<button class=\"delete\" onclick=\"deleteRow("+
			id+","+reportCnt+")\">X</button>";
		    documentCells[1].innerHTML="<button class=\"hot\" onclick=\"setTarget("+
			(t*1)+","+(repid)+")\">"+this.nice(t)+"</button>";
		    //console.log("drawing button:"+this.nice(t));
		}
		var dt=t-now;
		if (this.targetSet) {dt=t-this.targetTime;}
		documentCells[2].innerHTML=this.getTimeDiff(dt);
		//documentCells[4].innerHTML=dataReport[0];
		if (this.drawAll) {
		    documentCells[3].innerHTML="<button class=\"launch\" onclick=\"setTargetId("+
			(t*1)+","+(repid)+");launch3D();\">"+dataReport[5].substring(20)+"</button>";
		    //documentCells[3].innerHTML=dataReport[5].substring(20);
		}
		if (Math.abs(dt) < 1100) {
		    documentReport.style.backgroundColor="#FFFFFF";
		} else if (dt < 0) {
		    documentReport.style.backgroundColor="#AAAAAA";
		} else {
		    documentReport.style.backgroundColor="#00FF00";
		}
		reportCnt=reportCnt+1;
	    }
	    if (this.drawAll) {
		if (documentReportCnt > reportCnt) {
		    for (var ii=documentReportCnt-1; ii>= reportCnt;ii--) {
			documentTable.deleteRow(ii);
		    }
		}
	    }
	    if (this.drawAll && reportCnt === 0) {
		documentTable.innerHTML="<em>No data available.</em>";
	    }
	    if (this.drawAll) {
		this.drawAll=false;
		//console.log("Stopped redrawing."+documentTable.rows.length);
	    }
	    //console.log(this.rawData[id][0][0]);
	    // documentPos.innerHTML="Data:" + this.rawData[id];
	}
    }
    this.deleteRow=function(id,row) {
	//console.log("Deleting row:"+row);
	this.this.rawData[id][row]=undefined;
	this.drawAll=true;
    }
    this.setTarget=function(tt,id) {
	//console.log("Setting target to:"+tt+" "+this.targetSet);
	if (this.targetSet && tt === this.targetTime) {
	    this.targetSet=false;
	    this.targetId=undefined;
	} else {
	    this.targetSet=true;
	    this.targetTime=tt;
	    this.setTargetDateOld(this.targetTime);
	    this.setEndDate(this.targetTime);
	    this.targetId=id;
	}
    }
    this.setTargetId=function(tt,id) {
	//console.log("Setting target to:"+tt+" "+this.targetSet);
	this.targetSet=true;
	this.targetTime=tt;
	this.setTargetDateOld(this.targetTime);
	this.setEndDate(this.targetTime);
	this.targetId=id;
    }

    this.getTimeDiff=function(dt) {
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
	if (dt<0) {
	    s="-";
	} else if (dt > 0) {
	    s="+";
	} else {
	    s="0";
	}
	if (dd !== 0) s=s+" "+this.numberWithCommas(dd)+"d";
	if (hh !== 0) s=s+" "+hh+"h";
	if (mm !== 0) s=s+" "+mm+"m";
	if (ss !== 0) s=s+" "+ss+"s";
	return s;
    }

    this.numberWithCommas=function(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    this.isNewPos=function(lat,lon) {
	var ret= (Math.abs(this.lastLat-lat)+Math.abs(this.lastLon-lon) > 1./40000000.0);
	//console.log("Lat:"+lat+" Lon:"+lon+"  "+ret);
	if (ret) {
	    this.lastLat=lat;
	    this.lastLon=lon;
	}
	return ret;
    }
    this.addDataToArray=function(data,status,id,documentLog) {
	//console.log("adding data to array.");
	if (this.rawData[id] !== undefined) {
	    this.dataToArray(data,status,id+1,documentLog);
	    this.dataMerge(id,id+1);
	} else {
	    this.dataToArray(data,status,id,documentLog);
	}
    }
    this.dataMerge=function(id1,id2) {
	this.rawData[id1]=this.unique(this.rawData[id1].concat(this.rawData[id2])).sort(function(a, b){return a[0]-b[0]});
    }
    this.clearArray=function() {
	this.rawData = [];
	this.drawAll=true;
    }
    this.dataToArray=function(data,status,id,documentLog) {
	this.lastCnt=1;
	if (status === "success") {
	    var d=new moment();
	    var now=d.valueOf();
	    //console.log("Adding data to array-id="+id);
	    if (this.rawData[id] === undefined) {
		this.rawData[id]=[];
	    }
	    var cnt=0;
	    var log="";
	    this.targetUpdate=new moment("3000-01-01T00:00:00.000Z").valueOf();
	    var events=data.getElementsByTagName("Event");
	    var len=this.rawData[id].length;
	    for (var ii = 0; ii < events.length; ii++) {
		var event=events[ii];
		var eventSeq = event.getAttribute("Seq");
		var eventId = event.getAttribute("Id");
		var eventStart = event.getAttribute("Start");
		var eventSearch = event.getAttribute("Search");
		var eventStop = event.getAttribute("Stop");
		var eventVal1 = event.getAttribute("Val1");
		var eventVal2 = event.getAttribute("Val2");
		var eventVal3 = event.getAttribute("Val3");
		var eventReports = event.getAttribute("reports");
		var costms=event.getAttribute("cost");
		var reports=event.getElementsByTagName("Report");
		var cost = 0;
		if (costms.length > 0) cost=costms.match(/^[\d\.]+/g);
		this.updateCost(cost);
		for (var jj = 0; jj < reports.length; jj++) {
		    var report=reports[jj];
		    var error=report.getAttribute("error");
		    if (error === null) {
			var reportDtg=report.getAttribute("time");
			var t=new moment(reportDtg);
			var localDtg=t.valueOf();
			//console.log("Got date: "+reportDtg+" => "+localDtg);
			if (localDtg > now) {
			    if (this.targetUpdate < now || localDtg < this.targetUpdate ) {
				this.targetUpdate=localDtg;
			    };
			}
			var reportId=report.getAttribute("repId");
			var reportVal=report.getAttribute("repVal");
			var reportHint=report.getAttribute("hint");
			var localSort=this.getSortTime(localDtg,eventId,reportId);
			this.rawData[id][cnt++]=[localDtg,localSort,eventId,reportId,reportVal,reportHint];
		    } else {
			var hint=report.getAttribute("hint");
			log="<em>Server-request:"+hint+"</em>";
		    };
		};
	    };
	    if (cnt < len) {this.rawData[id].splice(cnt, len-cnt);}
	    this.rawData[id].sort(function(a, b){return a[1]-b[1]});
	    this.drawAll=true;
	    //console.log("Added data to array-id="+id+" "+this.rawData[id].length);
	    documentLog.innerHTML = log;
	} else {
	    documentLog.innerHTML = "<em>Server-request:"+status+"</em>";
	}
    }

    this.request=function() {
	this.wipe             = function () {var obj=Object.keys(this);for (var ii=0; ii<obj.length;ii++) 
					      {if (! obj[ii].match(/^event/g) && ! obj[ii].match(/^debug/g)) {delete this[obj[ii]];}}}
	this.addDebug          = function(id,val) {this["debug"]=1;};
	this.addSearch         = function(id,val) {this["event"+id+"Search"]=val;};
	this.addStartTime      = function(id,val) {this["event"+id+"Start"]=val;};
	this.addStopTime       = function(id,val) {this["event"+id+"Stop"]=val;};
	this.addPosition       = function(id,lat,lon,hgt) {this["event"+id+"Val1"]=lat;
							   this["event"+id+"Val2"]=lon;
							   this["event"+id+"Val3"]=hgt;}
	this.add={"sunRise" : function(id) {this["event"+id+"Id"]=600;},		  
		  "SunSet" : function(id) {this["event"+id+"Id"]=610;},
		  "MoonState" : function(id) {this["event"+id+"Id"]=100;},
		  "MoonTcEf" : function(id,dt) {this["event"+id+"Id"]=110;
						this["event"+id+"Val4"]=dt;},
		  "SunState" : function(id) {this["event"+id+"Id"]=120;},
		  "SunVisible" : function(id) {this["event"+id+"Id"]=125;},
		  "SunTcEf" : function(id,dt) {this["event"+id+"Id"]=130;
					       this["event"+id+"Val4"]=dt;},
		  "SouthSolstice" : function(id) {this["event"+id+"Id"]=150;},
		  "AscSolarEquinox" : function(id) {this["event"+id+"Id"]=160;},
		  "NorthSolstice" : function(id) {this["event"+id+"Id"]=170;},
		  "DescSolarEquinox" : function(id) {this["event"+id+"Id"]=180;},
		  "EarthPerihelion" : function(id) {this["event"+id+"Id"]=190;},
		  "EarthAphelion" : function(id) {this["event"+id+"Id"]=195;},
		  
		  "SouthLunastice" : function(id) {this["event"+id+"Id"]=290;},
		  "AscLunarEquinox" : function(id) {this["event"+id+"Id"]=292;},
		  "NorthLunastice" : function(id) {this["event"+id+"Id"]=294;},
		  "DescLunarEquinox" : function(id) {this["event"+id+"Id"]=296;},
		  "MoonPerigee" : function(id) {this["event"+id+"Id"]=200;},
		  "MoonApogee" : function(id) {this["event"+id+"Id"]=205;},
		  "MoonNew" : function(id) {this["event"+id+"Id"]=210;},
		  "MoonFirstQuart" : function(id) {this["event"+id+"Id"]=220;},
		  "MoonFull" : function(id) {this["event"+id+"Id"]=230;},
		  "MoonLastQuart" : function(id) {this["event"+id+"Id"]=240;},
		  "MoonPhase" : function(id) {this["event"+id+"Id"]=250;},
		  "MoonIllMin" : function(id) {this["event"+id+"Id"]=260;},
		  "MoonIllMax" : function(id) {this["event"+id+"Id"]=270;},
		  "MoonIll" : function(id,val) {this["event"+id+"Id"]=280;},
		  "MercInfConj" : function(id) {this["event"+id+"Id"]=300;},
		  "MercSupConj" : function(id) {this["event"+id+"Id"]=310;},
		  "MercWestElong" : function(id) {this["event"+id+"Id"]=320;},
		  "MercEastElong" : function(id) {this["event"+id+"Id"]=330;},
		  "VenusInfConj" : function(id) {this["event"+id+"Id"]=340;},
		  "VenusWestElong" : function(id) {this["event"+id+"Id"]=350;},
		  "VenusSupConj" : function(id) {this["event"+id+"Id"]=360;},
		  "VenusEastElong" : function(id) {this["event"+id+"Id"]=370;},
		  "MarsConj" : function(id) {this["event"+id+"Id"]=380;},
		  "MarsWestQuad" : function(id) {this["event"+id+"Id"]=390;},
		  "MarsOpp" : function(id) {this["event"+id+"Id"]=400;},
		  "MarsEastQuad" : function(id) {this["event"+id+"Id"]=410;},
		  "JupiterConj" : function(id) {this["event"+id+"Id"]=420;},
		  "JupiterWestQuad" : function(id) {this["event"+id+"Id"]=430;},
		  "JupiterOpp" : function(id) {this["event"+id+"Id"]=440;},
		  "JupiterEastQuad" : function(id) {this["event"+id+"Id"]=450;},
		  "SaturnConj" : function(id) {this["event"+id+"Id"]=460;},
		  "SaturnWestQuad" : function(id) {this["event"+id+"Id"]=470;},
		  "SaturnOpp" : function(id) {this["event"+id+"Id"]=480;},
		  "SaturnEastQuad" : function(id) {this["event"+id+"Id"]=490;},
		  "MercTransit" : function(id) {this["event"+id+"Id"]=500;},
		  "VenusTransit" : function(id) {this["event"+id+"Id"]=520;},
		  "LunarEclipseMinMax" : function(id, min,max) {this["event"+id+"Id"]=550;
								this["event"+id+"Val1"]=min;
								this["event"+id+"Val2"]=max;},
		  "LunarEclipse" : function(id, min,max) {this["event"+id+"Id"]=560;},
		  "SunEleMax" : function(id) {this["event"+id+"Id"]=620;},
		  "SunEleMin" : function(id) {this["event"+id+"Id"]=630;},
		  "TwilightCivilStart" : function(id) {this["event"+id+"Id"]=640;},
		  "TwilightCivilStop" : function(id) {this["event"+id+"Id"]=650;},
		  "TwilightNauticalStart" : function(id) {this["event"+id+"Id"]=660;},
		  "TwilightNauticalStop" : function(id) {this["event"+id+"Id"]=670;},
		  "TwilightAstronomicalStart" : function(id) {this["event"+id+"Id"]=680;},
		  "TwilightAstronomicalStop" : function(id) {this["event"+id+"Id"]=690;},
		  "NightStart" : function(id) {this["event"+id+"Id"]=700;},
		  "NightStop" : function(id) {this["event"+id+"Id"]=710;},
		  "SunAzi" : function(id,target) {this["event"+id+"Id"]=750;
						  this["event"+id+"Val4"]=target;},
		  "SunTime" : function(id,target) {this["event"+id+"Id"]=760;
						   this["event"+id+"Val4"]=target;},
		  "MoonTime" : function(id,target) {this["event"+id+"Id"]=770;
						    this["event"+id+"Val4"]=target;},
		  "MoonRise" : function(id) {this["event"+id+"Id"]=800;},
		  "MoonSet" : function(id) {this["event"+id+"Id"]=810;},
		  "MoonEleMax" : function(id) {this["event"+id+"Id"]=820;},
		  "MoonEleMin" : function(id) {this["event"+id+"Id"]=830;},
		  "MoonAzi" : function(id,target) {this["event"+id+"Id"]=840;
						   this["event"+id+"Val4"]=target;},
		  "PolarSunDayStart" : function(id) {this["event"+id+"Id"]=900;},
		  "PolarSunDayStop" : function(id) {this["event"+id+"Id"]=910;},
		  "PolarSunNightStart" : function(id) {this["event"+id+"Id"]=920;},
		  "PolarSunNightStop" : function(id) {this["event"+id+"Id"]=930;},
		  "PolarMoonDayStart" : function(id) {this["event"+id+"Id"]=940;},
		  "PolarMoonDayStop" : function(id) {this["event"+id+"Id"]=950;},
		  "PolarMoonNightStart" : function(id) {this["event"+id+"Id"]=960;},
		  "PolarMoonNightStop" : function(id) {this["event"+id+"Id"]=970;},
		  "SunEclipseMinMax" : function(id,min,max) {this["event"+id+"Id"]=980;
							     this["event"+id+"Val4"]=min;
							     this["event"+id+"Val5"]=max;},
		  "SunEclipse" : function(id) {this["event"+id+"Id"]=990;},
		  "SolarSystemTcEf" : function(id,dt) {this["event"+id+"Id"]=1000;
						       this["event"+id+"Val4"]=dt;}
		 };
    };
    this.getSortTime=function(localDtg,eventId,reportId) {
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
    this.initMap=function() {
	// //console.log("Initialising map.");
	// //The center location of our map.
	// var lat= +(this.lat);
	// var lng= +(this.lng);
	// var centerOfMap = new google.maps.LatLng(lat,lng);
	
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

	// var latlng = new google.maps.LatLng(lat,lng);
	// this.marker = new google.maps.marker({
	//     position: latlng,
	//     draggable: true //make it draggable
	// });
	// this.marker.setMap(this.map);
	// google.maps.event.addListener(this.marker, 'dragend', function(event){this.markerLocation();});

	// //Listen for any clicks on the map.
	// google.maps.event.addListener(this.map, 'click', function(event) {                
        //     //Get the location that the user clicked.
        //     var clickedLocation = event.latLng;
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
    this.markerLocation=function(){
	//Get location.
	var currentLocation = this.marker.getPosition();
	//Add lat and lng values to a field that we can save.
	document.getElementById('lat').value = currentLocation.lat(); //latitude
	document.getElementById('lng').value = currentLocation.lng(); //longitude
    }
    this.geoloc=function(latitude, longitude)
    {
	this.coords={latitude:latitude,longitude:longitude};
    }    
    this.setMapPosition=function() {
	if (this.mapReady) {
	    // var lat= +(this.lat);
	    // var lng= +(this.lng);
	    // if (lat !== undefined && lng !== undefined) {
	    // 	var latlng = new google.maps.LatLng(lat,lng);
	    // 	this.marker.setPosition(latlng);
	    // 	this.map.setCenter(latlng);   
	    // }
	}
    }

    // //Load the map when the page has finished loading.
    // google.maps.event.addDomListener(window, 'load', this.initMap);
    this.setCookie=function(cname, cvalue, exdays) {
	var d = new moment();
	d.setTime(d.valueOf() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    this.getCookie=function(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(name) === 0) return c.substring(name.length,c.length);
	}
	return "";
    } 
    this.countdown=function() {
	var state=undefined;
	if (this.initialise) {this.init();this.initialise=false;}
	var d=new moment();
	var now=d.valueOf();
	var updateData = this.getUpdate(state);
	// load position + load data
	if (this.updateData && (now-this.lastUpdate) > 10000*this.lastCnt && 
            (now-this.targetUpdate) > 10000 && this.lastCnt < 10) {
            //console.log("Updating position.");
            this.lastUpdate=now;
            this.lastCnt++;
	    if (this.positionIsSet) {
		this.getData(state);
	    } else {
		this.getPositionData(state);
	    }
	} else {
	    if (now - this.lastTime > 1000)  {                                            // code suspended during event 
	    } else if (this.targetUpdate-999 > this.lastTime & this.targetUpdate-999 < now) {       // T   0s
		this.beep0s.play();
	    } else if (this.targetUpdate-1999 > this.lastTime & this.targetUpdate-1999 < now) {	  // T -1s
		this.beep1s.play();
	    } else if (this.targetUpdate-2999 > this.lastTime & this.targetUpdate-2999 < now) {	  // T -2s
		this.beep2s.play();
	    } else if (this.targetUpdate-3999 > this.lastTime & this.targetUpdate-3999 < now) {	  // T -3s
		this.beep3s.play();
	    } else if (this.targetUpdate-10999 > this.lastTime & this.targetUpdate-10999 < now) {	  // T -10s
		this.beep10s.play();
	    } else if (this.targetUpdate-60999 > this.lastTime & this.targetUpdate-60999 < now) {	  // T -60s
		this.beep1m.play();
	    }
	    this.lastTime=now;
	}
	if (! this.targetSet) {
	    now=Date.now();
	    this.setTargetDateOld(now);
	    this.setEndDate(now);
	}
	var documentTable = this.dataTable;
	this.drawData(documentTable,1);
	setTimeout(this.countdown,500);
    }
    this.updateCost=function(cost) {
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
	this.cost.innerHTML="$"+(+this.totalCost).toFixed(2);
	this.setCookie("costCheck",this.totalCost,365);
    }
    this.minus=function() {
	this.dtime=Math.max(1,this.dtime-1);
	if (this.targetSet) {
	    this.setEndDate(this.targetTime);
	} else {
	    this.setEndDate(Date.now());
	}
    }
    this.pluss=function() {
	this.dtime=Math.min(365,this.dtime+1);
	if (this.targetSet) {
	    this.setEndDate(this.targetTime);
	} else {
	    this.setEndDate(Date.now());
	}
    }
    this.setTargetDateOld=function(target) {
	var tzoffset = (new moment(target)).getTimezoneOffset() * 60000; //offset in milliseconds
	var dtg=new moment(target - tzoffset).toISOString();
	var d=dtg.substring(0,10);
	var t=dtg.substring(11,19);
	this.start_dt=d;
	this.start_tm=t;
    }
    this.startfocus=function() {
	this.targetSet=true;
    }
    this.startblur=function() {
	this.targetSet=true;
	var dtg=this.start_dt+"T"+this.start_tm+"Z"
	var tzoffset = (new moment(dtg)).getTimezoneOffset() * 60000; //offset in milliseconds
	this.targetTime=new moment(dtg).valueOf()+tzoffset;
	this.setEndDate(this.targetTime);
    }
    this.setEndDate=function(target) {
	var tzoffset = (new moment(target)).getTimezoneOffset() * 60000; //offset in milliseconds
	var dtg=new moment(target - tzoffset + this.dtime*86400000).toISOString();
	var d=dtg.substring(0,10);
	this.end_dt=d;
    }
    this.getData=function(state) {
	var d=new moment();
	var now=d.valueOf();
	this.targetUpdate=now-1000;
	//var pos = new geoloc(this.lat, 
	//		     this.lng); 
	var pos = undefined;
	this.setPositionData(state,pos);
    }
    this.searchPosition=function(state) {
	var string=this.search;
	// var geocoder = new google.maps.Geocoder();
	// geocoder.geocode(
	//     {"address": string},
	//     function(results, status) {
	// 	if (status === google.maps.GeocoderStatus.OK) {
	// 	    var loc=results[0].geometry.location;
	// 	    var pos = new geoloc(loc.lat(),loc.lng()); 
	// 	    this.setPosition( pos );
	// 	}
	//     }
	// );
    }
    this.getPosition=function(state) {
	// if (navigator.geolocation) {
	//     //console.log("Getting position.");
	//     navigator.geolocation.getCurrentPosition(this.setPosition);
	// }
    }
    this.setPosition=function(state,position) {
	this.lat=position.coords.latitude;
	this.lng=position.coords.longitude;
	this.positionIsSet=true;
	this.setMapPosition();
    }
    this.getPositionData=function(state) {
	// if (navigator.geolocation) {
	//     navigator.geolocation.getCurrentPosition(this.setPositionData);
	// }
    }
    this.checkEnd=function(state) {
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
    this.launch3D=function(dtg) {
	if (dtg === undefined) {
	    if (this.targetSet) {
		dtg=new moment(this.targetTime).toISOString();
	    } else {
		dtg = new moment().toISOString();
	    }
	}
	var hrs;
	var lat=this.lat;
	var lon=this.lng;
	var label = "Now";
	var target = this.getTarget(this.targetId);
	var fov = this.getFov(this.targetId);
	var dir;
	var con=0;
	var play;
	var url="sky.html?lat="+lat+"&lon="+lon+"&dtg="+dtg+"&label="+label+"&target="+target+"&fov="+fov+"&con="+con;
	if (this.window3D !== undefined) {
	    try {
		console.log("Updating:",url);
		this.window3D.Request.launch(lat,lon,dtg,hrs,label,target,fov,dir,con,play);
		this.window3D.focus()
	    } catch (err) { // window doesnt contain sky.html any more...
		this.window3D=undefined;
	    }
	};
	if (this.window3D === undefined) {
	    console.log("Launching:",url);
	    this.window3D=window.open(url);
	}
    };
    this.getTarget=function(id) {
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
    this.getFov=function(id) {
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
    this.init_old=function() {
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
	    var lng=this.getCookie("longitudeCheck");
	    if (lat !== "" && lng !== "") {
		this.lat=lat;
		this.lng=lng;
		this.positionIsSet=true;
	    }
	    this.updateCost(0);
	}
	this.checkEnd();
    }
    this.unique=function(array) {
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
};

export default Astro;
