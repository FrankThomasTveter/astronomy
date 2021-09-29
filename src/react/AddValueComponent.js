import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {teal_palette} from '../mui/metMuiThemes';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
    value: {
	display: 'inline-block',
        marginRight: 'auto',
    },
    selchip: {
        margin: theme.spacing(0),
	cursor: "pointer",
        color:"blue",
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
    button:{
	color:'white'
    },
});

class Value extends Component {
    constructor(props) {
	super(props);
	//const {state} = props;
	this.state={anchor:null, label:""};
	this.handleChange=(event) => {
	    //console.log("handleChange:",event.target.value);
	    //this.setState({label:event.target.value});
        }
	this.handleChange=this.handleChange.bind(this);
    };
    render() {
        const { classes, state, keyitem, label, add, setState} = this.props;
	this.value="";
	this.onClose = () => {
	    setState({add:null});
	    //this.setState({ anchor: null });
	};
 	this.onClick = event => {
	    setState({ add: event.currentTarget });
	    //this.setState({ anchor: event.currentTarget });
	};
	this.onAdd = () => {
	    //state.Path.setPathFocus(state,keyitem+"_selected");
	    //console.log("Select->focus:",keyitem+"_selected",label);
	    state.Path.toggleSelect(state,keyitem,label);
	};
	const chip=<AddIcon onClick={this.onAdd}/>;
	const input=<input type="text" value={label} onChange={this.handleChange} autoFocus={true}/>;
	var title="Add selected value.";
	return (
	     <div className={classes.value}>
		<Button
                      className={classes.button}
                      aria-owns={add ? 'values-add' : undefined}
                      aria-haspopup="true"
                      onClick={this.onClick}
	              title={title}
		    >
	  	       {<AddIcon/>}
                </Button>
	        <Menu
		    id="values-add"
		    anchorEl={add}
		    open={Boolean(add)}
		    onClose={this.onClose}
		    >
		<MenuItem className={classes.order} key="button">
		<Chip
	              icon={chip}
	              className={classes.selchip}
	              variant="outlined"
	              label={input}
		   />		
		</MenuItem>
		 </Menu>
		</div>
	);
    }//onChange={this.handleChange} 
    }

Value.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Value);
