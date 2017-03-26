import callApi from '../../util/apiCaller';

// Export Constants
export const ADD_PROJECTS = 'ADD_PROJECTS';
export const TOGGLE_PROJECT = 'TOGGLE_PROJECT';
export const UPDATE_SUBMISSION = 'UPDATE_SUBMISSION';
export const UPDATE_POSITIONS = 'UPDATE_POSITIONS';
export const CLEAR_POSITIONS = 'CLEAR_POSITIONS';
export const SET_ERROR = 'SET_ERROR';

// Export Actions
export function addProjects(projects) {
  return {
    type: ADD_PROJECTS,
    projects,
  };
}

export function fetchProjects() {
  return (dispatch) => {
    return callApi('projects').then(res => {
      dispatch(addProjects(res.projects));
    });
  };
}

export function toggleProject(projectId) {
  return {
    type: TOGGLE_PROJECT,
    projectId,
  };
}

export function updateSubmission(submission) {
  return {
    type: UPDATE_SUBMISSION,
    submission,
  };
}

export function setError(message) {
  return {
    type: SET_ERROR,
    message,
  };
}

export function postSubmissions(projects) {
  return (dispatch) => {
    return callApi('projects', 'post', projects).then(res => {
      if (res.success) {
        dispatch(updateSubmission(res.submission));
      }
      else {
        dispatch(setError(res.message));
      }
    });
  };
}

export function cancelSubmission(submissionId) {
  return (dispatch) => {
    return callApi('projects/cancel/' + submissionId, 'get').then(res => {
      if (res.success) {
        dispatch(updateSubmission([]));
        dispatch(clearPositions());
      }
      else {
        dispatch(setError(res.message));
      }
    });
  };
}

export function notifyAssignedProject(projectId) {
  return (dispatch) => {
    return callApi('projects/notify/' + projectId, 'get').then(res => {
      if (res.success) {
      }
      else {
        dispatch(setError(res.message));
      }
    });
  };
}

export function fetchSubmission() {
  return (dispatch) => {
    return callApi('projects/submission').then(res => {
      dispatch(updateSubmission(res.submission));
    });
  };
}

export function updatePositions(submissionId, positions) {
  return {
    type: UPDATE_POSITIONS,
    submissionId,
    positions,
  };
}

export function clearPositions() {
  return {
    type: CLEAR_POSITIONS,
  };
}

export function fetchPositions(submissionId) {
  return (dispatch) => {
    return callApi('projects/positions/' + submissionId, 'get').then(res => {
      dispatch(updatePositions(res.submissionId, res.positions));
    });
  };
}

export function refreshSubmission(submissionId) {
  return (dispatch) => {
    return callApi('projects/refresh/' + submissionId, 'get').then(res => {
      if(res.success) {
        //dispatch(updateSubmission(res.submission));
        dispatch(fetchSubmission());
      }
    });
  };
}
