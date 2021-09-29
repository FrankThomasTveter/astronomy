import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import SelIcon from '@material-ui/icons/Done';
import NullIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import SelectValue from './SelectValueComponent';
import MoveKey     from './MoveKeyComponent';
import Reload      from './ConfigReloadComponent';
import {teal_palette} from '../mui/metMuiThemes';

const styles = theme => ({
    settings:{},
    values: {
	display: 'inline-block',
        marginLeft: 'auto',
    },
    selectchip: {
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
    reload: {
	display: 'inline-block',
        marginRight: 'auto',
	height:'100%',
    },
    move: {
	display: 'inline-block',
        marginRight: 'auto',
	height:'100%',
    },
    button:{},
    buttonInvisible:{},
    buttonDisabled:{},
});
function renderMoveItem(classes,state,item,index,keyitem,onClose) {
    var cls={button:classes.button,buttonInvisible:classes.buttonInvisible,buttonDisabled:classes.buttonDisabled};
    return (<MenuItem key={item.target} onClose={onclose} className={classes.remove}>
	     <MoveKey state={state} keyitem={keyitem} onclick={item.onclick}
	        target={item.target} onclose={onclose} classes={cls}/>
	    </MenuItem>);
};
function renderMenuItem(classes,state,keyitem,valueitem,valueindex) {
    var vals=state.Path.select.val[keyitem]||[];
    //console.log("SelectValues:",keyitem,valueitem,JSON.stringify(vals));
    var tpos=-1;
    if (vals !== undefined) {
	//console.log("Vals:",JSON.stringify(vals));
	tpos=vals.indexOf(valueitem);
    };
    if (valueitem !== undefined) {
	return (<MenuItem value={valueitem} key={valueitem}>
		<SelectValue state={state} keyitem={keyitem} valueitem={valueitem} tpos={tpos}/> 
		</MenuItem>);
    } else {
	return null;
    };
}
class SelectValueMenu extends Component {
    state={anchorMain:null,anchorAdd:null,label:""};
    constructor(props) {
	super(props);
	//const {state} = props;
	this.handleChange=(event) => {
	    //console.log("handleChange:",event.target.value);
	    this.setState({label:event.target.value});
        }
	this.handleChange=this.handleChange.bind(this);
    };
    render() {
        const { classes, state, keyitem, title, label, remove, target, focusPoints, focusType } = this.props;
	this.focusPoints=focusPoints;
	this.focusType=focusType;
	this.onClickMain = event => {
	    this.setState({ anchorMain: event.currentTarget });
	    state.Path.setPathFocus(state,keyitem+(this.focusType||""));
	};
	this.onClickAdd = event => {
	    this.setState({ anchorAdd: event.currentTarget });
	};
	this.onClose = () => {
	    if (this.state.anchorAdd !== null) {
		this.setState({ anchorAdd: null });
	    } else {
		this.setState({ anchorMain: null });
	    }
	};
	this.pushToTable = () => {
	    //console.log("Setting focus to:",keyitem);
	    state.Path.setPathFocus(state,keyitem);
	    state.Navigate.pushSelectToTable(state,keyitem);
	    this.onClose();
	};
	if (remove !== undefined) {
	    this.remove = () => {
		state.Path.setPathFocus(state,keyitem);
		remove();this.onClose();
	    };
	    this.target=target;
	} else {
	    this.remove = () => {
		//console.log("Setting focus to:",keyitem);
		state.Path.setPathFocus(state,keyitem);
		state.Navigate.pushSelectToTable(state,keyitem);
		this.onClose();
	    };
	    this.target="table";
	};
	this.onAdd = () => {
	    //state.Path.setPathFocus(state,keyitem+"_selected");
	    //console.log("Select->focus:",keyitem+"_selected",label);
	    state.Path.toggleSelect(state,keyitem,this.state.label);
	};
	var icon,lab;
	if (label==="") {
	    icon=<NullIcon/>;
	    lab=keyitem;
	} else {
	    icon=<SelIcon/>;
	    lab=label;
	};
	var moves=[{onclick:this.remove,target:this.target}];
	if (target!=="table" && state.Path.other.ignore.indexOf(keyitem)===-1) {
	    moves.push({onclick:this.pushToTable,target:"table"});
	};
	var mapFunction= (item,index)=>renderMenuItem(classes,state,keyitem,item,index);
	var moveFunction= (item,index)=>renderMoveItem(classes,state,item,index,keyitem,this.onClose);
	var ignore=["MAX("+keyitem+")","MIN("+keyitem+")"];
	var items=state.Utils.merge(state.Database.getKeyValues(state,keyitem),
				    state.Path.select.val[keyitem],ignore);
	
	if (items.indexOf("")===-1) {items.push("");};
	items.sort(state.Utils.ascending).reverse();
	//console.log("Values.rendering",items.length,JSON.stringify(anchor),Boolean(anchor));
	const chip=<AddIcon onClick={this.onAdd}/>;
	const input=<input type="text" value={this.state.label} onChange={this.handleChange} autoFocus={true}/>;
	var cls={button:classes.button};
	return (
 	      <div key={"selectValue-"+keyitem}>
	       <Chip
                  icon={icon}
                  label={lab}
                  title={title}
                  className={classes.selectchip}
                  variant="outlined"
                  aria-owns={this.state.anchorMain ? 'values-menu' : undefined}
                  aria-haspopup="true"
                  onClick={this.onClickMain}
		  ref={(input)=>{
		    if (this.focusPoints !== undefined) {
			var name=keyitem + (this.focusType||"");
			//console.log("###### Found focus point:",name,this.focusType);
			this.focusPoints[name]=input;
		    } else {
			//console.log("SVM-No focus points...");
		    }}
		      }/>
	        <Menu
		    id="values-menu"
		    anchorEl={this.state.anchorMain}
		    open={Boolean(this.state.anchorMain)}
		    onClose = {this.onClose}
		    >
		    {moves.map(moveFunction)}
		    {mapFunction(state.Database.makeKeytrg(state,keyitem,state.Database.keytrg.Max),-1)}
		    {items.map(mapFunction)}
		    {mapFunction(state.Database.makeKeytrg(state,keyitem,state.Database.keytrg.Min),-1)}
		    <MenuItem key="add" onClose={this.onClose}>
		<Button
                      className={classes.button}
                      aria-owns={this.state.anchorAdd ? 'values-add' : undefined}
                      aria-haspopup="true"
                      onClick={this.onClickAdd}
	              title={"Add selected value."}
		    >
	  	       {<AddIcon/>}
                </Button>
		    </MenuItem>
		    <MenuItem key="reload" onClose={this.onClose} className={classes.reload}>
		       <Reload state={state} onclose={this.onClose} classes={cls} visible={true}/>
		    </MenuItem>
		</Menu>
	        <Menu
		    id="values-add"
		    anchorEl={this.state.anchorAdd}
		    open={Boolean(this.state.anchorAdd)}
		    onClose={this.onClose}
		    >
		<MenuItem className={classes.order} key="button">
		<Chip
	              className={classes.selchip}
	              icon={chip}
	              label={input}
	              variant="outlined"
		   />		
		</MenuItem>
		 </Menu>

	    </div>);
    }
}

SelectValueMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectValueMenu);
