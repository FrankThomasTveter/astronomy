import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {black_palette} from '../mui/metMuiThemes' //, teal_palette
import CheckboxTree from 'react-checkbox-tree';
//
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


//import './react-checkbox-tree.css';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

const styles = theme => ({
    settings:{},
    order:{},
    tableOrder:{},
    buttonInvisible:{},
    config: {
        marginLeft: 'auto',
    },
    icons: {
	color:black_palette.main,
    },
    button:{
	color:'white'
    },
});

class Fragment extends Component {
    constructor() {
        super();
        this.state = {
            checked: [],
            expanded: [],
        };
    }
    componentDidMount() {
        const { state } = this.props;
	var checked=state.Database.getFragmentActive(state);
	this.setState({ checked });
    }
    render() {
        const { state, classes, items, force  } = this.props; //classes,
	this.checkfunction=checked => {
	    this.setState({ checked });
	    state.Database.setFragmentActive(state,checked);
	};
	this.expandfunction=expanded => {
	    this.setState({ expanded });
	    force();
	};
        return (
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
        );
    };
}

//	    icons={{
//		check: <span className="rct-icon rct-icon-check" />,
//		uncheck: <span className="rct-icon rct-icon-uncheck" />,
//		halfCheck: <span className="rct-icon rct-icon-half-check" />,
//		expandClose: <span className="rct-icon rct-icon-expand-close" />,
//		expandOpen: <span className="rct-icon rct-icon-expand-open" />,
//		expandAll: <span className="rct-icon rct-icon-expand-all" />,
//		collapseAll: <span className="rct-icon rct-icon-collapse-all" />,
//		parentClose: <span className="rct-icon rct-icon-parent-close" />,
//		parentOpen: <span className="rct-icon rct-icon-parent-open" />,
//		leaf: <span className="rct-icon rct-icon-leaf" />,
//	    }}
//	    iconsClass="fa5"



Fragment.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Fragment);
