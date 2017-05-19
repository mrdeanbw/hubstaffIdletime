// Export Constants
export const CHECK_STATUS = 'CHECK_STATUS';

// Export Actions
export function checkStatus() {
  return {
    type: CHECK_STATUS
  };
}

export function fetchSubmission(cuid) {
  return (dispatch) => {
    return callApi(`projects/submission/${cuid}`).then(res => {
      dispatch(updateSubmission(res.submission));
    });
  };
}