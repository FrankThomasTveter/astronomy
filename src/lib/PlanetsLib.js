import Vector3 from './Vector3Lib';
//import Vector2 from './Vector2Lib';
import * as THREE from 'three';

console.log("Loading PlanetsLib");

function Planets() {
    this.SCALE = 0.00001;
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

    this.J2000 = new Date('2000-01-01T12:00:00-00:00');


    this.bodies={
	sun  :  {
	    title : 'The Sun',
	    mass : 1.9891e30,
	    radius : 6.96342e5*this.SCALE,
	    color : '#ffff00',
	    map : 'sunmap.jpg',
	    bumpScale : 10.0*this.SCALE,
	    k : 0.01720209895, //gravitational constant (μ)
	    type:   'sphere',
	    material : {
		emissive : new THREE.Color( 0xdddd33 )
	    },
	    mg : -26.74, // at 1 au
	    md : 1,
	    rotation : new Vector3(),
	    position : new Vector3()
	},
	mercury : {
	    title : 'Mercury',
	    mass : 3.3022e23,
	    radius:2439*this.SCALE,
	    color : '#588a7b',
	    map : 'mercurymap.jpg',
	    bump : 'mercurybump.jpg',
	    bumpScale : 10.0*this.SCALE,
	    orbit : { 
		base : {a : 0.38709927 * this.AU ,  e : 0.20563593, i: 7.00497902, l : 252.25032350, lp : 77.45779628, o : 48.33076593},
		cy : {a : 0.00000037 * this.AU ,  e : 0.00001906, i: -0.00594749, l : 149472.67411175, lp : 0.16047689, o : -0.12534081}
	    },
	    type:   'sphere',
	    shade : 'sun',
	    mg : -2.45, // superior conjunction
	    md : 1.307,
	    rotation : new Vector3(),
	    position : new Vector3()
	},
	venus : {
	    title : 'Venus',
	    mass : 4.868e24,
	    radius : 6051*this.SCALE,
	    color : '#fda700',
	    map : 'venusmap.jpg',
	    bump : 'venusbump.jpg',
	    bumpScale : 10.0*this.SCALE,
	    orbit : {
		base : {a : 0.72333566 * this.AU ,  e : 0.00677672, i: 3.39467605, l : 181.97909950, lp : 131.60246718, o : 76.67984255},
		cy : {a : 0.00000390 * this.AU ,  e : -0.00004107, i: -0.00078890, l : 58517.81538729, lp : 0.00268329, o : -0.27769418}
	    },
	    type:   'sphere',
	    shade : 'sun',
	    mg : -3.82, // far side of sun
	    md : 1.718,
	    rotation : new Vector3(),
	    position : new Vector3()
	},
	earth : {
	    title : 'The Earth',
	    mass : 5.9736e24,
	    radius : 6371.0088*this.SCALE,
	    color : '#1F7CDA',
	    map : 'earthmap1k.jpg',
	    bump : 'eartbump1k.jpg',
	    bumpScale : 10.0*this.SCALE,
	    spec : 'earthspec1k.jpg',
	    atmosphere : {
		radius : 6381.0088*this.SCALE,
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
		cy : {a : 0.00000562 * this.AU, e : -0.00004392, i : -0.01294668, l : 35999.37244981, lp : 0.32327364, o : 0.0}
	    },
	    type:   'sphere',
	    shade : 'sun',
	    shadows : ['moon'],
	    rotation : new Vector3(),
	    position : new Vector3()
	},
	mars : {
	    title : 'Mars',
	    mass : 6.4185e23,
	    radius : 3376*this.SCALE,
	    color : '#ff3300',
	    map : 'marsmap1k.jpg',
	    bump : 'marsbump1k.jpg',
	    bumpScale : 10.0*this.SCALE,
	    sideralDay : 1.025957 * this.DAY,
	    orbit : {
		base : {a : 1.52371034 * this.AU ,  e : 0.09339410, i: 1.84969142, l : -4.55343205, lp : -23.94362959, o : 49.55953891},
		cy : {a : 0.00001847 * this.AU ,  e : 0.00007882, i: -0.00813131, l : 19140.30268499, lp : 0.44441088, o : -0.29257343}
	    },
	    type:   'sphere',
	    shade : 'sun',
	    mg : -2.91, //closest to earth
	    md : 0.38,
	    rotation : new Vector3(),
	    position : new Vector3()
	},
	jupiter : {
	    title : 'Jupiter',
	    mass : 1.8986e27,
	    radius : 71492*this.SCALE,
	    color : '#ff9932',
	    map : 'jupitermap.jpg',
	    bumpScale : 10.0*this.SCALE,
	    orbit : {
		base : {a : 5.20288700 * this.AU ,  e : 0.04838624, i: 1.30439695, l : 34.39644051, lp : 14.72847983, o : 100.47390909},
		cy : {a : -0.00011607 * this.AU ,  e : -0.00013253, i: -0.00183714, l : 3034.74612775, lp : 0.21252668, o : 0.20469106}
	    },
	    type:   'sphere',
	    shade : 'sun',
	    shadows : ['io', 'europa', 'ganymedes','callisto'],
	    mg : -2.94 , //closest to earth
	    md : 3.95,
	    rotation : new Vector3(),
	    position : new Vector3()
	},
	ash :{map : 'ash_uvgrid01.jpg'},
	saturn : {
	    title : 'Saturn',
	    mass : 5.6846e26,
	    radius : 58232*this.SCALE,
	    color : '#ffcc99',
	    map : 'saturnmap.jpg',
	    bumpScale : 10.0*this.SCALE,
	    tilt : 26.7,
	    ring : {
		innerRadius : 74500*this.SCALE,
		outerRadius : 117580*this.SCALE,
		trans : 'saturnringpattern.gif',
		map : 'saturnringcolor.jpg',
		density : 0.9,
		color : '#aa8866'
	    },
	    orbit : {
		base : {a : 9.53667594 * this.AU ,  e : 0.05386179, i: 2.48599187, l : 49.95424423, lp : 92.59887831, o : 113.66242448},
		cy : {a : -0.00125060 * this.AU ,  e : -0.00050991, i: 0.00193609, l : 1222.49362201, lp : -0.41897216, o : -0.28867794}
	    },
	    type:   'sphere',
	    shade : 'sun',
	    mg : -0.49, // at opposition
	    md : 8.05,
	    rotation : new Vector3(),
	    position : new Vector3(),
	},
	uranus : {
	    title : 'Uranus',
	    mass : 8.6810e25,
	    radius : 25559*this.SCALE,
	    color : '#99ccff',
	    map : 'uranusmap.jpg',
	    bumpScale : 10.0*this.SCALE,
	    ring : {
		innerRadius : 54500*this.SCALE,
		outerRadius : 57580*this.SCALE,
		trans : 'uranusringtrans.gif',
		map : 'uranusringcolor.jpg',
		density : 0.5,
		color : '#6688aa'
	    },
	    orbit : {
		base : {a : 19.18916464 * this.AU ,  e : 0.04725744, i: 0.77263783, l : 313.23810451, lp : 170.95427630, o : 74.01692503},
		cy : {a : -0.00196176 * this.AU ,  e : -0.00004397, i: -0.00242939, l : 428.48202785, lp : 0.40805281, o : 0.04240589}
	    },
	    type:   'sphere',
	    shade : 'sun',
	    mg : 5.32, // closest to earth
	    md : 17.4,
	    rotation : new Vector3(),
	    position : new Vector3(),
	},
	neptune : {
	    title : 'Neptune',
	    mass : 1.0243e26,
	    radius : 24764*this.SCALE,
	    color : '#3299ff',
	    map : 'neptunemap.jpg',
	    bumpScale : 10.0*this.SCALE,
	    orbit : {
		base : {a : 30.06992276  * this.AU,  e : 0.00859048, i: 1.77004347, l : -55.12002969, lp : 44.96476227, o : 131.78422574},
		cy : {a : 0.00026291  * this.AU,  e : 0.00005105, i: 0.00035372, l : 218.45945325, lp : -0.32241464, o : -0.00508664}
	    },
	    type:   'sphere',
	    shade : 'sun',
	    mg : 7.78, // closest to earth
	    md : 28.8,
	    rotation : new Vector3(),
	    position : new Vector3()
	},
	pluto : {
	    title : 'Pluto',
	    mass : 1.305e22+1.52e21,
	    radius : 1153*this.SCALE,
	    color : '#aaaaaa',
	    map : 'plutomap1k.jpg',
	    bump : 'plutobump1k.jpg',
	    bumpScale : 10.0*this.SCALE,
	    orbit : {
		base : {a : 39.48211675 * this.AU ,  e : 0.24882730, i: 17.14001206, l : 238.92903833, lp : 224.06891629, o : 110.30393684},
		cy : {a : -0.00031596 * this.AU ,  e : 0.00005170, i: 0.00004818, l : 145.20780515, lp : -0.04062942, o : -0.01183482}
	    },
	    type:   'sphere',
	    shade : 'sun',
	    shadows : ['charon'],
	    mg : 13.65, // closest to earth
	    md : 28.7,
	    rotation : new Vector3(),
	    position : new Vector3()
	},
	moon : {
	    title : 'The Moon',
	    mass : 7.3477e22,
	    radius : 1738.1*this.SCALE,
	    color : "#ffffff",
	    map : 'moonmap1k.jpg',
	    bump : 'moonbump1k.jpg',
	    bumpScale : 10.0*this.SCALE,
	    sideralDay : (27.3215782 * this.DAY) ,
	    tilt : 1.5424,
	    fov : 1,
	    relativeTo : 'earth',
	    calculateFromElements : true,
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
		}       
	    },
	    getMapRotation : function(angle){
		if(angle > 0) {
		    return angle - Math.PI;
		}
		return angle + Math.PI;
	    },
	    customInitialize : function() {
		if(this.relativeTo !== 'earth') return;
		this.baseMapRotation = this.getMapRotation(this.getAngleTo('earth'));
		this.nextCheck = this.sideralDay;
	    },
	    // customAfterTick : function(time){
	    // 	if(this.relativeTo !== 'earth') return;
	    // 	//when a sideral day has passed, make sure that the near side is still facing the earth. Since the moon's orbit is heavily disturbed, some imprecision occurs in its orbit, and its duration is not always the same, especially in an incomplete scenario (where there are no sun/planets). Therefore, a correction is brought to the base map rotation, tweened so that is is not jerky.
	    // 	if(time >= this.nextCheck){
	    // 	    this.nextCheck += this.sideralDay;
	    // 	    TweenMax.to(this, 2, {baseMapRotation : this.getMapRotation(this.getAngleTo('earth')), ease:Sine.easeInOut});
	    // 	}
	    // },
            orbits: 'earth',
	    type:   'sphere',
	    shade : 'sun',
	    shadows : ['earth'],
	    mg : -12.90, // closest to earth
	    md : 0.00257,
	    rotation : new Vector3(),
	    position : new Vector3()
	},
	deathstar : {
	    title : 'Death Star',
	    mass : 1.305e22,
	    radius : 900*this.SCALE,
	    color : '#aaaaaa',
	    map : 'deathStarmap.png',
	    bump : 'deathStarbump.png',
	    bumpScale : 9.0*this.SCALE,
	    orbit : {
		base : {a : 49.48211675 * this.AU ,  e : 0.24882730, i: 17.14001206, l : 238.92903833, lp : 224.06891629, o : 110.30393684},
		cy : {a : -0.00031596 * this.AU ,  e : 0.00005170, i: 0.00004818, l : 145.20780515, lp : -0.04062942, o : -0.01183482}
	    },
	    orbits: 'saturn',
	    type:   'sphere',
	    shade : 'sun',
	    rotation : new Vector3(),
	    position : new Vector3()
	},
	stars : {
	    map : 'galaxy_starfield.png',
	    radius : 1000*this.AU,
	},	
	observer : {
	    position : new Vector3(),
	    i : new Vector3(),
	    j : new Vector3(),
	    k : new Vector3(),
	    zenith : new Vector3()
	}
    };
    this.createStarfield = function(dir){
	var ret={};
	return ret;	
    };
    this.copyObserver = function (src, trg) {
	trg.position.copy(src.position);
	trg.i.copy(src.i);
	trg.j.copy(src.j);
	trg.k.copy(src.k);
	trg.zenith.copy(src.zenith);
    };
    this.copyBody = function (src, trg) {
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
    this.linkShadows = function () {
	for (var body in this) {
	    // link source of shade
	    if (body.shade !== undefined) {
		var shades= body.shade;
		for (var shade in shades) {
		    if (this.bodies[shade] !== undefined) {
			if (body.shadeLink === undefined) {body.shadeLink={};};
			body.shadeLink[shade]=this.bodies[shade];
		    }
		}
	    }
	    // link bodies shaded by this body
	    if (body.shadows !== undefined) {
		var shadows= body.shadows;
		for (var shadow in shadows) {
		    if (this.bodies[shadow] !== undefined) {
			if (body.shadowLink === undefined) {body.shadowLink={};};
			body.shadowLink[shadow]=this.bodies[shadow];
		    }
		}
	    }
	}
    };
    this.baseURL	= 'media/';             // from http://planetpixelemporium.com/
    this.createLight    = function() {
	var light   = new THREE.DirectionalLight( 0xffffff, 1 )
	light.position.set(this.bodies.sun.radius*5,this.bodies.sun.radius*2,this.bodies.sun.radius*2)
	light.castShadow    = true
	light.shadowCameraNear      = 0.00001 * this.bodies.sun.radius
	light.shadowCameraFar       = 10.0 * this.bodies.sun.radius
	light.shadowCameraFov       = +1
	light.shadowCameraLeft      = -1
	light.shadowCameraRight     = +1
	light.shadowCameraTop       = +1
	light.shadowCameraBottom    = -1
	light.name                  ="light";
	return light;
    };
    this.createSunMesh	= function(){
	var material	= this.Material({map:this.baseURL+this.bodies.sun.map});
	var geometry	= new THREE.SphereGeometry(this.bodies.sun.radius, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="sun";
	return mesh	
    };
    this.createMercuryMesh	= function(){
	var material	= this.Material({map:this.baseURL+this.bodies.mercury.map,
					 bumpMap:this.baseURL+this.bodies.mercury.bump,
					 bumpScale:0.01*this.bodies.mercury.radius});
	var geometry	= new THREE.SphereGeometry(this.bodies.mercury.radius, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="mercury";
	return mesh	
    };
    this.createVenusMesh	= function(){
	var material	= this.Material({map:this.baseURL+this.bodies.venus.map,
					 bumpMap:this.baseURL+this.bodies.venus.bump,
					 bumpScale: 0.01*this.bodies.venus.radius});
	var geometry	= new THREE.SphereGeometry(this.bodies.venus.radius, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="venus";
	return mesh	
    };
    this.createEarthMesh	= function(){
	var material	= this.Material({map:this.baseURL+this.bodies.earth.map,
					 bumpMap:this.baseURL+this.bodies.earth.bump,
					 bumpScale:0.01*this.bodies.earth.radius,
					 specularMap:this.baseURL+this.bodies.earth.spec,
					 specularColor: 'grey'});
	var geometry	= new THREE.SphereGeometry(this.bodies.earth.radius, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="earth";
	return mesh	
    };
    this.createMoonMesh	= function(){
	var material	= this.Material({map: this.baseURL+this.bodies.moon.map,
					 bumpMap: this.baseURL+this.bodies.moon.bump,
					 bumpScale: 0.01*this.bodies.moon.radius});
	var geometry	= new THREE.SphereGeometry(this.bodies.moon.radius, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="moon";
	return mesh	
    };
    this.createMarsMesh	= function(){
	var material	= this.Material({map: this.baseURL+this.bodies.mars.map,
					 bumpMap: this.baseURL+this.bodies.mars.bump,
					 bumpScale: 0.01*this.bodies.mars.radius});
	var geometry	= new THREE.SphereGeometry(this.bodies.mars.radius, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="mars";
	return mesh	
    };
    this.createJupiterMesh= function(){
	var material    = this.Material({map:this.baseURL+this.bodies.jupiter.map,
					 bumpMap:this.baseURL+this.bodies.jupiter.map,
					 bumpScale: 0.01*this.bodies.jupiter.radius});
	var geometry	= new THREE.SphereGeometry(this.bodies.jupiter.radius, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="jupiter";
	return mesh	
    };
    this.createSaturnMesh= function(){
	var texture	= this.Material({map:this.baseURL+this.bodies.saturn.map,
					 bumpMap	: this.baseURL+this.bodies.saturn.map,
					 bumpScale: 0.01*this.bodies.saturn.radius});
	var geometry	= new THREE.SphereGeometry(this.bodies.saturn.radius, 32, 32);
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.name="saturn";
	return mesh	
    };
    this.createSaturnRingMesh	= function(){
	// create destination canvas
	var material    = this.Material({map:this.baseURL+this.bodies.saturn.ring.map,
					 transMap:this.baseURL+this.bodies.saturn.ring.trans,
					 side:THREE.DoubleSide,
					 transparent:true,
					 opacity:0.8,
					});
	var geometry	= this.RingGeometry(this.bodies.saturn.ring.innerRadius, this.bodies.saturn.ring.outerRadius, 64);
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.name       = "saturnring";
	mesh.lookAt(new THREE.Vector3(0,10*this.bodies.sun.radius,this.bodies.sun.radius));
	return mesh	
    };
    this.createUranusMesh	= function(){
	var material    = this.Material({ map:this.baseURL+this.bodies.uranus.map,
					  bumpMap:this.baseURL+this.bodies.uranus.map,
					  bumpScale:0.01*this.bodies.uranus.radius});
	var geometry	= new THREE.SphereGeometry(this.bodies.uranus.radius, 32, 32);
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.name="uranus";
	return mesh	
    };
    this.createUranusRingMesh	= function(){
	var material    = this.Material({map:this.baseURL+this.bodies.uranus.ring.map,
					 transMap:this.baseURL+this.bodies.uranus.ring.trans,
					 side:THREE.DoubleSide,
					 transparent:true,
					 opacity:0.8,
					});
	var geometry	= this.RingGeometry(this.bodies.uranus.ring.innerRadius, this.bodies.uranus.ring.outerRadius, 64);
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.name       ="uranusring";
	mesh.lookAt(new THREE.Vector3(0,10*this.bodies.sun.radius,this.bodies.sun.radius))
	return mesh	
    };
    this.createNeptuneMesh	= function(){
	var material	= this.Material({map:this.baseURL+this.bodies.neptune.map,
					 bumpMap:this.baseURL+this.bodies.neptune.map,
					 bumpScale:0.01*this.bodies.neptune.radius});
	var geometry	= new THREE.SphereGeometry(this.bodies.neptune.radius, 32, 32);
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name       = "neptune";
	return mesh	
    };
    this.createPlutoMesh	= function(){
	var material	= this.Material({map:this.baseURL+this.bodies.pluto.map,
					 bumpMap:this.baseURL+this.bodies.pluto.bump,
					 bumpScale: 0.05*this.bodies.pluto.radius});
	var geometry	= new THREE.SphereGeometry(this.bodies.pluto.radius, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name       = "pluto";
	return mesh	
    };
    this.createDeathStarMesh	= function(){
	var material	= this.Material({map:this.baseURL+this.bodies.deathstar.map,
					 bumpMap:this.baseURL+this.bodies.deathstar.bump,
					 bumpScale:this.bodies.deathstar.bumpScale});
	var geometry	= new THREE.SphereGeometry(this.bodies.deathstar.radius, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name       = "deathstar";
	return mesh	
    };
    this.createStarfieldMesh	= function(){
	var material    = this.Material({map:this.baseURL+this.bodies.stars.map,
					 side:THREE.BackSide});
	var geometry	= new THREE.SphereGeometry(this.bodies.stars.radius, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name       = "stars";
	return mesh	
    };
    this.createScene = function (icamera) {
	var scene = new THREE.Scene();
	var camera=icamera.clone();
	camera.name="camera";
	scene.add(camera);
	return scene;
    };
    this.createSunScene = function (icamera) {
	var scene = this.createScene(icamera);
	scene.add(this.createSunMesh());
	return scene;
    };
    this.createMercuryScene = function (icamera) {
	var scene = this.createScene(icamera);
	scene.add(this.createMercuryMesh());
	scene.add(this.createLight());
	return scene;
    };
    this.createVenusScene = function (icamera) {
	var scene = this.createScene(icamera);
	scene.add(this.createVenusMesh());
	scene.add(this.createLight());
	return scene;
    };
    this.createEarthScene = function (icamera) {
	var scene = this.createScene(icamera);
	scene.add(this.createEarthMesh());
	scene.add(this.createLight());
	return scene;
    };
    this.createMarsScene = function (icamera) {
	var scene = this.createScene(icamera);
	scene.add(this.createMarsMesh());
	scene.add(this.createLight());
	return scene;
    };
    this.createJupiterScene = function (icamera) {
	var scene = this.createScene(icamera);
	scene.add(this.createJupiterMesh());
	scene.add(this.createLight());
	return scene;
    };
    this.createSaturnScene = function (icamera) {
	var scene = this.createScene(icamera);
	scene.add(this.createSaturnMesh());
	scene.add(this.createSaturnRingMesh());
	scene.add(this.createDeathStarMesh());
	scene.add(this.createLight());
	return scene;
    };
    this.createUranusScene = function (icamera) {
	var scene = this.createScene(icamera);
	scene.add(this.createUranusMesh());
	scene.add(this.createUranusRingMesh());
	scene.add(this.createLight());
	return scene;
    };
    this.createNeptuneScene = function (icamera) {
	var scene = this.createScene(icamera);
	scene.add(this.createNeptuneMesh());
	scene.add(this.createLight());
	return scene;
    };
    this.createPlutoScene = function (icamera) {
	var scene = this.createScene(icamera);
	scene.add(this.createPlutoMesh());
	scene.add(this.createLight());
	return scene;
    };

    //////////////////////////////////////////////////////////////////////////////////
    //		comment								//
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * change the original from three.js because i needed different UV
     * 
     * @author Kaleb Murphy
     * @author jerome etienne
     */
    this.RingGeometry = function ( innerRadius, outerRadius, thetaSegments ) {
	const geometry = new THREE.RingBufferGeometry(innerRadius, outerRadius, thetaSegments);
	var pos = geometry.attributes.position;
	var v3 = new THREE.Vector3();
	for (let i = 0; i < pos.count; i++){
	    v3.fromBufferAttribute(pos, i);
	    geometry.attributes.uv.setXY(i, v3.length() < 4 ? 0 : 1, 1);
	}
	return geometry;
    };
    this.Material = function (opt) {
	if (opt===undefined) {opt={};};
	var material	= new THREE.MeshPhongMaterial();
	// load map
	if (opt.map !== undefined && opt.transMap !== undefined) {
	    this.addTransparentMap(material,opt.map, opt.transMap);
	} else if (opt.map !== undefined) {
	    this.addTextureMap(material,opt.map);
	};
	// load bump
	if (opt.bump !== undefined) {
	    this.addBumpMap(material,opt.bump,opt.bumpScale);
	};
	// load specular
	if (opt.specularMap !== undefined) {
	    var specLoader = new THREE.TextureLoader().load(
		opt.specularMap,function(specTexture) {
		    material.specularMap=specTexture;
		    material.specular=new THREE.Color(opt.specularColor);
		    
		},function ( xhr ) {
		    console.log( "Spec:", (xhr.loaded / xhr.total * 100) + '% loaded' );
		},
		function ( xhr ) {
		    console.log( 'Spec: An error happened '+opt.specularMap );
		}
	    );
	};
	// process other options
	var ignore=["map","transMap","specularMap","specularColor","bumpMap","bumpScale"];
	for (const [key, value] of Object.entries(opt)) {
	    if (ignore.indexOf(key)===-1) {
		material[key]=value;
	    };
	};
	return material;
    };
    this.addTextureMap=function(material,map) {
	if (map !== undefined) {
	    var mapLoader = new THREE.TextureLoader().load(
		map,
		function(mapTexture) {
		    material.map=mapTexture;
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
	    var bumpLoader = new THREE.TextureLoader().load(
		bumpMap,function(bumpTexture) {
		    material.bumpMap=bumpTexture;
		    material.bumpScale=bumpScale;		    
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
    this.addTransparentMap = function (material, map, transMap) {
	var canvasResult	= document.createElement('canvas')
	canvasResult.width	= 915
	canvasResult.height	= 64
	var contextResult	= canvasResult.getContext('2d')	
	// load earthcloudmap
	var imageMap	= new Image();
	imageMap.addEventListener("load", function() {	    
	    // create dataMap ImageData for saturnring
	    var canvasMap	= document.createElement('canvas')
	    canvasMap.width	= imageMap.width
	    canvasMap.height= imageMap.height
	    var contextMap	= canvasMap.getContext('2d')
	    contextMap.drawImage(imageMap, 0, 0)
	    var dataMap	= contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height)

	    // load saturnringtrans
	    var imageTrans	= new Image();
	    imageTrans.addEventListener("load", function(){
		// create dataTrans ImageData for saturnringtrans
		var canvasTrans		= document.createElement('canvas')
		canvasTrans.width	= imageTrans.width
		canvasTrans.height	= imageTrans.height
		var contextTrans	= canvasTrans.getContext('2d')
		contextTrans.drawImage(imageTrans, 0, 0)
		var dataTrans		= contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height)
		// merge dataMap + dataTrans into dataResult
		var dataResult		= contextMap.createImageData(canvasResult.width, canvasResult.height)
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
	    })
	    imageTrans.src	= transMap;
	}, false);
	imageMap.src	= map;
	return material;
    };
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

export default Planets;
