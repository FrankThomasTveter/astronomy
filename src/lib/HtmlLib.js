//console.log("Loading HtmlLib.js");

function Html() {
    this.ceye="&#x1f441";
    this.setConsole=function(msg) {
	console.log(msg);
    };
    this.setProgress=function(state,active) {
	if (state.React !== undefined && state.React.Dataset !== undefined) {
	    state.React.Dataset.setProgress(state,active);
	}
    };
    this.setFootnote=function(state,msg) {
	if (state.React !== undefined && state.React.Status !== undefined) {
	    if (msg  === undefined) {
		msg=state.Utils.getStatusString(state);
	    };
	    //console.log("setFootnote:",msg);
	    state.React.Status.setFootnote(state,msg);
	}
    };
    this.broadcast=function(state,msg,variant) {
	if (state.React !== undefined && state.React.Status !== undefined) {
	    if (msg  === undefined) {msg=state.Utils.getStatusString(state);};
	    if (variant === undefined) {variant='info';};
	    //console.log("broadcast:",msg,variant);
	    state.React.App.broadcast(msg,variant);
	}
    };
    this.progressInfo=function(state,e) {
	if (state.React !== undefined && state.React.Status !== undefined) {
	    if (e.loaded  === e.total) {
		state.React.Status.setFootnote(state);
	    } else {
		e.preventDefault();
		//console.log("Complete:",e.loaded,e.total,JSON.stringify(e));
		//var percentComplete = e.loaded / e.total * 100;
		//state.React.Status.setFootnote(state,percentComplete.toFixed(2)+"kb");
		state.React.Status.setFootnote(state,state.Utils.getLoadString(state,e.loaded));
	    }
	}
    };
    this.loadInfo=function(state,e) {
	if (state.React !== undefined && state.React.Status !== undefined) {
	    state.React.Status.setFootnote(state,"Processing");
	};
    };
    this.errorInfo=function(state,e) {
	if (state.React !== undefined && state.React.Status !== undefined) {
	    //state.React.Status.setFootnote(state,"Error");
	}
    };
    this.abortInfo=function(state,e) {
	if (state.React !== undefined && state.React.Status !== undefined) {
	    state.React.Status.setFootnote(state,"Aborted");
	}
    };
};
export default Html;
