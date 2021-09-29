import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {black_palette} from '../mui/metMuiThemes';  // teal_palette

import Time         from './ConfigTimeComponent';
import Location     from './ConfigLocationComponent';
import Criteria     from './ConfigCriteriaComponent';
import Events       from './ConfigEventsComponent';
import Settings     from './SettingsComponent';
import FullScreen   from './ConfigFullScreenComponent';
import About        from './ConfigAboutComponent';

//	justifyContent: 'flex-end',
const styles = theme => ({
    horisontal: {
        marginLeft: 'auto',
	alignItems:'center',
	display: 'flex',
	justifyContent: 'center',
    },
    button: {
	backgroundColor:black_palette.main,
	color:'white',
	"&$buttonDisabled": {
            color: theme.palette.primary.main,
	},
    },
    buttonInvisible:{},
    buttonDisabled: {},
});

class Config extends Component {
    constructor(props) {
        super(props);
        const {state} = props;
        state.React.Config=this;
    };
    show(state) {
	//console.log("Called Config.show...");
	this.forceUpdate();
    };
    render() {
        const { classes, state } = this.props;
	//console.log("Rendering Config...");
	var cls={button:classes.button};
	return (<div className={classes.horisontal}>
		<Time state={state} classes={cls} visible={false}/>
		<Location state={state} classes={cls} visible={false}/>
		<Criteria state={state} classes={cls} visible={false}/>
		<Events state={state} classes={cls} visible={false}/>
                <FullScreen state={state} classes={cls} visible={false}/>
                <About state={state} classes={cls} visible={false}/>
                <Settings state={state} classes={cls} visible={false}/>
		</div>);
    }
}

Config.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Config);
