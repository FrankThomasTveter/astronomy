import React, { useRef, useState, useEffect } from "react"
import "./Map.css";
import MapContext from "./MapContext";
import * as ol from "ol";

const Map = ({ children, zoom, center }) => {
    const mapRef = useRef();
    const [map, setMap] = useState(null);

    // on component mount
    useEffect(() => {
	let options = {
	    view: new ol.View({ zoom, center }),
	    layers: [],
	    controls: [],
	    overlays: []
	};

	let mapObject = new ol.Map(options);
	mapObject.setTarget(mapRef.current);
	setMap(mapObject);

	return () => mapObject.setTarget(undefined);
    }, []);

    // zoom change handler
    useEffect(() => {
	if (!map) return;

	map.getView().setZoom(zoom);
    }, [zoom]);

    // center change handler
    useEffect(() => {
	if (!map) return;

	map.getView().setCenter(center)
    }, [center])

    // animate map...
    function animate() {
	if (!map) return;

	map.render();
	window.requestAnimationFrame(animate);
    }
    //
    animate();
    return (
	    <MapContext.Provider value={{ map }}>
	       <div ref={mapRef} className="ol-map">
	          {children}
	       </div>
	    </MapContext.Provider>
	)
}

export default Map;
