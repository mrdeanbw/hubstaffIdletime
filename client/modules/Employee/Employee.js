import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, CardHeader, CardActions, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


// Import Style
import styles from './Employee.css';
/*import globalStyles from '.../styles';*/

/*Require the json file*/
var jsondata = require("./file.json")

class Employee extends React.Component {
	constructor(props) {
  	super(props);
  	this.state = {items: jsondata};
	}

	render() {
		const items = this.state.items.map(item => {
			//console.log(item.actual);
			return (
				<tr>
					<td className={styles.t}>{item.properties}</td>
					<td>{item.actual}</td>
					<td>{item.goal}</td>
					<td>{item.goals}%</td>	
				</tr>				
			)
		})

    return (
	    <div>
	      <p className={styles.header}>Application / Employee</p>
	      <div className={styles.paneldefault}>
		    	<div className={styles.panelheading}>Employees Full Record</div>
		    	<div className={styles.panelbody}>
		    		<table className={styles.packagetable}>
							<thead>
								<tr>
									<th>PROPERTIES</th>
									<th>ACTUAL</th>
									<th>GOAL</th>
									<th>% GOAL</th>
								</tr>
							</thead>
							<tbody>
								{items}	
								<hr />
								<tr>				
									<td className={styles.t}>Cash Earned :</td>	
									<td>97k</td>
									<td>456</td>
									<td>140%</td>
								</tr>					
							</tbody>
						</table>
		    	</div>
		  	</div>
		  	<div className={styles.center}>
		    	<button className={styles.btn} onClick={() => alert('click')}>
		        Update
		      </button>
	      </div>
	    </div>
    );
	}
}

Employee.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

// Retrieve data from store as props
function mapStateToProps(store) {
  return {
    intl: store.intl,
  };
}

export default connect(mapStateToProps)(Employee);