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
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

//import Table from 'react-bootstrap';
import axios from 'axios';
import dateFormat from 'dateformat';
import $ from 'jquery';

/*Require the json file*/
var jsondata = require("./file.json")

//Time global constants
const stopped_time1 = new Date();
const stopped_time = dateFormat(stopped_time1, "isoDateTime");
const started_time = new Date().setDate(stopped_time1.getDate()-7);
const started_time1 = dateFormat(started_time, "isoDateTime");

//Default header definitions for axioss
//axios.defaults.baseURL = "https://api.hubstaff.com/v1/activities?start_time="+started_time1+"&stop_time="+stopped_time+"&organizations=36671";
axios.defaults.headers.common['Auth-Token'] = "sfrRjPy7IgIL4C9V2hdUBwKkyxFuJf9h6pVexVlsLL8";
axios.defaults.headers.common['App-Token'] = "ljMevSy_f4-1TcJAcMNYtw95XX4CsLiASYQFVW51ZpU";
const requestUrl_userlist = "https://api.hubstaff.com/v1/users";
const requestUrl_projectlist = "https://api.hubstaff.com/v1/projects";
const requestUrl_getActivity = "https://api.hubstaff.com/v1/activities?start_time="+started_time1+"&stop_time="+stopped_time+"&organizations=36671";
var offset = 0;

const styles = {
  btn: {
    marginLeft: 20,
    marginRight : 20,
    width: 230,
    background: '#e87c7a'
  },
  listItem: {
    marginTop: '5px',
    padding: '0px'
  }
};
class Idle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      userList : [],
      projectList : [],
      prevRequestUrl  : '',
    }; 
    this.deleteIdleActivity = this.deleteIdleActivity.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.deleteAllIdleActivity = this.deleteAllIdleActivity.bind(this);
    this.getActivity = this.getActivity.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.getProjects = this.getProjects.bind(this);
  }

  componentDidMount(){
    console.log("started_time1", started_time1);
    this.getActivity();  
    this.getProjects();
    this.getUsers();
  }
  getUsers(){
    axios 
    .get(requestUrl_userlist)
    .then((res) => {
      this.setState({
        userList: res.data.users
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  getProjects(){
    axios 
    .get(requestUrl_projectlist)
    .then((res) => {
      this.setState({
        projectList: res.data.projects
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  getActivity(){
    var request_url = requestUrl_getActivity; 
    if (this.state.prevRequestUrl == request_url) {
      offset = offset + 500;
      console.log(offset) ;
    }
    else{
      offset = 0;
      console.log(offset) ;
    }
    this.setState({prevRequestUrl : request_url});
    var request_url_offset = requestUrl_getActivity + "&offset=" + offset;
    console.log(request_url_offset);

    axios 
    .get(request_url_offset)
    .then((res) => {
      this.setState({
        data: res.data.activities
      })
      var count_idletime = 0;
      for (let i=0;i<res.data.activities.length;i++){
        if (res.data.activities[i].overall == 0){
          count_idletime ++;
        }
      }
      if (count_idletime == 0) this.getActivity();
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  deleteIdleActivity(user_id, project_id, time_slot){    
    var request_url = "https://app.hubstaff.com/activities/delete_activity?project_id=" + project_id + "&time_slot=" + time_slot + "&user_id=" + user_id;
    
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": request_url,
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cookie": "ajs_anonymous_id=%22a35b20bd-4652-4d83-ab7b-305625ccc5a1%22; hubstaff_account_refresh=1496048676680; _cb_ls=1; intercom-id-syfi9ssb=b53b358c-5880-4dcc-8e11-0803f5339d15; organization=36671; _hubstaff_session=WlpweEROejFudnR5VmdJVnY4QUVOVVRoK2ZQTlVDRXNabW1ObzNEY0c3K0x2elFCWStpY0t3bnZyek5KTmhZUktXVHNRVnhMRG80MlhCa21Jak1mUDZQRkpXQldpLzFMSFZVVkxEcFJKc20vWldzT2xlRy8yTldlcGJ3SHpMbVRNcXpncUpmeE5URWtRYVVhcWsrRUtJVVVTQVVHaFVXOVpZWHFHS2FLSitBT25oVDhHNE0wak0zeFpyeVFCYllQVDhuWm12c2ErcTRZVWd4R0lYOVRiZXNWUUdOQy93YVlWYkh5T0p1M2dYMHhsbG1udjFlM25ZQlRlaStxd3V0aHZ2WHFSQkpJVmZsZHkyUjE5VGdJem01WmJRclFENFpDUHg0TTBiM3U2dTQvaHdlSGF5enNtbENwWk1yR01ZaHVUYUo1c2Z2YXErRW1FT1poY2M3OTlBPT0tLXN2V3BZY3h2SVE5Yy9xVWtaOHdLclE9PQ%3D%3D--c6c986d55c898ee0015b6f3bbc6ebfa05cbb8d19; ajs_group_id=null; _vwo_uuid_v2=7814242860E11EB7A52A0DBBC48BBFD9|3d83097313da3fc61f19c0f1345dcb13; _ga=GA1.3.1899957993.1495962275; wooTracker=7JWeSXpXINMF; ajs_user_id=%2285795%22; _drip_client_1031458=vid%253Da0bb4ad025ba0135866f0a5ccd80fe08%2526pageViews%253D17%2526sessionPageCount%253D16%2526lastVisitedAt%253D1495619930381%2526weeklySessionCount%253D2%2526lastSessionAt%253D1495962275525; _cb=B2Ol0GBjDb57D3PVb1; _chartbeat2=.1495962290689.1495619932968.10001.Dn2WQCfIO_4Cb7HZBDTuFOmDNIkOv; intercom-session-syfi9ssb=a2lobS9yaWEyTmh0L0pJalhCM0VmTSs1TzBpMmVJbUZjc3d6MlAwaVpnQjFFQTl1MkpINHFpQUFoaENhY1VLci0tUS81MVBHMDMwNzNNMWZiNncyNmRNQT09--a4eedae5cfa703bca644b7a65d8892bf012c301f",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        //"accept-encoding": "gzip, deflate, br",
        //"accept-language": "en-US,en;q=0.8",
      },
      "xhrFields" : { withCredentials: true },
      "data": {
        "_method": "delete",
        "authenticity_token": "dm+3eIonciA3mf/tznT/FsTzFyJyPoU5w2XyxRxe2N9nf7+9om3kwgZGlW+QKOZBm3M4UFE8oXnszv5yr0xtEg=="
      }
    }

    $.ajax(settings).done(function (response) {
      
    });
}
  deleteAllIdleActivity(){
    this.state.data.map((item,index) => {
      if (item.overall == 0) {
        this.deleteIdleActivity(item.user_id, item.project_id, item.time_slot); 
      }
    });
    //this.setState({data : {}});
    this.getActivity();
  }
  
  deleteHandler(e, id){
    //find index of element
    var index = this.state.data.findIndex(e=>e.id==id);
    //copy Array
    var newAray = this.state.data.slice();
    var itemToDelete = newAray[index];
    var user_id = itemToDelete.user_id;
    var project_id = itemToDelete.project_id;
    var time_slot = itemToDelete.time_slot;
    //delete element by index
    newAray.splice(index, 1);
    this.setState({ data : newAray });
    this.deleteIdleActivity(user_id, project_id, time_slot);
  }

  render() {
    var deleteItemList = (this.state.data) ?
    this.state.data.map((item, index) => {
      if (item.overall == 0){
        let selectedUser = this.state.userList.find(x => x.id === item.user_id);
        let selectedProject = this.state.projectList.find(x => x.id === item.project_id);

        return (    
          <TableRow key={index}>
            <TableRowColumn>{index}</TableRowColumn>
            <TableRowColumn>{item.user_id}</TableRowColumn>
            <TableRowColumn>{selectedUser.name}</TableRowColumn>
            <TableRowColumn>{item.project_id}</TableRowColumn>
            <TableRowColumn>{selectedProject.name}</TableRowColumn>
            <TableRowColumn>{item.time_slot}</TableRowColumn>
            <TableRowColumn><RaisedButton label="Delete" secondary={true} onClick={e=>this.deleteHandler(e,item.id)}></RaisedButton></TableRowColumn>
          </TableRow>
        )
      }
    }):
    null

    return(
      <div>
        <p>Application / Idle</p>
        <RaisedButton label="Delete All Idle times" secondary={true} style={{backgroundColor : '#ff4081', marginLeft : '75%'  }} onClick={()=> this.deleteAllIdleActivity()} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>ID</TableHeaderColumn>
              <TableHeaderColumn>User ID</TableHeaderColumn>
              <TableHeaderColumn>User Name</TableHeaderColumn>
              <TableHeaderColumn>Project ID</TableHeaderColumn>
              <TableHeaderColumn>Project Name</TableHeaderColumn>
              <TableHeaderColumn>Time Slot</TableHeaderColumn>
              <TableHeaderColumn>Delete</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deleteItemList}            
          </TableBody>
        </Table>
      </div>
    )
  }
}

Idle.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  data: React.PropTypes.array.isRequired
};

// Retrieve data from store as props
function mapStateToProps(store) {
  return {
    intl: store.intl,
  };
}

export default connect(mapStateToProps)(Idle);
