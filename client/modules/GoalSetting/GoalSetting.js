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
import styles from './GoalSetting.css';
import style from './new.css';
import globalStyles from './fh';

class GoalSetting extends Component {
	constructor(props) {
		super(props);
		this.state = {content: 'this is a simple tect'};
	}

	mountState() {
		this.setState({text: content});
	}

	render() {
		return (
			<div>
				<p style={globalStyles.title}>Application / GoalSetting</p>
				<h1>welcome to my House feel free</h1>

				<div className={style.paneldefault}>
		    	<div className={style.panelheading}>Employees Full Record</div>
		    	<div className={style.panelbody}>
		    	</div>
		    </div>
				
				<div>
			    <div className={styles.panelwithnavtabs.panelprimary}>
			      <div className={styles.panelheading}>
			        <ul className={styles.navtabs}>
			          <li><a href="#tab1primary" data-toggle="tab">Primary 1</a></li>
			          <li><a href="#tab2primary" data-toggle="tab">Primary 2</a></li>
			          <li><a href="#tab3primary" data-toggle="tab">Primary 3</a></li>
			        </ul>
			      </div>
			      <div className={styles.panelbody}>
			        <div className={styles.tabcontent}>
			          <div className={styles.tabpane} id="tab1primary">Primary 1</div>
			          <div className={styles.tabpane} id="tab2primary">Primary 2</div>
			          <div className={styles.tabpane} id="tab3primary">Primary 3</div>
			        </div>
			      </div>
			    </div>
			  </div>
			</div>
		);
	}
}


GoalSetting.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

// Retrieve data from store as props
function mapStateToProps(store) {
  return {
    intl: store.intl,
  };
}

export default connect(mapStateToProps)(GoalSetting);