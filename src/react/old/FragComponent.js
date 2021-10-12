import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
//import Typography from "@material-ui/core/Typography/Typography";
//import Grid from "@material-ui/core/Grid/Grid";

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.primary.main,
        marginTop: theme.spacing(8),
        bottom: 0,
        padding: theme.spacing(6),
        color: '#FFF'
    },
    button:{},
    text: {
	maxWidth: "100%",
	margin: "1%",
    },
});
class Frag extends Component {
    constructor() {
        super();
	this.state={age:   { order:1, dir:"down", key:"epoch", sort:"age",    show:"pAge"},
		    epoch: { order:2, dir:"",     key:"epoch"},
		    first: { order:3, dir:"",     key:"ifirst"}, //,sort:"firstAge", show:"pFirstAge"
		    last:  { order:4, dir:"",     key:"ilast", ref:"ifirst", sort:"lastAge", show:"pLastAge"},
		    from:  { order:5, dir:"",     key:"dfirst"}, //,sort:"fromAge",show:"pFromAge"
		    to:    { order:6, dir:"",     key:"dlast", ref:"dfirst", sort:"toAge",  show:"pToAge"},
		    cnt:   { order:7, dir:"",     key:"cnt"},
		    frag:  { order:8, dir:"",     key:"frag"},
		    currentCount : null};
	this.maxorder=8;
	this.getStr=this.getStr.bind(this);
	this.click=this.click.bind(this);
	this.onClick=this.onClick.bind(this);
	this.onClickAge=this.onClickAge.bind(this);
	this.onClickEpoch=this.onClickEpoch.bind(this);
	this.onClickFirst=this.onClickFirst.bind(this);
	this.onClickLast=this.onClickLast.bind(this);
	this.onClickFrom=this.onClickFrom.bind(this);
	this.onClickTo=this.onClickTo.bind(this);
	this.onClickCnt=this.onClickCnt.bind(this);
	this.onClickFrag=this.onClickFrag.bind(this);
	this.setDuration=this.setDuration.bind(this);
	this.setAge=this.setAge.bind(this);
	this.getThr=this.getThr.bind(this);
	this.getCol=this.getCol.bind(this);
	this.getDate=this.getDate.bind(this);
	this.startClock=this.startClock.bind(this);
	this.clickClock=this.clickClock.bind(this);
	this.stopClock=this.stopClock.bind(this);
	this.toggleClock=this.toggleClock.bind(this);
	this.sort=this.sort.bind(this);
	this.intervalId=undefined;
	this.maxcount=3600;
	//86400*1000
    }; 
    startClock() {
	//console.log("Called start clock...",this.intervalId === undefined);
	if (this.intervalId === undefined) {
	    this.setState({
		currentCount: 0
	    });
	    this.intervalId = setInterval(this.timer.bind(this), 1000);
	}
    };
    clickClock() {
	this.setState({
	    currentCount: (this.state.currentCount||0) + 1
	});
	//console.log("Count:",this.state.currentCount);
    };
    stopClock() {
	//console.log("Called start clock...",this.intervalId === undefined);
	if (this.intervalId!==undefined) {
	    //console.log("Stopped count:",this.state.currentCount);
	    clearInterval(this.intervalId);
	    this.intervalId=undefined;
	    this.setState({
		currentCount: 0
	    });
	}
    };
    toggleClock() {
	if (this.intervalId===undefined) {
	    this.startClock();
	} else {
	    this.stopClock();
	}
    }
    timer() {
	this.clickClock();
	if(this.state.currentCount >= this.maxcount) {
	    this.stopClock();
	}
    };
    componentDidMount() {
	this.startClock();
    };
    componentWillUnmount(){
	clearInterval(this.intervalId);
    };
    setDuration(strs,col) {
	for (var ss in strs) {
	    if (strs.hasOwnProperty(ss)) {
		var str=strs[ss];
		var key=this.state[col].key;
		var ref=this.state[col].ref;
		var sort=this.state[col].sort;
		var show=this.state[col].show;
		var post=this.state[col].post;
		var epoch=str[key];
		var reference=str[ref];
		if (epoch === null || epoch === undefined) {
		    str[sort]=null;
		} else {
		    str[sort]=this.getDate(epoch)-this.getDate(reference);
		    if (post === "invert") {
			str[sort] = -str[sort];
		    };
		}
		str[show]=this.getPrettyAge(str[sort]);
	    }
	}
    };	
    setAge(strs,col) {
	var now=this.getDate();
	for (var ss in strs) {
	    if (strs.hasOwnProperty(ss)) {
		var str=strs[ss];
		var key=this.state[col].key;
		var sort=this.state[col].sort;
		var show=this.state[col].show;
		var post=this.state[col].post;
		var epoch=str[key];
		if (epoch === null || epoch === undefined) {
		    str[sort]=null;
		} else {
		    str[sort]=now-this.getDate(epoch);
		    if (post === "invert") {
			str[sort] = -str[sort];
		    };
		}
		str[show]=this.getPrettyAge(str[sort]);
	    }
	}
    };	
    getThr (thr,millis) {
	var ret={color:"LightBlue"};
	thr.forEach((thr) => {
	    var range=thr.range;
	    var mint=range[0];
	    var maxt=range[1];
	    var inrange=(millis!==null && (mint!==null || maxt!==null)) || 
		(millis===null && mint===null && maxt===null);
	    if (mint !==null && millis < mint) {inrange=false;};
	    if (maxt !==null && millis > maxt) {inrange=false;};
	    if (inrange) {ret=thr;return (ret);};
	});
	//console.log("Threshold:",millis,JSON.stringify(ret));
	return ret;		 
    };
    getCol (order) {
	var match;
	var cols =Object.keys(this.state);
	cols.forEach((col) => {
	    if (this.state[col]  && typeof this.state[col] === "object" && order === this.state[col].order) {
		match=col;
		//console.log("Match:", match,order)
		return;
	    }
	});
	//console.log("Final Match:", order,match)
	return (match);
    };
    // push item to the front
    sort (fragments,strs) {
	//console.log("Sorting:",JSON.stringify(this.state));
	return fragments.sort((a,b) => {
	    var sa=strs[a];
	    var sb=strs[b];
	    if (sa === undefined || sb === undefined) { return 0;}
	    for (var ii=1;ii<=this.maxorder;ii++) {
		var col=this.getCol(ii);
		var dir=this.state[col].dir;
		var key=(typeof this.state[col].sort === 'undefined') ?
		    this.state[col].key : this.state[col].sort ;
		if (dir === "up") {
		    if (sa[key] === null && sb[key] !== null) {
			return -1;
		    } else if (sa[key] !== null && sb[key] === null) {
			return 1;
		    } else if (sa[key] > sb[key]) {
			return -1;
		    } else if (sa[key] < sb[key]) {
			return 1;
		    };
		} else if (dir === "down") {
		    if (sa[key] === null && sb[key] !== null) {
			return -1;
		    } else if (sa[key] !== null && sb[key] === null) {
			return 1;
		    } else if (sa[key] > sb[key]) {
			return 1;
		    } else if (sa[key] < sb[key]) {
			return -1;
		    };
		}
	    }
	    return 0;
	});
    };
    getDate(epoch) {
	//2021-06-18_05-00-01.000Z
	if (epoch===undefined) {return new Date();};
	var yy=parseInt(epoch.substring(0,4));
	var mm=parseInt(epoch.substring(5,7));
	var dd=parseInt(epoch.substring(8,10));
	var hh=parseInt(epoch.substring(11,13))||0;
	var mi=parseInt(epoch.substring(14,16))||0;
	var ss=parseInt(epoch.substring(17,23))||0;
	var dat=new Date(Date.UTC(yy,mm-1,dd,hh,mi,ss))
	return (dat);
    };
    getPrettyAge(millis) {
	if (millis===null) {return null;};
	var sign="";
	var ret="";
	if (millis===0) {
	    return ("0");
	} else if (millis < 0) {
	    millis=-millis;
	    sign="-";
	};
	var seconds= Math.floor(millis/1000); millis=(millis%1000);
        var minutes= Math.floor(seconds/60); seconds=(seconds%60);
        var hours  = Math.floor(minutes/60); minutes=(minutes%60);
        var days   = Math.floor(hours/24); hours=(hours%24);
	var ss = parseInt(seconds);
	var mi = parseInt(minutes);
	var hh = parseInt(hours);
	var dd = parseInt(days);
	if (days>0) {
	    if(ret!==""){ret=ret+"";};ret=ret+dd+"d";
	};
	if (hours>0) {
	    if(ret!==""){ret=ret+"";};ret=ret+hh+"h";
	};
	if (days===0&&minutes>0) {
	    if(ret!==""){ret=ret+"";};ret=ret+mi+"m";
	};
	if (days===0&&hours===0&&seconds>0) {
	    if(ret!==""){ret=ret+"";};ret=ret+ss+"s";
	};
	return (sign+ret);
    };
    getStr(val,dir,order) {
	const up="↑";
	const down="↓";
	if (order !== 1) {
	    return (val);
	} else if (dir === "up") {
	    return (val + up);
	} else if (dir === "down") {
	    return (val + down);
	} else {
	    return (val);
	};
    };
    // handle header click events
    click(trg,nokey,upkey,downkey) {
	this.toggleClock();
	if (trg===undefined) {return;};
	//console.log("clicked:",trg);
	// first change the direction
	var buffer=JSON.parse(JSON.stringify(this.state)); 
	var order=buffer[trg].order;
	var dir=buffer[trg].dir;
	if (dir === "") {
	    dir="up";
	} else if (dir === "up") {
	    dir="down";
	} else if (dir === "down") {
	    dir="";
	};
	buffer[trg].dir=dir;
	// change the order
	var cols =Object.keys(this.state);
	if (dir === "") { //push to the end
	    // rearrange
	    cols.forEach((col) => {
		if (this.state[col]  && typeof this.state[col] == "object") {
		    if (buffer[col].order > order) {
			buffer[col].order=buffer[col].order-1;
		    } else if (buffer[col].order === order) {
			buffer[col].order=this.maxorder;
		    };
		};
	    });
	    if (nokey !== undefined) { buffer[trg].key=nokey; }
	} else { // push to the front
	    // rearrange
	    cols.forEach((col) => {
		if (this.state[col]  && typeof this.state[col] == "object") {
		    if (buffer[col].order < order) {
			buffer[col].order=buffer[col].order+1;
		    } else if (buffer[col].order === order) {
			buffer[col].order=1;
		    };
		};
	    });
	    if (dir === "up" && upkey !== undefined) { buffer[trg].key=upkey; }
	    if (dir === "down" && downkey !== undefined) { buffer[trg].key=downkey; }
	}
	this.setState(buffer);
    };
    onClick()      {this.toggleClock();};
    onClickAge()   {this.click("age");};
    onClickEpoch() {this.click("epoch");};
    onClickFirst() {this.click("first");}
    onClickLast()  {this.click("last");}
    onClickFrom()  {this.click("from","dfirst","dfirst","dfirst");}
    onClickTo()    {this.click("to","dlast","dlast","dlast");}
    onClickCnt()   {this.click("cnt");};
    onClickFrag()  {this.click("frag");};
    // draw table...
    render () {
	const { state } = this.props;
	var strs=state.Database.getFragTimes(state);
	this.setAge(strs,"age");
	this.setAge(strs,"first");
	this.setDuration(strs,"last");
	this.setAge(strs,"from");
	this.setDuration(strs,"to");
	//var frags=state.Database.getFragmentActive(state);
	var fragments=this.sort(state.Database.getFragmentActive(state),strs);
	var fragFunction= (frag) => {
	    var fragthr=state.Database.getFragThr(state);
	    var thr=this.getThr(fragthr, strs[frag][this.state['age'].sort]);
	    var styleR={border: "1px solid black", textAlign:"right"}; // "center"
	    var styleL={border: "1px solid black", textAlign:"left"}; // "center"
	    if (thr) {
		styleL.backgroundColor=thr.background;
		styleL.color=thr.foreground;
		styleR.backgroundColor=thr.background;
		styleR.color=thr.foreground;
	    };
	    return (
		<tr key={frag}>
		  <td style={styleR}>  {strs[frag][this.state['age'].show]}</td>
		  <td style={styleR}>  {strs[frag][this.state['first'].key]}</td>
		  <td style={styleR}>  {strs[frag][this.state['last'].show]}</td>
		  <td style={styleR}>  {strs[frag][this.state['from'].key]}</td>
		  <td style={styleR}>  {strs[frag][this.state['to'].show]}</td>
		  <td style={styleR}>  {strs[frag][this.state['cnt'].key]}</td>
		    <td style={styleL}> {strs[frag][this.state['frag'].key]}</td>
		</tr>
	    );
	};
	//		  <td style={styleR}>  {strs[frag][this.state['epoch'].key]}</td>
	return (
		<table style={{border: "1px solid black"}} onClick={this.onClick}>
		<tbody>
		<tr>
		<th style={{border: "1px solid black"}} onClick={this.onClickAge}>{
		    this.getStr("Age",this.state.age.dir,this.state.age.order)}</th>
		<th style={{border: "1px solid black"}} onClick={this.onClickFirst}>{
		    this.getStr("Issued",this.state.first.dir,this.state.first.order)}</th>
		<th style={{border: "1px solid black"}} onClick={this.onClickLast}>{
		    this.getStr("Stretch",this.state.last.dir,this.state.last.order)}</th>
		<th style={{border: "1px solid black"}} onClick={this.onClickFrom}>{
		    this.getStr("Dtg",this.state.from.dir,this.state.from.order)}</th>
		<th style={{border: "1px solid black"}} onClick={this.onClickTo}>{
		    this.getStr("Range",this.state.to.dir,this.state.to.order)}</th>
		<th style={{border: "1px solid black"}} onClick={this.onClickCnt}>{
		    this.getStr("Records",this.state.cnt.dir,this.state.cnt.order)}</th>
		<th style={{border: "1px solid black"}} onClick={this.onClickFrag}>{
		    this.getStr("Fragment",this.state.frag.dir,this.state.frag.order)}</th>
		</tr>
		{fragments.map(fragFunction)}
		</tbody>
	    </table>
	);
	//	<th style={{border: "1px solid black"}} onClick={this.onClickEpoch}>{
	//	    this.getStr("Loaded",this.state.epoch.dir,this.state.epoch.order)}</th>
    };
}

Frag.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Frag);
