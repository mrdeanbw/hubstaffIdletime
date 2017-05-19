import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, CardHeader, CardActions, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import { fetchAccounts, toggleAccount, pollingAccountsRequest } from './../Account/AccountActions';
import { getAccounts } from '../../modules/Account/AccountReducer';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import axios from 'axios';
import dateFormat from 'dateformat';

// Import Actions
import { fetchProjects, toggleProject, selectProject, postSubmissions, fetchSubmission, fetchPositions, fetchAssignmentCount, setError, cancelSubmission, notifyAssignedProject, refreshSubmission, updateSubmission, clearPositions } from '../Assigner/AssignerActions';

// Import Selectors
import { getProjects, getPositions, getSelectedProjects, getSubmission, getError, getAssignCount } from '../Assigner/AssignerReducer';

// Import Style
import styles from './Employee.css';

//Default header definitions for axioss
//axios.defaults.baseURL = "https://api.hubstaff.com/v1/organizations/36671/members";
axios.defaults.headers.common['Auth-Token'] = "sfrRjPy7IgIL4C9V2hdUBwKkyxFuJf9h6pVexVlsLL8";
axios.defaults.headers.common['App-Token'] = "ljMevSy_f4-1TcJAcMNYtw95XX4CsLiASYQFVW51ZpU";

//Time global constants
const currentdate = new Date();
const d2 = new Date ( currentdate );


class Submission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }; 
    this.pollingStarted = false;
  }

  componentDidMount(){
    axios 
    .get("https://api.hubstaff.com/v1/organizations/36671/members")
    .then((res) => {    
      if (!res) {
        console.log("No response")
      }
      this.setState({
        data: res.data.users
      })
    })
    /*setTimeout(() => this.componentDidMount(), 10000);*/
    console.log("=================")
  }

  /*componentWillUnmount() {
    this.state.data = [];
    setTimeout(() => this.componentWillUnmount(), 5000);
  }
*/


  render() {
    const results = this.state.data.map(result => {
      var last_acivity_time = dateFormat(result.last_activity, "h:MM:ss");   
      var last_acivity_day = dateFormat(result.last_activity, "dd");  
      var current_t = dateFormat(currentdate, "h:MM:ss");
      var current_day = dateFormat(currentdate, "dd");

      /*const count = this.startCheckingAssignmentCount();*/
      

      d2.setMinutes ( currentdate.getMinutes() - 12 );
      var current_t_minus_12 = dateFormat(d2, "h:MM:ss");

      if (last_acivity_day == current_day) {
        if (last_acivity_time <= current_t && last_acivity_time >= current_t_minus_12) {
          return <tr key={result.id}><td>{result.name} is <strong>ONLINE________________________ {result.id}</strong></td></tr>
        }
        else {
          return <tr key={result.id}><td>{result.name} is <strong>OFFLINE {result.id}</strong></td></tr> 
        }
      }
      else {
        return <tr key={result.id}><td>{result.name} is <strong>OFFLINE {result.id}</strong></td></tr> 
      }
    })

    return(
      <div>
        <p className={styles.header}>Application / Submission</p>
        <div className={styles.paneldefault}>
          <div className={styles.panelheading}>Employees Status Record</div>
          <div className={styles.panelbody}>
            <table className={styles.packagetable}>
              <tbody>
                {results} 
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}


Submission.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

// Retrieve data from store as props
function mapStateToProps(store) {
  return {
    intl: store.intl,
  };
}

export default connect(mapStateToProps)(Submission);
