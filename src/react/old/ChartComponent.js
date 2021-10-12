import React, {Component} from "react"; //useState, useEffect, useRef
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

//import {teal_palette} from '../mui/metMuiThemes';

//import TooltipFixedComponent from './TooltipFixedComponent'
import MapInfo from './MapInfoComponent'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import metareaGeoJSON from '../geojson/metarea';
import bankerGeoJSON from '../geojson/banker';
//import worldGeoJSON from 'geojson-world-map';
import worldGeoJSON from '../geojson/custom_world';
import { Map, GeoJSON, Marker, Tooltip, Polyline } from 'react-leaflet';//Polygon, TileLayer ,Popup
import TooltipFloatComponent  from './TooltipFloatComponent';

L.Icon.Default.imagePath = 'images'

const styles = theme => ({
    dataset: {},
    content: {
	width: 'calc(98% - 5px)',
	border: '0px',
    },
    root: {
	height: '100%',
	padding:0,
	margin:0,
	border: '0px solid red'
    },
    invisible:{border:0,padding:0},
    map: {
	backgroundColor:'LightTurquoise',
//	backgroundColor:'Gray',
	overflow: 'hidden',
	height: '100%',
    },
    button:{},
    buttonInvisible:{},
    buttonDisabled:{},
});

function polygon(state,classes,name,pos,color) {
    if (pos === undefined || color === undefined) {
	return null;
    } else {
	return (
	    <Polyline key={name} positions={pos} color={color}/>
	);
    }
};

function polygons(state,classes,name,index) {
    var lines=state.Polygon.positions[name];
    var level=state.Polygon.levels[name];
    var color=state.Colors.getLevelBgColor(level);
    var mapFunction= (pos,index)=>{return polygon(state,classes,name+index,pos,color);};
    if (lines === undefined || color === undefined) {
	//console.log("Not showing polygon:",name,color);
	return null;
    } else {
	//console.log("Showing polygon:",name,level);
	return (lines.map(mapFunction));
    }
};

class GeoJsonMap extends Component {
    constructor(props) {
	super(props);
	const {state} = props;
	state.React.Chart=this;
	this.bbx={height:0,width:0};
	this._ismounted = false;
	this.elem=null;
	this.config={cnt:99,markers:[],animations:[],focus:[0,0],dist:2,zoom:10};
	this.update=this.update.bind(this);
	this.cnt=0;
	this.updateTooltip=this.updateTooltip.bind(this);
        this.width= window.innerWidth;
	this.height=window.innerHeight;
	this.marker=null;
	this.tooltip=null;
	this.bounds=null;
    };    
    update() {
	this.forceUpdate();
    };
    updateTooltip() {
    };
    componentDidMount() {
	this.config={cnt:99,markers:[],animations:[],focus:[0,0],dist:2,zoom:10};
	this._ismounted = true;
        window.addEventListener("resize", this.updateWindowDimensions);
	//console.log(this.refs.map.leafletElement.getBounds())
    } 
    componentWillUnmount() {
	this._ismounted = false;
        window.removeEventListener("resize", this.updateWindowDimensions);
    };
    updateWindowDimensions = () => {
        this.width= window.innerWidth;
	this.height=window.innerHeight;
	this.bbx=this.el.getBoundingClientRect();
	//console.log("Width/Height:",this.width,this.height,this.bbx.width,this.bbx.height)
    };
    element(el) {
	if (el !== undefined && el !== null) {
	    this.el=el;
	    this.bbx=this.el.getBoundingClientRect();
	    //console.log("BBX width/height:",this.bbx.width,this.bbx.height);
	};
    };
    elementTooltip(el) {
	if (el !== undefined && el !== null) {
	    this.tooltip=el;
	};
    };
    // getTooltipContent(marker) {
    // 	//console.log("Path:",JSON.stringify(marker.state.Path.keys));
    // 	//console.log("Marker colwhere:",marker.colwhere," rowwhere:",marker.rowwhere);
    // 	var state=marker.state;
    // 	if (state.Layout.state.tooltip===1) {
    // 	    return null;
    // 	} else {
    // 	    return <TooltipFixedComponent state={marker.state} data={marker} update={this.update}/>;
    // 	}
    // }
    onClickMarker(marker, markerObject, event) {
	//console.log("Clicked marker...",marker.id)
	var state=marker.state;
	state.Navigate.selectElement(state,marker.element);
    };
    handleClick() {
	this.refs.map.leafletElement.locate();
    }
    showMap(state,force) {
	this.getMarkers(state);//this.config.markers=this.getMarkers(state);
	//console.log("Setting bounds:",this.bounds);
	if (force !== undefined && force) {
	    this.update();
	};
	this.showFocus(state);
	// Fit all markers after 1 second (messes with focus-memory)
	//setTimeout(function () {
	//}.bind(this), 250);
    };
    showFocus(state) {
	var zoom,focus;
	if (!state.Path.inFocus(state) || this.bounds===null ||
	    this.bounds === undefined ||! this.bounds.isValid()) { // use stored focus
	    zoom=state.Path.getFocusZoom(state);
	    this.config.zoom=zoom;
	    focus=[state.Path.getFocusLat(state),state.Path.getFocusLon(state)];
	    this.config.focus=focus;
	    if (focus !== undefined && focus[0] !== undefined && focus[1]!==undefined) {
		this.refs.map.leafletElement.setView(focus,zoom);
		//console.log("Focus:",this.config.zoom,this.config.focus[0],this.config.focus[1],
		//	JSON.stringify(state.Path.focus));
		state.Path.setFocus(state,zoom,focus[0],focus[1],false);
	    }
	} else {// use focus from marker data...
	    //console.log("Bounds:",JSON.stringify(this.bounds));
	    this.refs.map.leafletElement.fitBounds(this.bounds);
	    zoom=this.refs.map.leafletElement.getZoom();
	    focus=this.refs.map.leafletElement.getCenter();
	    if (zoom !== undefined) {this.config.zoom=zoom;};
	    if (focus!== undefined) { this.config.focus=[focus.lat,focus.lng];};
	    if (focus !== undefined && focus[0] !== undefined && focus[1]!==undefined) {
		state.Path.setFocus(state,zoom,focus[0],focus[1],false);
	    }
	}
    }
    getMarkers(state) {
	// get marker data
	//console.log("Setting map markers...");
	//var ll=this.markers.length;
	//for (var ii=0; ii < ll; ii++) {
	//    this.markers.splice(ii,1);
	//};
	//this.config.markers.splice(0,this.config.markers.length);
	this.bounds=new L.LatLngBounds();
	state.Grid.setResolution();
	var tcnt=this.cnt;
	var markers=[];//   {id:1,coordinates:[60,10],city:"X",value:0} --state.Matrix.getMarkers(state)
	var matrix=state.React.matrix;
	var first=true;
	var sum={x2:0,y2:0,z2:0,x:0,y:0,z:0,cnt:0};
	if (matrix !== undefined) {
	    state.Matrix.printElements(matrix);
	    var elements=state.Matrix.getMatrixElements(state,matrix);
	    elements.forEach( element => {
		//console.log("Element:",JSON.stringify(element));
		if (element !== null && element !== undefined) {
		    var lon=element.lon;
		    var lat=element.lat;
		    var lev=element.maxlev;
		    var svgid=element.svgid;
		    //console.log("Found SVG:",svgid);
		    //var latRange=element.latRange;
		    //var lonRange=element.lonRange;
		    var bgcolor=state.Colors.getLevelBgColor(lev);
		    var fgcolor=state.Colors.getLevelFgColor(lev);
		    var cnt=element.cnt;
		    var rlat=lat*Math.PI/180;
		    var rlon=lon*Math.PI/180;
		    var clat=Math.cos(rlat);
		    var slat=Math.sin(rlat);
		    var clon=Math.cos(rlon);
		    var slon=Math.sin(rlon);
		    var pos={x:clat*clon,y:clat*slon,z:slat};
		    //console.log("Latlon:",lat,lon);
		    if (lat !== undefined && lon !== undefined) {
			tcnt=tcnt+1;
			sum.cnt=sum.cnt+1;
			sum.x=sum.x+pos.x;
			sum.y=sum.y+pos.y;
			sum.z=sum.z+pos.z;
			sum.x2=sum.x2+pos.x*pos.x;
			sum.y2=sum.y2+pos.y*pos.y;
			sum.z2=sum.z2+pos.z*pos.z;
			//console.log("Colors:",tcnt,lev,bgcolor);
			//console.log("Marker:",tcnt," Pos=",lat,lon," Lev=",lev,bgcolor);
			this.bounds.extend(new L.LatLng(lat,lon));
			var mark={id:tcnt,
				  coordinates:[lat,lon],
				  city:"Test",
				  value:5,
				  element:element,
				  level:lev,
				  bgcolor:bgcolor,
				  fgcolor:fgcolor,
				  svgid:svgid,
				  state:state,
				  map:true,
				  cnt:cnt
				 };
			if (first) {
			    first=false;
			}
			markers.push(mark);
			//this.config.markers.push(mark);
		    };
		}
	    });
	} else {
	    console.log("No matrix available...");
	}
	if (sum.cnt>0) {
	    var cen={cnt:sum.cnt};
	    cen.x=sum.x/sum.cnt;
	    cen.y=sum.y/sum.cnt;
	    cen.z=sum.z/sum.cnt;
	    cen.x2=sum.x2/sum.cnt;
	    cen.y2=sum.y2/sum.cnt;
	    cen.z2=sum.z2/sum.cnt;
	    var ll=Math.sqrt(cen.x*cen.x + cen.y*cen.y + cen.z*cen.z);
	    var dist=Math.max(.01,Math.sqrt(cen.x2 - cen.x*cen.x + cen.y2 - cen.y*cen.y + cen.z2 - cen.z*cen.z));
	    //var zoom=Math.min(15,Math.max(1,2-(Math.log(dist/(0.45)))/Math.log(2)));
	    if (ll>0) {
		cen.x=cen.x/ll;
		cen.y=cen.y/ll;
		cen.z=cen.z/ll;
	    } else {
		cen.x=1;
		cen.y=0;
		cen.z=0;
	    }
	    ll=Math.sqrt(cen.x*cen.x+cen.y*cen.y);
	    var clat=Math.acos(ll) * 180/Math.PI;
	    var clon=Math.atan2(cen.y,cen.x) * 180/Math.PI;
	    //console.log("Center:",clon,clat,dist,ll,cen,zoom);
	    //this.config.dist=dist;
	    //this.config.zoom=zoom;
	    //this.config.focus=[clat,clon];
	    this.config.animations=[{
		animationDuration:1000,
		coordinates:[clat,clon],
		distanceRadiusScale:dist,
		easingFunction: ['Linear','None'],
	    }];
	} else if (this.config.dist===undefined ||
		   this.config.zoom===undefined ||
		   this.config.focus===undefined) {
	    //this.config.dist=5.0;
	    //this.config.zoom=5.0;
	    //this.config.focus=[0.0,0.0];
	}
	//console.log("Markers:",this.config.markers.length);
	this.cnt=tcnt;
	if (this.cnt > 1000000) {this.cnt=0;};
	this.config.markers=markers;
	this.config.cnt=this.config.cnt+1;
    };
  render() {
      const { classes, state } = this.props;
      //var width=0.92*this.width;//window.innerWidth
      //var height=0.98*this.height - 70 - 50 - 5;//window.innerHeight
      var height='calc(100% - 70px - 70px - 5px)';
      //var layoutMode  = state.Layout.getLayoutMode(state);
      var markFunction= (mark) => {
	  var size=state.Layout.getIconSize(state);//50
	  var svgstr=state.Svg.getSvg(state,mark.svgid,mark.fgcolor,mark.bgcolor,size);
	  //console.log("Using SVG:",mark.svgid,svgstr,mark.fgcolor,mark.bgcolor);
	  var flagIcon = new  L.divIcon({iconSize: [size, size],html: svgstr,className:'dummy'});
	  //console.log("Tooltip data:",data);
	  var onOpen=(mark)=>{this.marker=mark;state.React.TooltipFloatComponent.update(state,this.marker);};
          var onClose=(mark)=>{};
//&#128077; thumbs up
	  return (<Marker key={mark.id}
		  mark={mark}
		  zIndexOffset={mark.level*10}
		  position={mark.coordinates}
		  icon={flagIcon}
		  onClick={()=>this.onClickMarker(mark)}
		  ><Tooltip onOpen={()=>onOpen(mark)} onClose={()=>onClose(mark)} className={classes.invisible}/>
		  </Marker>)
      };
      //console.log("Config:",JSON.stringify(this.config));
      var onMoveend = ()=>{
	  if (!state.Path.filmIsPlaying(state)) {
	      var zoom=this.refs.map.leafletElement.getZoom();
	      var focus=this.refs.map.leafletElement.getCenter();
	      state.Path.setFocus(state,zoom,focus.lat,focus.lng,true);
	  };
      };
      var mapFunction= (name,index)=>{return polygons(state,classes,name,index);};
      var names=state.Polygon.getNames(state);
      //console.log("Names:",JSON.stringify(names));
      return (<div ref={el=>{this.element(el)}}
	      className={classes.content}
	      style={{position:'fixed',
		      marginLeft:'0%',
		      width: '90%',
		      height: height,
		      overflow:'hidden'}}
	      >
		 <MapInfo state={state}/>
	         <Map className={classes.map}
                    center={this.config.focus}
                    zoom={this.config.zoom}
                    maxZoom={10}
                    attributionControl={true}
                    zoomControl={false}
                    doubleClickZoom={true}
                    scrollWheelZoom={true}
                    dragging={true}
                    animate={true}
                    easeLinearity={0.35}
	            ref='map'
	            onMoveend={onMoveend}
   	            >
                    <GeoJSON
                       data={metareaGeoJSON}
                       style={() => ({
			   weight: 1,
		 	   color: 'darkGray',//'#4a83ec',
			   opacity: 0.0,
			   fillColor: 'lightBlue',//"#1a1d62",
			   fillOpacity: 0.2, //zIndex: 1,
		       })}/>
                    <GeoJSON
                       data={bankerGeoJSON}
                       style={() => ({
			   weight: 1,
		 	   color: 'darkGray',//'#4a83ec',
			   opacity: 0.0,
			   fillColor: 'lightYellow',//"#1a1d62",
			   fillOpacity: 0.2, //zIndex: 1,
		       })}/>
                    <GeoJSON
                       data={worldGeoJSON}
                       style={() => ({
			   weight: 1,
		 	   color: 'darkGray',//'#4a83ec',
			   opacity: 1,
			   fillColor: 'lightGray',//"#1a1d62",
			   fillOpacity: 1, //zIndex: 1,
		       })}/>
	      {names.map(mapFunction)}
	      {this.config.markers.map(markFunction)}
	      <TooltipFloatComponent state={state} data={this.marker} update={this.update}/>
	      </Map>
	      </div>
	     );
  }
}

//	      <Polygon positions={[[60,10],[61,10],[60.5,9],[60,10]]} color="red"/>

GeoJsonMap.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GeoJsonMap);
