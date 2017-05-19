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

// Import Style
import styles from './Employee.css';

/*Require the json file*/
var jsondata = require("./file.json")

//Time global constants
const stopped_time1 = new Date();
const stopped_time = dateFormat(stopped_time1, "isoDateTime");
const started_time = new Date().setDate(stopped_time1.getDate()-2);
const started_time1 = dateFormat(started_time, "isoDateTime");
console.log(started_time1);


//Default header definitions for axioss
//axios.defaults.baseURL = "https://api.hubstaff.com/v1/activities?start_time="+started_time1+"&stop_time="+stopped_time+"&organizations=36671";
axios.defaults.headers.common['Auth-Token'] = "sfrRjPy7IgIL4C9V2hdUBwKkyxFuJf9h6pVexVlsLL8";
axios.defaults.headers.common['App-Token'] = "ljMevSy_f4-1TcJAcMNYtw95XX4CsLiASYQFVW51ZpU";


class Idle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }; 
  }

  componentDidMount(){
    axios 
    .get("https://api.hubstaff.com/v1/activities?start_time="+started_time1+"&stop_time="+stopped_time+"&organizations=36671")
    .then((res) => {    
      this.setState({
        data: res.data.activities
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  writeDb(id) {
    axios
      .delete("https://api.hubstaff.com/v1/activities?start_time="+started_time1+"&stop_time="+stopped_time+"&organizations=36671", 
      {
        params: { id: id }
      })
      .catch(function (error) {
        console.log(error);
      });

    console.log(id)
  }

  /*deleteHandler(e,id){
    console.log(e)
    //find index of element
    var index = this.state.data.findIndex(e=>e.id==id);
    //copy array
    var newAray = this.state.data.slice();
    //delete element by index
    newAray.splice(index, 1);
    this.setState({data: newAray});
  }*/

  render() {
    var listDataDOM = this.state.data.map((item,index) => {
      if (item.overall == 0) {
        /*if (item.firstName == "judges") {*/
          this.writeDb(item.id);
        return (
          <li key={item.id}>
          {index}
            <button onClick={e=>this.deleteHandler(e,item.id)}>delete {item.id}</button>{item.user_id}==={item.time_slot}
          
          </li>
        )
      }
    });

    return(
      <div>
        <p>Application / Idle</p>
          <ul>
            {listDataDOM}
          </ul>
      </div>
    )
  }
}


Idle.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

// Retrieve data from store as props
function mapStateToProps(store) {
  return {
    intl: store.intl,
  };
}

export default connect(mapStateToProps)(Idle);
