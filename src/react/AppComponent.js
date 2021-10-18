import React, { Component} from 'react';
import {MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import createTheme from '../mui/createTheme'
import {black_palette, teal_palette} from '../mui/metMuiThemes'
import PropTypes from "prop-types";
import { Notifications } from 'react-push-notification';
import Popup from 'react-popup';

import Header  from "./HeaderComponent";
import Dataset from "./DatasetComponent";
import Footer  from "./FooterComponent";
import BackGroundImage from "../images/waves.png";
//import {BrowserRouter, Switch, Route} from 'react-router-dom';

import Colors from '../lib/ColorsLib';
import File from '../lib/FileLib';
import Database from '../lib/DatabaseLib';
import Default from '../lib/DefaultLib';
import Astro from '../lib/AstroLib';
import Html from '../lib/HtmlLib';
import Layout from '../lib/LayoutLib';
import Custom from '../lib/CustomLib';
import Grid from '../lib/GridLib';
import Matrix from '../lib/MatrixLib';
import Navigate from '../lib/NavigateLib';
import Path from '../lib/PathLib';
import Polygon from '../lib/PolygonLib';
import Auto from '../lib/AutoLib';
import Show from '../lib/ShowLib';
import Svg from '../lib/SvgLib';
import Cell from '../lib/CellLib';
import Threshold from '../lib/ThresholdLib';
import Settings from '../lib/SettingsLib';
import Utils from '../lib/UtilsLib';
import { SnackbarProvider, withSnackbar } from 'notistack';


//top: 'calc(200px + 1em)',
//        flex: '1 0 auto',
//

const footheight="70px";
const headerheight="70px";

const layout = {
    header:{
	width:'100%',
	height:'calc(2% + '+headerheight+')',
    },
    dataset:{
	width:'100%',
	height:'calc(100% - '+headerheight+' - '+footheight+' + 40px)',
	content:{
	    width:'100%',
	    height:'100%',
	}
    },
    footer:{
	width:'100%',
	banner: {
	    width:'100%',
	    height:'calc('+footheight+' - 20px)',
	}
    }
};

const styles = theme => ({
    root: {
	position:'fixed',
	padding:0,
	margin:0,
	top:0,
	left:0,
	width: '100%',
	height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `url(${BackGroundImage})`,
 	//border:  '1px solid green',
    },
    header: {
	backgroundColor:teal_palette.main,
	color:'white',
	position:'fixed',
	height:layout.header.height, //'calc(2% + '+headerheight+')',
	width: layout.header.width,//'100%',
	maxHeight: headerheight,
	paddingRight:'5px',
    },
    dataset: {
	position:'fixed',
	marginLeft:0,
	top: '70px',
	bottom: '30px',
	height: layout.dataset.height,//'calc(100% - '+headerheight+' - '+footheight+' - 5px)',
	width: layout.dataset.width, //'92%',
        overflowY: 'auto',
	maxHeight: '100%',
	maxWidth: '100%',
	//border:  '1px solid red',	

    },
    content: {
	//border:  '1px solid red',
	height: layout.dataset.content.height,//'98%',
	width: layout.dataset.content.width,//'calc(98% - 5px)',
    },
    footer: {
	position:'fixed',
	width: layout.footer.width,//'100%',
	bannerheight:layout.footer.banner.height,//'calc('+footheight+' - 20px)',
	left:0,
	bottom:0,
	//border:  '1px solid green',	
    },
    block : {
	padding: '5px',
	paddingTop: '0px',
	borderRadius: '5px',
	borderColor: teal_palette.main,
	display:"inline-block",
	backgroundColor:teal_palette.main,
//	backgroundColor:"white",
	color: "white",
//	color: "black",
    },
    button: {
	backgroundColor:black_palette.main,
	color:'white',
	"&$buttonDisabled": {
            color: theme.palette.primary.main,
	},
    },
    buttonInvisible: {
	backgroundColor:black_palette.main,
	color:'gray',
    },
    buttonDisabled: {
        color: "white",
},
});

//	border:  '1px solid green',

/**
 * The entire app get generated from this container.
 * We set the material UI theme by choosing a primary and secondary color from the metMuiThemes file
 * and creating a color palette with the createTheme method.
 * For information about using the different palettes see material UI documentation
 * 
 * This app contains the database, path and matrix states...
 */
class App extends Component {
    constructor(props) {
	super(props);
	this.state={
	    Default:   new Default()   ,
	    Astro:     new Astro()   ,
	    Colors:    new Colors()    ,
	    Layout:    new Layout()    ,
	    Path:      new Path()      ,
	    Polygon:   new Polygon()   ,
	    Auto:      new Auto()      ,
	    Navigate:  new Navigate()  ,
	    Show:      new Show()      ,
	    File:      new File()      ,
	    Database:  new Database()  ,
	    Svg:       new Svg()       ,
	    Cell:      new Cell()       ,
	    Threshold: new Threshold() ,
	    Custom:    new Custom()    ,
	    Grid:      new Grid()      ,
	    Matrix:    new Matrix()    ,
	    Html:      new Html()      ,
	    Settings:  new Settings()     ,
	    Utils:     new Utils()     ,
	    React: { App : this },
	    cnt:0
	};

	//this.path=this.getpath();
    };
    getpath() {
	var path="/";
	if (process.env.NODE_ENV !== 'development' || true) {// get path from public url
            var raw=process.env.PUBLIC_URL;
            path=raw+path;
            var pos=raw.indexOf("//");
            if (pos>0) {
		pos=pos+3;
		pos=raw.indexOf("/",pos);
		path=path.substring(pos);
            };
	};
	console.log("Using path:"+path+":"+process.env.NODE_ENV+":"+process.env.PUBLIC_URL+":");
	return [path,("alarm/"+path)];
    };
    componentDidMount() {
	var state=this.state;
	state.Default.init(state);
	state.Astro.init(state);
        state.Settings.init(state);
	state.Default.loadUrl(state,"",
				  [state.Default.mergeState,
				   state.Default.checkState,
				   state.Default.storeHomeState,
				   state.Astro.updateLoop]
				 );
    };
    componentWillUnmount() {
    };
//    tick() {
//	// check if database has changed, reload if necessary...
//	if (this.state.React.Status !== undefined) {
//	    this.state.cnt=this.state.cnt+1;
//	    this.state.React.Status.forceUpdate();
//	}
//    };
    broadcast(msg,variant) {
        if (variant === undefined) {variant='info';};
	//console.log("BROADCAST *** ",msg,variant);
        this.props.enqueueSnackbar(msg, { variant });
    };
    render() {
        const { classes } = this.props;
	const state       = this.state;
	var hcls={header:classes.header};
	var dcls={dataset:classes.dataset,
		  content:classes.content,
		  block:classes.block,
		  button:classes.button,
		  buttonDisabled:classes.buttonDisabled};
	var fcls={footer:classes.footer};
        return (<div className={classes.root}>
                  <MuiThemeProvider theme={createTheme(teal_palette, black_palette)}>
                            <Header   state={state} classes={hcls}/>
                            <Dataset  state={state} classes={dcls} layout={layout}/>
                            <Footer   state={state} classes={fcls}/>
                        </MuiThemeProvider>
                </div>
        );
    }
}

App.propTypes = {
    enqueueSnackbar: PropTypes.func.isRequired,
};

//export default withStyles(styles)(App);

const MyApp = withStyles(styles)(withSnackbar( App));

function IntegrationNotistack() {
  return (
    <SnackbarProvider maxSnack={5} anchorOrigin={{vertical: 'bottom',horizontal: 'right',}}>
          <Popup/>
          <Notifications />
	  <MyApp />
    </SnackbarProvider>
  );
}

export default IntegrationNotistack;
