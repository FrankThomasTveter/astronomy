//console.log("Loading SettingsLib.js");

function Settings() {
    // list of all controls (visible and invisible)
    this.controls=["Time","Location","Criteria","Events",
		   "FullScreen","About","Qr"];
    // list of visible controls...
    this.visible=[];//["Time","Location","Criteria","Events"];
    this.init=function(state){
	//state.Utils.init("Settings",this);
    };
    this.makeVisible=function(state,control) {
	var cid=this.controls.indexOf(control);
	var vid=this.visible.indexOf(control);
	if (cid !== -1 && vid === -1) {
	    this.visible.push(control);
	    return true;
	} else {
	    return false;
	};
    };
    this.makeInvisible=function(state,control) {
	var cid=this.controls.indexOf(control);
	var vid=this.visible.indexOf(control);
	if (cid !== -1 && vid !== -1) {
	    this.visible.splice(vid,1);
	    return true;
	} else {
	    return false;
	};
    };
    this.isVisible=function(state,control) {
	//console.log("Visible:",JSON.stringify(this.visible));
	//console.log("Control:",JSON.stringify(this.controls));
	return (this.controls.indexOf(control)!==-1 && 
		this.visible.indexOf(control)!==-1);
    }.bind(this);
    this.isInvisible=function(state,control) {
	return ! this.isVisible(state,control);
    }.bind(this);
    this.toggle=function(state,control) {
	//console.log("Toggling:",control);
	//throw new Error('Exception message');
	if (this.isVisible(state,control)) {
	    this.makeInvisible(state,control);
	} else if (this.isInvisible(state,control)) {
	    this.makeVisible(state,control);
	};
	state.Utils.pushUrl(state);
	state.React.Config.show(state);
    };
    this.getVisible=function(state) {
	var arr=[];
	var lenc=this.controls.length;
	for (var ii=0;ii<lenc;ii++) {
	    var control=this.controls[ii];
	    if (this.visible.indexOf(control)!==-1) {
		arr.push(control);
	    }
	};
	return arr;
    };
    this.getInvisible=function(state) {
	var arr=[];
	var lenc=this.controls.length;
	for (var ii=0;ii<lenc;ii++) {
	    var control=this.controls[ii];
	    if (this.visible.indexOf(control)===-1) {
		arr.push(control);
	    }
	};
	return arr;
    };
}
export default Settings;
