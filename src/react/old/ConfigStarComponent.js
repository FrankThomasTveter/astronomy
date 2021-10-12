import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';

import StarIcon from '@material-ui/icons/StarOutlined';
import FilmIcon from '@material-ui/icons/Theaters';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import {teal_palette} from '../mui/metMuiThemes';

const styles = theme => ({
    button:{
	color:'white'
    },
    buttonInvisible:{
	color:'gray'
    },
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
function Play(props) {
    const {state}=props;
    if (state.Path.film.play) {
	return <PlayIcon/>;
    } else {
	return <PauseIcon/>;
    }
};
function PlayFilm(props) {
    const {state,classes}=props;
    var onclick=() => {state.Path.toggleFilm(state); state.Show.showConfig(state); state.Show.showSettings(state);};
    var title="Play or pause.";
    return (<MenuItem className={classes.order} key={"play"} onClose={onclose}>
	    <Button className={classes.button} onClick={onclick} title={title}><Play state={state}/></Button>
	    </MenuItem>
	   );
};
function renderStar(classes,state,onclose,keyitem,keyindex,focusPoints) {
    var onclick=() => {state.Path.nextFilm(state,keyindex);onclose();};
    return ( <MenuItem className={classes.order} key={"film_" + keyindex} onClose={onclose}>
	     <Chip icon={<FilmIcon/>} label={keyitem.label} onClick={onclick} className={classes.chip} variant="outlined"
	     ref={(input)=>{
		 if (focusPoints !== undefined) {
		     //console.log("###### Found focus point:",keyitem.label,this.focusType);
		     focusPoints[keyindex]=input;
		 } else {
		     //console.log("SVM-No focus points...");
		 }}}
	     />
	     </MenuItem>
	   );
};
class Star extends Component {
    constructor(props) {
        super(props);
	const {state} = props;
	state.React.Star=this;
        this.focusPoints={};
    };	
    state = {anchor: null,};
    componentDidUpdate(){
	const { state } = this.props;//classes, 
	var filmFocus=state.Path.getFilmFocus(state);
	//console.log("Film focus:",filmFocus);
	if (filmFocus !== undefined && filmFocus !== null) {
	    var fp=this.focusPoints[filmFocus];
	    if (fp !== undefined && fp !== null) {
		//console.log(" >>> Focusing on (Select) ",filmFocus);
		//console.log("Possibilities:",JSON.stringify(Object.keys(this.focusPoints)));
		fp.focus(); 
	    } else {
		//console.log(" >>> Not in focus (Select) ",filmFocus);
		//console.log("Possibilities:",JSON.stringify(Object.keys(this.focusPoints)));
	    }
	}
    }
    render() {
	const {classes, state, visible}=this.props;
	var title;
	if (visible !== undefined && ! visible && state.Settings.isInvisible(state,"Star")) {
	    return null;
	} else if (visible !== undefined) {
	    this.onClose = () => {this.setState({ anchor: null });};
	    this.onClick = (event) => {this.setState({ anchor: event.currentTarget });};
	    title="Select favourite";
	    var items=state.Path.getReels(state);
	    var mapFunction= (star,index)=>renderStar(classes,state,this.onClose,star,index,this.focusPoints);
	    //console.log("Length:",items.length,JSON.stringify(items));
	    if (items.length===0) {
		title="No favourites defined";
		return (<Button key="star" className={classes.buttonInvisible} title={title}>
			<StarIcon/>
			</Button>);
	    } else {
		var cls={button:classes.button}
		return (<div className={classes.view}>
			<Button
			className={classes.button}
			aria-owns={this.state.anchor ? 'star-menu' : undefined}
			aria-haspopup="true"
			onClick={this.onClick}
			title={title}
			>
			<StarIcon/>
			</Button>
			<Menu
			id="star-menu"
			anchorEl={this.state.anchor}
			open={Boolean(this.state.anchor)}
			onClose={this.onClose}
			>
			{items.map(mapFunction)}
		        <PlayFilm state={state} classes={cls}/>
			</Menu>
			</div>);
	    };
	} else {
	    title="Show favourite";
	    var onclick = (event) => {state.Settings.toggle(state,"Star");}
	    if (state.Settings.isInvisible(state,"Star")) {
		return (<Button key="star" className={classes.buttonInvisible} onClick={onclick} title={title}>
			<StarIcon/>
			</Button>);
	    } else {
		return (<Button key="star" className={classes.button} onClick={onclick} title={title}>
			<StarIcon/>
			</Button>);
	    };
	}
    }
};
Star.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Star);
