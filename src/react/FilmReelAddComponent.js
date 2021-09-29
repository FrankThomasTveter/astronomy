import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';

import AddIcon from '@material-ui/icons/Add';

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
    button:{
	color:'white'
    },
});
function AddReel(props) {
    const {classes,onadd}=props;//state,
    var title="Add to reel.";
    return <Button className={classes.button} onClick={onadd} title={title}><AddIcon/></Button>;
};
class ReelAdd extends Component {
    constructor(props) {
	super(props);
	const {state} = props;
	state.React.ReelAdd=this;
	this.state={anchor:null, label:""};
	//state.Path.getLabel(state)
	this.onClick  = event => {this.setState({ anchor: event.currentTarget });};
	this.onAdd    = () => {state.Path.addFilm(state,state.Path.getSnapshort(state)); this.setState({label:""});
			       state.Show.showConfig(state);state.Show.showSettings(state);};
	this.onRemove = (index) => {this.setState({label:state.Path.removeFilm(state,index)});};
	this.handleChange=(event) => {
	    //console.log("handleChange:",event.target.value);
	    state.Path.setLabel(state,event.target.value);
	    state.Path.setTitle(state,event.target.value);
	    state.Show.showMapInfo(state,true);
	    this.setState({label:event.target.value});
        }
	//
	this.onClick=this.onClick.bind(this);
	this.onAdd=this.onAdd.bind(this);
    };
    showLabel(state) {
	var label=state.Path.getLabel(state);
	this.setState({label:label});
    }
    render() {
        const { classes, state } = this.props;
	//this.state.label=label;
	//var items=state.Path.getReels(state);
	const input=<input type={"search"} value={this.state.label} onChange={this.handleChange} />;
	var cls={button:classes.button};
	return (<div>
		<AddReel state={state} classes={cls} onadd={this.onAdd}/>
		<Chip icon={null} label={input}  onClick={onclick}/>
		</div>
	       );
    }
}

ReelAdd.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReelAdd);
