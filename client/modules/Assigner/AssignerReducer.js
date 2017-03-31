// Import Actions
import { ADD_PROJECTS, TOGGLE_PROJECT, SELECT_PROJECT, UPDATE_SUBMISSION, UPDATE_POSITIONS, SET_ERROR, CLEAR_POSITIONS, UPDATE_ASSIGNCOUNT } from './AssignerActions';
import findIndex from 'lodash/findIndex';
import find from 'lodash/find';

// Initial State
const initialState = { data: [], submission: [], positions:[], error: "", assignCount: 0 };

const AssignerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PROJECTS :
      return {
        ...state,
        data: action.projects.reduce((result, item) => {
          item.selected = false;
          if (item.status === 'certified') {
            result.push(item);
          }
          return result;
        }, []),
      };
    case TOGGLE_PROJECT :
      return {
        ...state,
        data: state.data.map(project => {
          if (project.project_id == action.projectId) {
            return Object.assign({}, project, {
              selected: !project.selected
            })
          }
          return project;
        })
      };
    case SELECT_PROJECT :
      return {
        ...state,
        data: state.data.map(project => {
          if (project.project_id == action.projectId) {
            return Object.assign({}, project, {
              selected: true
            })
          }
          return project;
        })
      };
    case UPDATE_SUBMISSION :
      return {
        ...state,
        submission: action.submission,
      };
    case SET_ERROR :
      return {
        ...state,
        error: action.message,
      };
    case UPDATE_POSITIONS :
      return {
        ...state,
        positions: action.positions.reduce(function (allPositions, position) { 
            let foundPositionIndex = findIndex(allPositions, e => { return e.project_id == position.project_id; });
            if (foundPositionIndex != -1) {
              //console.log('Found position' + action.submissionId);
              let index = findIndex(allPositions[foundPositionIndex].position, ['id', action.submissionId]);
              //console.log('index found : ' + index)
              if (index == -1) {
                allPositions[foundPositionIndex].position.push({id: action.submissionId, position: position.position});
              }
              else {
                allPositions[foundPositionIndex].position[index] = {id: action.submissionId, position: position.position};
              }
            }
            else {
              //console.log('Not Found' + action.submissionId);
              allPositions = [...allPositions, {
                project_id: position.project_id,
                language: position.language,
                position: [{ id: action.submissionId, position: position.position}]
              }]
            }
            return allPositions;
          }, [...state.positions])
      };
    case CLEAR_POSITIONS :
      return {
        ...state,
        positions: []
      };
    case UPDATE_ASSIGNCOUNT :
     return {
       ...state,
       assignCount: action.assignCount
     };
    default:
      return state;
  }
};

/* Selectors */

// Get all users
export const getProjects = state => state.assigners.data;
export const getPositions = state => state.assigners.positions;
export const getSelectedProjects = state => state.assigners.data.filter(project => project.selected == true);
export const getSubmission = state => state.assigners.submission;
export const getError = state => state.assigners.error;
export const getAssignCount = state => state.assigners.assignCount;

export default AssignerReducer;
