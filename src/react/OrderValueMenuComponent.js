import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SortIcon from '@material-ui/icons/Sort';
import ValueIcon from '@material-ui/icons/Apps';
import OrderValue from './OrderValueComponent';

const styles = theme => ({
    values: {
	display: 'inline-block',
        marginLeft: 'auto',
	verticalAlign : 'center',
    },
    order:{},
    button:{},
    tableOrder:{},
    buttonInvisible:{}
});
function clearOrder(classes,state,keyitem) {
    var onClick = ()=> {state.Path.bumpOrder(state,keyitem,"");};
    return (<MenuItem key={"button"}>
	    <Button className={classes.button} onClick={onClick}>
	    {<SortIcon/>}
	    </Button>
	    </MenuItem>);
};
function renderMenuItem(classes,state,keyitem,valueitem,valueindex) {
    return (<MenuItem value={valueitem} key={valueitem}>
	    <OrderValue state={state} keyitem={keyitem} valueitem={valueitem}/> 
	    </MenuItem>);
};
class OrderValueMenu extends Component {
    state={anchor:null};
    render() {
        const { classes, state, keyitem } = this.props;
	this.onClick = event => {this.setState({ anchor: event.currentTarget });};
	this.onClose = () => {this.setState({ anchor: null });};
	var items=state.Path.getOrderValues(state,keyitem);
	var mapFunction= (item,index)=>renderMenuItem(classes,state,keyitem,item,index);
	//console.log("OrderValues.rendering",keyitem);
	return (
		<div className={classes.values} key={keyitem}>
		      <Button
	                 className={classes.button}
                         aria-owns={this.state.anchor ? 'values-menu' : undefined}
                         aria-haspopup="true"
                         onClick={this.onClick}
		      >
	  	         {<ValueIcon state={state}/>} {keyitem}
                      </Button>
		      <Menu
                         id="values-menu"
	                 anchorEl={this.state.anchor}
                         open={Boolean(this.state.anchor)}
                         onClose={this.onClose}
		      >
		        {items.map(mapFunction)}
		        {clearOrder(classes,state,keyitem)}
	              </Menu>
		</div>
	);
    }
};
OrderValueMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderValueMenu);
