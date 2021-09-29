import React, { useState, useEffect, useRef } from 'react';
import { scaleLinear } from 'd3-scale';
import { Tween, Easing, update } from 'es6-tween';
import { TextureLoader, SphereGeometry, MeshLambertMaterial, MeshBasicMaterial, BackSide, Color, Mesh, BoxGeometry, Vector3, WebGLRenderer, PerspectiveCamera, AmbientLight, PointLight, Group, Scene } from 'three';
import { createGlowMesh } from 'three-glow-mesh';
import OrbitControls from 'three-orbitcontrols';
import { Interaction } from 'three.interaction';
import tippy from 'tippy.js';
import ResizeObserver from 'resize-observer-polyfill';

var ObjectName;
(function (ObjectName) {
    ObjectName["Camera"] = "CAMERA";
    ObjectName["CameraAmbientLight"] = "CAMERA_AMBIENT_LIGHT";
    ObjectName["CameraPointLight"] = "CAMERA_POINT_LIGHT";
    ObjectName["Globe"] = "GLOBE";
    ObjectName["GlobeBackground"] = "GLOBE_BACKGROUND";
    ObjectName["GlobeClouds"] = "GLOBE_CLOUDS";
    ObjectName["GlobeGlow"] = "GLOBE_GLOW";
    ObjectName["GlobeSphere"] = "GLOBE_SPHERE";
    ObjectName["MarkerObjects"] = "MARKER_OBJECTS";
    ObjectName["Scene"] = "SCENE";
})(ObjectName || (ObjectName = {}));
var MarkerType;
(function (MarkerType) {
    MarkerType["Bar"] = "bar";
    MarkerType["Dot"] = "dot";
})(MarkerType || (MarkerType = {}));

// hardcoded constants that can eventually be exposed via options
var RADIUS = 300;
var BACKGROUND_RADIUS_SCALE = 10;
var CAMERA_FAR = RADIUS * 100;
var CAMERA_FOV = 45;
var CAMERA_NEAR = 1;
var CAMERA_DAMPING_FACTOR = 0.1;
var CAMERA_MAX_POLAR_ANGLE = Math.PI;
var CAMERA_MIN_POLAR_ANGLE = 0;
var CAMERA_MIN_DISTANCE_RADIUS_SCALE = 1.1;
var CLOUDS_RADIUS_OFFSET = 1;
var GLOBE_SEGMENTS = 50;
var INITIAL_COORDINATES = [37.773972, -122.431297];
var MARKER_DEFAULT_COLOR = 'gold';
var MARKER_SEGMENTS = 10;
var MARKER_UNIT_RADIUS_SCALE = 0.01;
var MARKER_ACTIVE_ANIMATION_DURATION = 100;
var MARKER_ACTIVE_ANIMATION_EASING_FUNCTION = [
    'Cubic',
    'In',
];
var defaultCameraOptions = {
    autoRotateSpeed: 0.1,
    distanceRadiusScale: 3,
    enableAutoRotate: true,
    enableRotate: true,
    enableZoom: true,
    maxDistanceRadiusScale: 4,
    maxPolarAngle: CAMERA_MAX_POLAR_ANGLE,
    minPolarAngle: CAMERA_MIN_POLAR_ANGLE,
    rotateSpeed: 0.2,
    zoomSpeed: 1,
};
var defaultFocusOptions = {
    animationDuration: 1000,
    distanceRadiusScale: 1.5,
    easingFunction: ['Cubic', 'Out'],
    enableDefocus: true,
};
var defaultGlobeOptions = {
    backgroundTexture: 'https://raw.githubusercontent.com/chrisrzhou/react-globe/master/textures/background.png',
    cloudsOpacity: 0.3,
    cloudsTexture: 'https://raw.githubusercontent.com/chrisrzhou/react-globe/master/textures/clouds.png',
    enableBackground: true,
    enableClouds: true,
    enableGlow: true,
    glowCoefficient: 0.1,
    glowColor: '#d1d1d1',
    glowPower: 3,
    glowRadiusScale: 0.2,
    texture: 'https://raw.githubusercontent.com/chrisrzhou/react-globe/master/textures/globe.jpg',
};
var defaultLightOptions = {
    ambientLightColor: 'white',
    ambientLightIntensity: 0.8,
    pointLightColor: 'white',
    pointLightIntensity: 1,
    pointLightPositionRadiusScales: [-2, 1, -1],
};
var defaultDotMarkerOptions = {
    activeScale: 1.3,
    enableGlow: true,
    enableTooltip: true,
    enterAnimationDuration: 1000,
    enterEasingFunction: ['Linear', 'None'],
    exitAnimationDuration: 500,
    exitEasingFunction: ['Cubic', 'Out'],
    getTooltipContent: function (marker) { return JSON.stringify(marker.coordinates); },
    glowCoefficient: 0,
    glowPower: 3,
    glowRadiusScale: 2,
    radiusScaleRange: [0.005, 0.02],
    type: MarkerType.Dot,
};
var defaultBarMarkerOptions = {
    activeScale: 1.02,
    enableGlow: false,
    enableTooltip: true,
    enterAnimationDuration: 2000,
    enterEasingFunction: ['Linear', 'None'],
    exitAnimationDuration: 1000,
    exitEasingFunction: ['Cubic', 'Out'],
    getTooltipContent: function (marker) { return JSON.stringify(marker.coordinates); },
    glowCoefficient: 0,
    glowPower: 3,
    glowRadiusScale: 2,
    offsetRadiusScale: 0,
    radiusScaleRange: [0.2, defaultFocusOptions.distanceRadiusScale - 1],
    type: MarkerType.Bar,
};
var defaultMarkerOptions = defaultDotMarkerOptions;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var TOOLTIP_OFFSET = 10;
var Tooltip = /** @class */ (function () {
    function Tooltip(div) {
        this.div = div;
        this.instance = tippy(this.div, {
            animation: 'scale',
        });
    }
    Tooltip.prototype.destroy = function () {
        this.instance.destroy();
    };
    Tooltip.prototype.hide = function () {
        document.body.style.cursor = 'inherit';
        this.div.style.position = 'fixed';
        this.div.style.left = '0';
        this.div.style.top = '0';
        this.instance.hide();
    };
    Tooltip.prototype.show = function (clientX, clientY, content) {
        document.body.style.cursor = 'pointer';
        this.div.style.position = 'fixed';
        this.div.style.left = clientX + TOOLTIP_OFFSET + "px";
        this.div.style.top = clientY + TOOLTIP_OFFSET + "px";
        this.instance.setContent(content);
        this.instance.show();
    };
    return Tooltip;
}());

function coordinatesToPosition(coordinates, radius) {
    var lat = coordinates[0], long = coordinates[1];
    var phi = (lat * Math.PI) / 180;
    var theta = ((long - 180) * Math.PI) / 180;
    var x = -radius * Math.cos(phi) * Math.cos(theta);
    var y = radius * Math.sin(phi);
    var z = radius * Math.cos(phi) * Math.sin(theta);
    return [x, y, z];
}
function getMarkerCoordinatesKey(marker) {
    return marker.coordinates.toString();
}
function maxValue(array, callback) {
    var maxValue = 0;
    array.forEach(function (item) {
        if (callback(item) > maxValue) {
            maxValue = callback(item);
        }
    });
    return maxValue;
}
function minValue(array, callback) {
    var minValue = Infinity;
    array.forEach(function (item) {
        if (callback(item) < minValue) {
            minValue = callback(item);
        }
    });
    return minValue;
}
function tween(from, to, animationDuration, easingFunction, onUpdate, onEnd) {
    new Tween(from)
        .to(to, animationDuration)
        .easing(Easing[easingFunction[0]][easingFunction[1]])
        .on('update', onUpdate)
        .on('complete', onEnd)
        .start();
}

var emptyFunction = function () { };
var defaultCallbacks = {
    onClickMarker: emptyFunction,
    onDefocus: emptyFunction,
    onMouseOutMarker: emptyFunction,
    onMouseOverMarker: emptyFunction,
    onTextureLoaded: emptyFunction,
};
var defaultOptions = {
    camera: defaultCameraOptions,
    globe: defaultGlobeOptions,
    focus: defaultFocusOptions,
    marker: defaultMarkerOptions,
    light: defaultLightOptions,
};
var Globe = /** @class */ (function () {
    function Globe(canvas, tooltipDiv) {
        var _this = this;
        // create objects
        var renderer = new WebGLRenderer({
            alpha: true,
            antialias: true,
            canvas: canvas,
        });
        var camera = new PerspectiveCamera();
        var cameraAmbientLight = new AmbientLight('white');
        var cameraPointLight = new PointLight('white');
        var globe = new Group();
        var globeBackground = new Mesh();
        var globeClouds = new Mesh();
        var globeSphere = new Mesh();
        var markerObjects = new Group();
        var orbitControls = new OrbitControls(camera, renderer.domElement);
        var scene = new Scene();
        var tooltip = new Tooltip(tooltipDiv);
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
        new Interaction(renderer, scene, camera);
        scene.on('mousemove', function (event) {
            if (_this.isFocusing()) {
                return;
            }
            if (_this.activeMarker) {
                var activeScale = _this.options.marker.activeScale;
                var from_1 = [activeScale, activeScale, activeScale];
                tween(from_1, [1, 1, 1], MARKER_ACTIVE_ANIMATION_DURATION, MARKER_ACTIVE_ANIMATION_EASING_FUNCTION, function () {
                    var _a;
                    if (_this.activeMarkerObject) {
                        (_a = _this.activeMarkerObject.scale).set.apply(_a, from_1);
                    }
                }, function () {
                    _this.activeMarker = undefined;
                    _this.activeMarkerObject = undefined;
                });
                _this.callbacks.onMouseOutMarker(_this.activeMarker, _this.activeMarkerObject, event.data.originalEvent);
                _this.tooltip.hide();
            }
        });
        scene.on('click', function (event) {
            if (_this.isFocusing()) {
                return;
            }
            if (_this.options.focus.enableDefocus && _this.preFocusPosition) {
                _this.callbacks.onDefocus(_this.focus, event.data.originalEvent);
                _this.updateFocus(undefined, _this.options.focus);
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
    Globe.prototype.animate = function () {
        this.render();
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    };
    // TODO: expose a way to customize animating clouds in every axis
    Globe.prototype.animateClouds = function () {
        var globeClouds = this.getObjectByName(ObjectName.GlobeClouds);
        ['x', 'y', 'z'].forEach(function (axis) {
            globeClouds.rotation[axis] += Math.random() / 10000;
        });
    };
    // For each animation, update the focus and focusOptions provided by the animation over an array of timeouts
    Globe.prototype.applyAnimations = function (animations) {
        var _this = this;
        var currentFocus = this.focus;
        var currentFocusOptions = this.options.focus;
        var wait = 0;
        var timeouts = [];
        animations.forEach(function (animation) {
            var animationDuration = animation.animationDuration, coordinates = animation.coordinates, distanceRadiusScale = animation.distanceRadiusScale, easingFunction = animation.easingFunction;
            var timeout = setTimeout(function () {
                _this.updateFocus(coordinates, {
                    animationDuration: animationDuration,
                    distanceRadiusScale: distanceRadiusScale,
                    easingFunction: easingFunction,
                }, true);
            }, wait);
            timeouts.push(timeout);
            wait += animationDuration;
        });
        // return cleanup function
        return function () {
            timeouts.forEach(function (timeout) {
                clearTimeout(timeout);
            });
            _this.updateFocus(currentFocus, currentFocusOptions);
        };
    };
    Globe.prototype.destroy = function () {
        cancelAnimationFrame(this.animationFrameId);
        this.tooltip.destroy();
    };
    Globe.prototype.enableOrbitControls = function (enabled, autoRotate) {
        if (autoRotate === void 0) { autoRotate = enabled; }
        this.orbitControls.enabled = enabled;
        this.orbitControls.autoRotate = autoRotate;
    };
    Globe.prototype.freeze = function () {
        this.isFrozen = true;
        this.enableOrbitControls(false);
        cancelAnimationFrame(this.animationFrameId);
    };
    Globe.prototype.getObjectByName = function (name) {
        return this.scene.getObjectByName(name);
    };
    Globe.prototype.isFocusing = function () {
        return !this.orbitControls.enabled;
    };
    Globe.prototype.render = function () {
        this.renderer.sortObjects = false;
        this.renderer.render(this.scene, this.camera);
        this.animateClouds();
        this.orbitControls.update();
        update();
    };
    Globe.prototype.updateCallbacks = function (callbacks) {
        var _this = this;
        if (callbacks === void 0) { callbacks = {}; }
        Object.keys(defaultCallbacks).forEach(function (key) {
            _this.callbacks[key] = callbacks[key] || defaultCallbacks[key];
        });
    };
    Globe.prototype.updateCamera = function (initialCoordinates, cameraOptions) {
        if (initialCoordinates === void 0) { initialCoordinates = INITIAL_COORDINATES; }
        if (cameraOptions === void 0) { cameraOptions = {}; }
        this.updateOptions(cameraOptions, 'camera');
        var _a = this.options.camera, autoRotateSpeed = _a.autoRotateSpeed, distanceRadiusScale = _a.distanceRadiusScale, enableAutoRotate = _a.enableAutoRotate, enableRotate = _a.enableRotate, enableZoom = _a.enableZoom, maxDistanceRadiusScale = _a.maxDistanceRadiusScale, maxPolarAngle = _a.maxPolarAngle, minPolarAngle = _a.minPolarAngle, rotateSpeed = _a.rotateSpeed, zoomSpeed = _a.zoomSpeed;
        if (this.initialCoordinates !== initialCoordinates) {
            var _b = coordinatesToPosition(initialCoordinates, RADIUS * distanceRadiusScale), x = _b[0], y = _b[1], z = _b[2];
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
    };
    Globe.prototype.updateFocus = function (focus, focusOptions, autoDefocus) {
        var _this = this;
        if (focusOptions === void 0) { focusOptions = {}; }
        if (autoDefocus === void 0) { autoDefocus = false; }
        this.updateOptions(focusOptions, 'focus');
        this.focus = focus;
        var _a = this.options.focus, animationDuration = _a.animationDuration, distanceRadiusScale = _a.distanceRadiusScale, easingFunction = _a.easingFunction;
        if (this.isFrozen) {
            return;
        }
        if (this.focus) {
            // disable orbit controls when focused
            var from_2 = [
                this.camera.position.x,
                this.camera.position.y,
                this.camera.position.z,
            ];
            var to = coordinatesToPosition(this.focus, RADIUS * distanceRadiusScale);
            this.preFocusPosition = this.preFocusPosition || __spreadArrays(from_2);
            tween(from_2, to, animationDuration, easingFunction, function () {
                var _a;
                _this.enableOrbitControls(false);
                (_a = _this.camera.position).set.apply(_a, from_2);
            }, function () {
                if (autoDefocus) {
                    _this.focus = undefined;
                    _this.preFocusPosition = undefined;
                }
                _this.enableOrbitControls(true, autoDefocus);
            });
        }
        else {
            if (this.preFocusPosition) {
                var from_3 = [
                    this.camera.position.x,
                    this.camera.position.y,
                    this.camera.position.z,
                ];
                var to = this.preFocusPosition;
                tween(from_3, to, animationDuration, easingFunction, function () {
                    var _a;
                    _this.enableOrbitControls(false);
                    (_a = _this.camera.position).set.apply(_a, from_3);
                }, function () {
                    _this.preFocusPosition = undefined;
                    _this.enableOrbitControls(true);
                });
            }
        }
    };
    Globe.prototype.updateGlobe = function (globeOptions) {
        var _this = this;
        if (globeOptions === void 0) { globeOptions = {}; }
        this.updateOptions(globeOptions, 'globe');
        var _a = this.options.globe, backgroundTexture = _a.backgroundTexture, cloudsOpacity = _a.cloudsOpacity, cloudsTexture = _a.cloudsTexture, enableBackground = _a.enableBackground, enableClouds = _a.enableClouds, enableGlow = _a.enableGlow, glowColor = _a.glowColor, glowCoefficient = _a.glowCoefficient, glowPower = _a.glowPower, glowRadiusScale = _a.glowRadiusScale, texture = _a.texture;
        var globeBackground = this.getObjectByName(ObjectName.GlobeBackground);
        var globeClouds = this.getObjectByName(ObjectName.GlobeClouds);
        var globeSphere = this.getObjectByName(ObjectName.GlobeSphere);
        new TextureLoader().load(texture, function (map) {
            globeSphere.geometry = new SphereGeometry(RADIUS, GLOBE_SEGMENTS, GLOBE_SEGMENTS);
            globeSphere.material = new MeshLambertMaterial({
                map: map,
            });
            if (enableGlow) {
                globeSphere.remove(_this.getObjectByName(ObjectName.GlobeGlow));
                var globeGlow = createGlowMesh(globeSphere.geometry, {
                    backside: true,
                    color: glowColor,
                    coefficient: glowCoefficient,
                    power: glowPower,
                    size: RADIUS * glowRadiusScale,
                });
                globeGlow.name = ObjectName.GlobeGlow;
                globeSphere.add(globeGlow);
            }
            _this.callbacks.onTextureLoaded();
        });
        if (enableBackground) {
            new TextureLoader().load(backgroundTexture, function (map) {
                globeBackground.geometry = new SphereGeometry(RADIUS * BACKGROUND_RADIUS_SCALE, GLOBE_SEGMENTS, GLOBE_SEGMENTS);
                globeBackground.material = new MeshBasicMaterial({
                    map: map,
                    side: BackSide,
                });
            });
        }
        if (enableClouds) {
            new TextureLoader().load(cloudsTexture, function (map) {
                globeClouds.geometry = new SphereGeometry(RADIUS + CLOUDS_RADIUS_OFFSET, GLOBE_SEGMENTS, GLOBE_SEGMENTS);
                globeClouds.material = new MeshLambertMaterial({
                    map: map,
                    transparent: true,
                });
                globeClouds.material.opacity = cloudsOpacity;
            });
        }
    };
    Globe.prototype.updateLights = function (lightOptions) {
        if (lightOptions === void 0) { lightOptions = {}; }
        this.updateOptions(lightOptions, 'light');
        var _a = this.options.light, ambientLightColor = _a.ambientLightColor, ambientLightIntensity = _a.ambientLightIntensity, pointLightColor = _a.pointLightColor, pointLightIntensity = _a.pointLightIntensity, pointLightPositionRadiusScales = _a.pointLightPositionRadiusScales;
        var cameraAmbientLight = this.getObjectByName(ObjectName.CameraAmbientLight);
        var cameraPointLight = this.getObjectByName(ObjectName.CameraPointLight);
        cameraAmbientLight.color = new Color(ambientLightColor);
        cameraAmbientLight.intensity = ambientLightIntensity;
        cameraPointLight.color = new Color(pointLightColor);
        cameraPointLight.intensity = pointLightIntensity;
        cameraPointLight.position.set(RADIUS * pointLightPositionRadiusScales[0], RADIUS * pointLightPositionRadiusScales[1], RADIUS * pointLightPositionRadiusScales[2]);
    };
    Globe.prototype.updateMarkers = function (markers, markerOptions) {
        var _this = this;
        if (markers === void 0) { markers = []; }
        if (markerOptions === void 0) { markerOptions = {}; }
        this.updateOptions(markerOptions, 'marker');
        var _a = this.options.marker, activeScale = _a.activeScale, enableGlow = _a.enableGlow, enableTooltip = _a.enableTooltip, enterAnimationDuration = _a.enterAnimationDuration, enterEasingFunction = _a.enterEasingFunction, exitAnimationDuration = _a.exitAnimationDuration, exitEasingFunction = _a.exitEasingFunction, getTooltipContent = _a.getTooltipContent, glowCoefficient = _a.glowCoefficient, glowPower = _a.glowPower, glowRadiusScale = _a.glowRadiusScale, offsetRadiusScale = _a.offsetRadiusScale, radiusScaleRange = _a.radiusScaleRange, renderer = _a.renderer, type = _a.type;
        var unitRadius = RADIUS * MARKER_UNIT_RADIUS_SCALE;
        var sizeScale = scaleLinear()
            .domain([
            minValue(markers, function (marker) { return marker.value; }),
            maxValue(markers, function (marker) { return marker.value; }),
        ])
            .range([RADIUS * radiusScaleRange[0], RADIUS * radiusScaleRange[1]]);
        var markerCoordinatesKeys = new Set(markers.map(getMarkerCoordinatesKey));
        var markerObjectNames = new Set(this.markerObjects.children.map(function (markerObject) { return markerObject.name; }));
        markers.forEach(function (marker) {
            var _a;
            var coordinates = marker.coordinates, value = marker.value;
            var markerCoordinatesKey = getMarkerCoordinatesKey(marker);
            var size = sizeScale(value);
            var markerObject;
            // create new marker objects
            if (!markerObjectNames.has(markerCoordinatesKey)) {
                if (renderer !== undefined) {
                    markerObject = renderer(marker);
                }
                else {
                    var color_1 = marker.color || MARKER_DEFAULT_COLOR;
                    var from_4 = { size: 0 };
                    var to = { size: size };
                    var mesh_1 = new Mesh();
                    tween(from_4, to, enterAnimationDuration, enterEasingFunction, function () {
                        switch (type) {
                            case MarkerType.Bar:
                                mesh_1.geometry = new BoxGeometry(unitRadius, unitRadius, from_4.size);
                                mesh_1.material = new MeshLambertMaterial({
                                    color: color_1,
                                });
                                break;
                            case MarkerType.Dot:
                            default:
                                mesh_1.geometry = new SphereGeometry(from_4.size, MARKER_SEGMENTS, MARKER_SEGMENTS);
                                mesh_1.material = new MeshBasicMaterial({ color: color_1 });
                                if (enableGlow) {
                                    // add glow
                                    var glowMesh = createGlowMesh(mesh_1.geometry.clone(), {
                                        backside: false,
                                        color: color_1,
                                        coefficient: glowCoefficient,
                                        power: glowPower,
                                        size: from_4.size * glowRadiusScale,
                                    });
                                    mesh_1.children = [];
                                    mesh_1.add(glowMesh);
                                }
                        }
                    });
                    markerObject = mesh_1;
                }
                // place markers
                var heightOffset = 0;
                if (offsetRadiusScale !== undefined) {
                    heightOffset = RADIUS * offsetRadiusScale;
                }
                else {
                    if (type === MarkerType.Dot) {
                        heightOffset = (size * (1 + glowRadiusScale)) / 2;
                    }
                    else {
                        heightOffset = 0;
                    }
                }
                var position = coordinatesToPosition(coordinates, RADIUS + heightOffset);
                (_a = markerObject.position).set.apply(_a, position);
                markerObject.lookAt(new Vector3(0, 0, 0));
                markerObject.name = markerCoordinatesKey;
                _this.markerObjects.add(markerObject);
            }
            // update existing marker objects
            markerObject = _this.markerObjects.getObjectByName(markerCoordinatesKey);
            var handleClick = function (event) {
                event.stopPropagation();
                _this.updateFocus(marker.coordinates);
                _this.callbacks.onClickMarker(marker, markerObject, event.data.originalEvent);
            };
            markerObject.on('click', handleClick.bind(_this));
            markerObject.on('touchstart', handleClick.bind(_this));
            markerObject.on('mousemove', function (event) {
                if (_this.isFocusing()) {
                    _this.tooltip.hide();
                    return;
                }
                event.stopPropagation();
                var from = markerObject.scale.toArray();
                tween(from, [activeScale, activeScale, activeScale], MARKER_ACTIVE_ANIMATION_DURATION, MARKER_ACTIVE_ANIMATION_EASING_FUNCTION, function () {
                    var _a;
                    if (markerObject) {
                        (_a = markerObject.scale).set.apply(_a, from);
                    }
                });
                var originalEvent = event.data.originalEvent;
                _this.activeMarker = marker;
                _this.activeMarkerObject = markerObject;
                _this.callbacks.onMouseOverMarker(marker, markerObject, originalEvent);
                if (enableTooltip) {
                    _this.tooltip.show(originalEvent.clientX, originalEvent.clientY, getTooltipContent(marker));
                }
            });
        });
        // remove marker objects that are stale
        var markerObjectsToRemove = this.markerObjects.children.filter(function (markerObject) { return !markerCoordinatesKeys.has(markerObject.name); });
        markerObjectsToRemove.forEach(function (markerObject) {
            var from = markerObject.scale.toArray();
            tween(from, [0, 0, 0], exitAnimationDuration, exitEasingFunction, function () {
                var _a;
                if (markerObject) {
                    (_a = markerObject.scale).set.apply(_a, from);
                }
            }, function () {
                _this.markerObjects.remove(markerObject);
            });
        });
    };
    Globe.prototype.updateOptions = function (options, key) {
        var _a;
        this.options = __assign(__assign({}, defaultOptions), (_a = {}, _a[key] = __assign(__assign({}, defaultOptions[key]), options), _a));
    };
    Globe.prototype.updateSize = function (size) {
        if (size) {
            var width = size[0], height = size[1];
            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
        }
        this.camera.updateProjectionMatrix();
    };
    Globe.prototype.unfreeze = function () {
        if (this.isFrozen) {
            this.isFrozen = false;
            this.enableOrbitControls(true);
            this.animate();
        }
    };
    return Globe;
}());

function useResize(mountRef, initialSize) {
    var _a = useState([0, 0]), size = _a[0], setSize = _a[1];
    useEffect(function () {
        var mount = mountRef.current;
        // update initial size
        var width = 0;
        var height = 0;
        if (initialSize) {
            // Use initialSize if it is provided
            width = initialSize[0], height = initialSize[1];
        }
        else {
            // Use parentElement size if resized has not updated
            width = mount.offsetWidth;
            height = mount.offsetHeight;
        }
        setSize([width, height]);
        // update resize using a resize observer
        var resizeObserver = new ResizeObserver(function (entries) {
            if (!entries || !entries.length) {
                return;
            }
            if (initialSize === undefined) {
                var _a = entries[0].contentRect, width_1 = _a.width, height_1 = _a.height;
                setSize([width_1, height_1]);
            }
        });
        resizeObserver.observe(mount);
        return function () {
            resizeObserver.unobserve(mount);
        };
    }, [initialSize, mountRef]);
    return size;
}

function ReactGlobe(_a) {
    var animations = _a.animations, cameraOptions = _a.cameraOptions, focus = _a.focus, focusOptions = _a.focusOptions, globeOptions = _a.globeOptions, lightOptions = _a.lightOptions, initialCoordinates = _a.initialCoordinates, markers = _a.markers, markerOptions = _a.markerOptions, onClickMarker = _a.onClickMarker, onDefocus = _a.onDefocus, onMouseOutMarker = _a.onMouseOutMarker, onMouseOverMarker = _a.onMouseOverMarker, onGetGlobeInstance = _a.onGetGlobeInstance, onTextureLoaded = _a.onTextureLoaded, initialSize = _a.size;
    var canvasRef = useRef();
    var globeInstanceRef = useRef();
    var mountRef = useRef();
    var tooltipRef = useRef();
    var size = useResize(mountRef, initialSize);
    // init
    useEffect(function () {
        var mount = mountRef.current;
        var globeInstance = new Globe(canvasRef.current, tooltipRef.current);
        mount.appendChild(globeInstance.renderer.domElement);
        globeInstance.animate();
        globeInstanceRef.current = globeInstance;
        onGetGlobeInstance && onGetGlobeInstance(globeInstance);
        return function () {
            mount.removeChild(globeInstance.renderer.domElement);
            globeInstance.destroy();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // update callbacks
    useEffect(function () {
        globeInstanceRef.current.updateCallbacks({
            onClickMarker: onClickMarker,
            onDefocus: onDefocus,
            onMouseOutMarker: onMouseOutMarker,
            onMouseOverMarker: onMouseOverMarker,
            onTextureLoaded: onTextureLoaded,
        });
    }, [
        onClickMarker,
        onDefocus,
        onMouseOutMarker,
        onMouseOverMarker,
        onTextureLoaded,
    ]);
    // update camera
    useEffect(function () {
        globeInstanceRef.current.updateCamera(initialCoordinates, cameraOptions);
    }, [cameraOptions, initialCoordinates]);
    // update focus
    useEffect(function () {
        globeInstanceRef.current.updateFocus(focus, focusOptions);
    }, [focus, focusOptions]);
    // update globe
    useEffect(function () {
        globeInstanceRef.current.updateGlobe(globeOptions);
    }, [globeOptions]);
    // update lights
    useEffect(function () {
        globeInstanceRef.current.updateLights(lightOptions);
    }, [lightOptions]);
    // update markers
    useEffect(function () {
        globeInstanceRef.current.updateMarkers(markers, markerOptions);
    }, [markerOptions, markers]);
    // apply animations
    useEffect(function () {
        return globeInstanceRef.current.applyAnimations(animations);
    }, [animations]);
    // resize
    useEffect(function () {
        globeInstanceRef.current.updateSize(size);
    }, [size]);
    return (React.createElement("div", { ref: mountRef, style: { height: '100%', width: '100%' } },
        React.createElement("canvas", { ref: canvasRef, style: { display: 'block' } }),
        React.createElement("div", { ref: tooltipRef })));
}
ReactGlobe.defaultProps = {
    animations: [],
    cameraOptions: defaultCameraOptions,
    focusOptions: defaultFocusOptions,
    globeOptions: defaultGlobeOptions,
    lightOptions: defaultLightOptions,
    initialCoordinates: INITIAL_COORDINATES,
    markers: [],
    markerOptions: defaultMarkerOptions,
};

export default ReactGlobe;
export { BACKGROUND_RADIUS_SCALE, CAMERA_DAMPING_FACTOR, CAMERA_FAR, CAMERA_FOV, CAMERA_MAX_POLAR_ANGLE, CAMERA_MIN_DISTANCE_RADIUS_SCALE, CAMERA_MIN_POLAR_ANGLE, CAMERA_NEAR, CLOUDS_RADIUS_OFFSET, GLOBE_SEGMENTS, Globe, INITIAL_COORDINATES, MARKER_ACTIVE_ANIMATION_DURATION, MARKER_ACTIVE_ANIMATION_EASING_FUNCTION, MARKER_DEFAULT_COLOR, MARKER_SEGMENTS, MARKER_UNIT_RADIUS_SCALE, MarkerType, ObjectName, RADIUS, Tooltip, coordinatesToPosition, defaultBarMarkerOptions, defaultCameraOptions, defaultDotMarkerOptions, defaultFocusOptions, defaultGlobeOptions, defaultLightOptions, defaultMarkerOptions, getMarkerCoordinatesKey, maxValue, minValue, tween };
