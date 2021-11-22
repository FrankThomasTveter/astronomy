import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import PropTypes from  "prop-types";
import CloseIcon from '@material-ui/icons/Close';
//import CheckIcon from '@material-ui/icons/CheckBox';
//import UnCheckIcon from '@material-ui/icons/CheckBoxOutlineBlank';
//import moment from 'moment';

//console.log("Inside EventsTable.")

const styles = theme => ({
    divTable :{
        display: 'table',
        width: '100%',
        //border:  '10px solid green',
    },
    divTableBody : {
        display: 'table-row-group',
        // "&:hover":{backdropFilter:"brightness(90%)"},
    },
    divTableHdr:  {
        //backgroundColor:teal_palette.main,
        //color:'white',
        //border: '0px solid #999999',
        display: 'table-row',
        padding: '0px',
    },
    divTableRow:  {
        display: 'table-row',
        padding: '0px',
    },
    divTableCell:{
        border: '1px solid #999999',
        display: 'table-cell',
	color: 'black',
        padding: '3px',
    },
    divTableCellCursor:{
        cursor: "pointer",
        border: '1px solid #999999',
        display: 'table-cell',
        padding: '3px',
	color: 'black',
        //borderRadius: "5px",
    },
    block:{},
    field:{},
    legend:{},
    button:{},
    buttonDisabled:{},
});
//        maxWidth: theme.spacing.getMaxWidth.maxWidth,

function HdrRow(props) {
    // const {state, classes} = props; // 
    //var onclick=function(){};
    return null;
    // return (<div className={classes.divTableHdr} key='hdrRow'>
    // 	    <div className={classes.divTableCell} onClick={onclick} key={`remove`}>
    // 	    </div>
    // 	    <div className={classes.divTableCell} onClick={onclick} key={`time`}>
    // 	    Time
    // 	    </div>
    // 	    <div className={classes.divTableCell} onClick={onclick} key={`age`}>
    // 	    Age
    // 	    </div>
    // 	    <div className={classes.divTableCell} onClick={onclick} key={`hint`}>
    // 	    Hint
    // 	    </div>
    // 	    <div className={classes.divTableCell} onClick={onclick} key={`value`}>
    // 	    Value
    // 	    </div>
    // 	    </div>
    // 	   );
};
function DataRow(props) {
    const {state, classes, item, index, target} = props;
    var key='dataRow'+index;
    var onTime=function() {state.Events.setTargetTime(state,item[0]);};
    var onRemove=function() {state.Events.removeItem(state,item,index);};
    var bodyFocus=function() {state.Events.bodyFocus(state,item[2]);};
    //console.log("Item:",item,key);
    if (index === null || index === undefined) {
	return (null);
    } else {
	var time=item[0];
	var age=(item[1]-target)||0;
	var bgcolor=(age<=-1000)?"#AAAAAA":(age>=1000)?"#00FF00":"#FFFFFF";
	//var id=item[3];
	var val=item[4];
	var hint=item[5];
	//console.log("Color:",age,bgcolor);
	return (<div className={classes.divTableRow} key={key}>
		<div className={classes.divTableCellCursor} key={'remove'} onClick={onRemove} style={{backgroundColor:bgcolor}}>
		<CloseIcon/>
		</div>
		<div className={classes.divTableCell} key={'time'} style={{backgroundColor:bgcolor}}>
		{state.Events.getISODate(time)}
		</div>
		<div className={classes.divTableCellCursor} key={'age'} onClick={onTime} style={{backgroundColor:bgcolor}}>
		{state.Events.getTimeDiff(age)}
		</div>
		<div className={classes.divTableCellCursor} key={'hint'} onClick={bodyFocus} style={{backgroundColor:bgcolor}}>
		{hint}
		</div>
		<div className={classes.divTableCell} key={'val'} style={{backgroundColor:bgcolor}}>
		{val}
		</div>
		</div>
	       );
    };
};
class EventsTable extends Component {
    constructor(props) {
	super(props);
        const {state} = props;
	state.React.EventsTable=this;
	this.show=this.show.bind(this);
    };
    show(state) {
	this.forceUpdate();
    };
    render() {
        const { state, classes } = this.props; //layout
	//var mapFunction= (val,index)=>renderline(classes,state,val,index);
	//{data.map(mapFunction)}
	var data=state.Events.getData(state);
	var target=state.Events.getTargetTime(state);
	//console.log("Data:",data) ;
        return (
	    <div className={classes.divTable} key={'table'}>
               <div className={classes.divTableBody}>
		   <HdrRow state={state} classes={classes} key={'hdr'}/>
                   {data.map((val,index) => {return (
			   <DataRow state={state} classes={classes} item={val} index={index} key={'data'+index} target={target}/>)
					    })}
	       </div>
	    </div>
        );
    }
}
// disabled={false}


EventsTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventsTable);
