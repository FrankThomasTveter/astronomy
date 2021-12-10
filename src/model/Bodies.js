//import Vector3 from './Vector3Lib';
//import Vector2 from './Vector2Lib';
import * as THREE from 'three';

console.log("Loading BodiesLib");

function Bodies() {
    this.debug=false;
    this.SCALE = 0.00002;
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
    
    this.J2000 = new Date('2000-01-01T12:00:00-00:00');
    this.scenes={};
    
    this.config={
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
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	mercury : {
	    title : 'Mercury',
	    mass : 3.3022e23,
	    radius:2439*this.SCALE,
	    color : '#588a7b',
	    map : 'mercurymap.jpg',
	    bumpMap : 'mercurybump.jpg',
	    bumpScale : 3.0*this.SCALE,
	    orbit : { 
		base : {a : 0.38709927 * this.AU ,  e : 0.20563593, i: 7.00497902, l : 252.25032350, lp : 77.45779628, o : 48.33076593},
		cy : {a : 0.00000037 * this.AU ,  e : 0.00001906, i: -0.00594749, l : 149472.67411175, lp : 0.16047689, o : -0.12534081}
	    },
	    type:   'sphere',
	    shade : 'sun',
	    mg : -2.45, // superior conjunction
	    md : 1.307,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	venus : {
	    title : 'Venus',
	    mass : 4.868e24,
	    radius : 6051*this.SCALE,
	    color : '#fda700',
	    map : 'venusmap.jpg',
	    bumpMap : 'venusbump.jpg',
	    bumpScale : 6.0*this.SCALE,
	    orbit : {
		base : {a : 0.72333566 * this.AU ,  e : 0.00677672, i: 3.39467605, l : 181.97909950, lp : 131.60246718, o : 76.67984255},
		cy : {a : 0.00000390 * this.AU ,  e : -0.00004107, i: -0.00078890, l : 58517.81538729, lp : 0.00268329, o : -0.27769418}
	    },
	    type:   'sphere',
	    shade : 'sun',
	    mg : -3.82, // far side of sun
	    md : 1.718,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	earth : {
	    title : 'The Earth',
	    mass : 5.9736e24,
	    radius : 6371.0088*this.SCALE,
	    color : '#1F7CDA',
	    map : 'earthmap1k.jpg',
	    bumpMap : 'earthbump1k.jpg',
	    bumpScale : 20.0*this.SCALE,
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
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	mars : {
	    title : 'Mars',
	    mass : 6.4185e23,
	    radius : 3376*this.SCALE,
	    color : '#ff3300',
	    map : 'marsmap1k.jpg',
	    bumpMap : 'marsbump1k.jpg',
	    bumpScale : 21.9*this.SCALE,
	    sideralDay : 1.025957 * this.DAY,
	    orbit : {
		base : {a : 1.52371034 * this.AU ,  e : 0.09339410, i: 1.84969142, l : -4.55343205, lp : -23.94362959, o : 49.55953891},
		cy : {a : 0.00001847 * this.AU ,  e : 0.00007882, i: -0.00813131, l : 19140.30268499, lp : 0.44441088, o : -0.29257343}
	    },
	    type:   'sphere',
	    shade : 'sun',
	    mg : -2.91, //closest to earth
	    md : 0.38,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
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
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
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
		thickness : 1000*this.SCALE,
		map : 'saturnringcolor.jpg',
		trans : 'saturnringpattern.gif',
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
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3(),
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
		thickness : 1000*this.SCALE,
		trans : 'uranusringtrans.gif',
		map : 'uranusringcolour.jpg',
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
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3(),
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
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	pluto : {
	    title : 'Pluto',
	    mass : 1.305e22+1.52e21,
	    radius : 1153*this.SCALE,
	    color : '#aaaaaa',
	    map : 'plutomap1k.jpg',
	    bumpMap : 'plutobump1k.jpg',
	    bumpScale : 5.5*this.SCALE,
	    dispMap : 'plutomap1k.jpg', //'plutodisplacement.jpg',
	    dispScale : 50*this.SCALE,
	    orbit : {
		base : {a : 39.48211675 * this.AU ,  e : 0.24882730, i: 17.14001206, l : 238.92903833, lp : 224.06891629, o : 110.30393684},
		cy : {a : -0.00031596 * this.AU ,  e : 0.00005170, i: 0.00004818, l : 145.20780515, lp : -0.04062942, o : -0.01183482}
	    },
	    type:   'sphere',
	    shade : 'sun',
	    shadows : ['charon'],
	    mg : 13.65, // closest to earth
	    md : 28.7,
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	moon : {
	    title : 'The Moon',
	    mass : 7.3477e22,
	    radius : 1738.1*this.SCALE,
	    color : "#ffffff",
	    map : 'moonmap1k.jpg',
	    bumpMap : 'moonbump1k.jpg',
	    bumpScale : 5.5*this.SCALE,
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
	    // 	//when a sideral day has passed, make sure that the near side is still facing the earth.
	    //  // Since the moon's orbit is heavily disturbed, some imprecision occurs in its orbit, and its duration is not always the same,
	    //  // especially in an incomplete scenario (where there are no sun/planets). Therefore, a correction is brought to the base map rotation, tweened so that is is not jerky.
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
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	deathstar : {
	    title : 'Death Star',
	    mass : 1.305e22,
	    radius : 900*this.SCALE,
	    color : '#aaaaaa',
	    map : 'deathStarmap.png',
	    bumpMap : 'deathStarbump.png',
	    bumpScale : 9.0*this.SCALE,
	    orbit : {
		base : {a : 49.48211675 * this.AU ,  e : 0.24882730, i: 17.14001206, l : 238.92903833, lp : 224.06891629, o : 110.30393684},
		cy : {a : -0.00031596 * this.AU ,  e : 0.00005170, i: 0.00004818, l : 145.20780515, lp : -0.04062942, o : -0.01183482}
	    },
	    orbits: 'saturn',
	    type:   'sphere',
	    shade : 'sun',
	    rotation : new THREE.Vector3(0,0,1),
	    position : new THREE.Vector3()
	},
	observer : {
	    position : new THREE.Vector3(0,0,0),
	    i : new THREE.Vector3(1,0,0),
	    j : new THREE.Vector3(0,1,0),
	    k : new THREE.Vector3(0,0,1),
	    zenith : new THREE.Vector3(0,0,1)
	}
    };
    //
    //////////////////////////////////////////////////////////////////////////////////
    //
    this.init = function(state) {
	// executed after state has been created but before any data is loaded...
    };
    this.createStarfield = function(dir){
	var ret={};
	return ret;	
    };
    this.copyObserver = function (src, trg) {
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
    this.linkShadows = function () {
	for (var body in this) {
	    // link source of shade
	    if (body.shade !== undefined) {
		var shades= body.shade;
		for (var shade in shades) {
		    if (this.config[shade] !== undefined) {
			if (body.shadeLink === undefined) {body.shadeLink={};};
			body.shadeLink[shade]=this.config[shade];
		    }
		}
	    }
	    // link bodies shaded by this body
	    if (body.shadows !== undefined) {
		var shadows= body.shadows;
		for (var shadow in shadows) {
		    if (this.config[shadow] !== undefined) {
			if (body.shadowLink === undefined) {body.shadowLink={};};
			body.shadowLink[shadow]=this.config[shadow];
		    }
		}
	    }
	}
    };
    this.baseURL	= process.env.PUBLIC_URL+'/media/planets/';             // from http://planetpixelemporium.com/
    this.createSunMesh	= function(){
	var material	= this.Material({map:this.baseURL+this.config.sun.map});
	var geometry	= new THREE.SphereGeometry(this.config.sun.radius, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="sun";
	mesh.rotation.x=Math.PI/2;
	return mesh	
    };
    this.createMercuryMesh	= function(){
	var material	= this.Material({map:this.baseURL+this.config.mercury.map,
					 bumpMap:this.baseURL+this.config.mercury.bumpMap,
					 bumpScale:this.config.mercury.bumpScale});
	var geometry	= new THREE.SphereGeometry(this.config.mercury.radius, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="mercury";
	mesh.rotation.x=Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createVenusMesh	= function(){
	var material	= this.Material({map:this.baseURL+this.config.venus.map,
					 bumpMap:this.baseURL+this.config.venus.bumpMap,
					 bumpScale: this.config.venus.bumpScale});
	var geometry	= new THREE.SphereGeometry(this.config.venus.radius, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="venus";
	mesh.rotation.x=Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createEarthMesh	= function(){
	var material	= this.Material({map:this.baseURL+this.config.earth.map,
					 bumpMap:this.baseURL+this.config.earth.bumpMap,
					 bumpScale:this.config.earth.bumpScale,
					 specularMap:this.baseURL+this.config.earth.spec,
					 specularColor: 'grey'});
	var geometry	= new THREE.SphereGeometry(this.config.earth.radius, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="earth";
	mesh.rotation.x=Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createMoonMesh	= function(){
	var material	= this.Material({map: this.baseURL+this.config.moon.map,
					 bumpMap: this.baseURL+this.config.moon.bumpMap,
					 bumpScale: this.config.moon.bumpScale});
	var geometry	= new THREE.SphereGeometry(this.config.moon.radius, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="moon";
	mesh.rotation.x=Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createMarsMesh	= function(){
	var material	= this.Material({map: this.baseURL+this.config.mars.map,
					 bumpMap: this.baseURL+this.config.mars.bumpMap,
					 bumpScale: this.config.mars.bumpScale});
	var geometry	= new THREE.SphereGeometry(this.config.mars.radius, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="mars";
	mesh.rotation.x=Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createJupiterMesh= function(){
	var material    = this.Material({map:this.baseURL+this.config.jupiter.map,
					 bumpMap:this.baseURL+this.config.jupiter.map,
					 bumpScale: this.config.jupiter.bumpScale});
	var geometry	= new THREE.SphereGeometry(this.config.jupiter.radius, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="jupiter";
	mesh.rotation.x=Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createSaturnMesh= function(){
	var material	= this.Material({map:this.baseURL+this.config.saturn.map,
					 bumpMap	: this.baseURL+this.config.saturn.map,
					 bumpScale: this.config.saturn.bumpScale});
	var geometry	= new THREE.SphereGeometry(this.config.saturn.radius, 32, 32);
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.name       = "saturn";
	mesh.rotation.x = Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createSaturnRingMesh	= function(side){
	//THREE.DoubleSide,THREE.FrontSide,THREE.BackSide,
	var material;
	material    = this.Material({map:this.baseURL+this.config.saturn.ring.map,
				     transMap:this.baseURL+this.config.saturn.ring.trans,
				     side:THREE.FrontSide,
				     transparent:true,
				     opacity:0.9,
				    });
	var geometry	= this.RingGeometry(this.config.saturn.ring.innerRadius, this.config.saturn.ring.outerRadius, 128);
	var mesh	= new THREE.Mesh(geometry, material);
	var normal=new THREE.Vector3(1,0,5).normalize();
	var offset;
	if (side === THREE.BackSide) {
	    mesh.name       = "saturnringbottom";
	    normal.multiplyScalar(-1.0);
	} else if (side === THREE.FrontSide) {
	    mesh.name       = "saturnringtop";
	};
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	offset=normal.clone().multiplyScalar(this.config.saturn.ring.thickness); // offset so shadow is not messed up...
	mesh.position.set(offset.x,offset.y,offset.z);
	mesh.lookAt(normal);
	//mesh.rotation.x=Math.PI/2;
	return mesh	
    };
    this.createUranusMesh	= function(){
	var material    = this.Material({ map:this.baseURL+this.config.uranus.map,
					  bumpMap:this.baseURL+this.config.uranus.map,
					  bumpScale:this.config.uranus.bumpScale});
	var geometry	= new THREE.SphereGeometry(this.config.uranus.radius, 32, 32);
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.name="uranus";
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createUranusRingMesh	= function(side){
	var material;
	material    = this.Material({map:this.baseURL+this.config.uranus.ring.map,
					 transMap:this.baseURL+this.config.uranus.ring.trans,
					 side:THREE.FrontSide,
					 transparent:true,
					 opacity:0.8,
					});
	var geometry	= this.RingGeometry(this.config.uranus.ring.innerRadius, this.config.uranus.ring.outerRadius, 128);
	var mesh	= new THREE.Mesh(geometry, material);
	var normal=new THREE.Vector3(0.1,-0.3,1).normalize();
	var offset;
	if (side === THREE.BackSide) {
	    mesh.name       ="uranusringbottom";
	    normal.multiplyScalar(-1.0);
	} else if (side === THREE.FrontSide) {
	    mesh.name       ="uranusringtop";
	};
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	offset=normal.clone().multiplyScalar(this.config.uranus.ring.thickness); // offset so shadow is not messed up...
	mesh.position.set(offset.x,offset.y,offset.z);
	mesh.lookAt(normal);
	return mesh	
    };
    this.createNeptuneMesh	= function(){
	var material	= this.Material({map:this.baseURL+this.config.neptune.map,
					 bumpMap:this.baseURL+this.config.neptune.map,
					 bumpScale:this.config.neptune.bumpScale});
	var geometry	= new THREE.SphereGeometry(this.config.neptune.radius, 32, 32);
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name       = "neptune";
	mesh.rotation.x=Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createPlutoMesh	= function(){
	var material	= this.Material({map:this.baseURL+this.config.pluto.map,
					 bumpMap:this.baseURL+this.config.pluto.bumpMap,
					 bumpScale: this.config.pluto.bumpScale,
					 displacementMap:this.baseURL+this.config.pluto.dispMap,
					 displacementScale: this.config.pluto.dispScale});
	var geometry	= new THREE.SphereGeometry(this.config.pluto.radius, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name       = "pluto";
	mesh.rotation.x=Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createDeathStarMesh	= function(){
	var material	= this.Material({map:this.baseURL+this.config.deathstar.map,
					 bumpMap:this.baseURL+this.config.deathstar.bumpMap,
					 bumpScale:this.config.deathstar.bumpScale});
	var geometry	= new THREE.SphereGeometry(this.config.deathstar.radius, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name       = "deathstar";
	mesh.rotation.x=Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh	
    };
    this.createLight    = function() {
	var light   = new THREE.DirectionalLight( 0xffffff, 1, 100 )
	light.position.set(0.5*this.config.sun.radius,
			   1.0*this.config.sun.radius,
			   0.5*this.config.sun.radius)
	light.castShadow            = true;
	light.shadow.mapSize.width  = 1024; // default
	light.shadow.mapSize.height = 1024; // default
	light.shadow.camera.near    = 0.0 * this.config.sun.radius;
	light.shadow.camera.far     = 3.0 * this.config.sun.radius;
	light.name                  ="sunlight";
	return light;
    };
    //
    //////////////////////////////////////////////////////////////////////////////////
    //
    this.createScene = function () { // icamera
	var scene = new THREE.Scene();
	//var camera=icamera.clone();
	//camera.name="camera";
	//scene.add(camera);
	return scene;
    };
    this.createSunScene = function () {
	var scene = this.createScene();
	scene.add(this.createSunMesh());
	scene.add(new THREE.AmbientLight('#ffff88',1000));
	return scene;
    };
    this.createMercuryScene = function () {
	var scene = this.createScene();
	scene.add(this.createMercuryMesh());
	scene.add(this.createLight());
	return scene;
    };
    this.createVenusScene = function () {
	var scene = this.createScene();
	scene.add(this.createVenusMesh());
	scene.add(this.createLight());
	return scene;
    };
    this.createEarthScene = function () {
	var scene = this.createScene();
	scene.add(this.createEarthMesh());
	scene.add(this.createMoonMesh());
	scene.add(this.createLight());
	return scene;
    };
    this.createMarsScene = function () {
	var scene = this.createScene();
	scene.add(this.createMarsMesh());
	scene.add(this.createLight());
	return scene;
    };
    this.createJupiterScene = function () {
	var scene = this.createScene();
	scene.add(this.createJupiterMesh());
	scene.add(this.createLight());
	return scene;
    };
    this.createSaturnScene = function () {
	var scene = this.createScene();
	var group = new THREE.Group();
	group.add(this.createLight());
	group.add(this.createSaturnMesh());
	group.add(this.createSaturnRingMesh(THREE.FrontSide));
	group.add(this.createSaturnRingMesh(THREE.BackSide));
	group.add(this.createDeathStarMesh());
	this.setPosition(group,"deathstar",
			 20000*this.SCALE,
			 this.config.saturn.radius*1.01,
			 10000*this.SCALE);//
	group.name="saturn";
	scene.add(group);
	return scene;
    };
    this.createUranusScene = function () {
	var scene = this.createScene();
	var group = new THREE.Group();
	group.add(this.createUranusMesh());
	group.add(this.createUranusRingMesh(THREE.FrontSide));
	group.add(this.createUranusRingMesh(THREE.BackSide));
	group.add(this.createLight());
	group.name="uranus";
	scene.add(group);
	return scene;
    };
    this.createNeptuneScene = function () {
	var scene = this.createScene();
	scene.add(this.createNeptuneMesh());
	scene.add(this.createLight());
	return scene;
    };
    this.createPlutoScene = function () {
	var scene = this.createScene();
	scene.add(this.createPlutoMesh());
	scene.add(this.createLight());
	return scene;
    };
    this.createScenes = function(camera) {
	this.scenes["sun"]     = this.createSunScene(camera);
	this.scenes["mercuy"]  = this.createMercuryScene(camera);
	this.scenes["venus"]   = this.createVenusScene(camera);
	this.scenes["earth"]   = this.createEarthScene(camera);
	this.scenes["mars"]    = this.createMarsScene(camera);
	this.scenes["jupiter"] = this.createJupiterScene(camera);
	this.scenes["saturn"]  = this.createSaturnScene(camera);
	this.scenes["uranus"]  = this.createUranusScene(camera);
	this.scenes["neptune"] = this.createNeptuneScene(camera);
	this.scenes["pluto"]   = this.createPlutoScene(camera);
	return this.scenes;
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
	    // create dataMap ImageData for saturnring
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
