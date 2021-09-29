//console.log("Loading MatrixLib.js");

function Custom() {
    this.bdeb=false;
    this.maps={};
    this.init=function(state){
	//var par="Custom";
	//state.Utils.init(par,this);
	//console.log("Custom:",JSON.stringify(this.list));
    };
    this.getLayoutMode=function(state) {
	var mode=state.Layout.getLayoutMode(state);
	var keys=Object.keys(state.Layout.modes.layout);
	var lenk=keys.length;
	for (var kk=0;kk<lenk;kk++) {
	    var key=keys[kk];
	    var val=state.Layout.modes.layout[key];
	    if (mode === val) {
		//console.log("Found mode:",key,val,mode);
		return;
	    };
	};
	return mode;
    };
    this.addMaps=function(state,list) {
	var maps=Object.keys(this.maps);
	for (var ii=0; ii< maps.length;ii++) {
	    list.push(maps[ii]);
	};
	return list;
    }
    this.getMap=function(state,name) {
	var map=this.maps[name];
	if (map !== undefined) {
	    return map;
	} else {
	    //console.log("Invalid map...",name);
	    return;
	}
    };
    this.mapHasCells=function(state,name) {
	var map=this.getMap(state,name);
	if (map !== undefined) {
	    return (map.cells !== undefined);
	} else {
	    return false;
	}
    }
    this.getMapRow=function(state,map) {
	if (map !== undefined) {
	    return map.range[0];
	} else {
	    return 0;
	}
    };
    this.getMapCol=function(state,map) {
	if (map !== undefined) {
	    return map.range[1];
	} else {
	    return 0;
	}
    };
    this.getCell=function(state,map,colval,rowval) {
	if (map !== undefined) {
	    var cells=map.cells;
	    if (cells === undefined) { return;} // no cell found
	    var lenc=cells.length;
	    for (var cc=0;cc<lenc;cc++) {
		var cell=cells[cc];
		//var bok=true;
		var row=this.getCellRow(state,cell);
		var col=this.getCellCol(state,cell);
		//console.log("Checking:",col,colval,row,rowval,colval == col && rowval == row);
		if (colval === col && rowval === row) {
		    return cell;
		};
	    };
	};
    };
    this.getCellRow=function(state,cell) {
	if (cell !== undefined) {
	    return cell[0];
	}
    };
    this.getCellCol=function(state,cell) {
	if (cell !== undefined) {
	    return cell[1];
	};
    };
    this.getCellLabel=function(state,cell) {
	if (cell !== undefined) {
	    //console.log("Cell:",JSON.stringify(cell));
	    return cell[2]||"?";
	} else {
	    return ".";
	}
    };
    this.getCellCriteria=function(state,cell) {
	if (cell !== undefined) {
	    return cell[3];
	};
    };
    this.getCriteria=function(state,layout,colval,rowval) {
	var map=state.Custom.getMap(state,layout);
	var cell=state.Custom.getCell(state,map,colval,rowval);
	var criteria=state.Custom.getCellCriteria(state,cell);
	return criteria;
    }
    this.getLats=function(state,map) {
	var ret=[];
	var leni=this.getMapRow(state,map);
	for (var iy=0;iy<leni;iy++) {
	    ret.push(iy);
	}
	return ret;
    };
    this.getLons=function(state,map) {
	var ret=[];
	var leni=this.getMapCol(state,map);
	for (var ix=0;ix<leni;ix++) {
	    ret.push(ix);
	}
	return ret;
    };
    this.findCell=function(state,map,doc) {
	var cells=map.cells;
	if (cells === undefined) { return;} // no cell found
	var lenc=cells.length;
	for (var cc=0;cc<lenc;cc++) {
	    var cell=cells[cc];
	    var bok=true;
	    var criteria=this.getCellCriteria(state,cell);
	    if (criteria !== undefined) {
		var keys=Object.keys(criteria);
		var lenk=keys.length;
		for (var kk=0; kk<lenk;kk++) {
		    var key=keys[kk];
		    if (criteria[key].indexOf(doc[key]) === -1) {
			bok=false;
		    }
		}
	    } else {
		bok=false;
	    }
	    if (bok) {
		return cell;
	    }
	}
	console.log("No valid cell found...");
	return; // no cell found
    };
};
export default Custom;

   // "custom":{"Map":{},
   //            "Magnus":{"cells":[["12","0","Svalbard",{"Region":["Svalbard"]}],
   //                               ["11","4","TF-Regn", {"Region":["Troms og Finnmark"],"Phenomenon":["Regn"]}],
   //                               ["11","3","TF",      {"Region":["Troms og Finnmark"]}],
   //                               ["10","3","Nl-regn", {"Region":["Nordland"],"Phenomenon":["Regn"]}],
   //                               ["9","3","Nl",      {"Region":["Nordland"]}],
   //                               ["8","3","Tr-Regn", {"Region":["Trøndelag"],"Phenomenon":["Regn"]}],
   //                               ["7","3","Tr",      {"Region":["Trøndelag"]}],
   //                               ["6","2","In-regn", {"Region":["Innlandet"],"Phenomenon":["Regn"]}],
   //                               ["6","3","In",      {"Region":["Innlandet"]}],
   //                               ["7","2","MR-Regn", {"Region":["Møre og Romsdal"],"Phenomenon":["Regn"]}],
   //                               ["6","1","MR",      {"Region":["Møre og Romsdal"]}],
   //                               ["5","1","VL-Regn", {"Region":["Vestland"],"Phenomenon":["Regn"]}],
   //                               ["4","1","VL",      {"Region":["Vestland"]}],
   //                               ["3","1","Rog-Regn",{"Region":["Rogaland"],"Phenomenon":["Regn"]}],
   //                               ["2","1","Rog",    {"Region":["Rogaland"]}],
   //                               ["3","2","Ag-Regn",{"Region":["Agder"],"Phenomenon":["Regn"]}],
   //                               ["2","2","Ag",     {"Region":["Agder"]}],
   //                               ["3","3","VO-Regn", {"Region":["Viken Øst"],"Phenomenon":["Regn"]}],
   //                               ["2","3","VO",      {"Region":["Viken Øst"]}],
   //                               ["5","3","VV-Regn", {"Region":["Viken Vest"],"Phenomenon":["Regn"]}],
   //                               ["5","2","VV",      {"Region":["Viken Vest"]}],
   //                               ["4","2","VT-regn", {"Region":["Vestfold og Telemark"],"Phenomenon":["Regn"]}],
   //                               ["4","3","VT",     {"Region":["Vestfold og Telemark"]}],
   //                               ["11","5","Kb",      {"Region":["Kildinbanken"]}],
   //                               ["12","5","Nb",      {"Region":["Nordbanken"]}],
   //                               ["12","4","Nkb",     {"Region":["Nordkappbanken"]}],
   //                               ["12","3","Hb",      {"Region":["Hjelmsøybanken"]}],
   //                               ["12","2","Tf",      {"Region":["Tromsøflaket","Bankene u Troms","Hjelmsøybanken"]}],
   //                               ["12","1","YV",      {"Region":["Ytre Vestfjorden"]}],
   //                               ["11","0","Fr",      {"Region":["Frøyabanken"]}],
   //                               ["10","0","UN",      {"Region":["Utsira Nord"]}],
   //                               ["9","0","US",      {"Region":["Utsira Sør"]}],
   //                               ["8","0","Se",      {"Region":["Storegga"]}],
   //                               ["7","0","Vest",    {"Region":["Vesterålsbankene"]}],
   //                               ["6","0","R",       {"Region":["Røstbanken"]}],
   //                               ["5","0","T",       {"Region":["Trænabanken"]}],
   //                               ["4","0","SH",      {"Region":["Storegga-Haltenbanken"]}],
   //                               ["3","0","Ha",      {"Region":["Haltenbanken"]}],
   //                               ["2","0","AT",     {"Region":["Aust-Tampen"]}],
   //                               ["1","0","Vik",    {"Region":["Viking"]}],
   //                               ["0","0","Flad",   {"Region":["Fladen"]}],     
   //                               ["0","1","Fisk",   {"Region":["Fisker"]}],
   //                               ["1","2","IS",     {"Region":["Indre Skagerrak"]}],
   //                               ["0","2","YS",     {"Region":["Ytre Skagerrak"]}],
   //                               ["7","3","Skl",     {"Region":["Sklinnabanken"]}],
                                 
   //                             ["0","5",{},"Resten"]
   //                            ],
   //                    "range":["13","6"]
   //                   }

