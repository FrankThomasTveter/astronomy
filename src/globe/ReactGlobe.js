import React, { useEffect, useRef } from 'react';
import TooltipWrapper from './TooltipWrapper';

import {
  defaultCameraOptions,
  defaultFocusOptions,
  defaultGlobeOptions,
  defaultLightOptions,
  defaultMarkerOptions,
  INITIAL_COORDINATES,
} from './defaults';
import Globe from './Globe';
import useResize from './useResize';

export default function ReactGlobe({
  animations,
  cameraOptions,
  focus,
  focusOptions,
  globeOptions,
  lightOptions,
  initialCoordinates,
  markers,
  markerOptions,
  onClickMarker,
  onDefocus,
  onMouseOutMarker,
  onMouseOverMarker,
  onGetGlobeInstance,
  onTextureLoaded,
  getTooltipContent,
  size: initialSize,
}) {
  const canvasRef = useRef();
  const globeInstanceRef = useRef();
  const mountRef = useRef();
  const tooltipRef = useRef();
  const size = useResize(mountRef, initialSize);

  // init
  useEffect(() => {
    const mount = mountRef.current;
    const globeInstance = new Globe(canvasRef.current, tooltipRef.current);
    mount.appendChild(globeInstance.renderer.domElement);
    globeInstance.animate();
    globeInstanceRef.current = globeInstance;
    onGetGlobeInstance && onGetGlobeInstance(globeInstance);

    return () => {
      mount.removeChild(globeInstance.renderer.domElement);
      globeInstance.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update callbacks
  useEffect(() => {
    globeInstanceRef.current.updateCallbacks({
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
    globeInstanceRef.current.updateCamera(initialCoordinates, cameraOptions);
  }, [cameraOptions, initialCoordinates]);

  // update focus
  useEffect(() => {
    globeInstanceRef.current.updateFocus(focus, focusOptions);
  }, [focus, focusOptions]);

  // update globe
  useEffect(() => {
    globeInstanceRef.current.updateGlobe(globeOptions);
  }, [globeOptions]);

  // update lights
  useEffect(() => {
    globeInstanceRef.current.updateLights(lightOptions);
  }, [lightOptions]);

  // update markers
  useEffect(() => {
    globeInstanceRef.current.updateMarkers(markers, markerOptions);
  }, [markerOptions, markers]);

  // apply animations
  useEffect(() => {
    return globeInstanceRef.current.applyAnimations(animations);
  }, [animations]);

  // resize
  useEffect(() => {
    globeInstanceRef.current.updateSize(size);
  }, [size]);

  return (
    <div ref={mountRef} style={{ height: '100%', width: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
	  <TooltipWrapper ref={tooltipRef} getTooltipContent={getTooltipContent}/>
    </div>
  );
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
