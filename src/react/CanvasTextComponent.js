import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    canvas: {
	overflow:"hidden",
	width:"100%",
	height:"100%",
	//border: '1px dotted red',
    },
    pointer: {
	cursor:"pointer",
	padding: theme.spacing(0),
    },
    nopointer: {
	padding: theme.spacing(0),
    },
});
function drawMarker(ctx,height,offset,width) {
    ctx.strokeStyle='blue';
    ctx.beginPath();
    ctx.moveTo(offset,0);
    ctx.lineTo(offset+width,height);
    ctx.moveTo(offset+width,0);
    ctx.lineTo(offset,height);
    ctx.strokeRect(offset,0,offset+width,height);
    ctx.stroke();
};
function updateCanvas(item) {
    const {label,plan,color} = item.props;
    const cnv=item.refs.text;
    if (cnv === undefined) {return;}
    const ctx = cnv.getContext('2d');
    var ilabel=label||"";
    //var cnvheight = cnv.height;
    ctx.save();
    //ctx.translate(newx, newy);
    if (plan.font !== undefined) {
	ctx.font = plan.font;
    }
    //ctx.font = "40px Courier"
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    //
    //ctx.strokeStyle='gray';
    //ctx.strokeRect(0,0,cnv.width,cnv.height);
    //
    //ctx.rect(0,0,100,100);
    //ctx.stroke();
    //console.log(">>>> Plan:",JSON.stringify(plan),item.width,item.height);
    if (color !== undefined) {
	//console.log("Using color:",color);
	ctx.fillStyle=color;
    } else {
	ctx.fillStyle='black';
	//console.log("Using black...");
    };
    if (plan.rotate !== undefined && plan.rotate) {
	ctx.textAlign = "left"; //left right center
	//console.log("XXX:",item.width,plan.border,plan.xoffset,th);
	ctx.translate(item.width-plan.border-plan.xoffset,item.height-plan.border-plan.yoffset);
	ctx.rotate(-Math.PI/2);
	ctx.fillText(ilabel, 0, 0); // labelXposition
    } else if (plan.align === "right") {
	ctx.textAlign = "right"; //left right center
	ctx.fillText(ilabel, plan.width-plan.border+plan.xoffset, item.height-plan.border-plan.yoffset); // labelXposition
    } else if (plan.align === "center") {
	ctx.fillStyle='#FFF';
	ctx.textAlign = "center"; //left right center
	//console.log("Center:",ilabel,item.width, plan.border, plan.xoffset,item.width-plan.border+plan.xoffset);
	ctx.fillText(ilabel, item.width/2+plan.border+plan.xoffset, item.height-plan.border-plan.yoffset); // labelXposition
    } else {
	ctx.fillText(ilabel, plan.border+plan.border+plan.xoffset, item.height-plan.border-plan.yoffset); // labelXposition
    };
    ctx.restore();
    
    //ctx.rect(0,0,item.width,item.height);
    //ctx.stroke();
    //console.log("Label:",ilabel,item.width,item.height, plan.border,plan.xoffset);
    //console.log("CanvasText:",cnv.width,cnv.height);
    if (item.invalid) {
	drawMarker(ctx,cnv.height,0,cnv.width);
    };
}
    

class CanvasTextComponent extends Component {
    componentDidMount() {
        updateCanvas(this);
    }
    componentDidUpdate() {
        updateCanvas(this);
    }
    render() {
        const { classes, onclick, title, plan, color, invalid, ...other } = this.props;
	this.width=plan.width;
	this.height=plan.height;
	this.invalid=invalid;
	this.color=color;
	//console.log("Text plan:",JSON.stringify(plan));
        return (
		<canvas {...other} className={classes.canvas} classes={classes} onClick={onclick} title={title} 
	            plan={plan} width={plan.width} height={plan.height-1} ref="text" />
        );
    }
}

CanvasTextComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CanvasTextComponent);
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
