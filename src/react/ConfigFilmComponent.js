import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AddFilm       from './FilmReelAddComponent';
import FilmReel       from './FilmReelMenuComponent';

import FilmIcon from '@material-ui/icons/Theaters';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';

const styles = theme => ({
    film: {
	display: 'inline-block',
        marginRight: 'auto',
	height:'100%',
    },
    tableFilm: {
	display: 'inline-block',
        marginRight: 'auto',
    },
    button:{
	color:'white'
    },
    buttonInvisible:{
	color:'gray'
    },
});
//
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
    return <Button className={classes.button} onClick={onclick} title={title}><Play state={state}/></Button>;
};
class FilmMenu extends Component {
    constructor(props) {
	super(props);
	const {state} = props;
	this.state={anchor:null,play:state.Path.film.play};
    };
    render() {
        const { classes, state, visible } = this.props;
	var title;
	if (visible !== undefined && ! visible && state.Settings.isInvisible(state,"Film")) {
	    return null;
	} else if (visible !== undefined) {
	    this.onClick = event => {this.setState({ anchor: event.currentTarget });};
	    this.onClose = () => {this.setState({ anchor: null });};
	    title="Film settings";
	    var cls={button:classes.button}
	    return (<div className={classes.tableFilm}>
		   <Button
                      className={classes.button}
                      aria-owns={this.state.anchor ? 'tablefilms-menu' : undefined}
                      aria-haspopup="true"
                      onClick={this.onClick}
	              title={title}
		   >
	  	       {<FilmIcon state={state}/>}
                     </Button>
		     <Menu
	                className={classes.tableFilm}
                        id="tablefilms-menu"
	                anchorEl={this.state.anchor}
                        open={Boolean(this.state.anchor)}
                        onClose={this.onClose}
		     >
		        <MenuItem className={classes.film} key="film" onClose={this.onClose}>
		           <FilmReel state={state} classes={cls}/>
		        </MenuItem>
		        <MenuItem className={classes.film} key="add" onClose={this.onClose}>
		           <AddFilm state={state} classes={cls}/>
		        </MenuItem>
		        <MenuItem className={classes.film} key="play" onClose={this.onClose}>
		           <PlayFilm state={state} classes={cls}/>
		        </MenuItem>
	             </Menu>
		</div>
		   );
	} else {
	    var onclick = () => {state.Settings.toggle(state,"Film");};
	    title="Show Film";
	    if (state.Settings.isInvisible(state,"Film")) {
		return <Button key="film" className={classes.buttonInvisible} onClick={onclick} title={title}><FilmIcon/></Button>;
	    } else {
		return <Button key="film" className={classes.button} onClick={onclick} title={title}><FilmIcon/></Button>;
	    }
	};
    }
}


FilmMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FilmMenu);
