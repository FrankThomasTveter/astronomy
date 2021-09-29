import React, { useState, useEffect, useRef } from "react";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Style, Icon }     from "ol/style";
import Feature             from "ol/Feature";
import Point               from "ol/geom/Point";
import GeoJSON             from "ol/format/GeoJSON";
import Static              from "ol/source/ImageStatic";
import RasterSource        from "ol/source/Raster";
import { fromLonLat, get } from "ol/proj";
import Map                                from "./Map";
import { osm, vector }                    from "./Source";
import { TileLayer, ImageLayer, VectorLayer, SlideLayer } from "./Layers"; //Layers, 
import { Controls, FullScreenControl }    from "./Controls";
import FeatureStyles                      from "./Features/Styles";
import mapConfig                          from "./config.json";
const geojsonObject  = mapConfig.geojsonObject;
const geojsonObject2 = mapConfig.geojsonObject2;
const geojsonObject3 = mapConfig.geojsonObject3;
const markersLonLat  = [mapConfig.kansasCityLonLat, mapConfig.blueSpringsLonLat];
const predefinedStyles = mapConfig.predefinedStyles;

const styles = makeStyles( theme => ({
    root:{},
    content: {
        height:'100vh',
        padding: theme.spacing(1),
    }
}));

function addMarkers(lonLatArray) {
  var iconStyle = new Style({
    image: new Icon({
      anchorXUnits: "fraction",
      anchorYUnits: "pixels",
      src: mapConfig.markerImage32,
    }),
  });
  let features = lonLatArray.map((item) => {
    let feature = new Feature({
      geometry: new Point(fromLonLat(item)),
    });
    feature.setStyle(iconStyle);
    return feature;
  });
  return features;
}


const Chart = (props) => {
    const theme   = useTheme();
    const classes = styles(props);
    
    const [center, setCenter] = useState(mapConfig.center);
    const [zoom, setZoom]     = useState(9);
    
    const [showLayer1, setShowLayer1] = useState(false);
    const [showLayer2, setShowLayer2] = useState(false);
    const [showMarker, setShowMarker] = useState(false);
    
    const [features, setFeatures] = useState(addMarkers(markersLonLat));
    
    var extent=[-18,-9,18,9]
    var imgsrc= new Static ({
        url: 'data/wind/2016112000.png',
        projection: 'EPSG:4326',
        imageExtent: extent,
	parameter: "wind",
    });

    var rastsrc = new RasterSource({
	sources: [imgsrc],
	operation: function (pixels, data) {
	    var pixel = pixels[0];
	    if (pixel[0] <= 10) {
		pixel[0] = 0;
		pixel[1] = 255;
		pixel[2] = 0;
		pixel[3] = 128;
	    } else {
		pixel[3] = 0;
	    }
	    return pixel;
	}
    });
    
    var renderedExtent=extent;
    var viewResolution=1;
    var pixelRatio=1;
    var projection=imgsrc.getProjection();

    console.log ("Raster:",rastsrc);
    console.log ("Image:",imgsrc);
    console.log ("Proj:",projection);
    
    var jsonsrc= vector({
        features: new GeoJSON().readFeatures(geojsonObject3, {
            featureProjection: get("EPSG:3857"),
        })});
    return (<>
    <div  className={classes.content}>
      <Map center={fromLonLat(center)} zoom={zoom}>
	  <SlideLayer
            source={jsonsrc}
	    slides={[imgsrc,imgsrc]}
	    style={predefinedStyles["rotating-bars"]}
	    zIndex={100}
	    />
	  {showLayer1 && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(geojsonObject, {
                  featureProjection: get("EPSG:3857"),
                }),
              })}
              style={FeatureStyles.MultiPolygon}
            />
          )}
          {showLayer2 && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(geojsonObject2, {
                  featureProjection: get("EPSG:3857"),
                }),
              })}
              style={FeatureStyles.MultiPolygon}
            />
          )}
          {showMarker && <VectorLayer source={vector({ features })} />}
          <TileLayer source={osm()} zIndex={0} />
          <ImageLayer source={imgsrc} zIndex={1} />
        <Controls>
          <FullScreenControl />
        </Controls>
      </Map>
    </div>
  </>);
};


//        <Layers>
//        </Layers>

      // <div>
      //   <input
      //     type="checkbox"
      //     checked={showLayer1}
      //     onChange={(event) => setShowLayer1(event.target.checked)}
      //   />{" "}
      //   Johnson County
      // </div>
      // <div>
      //   <input
      //     type="checkbox"
      //     checked={showLayer2}
      //     onChange={(event) => setShowLayer2(event.target.checked)}
      //   />{" "}
      //   Wyandotte County
      // </div>
      // <hr />
      // <div>
      //   <input
      //     type="checkbox"
      //     checked={showMarker}
      //     onChange={(event) => setShowMarker(event.target.checked)}
      //   />{" "}
      //   Show markers
      // </div>


export default Chart;
