import React, {Component} from "react"; //useState, useEffect, useRef
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

//import {teal_palette} from '../mui/metMuiThemes';

//import TooltipFixedComponent from './TooltipFixedComponent'
//import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import worldGeoJSON from '../geojson/custom_world';
import { MapContainer, GeoJSON, Marker, Popup } from 'react-leaflet';//Polygon, TileLayer ,Popup

// const icon = new L.Icon({
//   options: {
//     iconUrl: require('../svg/marker.svg'),
//     iconRetinaUrl: require('../svg/marker.svg'),
//     iconAnchor: null,
//     popupAnchor: null,
//     shadowUrl: null,
//     shadowSize: null,
//     shadowAnchor: null,
//     iconSize: new L.Point(60, 75),
//     className: 'leaflet-div-icon'
//   }
// });

const styles = theme => ({
    map: {
	overflow: 'hidden',
	height: '100px',
	width: '100%',
    },
});

class GeoJsonMap extends Component {
    constructor(props) {
	super(props);
	const {state} = props;
	this.state={marker:[state.Astro.getLon(state),state.Astro.getLon(state)]};
	this.update=this.update.bind(this);
	state.React.Chart=this;
    };    
    update() {
	this.forceUpdate();
    };
    onClickMarker(event) {
	this.setState({marker:event.latlng})
    };
  render() {
      const { classes, state } = this.props;
      var markFunction= (mark) => {      };
      return (<MapContainer className={classes.map}
                    center={this.state.marker}
                    zoom={2}
                    maxZoom={10}
                    attributionControl={true}
                    zoomControl={false}
                    doubleClickZoom={true}
                    scrollWheelZoom={true}
                    dragging={true}
                    animate={true}
                    easeLinearity={0.35}
	            ref='map'
   	            >
                    <GeoJSON
                       data={worldGeoJSON}
                       style={() => ({
			   weight: 1,
		 	   color: 'darkGray',//'#4a83ec',
			   opacity: 1,
			   fillColor: 'lightGray',//"#1a1d62",
			   fillOpacity: 1, //zIndex: 1,
		       })}/>
	      <Marker key={'marker'} position={this.state.marker}>
	      <Popup>
	      <span> This is your location</span>
	      </Popup>
	      </Marker>
	      </MapContainer>
	     );
  }
}

GeoJsonMap.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GeoJsonMap);
