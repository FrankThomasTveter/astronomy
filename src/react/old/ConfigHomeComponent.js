import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import GoHomeIcon from '@material-ui/icons/Home';

const styles = theme => ({
    home: {
	display: 'inline-block',
        marginRight: 'auto',
	height:'100%',
    },
    tableHome: {
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
// 
function GoHome(props) {
    const {state,classes}=props;
    var onclick=() => state.Path.goHome(state);
    var title="Home";
    return <Button className={classes.button} onClick={onclick} title={title}><GoHomeIcon/></Button>;
};
class Home extends Component {
    state={anchor:null};
    render() {
        const { classes, state, visible } = this.props;
	var onclick,title;
	if (visible !== undefined && ! visible && state.Settings.isInvisible(state,"Home")) {
	    return null;
	} else if (visible !== undefined) {
	    this.onClick = (event)=>{this.setState({ anchor: event.currentTarget });};
	    this.onClose = ()=>{this.setState({ anchor: null });};
	    title="Home settings";
	    var cls={button:classes.button};
	    return (<div className={classes.view}>
		    <GoHome state={state} classes={cls}/>
		    </div>);
	} else {
	    onclick = ()=>{state.Settings.toggle(state,"Home");}
	    title="Show Home";
	    if (state.Settings.isInvisible(state,"Home")) {
		return (<div className={classes.view}>
			<Button key="home" className={classes.buttonInvisible}
			onClick={onclick} title={title}><HomeIcon/></Button>
			</div>);
	    } else {
		return (<div className={classes.view}>
			<Button key="home" className={classes.button}
			onClick={onclick} title={title}><HomeIcon/></Button>
			</div>);
	    };
	}
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
