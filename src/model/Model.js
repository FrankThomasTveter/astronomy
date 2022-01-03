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
	this.scenes={bodies:{}};
	this.scenes.bodies["sun"]=     {scene: this.Bodies.createScene("sun",this.mainCamera), distance:20,   show:true};
	this.scenes.bodies["mercury"]= {scene: this.Bodies.createScene("mercury",this.mainCamera),distance:9, show:true};
	this.scenes.bodies["venus"]=   {scene: this.Bodies.createScene("venus",this.mainCamera),distance:8,   show:true};
	this.scenes.bodies["earth"]=   {scene: this.Bodies.createScene("earth",this.mainCamera),distance:1,   show:true};
	this.scenes.bodies["mars"]=    {scene: this.Bodies.createScene("mars",this.mainCamera),distance:10,   show:true};
	this.scenes.bodies["jupiter"]= {scene: this.Bodies.createScene("jupiter",this.mainCamera),distance:12,show:true};
	this.scenes.bodies["saturn"]=  {scene: this.Bodies.createScene("saturn",this.mainCamera),distance:13, show:true};
	this.scenes.bodies["uranus"]=  {scene: this.Bodies.createScene("uranus",this.mainCamera),distance:14, show:true};
	this.scenes.bodies["neptune"]= {scene: this.Bodies.createScene("neptune",this.mainCamera),distance:15,show:true};
	this.scenes.bodies["pluto"]=   {scene: this.Bodies.createScene("pluto",this.mainCamera),distance:16,  show:true};
    //this.Bodies.setPosition(this.scene,"deathstar",
    //			  20000*this.Bodies.SCALE,
    //			  this.Bodies.config.saturn.radius*1.01,
    //			  10000*this.Bodies.SCALE);//
    //this.Bodies.setPosition(this.scene,"moon",
    //			  20000*this.Bodies.SCALE,
    //			  this.Bodies.config.saturn.radius*1.01,
    //			  10000*this.Bodies.SCALE);//
	// console.log("*** Scenes:",JSON.stringify(Object.keys(this.scenes.bodies)));
    };
    
    initRenderer(state,canvas) {
	this.renderer = new THREE.WebGLRenderer({
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
    animate() { // ReactModel starts the animation loop...
	this.render();
	this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    }

    render() {
	//console.log("Rendering...");
	this.renderer.sortObjects = false;
	// process controls (point camera)
	this.controls.update();
	this.updateModel();
	this.renderInitial();
	this.renderBackdrop();
	this.renderBodies();
	//TWEEN.update();
    }

    updateModel() {
	// update the information sprite...

	// update model config
	var config=this.state.Model.getCurrentConfig(this.state);
	this.updateConfig(this.state,config);

	//check if we have a new config...
	//this.updateTarget(this.state,config);

	// update main camera position (to observer)...
	this.updateMainCamera(this.state);

	// update scenes
	this.updateScenes(this.state,this.mainCamera);
    };

    updateRaycaster (state) {
	this.raycaster.setFromCamera(this.mouse,this.mainCamera);
	const intersects = this.raycaster.intersectObjects( this.scene.children );
	var cnt=intersects.length;
	for ( let i = 0; i < intersects.length; i ++ ) {
	    //console.log("Pointing at:",cnt,i,intersects[ i ].object.name,this.mouse);
	    //intersects[ i ].object.material.color.set( 0xff0000 );
	};
    };

    onMouseUp(event) { // called by pointController...
	//console.log("Mouse up:",event);
	//// check if mouse was stationary
	//// update raycaster
	// this.updateRaycaster(this.state);
	//// find target object, target star
	//// point camera towards target
	//// update target information...
    }	

    onMouseDown(event) { // called by pointController...
	// console.log("Mouse down:",event);
    }	

    updateConfig (state,config) {
	//console.log("Updating config",config);
	this.Bodies.copyObserver( config.observer,        this.Bodies.config.observer);
	this.Bodies.copyBody(     config.bodies.sun,      this.Bodies.config.sun);
	this.Bodies.copyBody(     config.bodies.mercury,  this.Bodies.config.mercury);
	this.Bodies.copyBody(     config.bodies.sun,      this.Bodies.config.sun);
	this.Bodies.copyBody(     config.bodies.mercury,  this.Bodies.config.mercury);
	this.Bodies.copyBody(     config.bodies.venus,    this.Bodies.config.venus);
	this.Bodies.copyBody(     config.bodies.earth,    this.Bodies.config.earth);
	this.Bodies.copyBody(     config.bodies.moon,     this.Bodies.config.moon);
	this.Bodies.copyBody(     config.bodies.mars,     this.Bodies.config.mars);
	this.Bodies.copyBody(     config.bodies.jupiter,  this.Bodies.config.jupiter);
	this.Bodies.copyBody(     config.bodies.saturn,   this.Bodies.config.saturn);
	this.Bodies.copyBody(     config.bodies.uranus,   this.Bodies.config.uranus);
	this.Bodies.copyBody(     config.bodies.neptune,  this.Bodies.config.neptune);
	this.Bodies.copyBody(     config.bodies.pluto,    this.Bodies.config.pluto);
	//console.log("Updated config",this.Bodies.config);
    };

    updateScenes (state,camera) {
	//console.log("UpdateScenes...");
	// update Backdrop
	var observer=this.Bodies.config.observer;
	this.Backdrop.updateScenes(state,camera,observer);
	// loop over Bodies scenes
	for (var name in this.scenes.bodies) {
	    var item=this.scenes.bodies[name];
	    if (item.scene !== undefined) {
		if (item.show) {
		    //console.log("Scene:",name);
		    this.Bodies.updateScene(state,camera,observer,name,item.scene);
		};
	    };
	};
    };
    
    updateMainCamera(state) {
	//console.log("Zenith:",this.Bodies.config.observer.zenith);
	let pos=this.Bodies.config.observer.position;
	let zen=this.Bodies.config.observer.zenith;
	this.mainCamera.position.set(pos.x,pos.y,pos.z);
	this.mainCamera.up.set(zen.x,zen.y,zen.z); // up is always towards observer zenith...
	//this.mainCamera.poinAt(new THREE.Vector3(0,1,0)); // up is always towards observer zenith...
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
		this.mainCamera.up.set(state.Model.config.state[state.Model.config.current].observer.zenith); // up is always towards observer zenith...
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

    renderInitial() {
	this.renderer.autoClear = true; // clear canvas completely
	this.renderer.render(this.scene, this.mainCamera);
	this.renderer.autoClear = false; // draw on top of previous drawing
	//console.log("Camera:",this.mainCamera);
    };

    renderBackdrop() {
	this.Backdrop.renderScenes(this.renderer,this.mainCamera);
    };

    renderBodies() {
	//this.renderer.autoClear = false;
	// sort scenes by distance...
	var keys = Object.keys(this.scenes.bodies);
	var order=keys.sort((a,b) => {return this.scenes.bodies[b].distance - this.scenes.bodies[a].distance;} );
	//console.log("Sorted by distance:",order);
	order.forEach( (name,i)=>{
	    let distance=this.scenes.bodies[name].distance||0;
	    let show=this.scenes.bodies[name].show;
	    let scene=this.scenes.bodies[name].scene;
	    let camera=scene.getObjectByName("camera");
	    if (show && camera !== undefined) {
		//console.log("Rendering:",name);
		this.Bodies.prepareForRender(name,scene,this.mainCamera);
		this.renderer.render(scene, camera);
	    } else {
		//console.log("Not rendering:",k);
	    }
	});	
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

