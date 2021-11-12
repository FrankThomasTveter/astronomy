import React, {Component} from "react"; //useState, useEffect, useRef
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

//import {teal_palette} from '../mui/metMuiThemes';

//import TooltipFixedComponent from './TooltipFixedComponent'
//import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import worldGeoJSON from '../geojson/custom_world';
import { MapContainer, GeoJSON, Marker, Popup } from 'react-leaflet';//Polygon, TileLayer ,Popup, useMapEvents
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'

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
	//overflow: 'hidden',
	height: '100px',
	width: '100%',
    },
});

function AddMarkerToClick(props) {
    const {position, icon}=props; // onClick, 
    //const map = useMapEvents({
	//click(event) {
	  //  //console.log("Event:",event.latlng,onClick);
	    //onClick(event);
	//},
    //});
    return (
	position !== undefined ? (
		<Marker
	    position={position}
	    interactive={true}
	    icon={icon}
		>
	      <Popup>
	      <span> This is your location</span>
	      </Popup>
		</Marker>
	) : null
    );
};

class GeoJsonMap extends Component {
    constructor(props) {
	super(props);
	const {state} = props;
	this.icon=new Icon({iconUrl: markerIconPng,
			    iconSize: [25, 41],
			    iconAnchor: [12, 41]});
	this.update=this.update.bind(this);
	state.React.Chart=this;
    };    
    update() {
	this.forceUpdate();
    };
    render() {
	const { classes, position, onClick } = this.props; // state, 
	//var markFunction= (mark) => {      };
	//console.log("Onclick:",onClick);
	return (<MapContainer className={classes.map}
                    center={position}
                    zoom={2}
                    maxZoom={10}
                    attributionControl={true}
                    zoomControl={false}
                    doubleClickZoom={true}
                    scrollWheelZoom={true}
                    dragging={true}
                    animate={true}
                    easeLinearity={0.35}
   	            >
                    <GeoJSON
                       data={worldGeoJSON}
                       style={{
			   weight: 1,
		 	   color: 'darkGray',//'#4a83ec',
			   opacity: 1,
			   fillColor: 'lightGray',//"#1a1d62",
			   fillOpacity: 1, //zIndex: 1,
		       }}/>
		<AddMarkerToClick icon={this.icon} position={position} onClick={onClick}/>
	      </MapContainer>
	     );
  }
}


                       // style={() => ({
		       // 	   weight: 1,
		       // 	   color: 'darkGray',//'#4a83ec',
		       // 	   opacity: 1,
		       // 	   fillColor: 'lightGray',//"#1a1d62",
		       // 	   fillOpacity: 1, //zIndex: 1,
		       // })}/>


GeoJsonMap.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GeoJsonMap);
