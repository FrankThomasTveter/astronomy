import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';

import FilmIcon from '@material-ui/icons/Theaters';
import TrashIcon from '@material-ui/icons/Delete';
import UpwardIcon from '@material-ui/icons/ArrowUpward';
import {teal_palette} from '../mui/metMuiThemes';

const styles = theme => ({
    reel: {
	display: 'inline-block',
        marginRight: 'auto',
	height:'100%',
    },
    tableReel: {
	display: 'inline-block',
        marginRight: 'auto',
    },
    button: {
	color:'white',
	"&$buttonDisabled": {
            color: theme.palette.primary.main,
	},
    },
    buttonInvisible:{},
    buttonDisabled: {},
    chip: {
        margin: theme.spacing(0),
	cursor: "pointer",
        color:"black",
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
});
function RemoveReel(props) {
    const {classes,index,onRemove}=props; //state,
    var onremove= () => {onRemove(index);};
    var title="Reel";
    return <Button className={classes.button} onClick={onremove} title={title}><TrashIcon/></Button>;
};
function UpwardReel(props) {
    const {classes,index,onUpward}=props; //state,
    var onupward= () => {onUpward(index);};
    var title="Reel";
    return <Button className={classes.button} onClick={onupward} title={title}><UpwardIcon/></Button>;
};
function renderMenuItem(classes,state,keyitem,keyindex,onRemove,onUpward) {
    var onclick=() => {state.Path.nextFilm(state,keyindex);};
    var cls={button:classes.button};
    if (keyindex===0) { // remove
	return ( <MenuItem className={classes.order} key={"film_" + keyindex}>
		<RemoveReel state={state} classes={cls} index={keyindex} onRemove={onRemove}/>
		 <Chip icon={<FilmIcon/>} label={keyitem.label} onClick={onclick} className={classes.chip} variant="outlined"/>
		</MenuItem>
	       );
    } else {
	return (<MenuItem className={classes.order} key={"film_" + keyindex}>
		<UpwardReel state={state} classes={cls} index={keyindex} onUpward={onUpward}/>
		<Chip icon={<FilmIcon/>} onClick={onclick} label={keyitem.label}/>
		</MenuItem>
	       );
    }
}
class ReelMenu extends Component {
    constructor(props) {
	super(props);
	const {state} = props;
	this.state={anchor:null, label:""};
	//state.Path.getLabel(state)
	this.onClick  = event => {this.setState({ anchor: event.currentTarget });};
	this.onClose  = () => {this.setState({ anchor: null });};
	this.onRemove = (index) => {this.setState({label:state.Path.removeFilm(state,index)});state.Show.showConfig(state);state.Show.showSettings(state);};
	this.onUpward = (index) => {state.Path.moveFilm(state,index);state.Show.showConfig(state);state.Show.showSettings(state);};
	//
	this.onClick=this.onClick.bind(this);
	this.onClose=this.onClose.bind(this);
	this.onRemove=this.onRemove.bind(this);
	this.onUpward=this.onUpward.bind(this);
    };
    
    render() {
        const { classes, state } = this.props;
	//var label=state.Path.getLabel(state);
	var items=state.Path.getReels(state);
	var mapFunction= (item,index)=>renderMenuItem(classes,state,item,index,this.onRemove,this.onUpward);
	//console.log("Length:",items.length,JSON.stringify(items));
	let content;
	if (items.length===0) {
	    content=null;
	} else {
	    content=<Menu
	                className={classes.tableReel}
                        id="reel-menu"
	                anchorEl={this.state.anchor}
                        open={Boolean(this.state.anchor)}
                        onClose={this.onClose}
		     >
			    {items.map(mapFunction)}
	             </Menu>
	};
	var cls={root:classes.button,disabled:classes.buttonDisabled};
	return (<div className={classes.tableReel}>
		   <Button
                      classes={cls}
                      aria-owns={this.state.anchor ? 'reel-menu' : undefined}
                      aria-haspopup="true"
                      onClick={this.onClick}
	              title={"Reel"}
		      disabled={items.length===0} 
		    >
	  	        <FilmIcon state={state}/>
		    </Button>
		    {content}
		 </div>);
    }
}

ReelMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReelMenu);
