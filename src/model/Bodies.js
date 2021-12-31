//import Vector3 from './Vector3Lib';
//import Vector2 from './Vector2Lib';
import * as THREE from 'three';
import * as UTILS from './utils';

console.log("Loading BodiesLib");

function Bodies() {
    this.debug=false;
    this.AU = 149597870;
    this.CIRCLE = 2 * Math.PI;
    this.KM = 1000;
    this.DEG_TO_RAD = Math.PI/180;
    this.RAD_TO_DEG = 180/Math.PI;

    this.NM_TO_KM = 1.852;
    this.LB_TO_KG = 0.453592;
    this.LBF_TO_NEWTON = 4.44822162;
    this.FT_TO_M = 0.3048;

    //use physics or orbital elements to animate
    this.USE_PHYSICS_BY_DEFAULT = false;

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
    
    this.J2000 = new Date('2000-01-01T12:00:00-00:00');
    this.scenes={};
    
    this.near=147;// 1
    this.far=149;//1000000000
    
    this.config={
	sun  :  {
	    scale : 0.00002,
	    title : 'The Sun',
	    visible: true,
	    mass : 1.9891e30,
	    radius : 6.96342e5,
	    color : '#ffff00',
	    map : 'sunmap.jpg',
	    bumpScale : 10.0,
	    k : 0.01720209895, //gravitational constant (μ)
	    material : {
		emissive : new THREE.Color( 0xdddd33 )
	    },
	    mg : -26.74, // at 1 au
	    md : 1,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	mercury : {
	    scale : 0.00002,
	    title : 'Mercury',
	    visible: true,
	    mass : 3.3022e23,
	    radius: 2439,
	    color : '#588a7b',
	    map : 'mercurymap.jpg',
	    bumpMap : 'mercurybump.jpg',
	    bumpScale : 3.0,
	    orbit : { 
		base : {a : 0.38709927 * this.AU ,  e : 0.20563593, i: 7.00497902, l : 252.25032350, lp : 77.45779628, o : 48.33076593},
		cy : {a : 0.00000037 * this.AU ,  e : 0.00001906, i: -0.00594749, l : 149472.67411175, lp : 0.16047689, o : -0.12534081},
	    },
	    orbits: "sun",
	    mg : -2.45, // superior conjunction
	    md : 1.307,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	venus : {
	    scale : 0.00002,
	    title : 'Venus',
	    visible: true,
	    mass : 4.868e24,
	    radius : 6051,
	    color : '#fda700',
	    map : 'venusmap.jpg',
	    bumpMap : 'venusbump.jpg',
	    bumpScale : 6.0,
	    orbit : {
		base : {a : 0.72333566 * this.AU ,  e : 0.00677672, i: 3.39467605, l : 181.97909950, lp : 131.60246718, o : 76.67984255},
		cy : {a : 0.00000390 * this.AU ,  e : -0.00004107, i: -0.00078890, l : 58517.81538729, lp : 0.00268329, o : -0.27769418},
	    },
	    orbits: "sun",
	    mg : -3.82, // far side of sun
	    md : 1.718,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	earth : {
	    scale : 1,
	    title : 'The Earth',
	    visible: false,
	    mass : 5.9736e24,
	    radius : 6371.0088,
	    color : '#1F7CDA',
	    map : 'earthmap1k.jpg',
	    bumpMap : 'earthbump1k.jpg',
	    bumpScale : 20.0,
	    spec : 'earthspec1k.jpg',
	    atmosphere : {
		radius : 6381.0088,
		trans : 'earthcloudmaptrans.jpg',
		cloud : 'earthcloudmap.jpg',
	    },
	    material : {
		specular : new THREE.Color('grey')
	    },
	    sideralDay : this.SIDERAL_DAY,
	    tilt : 23+(26/60)+(21/3600) ,
	    orbit : {
		base : {a : 1.00000261 * this.AU, e : 0.01671123, i : -0.00001531, l : 100.46457166, lp : 102.93768193, o : 0.0},
		cy : {a : 0.00000562 * this.AU, e : -0.00004392, i : -0.01294668, l : 35999.37244981, lp : 0.32327364, o : 0.0},
	    },
	    orbits: "sun",
	    satellites:[{name:"moon"}],
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	mars : {
	    scale : 0.00002,
	    title : 'Mars',
	    visible: true,
	    mass : 6.4185e23,
	    radius : 3376,
	    color : '#ff3300',
	    map : 'marsmap1k.jpg',
	    bumpMap : 'marsbump1k.jpg',
	    bumpScale : 21.9,
	    sideralDay : 1.025957 * this.DAY,
	    orbit : {
		base : {a : 1.52371034 * this.AU ,  e : 0.09339410, i: 1.84969142, l : -4.55343205, lp : -23.94362959, o : 49.55953891},
		cy : {a : 0.00001847 * this.AU ,  e : 0.00007882, i: -0.00813131, l : 19140.30268499, lp : 0.44441088, o : -0.29257343},
	    },
	    orbits: "sun",
	    mg : -2.91, //closest to earth
	    md : 0.38,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	jupiter : {
	    scale : 0.000002,
	    title : 'Jupiter',
	    visible: true,
	    mass : 1.8986e27,
	    radius : 71492,
	    color : '#ff9932',
	    map : 'jupitermap.jpg',
	    bumpScale : 10.0,
	    orbit : {
		base : {a : 5.20288700 * this.AU ,  e : 0.04838624, i: 1.30439695, l : 34.39644051, lp : 14.72847983, o : 100.47390909},
		cy : {a : -0.00011607 * this.AU ,  e : -0.00013253, i: -0.00183714, l : 3034.74612775, lp : 0.21252668, o : 0.20469106},
	    },
	    orbits: "sun",
	    satellitesX : ['io', 'europa', 'ganymedes','callisto'],
	    mg : -2.94 , //closest to earth
	    md : 3.95,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	ash :{map : 'ash_uvgrid01.jpg'},
	saturn : {
	    scale : 0.0000001,
	    title : 'Saturn',
	    visible: true,
	    mass : 5.6846e26,
	    radius : 58232,
	    color : '#ffcc99',
	    map : 'saturnmap.jpg',
	    bumpScale : 10.0,
	    tilt : 26.7,
	    ring : {
		innerRadius : 74500,
		outerRadius : 117580,
		thickness : 1000,
		map : 'saturnringcolor.jpg',
		trans : 'saturnringpattern.gif',
		density : 0.9,
		color : '#aa8866'
	    },
	    satellites :[{name:"deathstar"}],
	    orbit : {
		base : {a : 9.53667594 * this.AU ,  e : 0.05386179, i: 2.48599187, l : 49.95424423, lp : 92.59887831, o : 113.66242448},
		cy : {a : -0.00125060 * this.AU ,  e : -0.00050991, i: 0.00193609, l : 1222.49362201, lp : -0.41897216, o : -0.28867794},
	    },
	    orbits: "sun",
	    mg : -0.49, // at opposition
	    md : 8.05,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3(),
	},
	uranus : {
	    scale : 0.00000001,
	    title : 'Uranus',
	    visible: true,
	    mass : 8.6810e25,
	    radius : 25559,
	    color : '#99ccff',
	    map : 'uranusmap.jpg',
	    bumpScale : 10.0,
	    ring : {
		innerRadius : 54500,
		outerRadius : 57580,
		thickness : 1000,
		trans : 'uranusringtrans.gif',
		map : 'uranusringcolour.jpg',
		density : 0.5,
		color : '#6688aa'
	    },
	    orbit : {
		base : {a : 19.18916464 * this.AU ,  e : 0.04725744, i: 0.77263783, l : 313.23810451, lp : 170.95427630, o : 74.01692503},
		cy : {a : -0.00196176 * this.AU ,  e : -0.00004397, i: -0.00242939, l : 428.48202785, lp : 0.40805281, o : 0.04240589},
	    },
	    orbits: "sun",
	    mg : 5.32, // closest to earth
	    md : 17.4,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3(),
	},
	neptune : {
	    scale : 0.0000002,
	    title : 'Neptune',
	    visible: true,
	    mass : 1.0243e26,
	    radius : 24764,
	    color : '#3299ff',
	    map : 'neptunemap.jpg',
	    bumpScale : 10.0,
	    orbit : {
		base : {a : 30.06992276  * this.AU,  e : 0.00859048, i: 1.77004347, l : -55.12002969, lp : 44.96476227, o : 131.78422574},
		cy : {a : 0.00026291  * this.AU,  e : 0.00005105, i: 0.00035372, l : 218.45945325, lp : -0.32241464, o : -0.00508664},
	    },
	    orbits: "sun",
	    mg : 7.78, // closest to earth
	    md : 28.8,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	pluto : {
	    scale : 0.0000002,
	    title : 'Pluto',
	    visible: true,
	    mass : 1.305e22+1.52e21,
	    radius : 1153,
	    color : '#aaaaaa',
	    map : 'plutomap1k.jpg',
	    bumpMap : 'plutobump1k.jpg',
	    bumpScale : 5.5,
	    dispMap : 'plutomap1k.jpg', //'plutodisplacement.jpg',
	    dispScale : 50,
	    orbit : {
		base : {a : 39.48211675 * this.AU ,  e : 0.24882730, i: 17.14001206, l : 238.92903833, lp : 224.06891629, o : 110.30393684},
		cy : {a : -0.00031596 * this.AU ,  e : 0.00005170, i: 0.00004818, l : 145.20780515, lp : -0.04062942, o : -0.01183482},
	    },
	    orbits:"sun",
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
	    radius : 1738.1,
	    color : "#ffffff",
	    map : 'moonmap1k.jpg',
	    bumpMap : 'moonbump1k.jpg',
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
	    scale : 0.00002,
	    title : 'Death Star',
	    visible: true,
	    mass : 1.305e22,
	    radius : 900,
	    color : '#aaaaaa',
	    map : 'deathStarmap.png',
	    bumpMap : 'deathStarbump.png',
	    bumpScale : 9.0,
	    orbit : {
		base : {a : 49.48211675 * this.AU ,  e : 0.24882730, i: 17.14001206, l : 238.92903833, lp : 224.06891629, o : 110.30393684},
		cy : {a : -0.00031596 * this.AU ,  e : 0.00005170, i: 0.00004818, l : 145.20780515, lp : -0.04062942, o : -0.01183482},
	    },
	    calculateFromElements : true,
	    orbits: undefined,
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
    this.baseURL = process.env.PUBLIC_URL+'/media/planets/';             // from http://planetpixelemporium.com/
    //
    //////////////////////////////////////////////////////////////////////////////////
    //
    this.init = function(state) {
	// executed after state has been created but before any data is loaded...
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
	    scene.add(mesh);
	    scene.add(new THREE.AmbientLight('#ffff88',1000));
	    scene.add(this.createLabel(name));
	} else { // other planets
	    scene.add(mesh);
	    scene.add(this.createLight(mesh,name));
	    scene.add(this.createLabel(name));
	}
	return scene;
    };

    this.addSatellites=function(group,name) {
	let satellites=this.config[name].satellites||[];
	if (satellites === undefined) { return;};
	let scale=this.config[name].scale;
	let radius=this.config[name].radius;
	satellites.forEach((k,i)=>{
	    k.orbits=name;
	    group.add(this.createMesh(k.name,scale));
	    this.setPosition(group,k.name,
			     -radius*1.5*scale,
			     20000*scale,
			     50000*scale);//
	});
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
	    console.log("Mesh not implemented:",name);
	}
    };

    this.createSunMesh	= function(){
	var scale=this.config.sun.scale;
	var material	= this.Material({map:this.baseURL+this.config.sun.map});
	var geometry	= new THREE.SphereGeometry(this.config.sun.radius*scale, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="sun";
	mesh.rotation.x=Math.PI/2;
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
	mesh.rotation.x=Math.PI/2;
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
	mesh.rotation.x=Math.PI/2;
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
	var geometry	= new THREE.SphereGeometry(this.config.earth.radius*scale, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="earth";
	mesh.rotation.x=Math.PI/2;
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
	mesh.rotation.x=Math.PI/2;
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
	mesh.rotation.x=Math.PI/2;
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
	mesh.rotation.x=Math.PI/2;
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
	mesh.rotation.x=Math.PI/2;
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
				     transparent:true,
				     opacity:0.9,
				    });
	var geometry	= this.RingGeometry(this.config.saturn.ring.innerRadius*scale, this.config.saturn.ring.outerRadius*scale, 128);
	var mesh	= new THREE.Mesh(geometry, material);
	var normal=new THREE.Vector3(0,0,1).normalize();
	var offset;
	if (side === THREE.BackSide) {
	    mesh.name       = "saturnringbottom";
	    //normal.multiplyScalar(-1.0);
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
	//mesh.rotation.x=Math.PI/2;
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
	mesh.rotation.x=Math.PI/2;
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
					 opacity:0.8,
					});
	var geometry	= this.RingGeometry(this.config.uranus.ring.innerRadius*scale, this.config.uranus.ring.outerRadius*scale, 128);
	var mesh	= new THREE.Mesh(geometry, material);
	var normal=new THREE.Vector3(0.1,-0.3,1).normalize();
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
	mesh.rotation.x=Math.PI/2;
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
	mesh.rotation.x=Math.PI/2;
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
	mesh.rotation.x=Math.PI/2;
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
	var title=this.config[name].title;
	var label=UTILS.createTextSprite(title,
					 {font:'48px Arial',
					  floating:true,
					  fillStyle:'yellow',
					  size:200,
					  cx:0,cy:0.5,
					  x:0,y:0,z:0,
					  alphaTest:0.01,
					  //border:true,
					  renderOrder:1,
					  name:"label"+name,
					 });
	if (this.config[name].visible) {
	    label.visible=true;
	} else {
	    label.visible=false;
	}
	return label;
    }
    //
    //////////////////////////////////////////////////////////////////////////////////
    //
    this.prepareForRender=function(name,scene,mainCamera) {
    };
    
    this.updateScene=function(state,mainCamera,observer,name,scene) {
	//console.log("UpdateScene:",name,scale);
	this.updateCamera(state,mainCamera,observer,name,scene);
	this.updateLabel(state,mainCamera,observer,name,scene);
	this.updateSatellites(state,mainCamera,observer,name,scene);
	if (name === "saturn" || name === "uranus") {
	    let scale = this.config[name].scale;
	    let range= this.config[name].radius*2;
	    let pos   = this.config[name].position;
	    let group = scene.getObjectByName("group");
	    let body  = scene.getObjectByName(name);
	    let light  = scene.getObjectByName("sunlight");
	    group.position.set(pos.x*scale,pos.y*scale,pos.z*scale);
	    this.direction.setFromMatrixPosition( group.matrixWorld );
	    this.location.setFromMatrixPosition( body.matrixWorld );
	    this.updateShadowCamera(light,pos,scale,range);
	    let helper  = scene.getObjectByName("helper");
	    if (helper !== undefined) {
		//console.log(helper);
		helper.camera.copy(light.shadow.camera);
		helper.update();
	    }
	    //console.log(name,this.direction,scene);	    
	} else { // sun and other planets
	    let scale = this.config[name].scale;
	    let pos   = this.config[name].position;
	    let body  = scene.getObjectByName(name);
	    //console.log("Pos:",name,pos);
	    body.position.set(pos.x*scale,pos.y*scale,pos.z*scale);
	};
    };

    this.updateSatellites = function(state,mainCamera,observer,name,scene) {
	let satellites=this.config[name].satellites||[];
	if (satellites === undefined) { return;};
	let scale=this.config[name].scale;
	let radius=this.config[name].radius;
	let pos   = this.config[name].position;
	satellites.forEach((satellite,i)=>{
	    let body  = scene.getObjectByName(satellite.name);
	    if (body!==undefined) {
		if ( this.config[satellite.name]!==undefined &&
		     this.config[satellite.name].position!==undefined) { // dynamic position
		    this.config[satellite.name].orbits=name;
		    let offset=this.config[satellite.name].position;
		    body.position.set(offset.x*scale,offset.y*scale,offset.z*scale);
		}
	    };
	});
    };

    this.getElements=function(name) {
	return this.config[name].base;
    };
    
    this.getPosition=function(state,elements) {
    };
    
    this.updateShadowCamera=function(light,pos,scale,range) {
	let x = pos.x;
	let y = pos.y;
	let z = pos.z;
	let d=Math.max(Math.sqrt(x*x+y*y+z*z),1);
	let metric= range*scale;
	let near= 10*metric;
	let far = near + 2*metric
	x=-(metric+near)*x/d + x*scale;
	y=-(metric+near)*y/d + y*scale;
	z=-(metric+near)*z/d + z*scale;
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
	    let obs=observer.position;
	    camera.copy(mainCamera);
	    camera.position.set(obs.x*scale,obs.y*scale,obs.z*scale);
	};
    };

    this.updateLabel=function(state,mainCamera,observer,name,scene) {
	var label=scene.getObjectByName("label"+name);
	if (label !== undefined) {
	    let scale = this.config[name].scale;
	    var range=this.config[name].radius;
	    if (name==="saturn" || name==="uranus") {range=2*range;} // make room for rings
	    this.direction.set();
	    let pos=this.config[name].position;
	    let obs=observer.position;
	    this.direction.set(pos.x-obs.x,pos.y-obs.y,pos.z-obs.z);
	    // resize...
	    let size=label.width*scale*this.direction.length()/500;
	    label.material.size=size;
	    //console.log("Sprite:",name,label.width,label.height);
	    //console.log(name,label.scale,size,label);
	    // reposition...
	    this.right.crossVectors(this.direction,this.config.observer.zenith);
	    if (this.right.length() > 0) {
		this.right.normalize();
		this.right.multiplyScalar(range*scale*1.1);
		this.right.addScaledVector(pos,scale);
		label.position.set(this.right.x,this.right.y,this.right.z);
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
    this.setPosition=function(scene,body,x,y,z) {
	var bdy=scene.getObjectByName(body);
	if (bdy !== undefined) {
	    bdy.position.set(x,y,z);
	} else {
	    console.log("*** Attempt to set position on undefined body.");
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
