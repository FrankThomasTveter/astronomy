import React, {Component} from "react";
//import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {teal_palette} from '../mui/metMuiThemes';

import TooltipTable  from './TooltipTable';

//import InfoIcon from '@material-ui/icons/Info';
//import CancelIcon from '@material-ui/icons/Cancel';

const styles = theme => ({
    tooltip:{
	border: '0px solid #999999',
	backgroundColor:teal_palette.main,
	color:'white',
	zIndex:10000,
    },
});

function TableDetails(props){
    const {state,data,docs}=props; //state,element
    var keys=state.Cell.getTooltipKeys(state,data,docs);   // keys in docs
    var ckeys=state.Cell.getClickableTooltipKeys(state,data); // clickable tooltip keys
    //console.log ("TableDetails tooltip-keys:",JSON.stringify(state.Path.tooltip));
    //console.log("TableDetails keys:",JSON.stringify(keys),JSON.stringify(state.Path.keys));
    //console.log("TableDetails tooltip:",JSON.stringify(docs));
    var key=JSON.stringify(data.keys);
    var tkeys=data.keys;
    return (<div key={key}>
	    <TooltipTable state={state} keys={keys} ckeys={ckeys} docs={docs} tkeys={tkeys}/>
	    </div>
	   );
};
function InfoDetails(props) {
    const {onclick,info}=props; // state,element,data,
    if (info.cnt===0) {
	return null;
    } else {
	return (<div onClick={onclick} style={{cursor:'pointer'}}>
		Cnt:{info.cnt} Level:{info.maxlev}
		</div>
	       );
    };
};
//function printData(data) {
//    console.log("############## Data:",JSON.stringify(Object.keys(data)));
//};
class Tooltip extends Component {
    render() {
	const {state,data,update}=this.props;
	var info=state.Cell.getTooltipInfo(state,data);
	//console.log("Info:",JSON.stringify(info));
	var available=info.available;
	//console.log("Available:",JSON.stringify(available));
	if (available) {
	    return (<TableDetails state={state} data={data} docs={info.docs}/>);
	} else {
	    var onclick=() => {state.Cell.addTooltip(state,data);update();this.forceUpdate();}//printData(data);
	    return (<InfoDetails state={state} data={data} onclick={onclick} info={info}/>);
	}
    }
};


export default withStyles(styles)(Tooltip);
