//import { scaleLinear } from 'd3-scale';
import * as TWEEN from 'es6-tween';
import Bodies from "./Bodies";
import Backdrop from "./Backdrop";
//import TextSprite from "./TextSprite";
//import { SpriteText2D, textAlign } from 'three-text2d'

import * as THREE from 'three'
import { PointOfViewControls } from './PointOfViewControls'

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

const emptyFunction = () => {};

const defaultCallbacks = {
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


// model handles all graphics related to model, data is updated using  ModelLib
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

    initRenderer(state,canvas) {
	this.renderer = new THREE.WebGLRenderer({
	    alpha: true,
	    antialias: true,
	    canvas:canvas,
	});
	this.renderer.setClearColor (0x000000, 1);
	this.renderer.shadowMap.enabled=true;
	//this.renderer.shadowMap.type=THREE.BasicShadowMap;
	//this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    };	

    initCamera(state) {
	this.camera = new THREE.PerspectiveCamera();
	this.camera.position.set(this.Bodies.config.sun.radius*2.0, 0, 0);
	this.camera.up.set(0,0,1);
    };	
    
    initControls(state) {
	this.controls = new PointOfViewControls(this.camera, this.renderer.domElement);
	this.controls.rotateSpeed = 1.0;
	this.controls.zoomSpeed = 2.5;
	this.controls.panSpeed = 0.0;
	this.controls.noZoom = false;
	this.controls.noPan = true;
	this.controls.staticMoving = true;
	this.controls.dynamicDampingFactor = 0.3;
	this.controls.keys = [ 65, 83, 68 ];
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

    initScene(state) {
	this.scene = new THREE.Scene();
	//this.scene.add(this.Backdrop.createStarsBackdrop());
	//this.scene.add(this.Backdrop.createNavigationBackdrop());
	this.scenes={backdrop:[],bodies:{}};
	this.scenes.backdrop.push(     {scene: this.Backdrop.createNavigationScene(),       show:false  });
	this.scenes.backdrop.push(     {scene: this.Backdrop.createStarsScene(),            show:true  });
	this.scenes.bodies["sun"]=     {scene: this.Bodies.createSunScene(this.camera),     show:false, distance:20   };
	this.scenes.bodies["mercury"]= {scene: this.Bodies.createMercuryScene(this.camera), show:false, distance:9    };
	this.scenes.bodies["venus"]=   {scene: this.Bodies.createVenusScene(this.camera),   show:false, distance:8    };
	this.scenes.bodies["earth"]=   {scene: this.Bodies.createEarthScene(this.camera),   show:false, distance:0    };
	this.scenes.bodies["mars"]=    {scene: this.Bodies.createMarsScene(this.camera),    show:false, distance:10   };
	this.scenes.bodies["jupiter"]= {scene: this.Bodies.createJupiterScene(this.camera), show:false, distance:12   };
	this.scenes.bodies["saturn"]=  {scene: this.Bodies.createSaturnScene(this.camera),  show:false, distance:13   };
	this.scenes.bodies["uranus"]=  {scene: this.Bodies.createUranusScene(this.camera),  show:false, distance:14   };
	this.scenes.bodies["neptune"]= {scene: this.Bodies.createNeptuneScene(this.camera), show:true,  distance:15   };
	this.scenes.bodies["pluto"]=   {scene: this.Bodies.createPlutoScene(this.camera),   show:false, distance:16   };
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
	this.updateModel();
	// render backdrop-scene
	this.renderBackdrop();
	// render bodies-scenes
	this.renderScenes();
	// process controls
	this.controls.update();
	TWEEN.update();
    }

    updateModel() {
	// update the information sprite...
	this.updateRaycaster(this.state);

	// update model config
	var config=this.state.Model.getCurrentConfig(this.state);
	this.updateConfig(config);

	// update scene distances...

	// update observer position...

	//this.updateCamera(this.state);
    };

    updateRaycaster (state) {
	this.raycaster.setFromCamera(this.mouse,this.camera);
	const intersects = this.raycaster.intersectObjects( this.scene.children );
	var cnt=intersects.length;
	for ( let i = 0; i < intersects.length; i ++ ) {
	    //console.log("Pointing at:",cnt,i,intersects[ i ].object.name,this.mouse);
	    //intersects[ i ].object.material.color.set( 0xff0000 );
	};
    };

    updateConfig (config) {
	//console.log("Updating config");
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
    };
    
    updateCamera(state) {
	this.camera.position.copy(this.Bodies.config.observer.position);
	this.camera.up.set(this.Bodies.config.observer.zenith); // up is always towards observer zenith...
    }

    renderBackdrop() {
	this.renderer.autoClear = true; // clear canvas completely
	this.renderer.render(this.scene, this.camera);
	this.renderer.autoClear = false; // draw on top of previous drawing
	this.scenes.backdrop.forEach( (k,i)=>{
	    let show=k.show;
	    let scene=k.scene;
	    //console.log("Rendering:",k,distance, show);
	    if (show) {
		this.Backdrop.prepareForRender(scene,this.camera);
		this.renderer.render(scene, this.camera);
	    } else {
		//console.log("Not rendering:",i);
	    }
	});	
    };

    renderScenes() {
	//this.renderer.autoClear = false;
	// sort scenes by distance...
	var keys = Object.keys(this.scenes.bodies);
	var order=keys.sort((a,b) => {return this.scenes.bodies[a].distance - this.scenes.bodies[b].distance;} );
	order.forEach( (k,i)=>{
	    let distance=this.scenes.bodies[k].distance||0;
	    let show=this.scenes.bodies[k].show;
	    let scene=this.scenes.bodies[k].scene;
	    if (show) {
		//console.log("Rendering:",k);
		this.renderer.render(scene, this.camera);
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
	    //this.camera.position.set(x, y, z);
	    this.initialCoordinates = initialCoordinates;
	};
	 //this.camera.far = 100000;
	 //this.camera.fov = 45;
	 //this.camera.near = 1;
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
	    this.camera.aspect = width / height;
	}
	this.camera.updateProjectionMatrix();
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

