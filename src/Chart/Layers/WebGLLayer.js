import { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
////////////////import OLWebGLLayer from "ol/layer/WebGLPoints";
import OLWebGLLayer from "./WebGLPoints";

const WebGLLayer = ({ source ,style , zIndex = 0}) => {
	const { map } = useContext(MapContext);

	useEffect(() => {
		if (!map) return;

		let webGLLayer = new OLWebGLLayer({
		    source,
		    style,
		    disableHitDetection:true,
		    zIndex
		});

		map.addLayer(webGLLayer);
		webGLLayer.setZIndex(zIndex);

		return () => {
			if (map) {
				map.removeLayer(webGLLayer);
			}
		};
	}, [map, source ,style , zIndex]);

	return null;
};

export default WebGLLayer;
