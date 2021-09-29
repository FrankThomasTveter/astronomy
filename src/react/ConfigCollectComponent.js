import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SetHomeIcon from '@material-ui/icons/HomeOutlined';

import Auto         from './AutoComponent';
import CollectSelectMenu   from './CollectSelectMenuComponent';
import CollectPathMenu      from './CollectPathMenuComponent';
import CollectListMenu  from './CollectListMenuComponent';
import PriorityMenu from './PriorityMenuComponent';

import KeyIcon from '@material-ui/icons/VpnKey';

const styles = theme => ({
    order: {
	display: 'inline-block',
        marginRight: 'auto',
	height:'100%',
    },
    tableOrder: {
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

function SetHome(props) {
    const {state,classes}=props;
    var onclick=() => {state.Path.setHome(state);};
    var title="Set home";
    return <Button className={classes.button} onClick={onclick} title={title}><SetHomeIcon/></Button>;
};
class CollectMenu extends Component {
    show(state) {
	//console.log("Called Config.show...");
	this.forceUpdate();
    };
    state={anchor:null};
    render() {
        const { classes, state,visible } = this.props;
	var onclick, title;
	if (visible !== undefined && ! visible && state.Settings.isInvisible(state,"Key")) {
	    return null;
	} else if (visible !== undefined) {
	    this.onClick = event => {this.setState({ anchor: event.currentTarget });};
	    this.onClose = () => {this.setState({ anchor: null });};
	    title="Key settings";
	    var cls={button:classes.button};
	    return (<div className={classes.tableOrder}>
		   <Button
                      className={classes.button}
                      aria-owns={this.state.anchor ? 'tablecollects-menu' : undefined}
                      aria-haspopup="true"
                      onClick={this.onClick}
	              title={title}
		   >
	  	       {<KeyIcon state={state}/>}
                     </Button>
		     <Menu
	                className={classes.tableOrder}
                        id="tablecollects-menu"
	                anchorEl={this.state.anchor}
                        open={Boolean(this.state.anchor)}
                        onClose={this.onClose}
		     >
		    <MenuItem className={classes.order} key="sethome" onClose={this.onClose}>
		       <SetHome state={state} classes={cls}/>
		    </MenuItem>
		    <MenuItem className={classes.order} key="auto" onClose={this.onClose}>
		       <Auto state={state} classes={cls}/>
		    </MenuItem>
		    <MenuItem className={classes.order} key="select" onClose={this.onClose}>
		       <CollectSelectMenu state={state} classes={cls}/>
		    </MenuItem>
		    <MenuItem className={classes.order} key="keys" onClose={this.onClose}>
		       <CollectPathMenu state={state} classes={cls}/>
		    </MenuItem>
		    <MenuItem className={classes.order} key="list" onClose={this.onClose}>
		       <CollectListMenu state={state} classes={cls}/>
		    </MenuItem>
		    <MenuItem className={classes.order} key="priorities" onClose={this.onClose}>
		       <PriorityMenu state={state} classes={cls}/>
		    </MenuItem>
	             </Menu>
		</div>
		   );
	} else {
	    onclick=() => {state.Settings.toggle(state,"Key");};
	    title="Show Key";
	    if (state.Settings.isInvisible(state,"Key")) {
		return <Button key="key" className={classes.buttonInvisible} onClick={onclick} title={title}><KeyIcon/></Button>;
	    } else {
		return <Button key="key" className={classes.button} onClick={onclick} title={title}><KeyIcon/></Button>;
	    };
	};
    }
}

CollectMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CollectMenu);
