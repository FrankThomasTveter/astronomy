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

import * as TWEEN from 'tween';

console.log("Loading chain.js");

function Chain() { 
    this.step = 0;
    this.redraw = true;
    this.consTime = (new Date().getTime())-10000.0;
    this.consReq = 0;
    this.lastCon = 0;
    this.lastTime = (new Date().getTime())-10000.0;
    this.initRequest = function (state) {
	var url=this.getUrlVars();
	Request.launch(url["lat"],url["lon"],url["dtg"],url["hrs"],url["label"],url["target"],url["fov"],url["dir"],url["con"],url["play"]);
    };
    this.initRenderer = function (state,context) {
	//renderer = new Renderer(context);
	//renderer.setSize( window.innerWidth, window.innerHeight );
	//document.body.appendChild( renderer.domElement );
    };
    this.initScene = function (state) {
	state.Scene.observer=state.Planets.observer;
	state.Scene.add (state.Planets.sun);
	state.Scene.add (state.Planets.mercury);
	state.Scene.add (state.Planets.venus);
	state.Scene.add (state.Planets.earth);
	state.Scene.add (state.Planets.moon);
	state.Scene.add (state.Planets.mars);
	state.Scene.add (state.Planets.jupiter);
	state.Scene.add (state.Planets.saturn);
	state.Scene.add (state.Planets.uranus);
	state.Scene.add (state.Planets.neptune);
	state.Scene.add (state.Planets.pluto);
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
	//this.controls.offzoom(1.0);
    };
    this.updateScene = function (state) {
	// update position of all bodies
	if (state.Stack.stack.reqId !== -1) {
	    var st=state.Stack.stack[state.Stack.stack.current];
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
	    state.Chain.camera.position.copy(state.Scene.observer.position);
	    state.Chain.camera.setUp(state.Scene.observer.zenith); // up is always towards observer zenith...
	}
    };
    this.play  = function (state) {
	state.Stack.play();
    };
    this.pushUrl  = function (state) {
	state.Stack.pushUrl();
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
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
						 function(m,key,value) {
						     //console.log("URL item:",key," ",value)
						     vars[key] = value;
						 });
	return vars;
    };
    //this.fType = this.getUrlVars()["type"];
    this.init = function (state,canvas) {
	this.initCamera();
	this.initRequest();
	this.initRenderer(canvas);
	this.initScene();
	this.initControls();
    }

    this.run = function (state) {
	this.requestAnimFrame(this.run);
	this.nowMsec=new Date().getTime();
	if (this.lastMsec === undefined) {this.lastTimeMsec=this.nowMsec;};
	var deltaMsec   = Math.min(200, this.nowMsec - this.lastMsec)
	if (this.tweentime > this.nowMsec) {
	    TWEEN.update();
	    this.redraw=true;
	} else {
	    if (controls.update()) { this.step=0;};
	    if (controls.redraw) {
		controls.redraw=false;
		this.redraw=true;
	    };
	}
	if (Request.update()) { this.step=0;};
	if (Stack.processNewRequests()) { 
	    controls.offzoom(0.5);
	    this.step=0;
	};
	if (this.step == 0) {
	    Stack.update();
	    if (Stack.redraw) {
		this.redraw=true;
		Stack.redraw=false;
	    };
	    this.updateScene();
	};
	if (this.redraw) {
	    this.updateCamera();
	    this.redraw=false;
	};
	this.lastTimeMsec= this.nowMsec;
	if (stack.reqId !== -1 && stack.play.speed > 0) {
	    this.step=(this.step+1)%2;    
	} else {
	    this.step=(this.step+1)%100;    
	};
	renderer.render( scene, camera );
	//setTimeout(function(){ this.run();},10);

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

export default Chain;
