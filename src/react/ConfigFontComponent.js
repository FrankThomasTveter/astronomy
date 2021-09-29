import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import FontIcon from '@material-ui/icons/TextFields';

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

class Font extends Component {
    render() {
        const {state,classes,visible} = this.props;
	var onclick, title;
	if (visible !== undefined && ! visible && state.Settings.isInvisible(state,"Font")) {
	    return null;
	} else if (visible !== undefined) {
	    onclick=() => {state.Layout.changeFont(state);};
	    title="Change font";
	    return (<div className={classes.view}>
		    <Button key="font" className={classes.button}
		    onClick={onclick} title={title}><FontIcon/></Button>
		    </div>);
	} else {
	    onclick=() => {state.Settings.toggle(state,"Font");};
	    title="Show font";
	    if (state.Settings.isInvisible(state,"Font")) {
		return (<div className={classes.view}>
			<Button key="font" className={classes.buttonInvisible}
			onClick={onclick} title={title}><FontIcon/></Button>
			</div>);
	    } else {
		return (<div className={classes.view}>
			<Button key="font" className={classes.button}
			onClick={onclick} title={title}><FontIcon/></Button>
			</div>);
	    }
	}
    }
}

export default withStyles(styles)(Font);
