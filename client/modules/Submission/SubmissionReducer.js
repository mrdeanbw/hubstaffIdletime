import { CHECK_STATUS } from './SubmissionActions';
import axios from 'axios';
import dateFormat = 'dateformat';

//Default header definitions for axioss
axios.defaults.baseURL = "https://api.hubstaff.com/v1/organizations/36671/projects";
axios.defaults.headers.common['Auth-Token'] = "dbIWZbinwFJmhZAJsuBtj2-miaNlhEfUrPnRvU-5Tgc";
axios.defaults.headers.common['App-Token'] = "ljMevSy_f4-1TcJAcMNYtw95XX4CsLiASYQFVW51ZpU";

// Initial State
const initialState = { data: []};

const SubmissionReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHECK_STATUS :
      return {
				axios
				  .get()
				  .then(function(res) {    
				    if (!res) {
				    	console.log("No response")
				    }
				    var result = res.data;
				    console.log(result)
        	}
      };

    default:
			return state;
  }
}

export const getSubmission = state => state.submissions.submission;


export default SubmissionReducer;