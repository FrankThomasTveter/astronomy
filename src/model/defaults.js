import {
  //CameraOptions,
  //Coordinates,
  //EasingFunction,
  //FocusOptions,
  //ModelOptions,
  //LightOptions,
  //MarkerOptions,
  MarkerType,
} from './types';

// hardcoded constants that can eventually be exposed via options
export const RADIUS = 300;
export const BACKGROUND_RADIUS_SCALE = 10;
export const CAMERA_FAR = RADIUS * 100;
export const CAMERA_FOV = 45;
export const CAMERA_NEAR = 1;
export const CAMERA_DAMPING_FACTOR = 0.1;
export const CAMERA_MAX_POLAR_ANGLE = Math.PI;
export const CAMERA_MIN_POLAR_ANGLE = 0;
export const CAMERA_MIN_DISTANCE_RADIUS_SCALE = 1.1;
export const CLOUDS_RADIUS_OFFSET = 1;
export const MODEL_SEGMENTS = 50;
export const INITIAL_COORDINATES = [37.773972, -122.431297];
export const MARKER_DEFAULT_COLOR = 'gold';
export const MARKER_SEGMENTS = 10;
export const MARKER_UNIT_RADIUS_SCALE = 0.01;
export const MARKER_ACTIVE_ANIMATION_DURATION = 100;
export const MARKER_ACTIVE_ANIMATION_EASING_FUNCTION = [
  'Cubic',
  'In',
];

export const defaultCameraOptions = {
  autoRotateSpeed: 0.1,
  distanceRadiusScale: 3,
  enableAutoRotate: true,
  enableRotate: true,
  enableZoom: true,
  maxDistanceRadiusScale: 4,
  maxPolarAngle: CAMERA_MAX_POLAR_ANGLE,
  minPolarAngle: CAMERA_MIN_POLAR_ANGLE,
  rotateSpeed: 0.2,
  zoomSpeed: 2.5,
};

export const defaultFocusOptions = {
  animationDuration: 1000,
  distanceRadiusScale: 1.5,
  easingFunction: ['Cubic', 'Out'],
  enableDefocus: true,
};

export const defaultModelOptions = {
  backgroundTexture:
    process.env.PUBLIC_URL+'/textures/background.png',
  cloudsOpacity: 0.3,
  cloudsTexture:
    process.env.PUBLIC_URL+'/textures/clouds.png',
  enableBackground: true,
  enableClouds: true,
  enableGlow: false,
  glowCoefficient: 0.1,
  glowColor: '#d1d1d1',
  glowPower: 3,
  glowRadiusScale: 0.2,
  bumpMap:
    process.env.PUBLIC_URL+'/textures/bath10.jpg',
  texture:
    process.env.PUBLIC_URL+'/textures/globe10.png',
};

export const defaultLightOptions = {
  ambientLightColor: 'white',
  ambientLightIntensity: 0.8,
  pointLightColor: 'white',
  pointLightIntensity: 1,
  pointLightPositionRadiusScales: [-2, 1, -1],
};

export const defaultDotMarkerOptions = {
  activeScale: 1.3,
  enableGlow: true,
  enableTooltip: true,
  enterAnimationDuration: 1000,
  enterEasingFunction: ['Linear', 'None'],
  exitAnimationDuration: 500,
  exitEasingFunction: ['Cubic', 'Out'],
  getTooltipContent: marker => JSON.stringify(marker.coordinates),
  glowCoefficient: 0,
  glowPower: 3,
  glowRadiusScale: 2,
  radiusScaleRange: [0.005, 0.02],
  type: MarkerType.Dot,
};

export const defaultBarMarkerOptions = {
  activeScale: 1.02,
  enableGlow: false,
  enableTooltip: true,
  enterAnimationDuration: 2000,
  enterEasingFunction: ['Linear', 'None'],
  exitAnimationDuration: 1000,
  exitEasingFunction: ['Cubic', 'Out'],
  getTooltipContent: marker => JSON.stringify(marker.coordinates),
  glowCoefficient: 0,
  glowPower: 3,
  glowRadiusScale: 2,
  offsetRadiusScale: 0,
  radiusScaleRange: [0.2, defaultFocusOptions.distanceRadiusScale - 1],
  type: MarkerType.Bar,
};

export const defaultMarkerOptions = defaultDotMarkerOptions;
