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
	//var documentLog = document.getElementById("log");
	//console.log("Showing data.");
	if (reload  === undefined || reload) {
	    this.showPath(state);
	    state.Html.setFootnote(state,"Extracting data.");
	    state.Html.setProgress(state, true);
	    setTimeout(function() {
		state.Database.dbextract(state,function (state,matrix){
		    state.Html.setFootnote(state,"Displaying data.");
		    setTimeout(function (){  // callback
			//console.log("Updating matrix.");
			state.Path.exportAllKeys(state);
			//console.log("Showing path");
			this.showPath(state);
			//console.log("Showing Config");
			this.showConfig(state);

			//console.log("Showing Table/Map");

			this.showDataset(state,matrix,force);
			//console.log("Pushing URL");
			state.Utils.pushUrl(state);
			state.Html.setFootnote(state);
			state.Html.setProgress(state, false);
			//console.log("Delayed showAll is done...");
		    }.bind(this),0.1);
		}.bind(this));
	    }.bind(this),0.1);
	} else {
	    console.log("Not updating matrix.");
	    state.Path.exportAllKeys(state);
	    this.showPath(state);
	    this.showConfig(state);
	    this.showDataset(state,undefined,force);
	    this.showTooltip(state);
	    state.Html.setFootnote(state);
	    state.Html.setProgress(state, false);
	}
	this.showMode(state);
    };
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
    this.showDataset=function(state,matrix,force) {
	state.Utils.pushUrl(state);
	//console.log("Showing table...");
	if (matrix !== undefined) {
	    //console.log("Defining matrix...");
	    state.React.matrix=matrix;
	};

	//console.log("ShowTable:",state.Layout.state.layoutMode,state.Layout.modes.layout.Globe);

	if (state.Layout.state.layoutMode === state.Layout.modes.layout.Chart) {
	    if (state.React.Chart !== undefined) {
		state.React.Chart.showMap(state,force);
	    }
	} else if (state.Layout.state.layoutMode === state.Layout.modes.layout.Globe) {
	    if (state.React.Globe !== undefined) {
		state.React.Globe.showMap(state,force);
	    }
	} else {
	    if (state.React.Table !== undefined) {
		state.React.Table.showTable(state);
	    }
	}
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
