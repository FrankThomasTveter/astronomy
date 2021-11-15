import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import PropTypes from  "prop-types";
import CheckIcon from '@material-ui/icons/CheckBox';
import UnCheckIcon from '@material-ui/icons/CheckBoxOutlineBlank';

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
        padding: '1px',
    },
    divTableCellCursor:{
        cursor: "pointer",
        border: '1px solid #999999',
        display: 'table-cell',
        padding: '1px',
        //borderRadius: "5px",
    },
    divTableBody : {
        display: 'table-row-group',
    },
    block:{},
    field:{},
    legend:{},
    button:{},
    buttonDisabled:{},
});
//        maxWidth: theme.spacing.getMaxWidth.maxWidth,

function HdrRow(props) {
    const {state, classes} = props;
    var onclick=function(){};
    return (<div className={classes.divTableHdr} key='hdrRow'>
	    <div className={classes.divTableCell} onClick={onclick} key={`remove`}>
	    </div>
	    <div className={classes.divTableCell} onClick={onclick} key={`age`}>
	    Age
	    </div>
	    <div className={classes.divTableCell} onClick={onclick} key={`time`}>
	    Time
	    </div>
	    <div className={classes.divTableCell} onClick={onclick} key={`value`}>
	    Value
	    </div>
	    <div className={classes.divTableCell} onClick={onclick} key={`hint`}>
	    Hint
	    </div>
	    </div>
	   );
};
function DataRow(props) {
    const {state, classes, item, index} = props;
    var key='dataRow'+index;
    var onTime=function() {console.log("Time index.");};
    var onRemove=function() {console.log("Removing index.");};
    var onToggle=function() {console.log("Toggling index.");};
    //console.log("Item:",item,key);
    if (index === null || index === undefined) {
	return (null);
    } else {
	var time="time" + item[0];
	var age="age" + item[1];
	var id="id" + item[3];
	var val=item[4];
	var hint="hint" + item[5];
	var time="time" + item[0];
	return (<div className={classes.divTableRow} key={key}>
		<div className={classes.divTableCell} key={'remove'}>
		<CheckIcon/>
		</div>
		<div className={classes.divTableCell} key={'age'}>
		{age}
		</div>
		<div className={classes.divTableCell} key={'time'}>
		{time}
		</div>
		<div className={classes.divTableCell} key={'val'}>
		{val}
		</div>
		<div className={classes.divTableCell} key={'hint'}>
		{hint}
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
	var data=state.Astro.getData(state);
	//console.log("Data:",data) ;
        return (
	    <div className={classes.divTable} key={'table'}>
               <div className={classes.divTableBody}>
		   <HdrRow state={state} classes={classes} key={'hdr'}/>
                   {data.map((val,index) => {return (
			   <DataRow state={state} classes={classes} item={val} index={index} key={'data'+index}/>)
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
