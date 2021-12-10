import React, { useEffect, useRef } from 'react';
import TooltipWrapper from './TooltipWrapper';

import {
  defaultCameraOptions,
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
    modelOptions,
    initialCoordinates,
    onGetModelInstance,
    onTextureLoaded,
    getTooltipContent,
    size: initialSize,
}) {
    const canvasRef        = useRef();
    const modelInstanceRef = useRef();
    const mountRef         = useRef();
    const tooltipRef       = useRef();
    const size             = useResize(mountRef, initialSize);
    //const mouse = useRef([0, 0])
    // init
    useEffect(() => {
	//console.log("State:",state);
	const mount = mountRef.current;
	const modelInstance = new Model(state, canvasRef.current);//, mouse.current
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
	    onTextureLoaded,
	});
    }, [
	onTextureLoaded,
    ]);

    // update camera
    useEffect(() => {
	modelInstanceRef.current.reconfigCamera(initialCoordinates, cameraOptions);
    }, [cameraOptions, initialCoordinates]);

    // update model
    useEffect(() => {
	modelInstanceRef.current.reconfigModel(modelOptions);
    }, [modelOptions]);

    // apply animations
    useEffect(() => {
	return modelInstanceRef.current.applyAnimations(animations);
    }, [animations]);
    
    // resize
    useEffect(() => {
	modelInstanceRef.current.reconfigSize(size);
    }, [size]);

    return (
	    <div ref={mountRef} style={{ height: '100%', width: '100%' }}>
	    <canvas ref={canvasRef} style={{ display: 'block' }}/>
	    <TooltipWrapper ref={tooltipRef} getTooltipContent={getTooltipContent}/>
	    </div>
    );
}

ReactModel.defaultProps = {
    animations: [],
    cameraOptions: defaultCameraOptions,
    modelOptions: defaultModelOptions,
    initialCoordinates: INITIAL_COORDINATES,
};



//   	onMouseMove={e => {let x=e.clientX;let y=e.clientY; mouse.current = [x, y]}}>
