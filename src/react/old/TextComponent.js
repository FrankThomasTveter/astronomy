import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    pointer: {
	cursor:"pointer",
	padding: theme.spacing(0),
    },
    nopointer: {
	padding: theme.spacing(0),
    },
});

function updateCanvas(item) {
    const {label,width,height,dw,dh,rotate} = item.props;
    const cnv=item.refs.text;
    const ctx = cnv.getContext('2d');
    console.log("Text:",label,width,height,dw,dh,rotate);
    //var cnvheight = cnv.height;
    ctx.save();
    //ctx.font = "40px Courier"
    ctx.textAlign = "left"; //left right center
    ctx.strokeStyle='black';
    ctx.strokeRect(0,0, width,height);
    if (rotate !== undefined && rotate) {
	ctx.translate(width-dw,height-dh);
	ctx.rotate(-Math.PI/2);
	ctx.fillText(label, 0, 0); // labelXposition
    } else {
	ctx.fillText(label, dw, height-dh); // labelXposition
    };
    ctx.restore();
}
    

// dh dw height width rotate
class TextComponent extends Component {
    componentDidMount() {
        updateCanvas(this);
    }
    componentDidUpdate() {
        updateCanvas(this);
    }
    render() {
        const { classes, onclick, title, width, height, ...other } = this.props;
	var cursor=classes.nopointer;
	if (onclick !== undefined) {
	    cursor=classes.pointer;
	}
        return (
		<canvas {...other} className={cursor} classes={classes} onClick={onclick} title={title} ref="text" width={width} height={height}/>
        );
    }
}

TextComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TextComponent);
// function getTextWidth(txt, fontname, fontsize){
//     if(getTextWidth.c === undefined){
//         getTextWidth.c=document.createElement('canvas');
//         getTextWidth.ctx=getTextWidth.c.getContext('2d');
//     }
//     if (fontname !== undefined) {
// 	getTextWidth.ctx.font = fontsize + ' ' + fontname;
//     }
//     return getTextWidth.ctx.measureText(txt).width;
// };
// function getTextHeight(fontname, fontsize){
//     if(getTextHeight.c === undefined){
//         getTextHeight.c=document.createElement('canvas');
//         getTextHeight.ctx=getTextHeight.c.getContext('2d');
//     }
//     if (fontname !== undefined) {
// 	getTextHeight.ctx.font = fontsize + ' ' + fontname;
//     }
//     return getTextHeight.ctx.measureText('M').width;
// }
