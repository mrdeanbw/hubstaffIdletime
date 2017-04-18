import { ADD_ACCOUNT, ADD_ACCOUNTS, DELETE_ACCOUNT,SET_MESSAGE } from './AccountActions';

// Initial State
const initialState = { data: [] };

const AccountReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ACCOUNT :
      return {
        data: [action.account, ...state.data],
      };

    case ADD_ACCOUNTS :
      return {
        data: action.accounts,
      };
     case SET_MESSAGE :
       return {
        ...state,
        error: action.message,
      };
    case DELETE_ACCOUNT :
      return {
        data: state.data.filter(account => account.cuid !== action.cuid),
      };

    default:
      return state;
  }
};

/* Selectors */

// Get all accounts
export const getAccounts = state => state.accounts.data;
export const getSuccessMessage = (state,cuid) => state.accounts.error;

// Get account by cuid
export const getAccount = (state, cuid) => state.accounts.data.filter(account => account.cuid === cuid)[0];

// Export Reducer
export default AccountReducer;
