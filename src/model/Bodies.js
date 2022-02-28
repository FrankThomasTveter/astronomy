//import Vector3 from './Vector3Lib';
//import Vector2 from './Vector2Lib';
import * as THREE from 'three';
import * as UTILS from './utils';
import * as TWEEN from '../lib/tween';

console.log("Loading BodiesLib");

function Bodies() {
    this.debug=false;
    this.AU = 149597870;
    this.deg2rad = Math.PI/180.0;
    this.KM = 1000;
    this.DEG_TO_RAD = Math.PI/180;
    this.RAD_TO_DEG = 180/Math.PI;
    this.inflate=1;
    
    this.NM_TO_KM = 1.852;
    this.LB_TO_KG = 0.453592;
    this.LBF_TO_NEWTON = 4.44822162;
    this.FT_TO_M = 0.3048;

    //use physics or orbital elements to animate
    this.USE_PHYSICS_BY_DEFAULT = false;
    this.focus="sun";
    
    //duration in seconds
    this.DAY = 60 * 60 * 24;
    //duration in days
    this.YEAR = 365.2525;
    //duration in days
    this.CENTURY = 100 * this.YEAR;
    this.SIDERAL_DAY = 3600 * 23.9344696;
    this.parsec= 3.08567758e13;// km 
    this.lightyear = 9.4605284e12; // km

    this.ln10=Math.log(10);
    this.DIST = 5.0*Math.PI/180.0;
    this.NLAT=Math.ceil(Math.PI/this.DIST);
    this.NLON=2*this.NLAT;
    this.SMAG = 5;
    this.NMAG = 10;

    this.direction=new THREE.Vector3();
    this.right=new THREE.Vector3();
    this.location=new THREE.Vector3();
    this.offset=new THREE.Vector3();
    
    this.J2000 = new Date('2000-01-01T12:00:00-00:00');
    this.scenes={};
    
    this.near=147;// 1
    this.far=149;//1000000000
    
    this.config={
	sun  :  {
	    fact : 1.0,
	    scale : 0.00002,
	    title : 'The Sun',
	    visible: true,
	    mass : 1.9891e30,
	    radius : 6.96342e5,
	    color : '#ffff00',
	    map : 'planets/sunmap.jpg',
	    bumpScale : 10.0,
	    material : {
		emissive : new THREE.Color( 0xdddd33 )
	    },
	    mg : -26.74, // at 1 au
	    md : 1,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	mercury : {
	    fact : 1.0,
	    scale : 0.00002,
	    title : 'Mercury',
	    visible: true,
	    mass : 3.3022e23,
	    radius: 2439*this.inflate,
	    color : '#588a7b',
	    map : 'planets/mercurymap.jpg',
	    bumpMap : 'planets/mercurybump.jpg',
	    bumpScale : 3.0,
	    mg : -2.45, // superior conjunction
	    md : 1.307,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	venus : {
	    fact : 1.0,
	    scale : 0.00002,
	    title : 'Venus',
	    visible: true,
	    mass : 4.868e24,
	    radius : 6051*this.inflate,
	    color : '#fda700',
	    map : 'planets/venusmap.jpg',
	    bumpMap : 'planets/venusbump.jpg',
	    bumpScale : 6.0,
	    mg : -3.82, // far side of sun
	    md : 1.718,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	earth : {
	    fact : 1.1 + 0*6371.0088*this.inflate*(Math.PI*34/(60*180)),
	    scale : 1000,
	    title : 'The Earth',
	    visible: false,
	    mass : 5.9736e24,
	    radius : 6371.0088*this.inflate,
	    color : '#1F7CDA',
	    map : 'planets/earthmap1k.jpg',
	    bumpMap : 'planets/earthbump1k.jpg',
	    bumpScale : 20.0,
	    spec : 'planets/earthspec1k.jpg',
	    atmosphere : {
		radius : 6381.0088,
		trans : 'planets/earthcloudmaptrans.jpg',
		cloud : 'planets/earthcloudmap.jpg',
	    },
	    material : {
		specular : new THREE.Color('grey')
	    },
	    sideralDay : this.SIDERAL_DAY,
	    tilt : 23+(26/60)+(21/3600) ,
	    satellites:["moon"],
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	mars : {
	    fact : 1.0,
	    scale : 0.00002,
	    title : 'Mars',
	    visible: true,
	    mass : 6.4185e23,
	    radius : 3376*this.inflate,
	    color : '#ff3300',
	    map : 'planets/marsmap1k.jpg',
	    bumpMap : 'planets/marsbump1k.jpg',
	    bumpScale : 21.9,
	    sideralDay : 1.025957 * this.DAY,
	    mg : -2.91, //closest to earth
	    md : 0.38,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	jupiter : {
	    fact : 1.0,
	    scale : 0.000002,
	    title : 'Jupiter',
	    visible: true,
	    mass : 1.8986e27,
	    radius : 71492*this.inflate,
	    color : '#ff9932',
	    map : 'planets/jupitermap.jpg',
	    bumpScale : 10.0,
	    satellitesX : ['io', 'europa', 'ganymedes','callisto'],
	    mg : -2.94 , //closest to earth
	    md : 3.95,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	ash :{map : 'ash_uvgrid01.jpg'},
	saturn : {
	    fact : 1.0,
	    scale : 0.0000001,
	    title : 'Saturn',
	    visible: true,
	    mass : 5.6846e26,
	    radius : 58232*this.inflate,
	    color : '#ffcc99',
	    map : 'planets/saturnmap.jpg',
	    bumpScale : 10.0,
	    tilt : 26.7,
	    ring : {
		innerRadius : 74500*this.inflate,
		outerRadius : 117580*this.inflate,
		thickness : 1000*this.inflate,
		map : 'planets/saturnringcolor.jpg',
		trans : 'planets/saturnringpattern.gif',
		density : 0.9,
		color : '#aa8866'
	    },
	    satellites :["deathstar"],
	    mg : -0.49, // at opposition
	    md : 8.05,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3(),
	},
	uranus : {
	    fact : 1.0,
	    scale : 0.00000001,//000
	    title : 'Uranus',
	    visible: true,
	    mass : 8.6810e25,
	    radius : 25559*this.inflate,
	    color : '#99ccff',
	    map : 'planets/uranusmap.jpg',
	    bumpScale : 10.0,
	    ring : {
		innerRadius : 54500*this.inflate,
		outerRadius : 57580*this.inflate,
		thickness : 1000*this.inflate,
		trans : 'planets/uranusringtrans.gif',
		map : 'planets/uranusringcolour.jpg',
		density : 0.5, // 0.5
		color : '#6688aa'
	    },
	    mg : 5.32, // closest to earth
	    md : 17.4,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3(),
	},
	neptune : {
	    fact : 1.0,
	    scale : 0.0000002,
	    title : 'Neptune',
	    visible: true,
	    mass : 1.0243e26,
	    radius : 24764*this.inflate,
	    color : '#3299ff',
	    map : 'planets/neptunemap.jpg',
	    bumpScale : 10.0,
	    mg : 7.78, // closest to earth
	    md : 28.8,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	pluto : {
	    fact : 1.0,
	    scale : 0.0000002,
	    title : 'Pluto',
	    visible: true,
	    mass : 1.305e22+1.52e21,
	    radius : 1153*this.inflate,
	    color : '#aaaaaa',
	    map : 'planets/plutomap1k.jpg',
	    bumpMap : 'planets/plutobump1k.jpg',
	    bumpScale : 5.5,
	    dispMap : 'planets/plutomap1k.jpg', //'plutodisplacement.jpg',
	    dispScale : 50,
	    satellitesX : ['charon'],
	    mg : 13.65, // closest to earth
	    md : 28.7,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	moon : {
	    scale : 0.1,
	    title : 'The Moon',
	    label : true,
	    visible: true,
	    mass : 7.3477e22,
	    radius : 1738.1*this.inflate,
	    color : "#ffffff",
	    map : 'planets/moonmap1k.jpg',
	    bumpMap : 'planets/moonbump1k.jpg',
	    bumpScale : 5.5,
	    sideralDay : (27.3215782 * this.DAY) ,
	    tilt : 1.5424,
	    fov : 1,
	    orbit: {
		base : {
		    a : 384400,
		    e : 0.0554,
		    w : 318.15,
		    M : 135.27,
		    i : 5.16,
		    o : 125.08
		},
		day : {
		    a : 0,
		    e : 0,
		    i : 0,
		    M : 13.176358,//360 / 27.321582,
		    w : (360 / 5.997) / 365.25,
		    o : (360 / 18.600) / 365.25
		},
	    },
	    orbits: 'earth',
	    mg : -12.90, // closest to earth
	    md : 0.00257,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	deathstar : {
	    title : 'Death Star',
	    visible: true,
	    mass : 0,
	    radius : 900,
	    color : '#aaaaaa',
	    map : 'planets/deathStarmap.png',
	    bumpMap : 'planets/deathStarbump.png',
	    bumpScale : 9.0,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	phobos : {
	    title : 'Phobos',
	    visible: true,
	    mass : 0,
	    radius : 11,
	    color : '#ffffff',
	    map : 'moons/phobos.jpg',
	    bumpMap : 'moons/phobos.jpg',
	    bumpScale : 0.1,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	deimos : {
	    title : 'Deimos',
	    visible: true,
	    mass : 0,
	    radius : 6.2,
	    color : '#ffffff',
	    map : 'moons/deimos.jpg',
	    bumpMap : 'moons/deimos.jpg',
	    bumpScale : 0.1,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	charon : {
	    title : 'Charon',
	    visible: true,
	    mass : 0,
	    radius : 606,
	    color : '#ffffff',
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	observer : {
	    scale : 0.00002,
	    position : new THREE.Vector3(0,0,0),
	    i : new THREE.Vector3(1,0,0),
	    j : new THREE.Vector3(0,1,0),
	    k : new THREE.Vector3(0,0,1),
	    zenith : new THREE.Vector3(0,0,1)
	}
    };
    
    this.baseURL = process.env.PUBLIC_URL+'/media/';             // from http://planetpixelemporium.com/
    //
    //////////////////////////////////////////////////////////////////////////////////
    //
    this.init = function(state) {
	// executed after state has been created but before any data is loaded...
	this.importSatellites(state);
    };
    this.importSatellites=function(state) {
	// add satellites with analytical orbits...
	let orbits=state.Model.getOrbits(state);
	orbits.forEach((orb,ind)=>{
	    let orbit=orb.orbit;
	    if (this.config[orb.name]===undefined) {
		this.config[orb.name]={
		    rotation : new THREE.Vector3(0,0,1),
		    position : new THREE.Vector3()
		}
	    };
	    let around=orb.orbit.around;
	    if (around !== undefined && this.config[around] !== undefined) {
		this.config[orb.name].orbits=around;
		if (this.config[around].satellites==undefined) {this.config[around].satellites=[];};
		if( this.config[around].satellites.indexOf(orb.name)===-1) {
		    this.config[around].satellites.push(orb.name);
		};
	    };
	});
    };
    this.initScenes=function(mainCamera) {
	this.scenes={};
	this.scenes["sun"]=     {scene: this.createScene("sun",mainCamera), distance:20,   show:true};
	this.scenes["mercury"]= {scene: this.createScene("mercury",mainCamera),distance:9, show:true};
	this.scenes["venus"]=   {scene: this.createScene("venus",mainCamera),distance:8,   show:true};
	this.scenes["earth"]=   {scene: this.createScene("earth",mainCamera),distance:1,   show:true};
	this.scenes["mars"]=    {scene: this.createScene("mars",mainCamera),distance:10,   show:true};
	this.scenes["jupiter"]= {scene: this.createScene("jupiter",mainCamera),distance:12,show:true};
	this.scenes["saturn"]=  {scene: this.createScene("saturn",mainCamera),distance:13, show:true};
	this.scenes["uranus"]=  {scene: this.createScene("uranus",mainCamera),distance:14, show:true};
	this.scenes["neptune"]= {scene: this.createScene("neptune",mainCamera),distance:15,show:true};
	this.scenes["pluto"]=   {scene: this.createScene("pluto",mainCamera),distance:16,  show:true};
    };
    this.copyObserver = function (src, trg) {
	//console.log("Observer:",src,trg);
	if (src !== undefined && src.position !== undefined && src.i !== undefined && src.zenith !== undefined) {
	    trg.position.copy(src.position);
	    trg.i.copy(src.i);
	    trg.j.copy(src.j);
	    trg.k.copy(src.k);
	    trg.zenith.copy(src.zenith);
	}
    };
    this.copyBody = function (src, trg) {
	if (src !== undefined && src.position !== undefined && src.rotation !== undefined) {
	    trg.position.copy(src.position);
	    trg.position.vx=src.position.vx;
	    trg.position.vy=src.position.vy;
	    trg.position.vz=src.position.vz;
	    trg.rotation.copy(src.rotation);
	    trg.rotation.lon=src.rotation.lon;
	    trg.rotation.lat=src.rotation.lat;
	    trg.rotation.ra=src.rotation.ra;
	    trg.rotation.dec=src.rotation.dec;
	    trg.rotation.w=src.rotation.w;
	};
    };
    this.createScene = function (name,mainCamera) { // 
	var size=48;
	var font='48px Arial';
	var scene = new THREE.Scene();
	var camera=mainCamera.clone();
	camera.name="camera";
	scene.name="scene";
	scene.add(camera);
	this.addSatellites(scene,name);
	var mesh=this.createMesh(name);
	if (name === "sun") {
	    let light=new THREE.AmbientLight('#ffff88',1000);
	    light.name="glow";
	    scene.add(mesh);
	    scene.add(light);
	    scene.add(this.createLabel(name));
	} else { // other planets
	    scene.add(mesh);
	    scene.add(this.createLight(mesh,name));
	    scene.add(this.createLabel(name));
	}
	return scene;
    };

    this.addSatellites=function(group,name) {
	let body=this.config[name];
	if (body === undefined) {
	    console.log("No body named:",name);
	} else {
	    let satellites=body.satellites||[];
	    if (satellites === undefined) { return;};
	    let scale=this.config[name].scale;
	    let radius=this.config[name].radius;
	    satellites.forEach((satellite,i)=>{
		group.add(this.createMesh(satellite,scale));
		group.add(this.createLabel(satellite));
		let sat=this.config[satellite];
		if (sat !== undefined) {
		    sat.orbits=name;
		    let ax=sat.rotation.ra||0;
		    let ay=sat.rotation.dec||0;
		    sat.rotation.set(Math.cos(ax)*Math.cos(ay),Math.sin(ax)*Math.cos(ay),Math.sin(ay));
		    var body=group.getObjectByName(name);
		    this.setRotation(body,sat.rotation);
		};
	    });
	    
	};
    };    

    this.showLabel=function(scene,name,opacity,duration) {
	if (duration===undefined) {duration=1.0;};
	let object=scene.getObjectByName(name);
	object.material.transparent=true;
	let t=new TWEEN(object.material,duration,{opacity:opacity});
    };

    this.createMesh = function(name,...args) {
	if (name === "sun") {
	    return this.createSunMesh();
	} else if (name === "mercury") {
	    return this.createMercuryMesh();
	} else if (name === "venus") {
	    return this.createVenusMesh();
	} else if (name === "earth") {
	    return this.createEarthMesh();
	} else if (name === "mars") {
	    return this.createMarsMesh();
	} else if (name === "jupiter") {
	    return this.createJupiterMesh();
	} else if (name === "saturn") {
	    var group = new THREE.Object3D();
	    group.name="group";
	    group.add(this.createSaturnMesh());
	    group.add(this.createSaturnRingMesh(THREE.FrontSide));
	    group.add(this.createSaturnRingMesh(THREE.BackSide));
	    group.castShadow = true;
	    group.receiveShadow = true;
	    return group;
	} else if (name === "uranus") {
	    var group = new THREE.Object3D();
	    group.name="group";
	    group.add(this.createUranusMesh());
	    group.add(this.createUranusRingMesh(THREE.FrontSide));
	    group.add(this.createUranusRingMesh(THREE.BackSide));
	    group.castShadow = true;
	    group.receiveShadow = true;
	    return group;
	} else if (name === "neptune") {
	    return this.createNeptuneMesh();
	} else if (name === "pluto") {
	    return this.createPlutoMesh();
	} else if (name === "moon") {
	    return this.createMoonMesh();
	} else if (name === "saturnring") {
	    return this.createSaturnRingMesh(...args); // side
	} else if (name === "uranusring") {
	    return this.createUranusRingMesh(...args); // side
	} else if (name === "deathstar") {
	    return this.createDeathStarMesh(...args); // scale
	} else {
	    return this.createAsteroideMesh(name,...args); // scale
	}
    };

    this.createSunMesh	= function(){
	var scale=this.config.sun.scale;
	var material	= this.Material({map:this.baseURL+this.config.sun.map});
	var geometry	= new THREE.SphereGeometry(this.config.sun.radius*scale, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="sun";
	// mesh.rotation.x=Math.PI/2;
	return mesh	
    };
    this.createMercuryMesh	= function(){
	var scale=this.config.mercury.scale;
	var material	= this.Material({map:this.baseURL+this.config.mercury.map,
					 bumpMap:this.baseURL+this.config.mercury.bumpMap,
					 bumpScale:this.config.mercury.bumpScale*scale,
					 shadowSide: THREE.FrontSide});
	var geometry	= new THREE.SphereGeometry(this.config.mercury.radius*scale, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="mercury";
	// mesh.rotation.x=Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createVenusMesh	= function(){
	var scale=this.config.venus.scale;
	var material	= this.Material({map:this.baseURL+this.config.venus.map,
					 bumpMap:this.baseURL+this.config.venus.bumpMap,
					 bumpScale: this.config.venus.bumpScale*scale,
					 shadowSide: THREE.FrontSide});
	var geometry	= new THREE.SphereGeometry(this.config.venus.radius*scale, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="venus";
	// mesh.rotation.x=Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createEarthMesh	= function(){
	var scale=this.config.earth.scale;
	var material	= this.Material({map:this.baseURL+this.config.earth.map,
					 bumpMap:this.baseURL+this.config.earth.bumpMap,
					 bumpScale:this.config.earth.bumpScale*scale,
					 specularMap:this.baseURL+this.config.earth.spec,
					 specularColor: 'grey',
					 transparent:true,
					 opacity:0.7,
					 shadowSide: THREE.FrontSide});
	//	wireframe:true,
	var geometry	= new THREE.SphereGeometry(this.config.earth.radius*scale, 128, 128)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="earth";
	// mesh.rotation.x=Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createMoonMesh	= function(){
	var scale=this.config.earth.scale;
	var material	= this.Material({map: this.baseURL+this.config.moon.map,
					 bumpMap: this.baseURL+this.config.moon.bumpMap,
					 bumpScale: this.config.moon.bumpScale*scale,
					 shadowSide: THREE.FrontSide});
	var geometry	= new THREE.SphereGeometry(this.config.moon.radius*scale, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="moon";
	// mesh.rotation.x=Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createMarsMesh	= function(){
	var scale=this.config.mars.scale;
	var material	= this.Material({map: this.baseURL+this.config.mars.map,
					 bumpMap: this.baseURL+this.config.mars.bumpMap,
					 bumpScale: this.config.mars.bumpScale*scale,
					 shadowSide: THREE.FrontSide});
	var geometry	= new THREE.SphereGeometry(this.config.mars.radius*scale, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="mars";
	// mesh.rotation.x=Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createJupiterMesh= function(){
	var scale=this.config.jupiter.scale;
	var material    = this.Material({map:this.baseURL+this.config.jupiter.map,
					 bumpMap:this.baseURL+this.config.jupiter.map,
					 bumpScale: this.config.jupiter.bumpScale*scale,
					 shadowSide: THREE.FrontSide});
	var geometry	= new THREE.SphereGeometry(this.config.jupiter.radius*scale, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="jupiter";
	//mesh.rotation.x=Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createSaturnMesh= function(){
	var scale=this.config.saturn.scale;
	var material	= this.Material({map:this.baseURL+this.config.saturn.map,
					 bumpMap	: this.baseURL+this.config.saturn.map,
					 bumpScale: this.config.saturn.bumpScale*scale,
					 shadowSide: THREE.FrontSide});
	var geometry	= new THREE.SphereGeometry(this.config.saturn.radius*scale, 32, 32);
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.name       = "saturn";
	//// mesh.rotation.x=Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createSaturnRingMesh	= function(side){
	var scale=this.config.saturn.scale;
	if (side === undefined) { side= THREE.DoubleSide;}
	//THREE.DoubleSide,THREE.FrontSide,THREE.BackSide,
	var material;
	material    = this.Material({map:this.baseURL+this.config.saturn.ring.map,
				     transMap:this.baseURL+this.config.saturn.ring.trans,
				     side:side,
				     transparent:false,
				     opacity:0.9,
				    });
	var geometry	= this.RingGeometry(this.config.saturn.ring.innerRadius*scale, this.config.saturn.ring.outerRadius*scale, 128);
	var mesh	= new THREE.Mesh(geometry, material);
	var normal=new THREE.Vector3(0,0,1).normalize();
	var offset;
	if (side === THREE.BackSide) {
	    mesh.name       = "saturnringbottom";
	    normal.multiplyScalar(-1.0);
	} else if (side === THREE.FrontSide) {
	    mesh.name       = "saturnringtop";
	} else {
	    mesh.name       = "saturnring";
	};
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	offset=normal.clone().multiplyScalar(this.config.saturn.ring.thickness*scale); // offset so shadow is not messed up...
	mesh.position.set(offset.x,offset.y,offset.z);
	mesh.lookAt(normal);
	mesh.rotation.x=Math.PI/2;
	return mesh	
    };
    this.createUranusMesh	= function(){
	var scale=this.config.uranus.scale;
	var material    = this.Material({ map:this.baseURL+this.config.uranus.map,
					  bumpMap:this.baseURL+this.config.uranus.map,
					  bumpScale:this.config.uranus.bumpScale*scale,
					  shadowSide: THREE.FrontSide});
	var geometry	= new THREE.SphereGeometry(this.config.uranus.radius*scale, 32, 32);
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.name="uranus";
	//mesh.rotation.x=Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createUranusRingMesh	= function(side){
	var scale=this.config.uranus.scale;
	var material;
	material    = this.Material({map:this.baseURL+this.config.uranus.ring.map,
					 transMap:this.baseURL+this.config.uranus.ring.trans,
					 side:THREE.FrontSide,
					 transparent:true,
					 opacity:0.9,
					});
	var geometry	= this.RingGeometry(this.config.uranus.ring.innerRadius*scale, this.config.uranus.ring.outerRadius*scale, 128);
	var mesh	= new THREE.Mesh(geometry, material);
	var normal=new THREE.Vector3(0,0,1).normalize();
	var offset;
	if (side === THREE.BackSide) {
	    mesh.name       ="uranusringbottom";
	    normal.multiplyScalar(-1.0);
	} else if (side === THREE.FrontSide) {
	    mesh.name       ="uranusringtop";
	} else {
	    mesh.name       = "uranusring";
	};
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	offset=normal.clone().multiplyScalar(this.config.uranus.ring.thickness*scale); // offset so shadow is not messed up...
	mesh.position.set(offset.x,offset.y,offset.z);
	mesh.lookAt(normal);
	mesh.rotation.x=Math.PI/2;
	return mesh	
    };
    this.createNeptuneMesh	= function(){
	var scale=this.config.neptune.scale;
	var material	= this.Material({map:this.baseURL+this.config.neptune.map,
					 bumpMap:this.baseURL+this.config.neptune.map,
					 bumpScale:this.config.neptune.bumpScale*scale,
					 shadowSide: THREE.FrontSide});
	var geometry	= new THREE.SphereGeometry(this.config.neptune.radius*scale, 32, 32);
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name       = "neptune";
	// mesh.rotation.x=Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createPlutoMesh	= function(){
	var scale=this.config.pluto.scale;
	var material	= this.Material({map:this.baseURL+this.config.pluto.map,
					 bumpMap:this.baseURL+this.config.pluto.bumpMap,
					 bumpScale: this.config.pluto.bumpScale*scale,
					 displacementMap:this.baseURL+this.config.pluto.dispMap,
					 displacementScale: this.config.pluto.dispScale*scale,
					 shadowSide: THREE.FrontSide});
	var geometry	= new THREE.SphereGeometry(this.config.pluto.radius*scale, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name       = "pluto";
	// mesh.rotation.x=Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createDeathStarMesh	= function(scale){
	if (scale===undefined) {scale=this.config.saturn.scale;}
	var material	= this.Material({map:this.baseURL+this.config.deathstar.map,
					 bumpMap:this.baseURL+this.config.deathstar.bumpMap,
					 bumpScale:this.config.deathstar.bumpScale*scale,
					 shadowSide: THREE.FrontSide});
	var geometry	= new THREE.SphereGeometry(this.config.deathstar.radius*scale, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name       = "deathstar";
	// mesh.rotation.x=Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createAsteroideMesh	= function(name,scale){
	if (scale===undefined) {scale=this.config.saturn.scale;}
	var opts={shadowSide: THREE.FrontSide};
	var trg=this.config[name];
	var radius=trg.radius;
	if (radius===undefined) {radius=this.config.saturn.radius*0.1;};
	if (trg.map !== undefined) {
	    opts.map=this.baseURL+trg.map;
	} else {
	    opts.map=this.baseURL+"moons/asteroide.jpeg";
	};
	if (trg.bumpMap !== undefined) { opts.bumpMap=this.baseURL+trg.bumpMap;};
	if (trg.bumpScale !== undefined) { opts.bumpScale=trg.bumpScale*scale;};
	var material	= this.Material(opts);
	var geometry	= new THREE.SphereGeometry(radius*scale, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name       = name;
	// mesh.rotation.x=Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createLight    = function(target,name,scene) {
	if (name === "sun") {
	    return new THREE.AmbientLight('#ffff88',1000);
	} else {
	    var light   = new THREE.DirectionalLight( 0xffffff, 1, 100 )
	    light.position.set(0,0,0);
	    light.target                = target;
	    light.castShadow            = true;
	    light.shadow.mapSize.width  = 1048; // default
	    light.shadow.mapSize.height =  1048; // default
	    if (scene!==undefined) {scene.add(this.createShadowCameraOutline(light));};
	}
	light.name                  = "sunlight";
	return light;
    };
    this.createShadowCameraOutline=function(light) {
	let helper=new THREE.CameraHelper( light.shadow.camera );
	helper.name="helper";
	return helper;
    };
    this.createLabel = function (name) {
	var title=this.config[name].title||"Undefined-"+name;
	var label=UTILS.createTextSprite(title,
					 {font:'48px Arial',
					  floating:true,
					  fillStyle:'yellow',
					  size:200,
					  cx:0,cy:0.5,
					  x:0,y:0,z:0,
					  alphaTest:0.01,
					  //border:true,
					  renderOrder:0,
					  name:"label"+name,
					 });
	if (this.config[name].visible) {
	    label.visible=true;
	} else {
	    label.visible=false;
	}
	return label;
    }
    this.getMagnitude=function(name) {
	// get sun position
	let opos=this.config.observer.position;
	let bpos=this.config[name].position;
	let dx=bpos.x-opos.x;
	let dy=bpos.y-opos.y;
	let dz=bpos.z-opos.z;
	let dist=Math.sqrt(dx*dx+dy*dy+dz*dz);
	let mg=this.config[name].mg;
	let md=this.config[name].md;
	let fact=(md*md)/(dist*dist);
	if (name === "sun") {
	    return mg*fact;
	} else {
	    // get sun position
	    let spos=this.config.sun.position;
	    let sx=spos.x-bpos.x;
	    let sy=spos.y-bpos.y;
	    let sz=spos.z-bpos.z;
	    let sist=Math.sqrt(sx*sx+sy*sy+sz*sz);
	    let dot=(sx*dx+sy*dy+sz*dz)/(dist*sist);
	    let ang=Math.acos(dot);
	    let ill=(1.0-Math.sin(ang))/2.0;
	    

	    
	    // get size
	};
    }


    this.createAura=function(name) {
	// get sun position
	let spos=this.config.sun.position;
	if (name === "sun") {

	} else {
	    // get body position
	    let bpos=this.config[name].position;
	    
	    // get size
	};

	//https://jsfiddle.net/prisoner849/z3yfw208/
	var material = new THREE.PointsMaterial({ color:0x000000, vertexColors: THREE.VertexColors, transparent:true, alphaTest:0.01 }); //   alphaTest: 0.99
	//var material = new THREE.SpriteMaterial({ vertexColors: THREE.VertexColors, alphaTest: 0.99}); //  
	//UTILS.addTextureMap(material,this.fullStarsURL + "ball.png");
	UTILS.addTextureMap(material,this.fullStarsURL + this.sprites[0]);
	var geometry = new THREE.InstancedBufferGeometry();
	//var geometry = new THREE.BufferGeometry();
	var ll=this.starList.length;
	var positions = new Float32Array(ll*3);
	var colors = new Float32Array(ll*3);
	var sizes = new Float32Array(ll);
	var alphas = new Float32Array(ll);
	for (let i = 0; i < ll; i++) {
	    let ss=this.starList[i];
	    //console.log("ss:",ss);
            positions[i * 3 + 0] = ss.x * this.parscale;
            positions[i * 3 + 1] = ss.y * this.parscale;
            positions[i * 3 + 2] = ss.z * this.parscale;
            colors[i * 3 + 0] = ss.color.r/255;
            colors[i * 3 + 1] = ss.color.g/255;
            colors[i * 3 + 2] = ss.color.b/255;
	    var dist=Math.sqrt(ss.x*ss.x+ss.y*ss.y+ss.z*ss.z); // dist is in parsec
	    var amag=Math.max(-30,Math.min(10,ss.mag - 5.0*this.log10(dist) + 5.0));  // dist is in parsec
            sizes[i] = this.parscale*10*Math.pow(10,-amag/5.0);
	     if (ss.pos.lab === "HIP89086") {
		  	console.log("Mag:",ss.mag,amag,dist,this.log10(dist),sizes[i]," Cols:",ss.color,ss.pos);
	     };
	    //alphas[i] = 1;
	}
	UTILS.modifyShaders(geometry,material,sizes);
	geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
	//geometry.setAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );
	var sprites = new THREE.Points( geometry, material );
	//var sprites = new THREE.Sprite( geometry, material );
	sprites.name       = "stars";
	this.replaceStarsBackdrop(sprites);
	return sprites	


    };
    this.updateConfig = function(state,config,observer) {
	if (config===undefined) {return;};
	this.copyObserver( config.observer, this.config.observer);
	var bodies=Object.keys(this.config);
	bodies.forEach( (k,v) => {
	    if (k !== "observer" && config.bodies[k]!==undefined && this.config[k]!==undefined) {
		this.copyBody(config.bodies[k],this.config[k]);
	    }
	});
	//console.log("Updated config",this.config);
    };
    this.updateAura=function(name) {
    };
    this.updateRaycaster=function(state,raycaster,mouse,mainCamera,objects) {
	// loop over Bodies scenes
	for (var name in this.scenes) {
	    var item=this.scenes[name];
	    if (item.scene !== undefined) {
		if (item.show) {
		    let camera=item.scene.getObjectByName("camera");
		    raycaster.setFromCamera(mouse,camera);
		    //console.log("Scene:",item.scene);
		    const intersects = raycaster.intersectObjects( item.scene.children,true );
		    var cnt=intersects.length;
		    for ( let i = 0; i < intersects.length; i ++ ) {
			console.log(">>>>> Pointing at:",cnt,i,intersects[ i ].object.name,item.scene,mouse);
			objects.push(intersects[i].object);
			//intersects[ i ].object.material.color.set( 0xff0000 );
		    };
		}
	    }
	};
	return objects;
    };
    //
    //////////////////////////////////////////////////////////////////////////////////
    //
    this.prepareForRender=function(name,scene,mainCamera,time) {
    };
    this.renderScenes=function(renderer,mainCamera,time) {
	//this.renderer.autoClear = false;
	// sort scenes by distance...
	var keys = Object.keys(this.scenes);
	var order=keys.sort((a,b) => {return this.scenes[b].distance - this.scenes[a].distance;} );
	//console.log("Sorted by distance:",order);
	order.forEach( (name,i)=>{
	    let distance=this.scenes[name].distance||0;
	    let show=this.scenes[name].show;
	    let scene=this.scenes[name].scene;
	    let camera=scene.getObjectByName("camera");
	    if (show && camera !== undefined) {
		this.prepareForRender(name,scene,mainCamera,time);
		renderer.render(scene, camera);
	    } else {
		//console.log("Not rendering:",k);
	    }
	});	
    };
    this.updateScenes=function(state,camera,observer,time) {
	// loop over Bodies scenes
	for (var name in this.scenes) {
	    var item=this.scenes[name];
	    if (item.scene !== undefined) {
		if (item.show) {
		    //console.log("Scene:",name);
		    this.updateScene(state,camera,observer,name,item.scene,time);
		};
	    };
	};
    };
    this.updateScene=function(state,mainCamera,observer,name,scene,time) {
	//console.log("UpdateScene:",name,scale);
	let scale = this.config[name].scale;
	let fact = this.config[name].fact;
	this.updateCamera(state,mainCamera,observer,name,scene);
	if (name === "saturn" || name === "uranus") {
	    let range= this.config[name].radius*2.5;
	    let pos   = this.config[name].position;
	    let group = scene.getObjectByName("group");
	    let body  = scene.getObjectByName(name);
	    let light  = scene.getObjectByName("sunlight");
	    let obs=observer.position;
	    //camera.position.set(obs.x*scale,obs.y*scale,obs.z*scale);	    
	    let x=(pos.x-obs.x)*scale*fact;
	    let y=(pos.y-obs.y)*scale*fact;
	    let z=(pos.z-obs.z)*scale*fact;
	    group.position.set(x,y,z);
	    let alpha=Math.max(0.5,Math.min(1,(x*x+y*y+z*z)/(4*this.config[name].radius*this.config[name].radius)));
	    this.makeTransparent(state,name,scene,group,alpha);
	    let rot   = this.config[name].rotation;
	    this.setRotation(group,rot);
	    this.direction.setFromMatrixPosition( group.matrixWorld );
	    this.location.setFromMatrixPosition( body.matrixWorld );
	    this.updateShadowCamera(light,pos,obs,scale,range);
	    let helper  = scene.getObjectByName("helper");
	    if (helper !== undefined) {
		//console.log(helper);
		helper.camera.copy(light.shadow.camera);
		helper.update();
	    };
	    //console.log(name,scene);
	    //console.log(name,this.direction,scene);
	} else if (name === "mars") { // sun and other planets
	    let pos   = this.config[name].position;
	    let obs=observer.position;
	    let body  = scene.getObjectByName(name);
	    let light  = scene.getObjectByName("sunlight");
	    this.updateLight(light,pos,obs,scale);
	    let x=(pos.x-obs.x)*scale*fact;
	    let y=(pos.y-obs.y)*scale*fact;
	    let z=(pos.z-obs.z)*scale*fact;
	    //console.log("Pos:",name,x,y,z);
	    body.position.set(x,y,z);
	    let alpha=Math.max(0.5,Math.min(1,(x*x+y*y+z*z)/(4*this.config[name].radius*this.config[name].radius)));
	    this.makeTransparent(state,name,scene,body,alpha);
	    let rot   = this.config[name].rotation;
	    this.setRotation(body,rot);
	} else { // sun and other planets
	    let pos   = this.config[name].position;
	    let obs=observer.position;
	    let body  = scene.getObjectByName(name);
	    let light  = scene.getObjectByName("sunlight");
	    if (light !== undefined) {this.updateLight(light,pos,obs,scale);};
	    let x=(pos.x-obs.x)*scale*fact;
	    let y=(pos.y-obs.y)*scale*fact;
	    let z=(pos.z-obs.z)*scale*fact;
	    body.position.set(x,y,z);
	    let alpha=Math.max(0.0,Math.min(1,(x*x+y*y+z*z)/(this.config[name].radius*this.config[name].radius)-1));
	    this.makeTransparent(state,name,scene,body,alpha);
	    //console.log("Pos:",name,pos);
	    let rot   = this.config[name].rotation;
	    this.setRotation(body,rot);
	};
	this.updateLabel(state,mainCamera,observer,name,scene,scale,1);
	this.updateSatellites(state,mainCamera,observer,name,scene);
    };
    this.makeTransparent=function(state,name,scene,body,alpha) {
	let material=body.material;
	if (material === undefined) {material=body.getObjectByName(name).material;};
	if (alpha === 1) {
	    material.transparent=false;
	} else {
	    material.transparent=true;
	    material.opacity=1-alpha;
	};
    };
    this.updateSatellites = function(state,mainCamera,observer,name,scene) {
	let satellites=this.config[name].satellites||[];
	if (satellites === undefined) { return;};
	let scale=this.config[name].scale;
	let radius=this.config[name].radius;
	let pos   = this.config[name].position;
	satellites.forEach((satellite,i)=>{
	    let body  = scene.getObjectByName(satellite);
	    if (body!==undefined) {
		if ( this.config[satellite]!==undefined &&
		     this.config[satellite].position!==undefined) { // dynamic position
		    this.config[satellite].orbits=name;
		    let spos=this.config[satellite].position;
		    let obs=observer.position;
		    let range=Math.max(1,Math.sqrt((spos.x-pos.x)*(spos.x-pos.x)+
						    (spos.y-pos.y)*(spos.y-pos.y)+
						    (spos.z-pos.z)*(spos.z-pos.z)));
		    let dist=Math.max(1,Math.sqrt((spos.x-mainCamera.position.x)*(spos.x-mainCamera.position.x)+
						  (spos.y-mainCamera.position.y)*(spos.y-mainCamera.position.y)+
						  (spos.z-mainCamera.position.z)*(spos.z-mainCamera.position.z)));
		    let visible=(range/dist)*180/Math.PI; // visible fov
		    let opacity=1-Math.min(1,Math.max(0,mainCamera.fov/visible-1));
		    //console.log("Opacity:",satellite,range,dist,range/dist,mainCamera.fov,opacity);
		    body.position.set((spos.x-obs.x)*scale,(spos.y-obs.y)*scale,(spos.z-obs.z)*scale);
		    this.updateLabel(state,mainCamera,observer,satellite,scene,scale,opacity);
		}
	    };
	});
    };
    this.getElements=function(name) {
	return this.config[name].base;
    };
    
    this.getPosition=function(state,elements) {
    };
    this.updateLight=function(light,pos,obs,scale) {
	let x = -obs.x;
	let y = -obs.y;
	let z = -obs.z;
	light.position.x=x*scale;
	light.position.y=y*scale;
	light.position.z=z*scale;
    };
    this.updateShadowCamera=function(light,pos,obs,scale,range) {
	let x = pos.x;
	let y = pos.y;
	let z = pos.z;
	let d=Math.max(Math.sqrt(x*x+y*y+z*z),1);
	let metric= range*scale;
	let near= 10*metric;
	let far = near + 2*metric
	x=-(metric+near)*x/d + (pos.x-obs.x)*scale;
	y=-(metric+near)*y/d + (pos.y-obs.y)*scale;
	z=-(metric+near)*z/d + (pos.z-obs.z)*scale;
	light.position.x=x;
	light.position.y=y;
	light.position.z=z;
	light.shadow.camera.near    = near;
	light.shadow.camera.far     = far;
	light.shadow.camera.left = -range*scale;
	light.shadow.camera.right = range*scale;
	light.shadow.camera.top = -range*scale;
	light.shadow.camera.bottom = range*scale;
	// light.shadow.camera.updateProjectionMatrix();
	light.shadow.camera.updateMatrixWorld(true);
	// light.shadow.camera.needsUpdate=true;
	// light.shadow.camera.matrixWorldNeedsUpdate=true;
	//console.log("Updating light:",light.shadow.camera);
    };

    this.updateCamera=function(state,mainCamera,observer,name,scene) {
	var camera=scene.getObjectByName("camera");
	if (camera !== undefined) {
	    let scale = this.config[name].scale;
	    // update camera position
	    //let obs=observer.position;
	    camera.copy(mainCamera);
	    camera.position.set(0,0,0);	    
	    //camera.position.set(obs.x*scale,obs.y*scale,obs.z*scale);	    
	};
    };

    this.updateLabel=function(state,mainCamera,observer,name,scene,scale,opacity) {
	var label=scene.getObjectByName("label"+name);
	if (label !== undefined) {
	    var range=this.config[name].radius;
	    if (name==="saturn" || name==="uranus") {range=2*range;} // make room for rings
	    this.direction.set();
	    let pos=this.config[name].position;
	    let obs=observer.position;
	    this.direction.set(pos.x-obs.x,pos.y-obs.y,pos.z-obs.z);
	    // resize...
	    let size=label.width*scale*this.direction.length()/500;
	    label.material.size=size;
	    label.material.opacity=opacity;
	    //console.log("Sprite:",name,label.width,label.height);
	    //console.log(name,label.scale,size,label);
	    // reposition...
	    this.right.crossVectors(this.direction,this.config.observer.zenith);
	    if (this.right.length() > 0) {
		this.right.normalize();
		this.right.multiplyScalar(range*scale*1.1);
		this.right.addScaledVector(pos,scale);
		let x=this.right.x-obs.x*scale;
		let y=this.right.y-obs.y*scale;
		let z=this.right.z-obs.z*scale;
		label.position.set(x,y,z);
		//console.log("Right:",this.right,label.position);
	    };	    
	} else {
	    console.log("No label found...",name);
	};
    };
    
    //////////////////////////////////////////////////////////////////////////////////
    //		Texture functions					//
    //////////////////////////////////////////////////////////////////////////////////
    /**
     * change the original from three.js because i needed different UV
     * 
     * @author Kaleb Murphy
     * @author jerome etienne
     */
    this.RingGeometry = function ( innerRadius, outerRadius, thetaSegments, flip ) {
	const geometry = new THREE.RingBufferGeometry(innerRadius, outerRadius, thetaSegments);
	this.adjustRingGeometry2(geometry, innerRadius, outerRadius, thetaSegments, flip);
	return geometry;
    };
    this.adjustRingGeometry2=function (geometry, innerRadius, outerRadius, thetaSegments,flip) {
	// each vertex has a U anv V coordinate that points to (U,V) in the texture.
	var pos  = geometry.attributes.position;
	var tcnt = pos.count;
	var acnt = thetaSegments; //  number of grid angles
	var dcnt = tcnt/(acnt+1); //  number of grid distances
	var rmin = innerRadius;
	var rdel = (outerRadius - innerRadius)/(dcnt-1); // width of grid distance
	//console.log("Init:",tcnt,acnt,dcnt,rmin,rdel);
	var vk   = new THREE.Vector3(0,0,1); // normal vector
	var vi   = new THREE.Vector3();      // points to first vertex
	var vj   = new THREE.Vector3();      // right-hand complement
	var v3   = new THREE.Vector3();      // current vertex
	for (let i = 0; i < tcnt; i++){
	    v3.fromBufferAttribute(pos, i);  // assign current vertex
	    if (i === 0) {                   // first vertex, make coordinate system
		vi.fromBufferAttribute(pos, i);
		vi.normalize();
		vj.crossVectors(vk,vi);
	    };
	    var rr=v3.length();               // distance from center
	    var uu=(rr-rmin)/rdel;            // distance grid location
	    var vv=this.getKAngle(vi,vj,vk,v3)/(2 * Math.PI); // angle grid location
	    //console.log("RingGeometry:",i,uu,vv,rr,rmin,rdel);
	    let u =geometry.attributes.uv.getX(i);  // original U coordinate
	    let v =geometry.attributes.uv.getY(i);  // original V coordinate
	    //console.log("RingGeometry:",i,v3,uu,vv," org:",u,v);
	    if (flip) {
		geometry.attributes.uv.setXY(i, Math.max(0,Math.min(1,vv)), Math.max(0,Math.min(1,uu))); // assign new coordinates
	    } else {
		geometry.attributes.uv.setXY(i, Math.max(0,Math.min(1,uu)), Math.max(0,Math.min(1,vv))); // assign new coordinates
	    }
	}
    };
    this.getKAngle=function( vi, vj, vk, v3) {
	var ii=vi.dot(v3);
	var jj=vj.dot(v3);
	var kk=vk.dot(v3);
	if (Math.abs(kk) > 0.0001) {
	    console.log("Invalid normal...",vk,v3)
	};
	var aa=Math.atan2(ii,jj)
	if (aa < 0) {aa=aa+Math.PI * 2;};
	return aa;
    };
    this.loadMap=function(type,map,fn) {
	if (map !== undefined) {
	    new THREE.TextureLoader().load(
		map,fn,
		function ( xhr ) {
		    console.log( type,":", (xhr.loaded / xhr.total * 100) + '% loaded' );
		},
		function ( xhr ) {
		    console.log( type,': An error happened '+map );
		}
	    );
	};
    };
    this.Material = function (opt) {
	if (opt===undefined) {opt={};};
	var material= new THREE.MeshPhongMaterial();
	// load map
	if (opt.map !== undefined && opt.transMap !== undefined) {
	    this.addTransparentMap(material,opt.map, opt.transMap);
	} else if (opt.map !== undefined) {
	    if (this.debug) {console.log("Map:",opt.map);};
	    this.addTextureMap(material,opt.map);
	};
	// load bump
	if (opt.bumpMap !== undefined) {
	    if (this.debug) {console.log("Bump:",opt.bumpMap);}
	    this.addBumpMap(material,opt.bumpMap,opt.bumpScale);
	};
	// load displacement
	if (opt.displacementMap !== undefined) {
	    if (this.debug) {console.log("Displacement:",opt.displacementMap);}
	    this.addDisplacementMap(material,opt.displacementMap,opt.displacementScale,32,32);
	};
	// load specular
	if (opt.specularMap !== undefined) {
	    if (this.debug) {console.log("Specular:",opt.specularMap);}
	    const specLoader = new THREE.TextureLoader();
	    specLoader.load(
		opt.specularMap,function(specTexture) {
		    material.specularMap=specTexture;
		    material.specular=new THREE.Color(opt.specularColor);
		    material.needsUpdate=true;
		},function ( xhr ) {
		    console.log( "Spec:", (xhr.loaded / xhr.total * 100) + '% loaded' );
		},
		function ( xhr ) {
		    console.log( 'Spec: An error happened '+opt.specularMap );
		}
	    );
	};
	// process other options
	var ignore=["map","transMap","specularMap","specularColor",
		    "bumpMap","bumpScale",
		    "displacementMap", "displacementScale"];
	for (const [key, value] of Object.entries(opt)) {
	    if (ignore.indexOf(key)===-1) {
		if (this.debug) {console.log("Key:",key,value);}
		material[key]=value;
	    };
	};
	return material;
    };
    this.addTextureMap=function(material,map) {
	if (map !== undefined) {
	    const textureLoader=new THREE.TextureLoader();
	    textureLoader.load(
		map,
		function(mapTexture) {
		    mapTexture.name=map;
		    material.map=mapTexture;
		    material.needsUpdate=true;
		},
		function ( xhr ) {
		    console.log( "Map:", (xhr.loaded / xhr.total * 100) + '% loaded' );
		},
		function ( xhr ) {
		    console.log( 'Map: An error happened '+map  );
		}
	    );
	};
	return material;
    };
    this.addBumpMap=function(material,bumpMap,bumpScale) {
	if (bumpMap !== undefined) {
	    new THREE.TextureLoader().load(
		bumpMap,function(bumpTexture) {
		    material.bumpMap=bumpTexture;
		    material.bumpScale=bumpScale;		    
		    material.needsUpdate=true;
		},function ( xhr ) {
		    console.log( "Bump:", (xhr.loaded / xhr.total * 100) + '% loaded' );
		},
		function ( xhr ) {
		    console.log( 'Bump: An error happened '+bumpMap );
		}
	    );
	};
	return material;
    };
    this.addDisplacementMap2=function(material,displacementMap,displacementScale) {
	if (displacementMap !== undefined) {
	    new THREE.TextureLoader().load(
		displacementMap,function(displacementTexture) {
		    material.displacementMap=displacementTexture;
		    material.displacementScale=displacementScale;		    
		    material.needsUpdate=true;
		},function ( xhr ) {
		    console.log( "Displacement:", (xhr.loaded / xhr.total * 100) + '% loaded' );
		},
		function ( xhr ) {
		    console.log( 'Displacement: An error happened '+displacementMap );
		}
	    );
	};
	return material;
    };
    this.addTransparentMap = function (material, map, transMap) {
	// load earthcloudmap
	const maploader = new THREE.ImageLoader();
	maploader.load(map, function(imageMap) {
	    // create dataMap ImageData
	    var canvasMap	= document.createElement('canvas')
	    canvasMap.width	= imageMap.width
	    canvasMap.height    = imageMap.height
	    var contextMap	= canvasMap.getContext('2d')
	    contextMap.drawImage(imageMap, 0, 0)
	    var dataMap	= contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height)
	    // load transparent image
	    const transloader = new THREE.ImageLoader();
	    transloader.load(transMap, function(imageTrans) {
		// create dataTrans ImageData
		var canvasTrans		= document.createElement('canvas')
		canvasTrans.width	= imageTrans.width
		canvasTrans.height	= imageTrans.height
		var contextTrans	= canvasTrans.getContext('2d')
		contextTrans.drawImage(imageTrans, 0, 0)
		var dataTrans		= contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height)
		// merge dataMap + dataTrans into dataResult
		var canvasResult	= document.createElement('canvas')
		canvasResult.width	= Math.min(imageMap.width,imageTrans.width);
		canvasResult.height	= Math.min(imageMap.height,imageTrans.height);
		var contextResult	= canvasResult.getContext('2d')	
		//console.log("Width/height:",imageMap.width,imageMap.height,imageTrans.width,imageTrans.height);
		var dataResult		= contextResult.createImageData(canvasResult.width, canvasResult.height)
		for(var y = 0, offset = 0; y < imageMap.height; y++){
		    for(var x = 0; x < imageMap.width; x++, offset += 4){
			dataResult.data[offset+0]	= dataMap.data[offset+0]
			dataResult.data[offset+1]	= dataMap.data[offset+1]
			dataResult.data[offset+2]	= dataMap.data[offset+2]
			dataResult.data[offset+3]	= 255 - dataTrans.data[offset+0]/4
		    }
		}
		// update texture with result
		contextResult.putImageData(dataResult,0,0)	
		material.map=new THREE.Texture(canvasResult);
		material.map.needsUpdate=true;
		material.needsUpdate=true;
		//console.log( "Created trans:",map,transMap,material.map );

	    },function ( xhr ) {
		console.log( "Trans:", (xhr.loaded / xhr.total * 100) + '% loaded' );
	    },function ( xhr ) {
		console.log( 'Trans: An error happened '+transMap );
	    });
	},function ( xhr ) {
	    console.log( "Map:", (xhr.loaded / xhr.total * 100) + '% loaded' );
	},function ( xhr ) {
	    console.log( 'Map: An error happened '+map );
	});
	return material;
    };
    this.addDisplacementMap=function (material,dispMap,dispScale,nx,ny) {
	const disploader = new THREE.ImageLoader();
	disploader.load(dispMap, function(imageDisp) {
	    // create dataDisp ImageData
	    var canvasDisp	= document.createElement('canvas')
	    canvasDisp.width	= imageDisp.width
	    canvasDisp.height	= imageDisp.height
	    var contextDisp	= canvasDisp.getContext('2d')
	    contextDisp.drawImage(imageDisp, 0, 0)
	    var dataDisp	= contextDisp.getImageData(0, 0, canvasDisp.width, canvasDisp.height)
	    // merge dataMap + dataDisp into dataResult
	    var canvasResult	= document.createElement('canvas')
	    canvasResult.width	= nx
	    canvasResult.height	= ny
	    var contextResult	= canvasResult.getContext('2d')	
	    var dataResult	= contextResult.createImageData(canvasResult.width, canvasResult.height)
	    // initialise
	    for(var ii = 0; ii < nx*ny*4; ii++){
		dataResult.data[ii]=0
	    };
	    // make statistics
	    var stat=[];
	    for(let iy = 0; iy < ny; iy++){
		stat[iy]=[];
		for(let ix = 0; ix < nx; ix++){
		    stat[iy][ix]=[0,0,0,0,0];
		};
	    };
	    for(let y = 0; y < imageDisp.height; y++){
		for(let x = 0; x < imageDisp.width; x++){
		    let iy     = Math.floor(ny*((y+0.5)/imageDisp.height));
		    let ix     = Math.floor(nx*((x+0.5)/imageDisp.width));
		    let offorg = (x + y*imageDisp.width)*4
		    let offnew = (ix + iy*nx)*4
		    stat[iy][ix][0]=stat[iy][ix][0]+dataDisp.data[offorg+0];
		    stat[iy][ix][1]=stat[iy][ix][1]+dataDisp.data[offorg+1];
		    stat[iy][ix][2]=stat[iy][ix][2]+dataDisp.data[offorg+2];
		    stat[iy][ix][3]=stat[iy][ix][3]+dataDisp.data[offorg+3];
		    stat[iy][ix][4]=stat[iy][ix][4]+1.0;
		    //if ((offorg< 40)) {
		//	console.log("Item:",x,y,ix,iy,stat[iy][ix][0],dataDisp.data[offorg+0]);
		    //}
		}
	    }
	    // make smoothed disp
	    for(let iy = 0; iy < ny; iy++){
		for(let ix = 0; ix < nx; ix++){
		    let offnew = (ix + iy*nx)*4
		    dataResult.data[offnew+0]= Math.floor(stat[iy][ix][0]/stat[iy][ix][4]);
		    dataResult.data[offnew+1]= Math.floor(stat[iy][ix][1]/stat[iy][ix][4]);
		    dataResult.data[offnew+2]= Math.floor(stat[iy][ix][2]/stat[iy][ix][4]);
		    dataResult.data[offnew+3]= Math.floor(stat[iy][ix][3]/stat[iy][ix][4]);
		    //console.log("Data:",offnew,dataResult.data[offnew+0],dataResult.data[offnew+3]);
		}
	    }
	    
	    // update texture with result
	    if (this.debug) {console.log("Result:",dataResult);}
	    contextResult.putImageData(dataResult,0,0)	
	    //material.map=new THREE.Texture(canvasResult); // canvasResult);
	    //material.map.needsUpdate=true;
	    material.displacementMap=new THREE.Texture(canvasResult);
	    material.displacementScale=dispScale;
	    material.displacementMap.needsUpdate=true;
	    material.needsUpdate=true;
	    if (this.debug) {console.log( "Created disp:",dispMap );}
	}.bind(this),function ( xhr ) {
	    console.log( "Disp:", (xhr.loaded / xhr.total * 100) + '% loaded' );
	},function ( xhr ) {
	    console.log( 'Disp: An error happened '+dispMap );
	});
    };	
    this.setPosition=function(group,body,x,y,z) {
	var bdy=group.getObjectByName(body);
	if (bdy !== undefined) {
	    bdy.position.set(x,y,z);
	} else {
	    console.log("*** Attempt to set position on undefined body.");
	};
	return bdy;
    }
    this.setRotation=function(body,rot) {
	if (body !== undefined) {
	    // rotational axis is aligned with y-axis
	    if (rot.dec !== undefined && rot.ra !== undefined) {
		body.rotation.x=-rot.dec*this.deg2rad;  // assign declination
		body.rotation.y=rot.ra*this.deg2rad- Math.PI/2; // assign right-ascencion
	    // 	console.log("Rotation for:", body.name,body,rot,rot.dec, rot.ra);
	    // } else {
	    // 	console.log("No rotation for:", body.name,body,rot,rot.dec, rot.ra);
	    };
	    //console.log("*** Rotating:",body,rot,this.deg2rad,body.rotation);
	    //body.setRotationFromAxisAngle(rot,rot.w);
	} else {
	    console.log("*** Attempt to rotate undefined body.");
	};
	return body;
    }
    this.setRingRotation=function(group,body,rot) {
	var bdy=group.getObjectByName(body);
	if (bdy !== undefined) {
	    // rotational axis is aligned with y-axis
	    bdy.rotation.x=-rot.dec*this.deg2rad+Math.PI/2;  // assign declination
	    bdy.rotation.y=rot.ra*this.deg2rad- Math.PI/2; // assign right-ascencion 
	    //console.log("*** Rotating:",body,rot,this.deg2rad,bdy.rotation);
	    //bdy.setRotationFromAxisAngle(rot,rot.w);
	} else {
	    console.log("*** Attempt to rotate undefined body.");
	};
	return bdy;
    }
 };


// var loader = new THREE.TextureLoader();
// function onLoad( texture ) {
//     box.material.map = texture;
// }
// function onProgress( xhr ) {
//     console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
// }
// function onError( xhr ) {
//     console.error( 'An error happened' );
// }
// loader.load( 'assets/img/Dice-Blue-5.png', onLoad, onProgress, onError );

export default Bodies;
