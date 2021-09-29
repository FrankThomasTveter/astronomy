import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {teal_palette} from '../mui/metMuiThemes';

import TableKeyMenu from './TableKeyMenuComponent';

const styles = theme => ({
    config: {
        marginLeft: 'auto',
    },
    tabchip: {
        margin: theme.spacing(0),
	cursor: "pointer",
        color:"red",
        borderColor:"blue",
	backgroundColor:'white',
	"&&:hover":{
	    backgroundColor:teal_palette.light,
	},
	"&&:focus":{
	    backgroundColor:teal_palette.main,
	    color:'white',
	}
    },
    button:{},
    buttonInvisible:{},
    buttonDisabled:{},
});
function renderMenu(classes,state,keyitem,keyindex,focusPoints) {
    var cls={tabchip:classes.tabchip,
	     button:classes.button,
	     buttonInvisible:classes.buttonInvisible,
	     buttonDisabled:classes.buttonDisabled};
    return (<span key={`${keyitem}`} title={keyitem}>
	    <TableKeyMenu classes={cls} state={state} keyitem={keyitem} focusPoints={focusPoints}/>
	    </span>);
}

class PathTable extends Component {
    constructor() {
        super();
        this.focusPoints={};
    };
    state={anchor:null};
    componentDidUpdate(){
	const { state } = this.props;//classes, 
	var pathFocus=state.Path.getPathFocus(state);
	if (pathFocus !== undefined && pathFocus !== null) {
	    var fp=this.focusPoints[pathFocus];
	    if (fp !== undefined && fp !== null) {
		//console.log(" >>> Focusing on (Table) ",pathFocus);
		fp.focus(); 
	    } else {
		//console.log(" >>> Not in focus (Table) ",pathFocus);
	    }
	}
    }
    render() {
        const { classes, state } = this.props; //key
	var items=state.Path.other.table;
	var mapFunction= (item,index)=>renderMenu(classes,state,item,index,this.focusPoints);
	//console.log("PathTable.rendering:",value,JSON.stringify(items));
	return items.map(mapFunction);
    }
}

PathTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PathTable);
