import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import PropTypes from  "prop-types";
import Time      from   './TimeComponent';
import Location  from   './LocationComponent';
import Criteria  from   './CriteriaComponent';
import Events    from   './EventsComponent';
import Globe     from  "./GlobeComponent";


//console.log("Inside Dataset.")

const styles = theme => ({
    dataset:{
	border:  '0px solid blue',
    },
    content:{},
    block:{},
    button:{},
    buttonInvisible:{},
    buttonDisabled:{},
});
//        maxWidth: theme.spacing.getMaxWidth.maxWidth,

class Dataset extends Component {
    constructor(props) {
        super(props);
        const {state} = props;
        state.React.Dataset=this;
	this.state={progress:false,mode:0};
    };
    render() {
        const { classes, state, layout } = this.props;
	var cls={block:classes.block,
		 button:classes.button,
		 buttonDisabled:classes.buttonDisabled};
	var gls={dataset:classes.dataset,
		 content:classes.content,
		 button:classes.button,
		 buttonDisabled:classes.buttonDisabled};
        return (
		<div className={classes.dataset}>
		   <Time state={state} classes={cls} layout={layout}/>
		   <Location state={state} classes={cls} layout={layout}/>
		   <Criteria state={state} classes={cls} layout={layout}/>
		   <Events state={state} classes={cls} layout={layout}/>
		   <div style={{position:"absolute", top:0, left:0, width:"100%",height:"100%", zIndex:-999999}}>
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
