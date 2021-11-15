import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import PropTypes from  "prop-types";
import Time      from   './TimeComponent';
import Location  from   './LocationComponent';
import Criteria  from   './CriteriaComponent';
import Events    from   './EventsComponent';
import Globe     from  "./GlobeComponent";
import {Rnd} from 'react-rnd'; // Both at the same time


//console.log("Inside Dataset.")

const styles = theme => ({
    dataset:{
	border:  '0px solid blue',
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	justifyContent: 'space-between',
	alignItems: 'flex-start',
    },
    content:{},
    block:{},
    field:{
	color:"white",
	margin: "5px",
	borderRadius:"5px", 
	border: "2px solid white",
	padding:"0px 3px 3px",
	paddingTop: "0px",
    },
    legend :{
    },
    button:{},
    buttonInvisible:{},
    buttonDisabled:{},
});
//        maxWidth: theme.spacing.getMaxWidth.maxWidth,

class Dataset extends Component {
    constructor(props) {
        super(props);
        const {state} = props;
	this.manager= {
	    maxZIndex: "999",
	    prevDraggedNode: null,
	    prevDraggedNodeZIndex: null
	};
	state.React.Dataset=this;
	this.onDragStart=this.onDragStart.bind(this);
	this.state={progress:false,mode:0,width:0,height:0};
    };
    updateDimensions = () => {
	this.setState({ width: this.divElement.clientWidth, height: this.divElement.clientHeight });
    };
    componentDidMount() {
	const height = this.divElement.clientHeight;
	console.log("Height:",height);
	this.updateDimensions();
	window.addEventListener('resize', this.updateDimensions);
    };
    componentWillUnmount() {
	window.removeEventListener('resize', this.updateDimensions);
    }
    onDragStart(e,node) {
	console.log("Dragging...",this.manager);
        if (this.manager.prevDraggedNode) {
            this.manager.prevDraggedNode.style.zIndex = this.manager.prevDraggedNodeZIndex;
        }
        this.manager.prevDraggedNode = node.node;
        this.manager.prevDraggedNodeZIndex = this.manager.prevDraggedNode.style.zIndex;
        this.manager.prevDraggedNode.style.zIndex = this.manager.maxZIndex;
    };
    render() {
        const { classes, state, layout } = this.props;
	var rls={dataset:classes.dataset,
		 block:classes.block,
		 field:classes.field,
		 legend:classes.legend,
		 button:classes.button,
		 buttonDisabled:classes.buttonDisabled};
	var cls={block:classes.block,
		 field:classes.field,
		 legend:classes.legend,
		 button:classes.button,
		 buttonDisabled:classes.buttonDisabled};
	var gls={dataset:classes.dataset,
		 content:classes.content,
		 button:classes.button,
		 buttonDisabled:classes.buttonDisabled};
        return (
		<div className={classes.dataset}
	           ref={ (el) => { this.divElement = el } }>
		<Rnd key="time" zindex={5} bounds="parent" default={{x:10,y:10}} onDragStart={this.onDragStart}>
		   <Time state={state} classes={cls} layout={layout} height={this.state.height}/>
		</Rnd>
		<Rnd key="layout" zindex={4} bounds="parent" default={{x:30,y:30}} onDragStart={this.onDragStart}>
		   <Events state={state} classes={cls} layout={layout} height={this.state.height}/>
		</Rnd>
		<Rnd key="location" zindex={2} bounds="parent" default={{x:50,y:50}} onDragStart={this.onDragStart}>
		   <Location state={state} classes={cls} layout={layout} height={this.state.height}/>
		</Rnd>
		<Rnd key="criteria" zindex={3} bounds="parent" default={{x:70,y:70}} onDragStart={this.onDragStart}>
		   <Criteria state={state} classes={rls} layout={layout} height={this.state.height}/>
		</Rnd>
		   <div style={{position:"absolute", top:0, left:0,
	   	      width:"100%",height:"100%", zIndex:-99,pointerEvents:"auto"}}>
		      <Globe   state={state}   classes={gls}/>
		   </div>
		</div>
        );
    }

}

// disabled={false}


Dataset.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dataset);
