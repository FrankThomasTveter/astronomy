//console.log("Loading ShowLib.js");

function Show() {
    this.init=function(state){
	//var par="Show";
	//state.Utils.init(par,this);
    };
    this.showMode=function(state) { // show data on screen
	if (state.React.Mode !== undefined) {
	    state.React.Mode.show(state);
	}
    };
    this.show=function(state,reload,callbacks) {
        setTimeout(function() {
	    this.showAll(state,reload);
	    if (callbacks !== undefined) {
		var callback=callbacks.shift();
		if (callback !== undefined) {
		    callback(state,callbacks)
		}
	    };
	}.bind(this),0.1);
    };
    this.showAll=function(state,reload,force) { // show data on screen
	this.showTime(state);
	this.showLocation(state);
	this.showCriteria(state);
	this.showEvents(state);
	this.showScene(state);
    }.bind(this);
    this.showScene=function(state) {console.log("Showing scene...");};
    this.showPath=function(state) {
	state.Utils.pushUrl(state);
	if (state.React.Path !== undefined) {
	    state.React.Path.showPath(state); // forceUpdate()
	} else {
	    console.log("No react-path available.");
	}
	if (state.React.Location !== undefined) {
	    state.React.Location.showLocation(state); // forceUpdate()
	} else {
	    console.log("No react-location available.");
	}
	if (state.React.LevelBar !== undefined) {
	    state.React.LevelBar.showLevelBar(state); // forceUpdate()
	} else {
	    console.log("No react-disclaimer available.");
	}
    };
    this.showConfig=function(state) {
	state.Utils.pushUrl(state);
	if (state.React.Config !== undefined) {
	    state.React.Config.show(state); // forceUpdate()
	} else {
	    console.log("No react-config available.");
	}
    };
    this.showSettings=function(state) {
	state.Utils.pushUrl(state);
	if (state.React.Settings !== undefined) {
	    state.React.Settings.show(state); // forceUpdate()
	} else {
	    console.log("No react-config available.");
	}
    };
    this.showTime=function(state) {
	state.Utils.pushUrl(state);
	if (state.React.Time !== undefined) {
	    state.React.Time.show(state); // forceUpdate()
	} else {
	    console.log("No react-time available.");
	}
    };
    this.showLocation=function(state) {
	state.Utils.pushUrl(state);
	if (state.React.Location !== undefined) {
	    state.React.Location.show(state); // forceUpdate()
	} else {
	    console.log("No react-location available.");
	}
    };
    this.showCriteria=function(state) {
	state.Utils.pushUrl(state);
	if (state.React.Criteria !== undefined) {
	    state.React.Criteria.show(state); // forceUpdate()
	} else {
	    console.log("No react-criterie available.");
	}
    };
    this.showEvents=function(state) {
	state.Utils.pushUrl(state);
	if (state.React.Events !== undefined) {
	    state.React.Events.show(state); // forceUpdate()
	} else {
	    console.log("No react-events available.");
	}
    };
    this.showMatrix=function(state,matrix) {
	state.Utils.pushUrl(state);
	if (state.React.Dataset !== undefined) {
	    state.React.Dataset.showMatrix(state,matrix);
	}
    };
    this.showFilm=function(state) {
	state.Utils.pushUrl(state);
	if (state.React.ReelAdd !== undefined) {
	    state.React.ReelAdd.showLabel(state);
	}
    };
    this.showMapInfo=function(state,force) {
	if (force === undefined) {force=true;};
	if (state.React.MapInfo !== undefined) {
	    state.React.MapInfo.showMapInfo(state,force);
	}
    };	
    this.showChart=function(state,force) {
	if (state.React.Chart !== undefined) {
	    state.React.Chart.showMap(state,force);
	}
    };
    this.showDataset=function(state,force) {
	state.Utils.pushUrl(state);
	this.showConfig(state);
	this.showTime(state);
	this.showLocation(state);
	this.showCriteria(state);
	this.showEvents(state);
	//console.log("Showing table done...");
    };
    this.showPolygons=function(state) {
	var mode = state.Layout.getLayoutMode(state);
	if (mode === state.Layout.modes.layout.Chart) {
	    state.Polygon.makePolygon(state,0,function(state,polygons,changed){
		if (changed) {
		    //console.log("Polygons loaded? ",changed);
		    state.Show.showDataset(state,state.React.matrix,true);
		} else {
		    //console.log("Polygons loaded? ",changed);
		}
	    });
	};
    };
    this.showFocus=function(state) {
	if (state.React.Chart !== undefined) {
	    state.React.Chart.showFocus(state);
	}
    };
    this.showTooltip=function(state) {
	if (state.React.Tooltip !== undefined) {
	    state.React.Tooltip.rebuild();
	}
    };
    this.useCanvas=function(state,matrix) {    // check if matrix elements have max 1 data
	// loop over matrix
	for (var ii in matrix) {
	    for (var jj in matrix[ii]) {
		if (matrix[ii][jj].cnt > 1) {
		    return false;
		}
	    }
	}
	return true;
    };
    this.scale=function(xval,xmin,xmax,ymin,ymax) {
	if (ymin>ymax) {
	    return ymin + (xval-xmin)*(ymax-ymin)/(xmax-xmin);
	} else {
	    return (xval-xmin)*(ymax-ymin)/(xmax-xmin);
	}
    }
};
export default Show;
