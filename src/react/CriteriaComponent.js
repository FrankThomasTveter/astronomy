import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import PropTypes from  "prop-types";
//import {black_palette} from '../mui/metMuiThemes' //, teal_palette

import CheckIcon from '@material-ui/icons/CheckBox';
import UnCheckIcon from '@material-ui/icons/CheckBoxOutlineBlank';
//import HalfCheckIcon from '@material-ui/icons/IndeterminateCheckBox';
import HalfCheckIcon from '@material-ui/icons/CheckCircleOutline';
import ExpandCloseIcon from '@material-ui/icons/ExpandLess';
import ExpandOpenIcon from '@material-ui/icons/ExpandMore';
import ExpandAllIcon from '@material-ui/icons/ExpandMore';
import CollapseAllIcon from '@material-ui/icons/Remove';
import ParentCloseIcon from '@material-ui/icons/Folder';
import ParentOpenIcon from '@material-ui/icons/FolderOpen';
import LeafIcon from '@material-ui/icons/Extension';

import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

//console.log("Inside Criteria.")

const styles = theme => ({
    dataset:{},
    block:{},
    field:{},
    legend:{},
    button:{},
    buttonDisabled:{},
});
//        maxWidth: theme.spacing.getMaxWidth.maxWidth,
class Criteria extends Component {
    constructor(props) {
	super(props);
        const {state} = props;
	state.React.Criteria=this;
	this.state={checked:[],expanded:[]};
	this.show=this.show.bind(this);
    };
    componentDidMount() {
        const { state } = this.props;
        var checked=state.Astro.getChecked(state);
        this.setState({ checked });
        var expanded=state.Astro.getExpanded(state);
        this.setState({ expanded });
    }
    show(state) {
	this.forceUpdate();
    };
    handleChildClick(e) {
	e.stopPropagation();
	//console.log('child');
    };
    render() {
        const { classes, state, height } = this.props; // layout, 
	//var cls={criteria:classes.criteria,
	//	 content:classes.content,
	//	 button:classes.button,
	//	 buttonDisabled:classes.buttonDisabled};
	var visible;
	var items=state.Astro.getNodes(state);
	this.checkfunction= (checked)=>{
            this.setState({ checked });
            state.Astro.setChecked(state,checked);
	};
	this.expandfunction=(expanded)=>{
            this.setState({ expanded });
            state.Astro.setExpanded(state,expanded);
            //force();
	};
	if (state.Astro.show(state,"criteria")) {
	    visible="visible";
	} else {
	    visible="hidden";
	};
	//console.log("Classes:",height);
	var sheight=(height-50) + "px";
        return (
		<span className={classes.block} style={{visibility:visible}}>
		<fieldset className={classes.field}>
		<legend className={classes.legend}><small>criteria</small></legend>
		<div onMouseDown={this.handleChildClick} style={{maxHeight:sheight,minWidth:"300px",overflowY:'auto'}} className="cancel">
            <CheckboxTree
            nodes={items}
            icons={{
                check: <span><CheckIcon className={classes.icons}/></span>,
                uncheck: <span><UnCheckIcon className={classes.icons}/></span>,
                halfCheck: <span><HalfCheckIcon className={classes.icons}/></span>,
                expandClose: <span><ExpandCloseIcon className={classes.icons}/></span>,
                expandOpen: <span><ExpandOpenIcon className={classes.icons}/></span>,
                expandAll: <span><ExpandAllIcon className={classes.icons}/></span>,
                collapseAll: <span><CollapseAllIcon className={classes.icons}/></span>,
                parentClose: <span><ParentCloseIcon className={classes.icons}/></span>,
                parentOpen: <span><ParentOpenIcon className={classes.icons}/></span>,
                leaf: <span><LeafIcon className={classes.icons}/></span>,
            }}
            checked={this.state.checked}
            expanded={this.state.expanded}
            onCheck={this.checkfunction}
            onExpand={this.expandfunction}
         />
	        </div>
	        </fieldset>
	           </span> 
        );
    };
}
// disabled={false}


Criteria.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Criteria);
