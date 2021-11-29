import { scaleLinear } from 'd3-scale';
import * as TWEEN from 'es6-tween';

import * as THREE from 'three'
import { PointOfViewControls } from './PointOfViewControls'
//import { DragControls } from 'three/examples/jsm/controls/DragControls'


// import {
// //    MeshStandardMaterial,
// //    Object3D,
//     AmbientLight,
//     DirectionalLight,
//     PointLight,
//     BackSide,
//     BoxGeometry,
//     SphereGeometry,
//     Color,
//     Group,
//     Mesh,
//     MeshBasicMaterial,
//     MeshLambertMaterial,
//     MeshPhongMaterial,
//     PerspectiveCamera,
//     Scene,
//     TextureLoader,
//     Vector3,
//     WebGLRenderer,
// } from 'three';
// import { createGlowMesh } from 'three-glow-mesh';
// //import PointOfViewControls from 'three-pointOfViewcontrols';
// //import { Interaction } from 'three.interaction';

// import {
//     BACKGROUND_RADIUS_SCALE,
//     CAMERA_DAMPING_FACTOR,
//     CAMERA_FAR,
//     CAMERA_FOV,
//     CAMERA_MIN_DISTANCE_RADIUS_SCALE,
//     CAMERA_NEAR,
//     CLOUDS_RADIUS_OFFSET,
//     defaultCameraOptions,
//     defaultFocusOptions,
//     defaultModelOptions,
//     defaultLightOptions,
//     defaultMarkerOptions,
//     MODEL_SEGMENTS,
//     INITIAL_COORDINATES,
//     MARKER_ACTIVE_ANIMATION_DURATION,
//     MARKER_ACTIVE_ANIMATION_EASING_FUNCTION,
//     MARKER_DEFAULT_COLOR,
//     MARKER_SEGMENTS,
//     MARKER_UNIT_RADIUS_SCALE,
//     RADIUS,
// } from './defaults';
// import {
//     //Animation,
//     //Callbacks,
//     //CameraOptions,
//     //Coordinates,
//     //FocusOptions,
//     //ModelOptions,
//     //InteractableObject3D,
//     //InteractableScene,
//     //InteractionEvent,
//     //LightOptions,
//     //Marker,
//     //MarkerOptions,
//     MarkerType,
//     ObjectName,
//     //Optional,
//     //Options,
//     //Position,
//     //Size,
// } from './types';
// import {
//     // coordinatesToPosition,
//     getMarkerCoordinatesKey,
//     maxValue,
//     minValue,
//     tween,
// } from './utils';

const ObjectName={
    "Camera" : "CAMERA",
    "CameraAmbientLight" : "CAMERA_AMBIENT_LIGHT",
    "CameraPointLight" : "CAMERA_POINT_LIGHT",
    "Model" : "MODEL",
    "Sun" : "sun",
    "Mercury" : "mercury",
    "Venus" : "venus",
    "Earth" : "earth",
    "Moon" : "moon",
    "Mars" : "mars",
    "Jupiter" : "jupiter",
    "Saturn" : "saturn",
    "SaturnRing" : "saturnring",
    "Uranus" : "uranus",
    "Neptune" : "neptune",
    "Pluto" : "pluto",
    "ModelBackground" : "MODEL_BACKGROUND",
    "ModelClouds" : "MODEL_CLOUDS",
    "ModelGlow" : "MODEL_GLOW",
    "ModelSphere" : "MODEL_SPHERE",
    "MarkerObjects" : "MARKER_OBJECTS",
    "Scene" : "SCENE"};

const emptyFunction = () => {};

const defaultCallbacks = {
    onClickMarker: emptyFunction,
    onDefocus: emptyFunction,
    onMouseOutMarker: emptyFunction,
    onMouseOverMarker: emptyFunction,
    onTextureLoaded: emptyFunction,
};

const defaultOptions = {
    camera: {
	autoRotateSpeed: 0.1,
	distanceRadiusScale: 3,
	enableAutoRotate: true,
	enableRotate: true,
	enableZoom: true,
	maxDistanceRadiusScale: 4,
	maxPolarAngle: Math.PI,
	minPolarAngle: 0,
	rotateSpeed: 0.2,
	zoomSpeed: 2.5,
    }
};
// utility function
const sceneTraverse = (obj, fn) => {
    if (!obj) return
    fn(obj)
    if (obj.children && obj.children.length > 0) {
	obj.children.forEach(o => {
	    sceneTraverse(o, fn)
	})
    }
}

const cleanScene =  (o) => {
    if (o.geometry) {
        o.geometry.dispose()
        //console.log("dispose geometry ", o.geometry)                        
    }
    if (o.material) {
        if (o.material.length) {
            for (let i = 0; i < o.material.length; ++i) {
                o.material[i].dispose()
                //console.log("dispose material ", o.material[i])                                
            }
        }
        else {
            o.material.dispose()
            //console.log("dispose material ", o.material)                            
        }
    }
};

export default class Model {
    constructor(state, canvas, tooltip) {
	this.state=state;
	this.callbacks = defaultCallbacks;
	// create objects
	this.renderer = new THREE.WebGLRenderer({
	    alpha: true,
	    antialias: true,
	    canvas,
	});

	this.renderer.setClearColor (0x000000, 1);
	this.renderer.shadowMap.enabled=true;
	//this.renderer.shadowMap.type=THREE.BasicShadowMap;
	//this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
	
	// create camera and controls
	// create scenes and add objects (planets, moons etc.)
	this.camera = new THREE.PerspectiveCamera();
	    //45,1,
	//					  state.Planets.bodies.sun.radius*0.00001,
	//					  state.Planets.bodies.sun.radius*5);
	
	this.camera.position.set(state.Planets.bodies.sun.radius*2.0, 0, 0);
	this.camera.up = new THREE.Vector3(0,0,1);

	this.controls = new PointOfViewControls(this.camera, this.renderer.domElement);

	this.controls.rotateSpeed = 1.0;
	this.controls.zoomSpeed = 2.5;
	this.controls.panSpeed = 0.0;
	this.controls.noZoom = false;
	this.controls.noPan = true;
	this.controls.staticMoving = true;
	this.controls.dynamicDampingFactor = 0.3;
	this.controls.keys = [ 65, 83, 68 ];
	
	this.scene = new THREE.Scene();

	//this.test(state);
	
	// var light   = new THREE.DirectionalLight( 0xffffff, 1,100 )
	// light.position.set(0.5*state.Planets.bodies.sun.radius,
	// 		   1*state.Planets.bodies.sun.radius,
	// 		   0.5*state.Planets.bodies.sun.radius);
	// light.castShadow            = true;
	// this.scene.add(light);
	// light.shadow.mapSize.width  = 1024; //512; // default
	// light.shadow.mapSize.height = 1024; //512; // default
	// light.shadow.camera.near    = 0.0 * state.Planets.bodies.sun.radius;
	// light.shadow.camera.far     = 3.0 * state.Planets.bodies.sun.radius;
	//const model = new THREE.Group();
	//this.scene.add(state.Planets.createSaturnMesh());
	//this.scene.add(state.Planets.createSaturnRingMesh(THREE.FrontSide));
	//this.scene.add(state.Planets.createSaturnRingMesh(THREE.BackSide));
	//this.scene.add(state.Planets.createDeathStarMesh());


	//this.scene=state.Planets.createSunScene(this.camera);
	//this.scene=state.Planets.createMercuryScene(this.camera);
	//this.scene=state.Planets.createVenusScene(this.camera);
	//this.scene=state.Planets.createEarthScene(this.camera);
	//this.scene=state.Planets.createMarsScene(this.camera);
	//this.scene=state.Planets.createJupiterScene(this.camera);
	//this.scene=state.Planets.createSaturnScene(this.camera);
	this.scene=state.Planets.createUranusScene(this.camera);
	//this.scene=state.Planets.createNeptuneScene(this.camera);
	//this.scene=state.Planets.createPlutoScene(this.camera);
	state.Planets.setPosition(this.scene,"deathstar",
				  20000*state.Planets.SCALE,
				  state.Planets.bodies.saturn.radius*1.01,
				  10000*state.Planets.SCALE);//
	state.Planets.setPosition(this.scene,"moon",
				  20000*state.Planets.SCALE,
				  state.Planets.bodies.saturn.radius*1.01,
				  10000*state.Planets.SCALE);//
	//this.scene.add(state.Planets.createLight());

	//Create a plane that receives shadows (but does not cast them)
	const planeGeometry = new THREE.PlaneGeometry( 2*state.Planets.bodies.sun.radius, 
						       2*state.Planets.bodies.sun.radius, 
						       32, 
						       32);
	const planeMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 } )
	const plane = new THREE.Mesh( planeGeometry, planeMaterial );
	plane.position.set(0,-1*state.Planets.bodies.sun.radius,0);
	plane.lookAt(0,1,0);
	plane.receiveShadow = true;
	this.scene.add(plane)
	//const helper = new THREE.CameraHelper( light.shadow.camera );
	//this.scene.add( helper );

	// //this.scene.add(new THREE.AmbientLight('white'));
	// //this.scene.add(model);
	// this.scene.add(this.camera);
	
	// this.scene.display=0;
	// this.scene.axis=0;

	// //console.log(this.scene);

	// this.camera.up = new THREE.Vector3(0,0,1);
	// this.camera.lookAt(new THREE.Vector3(0,0,0));

	// // const cameraAmbientLight = new AmbientLight('white');
	// // const cameraPointLight = new PointLight('white');
	// // const model = new Group();
	// // const modelBackground = new Mesh();
	// // const modelClouds = new Mesh();
	// // const modelSphere = new Mesh();
	// // const markerObjects = new Group();
	// // const pointOfViewControls = new PointOfViewControls(camera, this.renderer.domElement);

	// // pointOfViewControls.rotateSpeed = 1.0;
	// // pointOfViewControls.zoomSpeed = 2.5;
	// // pointOfViewControls.panSpeed = 0.0;
	
	// // pointOfViewControls.noZoom = false;
	// // pointOfViewControls.noPan = true;
	
	// // pointOfViewControls.staticMoving = true;
	// // pointOfViewControls.dynamicDampingFactor = 0.3;
	

	// // const scene =  new Scene();
	// // scene.add( new THREE.AxesHelper() );

	// // // name objects
 	// // this.camera.name = ObjectName.Camera;
 	// // cameraAmbientLight.name = ObjectName.CameraAmbientLight;
 	// // cameraPointLight.name = ObjectName.CameraPointLight;
	// // model.name = ObjectName.Model;
	// // modelBackground.name = ObjectName.ModelBackground;
	// // modelClouds.name = ObjectName.ModelClouds;
	// // modelSphere.name = ObjectName.ModelSphere;
	// // markerObjects.name = ObjectName.MarkerObjects;
	// // scene.name = ObjectName.Scene;

	// // // add objects to scene
 	// // this.camera.add(cameraAmbientLight);
 	// // this.camera.add(cameraPointLight);
 	// // model.add(modelBackground);
 	// // model.add(modelClouds);
 	// // model.add(modelSphere);
	// // scene.add(markerObjects);
	// // scene.add(camera);
 	// // this.scene.add(model);

	// // add interactions to scene
	// //this.interactions=new Interaction(this.renderer, this.scene, this.camera);
	// // this.scene.on('mousemove', function(event){
    	// //     if (this.isFocusing()) {
	// // 	return;
      	// //     }
	// //     if (this.activeMarker) {
	// // 	const { activeScale } = this.options.marker;
	// // 	const from = [activeScale, activeScale, activeScale];
	// // 	this.tween(
	// // 	    from,
	// // 	    [1, 1, 1],
	// // 	    100,
	// // 	    [ 'Cubic',  'In', ],
	// // 	    () => {
	// // 		if (this.activeMarkerObject) {
	// // 		    this.activeMarkerObject.scale.set(...from);
	// // 		}
	// // 	    },
	// // 	    () => {
	// // 		this.activeMarker = undefined;
	// // 		this.activeMarkerObject = undefined;
	// // 	    },
	// // 	);
	// // 	this.callbacks.onMouseOutMarker(
	// // 	    this.activeMarker,
	// // 	    this.activeMarkerObject,
	// // 	    event.data.originalEvent,
	// // 	);
	// // 	//this.tooltip.hide(); // the tooltip hides itself...
	// //     }
	// // }.bind(this));
	// // this.scene.on('click', (event) => {
	// //     if (this.isFocusing()) {
	// // 	return;
	// //     }
	// //     if (this.options.focus.enableDefocus && this.preFocusPosition) {
	// // 	this.callbacks.onDefocus(this.focus, event.data.originalEvent);
	// // 	this.updateFocus(undefined, this.options.focus);
	// //     }
	// // });
	// assign values to class variables
	// this.state=state;
	// this.callbacks = defaultCallbacks;
	// this.activeMarker = undefined;
	// this.activeMarkerObject = undefined;
	// this.animationFrameId = undefined;
	// this.camera = camera;
	// this.focus = undefined;
	// this.model = model;
	// this.isFrozen = false;
	// this.markerObjects = markerObjects;
	// this.options = defaultOptions;
	// this.controls = pointOfViewControls;
	// this.preFocusPosition = undefined;
	// this.renderer = renderer;
	// this.interactions = interactions;
	// this.scene = scene;
	// this.tooltip = tooltip;

	// // update objects
	// this.updateCallbacks(state);
	// this.updateCamera(state);
	// this.updateFocus(state);
	// this.updateModel({
	//     enableBackground: false,
	//     enableClouds: false,
	// });
	// //this.updateLights(state);
	// //this.updateMarkers(state);
	// //this.updateSize();
    }

    test(state) {

	this.camera.position.set(20, 0, 0);
	this.renderer.shadowMap.enabled = true;
	this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
	
	//Create a DirectionalLight and turn on shadows for the light
	const light = new THREE.DirectionalLight( 0xffffff, 1, 100 );
	light.position.set( 0, 1, 0 ); //default; light shining from top
	light.castShadow = true; // default false
	this.scene.add( light );
	
	//Set up shadow properties for the light
	light.shadow.mapSize.width = 512; // default
	light.shadow.mapSize.height = 512; // default
	light.shadow.camera.near = 0.5; // default
	light.shadow.camera.far = 500; // default
	
	//Create a sphere that cast shadows (but does not receive them)
	const sphereGeometry = new THREE.SphereGeometry( 5, 32, 32 );
	const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
	const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
	sphere.castShadow = true; //default is false
	sphere.receiveShadow = false; //default
	this.scene.add( sphere );
	
	//Create a plane that receives shadows (but does not cast them)
	const planeGeometry = new THREE.PlaneGeometry( 20, 20, 32, 32 );
	const planeMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 } )
	const plane = new THREE.Mesh( planeGeometry, planeMaterial );
	plane.position.set(0,-10,0);
	plane.lookAt(0,1,0);
	plane.receiveShadow = true;
	this.scene.add( plane );
	
	//Create a helper for the shadow camera (optional)
	const helper = new THREE.CameraHelper( light.shadow.camera );
	this.scene.add( helper );
    };

    createScenes(state,camera) {
	//scene.getObjectByName( "light" );
	var scenes={};
	scenes["sun"]     = state.Planets.createSunScene(camera);
	scenes["mercuy"]  = state.Planets.createMercuryScene(camera);
	scenes["venus"]   = state.Planets.createVenusScene(camera);
	scenes["earth"]   = state.Planets.createEarthScene(camera);
	scenes["mars"]    = state.Planets.createMarsScene(camera);
	scenes["jupiter"] = state.Planets.createJupiterScene(camera);
	scenes["saturn"]  = state.Planets.createSaturnScene(camera);
	scenes["uranus"]  = state.Planets.createUranusScene(camera);
	scenes["neptune"] = state.Planets.createNeptuneScene(camera);
	scenes["pluto"]   = state.Planets.createPlutoScene(camera);
	return scenes;
    };

    cleanMarker(markerObject) {
	markerObject.on('click', null );
	markerObject.on('touchstart', null );
	markerObject.on('mousemove', null );
	markerObject.geometry.dispose();
	markerObject.material.dispose();
	markerObject.children.forEach(companion => {
	    markerObject.remove(companion);
	    companion.geometry.dispose();
	    companion.material.dispose();
	});
    }

    destroy() {
	//console.log("Destroying Model...");
	cancelAnimationFrame(this.animationFrameId);
	//this.tooltip.destroy();
	//this.tooltip=null;
	// dispose model, clouds and background...
	const modelBackground = this.getObjectByName(ObjectName.ModelBackground);
	//const modelClouds = this.getObjectByName(ObjectName.ModelClouds);
	const modelSphere = this.getObjectByName(ObjectName.ModelSphere);
	this.model.remove(modelBackground);
	//this.model.remove(modelClouds);
	this.model.remove(modelSphere);
	this.scene.remove(this.model);
	modelBackground.geometry.dispose();
	modelBackground.material.dispose();
	//modelClouds.geometry.dispose();
	//modelClouds.material.dispose();
	modelSphere.geometry.dispose();
	modelSphere.material.dispose();
	// dispose markers
	this.markerObjects.children.forEach(markerObject => {
	    this.markerObjects.remove(markerObject);
	    this.cleanMarker(markerObject);
	});
	//this.interactions.removeAllListeners= this.interactions.removeEvents;
	//this.interactions.destroy();
	//this.interactions.on('addevents',null);this.interactions.on('removeevents',null);this.interactions.setTargetElement(null);
	//this.interactions=null;
	this.scene.remove(this.markerObjects);
	this.markerObjects=null;
	// clean up...
	this.scene.on('mousemove', null);
	this.scene.on('click', null );
	sceneTraverse(this.scene, cleanScene);
	this.scene.dispose();
	this.scene=null;
	this.renderer && this.renderer.renderLists.dispose();
	this.renderer.dispose();
	this.renderer=null;
	this.controls.dispose();
	this.controls=null;
	this.preFocusPosition = null;;
	this.camera.children.forEach(object => {
	    this.camera.remove(object);
	});
	this.camera=null;
    }

    animate() { // ReactModel starts the animation loop...
	this.render();
	this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    }

    render() {
	//console.log("Rendering...");
	this.renderer.sortObjects = false;
	this.renderer.render(this.scene, this.camera);

	//console.log("texture:",this.scene);

	//this.renderClouds();
	this.controls.update();
	TWEEN.update();
    }

    // TODO: expose a way to customize animating clouds in every axis
    renderClouds() {
	//const modelClouds = this.getObjectByName(ObjectName.ModelClouds);
	//['x', 'y', 'z'].forEach(axis => {
	//    modelClouds.rotation[axis] += Math.random() / 10000;
	//});
    }

    // For each animation, update the focus and focusOptions provided by the animation over an array of timeouts
    applyAnimations(animations) {
	const currentFocus = this.focus;
	const currentFocusOptions = this.options.focus;

	let wait = 0;
	const timeouts = [];
	animations.forEach(animation => {
	    const {
		animationDuration,
		coordinates,
		distanceRadiusScale,
		easingFunction,
	    } = animation;
	    const timeout = setTimeout(() => {
		this.updateFocus(
		    coordinates,
		    {
			animationDuration,
			distanceRadiusScale,
			easingFunction,
		    },
		    true,
		);
	    }, wait);
	    timeouts.push(timeout);
	    wait += animationDuration;
	});

	// return cleanup function
	return () => {
	    timeouts.forEach(timeout => {
		clearTimeout(timeout);
	    });
	    this.updateFocus(currentFocus, currentFocusOptions);
	};
    }

    enablePointOfViewControls(enabled, autoRotate = enabled) {
	this.controls.enabled = enabled;
	this.controls.autoRotate = autoRotate;
    }

    freeze() {
	this.isFrozen = true;
	this.enablePointOfViewControls(false);
	cancelAnimationFrame(this.animationFrameId);
    }

    getObjectByName(name) {
	return this.scene.getObjectByName(name);
    }

    isFocusing() {
	return !this.controls.enabled;
    }

    updateCallbacks(callbacks = {}) {
	Object.keys(defaultCallbacks).forEach(key => {
	    this.callbacks[key] = callbacks[key] || defaultCallbacks[key];
	});
    };

    updateCamera(state,
	initialCoordinates =  [37.773972, -122.431297],
	cameraOptions = {},
    ) {
	this.updateOptions(cameraOptions, 'camera');
	const {
	    autoRotateSpeed,
	    distanceRadiusScale,
	    enableAutoRotate,
	    enableRotate,
	    enableZoom,
	    maxDistanceRadiusScale,
	    maxPolarAngle,
	    minPolarAngle,
	    rotateSpeed,
	    zoomSpeed,
	} = this.options.camera;

	if (this.initialCoordinates !== initialCoordinates) {
	    // const [x, y, z] = coordinatesToPosition(
	    // 	initialCoordinates,
	    // 	RADIUS * distanceRadiusScale,
	    // );
	    //this.camera.position.set(x, y, z);
	    this.initialCoordinates = initialCoordinates;
	};
	this.camera.far = this.state.Planets.bodies.stars.radius;
	this.camera.fov = 45;
	this.camera.near = 1;
	this.controls.autoRotate = enableAutoRotate;
	this.controls.autoRotateSpeed = autoRotateSpeed;
	this.controls.dampingFactor = 0.1;
	this.controls.enableDamping = true;
	this.controls.enablePan = false;
	this.controls.enableRotate = enableRotate;
	this.controls.enableZoom = enableZoom;
	//this.controls.maxDistance = RADIUS * maxDistanceRadiusScale;
	this.controls.maxPolarAngle = maxPolarAngle;
	//this.controls.minDistance = RADIUS * CAMERA_MIN_DISTANCE_RADIUS_SCALE;
	this.controls.minPolarAngle = minPolarAngle;
	this.controls.rotateSpeed = rotateSpeed;
	this.controls.zoomSpeed = zoomSpeed;
    }

    updateFocus(
	focus,
	focusOptions = {},
	autoDefocus = false,
    ) {
	this.updateOptions(focusOptions, 'focus');
	this.focus = focus;
	
	const animationDuration=100;
	const distanceRadiusScale=3;
	const easingFunction=['Cubic', 'Out'];

	if (this.isFrozen) {
	    return;
	}

	if (this.focus) {
	    // disable pointOfView controls when focused
	    const from = [
		this.camera.position.x,
		this.camera.position.y,
		this.camera.position.z,
	    ];
	    const to = [0,0,0];//coordinatesToPosition(
	    // 	this.focus,
	    // 	RADIUS * distanceRadiusScale,
	    // );
	    this.preFocusPosition = this.preFocusPosition || ([...from]);
	    this.tween(
		from,
		to,
		animationDuration,
		easingFunction,
		() => {
		    this.enablePointOfViewControls(false);
		    this.camera.position.set(...from);
		},
		() => {
		    if (autoDefocus) {
			this.focus = undefined;
			this.preFocusPosition = undefined;
		    }
		    this.enablePointOfViewControls(true, autoDefocus);
		},
	    );
	} else {
	    if (this.preFocusPosition) {
		const from = [
		    this.camera.position.x,
		    this.camera.position.y,
		    this.camera.position.z,
		];
		const to = this.preFocusPosition;
		this.tween(
		    from,
		    to,
		    animationDuration,
		    easingFunction,
		    () => {
			this.enablePointOfViewControls(false);
			this.camera.position.set(...from);
		    },
		    () => {
			this.preFocusPosition = undefined;
			this.enablePointOfViewControls(true);
		    },
		);
	    }
	}
    }

    updateModel(modelOptions = {}) {
	this.updateOptions(modelOptions, 'model');
	// const {
	//     backgroundTexture,
	//     cloudsOpacity,
	//     cloudsTexture,
	//     enableBackground,
	//     enableClouds,
	//     enableGlow,
	//     glowColor,
	//     glowCoefficient,
	//     glowPower,
	//     glowRadiusScale,
	//     bumpMap,
	//     texture,
	// } = this.options.model;

	// const modelBackground = this.getObjectByName(
	//     ObjectName.ModelBackground,
	// );
	// //const modelClouds = this.getObjectByName(ObjectName.ModelClouds);
	// const modelSphere = this.getObjectByName(ObjectName.ModelSphere);

	// new TextureLoader().load(texture, map => {
	//     console.log("Loaded texture:",texture);
	//     new TextureLoader().load(bumpMap, bump => {
	// 	console.log("Loaded bumpMap:",bumpMap);
	// 	modelSphere.material = new MeshPhongMaterial({
	// 	    map:map,
	// 	    bumpMap:bump,   
	// 	    bumpScale:5.0,
	// 	}); //map,

	// 	modelSphere.geometry = new SphereGeometry(
	// 	    RADIUS,
	// 	    MODEL_SEGMENTS,
	// 	    MODEL_SEGMENTS,
	// 	);
	// 	//modelSphere.material = new MeshLambertMaterial({
	// 	if (enableGlow) {
	// 	    if (this.getObjectByName(ObjectName.ModelGlow) !== undefined) {
	// 		modelSphere.remove(this.getObjectByName(ObjectName.ModelGlow));
	// 	    };
	// 	    const modelGlow = createGlowMesh(modelSphere.geometry, {
	// 		backside: true,
	// 		color: glowColor,
	// 		coefficient: glowCoefficient,
	// 		power: glowPower,
	// 		size: RADIUS * glowRadiusScale,
	// 	    });
	// 	    modelGlow.name = ObjectName.ModelGlow;
	// 	    modelSphere.add(modelGlow);
	// 	};
	// 	this.callbacks.onTextureLoaded();
	//     });
	// },undefined,(err) => {console.error('Error gl-texture: ',texture,err);});

	// if (enableBackground) {
	//     new TextureLoader().load(backgroundTexture,map => {
	// 	modelBackground.geometry = new SphereGeometry(
	// 	    RADIUS * BACKGROUND_RADIUS_SCALE,
	// 	    MODEL_SEGMENTS,
	// 	    MODEL_SEGMENTS,
	// 	);
	// 	modelBackground.material = new MeshBasicMaterial({
	// 	    map,
	// 	    side: BackSide,
	// 	});
	//     },undefined,(err) => {console.error('Error bg-texture: ',backgroundTexture,err);});
	// }
	// if (enableClouds) {
        //     console.log("Loading cl texture:",cloudsTexture);
	//     new TextureLoader().load(cloudsTexture, map => {
	// 	modelClouds.geometry = new SphereGeometry(
	// 	    RADIUS + CLOUDS_RADIUS_OFFSET,
	// 	    MODEL_SEGMENTS,
	// 	    MODEL_SEGMENTS,
	// 	);
	// 	modelClouds.material = new MeshLambertMaterial({
	// 	    map,
	// 	    transparent: true,
	// 	});
	// 	modelClouds.material.opacity = cloudsOpacity;
	//     },undefined,(err) => {console.error('Error cl-texture: ',cloudsTexture,err);});
	// }
    }

    updateLights(lightOptions = {}) {
	this.updateOptions(lightOptions, 'light');
	// const {
	//     ambientLightColor,
	//     ambientLightIntensity,
	//     pointLightColor,
	//     pointLightIntensity,
	//     pointLightPositionRadiusScales,
	// } = this.options.light;

	// const cameraAmbientLight = this.getObjectByName(
	//     ObjectName.CameraAmbientLight,
	// );
	// const cameraPointLight = this.getObjectByName(
	//     ObjectName.CameraPointLight,
	// );

	// cameraAmbientLight.color = new Color(ambientLightColor);
	// cameraAmbientLight.intensity = ambientLightIntensity;
	// cameraPointLight.color = new Color(pointLightColor);
	// cameraPointLight.intensity = pointLightIntensity;
	// cameraPointLight.position.set(
	//     RADIUS * pointLightPositionRadiusScales[0],
	//     RADIUS * pointLightPositionRadiusScales[1],
	//     RADIUS * pointLightPositionRadiusScales[2],
	// );
    }

    updateMarkers(
	markers = [],
	markerOptions = {},
    ) {
	this.updateOptions(markerOptions, 'marker');
	// const {
	//     activeScale,
	//     enableGlow,
	//     enableTooltip,
	//     enterAnimationDuration,
	//     enterEasingFunction,
	//     exitAnimationDuration,
	//     exitEasingFunction,
	//     glowCoefficient,
	//     glowPower,
	//     glowRadiusScale,
	//     offsetRadiusScale,
	//     radiusScaleRange,
	//     renderer,
	//     type,
	// } = this.options.marker;

	// const unitRadius = RADIUS * MARKER_UNIT_RADIUS_SCALE;
	// const sizeScale = scaleLinear()
	//       .domain([
	// 	  minValue(markers, marker => marker.value),
	// 	  maxValue(markers, marker => marker.value),
	//       ])
	//       .range([RADIUS * radiusScaleRange[0], RADIUS * radiusScaleRange[1]]);

	// const markerCoordinatesKeys = new Set(markers.map(getMarkerCoordinatesKey));
	// const markerObjectNames = new Set(
	//     this.markerObjects.children.map(markerObject => markerObject.name),
	// );

	// markers.forEach(marker => {
	//     const { coordinates, value } = marker;
	//     const markerCoordinatesKey = getMarkerCoordinatesKey(marker);
	//     const size = sizeScale(value);

	//     let markerObject;
	//     // create new marker objects
	//     if (!markerObjectNames.has(markerCoordinatesKey)) {
	// 	if (renderer !== undefined) {
	// 	    markerObject = renderer(marker);
	// 	} else {
	// 	    const color = marker.color || MARKER_DEFAULT_COLOR;
	// 	    const from = { size: 0 };
	// 	    const to = { size };
	// 	    const mesh = new Mesh();
	// 	    this.tween(from, to, enterAnimationDuration, enterEasingFunction, () => {
	// 		switch (type) {
	// 		case MarkerType.Bar:
	// 		    mesh.geometry = new BoxGeometry(
	// 			unitRadius,
	// 			unitRadius,
	// 			from.size,
	// 		    );
	// 		    mesh.material = new MeshLambertMaterial({
	// 			color,
	// 		    });
	// 		    break;
	// 		case MarkerType.Dot:
	// 		default:
	// 		    mesh.geometry = new SphereGeometry(
	// 			from.size,
	// 			MARKER_SEGMENTS,
	// 			MARKER_SEGMENTS,
	// 		    );
	// 		    mesh.material = new MeshBasicMaterial({ color });
	// 		    if (enableGlow) {
	// 			// add glow
	// 			const glowMesh = createGlowMesh(
	// 			    mesh.geometry.clone(),
	// 			    {
	// 				backside: false,
	// 				color,
	// 				coefficient: glowCoefficient,
	// 				power: glowPower,
	// 				size: from.size * glowRadiusScale,
	// 			    },
	// 			);
	// 			mesh.children = [];
	// 			mesh.add(glowMesh);
	// 		    }
	// 		}
	// 	    });
	// 	    markerObject = mesh;
	// 	}

	// 	// place markers
	// 	let heightOffset = 0;
	// 	if (offsetRadiusScale !== undefined) {
	// 	    heightOffset = RADIUS * offsetRadiusScale;
	// 	} else {
	// 	    if (type === MarkerType.Dot) {
	// 		heightOffset = (size * (1 + glowRadiusScale)) / 2;
	// 	    } else {
	// 		heightOffset = 0;
	// 	    }
	// 	}
	// 	const position = coordinatesToPosition(
	// 	    coordinates,
	// 	    RADIUS + heightOffset,
	// 	);
	// 	markerObject.position.set(...position);
	// 	markerObject.lookAt(new Vector3(0, 0, 0));

	// 	markerObject.name = markerCoordinatesKey;
	// 	this.markerObjects.add(markerObject);
	//     }

	//     // update existing marker objects
	//     markerObject = this.markerObjects.getObjectByName(markerCoordinatesKey);
	//     const handleClick = (event) => {
	// 	event.stopPropagation();
	// 	this.updateFocus(marker.coordinates);
	// 	this.callbacks.onClickMarker(
	// 	    marker,
	// 	    markerObject,
	// 	    event.data.originalEvent,
	// 	);
	//     };

	//     markerObject.on('click', handleClick.bind(this));
	//     markerObject.on('touchstart', handleClick.bind(this));
	//     markerObject.on('mousemove', event => {
	// 	if (this.isFocusing()) {
	// 	    this.tooltip.hide();
	// 	    return;
	// 	}
	// 	const { originalEvent } = event.data;
	// 	if (enableTooltip) {
	// 	    //console.log("Marker:",JSON.stringify(marker.id));
	// 	    this.tooltip.show(
	// 		originalEvent.clientX,
	// 		originalEvent.clientY,
	// 		marker
	// 	    );
	// 	}
	// 	if (true) { return;};
	// 	event.stopPropagation();
	// 	const from = markerObject.scale.toArray();
	// 	this.tween(
	// 	    from,
	// 	    [activeScale, activeScale, activeScale],
	// 	    MARKER_ACTIVE_ANIMATION_DURATION,
	// 	    MARKER_ACTIVE_ANIMATION_EASING_FUNCTION,
	// 	    () => {
	// 		if (markerObject) {
	// 		    markerObject.scale.set(...from);
	// 		}
	// 	    },
	// 	);
	// 	this.activeMarker = marker;
	// 	this.activeMarkerObject = markerObject;
	// 	this.callbacks.onMouseOverMarker(marker, markerObject, originalEvent);
	//     });
	// });

	// // remove marker objects that are stale
	// const markerObjectsToRemove = this.markerObjects.children.filter(
	//     markerObject => !markerCoordinatesKeys.has(markerObject.name),
	// );
	// markerObjectsToRemove.forEach(markerObject => {
	//     const from = markerObject.scale.toArray();
	//     this.tween(
	// 	from,
	// 	[0, 0, 0],
	// 	exitAnimationDuration,
	// 	exitEasingFunction,
	// 	() => {
	// 	    if (markerObject) {
	// 		markerObject.scale.set(...from);
	// 	    }
	// 	},
	// 	() => {
	// 	    this.markerObjects.remove(markerObject);
	// 	    this.cleanMarker(markerObject);
	// 	},
	//     );
	// });
    }

    updateOptions(options, key) {
	this.options = {
	    ...defaultOptions,
	    [key]: {
		...defaultOptions[key],
		...options,
	    },
	};
    }

    updateSize(size) {
	if (size) {
	    const [width, height] = size;
	    this.renderer.setSize(width, height);
	    this.camera.aspect = width / height;
	}
	this.camera.updateProjectionMatrix();
    };

    unfreeze() {
	if (this.isFrozen) {
	    this.isFrozen = false;
	    this.enablePointOfViewControls(true);
	    this.animate();
	}
    };

    tween(from, to, animationDuration, easingFunction, onUpdate, onEnd) {
	new TWEEN.Tween(from)
            .to(to, animationDuration)
            .easing(TWEEN.Easing[easingFunction[0]][easingFunction[1]])
            .on('update', onUpdate)
            .on('complete', onEnd)
            .start();
    }


}
// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 30);
        };
})();
