import { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
////////////////import OLPointsLayer from "ol/layer/WebGLPoints";
import OLPointsLayer from "./WebGLPointsLayer";

const PointsLayer = ({ source ,style , zIndex = 0}) => {
	const { map } = useContext(MapContext);

	useEffect(() => {
		if (!map) return;

		let pointsLayer = new OLPointsLayer({
		    source,
		    style,
		    disableHitDetection:true,
		    zIndex
		});

		map.addLayer(pointsLayer);
		pointsLayer.setZIndex(zIndex);

		return () => {
			if (map) {
				map.removeLayer(pointsLayer);
			}
		};
	}, [map, source ,style , zIndex]);

	return null;
};

export default PointsLayer;
