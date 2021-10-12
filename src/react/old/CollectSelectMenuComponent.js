import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SelectIcon from '@material-ui/icons/Done';
import SelectKey from './SelectKeyComponent';

const styles = theme => ({
    select: {
	display: 'inline-block',
        marginRight: 'auto',
	height:'100%',
    },
    tableSelect: {
	display: 'inline-block',
        marginRight: 'auto',
    },
    button:{
	color:'white',
	"&$buttonDisabled": {
            color: theme.palette.primary.main,
	}
    },
    buttonInvisible:{},
    buttonDisabled: {},
});
//   className={classes.select}  -> horisontal layout
function renderMenuItem(classes,state,keyitem,keyindex) {
    return (<MenuItem key={keyitem[0]+"_"+keyitem[1]}>  
	    <SelectKey state={state} title={keyitem[0]} keytype={keyitem[1]} keyitem={keyitem[0]} keyactive={keyitem[2]}/>
	    </MenuItem>
	   );
}
class CollectSelectMenu extends Component {
    state={anchor:null};
    render() {
        const { classes, state } = this.props;
	this.onClick = event => {this.setState({ anchor: event.currentTarget });};
	this.onClose = () => {this.setState({ anchor: null });};
	var itms=state.Path.keys.path.map(function(item,index) {return [item,"select",true]}).concat(
	    state.Path.other.table.map(function(item,index) {return [item,"otherTable",true]}),
	    state.Path.other.rest.map(function(item,index) {return [item,"otherRest",true]})
	);
	//var items=state.Path.keys.path||[];
	//items=items.sort(state.Utils.ascending);
	var mapFunction= (item,index)=>renderMenuItem(classes,state,item,index);
	//console.log("Select.rendering",items.length,JSON.stringify(anchor),Boolean(anchor));
	var disabled=(itms.length===0);
	//className={classes.button}
	var cls={root:classes.button,disabled:classes.buttonDisabled};
	if (disabled) {
	    return (
		   <Button
                      classes={cls} 
                      aria-owns={this.state.anchor ? 'selects-menu' : undefined}
                      aria-haspopup="true"
                      onClick={this.onClick}
	              title={"Selected order"}
		      disabled={disabled} 
		    >
	  	       <SelectIcon state={state}/>
                     </Button>
	    );
	} else {
	    return (
		<div className={classes.tableSelect}>
		   <Button
                       classes={cls} 
                      aria-owns={this.state.anchor ? 'selects-menu' : undefined}
                      aria-haspopup="true"
                      onClick={this.onClick}
	              title={"Key order"}
		      disabled={disabled} 
		    >
	  	       <SelectIcon state={state}/>
                     </Button>
		     <Menu
	                className={classes.tableSelect}
                        id="selects-menu"
	                anchorEl={this.state.anchor}
                        open={Boolean(this.state.anchor)}
                        onClose={this.onClose}
		     >
		        {itms.map(mapFunction)}
	             </Menu>
		</div>
	    );
	};
    }
}

CollectSelectMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CollectSelectMenu);
