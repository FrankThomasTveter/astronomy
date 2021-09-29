import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

//import CanvasText  from './CanvasTextComponent';

const styles = theme => ({
    divTableCell:{
	border: '1px solid #EEE',
	display: 'table-cell',
	padding: '0px 0px',
    },
    divTableCellCursor:{
	cursor: "pointer",
	border: '1px solid #EEE',
	display: 'table-cell',
	padding: '0px 0px',
    },
    canvas: {
	width:"100%",
	height:"100%",
	overflow:"hidden",
    },
});

//	borderCollapse: 'collapse',

function EmptyCell(props) {
    const { classes,plan,key } = props; //state,
    return (
            <div className={classes.divTableCell} key={key} height={plan.height} width={plan.width}>
	    <canvas className={classes.canvas} height={plan.height} width={plan.width} />
	    </div>
           );
}

EmptyCell.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EmptyCell);
