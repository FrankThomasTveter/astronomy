import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';

//import { CompactPicker as Picker } from 'react-color';
import { ChromePicker as Picker } from 'react-color';

const styles = theme => ({
    settings: {
        marginRight: 'auto',
	color:'red',
    },
    paper: {
	border: '1px solid',
	padding: '10px',
	backgroundColor: theme.palette.background.paper,
    },
    divTableCell:{
	border: '0px solid #999999',
	display: 'table-cell',
	padding: '0px',
//	border:  '1px solid blue',
    },
});

class LevelColor extends Component {
    state = {anchor: null};
    constructor() {
	super();
	this.open=this.open.bind(this);
	this.close=this.close.bind(this);
	this.div=React.createRef();
	this.popper=React.createRef();
    }
    open(event) {	
//	var node=this.div.current;
//	if ( ! this ) {
//	    console.log("P This is undefined...");
//	} else if ( ! node) {
//	    console.log("P Node is undefined...");
//	} else {
//	    console.log("P OK...");
//	}
	this.setState({ anchor: event.currentTarget })
	const clickOff = function (evt){ 
	    //console.log("Got clickoff event...");
	    var node=this.popper.current;
	    if ( ! this ) {
		//console.log("This is undefined...");
		document.removeEventListener('click', clickOff);
		this.close();
	    } else if ( ! node) {
		//console.log("Node is undefined...");
		document.removeEventListener('click', clickOff);
		this.close();
	    } else if (node.contains(evt.target)) {
		//console.log("Inside doc...");
	    } else {
		//console.log("Not inside doc...");
		document.removeEventListener('click', clickOff);
		this.close();
	    }
	}.bind(this);
	document.addEventListener('click', clickOff);
    };
    close() {
	// ... hide the menu element ...
	//console.log("Closing...");
	this.setState({ anchor: null });
    };
    render() {
        const { state,classes,bg,fg,level } = this.props;
	//console.log("Rendering LevelColor...");
	this.onClick = (event) => {this.open(event)};//console.log("Color:",hex,level);
	const handleColorChange = ({ hex }) => {state.Colors.setLevelBgColor(state,level,hex);state.Show.showAll(state,false,true);}
	var style={color:fg,backgroundColor:bg,textAlign:'center'};
	this.node=<div className={classes.divTableCell} style={style}
	               onClick={this.onClick} ref={this.div} title={"Select color for level "+level}>
		    <div>
		      {level}
		    </div>
	          <Popper
		     className={classes.paper} 
		     settings={{float:'right'}}
	             anchorEl={this.state.anchor}
                     open={Boolean(this.state.anchor)}
	          >
	            <div ref={this.popper}>
		       <Picker className={classes.paper} color={bg} onChangeComplete={ handleColorChange }/>
	            </div>
	          </Popper>
		</div>
	    return this.node;
    }
}

LevelColor.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LevelColor);
