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
    this.documentLog = document.getElementById("log");
    this.documentPos = document.getElementById("pos");
    this.initialise=true;
    this.positionIsSet=false;
    this.totalCost=0.00;
    this.window3D=undefined;
    this.map=undefined; //Will contain map object.
    this.marker; ////Has the user plotted their location marker? 


    this.init=function(state){
	//state.Utils.init("Database",this);
    };
    this.init_old=function() {
	// read cookies
	var masterCookie=this.getCookie("cookieCheck");
	if ( masterCookie === "t") {
	    document.getElementById("updateCheck").checked =(this.getCookie("updateCheck") == "t");
	    document.getElementById("previousCheck").checked = (this.getCookie("previousCheck") == "t");
	    document.getElementById("nextCheck").checked = (this.getCookie("nextCheck") == "t");
	    document.getElementById("sunRiseCheck").checked = (this.getCookie("sunRiseCheck") == "t");
	    document.getElementById("sunSetCheck").checked = (this.getCookie("sunSetCheck") == "t");
	    document.getElementById("sunEleMaxCheck").checked = (this.getCookie("sunEleMaxCheck") == "t");
	    document.getElementById("sunEleMinCheck").checked = (this.getCookie("sunEleMinCheck") == "t");
	    document.getElementById("civilCheck").checked = (this.getCookie("civilCheck") == "t");
	    document.getElementById("nauticalCheck").checked = (this.getCookie("nauticalCheck") == "t");
	    document.getElementById("astronomicalCheck").checked = (this.getCookie("astronomicalCheck") == "t");
	    document.getElementById("nightCheck").checked = (this.getCookie("nightCheck") == "t");
	    document.getElementById("polarDayStartCheck").checked = (this.getCookie("polarDayStartCheck") == "t");
	    document.getElementById("polarDayStopCheck").checked = (this.getCookie("polarDayStopCheck") == "t");
	    document.getElementById("polarNightStartCheck").checked = (this.getCookie("polarNightStartCheck") == "t");
	    document.getElementById("polarNightStopCheck").checked = (this.getCookie("polarNightStopCheck") == "t");
	    document.getElementById("sunEclipseCheck").checked = (this.getCookie("sunEclipseCheck") == "t");
	    document.getElementById("moonRiseCheck").checked = (this.getCookie("moonRiseCheck") == "t");
	    document.getElementById("moonSetCheck").checked = (this.getCookie("moonSetCheck") == "t");
	    document.getElementById("moonEleMaxCheck").checked = (this.getCookie("moonEleMaxCheck") == "t");
	    document.getElementById("moonEleMinCheck").checked = (this.getCookie("moonEleMinCheck") == "t");
	    // document.getElementById("lunarDayStartCheck").checked = (this.getCookie("lunarDayStartCheck") == "t");
	    // document.getElementById("lunarDayStopCheck").checked = (this.getCookie("lunarDayStopCheck") == "t");
	    // document.getElementById("lunarNightStartCheck").checked = (this.getCookie("lunarNightStartCheck") == "t");
	    // document.getElementById("lunarNightStopCheck").checked = (this.getCookie("lunarNightStopCheck") == "t");
	    document.getElementById("MoonNewCheck").checked = (this.getCookie("MoonNewCheck") == "t");
	    document.getElementById("MoonFirstQuartCheck").checked = (this.getCookie("MoonFirstQuartCheck") == "t");
	    document.getElementById("MoonFullCheck").checked = (this.getCookie("MoonFullCheck") == "t");
	    document.getElementById("MoonLastQuartCheck").checked = (this.getCookie("MoonLastQuartCheck") == "t");
	    document.getElementById("MoonIllMinCheck").checked = (this.getCookie("MoonIllMinCheck") == "t");
	    document.getElementById("MoonIllMaxCheck").checked = (this.getCookie("MoonIllMaxCheck") == "t");
	    document.getElementById("SouthLunasticeCheck").checked = (this.getCookie("SouthLunasticeCheck") == "t");
	    document.getElementById("AscLunarEquinoxCheck").checked = (this.getCookie("AscLunarEquinoxCheck") == "t");
	    document.getElementById("NorthLunasticeCheck").checked = (this.getCookie("NorthLunasticeCheck") == "t");
	    document.getElementById("DescLunarEquinoxCheck").checked = (this.getCookie("DescLunarEquinoxCheck") == "t");
	    document.getElementById("MoonPerigeeCheck").checked = (this.getCookie("MoonPerigeeCheck") == "t");
	    document.getElementById("MoonApogeeCheck").checked = (this.getCookie("MoonApogeeCheck") == "t");
	    document.getElementById("LunarEclipseMinMaxCheck").checked = (this.getCookie("LunarEclipseMinMaxCheck") == "t");
	    document.getElementById("SouthSolsticeCheck").checked = (this.getCookie("SouthSolsticeCheck") == "t");
	    document.getElementById("AscSolarEquinoxCheck").checked = (this.getCookie("AscSolarEquinoxCheck") == "t");
	    document.getElementById("NorthSolsticeCheck").checked = (this.getCookie("NorthSolsticeCheck") == "t");
	    document.getElementById("DescSolarEquinoxCheck").checked = (this.getCookie("DescSolarEquinoxCheck") == "t");
	    document.getElementById("EarthPerihelionCheck").checked = (this.getCookie("EarthPerihelionCheck") == "t");
	    document.getElementById("EarthAphelionCheck").checked = (this.getCookie("EarthAphelionCheck") == "t");
	    document.getElementById("MercTransitCheck").checked = (this.getCookie("MercTransitCheck") == "t");
	    document.getElementById("VenusTransitCheck").checked = (this.getCookie("VenusTransitCheck") == "t");
	    document.getElementById("MercInfConjCheck").checked = (this.getCookie("MercInfConjCheck") == "t");
	    document.getElementById("MercSupConjCheck").checked = (this.getCookie("MercSupConjCheck") == "t");
	    document.getElementById("MercWestElongCheck").checked = (this.getCookie("MercWestElongCheck") == "t");
	    document.getElementById("MercEastElongCheck").checked = (this.getCookie("MercEastElongCheck") == "t");
	    document.getElementById("VenusInfConjCheck").checked = (this.getCookie("VenusInfConjCheck") == "t");
	    document.getElementById("VenusSupConjCheck").checked = (this.getCookie("VenusSupConjCheck") == "t");
	    document.getElementById("VenusWestElongCheck").checked = (this.getCookie("VenusWestElongCheck") == "t");
	    document.getElementById("VenusEastElongCheck").checked = (this.getCookie("VenusEastElongCheck") == "t");
	    document.getElementById("MarsConjCheck").checked = (this.getCookie("MarsConjCheck") == "t");
	    document.getElementById("MarsWestQuadCheck").checked = (this.getCookie("MarsWestQuadCheck") == "t");
	    document.getElementById("MarsOppCheck").checked = (this.getCookie("MarsOppCheck") == "t");
	    document.getElementById("MarsEastQuadCheck").checked = (this.getCookie("MarsEastQuadCheck") == "t");
	    document.getElementById("JupiterConjCheck").checked = (this.getCookie("JupiterConjCheck") == "t");
	    document.getElementById("JupiterWestQuadCheck").checked = (this.getCookie("JupiterWestQuadCheck") == "t");
	    document.getElementById("JupiterOppCheck").checked = (this.getCookie("JupiterOppCheck") == "t");
	    document.getElementById("JupiterEastQuadCheck").checked = (this.getCookie("JupiterEastQuadCheck") == "t");
	    document.getElementById("SaturnConjCheck").checked = (this.getCookie("SaturnConjCheck") == "t");
	    document.getElementById("SaturnWestQuadCheck").checked = (this.getCookie("SaturnWestQuadCheck") == "t");
	    document.getElementById("SaturnOppCheck").checked = (this.getCookie("SaturnOppCheck") == "t");
	    document.getElementById("SaturnEastQuadCheck").checked = (this.getCookie("SaturnEastQuadCheck") == "t");
	    var lat=this.getCookie("latitudeCheck");
	    var lng=this.getCookie("longitudeCheck");
	    if (lat !== "" && lng !== "") {
		document.getElementById("lat").value=lat;
		document.getElementById("lng").value=lng;
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
    this.setStartDate=function(target) {
	var tzoffset = (new Date(target)).getTimezoneOffset() * 60000; //offset in milliseconds
	var dtg=new Date(target - tzoffset).toISOString();
	var d=dtg.substring(0,10);
	var t=dtg.substring(11,19);
	document.getElementById("start_dt").value=d;
	document.getElementById("start_tm").value=t;
    };
    this.drawData=function (documentTable, id) {
	if (this.rawData[id]==undefined) {
	    documentTable.innerHTML="<em>No data available.</em>";
	} else {
	    var d=new Date();
	    var tnow=d.getTime();
	    var cellCnt=4;
	    var reportCnt=0;
	    var documentReportCnt=documentTable.rows.length;
	    this.rawData[id].clean(undefined);
	    var dataReportsCnt=this.rawData[id].length;
	    if (dataReportsCnt != documentReportCnt) {
		//console.log("Must redraw."+dataReportsCnt+" "+documentReportCnt);
		this.drawAll=true;
	    };
	    if (this.drawAll && documentReportCnt==0) {
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
			(t*1)+","+(repid)+")\">"+t.nice()+"</button>";
		    //console.log("drawing button:"+t.nice());
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
	    if (this.drawAll && reportCnt==0) {
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
	if (this.targetSet && tt==this.targetTime) {
	    this.targetSet=false;
	    this.targetId=undefined;
	} else {
	    this.targetSet=true;
	    this.targetTime=tt;
	    this.setStartDate(this.targetTime);
	    this.setEndDate(this.targetTime);
	    this.targetId=id;
	}
    }
    this.setTargetId=function(tt,id) {
	//console.log("Setting target to:"+tt+" "+this.targetSet);
	this.targetSet=true;
	this.targetTime=tt;
	this.setStartDate(this.targetTime);
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
	if (dd != 0) s=s+" "+this.numberWithCommas(dd)+"d";
	if (hh != 0) s=s+" "+hh+"h";
	if (mm != 0) s=s+" "+mm+"m";
	if (ss != 0) s=s+" "+ss+"s";
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
	if (this.rawData[id] != undefined) {
	    this.dataToArray(data,status,id+1,documentLog);
	    this.dataMerge(id,id+1);
	} else {
	    this.dataToArray(data,status,id,documentLog);
	}
    }
    this.dataMerge=function(id1,id2) {
	this.rawData[id1]=this.rawData[id1].concat(this.rawData[id2]).unique().sort(function(a, b){return a[0]-b[0]});
    }
    this.clearArray=function() {
	this.rawData = [];
	this.drawAll=true;
    }
    this.dataToArray=function(data,status,id,documentLog) {
	this.lastCnt=1;
	if (status == "success") {
	    var d=new Date();
	    var tnow=d.getTime();
	    //console.log("Adding data to array-id="+id);
	    if (this.rawData[id]==undefined) {
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
		    if (error == null) {
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
	this.clean             = function () {var obj=Object.keys(this);for (var ii=0; ii<obj.length;ii++) 
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
	if (eventId == 640 ) { // civil twilight start
	    return localDtg+1;
	} else if (eventId == 650) {
	    return localDtg-1;
	} else {
	    return localDtg;
	}
    }

    //Function called to initialize / create the map.
    //This is called when the page has loaded.
    this.initMap=function() {
	//console.log("Initialising map.");
	//The center location of our map.
	var lat= +(document.getElementById("lat").value);
	var lng= +(document.getElementById("lng").value);
	var centerOfMap = new google.maps.LatLng(lat,lng);
	
	//Map options.
	var options = {
	    mapTypeId: google.maps.MapTypeId.ROADMAP,
	    mapTypeControl: false,
	    disableDoubleClickZoom: true,
	    zoomControlOptions: true,
	    streetViewControl: false,
	    center: centerOfMap, //Set center.
	    zoom: 3 //The zoom value.
	};

	//Create the map object.
	this.map = new google.maps.Map(document.getElementById('map'), options);
	this.map.setCenter(centerOfMap);

	var styleOptions = {name: "Dummy Style"};
	var MAP_STYLE = [{
            featureType: "road",
            elementType: "all",
            stylers: [{ visibility: "on" }]
	}];
	var mapType = new google.maps.StyledMapType(MAP_STYLE, styleOptions);
	this.map.mapTypes.set("Dummy Style", mapType);
	this.map.setMapTypeId("Dummy Style");

	var latlng = new google.maps.LatLng(lat,lng);
	this.marker = new google.maps.marker({
	    position: latlng,
	    draggable: true //make it draggable
	});
	this.marker.setMap(this.map);
	google.maps.event.addListener(this.marker, 'dragend', function(event){this.markerLocation();});

	//Listen for any clicks on the map.
	google.maps.event.addListener(this.map, 'click', function(event) {                
            //Get the location that the user clicked.
            var clickedLocation = event.latLng;
            //If the marker hasn't been added.
            if(this.marker === undefined){
		//Create the marker.
		this.marker = new google.maps.Marker({
                    position: clickedLocation,
                    map: this.map,
                    draggable: true //make it draggable
		});
		//Listen for drag events!
		google.maps.event.addListener(this.marker, 'dragend', function(event){
                    this.markerLocation();
		});
            } else{
		//Marker has already been added, so just change its location.
		this.marker.setPosition(clickedLocation);
            }
            //Get the marker's location.
            this.markerLocation();
	});
	//console.log("Initialised map.");
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
	    var lat= +(document.getElementById("lat").value);
	    var lng= +(document.getElementById("lng").value);
	    if (lat !== undefined && lng !== undefined) {
		var latlng = new google.maps.LatLng(lat,lng);
		this.marker.setPosition(latlng);
		this.map.setCenter(latlng);   
	    }
	}
    }

    //Load the map when the page has finished loading.
    google.maps.event.addDomListener(window, 'load', this.initMap);
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
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	}
	return "";
    } 
    this.countdown=function() {
	if (this.initialise) {this.init();this.initialise=false;}
	var d=new Date();
	var tnow=d.getTime();
	var updateData = document.getElementById("updateCheck").checked;
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
	    var tnow=Date.now();
	    this.setStartDate(tnow);
	    this.setEndDate(tnow);
	}
	var documentTable = document.getElementById("dataTable");
	this.drawData(documentTable,1);
	setTimeout("countdown()",500);
    }
    this.updateCost=function(cost) {
	if (cost == -1) {
	    this.totalCost=0;  
	} else {
	    var oldCost=this.getCookie("costCheck")
	    if (oldCost !== "") {
		this.totalCost=oldCost;
	    }
	    this.totalCost=Math.min(99.99,+this.totalCost + (+cost*0.00345));
	}
	$("#cost").fadeIn(1000);
	document.getElementById("cost").innerHTML="$"+(+this.totalCost).toFixed(2);
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
    this.setStartDate=function(target) {
	var tzoffset = (new Date(target)).getTimezoneOffset() * 60000; //offset in milliseconds
	var dtg=new Date(target - tzoffset).toISOString();
	var d=dtg.substring(0,10);
	var t=dtg.substring(11,19);
	document.getElementById("start_dt").value=d;
	document.getElementById("start_tm").value=t;
    }
    this.startfocus=function() {
	this.targetSet=true;
    }
    this.startblur=function() {
	this.targetSet=true;
	var dtg=document.getElementById("start_dt").value+"T"+document.getElementById("start_tm").value+"Z"
	var tzoffset = (new Date(dtg)).getTimezoneOffset() * 60000; //offset in milliseconds
	this.targetTime=new Date(dtg).getTime()+tzoffset;
	this.setEndDate(this.targetTime);
    }
    this.setEndDate=function(target) {
	var tzoffset = (new Date(target)).getTimezoneOffset() * 60000; //offset in milliseconds
	var dtg=new Date(target - tzoffset + this.dtime*86400000).toISOString();
	var d=dtg.substring(0,10);
	document.getElementById("end_dt").value=d;
    }
    this.getData=function() {
	var d=new Date();
	var tnow=d.getTime();
	this.targetUpdate=tnow-1000;
	var pos = new geoloc(document.getElementById("lat").value, 
			     document.getElementById("lng").value); 
	this.setPositionData(pos);
    }
    this.searchPosition=function() {
	var string=document.getElementById("search").value;
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode(
	    {"address": string},
	    function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
		    var loc=results[0].geometry.location;
		    var pos = new geoloc(loc.lat(),loc.lng()); 
		    this.setPosition( pos );
		}
	    }
	);
    }
    this.getPosition=function() {
	if (navigator.geolocation) {
	    //console.log("Getting position.");
	    navigator.geolocation.getCurrentPosition(this.setPosition);
	}
    }
    this.setPosition=function(position) {
	document.getElementById("lat").value=position.coords.latitude;
	document.getElementById("lng").value=position.coords.longitude;
	this.positionIsSet=true;
	setMapPosition();
    }
    this.getPositionData=function() {
	if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(this.setPositionData);
	}
    }
    this.checkEnd=function() {
	if (!document.getElementById("previousCheck").checked && !document.getElementById("nextCheck").checked) {
	    document.getElementById("end_p").style.display = "block";
	    document.getElementById("end_m").style.display = "block";
	    document.getElementById("end_dt").style.display = "block";
	    //$("#end_m").fadeIn();
	} else {
	    document.getElementById("end_p").style.display = "none";
	    document.getElementById("end_m").style.display = "none";
	    document.getElementById("end_dt").style.display = "none";
	    //$("#end_dt").fadeOut();
	}
    }
    this.setPositionData=function(position) {
	this.setPosition(position);
	var d=new Date();
	var tnow=d.getTime();
	var newpos=isNewPos(position.coords.latitude,position.coords.longitude);
	//console.log("Got position."+this.targetUpdate+"  "+tnow);
	if (newpos || this.targetUpdate < tnow) {
	    lastUpdate=tnow+10000; 
	    //console.log("Updating data.");
	    var req=new request();
	    var dt = 86400000.0;
	    var requestTime=tnow;
	    var replace=true;
	    if (this.targetSet) {replace=false;requestTime=this.targetTime;};
	    if (newpos) {replace=true;};
	    req.addDebug();
	    req.addPosition("",position.coords.latitude,position.coords.longitude,0)
	    if(document.getElementById("previousCheck").checked) {
		if (document.getElementById("nextCheck").checked) {
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
	    } else if (document.getElementById("nextCheck").checked) {
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
	    if (addEvents(req)) {
		//console.log(req);
		documentLog.innerHTML = "<em>Server-request: sent</em>";
		console.log("Sending event-request :",req);
		if (replace) {
		    $.get("cgi-bin/event.pl",req,function(data, status){dataToArray(data,status,1,documentLog);});
		} else {
		    $.get("cgi-bin/event.pl",req,function(data, status){addDataToArray(data,status,1,documentLog);});
		}
	    } else {
		clearArray();
	    }
	}
    }
    this.addEvents=function(req) {
	this.setCookie("cookieCheck","t",10);
	if (document.getElementById("updateCheck").checked)         {this.setCookie("updateCheck","t",10);}    else {this.setCookie("updateCheck","f",0);};
	if (document.getElementById("previousCheck").checked)       {this.setCookie("previousCheck","t",10);}  else {this.setCookie("previousCheck","f",0);};
	if (document.getElementById("nextCheck").checked)           {this.setCookie("nextCheck","t",10);}      else {this.setCookie("nextCheck","f",0);};
	var id=1;
	if(document.getElementById("sunRiseCheck").checked)         {this.setCookie("sunRiseCheck","t",10);req.addSunRise(id++);} else {this.setCookie("sunRiseCheck","f",0)};
	if(document.getElementById("sunSetCheck").checked)         {this.setCookie("sunSetCheck","t",10);req.addSunSet(id++);} else {this.setCookie("sunSetCheck","f",0)};
	if(document.getElementById("sunEleMaxCheck").checked)          {this.setCookie("sunEleMaxCheck","t",10);req.addSunEleMax(id++);} else {this.setCookie("sunEleMaxCheck","f",0)};
	if(document.getElementById("sunEleMinCheck").checked)          {this.setCookie("sunEleMinCheck","t",10);req.addSunEleMin(id++);} else {this.setCookie("sunEleMinCheck","f",0)};
	if(document.getElementById("civilCheck").checked)           {this.setCookie("civilCheck","t",10);req.addTwilightCivilStart(id++);req.addTwilightCivilStop(id++);} else {this.setCookie("civilCheck","f",0)};
	if(document.getElementById("nauticalCheck").checked)        {this.setCookie("nauticalCheck","t",10);req.addTwilightNauticalStart(id++);req.addTwilightNauticalStop(id++);} else {this.setCookie("nauticalCheck","f",0)};
	if(document.getElementById("astronomicalCheck").checked)    {this.setCookie("astronomicalCheck","t",10);req.addTwilightAstronomicalStart(id++);req.addTwilightAstronomicalStop(id++);} else {this.setCookie("astronomicalCheck","f",0)};
	if(document.getElementById("nightCheck").checked)           {this.setCookie("nightCheck","t",10);req.addNightStart(id++);req.addNightStop(id++);} else {this.setCookie("nightCheck","f",0)};
	if(document.getElementById("polarDayStartCheck").checked)        {this.setCookie("polarDayStartCheck","t",10);req.addPolarSunDayStart(id++);} else {this.setCookie("polarDayStartCheck","f",0)};
	if(document.getElementById("polarDayStopCheck").checked)        {this.setCookie("polarDayStopCheck","t",10);req.addPolarSunDayStop(id++);} else {this.setCookie("polarDayStopCheck","f",0)};
	if(document.getElementById("polarNightStartCheck").checked)      {this.setCookie("polarNightStartCheck","t",10);req.addPolarSunNightStart(id++);} else {this.setCookie("polarNightStartCheck","f",0)};
	if(document.getElementById("polarNightStopCheck").checked)      {this.setCookie("polarNightStopCheck","t",10);req.addPolarSunNightStop(id++);} else {this.setCookie("polarNightStopCheck","f",0)};
	if(document.getElementById("sunEclipseCheck").checked)      {this.setCookie("sunEclipseCheck","t",10);req.addSunEclipseMinMax(id++,0.1,100);} else {this.setCookie("sunEclipseCheck","f",0)};
	if(document.getElementById("moonRiseCheck").checked)        {this.setCookie("moonRiseCheck","t",10);req.addMoonRise(id++);} else {this.setCookie("moonRiseCheck","f",0)};
	if(document.getElementById("moonSetCheck").checked)        {this.setCookie("moonSetCheck","t",10);req.addMoonSet(id++);} else {this.setCookie("moonSetCheck","f",0)};
	if(document.getElementById("moonEleMaxCheck").checked)         {this.setCookie("moonEleMaxCheck","t",10);req.addMoonEleMax(id++);} else {this.setCookie("moonEleMaxCheck","f",0)};
	if(document.getElementById("moonEleMinCheck").checked)         {this.setCookie("moonEleMinCheck","t",10);req.addMoonEleMin(id++);} else {this.setCookie("moonEleMinCheck","f",0)};
	// if(document.getElementById("lunarDayStartCheck").checked)        {this.setCookie("lunarDayStartCheck","t",10);req.addPolarMoonDayStart(id++);} else {this.setCookie("lunarDayStartCheck","f",0)};
	// if(document.getElementById("lunarDayStopCheck").checked)        {this.setCookie("lunarDayStopCheck","t",10);req.addPolarMoonDayStop(id++);} else {this.setCookie("lunarDayStopCheck","f",0)};
	// if(document.getElementById("lunarNightStartCheck").checked)      {this.setCookie("lunarNightStartCheck","t",10);req.addPolarMoonNightStart(id++);} else {this.setCookie("lunarNightStartCheck","f",0)};
	// if(document.getElementById("lunarNightStopCheck").checked)      {this.setCookie("lunarNightStopCheck","t",10);req.addPolarMoonNightStop(id++);} else {this.setCookie("lunarNightStopCheck","f",0)};
	if(document.getElementById("MoonNewCheck").checked)         {this.setCookie("MoonNewCheck","t",10);req.addMoonNew(id++);} else {this.setCookie("MoonNewCheck","f",0)};
	if(document.getElementById("MoonFirstQuartCheck").checked)  {this.setCookie("MoonFirstQuartCheck","t",10);req.addMoonFirstQuart(id++);} else {this.setCookie("MoonFirstQuartCheck","f",0)};
	if(document.getElementById("MoonFullCheck").checked)        {this.setCookie("MoonFullCheck","t",10);req.addMoonFull(id++);} else {this.setCookie("MoonFullCheck","f",0)};
	if(document.getElementById("MoonLastQuartCheck").checked)   {this.setCookie("MoonLastQuartCheck","t",10);req.addMoonLastQuart(id++);} else {this.setCookie("MoonLastQuartCheck","f",0)};
	if(document.getElementById("MoonIllMinCheck").checked)      {this.setCookie("MoonIllMinCheck","t",10);req.addMoonIllMin(id++);} else {this.setCookie("MoonIllMinCheck","f",0)};
	if(document.getElementById("MoonIllMaxCheck").checked)      {this.setCookie("MoonIllMaxCheck","t",10);req.addMoonIllMax(id++);} else {this.setCookie("MoonIllMaxCheck","f",0)};
	if(document.getElementById("SouthLunasticeCheck").checked)  {this.setCookie("SouthLunasticeCheck","t",10);req.addSouthLunastice(id++);} else {this.setCookie("SouthLunasticeCheck","f",0)};
	if(document.getElementById("AscLunarEquinoxCheck").checked) {this.setCookie("AscLunarEquinoxCheck","t",10);req.addAscLunarEquinox(id++);} else {this.setCookie("AscLunarEquinoxCheck","f",0)};
	if(document.getElementById("NorthLunasticeCheck").checked)  {this.setCookie("NorthLunasticeCheck","t",10);req.addNorthLunastice(id++);} else {this.setCookie("NorthLunasticeCheck","f",0)};
	if(document.getElementById("DescLunarEquinoxCheck").checked) {this.setCookie("DescLunarEquinoxCheck","t",10);req.addDescLunarEquinox(id++);} else {this.setCookie("DescLunarEquinoxCheck","f",0)};
	if(document.getElementById("MoonPerigeeCheck").checked)     {this.setCookie("MoonPerigeeCheck","t",10);req.addMoonPerigee(id++);} else {this.setCookie("MoonPerigeeCheck","f",0)};
	if(document.getElementById("MoonApogeeCheck").checked)      {this.setCookie("MoonApogeeCheck","t",10);req.addMoonApogee(id++);} else {this.setCookie("MoonApogeeCheck","f",0)};
	if(document.getElementById("LunarEclipseMinMaxCheck").checked)      {this.setCookie("LunarEclipseMinMaxCheck","t",10);req.addLunarEclipseMinMax(id++,0.1,100);} else {this.setCookie("LunarEclipseMinMaxCheck","f",0)};
	if(document.getElementById("SouthSolsticeCheck").checked)  {this.setCookie("SouthSolsticeCheck","t",10);req.addSouthSolstice(id++);} else {this.setCookie("SouthSolsticeCheck","f",0)};
	if(document.getElementById("AscSolarEquinoxCheck").checked)   {this.setCookie("AscSolarEquinoxCheck","t",10);req.addAscSolarEquinox(id++);} else {this.setCookie("AscSolarEquinoxCheck","f",0)};
	if(document.getElementById("NorthSolsticeCheck").checked)  {this.setCookie("NorthSolsticeCheck","t",10);req.addNorthSolstice(id++);} else {this.setCookie("NorthSolsticeCheck","f",0)};
	if(document.getElementById("DescSolarEquinoxCheck").checked) {this.setCookie("DescSolarEquinoxCheck","t",10);req.addDescSolarEquinox(id++);} else {this.setCookie("DescSolarEquinoxCheck","f",0)};
	if(document.getElementById("EarthPerihelionCheck").checked) {this.setCookie("EarthPerihelionCheck","t",10);req.addEarthPerihelion(id++);} else {this.setCookie("EarthPerihelionCheck","f",0)};
	if(document.getElementById("EarthAphelionCheck").checked)   {this.setCookie("EarthAphelionCheck","t",10);req.addEarthAphelion(id++);} else {this.setCookie("EarthAphelionCheck","f",0)};
	if(document.getElementById("MercInfConjCheck").checked)     {this.setCookie("MercInfConjCheck","t",10);req.addMercInfConj(id++);} else {this.setCookie("MercInfConjCheck","f",0)};
	if(document.getElementById("MercSupConjCheck").checked)     {this.setCookie("MercSupConjCheck","t",10);req.addMercSupConj(id++);} else {this.setCookie("MercSupConjCheck","f",0)};
	if(document.getElementById("MercWestElongCheck").checked)   {this.setCookie("MercWestElongCheck","t",10);req.addMercWestElong(id++);} else {this.setCookie("MercWestElongCheck","f",0)};
	if(document.getElementById("MercEastElongCheck").checked)   {this.setCookie("MercEastElongCheck","t",10);req.addMercEastElong(id++);} else {this.setCookie("MercEastElongCheck","f",0)};
	if(document.getElementById("VenusInfConjCheck").checked)    {this.setCookie("VenusInfConjCheck","t",10);req.addVenusInfConj(id++);} else {this.setCookie("VenusInfConjCheck","f",0)};
	if(document.getElementById("VenusSupConjCheck").checked)    {this.setCookie("VenusSupConjCheck","t",10);req.addVenusSupConj(id++);} else {this.setCookie("VenusSupConjCheck","f",0)};
	if(document.getElementById("VenusWestElongCheck").checked)  {this.setCookie("VenusWestElongCheck","t",10);req.addVenusWestElong(id++);} else {this.setCookie("VenusWestElongCheck","f",0)};
	if(document.getElementById("VenusEastElongCheck").checked)  {this.setCookie("VenusEastElongCheck","t",10);req.addVenusEastElong(id++);} else {this.setCookie("VenusEastElongCheck","f",0)};
	if(document.getElementById("MarsConjCheck").checked)        {this.setCookie("MarsConjCheck","t",10);req.addMarsConj(id++);} else {this.setCookie("MarsConjCheck","f",0)};
	if(document.getElementById("MarsWestQuadCheck").checked)    {this.setCookie("MarsWestQuadCheck","t",10);req.addMarsWestQuad(id++);} else {this.setCookie("MarsWestQuadCheck","f",0)};
	if(document.getElementById("MarsOppCheck").checked)         {this.setCookie("MarsOppCheck","t",10);req.addMarsOpp(id++);} else {this.setCookie("MarsOppCheck","f",0)};
	if(document.getElementById("MarsEastQuadCheck").checked)    {this.setCookie("MarsEastQuadCheck","t",10);req.addMarsEastQuad(id++);} else {this.setCookie("MarsEastQuadCheck","f",0)};
	if(document.getElementById("JupiterConjCheck").checked)     {this.setCookie("JupiterConjCheck","t",10);req.addJupiterConj(id++);} else {this.setCookie("JupiterConjCheck","f",0)};
	if(document.getElementById("JupiterWestQuadCheck").checked) {this.setCookie("JupiterWestQuadCheck","t",10);req.addJupiterWestQuad(id++);} else {this.setCookie("JupiterWestQuadCheck","f",0)};
	if(document.getElementById("JupiterOppCheck").checked)      {this.setCookie("JupiterOppCheck","t",10);req.addJupiterOpp(id++);} else {this.setCookie("JupiterOppCheck","f",0)};
	if(document.getElementById("JupiterEastQuadCheck").checked) {this.setCookie("JupiterEastQuadCheck","t",10);req.addJupiterEastQuad(id++);} else {this.setCookie("JupiterEastQuadCheck","f",0)};
	if(document.getElementById("SaturnConjCheck").checked)      {this.setCookie("SaturnConjCheck","t",10);req.addSaturnConj(id++);} else {this.setCookie("SaturnConjCheck","f",0)};
	if(document.getElementById("SaturnWestQuadCheck").checked)  {this.setCookie("SaturnWestQuadCheck","t",10);req.addSaturnWestQuad(id++);} else {this.setCookie("SaturnWestQuadCheck","f",0)};
	if(document.getElementById("SaturnOppCheck").checked)       {this.setCookie("SaturnOppCheck","t",10);req.addSaturnOpp(id++);} else {this.setCookie("SaturnOppCheck","f",0)};
	if(document.getElementById("SaturnEastQuadCheck").checked)  {this.setCookie("SaturnEastQuadCheck","t",10);req.addSaturnEastQuad(id++);} else {this.setCookie("SaturnEastQuadCheck","f",0)};
	if(document.getElementById("MercTransitCheck").checked)     {this.setCookie("MercTransitCheck","t",10);req.addMercTransit(id++);} else {this.setCookie("MercTransitCheck","f",0)};
	if(document.getElementById("VenusTransitCheck").checked)    {this.setCookie("VenusTransitCheck","t",10);req.addVenusTransit(id++);} else {this.setCookie("VenusTransitCheck","f",0)};
	this.setCookie("latitudeCheck",document.getElementById("lat").value,10)
	this.setCookie("longitudeCheck",document.getElementById("lng").value,10)
	req.clean();
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
	var lat=document.getElementById("lat").value;
	var lon=document.getElementById("lng").value;
	var label = "Now";
	var target = getTarget(targetId);
	var fov = getFov(targetId);
	var dir;
	var con=0;
	var play;
	var url="sky.html?lat="+lat+"&lon="+lon+"&dtg="+dtg+"&label="+label+"&target="+target+"&fov="+fov+"&con="+con;
	if (this.window3D!==undefined) {
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
};
Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
	    //[localDtg,eventId,reportId,reportVal,reportHint]
	    if(Math.abs(a[i][0]-a[j][0]) < 2000 && a[i][1] == a[j][1] &&a[i][2] == a[j][2])
                a.splice(j--, 1);
        }
    }

    return a;
};
Date.prototype.nice = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = this.getDate().toString();
    var hh  = this.getHours().toString();
    var mi  = this.getMinutes().toString();
    var ss  = this.getSeconds().toString();
    return yyyy+"-"+(mm[1]?mm:"0"+mm[0])+"-"+(dd[1]?dd:"0"+dd[0])+" "
	+(hh[1]?hh:"0"+hh[0])+":"+(mi[1]?mi:"0"+mi[0])+":"+(ss[1]?ss:"0"+ss[0]); // padding
};

Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
	if (this[i] == deleteValue) {         
	    this.splice(i, 1);
	    i--;
	}
    }
    return this;
};

