import Vector3 from './Vector3Lib';
//import Vector2 from './Vector2Lib';
import * as THREE from 'three';
//import {Vector3,Matrix4,Quaternion} from 'three';

console.log("Loading OrbitLib");

// calculates to and from osculating elements
function Orbit(){
    // useful constants...
    this.DEG_TO_RAD = Math.PI/180;
    this.RAD_TO_DEG = 180/Math.PI;
    this.twopi  = 2.0*Math.PI;
    this.CIRCLE = 2 * Math.PI;
    this.AU = 149597870;
    this.KM = 1000;
    this.DEG_TO_RAD = Math.PI/180;
    this.RAD_TO_DEG = 180/Math.PI;
    this.NM_TO_KM = 1.852;
    this.LB_TO_KG = 0.453592;
    this.LBF_TO_NEWTON = 4.44822162;
    this.FT_TO_M = 0.3048;
    this.DAY = 60 * 60 * 24;
    this.YEAR = 365.2525;
    this.CENTURY = 100 * this.YEAR;
    this.SIDERAL_DAY = 3600 * 23.9344696;
    // check if we have a new request to process.
    this.update = function (state) {
	var ret=false;
	var reqId=state.Chain.requests.current;
	var req = state.Chain.requests[reqId]
	if ( req.received & ! req.elements) { // we have a new target
	    //console.log("Calculating orbital elements:",req);
	    // calculate osculating orbital elements
	    for ( var tt = 0; tt < req["events"].length; tt++) {
		req["events"][tt]["epoch"]=(new Date(req["events"][tt]["dtg"])).getTime();// get epoch
		if (req["events"][tt]["state"] !== undefined) {
		    var stx=req["events"][tt]["state"];
		    req["events"][tt]["elements"]={};
		    var elements=req["events"][tt]["elements"];
		    for (var name in stx) {
			var s = stx[name];
			elements[name]={};
			var e=elements[name];
			var xmu;
			var main =  req["initial"][name]["main"];
			var r = stx;
			if (main !== "") { // body orbits another body...
			    r=stx[main];
			    xmu=req["initial"][main]["xmu"]
			    this.state2elements(s,e,r,xmu);
			    this.elements2anomalies(e);
			}
		    };
		};
	    };
	    req.elements = true;
	    //console.log("Calculated orbital elements:",req);
	    ret=true;
	}
	return ret;
    };
    this.getState = function (state, req, ret){
	var tnow=new Date().getTime();
	if (req.play.event === undefined) { // propagate state to right epoch using elliptical orbits
	    var ttrg = (tnow-req.play.e0) * req.play.speed + req.play.m0;
	    //console.log("******************getState interpolating: ",ttrg,req);
	    // find correct epoch
	    for ( var tt = 0; tt < req["events"].length; tt++) {
		if (req["events"][tt]["epoch"] <= ttrg &  
		    req["events"][tt]["epoch"] >=  req.play.prevEpoch) {
		    req.play.prev=tt;
		    req.play.prevEpoch=req["events"][req.play.prev]["epoch"];
		}
		if (req["events"][tt]["epoch"] >= ttrg &  
		    req["events"][tt]["epoch"] <=  req.play.nextEpoch) {
		    req.play.next=tt;
		    req.play.nextEpoch=req["events"][req.play.next]["epoch"];
		}
	    }
	    if (req.play.prev !== undefined & req.play.next !== undefined) { // success!
		var dt = ttrg-req.play.prevEpoch;
		var dt0 = req.play.nextEpoch - req.play.prevEpoch;
		var f = dt/Math.max(1e-10,dt0);

		//console.log("Interpolating with:",ttrg,req.play.prevEpoch,dt,dt0,f);

		if (ret.bodies === undefined) {ret.bodies={};};
		this.interpolateBodies(req,dt,f,ret.bodies);
		this.interpolateObserver(req,dt,f,ret.bodies);
		ret.epoch = ttrg;
	    } else if (req.play.prev !== undefined) {  // found epoch before, but not after
		if (ret.bodies === undefined) {ret.bodies={};};
		this.getBodies(req["events"][req.play.prev],ret.bodies);
		this.getObserver(req["events"][req.play.prev],ret.bodies);
		ret.epoch = req["events"][req.play.prev].epoch;
	    } else if (req.play.next !== undefined) {  // found epoch before, but not after
		if (ret.bodies === undefined) {ret.bodies={};};
		this.getBodies(req["events"][req.play.next],ret.bodies);
		this.getObserver(req["events"][req.play.next],ret.bodies);
		ret.epoch = req["events"][req.play.next].epoch;
	    }
	    
	} else {
	    //console.log("******************getState fixed: ",req);
	    if (ret.bodies === undefined) {ret.bodies={};};
	    this.getBodies(req["events"][req.play.event],ret.bodies);
	    this.getObserver(req["events"][req.play.event],ret.bodies);
	    ret.epoch = req["events"][req.play.event].epoch;

	}
	//console.log("******************getState: ",ret);
	
    };
    this.getBodies = function (state,bodies) {
	for (var name in state["state"]) {
	    var s = state["state"][name];
	    if (bodies[name] === undefined) bodies[name]={}; 
	    //console.log("getBodies State:",state,s,name);
	    bodies[name].x = +s.x;
	    bodies[name].y = +s.y;
	    bodies[name].z = +s.z;
	    bodies[name].vx = +s.vx;
	    bodies[name].vy = +s.vy;
	    bodies[name].vz = +s.vz;
	    bodies[name].ra = +s.ra;
	    bodies[name].dec = +s.dec;
	    bodies[name].w = +s.w;
	    bodies[name].name=name;
	} 
    };
    // get observer position and EF-coordinate system...
    this.getObserver = function (state,bodies) { 
	var obs=state["observer"];
	var origo=obs.loc.origo;
	if (bodies.observer === undefined) bodies.observer={}; 
	if (bodies[origo] === undefined ) {
	    bodies.observer.x=obs.loc.x;
	    bodies.observer.y=obs.loc.y;
	    bodies.observer.z=obs.loc.z;
	} else {
	    bodies.observer.origo=origo;
	    bodies.observer.x=obs.loc.x + bodies[origo].x;
	    bodies.observer.y=obs.loc.y + bodies[origo].y;
	    bodies.observer.z=obs.loc.z + bodies[origo].z;
	}
	if (bodies.observer.zenith === undefined) bodies.observer.zenith=new Vector3(); 
	bodies.observer.zenith.set(obs.loc.x,obs.loc.y,obs.loc.z);
	bodies.observer.zenith.normalize();

	//console.log("**** Setting observer:",bodies.observer.x,bodies.observer.y,bodies.observer.z);

	if (bodies.observer.i === undefined) bodies.observer.i=new Vector3(); 
	bodies.observer.i.x=obs.i.x;
	bodies.observer.i.y=obs.i.y;
	bodies.observer.i.z=obs.i.z;
	if (bodies.observer.j === undefined) bodies.observer.j=new Vector3(); 
	bodies.observer.j.x=obs.j.x;
	bodies.observer.j.y=obs.j.y;
	bodies.observer.j.z=obs.j.z;
	if (bodies.observer.k === undefined) bodies.observer.k=new Vector3(); 
	bodies.observer.k.x=obs.k.x;
	bodies.observer.k.y=obs.k.y;
	bodies.observer.k.z=obs.k.z;

	//console.log("setting axis:", bodies.observer.i.x,bodies.observer.i.y,bodies.observer.i.z);
    };
    this.interpolateBodies = function(req,dt,f,bodies) {
	// interpolate body positions between times
	//console.log(">>> interpolating body positions.")
	var sp = req["events"][req.play.prev]["state"];
	var sn = req["events"][req.play.next]["state"];
	if (sp === undefined || sn === undefined) {
	    console.log("THIS SHOULD NEVER HAPPEN!.");
	    return;
	};
	for (var name in req["events"][req.play.next]["state"]) {
	    //var name_ = sp[name].name;
	    bodies[name]={};
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
		var r=bodies[main];
		var xmu=req["initial"][main]["xmu"];
		this.elements2state(bodies[name], el, r, xmu);
		//console.log("Prev elements:",ep);
		//console.log("Next elements:",en);
		//console.log("Intp elements:",el);
		//console.log("State main:",r,xmu);
		//console.log("State elements:",bodies[name]);
	    } else { // no orbit available, interpolate state directly
		bodies[name].x = this.intlin(sp[name].x,sn[name].x,f);
		bodies[name].y = this.intlin(sp[name].y,sn[name].y,f);
		bodies[name].z = this.intlin(sp[name].z,sn[name].z,f);
		bodies[name].vx = this.intlin(sp[name].vx,sn[name].vx,f);
		bodies[name].vy = this.intlin(sp[name].vy,sn[name].vy,f);
		bodies[name].vz = this.intlin(sp[name].vz,sn[name].vz,f);
		//console.log("Bodies fixed:",bodies[name]);
	    }
	    bodies[name].ra =  this.intlin(sp[name].ra,sn[name].ra,f);
	    bodies[name].dec =  this.intlin(sp[name].dec,sn[name].dec,f);
	    bodies[name].w =  this.intlin(sp[name].w,sn[name].w,f);
	    bodies[name].name=name;
	}
    };
    // interpolate observer position and EF-coordinate system...
    this.interpolateObserver = function(req,dt,f,bodies) {
	var p=req["events"][req.play.prev]["observer"];
	var n=req["events"][req.play.next]["observer"];
	var origo=p.loc.origo;
	if (origo === undefined) {origo="earth";};
	//console.log("Origo is now: ",origo);
	var rot = req["initial"][origo]["rotation"];
	//
	// make rotation from start to the final coordinate system
	var m=new THREE.Matrix4();
	if (m.elements.te === undefined) {m.elements.te=[];};
	m.elements.te[ 0]= p.i.x*n.i.x + p.j.x*n.j.x + p.k.x*n.k.x;
	m.elements.te[ 4]= p.i.y*n.i.x + p.j.y*n.j.x + p.k.y*n.k.x;
	m.elements.te[ 8]= p.i.z*n.i.x + p.j.z*n.j.x + p.k.z*n.k.x;
	m.elements.te[ 1]= p.i.x*n.i.y + p.j.x*n.j.y + p.k.x*n.k.y;
	m.elements.te[ 5]= p.i.y*n.i.y + p.j.y*n.j.y + p.k.y*n.k.y;
	m.elements.te[ 9]= p.i.z*n.i.y + p.j.z*n.j.y + p.k.z*n.k.y;
	m.elements.te[ 2]= p.i.x*n.i.z + p.j.x*n.j.z + p.k.x*n.k.z;
	m.elements.te[ 6]= p.i.y*n.i.z + p.j.y*n.j.z + p.k.y*n.k.z;
	m.elements.te[10]= p.i.z*n.i.z + p.j.z*n.j.z + p.k.z*n.k.z;
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
	pos.set(p.loc.x,p.loc.y,p.loc.z);

	//console.log("**** Body before:",p.loc.x,pos.x);

	pos.applyQuaternion(q);// gives undefined position ***************************************

	//console.log("**** Body after:",p.loc.x,pos.x,origo);

	//console.log("*** bodies:",bodies);

	if (bodies.observer === undefined) bodies.observer={}; 
	if (bodies[origo] === undefined ) {
	    bodies.observer.x=pos.x;
	    bodies.observer.y=pos.y;
	    bodies.observer.z=pos.z;
	} else {
	    bodies.observer.x=pos.x + bodies[origo].x;
	    bodies.observer.y=pos.y + bodies[origo].y;
	    bodies.observer.z=pos.z + bodies[origo].z;
	    //console.log("**** Body origo:",p.loc.x,pos.x,bodies[origo].x,origo);
	}
	//console.log("**** Interpolating observer:",bodies.observer.x,bodies.observer.y,bodies.observer.z);
	if (bodies.observer.i === undefined) bodies.observer.i=new Vector3(); 
	pos.set(p.i.x,p.i.y,p.i.z);
	pos.applyQuaternion(q);
	bodies.observer.i.x=pos.x;
	bodies.observer.i.y=pos.y;
	bodies.observer.i.z=pos.z;
	if (bodies.observer.j === undefined) bodies.observer.j=new Vector3(); 
	pos.set(p.j.x,p.j.y,p.j.z);
	pos.applyQuaternion(q);
	bodies.observer.j.x=pos.x;
	bodies.observer.j.y=pos.y;
	bodies.observer.j.z=pos.z;
	if (bodies.observer.k === undefined) bodies.observer.k=new Vector3(); 
	pos.set(p.k.x,p.k.y,p.k.z);
	pos.applyQuaternion(q);
	bodies.observer.k.x=pos.x;
	bodies.observer.k.y=pos.y;
	bodies.observer.k.z=pos.z;	    
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
    this.standardOrbit=function(orbit,cydrift,xmu){
	// canonical parameters:
	// orbit.a = semi-major axis
	// orbit.e = eccentricity
	// orbit.i = inclination
	// orbit.o = ascending node  ( =0 if i=0)   between 0 and twopi.
	// orbit.w = argument of perihelion ( =0 if e=0) between 0 and twopi.
	// orbit.v = true anomaly,     between 0 and twopi.
	// auxiliary parameters:
	// orbit.n = mean motion,      rad/seconds
	// orbit.c = eccentric anomaly,     between 0 and twopi.
	// orbit.m0 = mean anomaly,     between 0 and twopi.
	// orbit.l = mean longitude
	// orbit.lp = longitude of perihelion (sum of argument of perihelion and longitude of ascending node)
	//
	if (orbit.lp === undefined && orbit.w !== undefined && orbit.o !== undefined) {
	    orbit.lp = orbit.w + orbit.o;
	    if (orbit.lp > this.twopi) {orbit.lp =orbit.lp-this.twopi;};
	};
	if (orbit.w === undefined && orbit.lp !== undefined && orbit.o !== undefined) {
	    orbit.w = orbit.lp - orbit.o;
	    if (orbit.w < 0) {orbit.w =orbit.w+this.twopi;};
	};
	if (orbit.o === undefined && orbit.w !== undefined && orbit.lp !== undefined) {
	    orbit.o = orbit.lp - orbit.w;
	    if (orbit.o < 0) {orbit.o =orbit.o+this.twopi;};
	};
	if (orbit.m0 === undefined && orbit.l !== undefined && orbit.w !== undefined ) {
	    orbit.m0 = orbit.l - orbit.w;
	    if (orbit.m < 0) {orbit.m =orbit.m+this.twopi;};
	}
	if (orbit.n === undefined) {
	    orbit.n=(Math.sqrt(xmu/orbit.a))/orbit.a; // mean angular motion
	};
    };
    this.state2elements = function( s, e, r, xmu) {
	//
	//   Calculates the classical orbital elements from a state.
	//
	// i  s  = state wrt central body, position & velocity of s/c
	// o  e.a = semi-major axis
	// o  e.e = eccentricity
	// o  e.i = inclination
	// o  e.o = ascending node  ( =0 if i=0)   between 0 and twopi.
	// o  e.w = argument of perigee ( =0 if e=0) between 0 and twopi.
	// o  e.v = true anomaly,     between 0 and twopi.
	// i  r = main body
	// i  xmu =  gravity potential of main body in km**3/sec**2
	//
	if (xmu === undefined) {
	    console.log("Not calculating elements.");
	} else {
	    var sx,sy,sz,svx,svy,svz;
	    if (r === undefined) {
		sx= s.x;
		sy = s.y;
		sz = s.z;
		svx = s.vx;
		svy = s.vy;
		svz = s.vz;
	    } else {
		sx = s.x-r.x;
		sy = s.y-r.y;
		sz = s.z-r.z;
		svx = s.vx-r.vx;
		svy = s.vy-r.vy;
		svz = s.vz-r.vz;
	    }
	    var c1 = sy * svz - sz * svy;
	    var c2 = sz * svx - sx * svz;
	    var c3 = sx * svy - sy * svx;
	    var cc12  =  c1 * c1 + c2 * c2;
	    var cc  =  cc12  +  c3 * c3;
	    var c = Math.sqrt(cc);
	    var v02 = svx * svx + svy * svy + svz * svz;
	    var r0v0 = sx * svx + sy * svy + sz * svz;
	    var r02 = sx * sx + sy * sy + sz * sz;
	    var r0 = Math.sqrt(r02);
	    var x = r0*v02/xmu;
	    var cx = cc/xmu;
	    var ste = r0v0 * c/(r0 * xmu);
	    var cte = cx/r0 - 1.0;
	    e.a = Math.abs(r0/(2.0 - x));
	    e.e = Math.sqrt(ste * ste + cte * cte);
	    e.i = Math.atan2(Math.sqrt(cc12),c3);
	    var u;
	    if(cc12 > cc * 1.0e-20) {
		u  =  Math.atan2(c * sz,sy * c1 - sx * c2);
		e.o  =  Math.atan2(c1, - c2);
	    } else {
		u  =  Math.atan2(sy, sx)*Math.sign(c3);
		e.o = 0.0;
	    }
	    if( e.e  > 1.0e-20) {
		e.v  =  Math.atan2(ste,cte);
		e.w = u - e.v;
	    } else {
		e.v  =  u;
		e.w = 0.0;
	    }
	    if(e.o < 0.0) e.o  =  e.o + (Math.PI * 2.0);
	    if(e.w < 0.0) e.w  =  e.w + (Math.PI * 2.0);
	    if(e.v < 0.0) e.v  =  e.v + (Math.PI * 2.0);
	    e.n=(Math.sqrt(xmu/e.a))/e.a; // mean angular motion
	    //console.log("Elements a=",e.a," e=",e.e," i=",e.i," ascn=",e.o," argp=",e.w," v=",e.v," N=",e.n," mu=",xmu);
	}
    };
    this.elements2anomalies = function ( e ) {
	//
	// get mean anomaly from true anomaly
	//
	// i  e.a = semi-major axis
	// i  e.e = eccentricity
	// i  e.i = inclination
	// i  e.o = ascending node  ( =0 if i=0)   between 0 and twopi.
	// i  e.w = argument of perigee ( =0 if e=0) between 0 and twopi.
	// i  e.v = true anomaly,     between 0 and twopi.
	// o  e.c = eccentric anomaly
	// o  e.m = mean anomaly
	if (((1.0-e.e)  < 1.0E-10) || (e.e < 0.0)) {
	    e.c=e.v;
	    e.m=e.v;
	} else if ((Math.abs((e.v/2.0)-(Math.PI/2.0)) < 1.0E-10) || 
		   (Math.abs((e.v/2.0)-(3.0*Math.PI/2.0)) < 1.0E-10)) {
	    e.c=e.v;
	    e.m=e.v;
            console.log('Tangens isn`t defined for the input ',e.v);
	} else {
            e.c = 2.0 * Math.atan(Math.sqrt((1.0 - e.e)/(1.0 + e.e)) * Math.tan(e.v/2.0));
            if (e.c < 0.0) {e.c = e.c + 2.0*Math.PI;}
	}
	// get mean anomaly from eccentric anomaly
	e.m = e.c - e.e*Math.sin(e.c);
	//console.log("Anomalies ecc=",e.c," mean=",e.m);
    };
    this.anomalies2elements = function ( e ) {
	//
	// get true anomaly from mean anomaly
	//
	// i  e.a = semi-major axis
	// i  e.e = eccentricity
	// i  e.i = inclination
	// i  e.o = ascending node  ( =0 if i=0)   between 0 and twopi.
	// i  e.w = argument of perigee ( =0 if e=0) between 0 and twopi.
	// o  e.v = true anomaly,     between 0 and twopi.
	// i  e.c = eccentric anomaly
	// i  e.m = mean anomaly
	if (((1.0-e.e)  < 1.0E-10) || (e.e < 0.0)) {
	    e.v=e.m;
	    e.c=e.m;
	} else if ((Math.abs((e.m/2.0)-(Math.PI/2.0)) < 1.0E-10) || 
		   (Math.abs((e.m/2.0)-(3.0*Math.PI/2.0)) < 1.0E-10)) {
	    e.v=e.m;
	    e.c=e.m;
	} else {
	    // get eccentric anomaly from mean anomaly
	    e.c = this.solveEccentricAnomaly(e.e, e.m);
	    // get true anomaly from eccentric anomaly
            e.v = 2.0 * Math.atan(Math.sqrt((1.0 + e.e)/(1.0 - e.e)) * Math.tan(e.c/2.0));
            if (e.v < 0.0) {e.v = e.v + 2.0*Math.PI;}
	}
    };
    this.elements2state = function ( s, e, ref, xmu ) {
	//
	//  Calculates state from classical orbital elements.
	//
	//i  e.a =  semi-major axis
	//i  e.e =  eccentricity
	//i  e.i =  inclinationy, in interval 0 to pi
	//i  e.o =  ascending node, in interval 0 to twopi
	//i  e.w =  arg. of perigee, in interval 0 to twopi
	//i  e.v =  true anomaly, in interval 0 to twopi
	//o  s  = state, (position and velocity)
	//
	var p = e.a*(1.0 - e.e*e.e);
	//   safety measure for the square root
	p = Math.max(p,1.0e-30);
	var f = xmu/Math.sqrt(p);
	var cv = Math.cos(e.v);
	var ecv = 1.0 + e.e*cv;
	var r = p/ecv;
	var u = e.w + e.v;
	var cu = Math.cos(u);
	var su = Math.sin(u);
	var co = Math.cos(e.o);
	var so = Math.sin(e.o);
	var ci = Math.cos(e.i);
	var si = Math.sin(e.i);
	var cocu = co*cu;
	var sosu = so*su;
	var socu = so*cu;
	var cosu = co*su;
	var fx = cocu - sosu*ci;
	var fy = socu + cosu*ci;
	var fz = su*si;
	var vr = f*e.e*Math.sin(e.v);
	var vu = f*ecv;
	s.x = r*fx + ref.x;
	s.y = r*fy + ref.y;
	s.z = r*fz + ref.z;
	s.vx = vr*fx - vu*(cosu + socu*ci) + ref.vx;
	s.vy = vr*fy - vu*(sosu - cocu*ci) + ref.vy;
	s.vz = vr*fz + vu*cu*si + ref.vz;
	if (ref === undefined) {
	    s.x = r*fx;
	    s.y = r*fy;
	    s.z = r*fz;
	    s.vx = vr*fx - vu*(cosu + socu*ci);
	    s.vy = vr*fy - vu*(sosu - cocu*ci);
	    s.vz = vr*fz + vu*cu*si;
	} else {
	    s.x = r*fx + ref.x;
	    s.y = r*fy + ref.y;
	    s.z = r*fz + ref.z;
	    s.vx = vr*fx - vu*(cosu + socu*ci) + ref.vx;
	    s.vy = vr*fy - vu*(sosu - cocu*ci) + ref.vy;
	    s.vz = vr*fz + vu*cu*si + ref.vz;
	}
    };
    this.maxIterationsForEccentricAnomaly = 10;
    this.maxDE = 1e-15;
    this.solveEccentricAnomaly = function(e, M){
	// calculate mean anomaly from eccentric anomaly
	var sol, E;
	if (e === 0.0) {
	    return M;
	}  else if (e < 0.9) {
	    sol = this.solveEccentricAnomaly_(this.solveKepler(e, M), M, 6);
	    return sol;
	} else if (e < 1.0) {
	    E = M + 0.85 * e * ((Math.sin(M) >= 0.0) ? 1 : -1);
	    sol = this.solveEccentricAnomaly_(this.solveKeplerLaguerreConway(e, M), E, 8);
	    return sol;
	} else if (e === 1.0) {
	    return M;
	} else {
	    E = Math.log(2 * M / e + 1.85);
	    sol = this.solveEccentricAnomaly_(this.solveKeplerLaguerreConwayHyp(e, M), E, 30);
	    return sol;
	}
    };
    this.solveEccentricAnomaly_ = function (f, x0, maxIter) {
	var x = 0;
	var x2 = x0;
	for (var i = 0; i < maxIter; i++) {
	    x = x2;
	    x2 = f(x);
	}
	
	return x2;
    };
    this.solveKepler = function(e, M) {
	return function(x) {
	    return x + (M + e * Math.sin(x) - x) / (1 - e * Math.cos(x));
	};
    };
    this.solveKeplerLaguerreConway = function(e, M) {
	return function(x) {
	    var s = e * Math.sin(x);
	    var c = e * Math.cos(x);
	    var f = x - s - M;
	    var f1 = 1 - c;
	    var f2 = s;
	    x += -5 * f / (f1 + Math.sign(f1) * Math.sqrt(Math.abs(16 * f1 * f1 - 20 * f * f2)));
	    return x;
	};
    };
    this.solveKeplerLaguerreConwayHyp = function(e, M) {
	return function(x) {
	    var s = e * Math.sinh(x);
	    var c = e * Math.cosh(x);
	    var f = x - s - M;
	    var f1 = c - 1;
	    var f2 = s;

	    x += -5 * f / (f1 + Math.sign(f1) * Math.sqrt(Math.abs(16 * f1 * f1 - 20 * f * f2)));
	    return x;
	};
    };
    this.getMeanMotion = function(a,mu) {
	if (a<1.0) {a=1.0;};
	return Math.sqrt(mu/(a*a*a));
    }
    this.deg2rad = Math.PI/180.0;
    this.orbitalPlane = function(name,pos,origo,main) {
	if (main !== undefined && main.rotation !== undefined) {
	    let dx=pos.x-origo.x; // origo
	    let dy=pos.y-origo.y;
	    let dz=pos.z-origo.z;
	    let ra=main.rotation.ra;
	    let dec=main.rotation.dec;
	    let sa=Math.sin(ra);
	    let ca=Math.cos(ra);
	    let sd=Math.sin(dec);
	    let cd=Math.cos(dec);
	    let nx= sa*dx - ca*cd * dy - ca * sd * dz
	    let ny=            +    sd * dy -      cd * dz
	    let nz= ca*dx + sa*cd * dy + sa * sd * dz
	    //console.log("Orbital plane:",name,ra,dec," : ",dx,dy,dz,"->",nx,ny,nz);
	    pos.x=nx+origo.x;
	    pos.y=ny+origo.y;
	    pos.z=nz+origo.z;
	};
    }
    
};
export default Orbit;
