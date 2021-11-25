import React, { useEffect, useRef } from 'react';
import TooltipWrapper from './TooltipWrapper';

import {
  defaultCameraOptions,
  defaultFocusOptions,
  defaultModelOptions,
  defaultLightOptions,
  defaultMarkerOptions,
  INITIAL_COORDINATES,
} from './defaults';
import Model from './Model';
import useResize from './useResize';

export default function ReactModel({
    state,
    animations,
    cameraOptions,
    focus,
    focusOptions,
    modelOptions,
    lightOptions,
    initialCoordinates,
    markers,
    markerOptions,
    onClickMarker,
    onDefocus,
    onMouseOutMarker,
    onMouseOverMarker,
    onGetModelInstance,
    onTextureLoaded,
    getTooltipContent,
    size: initialSize,
}) {
    const canvasRef = useRef();
    const modelInstanceRef = useRef();
    const mountRef = useRef();
    const tooltipRef = useRef();
    const size = useResize(mountRef, initialSize);
    
    // init
    useEffect(() => {
	//console.log("State:",state);
	const mount = mountRef.current;
	const modelInstance = new Model(state, canvasRef.current, tooltipRef.current);
	mount.appendChild(modelInstance.renderer.domElement);
	modelInstance.animate();
	modelInstanceRef.current = modelInstance;
	onGetModelInstance && onGetModelInstance(modelInstance);

	return () => {
	    mount.removeChild(modelInstance.renderer.domElement);
	    modelInstance.destroy();
	};
	// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // update callbacks
    useEffect(() => {
	modelInstanceRef.current.updateCallbacks({
	    onClickMarker,
	    onDefocus,
	    onMouseOutMarker,
	    onMouseOverMarker,
	    onTextureLoaded,
	});
    }, [
	onClickMarker,
	onDefocus,
	onMouseOutMarker,
	onMouseOverMarker,
	onTextureLoaded,
    ]);

    // update camera
    useEffect(() => {
	modelInstanceRef.current.updateCamera(initialCoordinates, cameraOptions);
    }, [cameraOptions, initialCoordinates]);

    // update focus
    useEffect(() => {
	modelInstanceRef.current.updateFocus(focus, focusOptions);
    }, [focus, focusOptions]);

    // update model
    useEffect(() => {
	modelInstanceRef.current.updateModel(modelOptions);
    }, [modelOptions]);

    // update lights
    useEffect(() => {
	modelInstanceRef.current.updateLights(lightOptions);
    }, [lightOptions]);

    // update markers
    useEffect(() => {
	modelInstanceRef.current.updateMarkers(markers, markerOptions);
    }, [markerOptions, markers]);

    // apply animations
    useEffect(() => {
	return modelInstanceRef.current.applyAnimations(animations);
    }, [animations]);

    // resize
    useEffect(() => {
	modelInstanceRef.current.updateSize(size);
    }, [size]);

    return (
	    <div ref={mountRef} style={{ height: '100%', width: '100%' }}>
	    <canvas ref={canvasRef} style={{ display: 'block' }} />
	    <TooltipWrapper ref={tooltipRef} getTooltipContent={getTooltipContent}/>
	    </div>
    );
}

ReactModel.defaultProps = {
    animations: [],
    cameraOptions: defaultCameraOptions,
    focusOptions: defaultFocusOptions,
    modelOptions: defaultModelOptions,
    lightOptions: defaultLightOptions,
    initialCoordinates: INITIAL_COORDINATES,
    markers: [],
    markerOptions: defaultMarkerOptions,
};
