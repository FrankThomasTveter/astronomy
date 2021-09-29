import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
//import Button from '@material-ui/core/Button';

import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

const styles = theme => ({
    view:{},
    button:{},
    text: {
	maxWidth: "100%",
	margin: "1%",
    },
});
class Json extends Component {
    constructor() {
        super();
	this.click=this.click.bind(this);
    }; 
    // handle header click events
    click() {
	var buffer=JSON.parse(JSON.stringify(this.state.json)); 
	this.setState({json:buffer});
    };
    // draw table...
  render () {
      const { value,handleChange,...other} = this.props;
      this.handleChange=(json) => {handleChange(json);};
      return (<Editor
	      value={value}
	      onChange={this.handleChange}
	      {...other}
	      />);
    }
}

Json.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Json);
