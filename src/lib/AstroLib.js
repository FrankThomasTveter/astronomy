//console.log("Loading AstroLib.js");
// $(".anydate").AnyTime_picker( {
//     format:  "%Y-%m-%d",
//     formatUtcOffset: "%: (%@)"} );
// $(".anytime").AnyTime_picker( {
//     format: "%H:%i:%s",
//     formatUtcOffset: "%: (%@)"} );
function Astro() {
    this.bdeb=false;
    this.rawData = [];
    //
    this.start_dt=undefined;
    this.start_tm=undefined;
    this.end_p=undefined;
    this.end_m=undefined;
    this.end_dt=undefined;
    this.lat=0.0;
    this.lng=0.0;
    this.updateCheck=false;
    this.cost=0;
    this.startDate=new Date();
    this.endDt=1;
    this.previousCheck=false;
    this.nextCheck=false;
    //
    this.visible={time:true,location:true,criteria:true,events:true};
    // 
    this.sunRiseCheck=false;
    this.sunSetCheck=false;
    this.sunEleMaxCheck=false;
    this.sunEleMinCheck=false;
    this.civilCheck=false;
    this.nauticalCheck=false;
    this.astronomicalCheck=false;
    this.nightCheck=false;
    this.polarDayStartCheck=false;
    this.polarDayStopCheck=false;
    this.polarNightStartCheck=false;
    this.polarNightStopCheck=false;
    this.sunEclipseCheck=false;
    this.moonRiseCheck=false;
    this.moonSetCheck=false;
    this.moonEleMaxCheck=false;
    this.moonEleMinCheck=false;
    // this.lunarDayStartCheck=false;
    // this.lunarDayStopCheck=false;
    // this.lunarNightStartCheck=false;
    // this.lunarNightStopCheck=false;
    this.MoonNewCheck=false;
    this.MoonFirstQuartCheck=false;
    this.MoonFullCheck=false;
    this.MoonLastQuartCheck=false;
    this.MoonIllMinCheck=false;
    this.MoonIllMaxCheck=false;
    this.SouthLunasticeCheck=false;
    this.AscLunarEquinoxCheck=false;
    this.NorthLunasticeCheck=false;
    this.DescLunarEquinoxCheck=false;
    this.MoonPerigeeCheck=false;
    this.MoonApogeeCheck=false;
    this.LunarEclipseMinMaxCheck=false;
    this.SouthSolsticeCheck=false;
    this.AscSolarEquinoxCheck=false;
    this.NorthSolsticeCheck=false;
    this.DescSolarEquinoxCheck=false;
    this.EarthPerihelionCheck=false;
    this.EarthAphelionCheck=false;
    this.MercInfConjCheck=false;
    this.MercSupConjCheck=false;
    this.MercWestElongCheck=false;
    this.MercEastElongCheck=false;
    this.VenusInfConjCheck=false;
    this.VenusSupConjCheck=false;
    this.VenusWestElongCheck=false;
    this.VenusEastElongCheck=false;
    this.MarsConjCheck=false;
    this.MarsWestQuadCheck=false;
    this.MarsOppCheck=false;
    this.MarsEastQuadCheck=false;
    this.JupiterConjCheck=false;
    this.JupiterWestQuadCheck=false;
    this.JupiterOppCheck=false;
    this.JupiterEastQuadCheck=false;
    this.SaturnConjCheck=false;
    this.SaturnWestQuadCheck=false;
    this.SaturnOppCheck=false;
    this.SaturnEastQuadCheck=false;
    this.MercTransitCheck=false;
    this.VenusTransitCheck=false;
    //
    this.targetSet=false;
    this.targetTime=0;
    this.targetId=undefined;
    this.lastLat=999;
    this.lastLon=999;
    this.targetUpdate=new Date().getTime()-10000000;
    this.drawAll=true;
    this.mapReady=false;

    this.lastUpdate=new Date().getTime()-10000000;
    this.beep0s = new Audio("media/beep0s.mp3");
    this.beep1s = new Audio("media/beep1s.mp3");
    this.beep2s = new Audio("media/beep2s.mp3");
    this.beep3s = new Audio("media/beep3s.mp3");
    this.beep10s = new Audio("media/beep10s.mp3");
    this.beep1m = new Audio("media/beep1m.mp3");
    this.lastTime=new Date().getTime();
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
    this.init_old=function() {
	// read cookies
	var masterCookie=this.getCookie("cookieCheck");
	if ( masterCookie === "t") {
	    this.updateCheck =(this.getCookie("updateCheck") === "t");
	    this.previousCheck = (this.getCookie("previousCheck") === "t");
	    this.nextCheck = (this.getCookie("nextCheck") === "t");
	    this.sunRiseCheck = (this.getCookie("sunRiseCheck") === "t");
	    this.sunSetCheck = (this.getCookie("sunSetCheck") === "t");
	    this.sunEleMaxCheck = (this.getCookie("sunEleMaxCheck") === "t");
	    this.sunEleMinCheck = (this.getCookie("sunEleMinCheck") === "t");
	    this.civilCheck = (this.getCookie("civilCheck") === "t");
	    this.nauticalCheck = (this.getCookie("nauticalCheck") === "t");
	    this.astronomicalCheck = (this.getCookie("astronomicalCheck") === "t");
	    this.nightCheck = (this.getCookie("nightCheck") === "t");
	    this.polarDayStartCheck = (this.getCookie("polarDayStartCheck") === "t");
	    this.polarDayStopCheck = (this.getCookie("polarDayStopCheck") === "t");
	    this.polarNightStartCheck = (this.getCookie("polarNightStartCheck") === "t");
	    this.polarNightStopCheck = (this.getCookie("polarNightStopCheck") === "t");
	    this.sunEclipseCheck = (this.getCookie("sunEclipseCheck") === "t");
	    this.moonRiseCheck = (this.getCookie("moonRiseCheck") === "t");
	    this.moonSetCheck = (this.getCookie("moonSetCheck") === "t");
	    this.moonEleMaxCheck = (this.getCookie("moonEleMaxCheck") === "t");
	    this.moonEleMinCheck = (this.getCookie("moonEleMinCheck") === "t");
	    // this.lunarDayStartCheck = (this.getCookie("lunarDayStartCheck") === "t");
	    // this.lunarDayStopCheck = (this.getCookie("lunarDayStopCheck") === "t");
	    // this.lunarNightStartCheck = (this.getCookie("lunarNightStartCheck") === "t");
	    // this.lunarNightStopCheck = (this.getCookie("lunarNightStopCheck") === "t");
	    this.MoonNewCheck = (this.getCookie("MoonNewCheck") === "t");
	    this.MoonFirstQuartCheck = (this.getCookie("MoonFirstQuartCheck") === "t");
	    this.MoonFullCheck = (this.getCookie("MoonFullCheck") === "t");
	    this.MoonLastQuartCheck = (this.getCookie("MoonLastQuartCheck") === "t");
	    this.MoonIllMinCheck = (this.getCookie("MoonIllMinCheck") === "t");
	    this.MoonIllMaxCheck = (this.getCookie("MoonIllMaxCheck") === "t");
	    this.SouthLunasticeCheck = (this.getCookie("SouthLunasticeCheck") === "t");
	    this.AscLunarEquinoxCheck = (this.getCookie("AscLunarEquinoxCheck") === "t");
	    this.NorthLunasticeCheck = (this.getCookie("NorthLunasticeCheck") === "t");
	    this.DescLunarEquinoxCheck = (this.getCookie("DescLunarEquinoxCheck") === "t");
	    this.MoonPerigeeCheck = (this.getCookie("MoonPerigeeCheck") === "t");
	    this.MoonApogeeCheck = (this.getCookie("MoonApogeeCheck") === "t");
	    this.LunarEclipseMinMaxCheck = (this.getCookie("LunarEclipseMinMaxCheck") === "t");
	    this.SouthSolsticeCheck = (this.getCookie("SouthSolsticeCheck") === "t");
	    this.AscSolarEquinoxCheck = (this.getCookie("AscSolarEquinoxCheck") === "t");
	    this.NorthSolsticeCheck = (this.getCookie("NorthSolsticeCheck") === "t");
	    this.DescSolarEquinoxCheck = (this.getCookie("DescSolarEquinoxCheck") === "t");
	    this.EarthPerihelionCheck = (this.getCookie("EarthPerihelionCheck") === "t");
	    this.EarthAphelionCheck = (this.getCookie("EarthAphelionCheck") === "t");
	    this.MercTransitCheck = (this.getCookie("MercTransitCheck") === "t");
	    this.VenusTransitCheck = (this.getCookie("VenusTransitCheck") === "t");
	    this.MercInfConjCheck = (this.getCookie("MercInfConjCheck") === "t");
	    this.MercSupConjCheck = (this.getCookie("MercSupConjCheck") === "t");
	    this.MercWestElongCheck = (this.getCookie("MercWestElongCheck") === "t");
	    this.MercEastElongCheck = (this.getCookie("MercEastElongCheck") === "t");
	    this.VenusInfConjCheck = (this.getCookie("VenusInfConjCheck") === "t");
	    this.VenusSupConjCheck = (this.getCookie("VenusSupConjCheck") === "t");
	    this.VenusWestElongCheck = (this.getCookie("VenusWestElongCheck") === "t");
	    this.VenusEastElongCheck = (this.getCookie("VenusEastElongCheck") === "t");
	    this.MarsConjCheck = (this.getCookie("MarsConjCheck") === "t");
	    this.MarsWestQuadCheck = (this.getCookie("MarsWestQuadCheck") === "t");
	    this.MarsOppCheck = (this.getCookie("MarsOppCheck") === "t");
	    this.MarsEastQuadCheck = (this.getCookie("MarsEastQuadCheck") === "t");
	    this.JupiterConjCheck = (this.getCookie("JupiterConjCheck") === "t");
	    this.JupiterWestQuadCheck = (this.getCookie("JupiterWestQuadCheck") === "t");
	    this.JupiterOppCheck = (this.getCookie("JupiterOppCheck") === "t");
	    this.JupiterEastQuadCheck = (this.getCookie("JupiterEastQuadCheck") === "t");
	    this.SaturnConjCheck = (this.getCookie("SaturnConjCheck") === "t");
	    this.SaturnWestQuadCheck = (this.getCookie("SaturnWestQuadCheck") === "t");
	    this.SaturnOppCheck = (this.getCookie("SaturnOppCheck") === "t");
	    this.SaturnEastQuadCheck = (this.getCookie("SaturnEastQuadCheck") === "t");
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
    this.updateLoop=function(state) {
	if (this.bdeb) {console.log("Updating database...");}
	this.setTime(state);
	setTimeout(function() {
	    state.Astro.updateLoop(state)
	},state.Astro.delay); //state.Database.delay
    }.bind(this);
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
    this.getStartDate=function(state) {
	return state.Astro.startDate;
    };
    this.getEndDt=function (state) {
	return state.Astro.endDt;
    };
    this.setStartDate=function(state,date) {
	state.Astro.startDate=date;
    };
    this.setEndDt=function(state,dt) {
	state.Astro.endDt=dt;
    };
    this.getPrev=function(state) {
	return state.Astro.previousCheck;
    };
    this.getNext=function(state) {
	return state.Astro.nextCheck;
    };
    this.setPrev=function(state,prev) {
	state.Astro.previousCheck=prev;
    };
    this.setNext=function(state,next) {
	state.Astro.nextCheck=next;
    };
    this.setStartDateOld=function(target) {
	var tzoffset = (new Date(target)).getTimezoneOffset() * 60000; //offset in milliseconds
	var dtg=new Date(target - tzoffset).toISOString();
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
	    var d=new Date();
	    var tnow=d.getTime();
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
		var t=new Date(dataReport[0]);
		var repid=dataReport[3];
		if (this.drawAll) {
                    //console.log("Drawing buttons.");
 		    documentCells[0].innerHTML="<button class=\"delete\" onclick=\"deleteRow("+
			id+","+reportCnt+")\">X</button>";
		    documentCells[1].innerHTML="<button class=\"hot\" onclick=\"setTarget("+
			(t*1)+","+(repid)+")\">"+this.nice(t)+"</button>";
		    //console.log("drawing button:"+this.nice(t));
		}
		var dt=t-tnow;
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
	    this.setStartDateOld(this.targetTime);
	    this.setEndDate(this.targetTime);
	    this.targetId=id;
	}
    }
    this.setTargetId=function(tt,id) {
	//console.log("Setting target to:"+tt+" "+this.targetSet);
	this.targetSet=true;
	this.targetTime=tt;
	this.setStartDateOld(this.targetTime);
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
	    var d=new Date();
	    var tnow=d.getTime();
	    //console.log("Adding data to array-id="+id);
	    if (this.rawData[id] === undefined) {
		this.rawData[id]=[];
	    }
	    var cnt=0;
	    var log="";
	    this.targetUpdate=new Date("3000-01-01T00:00:00.000Z").getTime();
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
			var t=new Date(reportDtg);
			var localDtg=t.getTime();
			//console.log("Got date: "+reportDtg+" => "+localDtg);
			if (localDtg > tnow) {
			    if (this.targetUpdate < tnow || localDtg < this.targetUpdate ) {
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
	this.addSunRise        = function(id) {this["event"+id+"Id"]=600;};
	this.addSunSet         = function(id) {this["event"+id+"Id"]=610;};
	this.addMoonState      = function(id) {this["event"+id+"Id"]=100;};
	this.addMoonTcEf       = function(id,dt) {this["event"+id+"Id"]=110;
						  this["event"+id+"Val4"]=dt;};
	this.addSunState       = function(id) {this["event"+id+"Id"]=120;};
	this.addSunVisible     = function(id) {this["event"+id+"Id"]=125;};
	this.addSunTcEf        = function(id,dt) {this["event"+id+"Id"]=130;
						  this["event"+id+"Val4"]=dt;};
	this.addSouthSolstice = function(id) {this["event"+id+"Id"]=150;};
	this.addAscSolarEquinox  = function(id) {this["event"+id+"Id"]=160;};
	this.addNorthSolstice = function(id) {this["event"+id+"Id"]=170;};
	this.addDescSolarEquinox= function(id) {this["event"+id+"Id"]=180;};
	this.addEarthPerihelion= function(id) {this["event"+id+"Id"]=190;};
	this.addEarthAphelion  = function(id) {this["event"+id+"Id"]=195;};

	this.addSouthLunastice = function(id) {this["event"+id+"Id"]=290;};
	this.addAscLunarEquinox  = function(id) {this["event"+id+"Id"]=292;};
	this.addNorthLunastice = function(id) {this["event"+id+"Id"]=294;};
	this.addDescLunarEquinox= function(id) {this["event"+id+"Id"]=296;};
	this.addMoonPerigee    = function(id) {this["event"+id+"Id"]=200;};
	this.addMoonApogee     = function(id) {this["event"+id+"Id"]=205;};
	this.addMoonNew        = function(id) {this["event"+id+"Id"]=210;};
	this.addMoonFirstQuart = function(id) {this["event"+id+"Id"]=220;};
	this.addMoonFull       = function(id) {this["event"+id+"Id"]=230;};
	this.addMoonLastQuart  = function(id) {this["event"+id+"Id"]=240;};
	this.addMoonPhase      = function(id) {this["event"+id+"Id"]=250;};
	this.addMoonIllMin     = function(id) {this["event"+id+"Id"]=260;};
	this.addMoonIllMax     = function(id) {this["event"+id+"Id"]=270;};
	this.addMoonIll        = function(id,val) {this["event"+id+"Id"]=280;};
	this.addMercInfConj    = function(id) {this["event"+id+"Id"]=300;};
	this.addMercSupConj    = function(id) {this["event"+id+"Id"]=310;};
	this.addMercWestElong  = function(id) {this["event"+id+"Id"]=320;};
	this.addMercEastElong  = function(id) {this["event"+id+"Id"]=330;};
	this.addVenusInfConj   = function(id) {this["event"+id+"Id"]=340;};
	this.addVenusWestElong = function(id) {this["event"+id+"Id"]=350;};
	this.addVenusSupConj   = function(id) {this["event"+id+"Id"]=360;};
	this.addVenusEastElong = function(id) {this["event"+id+"Id"]=370;};
	this.addMarsConj       = function(id) {this["event"+id+"Id"]=380;};
	this.addMarsWestQuad   = function(id) {this["event"+id+"Id"]=390;};
	this.addMarsOpp        = function(id) {this["event"+id+"Id"]=400;};
	this.addMarsEastQuad   = function(id) {this["event"+id+"Id"]=410;};
	this.addJupiterConj    = function(id) {this["event"+id+"Id"]=420;};
	this.addJupiterWestQuad= function(id) {this["event"+id+"Id"]=430;};
	this.addJupiterOpp     = function(id) {this["event"+id+"Id"]=440;};
	this.addJupiterEastQuad= function(id) {this["event"+id+"Id"]=450;};
	this.addSaturnConj     = function(id) {this["event"+id+"Id"]=460;};
	this.addSaturnWestQuad = function(id) {this["event"+id+"Id"]=470;};
	this.addSaturnOpp      = function(id) {this["event"+id+"Id"]=480;};
	this.addSaturnEastQuad = function(id) {this["event"+id+"Id"]=490;};
	this.addMercTransit    = function(id) {this["event"+id+"Id"]=500;};
	this.addVenusTransit   = function(id) {this["event"+id+"Id"]=520;};
	this.addLunarEclipseMinMax = function(id, min,max) {this["event"+id+"Id"]=550;
							    this["event"+id+"Val1"]=min;
							    this["event"+id+"Val2"]=max;};
	this.addLunarEclipse       = function(id, min,max) {this["event"+id+"Id"]=560;};
	this.addSunEleMax      = function(id) {this["event"+id+"Id"]=620;};
	this.addSunEleMin      = function(id) {this["event"+id+"Id"]=630;};
	this.addTwilightCivilStart         = function(id) {this["event"+id+"Id"]=640;};
	this.addTwilightCivilStop          = function(id) {this["event"+id+"Id"]=650;};
	this.addTwilightNauticalStart      = function(id) {this["event"+id+"Id"]=660;};
	this.addTwilightNauticalStop       = function(id) {this["event"+id+"Id"]=670;};
	this.addTwilightAstronomicalStart  = function(id) {this["event"+id+"Id"]=680;};
	this.addTwilightAstronomicalStop   = function(id) {this["event"+id+"Id"]=690;};
	this.addNightStart     = function(id) {this["event"+id+"Id"]=700;};
	this.addNightStop      = function(id) {this["event"+id+"Id"]=710;};
	this.addSunAzi         = function(id,target) {this["event"+id+"Id"]=750;
						      this["event"+id+"Val4"]=target;};
	this.addSunTime        = function(id,target) {this["event"+id+"Id"]=760;
						      this["event"+id+"Val4"]=target;};
	this.addMoonTime       = function(id,target) {this["event"+id+"Id"]=770;
						      this["event"+id+"Val4"]=target;};
	this.addMoonRise       = function(id) {this["event"+id+"Id"]=800;};
	this.addMoonSet        = function(id) {this["event"+id+"Id"]=810;};
	this.addMoonEleMax     = function(id) {this["event"+id+"Id"]=820;};
	this.addMoonEleMin     = function(id) {this["event"+id+"Id"]=830;};
	this.addMoonAzi        = function(id,target) {this["event"+id+"Id"]=840;
						      this["event"+id+"Val4"]=target;};
	this.addPolarSunDayStart   = function(id) {this["event"+id+"Id"]=900;};
	this.addPolarSunDayStop    = function(id) {this["event"+id+"Id"]=910;};
	this.addPolarSunNightStart = function(id) {this["event"+id+"Id"]=920;};
	this.addPolarSunNightStop  = function(id) {this["event"+id+"Id"]=930;};
	this.addPolarMoonDayStart  = function(id) {this["event"+id+"Id"]=940;};
	this.addPolarMoonDayStop   = function(id) {this["event"+id+"Id"]=950;};
	this.addPolarMoonNightStart= function(id) {this["event"+id+"Id"]=960;};
	this.addPolarMoonNightStop = function(id) {this["event"+id+"Id"]=970;};
	this.addSunEclipseMinMax   = function(id,min,max) {this["event"+id+"Id"]=980;
							   this["event"+id+"Val4"]=min;
							   this["event"+id+"Val5"]=max;};
	this.addSunEclipse     = function(id) {this["event"+id+"Id"]=990;};
	this.addSolarSystemTcEf= function(id,dt) {this["event"+id+"Id"]=1000;
						  this["event"+id+"Val4"]=dt;};
    }

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
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
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
	if (this.initialise) {this.init();this.initialise=false;}
	var d=new Date();
	var tnow=d.getTime();
	var updateData = this.updateCheck;
	// load position + load data
	if (this.updateData && (tnow-this.lastUpdate) > 10000*this.lastCnt && 
            (tnow-this.targetUpdate) > 10000 && this.lastCnt < 10) {
            //console.log("Updating position.");
            this.lastUpdate=tnow;
            this.lastCnt++;
	    if (this.positionIsSet) {
		this.getData();
	    } else {
		this.getPositionData();
	    }
	} else {
	    if (tnow - this.lastTime > 1000)  {                                            // code suspended during event 
	    } else if (this.targetUpdate-999 > this.lastTime & this.targetUpdate-999 < tnow) {       // T   0s
		this.beep0s.play();
	    } else if (this.targetUpdate-1999 > this.lastTime & this.targetUpdate-1999 < tnow) {	  // T -1s
		this.beep1s.play();
	    } else if (this.targetUpdate-2999 > this.lastTime & this.targetUpdate-2999 < tnow) {	  // T -2s
		this.beep2s.play();
	    } else if (this.targetUpdate-3999 > this.lastTime & this.targetUpdate-3999 < tnow) {	  // T -3s
		this.beep3s.play();
	    } else if (this.targetUpdate-10999 > this.lastTime & this.targetUpdate-10999 < tnow) {	  // T -10s
		this.beep10s.play();
	    } else if (this.targetUpdate-60999 > this.lastTime & this.targetUpdate-60999 < tnow) {	  // T -60s
		this.beep1m.play();
	    }
	    this.lastTime=tnow;
	}
	if (! this.targetSet) {
	    tnow=Date.now();
	    this.setStartDateOld(tnow);
	    this.setEndDate(tnow);
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
    this.setStartDateOld=function(target) {
	var tzoffset = (new Date(target)).getTimezoneOffset() * 60000; //offset in milliseconds
	var dtg=new Date(target - tzoffset).toISOString();
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
	var tzoffset = (new Date(dtg)).getTimezoneOffset() * 60000; //offset in milliseconds
	this.targetTime=new Date(dtg).getTime()+tzoffset;
	this.setEndDate(this.targetTime);
    }
    this.setEndDate=function(target) {
	var tzoffset = (new Date(target)).getTimezoneOffset() * 60000; //offset in milliseconds
	var dtg=new Date(target - tzoffset + this.dtime*86400000).toISOString();
	var d=dtg.substring(0,10);
	this.end_dt=d;
    }
    this.getData=function() {
	var d=new Date();
	var tnow=d.getTime();
	this.targetUpdate=tnow-1000;
	//var pos = new geoloc(this.lat, 
	//		     this.lng); 
	var pos = undefined;
	this.setPositionData(pos);
    }
    this.searchPosition=function() {
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
    this.getPosition=function() {
	// if (navigator.geolocation) {
	//     //console.log("Getting position.");
	//     navigator.geolocation.getCurrentPosition(this.setPosition);
	// }
    }
    this.setPosition=function(position) {
	this.lat=position.coords.latitude;
	this.lng=position.coords.longitude;
	this.positionIsSet=true;
	this.setMapPosition();
    }
    this.getPositionData=function() {
	// if (navigator.geolocation) {
	//     navigator.geolocation.getCurrentPosition(this.setPositionData);
	// }
    }
    this.checkEnd=function() {
	// disable end-time...
	if (!this.previousCheck && !this.nextCheck) {
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
    this.setPositionData=function(position) {
	this.setPosition(position);
	var d=new Date();
	var tnow=d.getTime();
	var newpos=this.isNewPos(position.coords.latitude,position.coords.longitude);
	//console.log("Got position."+this.targetUpdate+"  "+tnow);
	if (newpos || this.targetUpdate < tnow) {
	    this.lastUpdate=tnow+10000; 
	    //console.log("Updating data.");
	    var req=new this.request();
	    var dt = 86400000.0;
	    var requestTime=tnow;
	    var replace=true;
	    if (this.targetSet) {replace=false;requestTime=this.targetTime;};
	    if (newpos) {replace=true;};
	    req.addDebug();
	    req.addPosition("",position.coords.latitude,position.coords.longitude,0)
	    if(this.previousCheck) {
		if (this.nextCheck) {
		    if (replace) {
			req.addStartTime("",new Date(requestTime).toISOString());
			req.addSearch("",0);
		    } else { // add
			req.addStartTime("",new Date(requestTime).toISOString());
			req.addSearch("",-2);
		    }
		} else {
		    if (replace) {
			req.addStartTime("",new Date(requestTime).toISOString());
			req.addSearch("",-1);
		    } else { // add
			req.addStartTime("",new Date(requestTime-1000).toISOString());
			req.addSearch("",-1);
		    }
		}
	    } else if (this.nextCheck) {
		if (replace) {
		    req.addStartTime("",new Date(requestTime).toISOString());
		    req.addSearch("",1);
		} else { // add
		    req.addStartTime("",new Date(requestTime+1000).toISOString());
		    req.addSearch("",1);
		}
	    } else { // time interval...
		if (replace) {
		    req.addStartTime("",new Date(requestTime).toISOString());
		    req.addStopTime("",new Date(requestTime+this.dtime*86400000).toISOString());
		    req.addSearch("",2);
		} else {
		    req.addStartTime("",new Date(requestTime+1000).toISOString());
		    req.addStopTime("",new Date(requestTime+1000+this.dtime*86400000).toISOString());
		    req.addSearch("",2);
		}
	    }
	    if (this.addEvents(req)) {
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
    }
    this.addEvents=function(req) {
	this.setCookie("cookieCheck","t",10);
	if (this.updateCheck)         {this.setCookie("updateCheck","t",10);}    else {this.setCookie("updateCheck","f",0);};
	if (this.previousCheck)       {this.setCookie("previousCheck","t",10);}  else {this.setCookie("previousCheck","f",0);};
	if (this.nextCheck)           {this.setCookie("nextCheck","t",10);}      else {this.setCookie("nextCheck","f",0);};
	var id=1;
	if(this.sunRiseCheck)         {this.setCookie("sunRiseCheck","t",10);req.addSunRise(id++);} else {this.setCookie("sunRiseCheck","f",0)};
	if(this.sunSetCheck)         {this.setCookie("sunSetCheck","t",10);req.addSunSet(id++);} else {this.setCookie("sunSetCheck","f",0)};
	if(this.sunEleMaxCheck)          {this.setCookie("sunEleMaxCheck","t",10);req.addSunEleMax(id++);} else {this.setCookie("sunEleMaxCheck","f",0)};
	if(this.sunEleMinCheck)          {this.setCookie("sunEleMinCheck","t",10);req.addSunEleMin(id++);} else {this.setCookie("sunEleMinCheck","f",0)};
	if(this.civilCheck)           {this.setCookie("civilCheck","t",10);req.addTwilightCivilStart(id++);req.addTwilightCivilStop(id++);} else {this.setCookie("civilCheck","f",0)};
	if(this.nauticalCheck)        {this.setCookie("nauticalCheck","t",10);req.addTwilightNauticalStart(id++);req.addTwilightNauticalStop(id++);} else {this.setCookie("nauticalCheck","f",0)};
	if(this.astronomicalCheck)    {this.setCookie("astronomicalCheck","t",10);req.addTwilightAstronomicalStart(id++);req.addTwilightAstronomicalStop(id++);} else {this.setCookie("astronomicalCheck","f",0)};
	if(this.nightCheck)           {this.setCookie("nightCheck","t",10);req.addNightStart(id++);req.addNightStop(id++);} else {this.setCookie("nightCheck","f",0)};
	if(this.polarDayStartCheck)        {this.setCookie("polarDayStartCheck","t",10);req.addPolarSunDayStart(id++);} else {this.setCookie("polarDayStartCheck","f",0)};
	if(this.polarDayStopCheck)        {this.setCookie("polarDayStopCheck","t",10);req.addPolarSunDayStop(id++);} else {this.setCookie("polarDayStopCheck","f",0)};
	if(this.polarNightStartCheck)      {this.setCookie("polarNightStartCheck","t",10);req.addPolarSunNightStart(id++);} else {this.setCookie("polarNightStartCheck","f",0)};
	if(this.polarNightStopCheck)      {this.setCookie("polarNightStopCheck","t",10);req.addPolarSunNightStop(id++);} else {this.setCookie("polarNightStopCheck","f",0)};
	if(this.sunEclipseCheck)      {this.setCookie("sunEclipseCheck","t",10);req.addSunEclipseMinMax(id++,0.1,100);} else {this.setCookie("sunEclipseCheck","f",0)};
	if(this.moonRiseCheck)        {this.setCookie("moonRiseCheck","t",10);req.addMoonRise(id++);} else {this.setCookie("moonRiseCheck","f",0)};
	if(this.moonSetCheck)        {this.setCookie("moonSetCheck","t",10);req.addMoonSet(id++);} else {this.setCookie("moonSetCheck","f",0)};
	if(this.moonEleMaxCheck)         {this.setCookie("moonEleMaxCheck","t",10);req.addMoonEleMax(id++);} else {this.setCookie("moonEleMaxCheck","f",0)};
	if(this.moonEleMinCheck)         {this.setCookie("moonEleMinCheck","t",10);req.addMoonEleMin(id++);} else {this.setCookie("moonEleMinCheck","f",0)};
	// if(this.lunarDayStartCheck)        {this.setCookie("lunarDayStartCheck","t",10);req.addPolarMoonDayStart(id++);} else {this.setCookie("lunarDayStartCheck","f",0)};
	// if(this.lunarDayStopCheck)        {this.setCookie("lunarDayStopCheck","t",10);req.addPolarMoonDayStop(id++);} else {this.setCookie("lunarDayStopCheck","f",0)};
	// if(this.lunarNightStartCheck)      {this.setCookie("lunarNightStartCheck","t",10);req.addPolarMoonNightStart(id++);} else {this.setCookie("lunarNightStartCheck","f",0)};
	// if(this.lunarNightStopCheck)      {this.setCookie("lunarNightStopCheck","t",10);req.addPolarMoonNightStop(id++);} else {this.setCookie("lunarNightStopCheck","f",0)};
	if(this.MoonNewCheck)         {this.setCookie("MoonNewCheck","t",10);req.addMoonNew(id++);} else {this.setCookie("MoonNewCheck","f",0)};
	if(this.MoonFirstQuartCheck)  {this.setCookie("MoonFirstQuartCheck","t",10);req.addMoonFirstQuart(id++);} else {this.setCookie("MoonFirstQuartCheck","f",0)};
	if(this.MoonFullCheck)        {this.setCookie("MoonFullCheck","t",10);req.addMoonFull(id++);} else {this.setCookie("MoonFullCheck","f",0)};
	if(this.MoonLastQuartCheck)   {this.setCookie("MoonLastQuartCheck","t",10);req.addMoonLastQuart(id++);} else {this.setCookie("MoonLastQuartCheck","f",0)};
	if(this.MoonIllMinCheck)      {this.setCookie("MoonIllMinCheck","t",10);req.addMoonIllMin(id++);} else {this.setCookie("MoonIllMinCheck","f",0)};
	if(this.MoonIllMaxCheck)      {this.setCookie("MoonIllMaxCheck","t",10);req.addMoonIllMax(id++);} else {this.setCookie("MoonIllMaxCheck","f",0)};
	if(this.SouthLunasticeCheck)  {this.setCookie("SouthLunasticeCheck","t",10);req.addSouthLunastice(id++);} else {this.setCookie("SouthLunasticeCheck","f",0)};
	if(this.AscLunarEquinoxCheck) {this.setCookie("AscLunarEquinoxCheck","t",10);req.addAscLunarEquinox(id++);} else {this.setCookie("AscLunarEquinoxCheck","f",0)};
	if(this.NorthLunasticeCheck)  {this.setCookie("NorthLunasticeCheck","t",10);req.addNorthLunastice(id++);} else {this.setCookie("NorthLunasticeCheck","f",0)};
	if(this.DescLunarEquinoxCheck) {this.setCookie("DescLunarEquinoxCheck","t",10);req.addDescLunarEquinox(id++);} else {this.setCookie("DescLunarEquinoxCheck","f",0)};
	if(this.MoonPerigeeCheck)     {this.setCookie("MoonPerigeeCheck","t",10);req.addMoonPerigee(id++);} else {this.setCookie("MoonPerigeeCheck","f",0)};
	if(this.MoonApogeeCheck)      {this.setCookie("MoonApogeeCheck","t",10);req.addMoonApogee(id++);} else {this.setCookie("MoonApogeeCheck","f",0)};
	if(this.LunarEclipseMinMaxCheck)      {this.setCookie("LunarEclipseMinMaxCheck","t",10);req.addLunarEclipseMinMax(id++,0.1,100);} else {this.setCookie("LunarEclipseMinMaxCheck","f",0)};
	if(this.SouthSolsticeCheck)  {this.setCookie("SouthSolsticeCheck","t",10);req.addSouthSolstice(id++);} else {this.setCookie("SouthSolsticeCheck","f",0)};
	if(this.AscSolarEquinoxCheck)   {this.setCookie("AscSolarEquinoxCheck","t",10);req.addAscSolarEquinox(id++);} else {this.setCookie("AscSolarEquinoxCheck","f",0)};
	if(this.NorthSolsticeCheck)  {this.setCookie("NorthSolsticeCheck","t",10);req.addNorthSolstice(id++);} else {this.setCookie("NorthSolsticeCheck","f",0)};
	if(this.DescSolarEquinoxCheck) {this.setCookie("DescSolarEquinoxCheck","t",10);req.addDescSolarEquinox(id++);} else {this.setCookie("DescSolarEquinoxCheck","f",0)};
	if(this.EarthPerihelionCheck) {this.setCookie("EarthPerihelionCheck","t",10);req.addEarthPerihelion(id++);} else {this.setCookie("EarthPerihelionCheck","f",0)};
	if(this.EarthAphelionCheck)   {this.setCookie("EarthAphelionCheck","t",10);req.addEarthAphelion(id++);} else {this.setCookie("EarthAphelionCheck","f",0)};
	if(this.MercInfConjCheck)     {this.setCookie("MercInfConjCheck","t",10);req.addMercInfConj(id++);} else {this.setCookie("MercInfConjCheck","f",0)};
	if(this.MercSupConjCheck)     {this.setCookie("MercSupConjCheck","t",10);req.addMercSupConj(id++);} else {this.setCookie("MercSupConjCheck","f",0)};
	if(this.MercWestElongCheck)   {this.setCookie("MercWestElongCheck","t",10);req.addMercWestElong(id++);} else {this.setCookie("MercWestElongCheck","f",0)};
	if(this.MercEastElongCheck)   {this.setCookie("MercEastElongCheck","t",10);req.addMercEastElong(id++);} else {this.setCookie("MercEastElongCheck","f",0)};
	if(this.VenusInfConjCheck)    {this.setCookie("VenusInfConjCheck","t",10);req.addVenusInfConj(id++);} else {this.setCookie("VenusInfConjCheck","f",0)};
	if(this.VenusSupConjCheck)    {this.setCookie("VenusSupConjCheck","t",10);req.addVenusSupConj(id++);} else {this.setCookie("VenusSupConjCheck","f",0)};
	if(this.VenusWestElongCheck)  {this.setCookie("VenusWestElongCheck","t",10);req.addVenusWestElong(id++);} else {this.setCookie("VenusWestElongCheck","f",0)};
	if(this.VenusEastElongCheck)  {this.setCookie("VenusEastElongCheck","t",10);req.addVenusEastElong(id++);} else {this.setCookie("VenusEastElongCheck","f",0)};
	if(this.MarsConjCheck)        {this.setCookie("MarsConjCheck","t",10);req.addMarsConj(id++);} else {this.setCookie("MarsConjCheck","f",0)};
	if(this.MarsWestQuadCheck)    {this.setCookie("MarsWestQuadCheck","t",10);req.addMarsWestQuad(id++);} else {this.setCookie("MarsWestQuadCheck","f",0)};
	if(this.MarsOppCheck)         {this.setCookie("MarsOppCheck","t",10);req.addMarsOpp(id++);} else {this.setCookie("MarsOppCheck","f",0)};
	if(this.MarsEastQuadCheck)    {this.setCookie("MarsEastQuadCheck","t",10);req.addMarsEastQuad(id++);} else {this.setCookie("MarsEastQuadCheck","f",0)};
	if(this.JupiterConjCheck)     {this.setCookie("JupiterConjCheck","t",10);req.addJupiterConj(id++);} else {this.setCookie("JupiterConjCheck","f",0)};
	if(this.JupiterWestQuadCheck) {this.setCookie("JupiterWestQuadCheck","t",10);req.addJupiterWestQuad(id++);} else {this.setCookie("JupiterWestQuadCheck","f",0)};
	if(this.JupiterOppCheck)      {this.setCookie("JupiterOppCheck","t",10);req.addJupiterOpp(id++);} else {this.setCookie("JupiterOppCheck","f",0)};
	if(this.JupiterEastQuadCheck) {this.setCookie("JupiterEastQuadCheck","t",10);req.addJupiterEastQuad(id++);} else {this.setCookie("JupiterEastQuadCheck","f",0)};
	if(this.SaturnConjCheck)      {this.setCookie("SaturnConjCheck","t",10);req.addSaturnConj(id++);} else {this.setCookie("SaturnConjCheck","f",0)};
	if(this.SaturnWestQuadCheck)  {this.setCookie("SaturnWestQuadCheck","t",10);req.addSaturnWestQuad(id++);} else {this.setCookie("SaturnWestQuadCheck","f",0)};
	if(this.SaturnOppCheck)       {this.setCookie("SaturnOppCheck","t",10);req.addSaturnOpp(id++);} else {this.setCookie("SaturnOppCheck","f",0)};
	if(this.SaturnEastQuadCheck)  {this.setCookie("SaturnEastQuadCheck","t",10);req.addSaturnEastQuad(id++);} else {this.setCookie("SaturnEastQuadCheck","f",0)};
	if(this.MercTransitCheck)     {this.setCookie("MercTransitCheck","t",10);req.addMercTransit(id++);} else {this.setCookie("MercTransitCheck","f",0)};
	if(this.VenusTransitCheck)    {this.setCookie("VenusTransitCheck","t",10);req.addVenusTransit(id++);} else {this.setCookie("VenusTransitCheck","f",0)};
	this.setCookie("latitudeCheck",this.lat,10)
	this.setCookie("longitudeCheck",this.lng,10)
	req.wipe();
	return id-1;
    }
    this.launch3D=function(dtg) {
	if (dtg === undefined) {
	    if (this.targetSet) {
		dtg=new Date(this.targetTime).toISOString();
	    } else {
		dtg = new Date().toISOString();
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
