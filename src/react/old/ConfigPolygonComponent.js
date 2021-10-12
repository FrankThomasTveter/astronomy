import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import PolygonIcon from '@material-ui/icons/Opacity';// StarBorder, FormatShapes
import ClipIcon from '@material-ui/icons/FileCopyOutlined';
import FileIcon from '@material-ui/icons/FileCopy';
import DownloadIcon from '@material-ui/icons/CloudDownload';

// npm install --save-dev @iconify/react @iconify/icons-mdi
//import { Icon, InlineIcon } from '@iconify/react';
//import contentCopy from '@iconify/icons-mdi/content-copy';

const styles = theme => ({
    polygon: {
	display: 'inline-block',
        marginRight: 'auto',
	height:'100%',
    },
    tablePolygon: {
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
function ViewModeIcon (props) {
    const {state} = props;
    var mode=state.Polygon.mode;
    if (mode === state.Polygon.modes.clip) {
//        return (<Icon icon={contentCopy} />);
        return (<ClipIcon/>);
    } else {
        return (<FileIcon/>);
    }
};
function ModeButton (props) {
    const { state, classes, onclick } = props;
    var title;
    var mode=state.Polygon.mode;
    if (mode === state.Polygon.modes.clip) {
	title="Copy to clipboard";
    } else {
	title="Copy to file";
    };//polygon
    return (<MenuItem key={"copy"}  className={classes.polygon} onClose={onclose}>
	         <Button
	            className={classes.button}
	            onClick={onclick}
	            title={title}
                 >
                    {<ViewModeIcon state={state}/>}
	         </Button>
	    </MenuItem>);
}
function renderDownload(classes,state,item,index,onclose) {
    var show=(state,polygons,changed)=>{
	var name="Polygon"+item;
	state.Polygon.savePolygon(state,name,polygons);
	//console.log("Download done...",changed);
    };
    var onclick=() => {state.Polygon.makePolygon(state,item,show);};
    //var fgcolor=state.Colors.getLevelFgColor(item);
    var bgcolor=state.Colors.getLevelBgColor(item);
    var title="Download polygon";
    return (
	    <MenuItem key={"download"+item}  className={classes.polygon} onClose={onclose}>
	       <Button className={classes.button} onClick={onclick} title={title}>
	          <DownloadIcon style={{color:bgcolor}}/>
	       </Button>
	    </MenuItem>
    );
};
class PolygonMenu extends Component {
    state={anchor:null};
    render() {
        const { classes, state, visible } = this.props;
	if ( visible !== undefined && ! visible && state.Settings.isInvisible(state,"Polygon")) {
	    return null;
	} else if (visible !== undefined) {
	    var levels=state.Matrix.getLevels(state);
	    this.onChange = event => {state.Polygon.mode=(state.Polygon.mode+1)%2;this.forceUpdate()};
 	    this.onClick  = event => {this.setState({ anchor: event.currentTarget })};
	    this.onClose  = () => {this.setState({ anchor: null });};
	    this.onClose = this.onClose.bind(this);
	    var mapFunction= (item,index)=>renderDownload(classes,state,item,index,this.onClose);
	    //var cls={button:classes.button}; // classes.tablePolygon
	    return (<div className={classes.view}>
		    <Button
                    className={classes.button}
                    aria-owns={this.state.anchor ? 'tablefiles-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.onClick}
	            title={"Save polygon"}
		    >
	  	    {<PolygonIcon state={state}/>}
                    </Button>
		    <Menu
	            className={classes.tablePolygon}
                    id="tablefiles-menu"
	            anchorEl={this.state.anchor}
                    open={Boolean(this.state.anchor)}
                    onClose={this.onClose}
		    >
		    {levels.map(mapFunction)}
		    <ModeButton state={state} classes={classes} onclick={this.onChange}/>
	            </Menu>
		    </div>
		   );
	} else {
	    var onclick = () => {state.Settings.toggle(state,"Polygon");};
	    var title="Show Polygon";
	    if (state.Settings.isInvisible(state,"Polygon")) {
		return (<div className={classes.view}>
			<Button key="polygon" className={classes.buttonInvisible}
			onClick={onclick} title={title}><PolygonIcon/></Button>
			</div>);
	    } else {
		return (<div className={classes.view}>
			<Button key="polygon" className={classes.button}
			onClick={onclick} title={title}><PolygonIcon/></Button>
			</div>);
	    }
	}
    }
}

PolygonMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PolygonMenu);
