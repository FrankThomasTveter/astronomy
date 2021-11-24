import Vector3 from './Vector3Lib';
//import Vector2 from './Vector2Lib';
import * as THREE from 'three';

console.log("Loading PlanetsLib");

function Planets() {
    this.bodies={
	sun  :  {
	    title : 'The Sun',
	    type:   'sphere',
	    radius : 6.96342e5,
	    color : '#ffff00',
	    //color : '#ffffff',
	    mg : -26.74, // at 1 au
	    md : 1,
	    rotation : new Vector3(),
	    position : new Vector3()
	},
	mercury : {
	    title : 'Mercury',
	    type:   'sphere',
	    radius:2439.0,
	    color : '#588a7b',
	    shade : 'sun',
	    mg : -2.45, // superior conjunction
	    md : 1.307,
	    rotation : new Vector3(),
	    position : new Vector3()
	},
	venus : {
	    title : 'Venus',
	    type:   'sphere',
	    radius : 6051.0,
	    color : '#fda700',
	    shade : 'sun',
	    mg : -3.82, // far side of sun
	    md : 1.718,
	    rotation : new Vector3(),
	    position : new Vector3()
	},
	earth : {
	    title : 'The Earth',
	    type:   'sphere',
	    radius : 6371.0088,
	    color : '#1F7CDA',
	    shade : 'sun',
	    shadows : ['moon'],
	    rotation : new Vector3(),
	    position : new Vector3()
	},
	mars : {
	    title : 'Mars',
	    type:   'sphere',
	    radius : 3376.0,
	    color : '#ff3300',
	    shade : 'sun',
	    mg : -2.91, //closest to earth
	    md : 0.38,
	    rotation : new Vector3(),
	    position : new Vector3()
	},
	jupiter : {
	    title : 'Jupiter',
	    type:   'sphere',
	    radius : 71492.0,
	    color : '#ff9932',
	    shade : 'sun',
	    shadows : ['io', 'europa', 'ganymedes','callisto'],
	    mg : -2.94 , //closest to earth
	    md : 3.95,
	    rotation : new Vector3(),
	    position : new Vector3()
	},
	saturn : {
	    title : 'Saturn',
	    type:   'sphere',
	    radius : 58232.0,
	    color : '#ffcc99',
	    shade : 'sun',
	    mg : -0.49, // at opposition
	    md : 8.05,
	    rotation : new Vector3(),
	    position : new Vector3(),
	    ring : {
		innerRadius : 74500.0,
		outerRadius : 117580.0,
		density : 0.9,
		color : '#aa8866'
	    },
	},
	uranus : {
	    title : 'Uranus',
	    type:   'sphere',
	    radius : 25559.0,
	    color : '#99ccff',
	    shade : 'sun',
	    mg : 5.32, // closest to earth
	    md : 17.4,
	    rotation : new Vector3(),
	    position : new Vector3(),
	    ring : {
		innerRadius : 54500.0,
		outerRadius : 57580.0,
		density : 0.5,
		color : '#6688aa'
	    },
	},
	neptune : {
	    title : 'Neptune',
	    type:   'sphere',
	    radius : 24764.0,
	    color : '#3299ff',
	    shade : 'sun',
	    mg : 7.78, // closest to earth
	    md : 28.8,
	    rotation : new Vector3(),
	    position : new Vector3()
	},
	pluto : {
	    title : 'Pluto',
	    type:   'sphere',
	    radius : 1153.0,
	    color : '#aaaaaa',
	    shade : 'sun',
	    shadows : ['charon'],
	    mg : 13.65, // closest to earth
	    md : 28.7,
	    rotation : new Vector3(),
	    position : new Vector3()
	},
	moon : {
	    title : 'The Moon',
            orbits: 'earth',
	    type:   'sphere',
	    radius : 1738.1,
	    color : "#ffffff",
	    shade : 'sun',
	    shadows : ['earth'],
	    mg : -12.90, // closest to earth
	    md : 0.00257,
	    rotation : new Vector3(),
	    position : new Vector3()
	},
	deathStar : {
	    title : 'Death Star',
	    orbits: 'moon',
	    type:   'sphere',
	    radius : 900.0,
	    color : '#aaaaaa',
	    shade : 'sun',
	    rotation : new Vector3(),
	    position : new Vector3()
	},
	observer : {
	    position : new Vector3(),
	    i : new Vector3(),
	    j : new Vector3(),
	    k : new Vector3(),
	    zenith : new Vector3()
	}
    };
    this.AU = 149597870;
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
    this.baseURL	= '';
    // from http://planetpixelemporium.com/
    this.createSunMesh	= function(){
	var geometry	= new THREE.SphereGeometry(0.5, 32, 32)
	var texture	= THREE.ImageUtils.loadTexture(this.baseURL+'media/sunmap.jpg')
	var material	= new THREE.MeshPhongMaterial({
	    map	: texture,
	    bumpMap	: texture,
	    bumpScale: 0.05,
	})
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="sun";
	return mesh	
    };
    this.createMercuryMesh	= function(){
	var geometry	= new THREE.SphereGeometry(0.5, 32, 32)
	var material	= new THREE.MeshPhongMaterial({
	    map	: THREE.ImageUtils.loadTexture(this.baseURL+'media/mercurymap.jpg'),
	    bumpMap	: THREE.ImageUtils.loadTexture(this.baseURL+'media/mercurybump.jpg'),
	    bumpScale: 0.005,
	})
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="mercury";
	return mesh	
    };
    this.createVenusMesh	= function(){
	var geometry	= new THREE.SphereGeometry(0.5, 32, 32)
	var material	= new THREE.MeshPhongMaterial({
	    map	: THREE.ImageUtils.loadTexture(this.baseURL+'media/venusmap.jpg'),
	    bumpMap	: THREE.ImageUtils.loadTexture(this.baseURL+'media/venusbump.jpg'),
	    bumpScale: 0.005,
	})
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="venus";
	return mesh	
    };
    this.createEarthMesh	= function(){
	var geometry	= new THREE.SphereGeometry(0.5, 32, 32)
	var material	= new THREE.MeshPhongMaterial({
	    map		: THREE.ImageUtils.loadTexture(this.baseURL+'media/earthmap1k.jpg'),
	    bumpMap		: THREE.ImageUtils.loadTexture(this.baseURL+'media/earthbump1k.jpg'),
	    bumpScale	: 0.05,
	    specularMap	: THREE.ImageUtils.loadTexture(this.baseURL+'media/earthspec1k.jpg'),
	    specular	: new THREE.Color('grey'),
	})
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="earth";
	return mesh	
    };
    this.createEarthCloudMesh	= function(){
	// create destination canvas
	var canvasResult	= document.createElement('canvas')
	canvasResult.width	= 1024
	canvasResult.height	= 512
	var contextResult	= canvasResult.getContext('2d')		

	// load earthcloudmap
	var imageMap	= new Image();
	imageMap.addEventListener("load", function() {
	    
	    // create dataMap ImageData for earthcloudmap
	    var canvasMap	= document.createElement('canvas')
	    canvasMap.width	= imageMap.width
	    canvasMap.height= imageMap.height
	    var contextMap	= canvasMap.getContext('2d')
	    contextMap.drawImage(imageMap, 0, 0)
	    var dataMap	= contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height)

	    // load earthcloudmaptrans
	    var imageTrans	= new Image();
	    imageTrans.addEventListener("load", function(){
		// create dataTrans ImageData for earthcloudmaptrans
		var canvasTrans		= document.createElement('canvas')
		canvasTrans.width	= imageTrans.width
		canvasTrans.height	= imageTrans.height
		var contextTrans	= canvasTrans.getContext('2d')
		contextTrans.drawImage(imageTrans, 0, 0)
		var dataTrans		= contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height)
		// merge dataMap + dataTrans into dataResult
		var dataResult		= contextMap.createImageData(canvasMap.width, canvasMap.height)
		for(var y = 0, offset = 0; y < imageMap.height; y++){
		    for(var x = 0; x < imageMap.width; x++, offset += 4){
			dataResult.data[offset+0]	= dataMap.data[offset+0]
			dataResult.data[offset+1]	= dataMap.data[offset+1]
			dataResult.data[offset+2]	= dataMap.data[offset+2]
			dataResult.data[offset+3]	= 255 - dataTrans.data[offset+0]
		    }
		}
		// update texture with result
		contextResult.putImageData(dataResult,0,0)	
		material.map.needsUpdate = true;
	    })
	    imageTrans.src	= this.baseURL+'media/earthcloudmaptrans.jpg';
	}, false);
	imageMap.src	= this.baseURL+'media/earthcloudmap.jpg';

	var geometry	= new THREE.SphereGeometry(0.51, 32, 32)
	var material	= new THREE.MeshPhongMaterial({
	    map		: new THREE.Texture(canvasResult),
	    side		: THREE.DoubleSide,
	    transparent	: true,
	    opacity		: 0.8,
	})
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="earthclouds";
	return mesh	
    };
    this.createMoonMesh	= function(){
	var geometry	= new THREE.SphereGeometry(0.5, 32, 32)
	var material	= new THREE.MeshPhongMaterial({
	    map	: THREE.ImageUtils.loadTexture(this.baseURL+'media/moonmap1k.jpg'),
	    bumpMap	: THREE.ImageUtils.loadTexture(this.baseURL+'media/moonbump1k.jpg'),
	    bumpScale: 0.002,
	})
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="moon";
	return mesh	
    };
    this.createMarsMesh	= function(){
	var geometry	= new THREE.SphereGeometry(0.5, 32, 32)
	var material	= new THREE.MeshPhongMaterial({
	    map	: THREE.ImageUtils.loadTexture(this.baseURL+'media/marsmap1k.jpg'),
	    bumpMap	: THREE.ImageUtils.loadTexture(this.baseURL+'media/marsbump1k.jpg'),
	    bumpScale: 0.05,
	})
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="mars";
	return mesh	
    };
    this.createJupiterMesh	= function(){
	var geometry	= new THREE.SphereGeometry(0.5, 32, 32)
	var texture	= THREE.ImageUtils.loadTexture(this.baseURL+'media/jupitermap.jpg')
	var material	= new THREE.MeshPhongMaterial({
	    map	: texture,
	    bumpMap	: texture,
	    bumpScale: 0.02,
	})
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="jupiter";
	return mesh	
    };
    this.createSaturnMesh	= function(){
	var geometry	= new THREE.SphereGeometry(0.5, 32, 32)
	var texture	= THREE.ImageUtils.loadTexture(this.baseURL+'media/saturnmap.jpg')
	var material	= new THREE.MeshPhongMaterial({
	    map	: texture,
	    bumpMap	: texture,
	    bumpScale: 0.05,
	})
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="saturn";
	return mesh	
    };
    this.createSaturnRingMesh	= function(){
	// create destination canvas
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
		material.map.needsUpdate = true;
	    })
	    imageTrans.src	= this.baseURL+'media/saturnringpattern.gif';
	}, false);
	imageMap.src	= this.baseURL+'media/saturnringcolor.jpg';
	
	var geometry	= new this.RingGeometry(0.55, 0.75, 64);
	var material	= new THREE.MeshPhongMaterial({
	    map		: new THREE.Texture(canvasResult),
	    // map		: THREE.ImageUtils.loadTexture(this.baseURL+'media/ash_uvgrid01.jpg'),
	    side		: THREE.DoubleSide,
	    transparent	: true,
	    opacity		: 0.8,
	})
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.lookAt(new THREE.Vector3(0.5,-4,1))
	mesh.name="saturnring";
	return mesh	
    };
    this.createUranusMesh	= function(){
	var geometry	= new THREE.SphereGeometry(0.5, 32, 32)
	var texture	= THREE.ImageUtils.loadTexture(this.baseURL+'media/uranusmap.jpg')
	var material	= new THREE.MeshPhongMaterial({
	    map	: texture,
	    bumpMap	: texture,
	    bumpScale: 0.05,
	})
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="uranus";
	return mesh	
    };
    this.createUranusRingMesh	= function(){
	// create destination canvas
	var canvasResult	= document.createElement('canvas')
	canvasResult.width	= 1024
	canvasResult.height	= 72
	var contextResult	= canvasResult.getContext('2d')	

	// load earthcloudmap
	var imageMap	= new Image();
	imageMap.addEventListener("load", function() {
	    
	    // create dataMap ImageData for earthcloudmap
	    var canvasMap	= document.createElement('canvas')
	    canvasMap.width	= imageMap.width
	    canvasMap.height= imageMap.height
	    var contextMap	= canvasMap.getContext('2d')
	    contextMap.drawImage(imageMap, 0, 0)
	    var dataMap	= contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height)

	    // load earthcloudmaptrans
	    var imageTrans	= new Image();
	    imageTrans.addEventListener("load", function(){
		// create dataTrans ImageData for earthcloudmaptrans
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
			dataResult.data[offset+3]	= 255 - dataTrans.data[offset+0]/2
		    }
		}
		// update texture with result
		contextResult.putImageData(dataResult,0,0)	
		material.map.needsUpdate = true;
	    })
	    imageTrans.src	= this.baseURL+'media/uranusringtrans.gif';
	}, false);
	imageMap.src	= this.baseURL+'media/uranusringcolour.jpg';
	
	var geometry	= new this.RingGeometry(0.55, 0.75, 64);
	var material	= new THREE.MeshPhongMaterial({
	    map		: new THREE.Texture(canvasResult),
	    // map		: THREE.ImageUtils.loadTexture(this.baseURL+'media/ash_uvgrid01.jpg'),
	    side		: THREE.DoubleSide,
	    transparent	: true,
	    opacity		: 0.8,
	})
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.lookAt(new THREE.Vector3(0.5,-4,1))
	mesh.name="uranusring";
	return mesh	
    };
    this.createNeptuneMesh	= function(){
	var geometry	= new THREE.SphereGeometry(0.5, 32, 32)
	var texture	= THREE.ImageUtils.loadTexture(this.baseURL+'media/neptunemap.jpg')
	var material	= new THREE.MeshPhongMaterial({
	    map	: texture,
	    bumpMap	: texture,
	    bumpScale: 0.05,
	})
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="neptune";
	return mesh	
    };
    this.createPlutoMesh	= function(){
	var geometry	= new THREE.SphereGeometry(0.5, 32, 32)
	var material	= new THREE.MeshPhongMaterial({
	    map	: THREE.ImageUtils.loadTexture(this.baseURL+'media/plutomap1k.jpg'),
	    bumpMap	: THREE.ImageUtils.loadTexture(this.baseURL+'media/plutobump1k.jpg'),
	    bumpScale: 0.005,
	})
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="pluto";
	return mesh	
    };
    this.createStarfieldMesh	= function(){
	var texture	= THREE.ImageUtils.loadTexture(this.baseURL+'media/galaxy_starfield.png')
	var material	= new THREE.MeshBasicMaterial({
	    map	: texture,
	    side	: THREE.BackSide
	})
	var geometry	= new THREE.SphereGeometry(100, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.name="stars";
	return mesh	
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
};
export default Planets;
