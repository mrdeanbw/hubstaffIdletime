/**
 * Root Reducer
 */
import { combineReducers } from 'redux';

// Import Reducers
import app from './modules/App/AppReducer';
import posts from './modules/Post/PostReducer';
import intl from './modules/Intl/IntlReducer';
import auth from './modules/Auth/AuthReducer';
import users from './modules/User/UserReducer';
import roles from './modules/Role/RoleReducer';
import accounts from './modules/Account/AccountReducer';
import assigners from './modules/Assigner/AssignerReducer';

// Export Constants
export const CLEAR_STATE = 'CLEAR_STATE';

const rootReducer = combineReducers({
  app,
  posts,
  users,
  intl,
  auth,
  roles,
  accounts,
  assigners
});

// Combine all reducers into one root reducer
export default (state, action) => {
  if (action.type === 'CLEAR_STATE') {
    state = undefined;
  }

  return rootReducer(state, action);
};
