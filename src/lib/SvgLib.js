//console.log("Loading SvgLib.js");

function Svg() {
    // default is a triangle....
    this.def="<svg viewBox=\"0 0 26 26\" height=\"Size\" width=\"Size\"><g style=\"display:inline\" transform=\"translate(0,-270.54166)\"><path id=\"path3715\" d=\"m 1.3229166,294.35417 c 3.9687498,-7.05556 7.9374996,-14.11111 11.9062494,-21.16667 3.96875,7.05556 7.937499,14.11111 11.906249,21.16667 -7.937499,0 -15.8749989,0 -23.8124984,0 z\" style=\"fill:none;fill-rule:evenodd;stroke:bg;stroke-width:1.32291663;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\" /></g></svg>";
    this.config={key:null,svgs:{}};// which key should be on the abscissa
    this.init=function(state){
	//state.Utils.init("Svg",this);
    };
    this.getKey=function(state) {
	return this.config.key;
    };
    this.getId=function(state,doc) {
	var val=state.Matrix.getDocVal(state,doc,this.config.key);
	if (val !== null && this.config.svgs[val] !== undefined) {
	    //console.log("Found:",val," svg:",this.config.svgs[val]);
	    return val;
	} else {
	    //console.log("Found nothing:",val);
	    return null;
	};
    };
    this.getSvg=function(state,id,fg,bg,size) {
	var str;
	if (id === null) { // default svg
	    str=this.def;
	} else if (id !== undefined) {
	    str=this.config.svgs[id]
	} else {
	    str=this.def;
	};
	//console.log("Id:",id," str:",str,this.def);
	var str2=str.replace(/fg/g,fg);
	var str3=str2.replace(/bg/g,bg);
	var str4=str3.replace(/Size/g,size);
	//console.log("Id:",id," str:",str4);
	return str4;
    }
};
export default Svg;
