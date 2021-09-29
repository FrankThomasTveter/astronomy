import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import UndoIcon from '@material-ui/icons/Undo';

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
    buttonDisabled:{},
    horisontal:{},
});

class Undo extends Component {
    render() {
        const {state,classes,visible} = this.props;
	var onclick,title;
	if (visible !== undefined && ! visible && state.Settings.isInvisible(state,"Undo")) {
	    return null;
	} else if (visible !== undefined) {
	    onclick=() => state.Navigate.undo(state);
	    var disundo=! state.Navigate.canUndo(state);
	    title="Undo";
	    return (<div className={classes.view}>
		    <Button key="undo" className={classes.button}
		    disabled={disundo} onClick={onclick}
		    title={title}><UndoIcon/></Button>
		    </div>);
	} else {
	    onclick=() => {state.Settings.toggle(state,"Undo");};
	    title="Show Undo";
	    if (state.Settings.isInvisible(state,"Undo")) {
		return (<div className={classes.view}>
			<Button key="undo" className={classes.buttonInvisible}
			onClick={onclick} title={title}><UndoIcon/></Button>
			</div>);
	    } else {
		return (<div className={classes.view}>
			<Button key="undo" className={classes.button}
			onClick={onclick} title={title}><UndoIcon/></Button>
			</div>);
	    };
	};
    }
}

export default withStyles(styles)(Undo);
