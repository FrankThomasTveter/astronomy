import { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
////////////////import OLSlideLayer from "ol/layer/WebGLSlide";
import OLSlideLayer from "./WebGLSlideLayer";
import { Vector as VectorSource } from 'ol/source';

const SlideLayer = ({ source ,slides=[], style , zIndex = 0}) => {
	const { map } = useContext(MapContext);

	useEffect(() => {
	    if (!map) return;
	    let clean=false;
	    // OpenLayers needs a source - but it can be temporary...
	    if (!source) {source=new VectorSource();clean=true;};
	    let slideLayer = new OLSlideLayer({
		source,
		slides,
		style,
		disableHitDetection:true,
		zIndex
	    });
	    if (clean) {source.clear();};
	    
	    map.addLayer(slideLayer);
	    slideLayer.setZIndex(zIndex);
	    
	    return () => {
		if (map) {
		    map.removeLayer(slideLayer);
		}
	    };
	}, [map, source ,style , zIndex]);

	return null;
};

export default SlideLayer;
