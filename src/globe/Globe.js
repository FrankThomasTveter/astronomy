import { scaleLinear } from 'd3-scale';
import * as TWEEN from 'es6-tween';
import {
    AmbientLight,
    BackSide,
    BoxGeometry,
    Color,
    Group,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
//    MeshStandardMaterial,
    MeshPhongMaterial,
//    Object3D,
    PerspectiveCamera,
    PointLight,
    Scene,
    SphereGeometry,
    TextureLoader,
    Vector3,
    WebGLRenderer,
} from 'three';
import { createGlowMesh } from 'three-glow-mesh';
import OrbitControls from 'three-orbitcontrols';
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
    defaultGlobeOptions,
    defaultLightOptions,
    defaultMarkerOptions,
    GLOBE_SEGMENTS,
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
    //GlobeOptions,
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
    globe: defaultGlobeOptions,
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

export default class Globe {
    constructor(canvas, tooltip) {
	// create objects
	const renderer = new WebGLRenderer({
	    alpha: true,
	    antialias: true,
	    canvas,
	});
	const camera = new PerspectiveCamera();
	const cameraAmbientLight = new AmbientLight('white');
	const cameraPointLight = new PointLight('white');
	const globe = new Group();
	const globeBackground = new Mesh();
	const globeClouds = new Mesh();
	const globeSphere = new Mesh();
	const markerObjects = new Group();
	const orbitControls = new OrbitControls(camera, renderer.domElement);
	const scene = new Scene();

	// name objects
	camera.name = ObjectName.Camera;
	cameraAmbientLight.name = ObjectName.CameraAmbientLight;
	cameraPointLight.name = ObjectName.CameraPointLight;
	globe.name = ObjectName.Globe;
	globeBackground.name = ObjectName.GlobeBackground;
	globeClouds.name = ObjectName.GlobeClouds;
	globeSphere.name = ObjectName.GlobeSphere;
	markerObjects.name = ObjectName.MarkerObjects;
	scene.name = ObjectName.Scene;

	// add objects to scene
	camera.add(cameraAmbientLight);
	camera.add(cameraPointLight);
	globe.add(globeBackground);
	globe.add(globeClouds);
	globe.add(globeSphere);
	scene.add(markerObjects);
	scene.add(camera);
	scene.add(globe);

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
	this.activeMarker = undefined;
	this.activeMarkerObject = undefined;
	this.animationFrameId = undefined;
	this.callbacks = defaultCallbacks;
	this.camera = camera;
	this.focus = undefined;
	this.globe = globe;
	this.isFrozen = false;
	this.markerObjects = markerObjects;
	this.options = defaultOptions;
	this.orbitControls = orbitControls;
	this.preFocusPosition = undefined;
	this.renderer = renderer;
	this.interactions = interactions;
	this.scene = scene;
	this.tooltip = tooltip;

	// update objects
	this.updateCallbacks();
	this.updateCamera();
	this.updateFocus();
	this.updateGlobe({
	    enableBackground: false,
	    enableClouds: false,
	});
	this.updateLights();
	this.updateMarkers();
	this.updateSize();
    }

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
	//console.log("Destroying Globe...");
	cancelAnimationFrame(this.animationFrameId);
	this.tooltip.destroy();
	this.tooltip=null;
	// dispose globe, clouds and background...
	const globeBackground = this.getObjectByName(ObjectName.GlobeBackground);
	const globeClouds = this.getObjectByName(ObjectName.GlobeClouds);
	const globeSphere = this.getObjectByName(ObjectName.GlobeSphere);
	this.globe.remove(globeBackground);
	this.globe.remove(globeClouds);
	this.globe.remove(globeSphere);
	this.scene.remove(this.globe);
	globeBackground.geometry.dispose();
	globeBackground.material.dispose();
	globeClouds.geometry.dispose();
	globeClouds.material.dispose();
	globeSphere.geometry.dispose();
	globeSphere.material.dispose();
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
	this.orbitControls.dispose();
	this.orbitControls=null;
	this.preFocusPosition = null;;
	this.camera.children.forEach(object => {
	    this.camera.remove(object);
	});
	this.camera=null;
    }

    animate() {
	this.render();
	this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    }

    // TODO: expose a way to customize animating clouds in every axis
    animateClouds() {
	const globeClouds = this.getObjectByName(ObjectName.GlobeClouds);
	['x', 'y', 'z'].forEach(axis => {
	    globeClouds.rotation[axis] += Math.random() / 10000;
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

    enableOrbitControls(enabled, autoRotate = enabled) {
	this.orbitControls.enabled = enabled;
	this.orbitControls.autoRotate = autoRotate;
    }

    freeze() {
	this.isFrozen = true;
	this.enableOrbitControls(false);
	cancelAnimationFrame(this.animationFrameId);
    }

    getObjectByName(name) {
	return this.scene.getObjectByName(name);
    }

    isFocusing() {
	return !this.orbitControls.enabled;
    }

    render() {
	this.renderer.sortObjects = false;
	this.renderer.render(this.scene, this.camera);
	this.animateClouds();
	this.orbitControls.update();
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
	this.orbitControls.autoRotate = enableAutoRotate;
	this.orbitControls.autoRotateSpeed = autoRotateSpeed;
	this.orbitControls.dampingFactor = CAMERA_DAMPING_FACTOR;
	this.orbitControls.enableDamping = true;
	this.orbitControls.enablePan = false;
	this.orbitControls.enableRotate = enableRotate;
	this.orbitControls.enableZoom = enableZoom;
	this.orbitControls.maxDistance = RADIUS * maxDistanceRadiusScale;
	this.orbitControls.maxPolarAngle = maxPolarAngle;
	this.orbitControls.minDistance = RADIUS * CAMERA_MIN_DISTANCE_RADIUS_SCALE;
	this.orbitControls.minPolarAngle = minPolarAngle;
	this.orbitControls.rotateSpeed = rotateSpeed;
	this.orbitControls.zoomSpeed = zoomSpeed;
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
	    // disable orbit controls when focused
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
		    this.enableOrbitControls(false);
		    this.camera.position.set(...from);
		},
		() => {
		    if (autoDefocus) {
			this.focus = undefined;
			this.preFocusPosition = undefined;
		    }
		    this.enableOrbitControls(true, autoDefocus);
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
			this.enableOrbitControls(false);
			this.camera.position.set(...from);
		    },
		    () => {
			this.preFocusPosition = undefined;
			this.enableOrbitControls(true);
		    },
		);
	    }
	}
    }

    updateGlobe(globeOptions = {}) {
	this.updateOptions(globeOptions, 'globe');
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
	} = this.options.globe;

	const globeBackground = this.getObjectByName(
	    ObjectName.GlobeBackground,
	);
	const globeClouds = this.getObjectByName(ObjectName.GlobeClouds);
	const globeSphere = this.getObjectByName(ObjectName.GlobeSphere);

	new TextureLoader().load(texture, map => {
	    console.log("Loaded texture:",texture);
	    new TextureLoader().load(bumpMap, bump => {
		console.log("Loaded bumpMap:",bumpMap);
		globeSphere.material = new MeshPhongMaterial({
		    map:map,
		    bumpMap:bump,   
		    bumpScale:5.0,
		}); //map,

		globeSphere.geometry = new SphereGeometry(
		    RADIUS,
		    GLOBE_SEGMENTS,
		    GLOBE_SEGMENTS,
		);
		//globeSphere.material = new MeshLambertMaterial({
		if (enableGlow) {
		    if (this.getObjectByName(ObjectName.GlobeGlow) !== undefined) {
			globeSphere.remove(this.getObjectByName(ObjectName.GlobeGlow));
		    };
		    const globeGlow = createGlowMesh(globeSphere.geometry, {
			backside: true,
			color: glowColor,
			coefficient: glowCoefficient,
			power: glowPower,
			size: RADIUS * glowRadiusScale,
		    });
		    globeGlow.name = ObjectName.GlobeGlow;
		    globeSphere.add(globeGlow);
		};
		this.callbacks.onTextureLoaded();
	    });
	},undefined,(err) => {console.error('Error gl-texture: ',texture,err);});

	if (enableBackground) {
	    new TextureLoader().load(backgroundTexture,map => {
		globeBackground.geometry = new SphereGeometry(
		    RADIUS * BACKGROUND_RADIUS_SCALE,
		    GLOBE_SEGMENTS,
		    GLOBE_SEGMENTS,
		);
		globeBackground.material = new MeshBasicMaterial({
		    map,
		    side: BackSide,
		});
	    },undefined,(err) => {console.error('Error bg-texture: ',backgroundTexture,err);});
	}
	if (enableClouds) {
            console.log("Loading cl texture:",cloudsTexture);
	    new TextureLoader().load(cloudsTexture, map => {
		globeClouds.geometry = new SphereGeometry(
		    RADIUS + CLOUDS_RADIUS_OFFSET,
		    GLOBE_SEGMENTS,
		    GLOBE_SEGMENTS,
		);
		globeClouds.material = new MeshLambertMaterial({
		    map,
		    transparent: true,
		});
		globeClouds.material.opacity = cloudsOpacity;
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
	    this.enableOrbitControls(true);
	    this.animate();
	}
    }
}
