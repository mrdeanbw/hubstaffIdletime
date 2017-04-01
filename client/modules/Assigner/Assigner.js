import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, CardHeader, CardActions, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';
import QueueList from './components/QueueList';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

// Import Style
import styles from './Assigner.css';

// Import Actions
import { fetchProjects, toggleProject, selectProject, postSubmissions, fetchSubmission, fetchPositions, fetchAssignmentCount, setError, cancelSubmission, notifyAssignedProject, refreshSubmission, updateSubmission, clearPositions } from './AssignerActions';

// Import Selectors
import { getProjects, getPositions, getSelectedProjects, getSubmission, getError, getAssignCount } from './AssignerReducer';

class Assigner extends Component {
  
  constructor(props) {
    super(props);
    this.state = {chipData: [
      {key: 0, label: 'Angular'},
      {key: 1, label: 'JQuery'},
      {key: 2, label: 'Polymer'},
      {key: 3, label: 'ReactJS'},
    ]};
    this.styles = {
      chip: {
        margin: 4,
      },
      selectedchip: {
        margin:4,
        backgroundColor:'#03A9F4',
      },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      startButton: {
        margin: 12
      }
    };
    this.pollingStarted = false;
    this.queuingStarted = false;
  }
  
  componentDidMount() {
    this.props.dispatch(fetchProjects());
    this.props.dispatch(fetchAssignmentCount());
    this.props.dispatch(fetchSubmission());
  }

  startCheckingAssignmentCount = () => {
    if (!this.pollingStarted) {
      return;
    }
    console.log('Fetching assign count');
    this.props.dispatch(fetchAssignmentCount());
    setTimeout(() => this.startCheckingAssignmentCount(), 120000);
  }

  startPollingPositions = (submissionId) => {
    if (!this.queuingStarted) {
      return;
    }
    console.log("Starting to poll!");
    console.log(submissionId);
    this.props.dispatch(fetchPositions(submissionId));
    setTimeout(() => this.startPollingPositions(submissionId), 120000);
  }

  startRefreshSubmission = (submission) => {
    console.log("Starting Refresh!");
    if (submission.status != 'fulfilled') {
      this.props.dispatch(refreshSubmission(submission.id));
    }
  }

  componentWillReceiveProps(nextProps) {

    if (!this.pollingStarted) {
      // noop
      return;
    }
    
    if (nextProps.assignCount < 2 && (!nextProps.currentSubmission || nextProps.currentSubmission.length == 0)) {
      
      // The assign count has gone below 2, and there are no submissions, start a new submisison.
      this.props.dispatch(postSubmissions(this.props.selectedProjects.map(value => {
        return {project_id: value.project_id, language: 'en-us'};
      })));
    }

    if (this.queuingStarted && nextProps.currentSubmission && nextProps.currentSubmission.length > 0) {
      // Check to see the refresh timeout has elapsed or not
      let endsAt = new Date(nextProps.currentSubmission[0].closed_at);
      let timeout = endsAt.getTime() - Date.now();
      
      if (timeout < 300000) {   // minus 5 minutes
        // Needs refresh
        nextProps.currentSubmission.map(value => {
          this.startRefreshSubmission(value);
        }, this);
      }
    }
    
    // Fetch positions if we have a current submission
    if (!this.queuingStarted && nextProps.currentSubmission && nextProps.currentSubmission.length > 0) {
      this.queuingStarted = true;
      
      // Select the projects whose submissions are already in progress.
      nextProps.currentSubmission[0].submission_request_projects.map(value => {
        this.props.dispatch(selectProject(value.project_id));
      }, this);

      // Start position polling
      nextProps.currentSubmission.map(value => {
        this.startPollingPositions(value.id);
      }, this);
    }
  }

  handleToggleProject = (projectId) => {
    // Disable project selection/deselection if we have a current submission already
    if (!this.props.currentSubmission || this.props.currentSubmission.length == 0) {
      this.props.dispatch(toggleProject(projectId));
    }
  }

  handlePostSubmissions = (selectedProjects) => {
    this.pollingStarted = true;
    // Start checking for assignment count
    this.startCheckingAssignmentCount();
    if (this.props.assignCount < 2) {
      // Start a submission only when assign count < 2
      this.props.dispatch(postSubmissions(selectedProjects.map(value => {
        return {project_id: value.project_id, language: 'en-us'};
      })));
    }
  }

  handleCancelSubmission = (submission) => {
    this.pollingStarted = false;
    this.queuingStarted = false;
    submission.map(value => {
      this.props.dispatch(cancelSubmission(value.id));
    }, this);
  }

  handleProjectAssigned = (projectId) => {
    // send email to user with the project projectId
    this.props.dispatch(notifyAssignedProject(projectId));
  }

  renderChip(data) {
    return (
      <Chip
        key={data.project_id}
        style={data.selected ? this.styles.selectedchip : this.styles.chip}
        labelColor={data.selected ? '#FFFFFF' : '#000000'}
        onTouchTap={() => this.handleToggleProject(data.project_id)}
      >
        {data.project_id}
      </Chip>
    );
  }

  handleClose = () => {
    this.props.dispatch(setError(""));
  };
  
  render() {
    const actions = [
      <FlatButton
        label="OK"
        primary={true}
        onTouchTap={this.handleClose}
      />,
    ];
    return (
      <div>
        <Card expanded={true}>
          <CardHeader
            title="Projects"
            subtitle="Select the projects to queue"
            actAsExpander={true}
            showExpandableButton={true}
          />
          
          <div style={this.styles.wrapper} >
            {this.props.projects.map(this.renderChip, this)}
          </div>

          <CardActions>
            <RaisedButton primary={true} label="Start"
                onClick={() => this.handlePostSubmissions(this.props.selectedProjects)}
                disabled={this.props.selectedProjects.length == 0 || this.props.currentSubmission.length > 0 || this.pollingStarted}  style={this.styles.startButton} />
            <RaisedButton primary={true} label="Cancel"
                onClick={() => this.handleCancelSubmission(this.props.currentSubmission)}
                disabled={!this.props.currentSubmission.length > 0}  style={this.styles.startButton} />
          </CardActions>
        </Card>
        <Toolbar>
          <ToolbarGroup firstChild={true}>
            <ToolbarTitle text={"Queuing Status: " + (this.pollingStarted ? "Started" : "Stopped")} />
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <ToolbarTitle text={"Next Refresh: " + (this.props.currentSubmission.length > 0 ? this.props.currentSubmission[0].closed_at : "No Submission Yet!")} />
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <ToolbarTitle text={"Assigned Count: " + this.props.assignCount} />
          </ToolbarGroup>
        </Toolbar>
        <QueueList queues={this.props.positions} handleProjectAssigned={this.handleProjectAssigned} />
        <Dialog
          title="API Error"
          actions={actions}
          modal={true}
          open={this.props.error && this.props.error.length > 0}
          onRequestClose={this.handleClose}
        >
        {this.props.error}
        </Dialog>
      </div>
    );
  }
}

Assigner.need = [() => { return fetchProjects(); }];

const mapStateToProps = (state) => {
  return {
    projects: getProjects(state),
    positions: getPositions(state),
    selectedProjects: getSelectedProjects(state),
    currentSubmission: getSubmission(state),
    assignCount: getAssignCount(state),
    error: getError(state)
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
   return { ...ownProps, ...stateProps, ...dispatchProps };
}

Assigner.propTypes = {
  projects: PropTypes.array,
  dispatch: PropTypes.func.isRequired,
  positions: PropTypes.array.isRequired,
  currentSubmission: PropTypes.array.isRequired,
  assignCount: PropTypes.number.isRequired,
  error: PropTypes.string,
  handleProjectAssigned: PropTypes.func.isRequired,
};

Assigner.contextTypes = {
  router: React.PropTypes.object,
};

export default connect(
  mapStateToProps,
)(Assigner);
