import { scaleLinear } from 'd3-scale';
import * as TWEEN from 'es6-tween';

//import * as THREE from 'three'
import { AstroControls } from './AstroControls'
//import { DragControls } from 'three/examples/jsm/controls/DragControls'


import {
//    MeshStandardMaterial,
//    Object3D,
    AmbientLight,
    DirectionalLight,
    PointLight,
    BackSide,
    BoxGeometry,
    SphereGeometry,
    Color,
    Group,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
    MeshPhongMaterial,
    PerspectiveCamera,
    Scene,
    TextureLoader,
    Vector3,
    WebGLRenderer,
} from 'three';
import { createGlowMesh } from 'three-glow-mesh';
//import AstroControls from 'three-astrocontrols';
import { Interaction } from 'three.interaction';

import {
    BACKGROUND_RADIUS_SCALE,
    CAMERA_DAMPING_FACTOR,
    CAMERA_FAR,
    CAMERA_FOV,
    CAMERA_MIN_DISTANCE_RADIUS_SCALE,
    CAMERA_NEAR,
    CLOUDS_RADIUS_OFFSET,
    defaultCameraOptions,
    defaultFocusOptions,
    defaultModelOptions,
    defaultLightOptions,
    defaultMarkerOptions,
    MODEL_SEGMENTS,
    INITIAL_COORDINATES,
    MARKER_ACTIVE_ANIMATION_DURATION,
    MARKER_ACTIVE_ANIMATION_EASING_FUNCTION,
    MARKER_DEFAULT_COLOR,
    MARKER_SEGMENTS,
    MARKER_UNIT_RADIUS_SCALE,
    RADIUS,
} from './defaults';
import {
    //Animation,
    //Callbacks,
    //CameraOptions,
    //Coordinates,
    //FocusOptions,
    //ModelOptions,
    //InteractableObject3D,
    //InteractableScene,
    //InteractionEvent,
    //LightOptions,
    //Marker,
    //MarkerOptions,
    MarkerType,
    ObjectName,
    //Optional,
    //Options,
    //Position,
    //Size,
} from './types';
import {
    coordinatesToPosition,
    getMarkerCoordinatesKey,
    maxValue,
    minValue,
    tween,
} from './utils';

const emptyFunction = () => {};

const defaultCallbacks = {
    onClickMarker: emptyFunction,
    onDefocus: emptyFunction,
    onMouseOutMarker: emptyFunction,
    onMouseOverMarker: emptyFunction,
    onTextureLoaded: emptyFunction,
};

const defaultOptions = {
    camera: defaultCameraOptions,
    model: defaultModelOptions,
    focus: defaultFocusOptions,
    marker: defaultMarkerOptions,
    light: defaultLightOptions,
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
	// create objects
	const renderer = new WebGLRenderer({
	    alpha: true,
	    antialias: true,
	    canvas,
	});

	// create camera and controls
	// create scenes and add objects (planets, moons etc.)


	const camera = new PerspectiveCamera();
	const scenes = this.createScenes(state);
	const controls = new AstroControls(camera, renderer.domElement);




	// camera.up = new THREE.Vector3(0,0,1);
	// camera.lookAt(new THREE.Vector3(0,0,0));



	const cameraAmbientLight = new AmbientLight('white');
	const cameraPointLight = new PointLight('white');
	const model = new Group();
	const modelBackground = new Mesh();
	const modelClouds = new Mesh();
	const modelSphere = new Mesh();
	const markerObjects = new Group();
	const astroControls = new AstroControls(camera, renderer.domElement);



	astroControls.rotateSpeed = 1.0;
	astroControls.zoomSpeed = 1.2;
	astroControls.panSpeed = 0.8;
	
	astroControls.noZoom = false;
	astroControls.noPan = false;
	
	astroControls.staticMoving = true;
	astroControls.dynamicDampingFactor = 0.3;
	

	const scene = new Scene();

	// name objects
	camera.name = ObjectName.Camera;
	cameraAmbientLight.name = ObjectName.CameraAmbientLight;
	cameraPointLight.name = ObjectName.CameraPointLight;
	model.name = ObjectName.Model;
	modelBackground.name = ObjectName.ModelBackground;
	modelClouds.name = ObjectName.ModelClouds;
	modelSphere.name = ObjectName.ModelSphere;
	markerObjects.name = ObjectName.MarkerObjects;
	scene.name = ObjectName.Scene;

	// add objects to scene
	camera.add(cameraAmbientLight);
	camera.add(cameraPointLight);
	model.add(modelBackground);
	model.add(modelClouds);
	model.add(modelSphere);
	scene.add(markerObjects);
	scene.add(camera);
	scene.add(model);

	// add interactions to scene
	const interactions=new Interaction(renderer, scene, camera);
	scene.on('mousemove', (event) => {
    	    if (this.isFocusing()) {
		return;
      	    }
	    if (this.activeMarker) {
		const { activeScale } = this.options.marker;
		const from = [activeScale, activeScale, activeScale];
		tween(
		    from,
		    [1, 1, 1],
		    MARKER_ACTIVE_ANIMATION_DURATION,
		    MARKER_ACTIVE_ANIMATION_EASING_FUNCTION,
		    () => {
			if (this.activeMarkerObject) {
			    this.activeMarkerObject.scale.set(...from);
			}
		    },
		    () => {
			this.activeMarker = undefined;
			this.activeMarkerObject = undefined;
		    },
		);
		this.callbacks.onMouseOutMarker(
		    this.activeMarker,
		    this.activeMarkerObject,
		    event.data.originalEvent,
		);
		//this.tooltip.hide(); // the tooltip hides itself...
	    }
	});
	scene.on('click', (event) => {
	    if (this.isFocusing()) {
		return;
	    }
	    if (this.options.focus.enableDefocus && this.preFocusPosition) {
		this.callbacks.onDefocus(this.focus, event.data.originalEvent);
		this.updateFocus(undefined, this.options.focus);
	    }
	});
	// assign values to class variables
	this.state=state;
	this.activeMarker = undefined;
	this.activeMarkerObject = undefined;
	this.animationFrameId = undefined;
	this.callbacks = defaultCallbacks;
	this.camera = camera;
	this.focus = undefined;
	this.model = model;
	this.isFrozen = false;
	this.markerObjects = markerObjects;
	this.options = defaultOptions;
	this.astroControls = astroControls;
	this.preFocusPosition = undefined;
	this.renderer = renderer;
	this.interactions = interactions;
	this.scene = scene;
	this.tooltip = tooltip;

	// update objects
	this.updateCallbacks();
	this.updateCamera();
	this.updateFocus();
	this.updateModel({
	    enableBackground: false,
	    enableClouds: false,
	});
	this.updateLights();
	this.updateMarkers();
	this.updateSize();
    }

    createScenes(state) {
	//scene.getObjectByName( "light" );
	var scene,camera,light,mesh;
	var scenes={};
	// sun scene...
	scene = new Scene();
	mesh=state.Planets.createSunMesh();
	scene.add(mesh);
	camera = new PerspectiveCamera();
	camera.name="camera";
	scene.add(camera);
	scenes["sun"]=scene;
	// mercury scene...
	scene = new Scene();
	mesh=state.Planets.createMercuryMesh();
	scene.add(mesh);
	light = new DirectionalLight('white',0.5);
	light.name="light";
	light.target=mesh;
	scene.add(light);
	camera = new PerspectiveCamera();
	camera.name="camera";
	scene.add(camera);
	scenes["mercury"]=scene;


	// venus scene...
	// moon-earth scene...
	// mars scene...
	// jupiter scene...
	// saturn-deathstar scene...
	// uranus scene...
	// neptune scene...
	// pluto scene...
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
	const modelClouds = this.getObjectByName(ObjectName.ModelClouds);
	const modelSphere = this.getObjectByName(ObjectName.ModelSphere);
	this.model.remove(modelBackground);
	this.model.remove(modelClouds);
	this.model.remove(modelSphere);
	this.scene.remove(this.model);
	modelBackground.geometry.dispose();
	modelBackground.material.dispose();
	modelClouds.geometry.dispose();
	modelClouds.material.dispose();
	modelSphere.geometry.dispose();
	modelSphere.material.dispose();
	// dispose markers
	this.markerObjects.children.forEach(markerObject => {
	    this.markerObjects.remove(markerObject);
	    this.cleanMarker(markerObject);
	});
	this.interactions.removeAllListeners= this.interactions.removeEvents;
	this.interactions.destroy();
	this.interactions.on('addevents',null);this.interactions.on('removeevents',null);this.interactions.setTargetElement(null);
	this.interactions=null;
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
	this.astroControls.dispose();
	this.astroControls=null;
	this.preFocusPosition = null;;
	this.camera.children.forEach(object => {
	    this.camera.remove(object);
	});
	this.camera=null;
    }

    animate() {
	//
	//this.state.Model.hello();
	this.render();
	this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    }

    // TODO: expose a way to customize animating clouds in every axis
    animateClouds() {
	const modelClouds = this.getObjectByName(ObjectName.ModelClouds);
	['x', 'y', 'z'].forEach(axis => {
	    modelClouds.rotation[axis] += Math.random() / 10000;
	});
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

    enableAstroControls(enabled, autoRotate = enabled) {
	this.astroControls.enabled = enabled;
	this.astroControls.autoRotate = autoRotate;
    }

    freeze() {
	this.isFrozen = true;
	this.enableAstroControls(false);
	cancelAnimationFrame(this.animationFrameId);
    }

    getObjectByName(name) {
	return this.scene.getObjectByName(name);
    }

    isFocusing() {
	return !this.astroControls.enabled;
    }

    render() {
	this.renderer.sortObjects = false;
	this.renderer.render(this.scene, this.camera);
	this.animateClouds();
	this.astroControls.update();
	TWEEN.update();
    }

    updateCallbacks(callbacks = {}) {
	Object.keys(defaultCallbacks).forEach(key => {
	    this.callbacks[key] = callbacks[key] || defaultCallbacks[key];
	});
    }

    updateCamera(
	initialCoordinates = INITIAL_COORDINATES,
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
	    const [x, y, z] = coordinatesToPosition(
		initialCoordinates,
		RADIUS * distanceRadiusScale,
	    );
	    this.camera.position.set(x, y, z);
	    this.initialCoordinates = initialCoordinates;
	}

	this.camera.far = CAMERA_FAR;
	this.camera.fov = CAMERA_FOV;
	this.camera.near = CAMERA_NEAR;
	this.astroControls.autoRotate = enableAutoRotate;
	this.astroControls.autoRotateSpeed = autoRotateSpeed;
	this.astroControls.dampingFactor = CAMERA_DAMPING_FACTOR;
	this.astroControls.enableDamping = true;
	this.astroControls.enablePan = false;
	this.astroControls.enableRotate = enableRotate;
	this.astroControls.enableZoom = enableZoom;
	this.astroControls.maxDistance = RADIUS * maxDistanceRadiusScale;
	this.astroControls.maxPolarAngle = maxPolarAngle;
	this.astroControls.minDistance = RADIUS * CAMERA_MIN_DISTANCE_RADIUS_SCALE;
	this.astroControls.minPolarAngle = minPolarAngle;
	this.astroControls.rotateSpeed = rotateSpeed;
	this.astroControls.zoomSpeed = zoomSpeed;
    }

    updateFocus(
	focus,
	focusOptions = {},
	autoDefocus = false,
    ) {
	this.updateOptions(focusOptions, 'focus');
	this.focus = focus;

	const {
	    animationDuration,
	    distanceRadiusScale,
	    easingFunction,
	} = this.options.focus;

	if (this.isFrozen) {
	    return;
	}

	if (this.focus) {
	    // disable astro controls when focused
	    const from = [
		this.camera.position.x,
		this.camera.position.y,
		this.camera.position.z,
	    ];
	    const to = coordinatesToPosition(
		this.focus,
		RADIUS * distanceRadiusScale,
	    );
	    this.preFocusPosition = this.preFocusPosition || ([...from]);
	    tween(
		from,
		to,
		animationDuration,
		easingFunction,
		() => {
		    this.enableAstroControls(false);
		    this.camera.position.set(...from);
		},
		() => {
		    if (autoDefocus) {
			this.focus = undefined;
			this.preFocusPosition = undefined;
		    }
		    this.enableAstroControls(true, autoDefocus);
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
		tween(
		    from,
		    to,
		    animationDuration,
		    easingFunction,
		    () => {
			this.enableAstroControls(false);
			this.camera.position.set(...from);
		    },
		    () => {
			this.preFocusPosition = undefined;
			this.enableAstroControls(true);
		    },
		);
	    }
	}
    }

    updateModel(modelOptions = {}) {
	this.updateOptions(modelOptions, 'model');
	const {
	    backgroundTexture,
	    cloudsOpacity,
	    cloudsTexture,
	    enableBackground,
	    enableClouds,
	    enableGlow,
	    glowColor,
	    glowCoefficient,
	    glowPower,
	    glowRadiusScale,
	    bumpMap,
	    texture,
	} = this.options.model;

	const modelBackground = this.getObjectByName(
	    ObjectName.ModelBackground,
	);
	const modelClouds = this.getObjectByName(ObjectName.ModelClouds);
	const modelSphere = this.getObjectByName(ObjectName.ModelSphere);

	new TextureLoader().load(texture, map => {
	    console.log("Loaded texture:",texture);
	    new TextureLoader().load(bumpMap, bump => {
		console.log("Loaded bumpMap:",bumpMap);
		modelSphere.material = new MeshPhongMaterial({
		    map:map,
		    bumpMap:bump,   
		    bumpScale:5.0,
		}); //map,

		modelSphere.geometry = new SphereGeometry(
		    RADIUS,
		    MODEL_SEGMENTS,
		    MODEL_SEGMENTS,
		);
		//modelSphere.material = new MeshLambertMaterial({
		if (enableGlow) {
		    if (this.getObjectByName(ObjectName.ModelGlow) !== undefined) {
			modelSphere.remove(this.getObjectByName(ObjectName.ModelGlow));
		    };
		    const modelGlow = createGlowMesh(modelSphere.geometry, {
			backside: true,
			color: glowColor,
			coefficient: glowCoefficient,
			power: glowPower,
			size: RADIUS * glowRadiusScale,
		    });
		    modelGlow.name = ObjectName.ModelGlow;
		    modelSphere.add(modelGlow);
		};
		this.callbacks.onTextureLoaded();
	    });
	},undefined,(err) => {console.error('Error gl-texture: ',texture,err);});

	if (enableBackground) {
	    new TextureLoader().load(backgroundTexture,map => {
		modelBackground.geometry = new SphereGeometry(
		    RADIUS * BACKGROUND_RADIUS_SCALE,
		    MODEL_SEGMENTS,
		    MODEL_SEGMENTS,
		);
		modelBackground.material = new MeshBasicMaterial({
		    map,
		    side: BackSide,
		});
	    },undefined,(err) => {console.error('Error bg-texture: ',backgroundTexture,err);});
	}
	if (enableClouds) {
            console.log("Loading cl texture:",cloudsTexture);
	    new TextureLoader().load(cloudsTexture, map => {
		modelClouds.geometry = new SphereGeometry(
		    RADIUS + CLOUDS_RADIUS_OFFSET,
		    MODEL_SEGMENTS,
		    MODEL_SEGMENTS,
		);
		modelClouds.material = new MeshLambertMaterial({
		    map,
		    transparent: true,
		});
		modelClouds.material.opacity = cloudsOpacity;
	    },undefined,(err) => {console.error('Error cl-texture: ',cloudsTexture,err);});
	}
    }

    updateLights(lightOptions = {}) {
	this.updateOptions(lightOptions, 'light');
	const {
	    ambientLightColor,
	    ambientLightIntensity,
	    pointLightColor,
	    pointLightIntensity,
	    pointLightPositionRadiusScales,
	} = this.options.light;

	const cameraAmbientLight = this.getObjectByName(
	    ObjectName.CameraAmbientLight,
	);
	const cameraPointLight = this.getObjectByName(
	    ObjectName.CameraPointLight,
	);

	cameraAmbientLight.color = new Color(ambientLightColor);
	cameraAmbientLight.intensity = ambientLightIntensity;
	cameraPointLight.color = new Color(pointLightColor);
	cameraPointLight.intensity = pointLightIntensity;
	cameraPointLight.position.set(
	    RADIUS * pointLightPositionRadiusScales[0],
	    RADIUS * pointLightPositionRadiusScales[1],
	    RADIUS * pointLightPositionRadiusScales[2],
	);
    }

    updateMarkers(
	markers = [],
	markerOptions = {},
    ) {
	this.updateOptions(markerOptions, 'marker');
	const {
	    activeScale,
	    enableGlow,
	    enableTooltip,
	    enterAnimationDuration,
	    enterEasingFunction,
	    exitAnimationDuration,
	    exitEasingFunction,
	    glowCoefficient,
	    glowPower,
	    glowRadiusScale,
	    offsetRadiusScale,
	    radiusScaleRange,
	    renderer,
	    type,
	} = this.options.marker;

	const unitRadius = RADIUS * MARKER_UNIT_RADIUS_SCALE;
	const sizeScale = scaleLinear()
	      .domain([
		  minValue(markers, marker => marker.value),
		  maxValue(markers, marker => marker.value),
	      ])
	      .range([RADIUS * radiusScaleRange[0], RADIUS * radiusScaleRange[1]]);

	const markerCoordinatesKeys = new Set(markers.map(getMarkerCoordinatesKey));
	const markerObjectNames = new Set(
	    this.markerObjects.children.map(markerObject => markerObject.name),
	);

	markers.forEach(marker => {
	    const { coordinates, value } = marker;
	    const markerCoordinatesKey = getMarkerCoordinatesKey(marker);
	    const size = sizeScale(value);

	    let markerObject;
	    // create new marker objects
	    if (!markerObjectNames.has(markerCoordinatesKey)) {
		if (renderer !== undefined) {
		    markerObject = renderer(marker);
		} else {
		    const color = marker.color || MARKER_DEFAULT_COLOR;
		    const from = { size: 0 };
		    const to = { size };
		    const mesh = new Mesh();
		    tween(from, to, enterAnimationDuration, enterEasingFunction, () => {
			switch (type) {
			case MarkerType.Bar:
			    mesh.geometry = new BoxGeometry(
				unitRadius,
				unitRadius,
				from.size,
			    );
			    mesh.material = new MeshLambertMaterial({
				color,
			    });
			    break;
			case MarkerType.Dot:
			default:
			    mesh.geometry = new SphereGeometry(
				from.size,
				MARKER_SEGMENTS,
				MARKER_SEGMENTS,
			    );
			    mesh.material = new MeshBasicMaterial({ color });
			    if (enableGlow) {
				// add glow
				const glowMesh = createGlowMesh(
				    mesh.geometry.clone(),
				    {
					backside: false,
					color,
					coefficient: glowCoefficient,
					power: glowPower,
					size: from.size * glowRadiusScale,
				    },
				);
				mesh.children = [];
				mesh.add(glowMesh);
			    }
			}
		    });
		    markerObject = mesh;
		}

		// place markers
		let heightOffset = 0;
		if (offsetRadiusScale !== undefined) {
		    heightOffset = RADIUS * offsetRadiusScale;
		} else {
		    if (type === MarkerType.Dot) {
			heightOffset = (size * (1 + glowRadiusScale)) / 2;
		    } else {
			heightOffset = 0;
		    }
		}
		const position = coordinatesToPosition(
		    coordinates,
		    RADIUS + heightOffset,
		);
		markerObject.position.set(...position);
		markerObject.lookAt(new Vector3(0, 0, 0));

		markerObject.name = markerCoordinatesKey;
		this.markerObjects.add(markerObject);
	    }

	    // update existing marker objects
	    markerObject = this.markerObjects.getObjectByName(markerCoordinatesKey);
	    const handleClick = (event) => {
		event.stopPropagation();
		this.updateFocus(marker.coordinates);
		this.callbacks.onClickMarker(
		    marker,
		    markerObject,
		    event.data.originalEvent,
		);
	    };

	    markerObject.on('click', handleClick.bind(this));
	    markerObject.on('touchstart', handleClick.bind(this));
	    markerObject.on('mousemove', event => {
		if (this.isFocusing()) {
		    this.tooltip.hide();
		    return;
		}
		const { originalEvent } = event.data;
		if (enableTooltip) {
		    //console.log("Marker:",JSON.stringify(marker.id));
		    this.tooltip.show(
			originalEvent.clientX,
			originalEvent.clientY,
			marker
		    );
		}
		if (true) { return;};
		event.stopPropagation();
		const from = markerObject.scale.toArray();
		tween(
		    from,
		    [activeScale, activeScale, activeScale],
		    MARKER_ACTIVE_ANIMATION_DURATION,
		    MARKER_ACTIVE_ANIMATION_EASING_FUNCTION,
		    () => {
			if (markerObject) {
			    markerObject.scale.set(...from);
			}
		    },
		);
		this.activeMarker = marker;
		this.activeMarkerObject = markerObject;
		this.callbacks.onMouseOverMarker(marker, markerObject, originalEvent);
	    });
	});

	// remove marker objects that are stale
	const markerObjectsToRemove = this.markerObjects.children.filter(
	    markerObject => !markerCoordinatesKeys.has(markerObject.name),
	);
	markerObjectsToRemove.forEach(markerObject => {
	    const from = markerObject.scale.toArray();
	    tween(
		from,
		[0, 0, 0],
		exitAnimationDuration,
		exitEasingFunction,
		() => {
		    if (markerObject) {
			markerObject.scale.set(...from);
		    }
		},
		() => {
		    this.markerObjects.remove(markerObject);
		    this.cleanMarker(markerObject);
		},
	    );
	});
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
    }

    unfreeze() {
	if (this.isFrozen) {
	    this.isFrozen = false;
	    this.enableAstroControls(true);
	    this.animate();
	}
    }





}
