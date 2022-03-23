//import { scaleLinear } from 'd3-scale';
import * as TWEEN from 'es6-tween';
import Bodies from "./Bodies";
import Backdrop from "./Backdrop";
//import TextSprite from "./TextSprite";
//import { SpriteText2D, textAlign } from 'three-text2d'

import * as THREE from 'three'
import * as UTILS from './utils';
import { PointOfViewControls } from './PointOfViewControls'

const defaultCallbacks = {
    onTextureLoaded: ()=>{},
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

// model handles all graphics related to model, Model data is updated using ModelLib
export default class Model {
    constructor(state, canvas) {
	this.state=state;
	this.callbacks = defaultCallbacks;
	this.init(state,canvas);
	this.state.React.Model=this;
    }
    toggleNavigation() {};   // show backdrop grid?
    toggleInformation() {};  // show information?
    toggleSnap() {};         // snap to body?
    toggleConstellations() {}; // show constellation names and lines?
    moveFocusTo(name) {};
    moveTimeTo(dtg) {};
    
    init(state,canvas) {
	state.React.Model=this;
	this.near=1;
	this.far=10e9;
	this.Bodies=new Bodies();
	this.Backdrop=new Backdrop();
	this.Bodies.init(state);
	this.Backdrop.init(state);
	this.initRenderer(state,canvas);
	this.initCamera(state)
	this.initControls(state);
	this.initRaycaster(state);
	this.initScene(state);
	console.log("Initialised");
    };

    initScene(state) {
	this.scene = new THREE.Scene();
	this.Backdrop.initScenes(this.mainCamera);
	this.Bodies.initScenes(this.mainCamera);
	// console.log("*** Scenes:",JSON.stringify(Object.keys(this.scenes.bodies)));
    };
    
    initRenderer(state,canvas) {
	this.renderer = new THREE.WebGLRenderer({
	    //sortObjects: false,
	    alpha: true,
	    antialias: true,
	    canvas:canvas,
	});
	this.renderer.setClearColor (0x000000, 1); // black background
	this.renderer.shadowMap.enabled=true;
	//this.renderer.shadowMap.type=THREE.BasicShadowMap;
	this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    };	


    initCamera(state) {
	this.mainCamera = new THREE.PerspectiveCamera(45,undefined,this.near,this.far);
	this.mainCamera.name="camera";
	this.mainCamera.position.set(0,0,0);
	this.mainCamera.up.set(0,0,1);
	console.log("Camera--",this.mainCamera);
	//this.mainCamera.target.set(0,0,1);
	//this.mainCamera.updateMatrixWorld();//true
	//this.mainCamera.updateProjectionMatrix();
	//var vector = new THREE.Vector3(0, 0, -1);
        //vector.applyEuler(this.mainCamera.rotation, this.mainCamera.eulerOrder);
	//console.log("Camera posit:",this.mainCamera.position,this.mainCamera.target);
	//console.log("Camera point:",vector,this.mainCamera.rotation,this.mainCamera.eulerOrder);
    };	
    
    initControls(state) {
	this.controls = new PointOfViewControls(this.mainCamera, this.renderer.domElement, this);
	this.controls.rotateSpeed = 1.0;
	this.controls.zoomSpeed = 2.5;
	this.controls.panSpeed = 0.0;
	this.controls.noZoom = false;
	this.controls.noPan = true;
	this.controls.staticMoving = true;
	this.controls.dynamicDampingFactor = 0.3;
	this.controls.keys = [ 65, 83, 68 ];
	// set a target (different from default zero, which is the camera location)
	this.controls.target.set(1,0,0);
	this.controls.update();
    };

    initRaycaster(state) {
	this.raycaster = new THREE.Raycaster();
	this.mouse=new THREE.Vector2();
	window.addEventListener( 'mousemove', function(event){
	    event.preventDefault();
	    this.mouse.setX(-1+(2*event.clientX/window.innerWidth));
	    this.mouse.setY(+1-(2*event.clientY/window.innerHeight));
	}.bind(this), false );
    };	

    // *****************************************    
    // ************* ANIMATION *****************    
    // *****************************************    
    animate(time) { // ReactModel starts the animation loop...
	//console.log(time);
	this.render(time);
	this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    }

    render(time) {
	//console.log("Rendering...");
	this.renderer.sortObjects = false;
	// process controls (point camera)
	this.controls.update(time);
	this.updateModel(time);
	this.renderInitial(time);
	this.renderBackdrop(time);
	this.renderBodies(time);
	//TWEEN.update();
    }

    updateModel(time) {
	// update the information sprite...

	// update model config
	var config=this.state.Model.getCurrentConfig(this.state);
	this.updateConfig(this.state,config,time);

	//check if we have a new config...
	this.updateTarget(this.state,config,time);

	// update main camera position (to observer)...
	this.updateMainCamera(this.state,time);

	// update scenes
	this.updateScenes(this.state,this.mainCamera,time);

	// update the control-target
	this.controls.setReference(this.Bodies.getTarget());
    };

    updateRaycaster (state) {
	var objects=[];
	this.Bodies.updateRaycaster(state,this.raycaster,this.mouse,this.mainCamera,objects);
	this.Backdrop.updateRaycaster(state,this.raycaster,this.mouse,this.mainCamera,objects);
	//console.log("Ray:",this.mouse,objects);
	return objects;
    };

    onMouseUp(event) { // called by pointController...
	// get objects that were pointed to...
	let objects=this.updateRaycaster(this.state);
	//// find target object, target star
	//// point camera towards target
	//// update target information...
    }	

    onMouseDown(event) { // called by pointController...
	// console.log("Mouse down:",event);
    }	

    updateConfig (state,config) {
	//console.log("Updating config",config);
	this.Bodies.updateConfig(state,config);
    };

    updateScenes (state,camera,time) {
	//console.log("UpdateScenes...");
	// update Backdrop
	var observer=this.Bodies.config.observer;
	this.Backdrop.updateScenes(state,camera,observer,this.Bodies.config,time);
	this.Bodies.updateScenes(state,camera,observer,time);
    };
    setNewTarget(state,x,y,z) {
	this.newTarget=new THREE.Vector3(x,y,z);
    };
    updateMainCamera(state) {
	//console.log("Zenith:",this.Bodies.config.observer.zenith);
	let pos=this.Bodies.config.observer.position;
	let zen=this.Bodies.config.observer.zenith;
	//this.mainCamera.position.set(pos.x,pos.y,pos.z);
	this.mainCamera.position.set(0,0,0);
	//console.log("Up:",zen.x,zen.y,zen.z);
	this.mainCamera.up.set(zen.x,zen.y,zen.z); // up is always towards observer zenith...
	if (this.newTarget !== undefined) {
	     //this.mainCamera.pointAt(this.newTarget); // point to new target...
	     this.newTarget=undefined;
	};
	//this.mainCamera.updateMatrixWorld(true);
	//this.mainCamera.updateProjectionMatrix();
    }

    updateTarget(state) {
	// when we have a new target, update the camera point target
	if (state.Model.config.newTarget) {
	    state.Model.config.newTarget=false;
	    var requests=state.Model.requests;
	    var reqId = requests.current;
	    var req = requests.state[reqId]
	    if (false && req.play.event !== undefined) {
		this.mainCamera.position.set(state.Model.config.state[state.Model.config.current].observer.position);
		let zen=state.Model.config.state[state.Model.config.current].observer.zenith;
		this.mainCamera.up.set(zen.x,zen.y,zen.z); // up is always towards observer zenith...
		var target = requests.state[reqId]["events"][req.play.event]["target"]; // target could be mis-spelled...
		var dir = requests.state[reqId]["events"][req.play.event]["dir"];
		var fov = requests.state[reqId]["events"][req.play.event]["fov"];
		var con = requests.state[reqId]["events"][req.play.event]["con"];
		var configBodies=state.Model.config.state[state.Model.config.current].bodies;
		if (target !== undefined && configBodies[target] !== undefined) {
		    this.mainCamera.pointAt(configBodies[target].position);
		} else if (dir !== undefined) {
		    this.mainCamera.pointDir(dir);
		};
		if (fov !== undefined) {
		    this.mainCamera.setFov(fov);
		};
		if (con !== undefined) {
		    if (con === 0) { // no constellations
			state.Model.consTime=new Date().getTime()-1000.0; // no fade
		    } else {
			state.Model.consTime=new Date().getTime()+2000.0; // fade inn
		    };
		    state.Model.consReq = con;
		};
	    }
	};
    };	

    renderInitial(time) {
	this.renderer.autoClear = true;  // clear canvas completely
	this.renderer.render(this.scene, this.mainCamera);
	this.renderer.autoClear = false; // draw on top of previous drawing
	//console.log("Camera:",this.mainCamera);
    };

    renderBackdrop(time) {
	this.renderer.clearDepth();      // clear depth buffer...
	this.Backdrop.renderScenes(this.renderer,this.mainCamera,time);
    };

    renderBodies(time) {
	this.renderer.clearDepth();      // clear depth buffer...
	this.Bodies.renderScenes(this.renderer,this.mainCamera,time);
    };

    // For each animation, update the focus and focusOptions provided by the animation over an array of timeouts
    enablePointOfViewControls(enabled, autoRotate = enabled) {
	this.controls.enabled = enabled;
	this.controls.autoRotate = autoRotate;
    }

    getObjectByName(name) {
	return this.scene.getObjectByName(name);
    }

    tween(from, to, animationDuration, easingFunction, onUpdate, onEnd) {
	new TWEEN.Tween(from)
            .to(to, animationDuration)
            .easing(TWEEN.Easing[easingFunction[0]][easingFunction[1]])
            .on('update', onUpdate)
            .on('complete', onEnd)
            .start();
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
    
    reconfigCamera(state,
	initialCoordinates =  [7.773972, -122.431297],
	cameraOptions = {},
    ) {
	this.updateOptions(cameraOptions, 'camera');
	 const {
//	     autoRotateSpeed,
//	     distanceRadiusScale,
//	     enableAutoRotate,
//	     enableRotate,
//	     enableZoom,
//	     maxDistanceRadiusScale,
//	     maxPolarAngle,
//	     minPolarAngle,
	     rotateSpeed,
	     zoomSpeed,
	 } = this.options.camera;
	if (this.initialCoordinates !== initialCoordinates) {
	    // const [x, y, z] = coordinatesToPosition(
	    // 	initialCoordinates,
	    // 	RADIUS * distanceRadiusScale,
	    // );
	    //this.mainCamera.position.set(x, y, z);
	    this.initialCoordinates = initialCoordinates;
	};
	 //this.mainCamera.far = 100000;
	 //this.mainCamera.fov = 45;
	 //this.mainCamera.near = 1;
	 //this.controls.autoRotate = enableAutoRotate;
	 //this.controls.autoRotateSpeed = autoRotateSpeed;
	 //this.controls.dampingFactor = 0.1;
	 //this.controls.enableDamping = true;
	 //this.controls.enablePan = false;
	 //this.controls.enableRotate = enableRotate;
	 //this.controls.enableZoom = enableZoom;
	 ////this.controls.maxDistance = RADIUS * maxDistanceRadiusScale;
	 //this.controls.maxPolarAngle = maxPolarAngle;
	 ////this.controls.minDistance = RADIUS * CAMERA_MIN_DISTANCE_RADIUS_SCALE;
	 //this.controls.minPolarAngle = minPolarAngle;
	 this.controls.rotateSpeed = rotateSpeed;
	 this.controls.zoomSpeed = zoomSpeed;
    }

    reconfigModel(modelOptions = {}) {
	this.updateOptions(modelOptions, 'model');
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
		// this.updateFocus(
		//     coordinates,
		//     {
		// 	animationDuration,
		// 	distanceRadiusScale,
		// 	easingFunction,
		//     },
		//     true,
		// );
	    }, wait);
	    timeouts.push(timeout);
	    wait += animationDuration;
	});

	// return cleanup function
	return () => {
	    timeouts.forEach(timeout => {
		clearTimeout(timeout);
	    });
	    //this.updateFocus(currentFocus, currentFocusOptions);
	};
    }

    reconfigSize(size) {
	if (size) {
	    const [width, height] = size;
	    this.renderer.setSize(width, height);
	    this.mainCamera.aspect = width / height;
	}
	this.mainCamera.updateProjectionMatrix();
    };

    destroy() {
	console.log("Destroying Model...");
	cancelAnimationFrame(this.animationFrameId);
	// dispose model...
	//const modelBackground = this.getObjectByName("myname");
	//this.model.remove(modelBackground);
	this.scene.remove(this.model);
	//modelBackground.geometry.dispose();
	//modelBackground.material.dispose();
	// clean up...
	//this.scene.on('mousemove', null);
	//this.scene.on('click', null );
	UTILS.sceneTraverse(this.scene, UTILS.cleanScene);
	this.scene.dispose();
	this.scene=null;
	this.renderer && this.renderer.renderLists.dispose();
	this.renderer.dispose();
	this.renderer=null;
	this.controls.dispose();
	this.controls=null;
	this.preFocusPosition = null;;
	this.mainCamera.children.forEach(object => {
	    this.mainCamera.remove(object);
	});
	this.mainCamera=null;
    }
    
    updateCallbacks(callbacks = {}) {
	Object.keys(defaultCallbacks).forEach(key => {
	    this.callbacks[key] = callbacks[key] || defaultCallbacks[key];
	});
    };

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

