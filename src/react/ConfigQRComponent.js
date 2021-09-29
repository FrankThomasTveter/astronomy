import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { QRCode } from "react-qr-svg";
 
//	display: 'inline-block',
//        marginRight: 'auto',
//	display: 'inline-block',
//        marginRight: 'auto',


const styles = theme => ({
    order: {
    },
    tableOrder: {
    },
    button:{
	color:'white'
    },
    buttonInvisible:{
	color:'gray'
    },
});


function getTextHeight(fontname, fontsize){
    if(getTextHeight.c === undefined){
        getTextHeight.c=document.createElement('canvas');
        getTextHeight.ctx=getTextHeight.c.getContext('2d');
    }
    if (fontname !== undefined) {
 	getTextHeight.ctx.font = fontsize + ' ' + fontname;
    }
    return 5*getTextHeight.ctx.measureText('M').width;
};

function QrIcon(props) {
    const {state,width}=props; //classes,
    var url=state.Utils.getQRUrl(state);
    console.log("Got path:",url);
    if (width !== undefined) {
	return <QRCode value={url} level="Q" style={{ width: width }}/>;
    } else {
	return <QRCode value={url} level="Q" style={{ width: getTextHeight()}}/>;
    }
};
function QrItem(props) {
    const {state,classes,width}=props;
    var h=window.innerHeight*0.5;
    var w=window.innerWidth*0.5;
    var ww =Math.min(w,h,width);
    console.log("Width:",w,h,width,ww);
    return (
	    <QrIcon state={state} classes={classes} width={ww}/>
    );
};
class QrMenu extends Component {
    show(state) {
	//console.log("Called Config.show...");
	this.forceUpdate();
    };
    state={anchor:null};
    render() {
        const { classes, state,visible } = this.props;
	var onclick, title;
	if (visible !== undefined && ! visible && state.Settings.isInvisible(state,"Qr")) {
	    return null;
	} else if (visible !== undefined) {
	    this.onClick = event => {this.setState({ anchor: event.currentTarget });};
	    this.onClose = () => {this.setState({ anchor: null });};
	    title="Show link as QR-code";
	    return (<div className={classes.view}>
		   <Button
                      className={classes.button}
                      aria-owns={this.state.anchor ? 'tableqrs-menu' : undefined}
                      aria-haspopup="true"
                      onClick={this.onClick}
	              title={title}
		   >
	  	    {<QRCode value="Press the button!" style={{ width: getTextHeight()}}/>}
                     </Button>
		     <Menu
	                className={classes.tableOrder}
                        id="tableqrs-menu"
	                anchorEl={this.state.anchor}
                        open={Boolean(this.state.anchor)}
                        onClose={this.onClose}
		     >
		    <MenuItem className={classes.order} key="sethome" onClose={this.onClose}>
		    <QrItem state={state} classes={classes} width={2*256}/>
		    </MenuItem>
	             </Menu>
		</div>
		   );
	} else {
	    onclick=() => {state.Settings.toggle(state,"Qr");};
	    title="Show QR-code";
	    if (state.Settings.isInvisible(state,"Qr")) {
		return (<div className={classes.view}>
			<Button key="qr" className={classes.buttonInvisible}
			onClick={onclick} title={title}><QRCode value="Press the button!" style={{ width: getTextHeight() }}/></Button>
			</div> );
	    } else {
		return (<div className={classes.view}>
			<Button key="qr" className={classes.button}
			onClick={onclick} title={title}><QRCode value="Press the button!" style={{ width: getTextHeight() }}/></Button>
			</div>);
	    };
	};
    }
}

QrMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QrMenu);
