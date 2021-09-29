import { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
////////////////import OLSlideLayer from "ol/layer/WebGLSlide";
import OLSlideLayer from "./WebGLSlideLayer";

const SlideLayer = ({ source ,style , zIndex = 0}) => {
	const { map } = useContext(MapContext);

	useEffect(() => {
		if (!map) return;

		let slideLayer = new OLSlideLayer({
		    source,
		    style,
		    disableHitDetection:true,
		    zIndex
		});

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
