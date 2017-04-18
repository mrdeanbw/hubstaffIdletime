import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import Checkbox from 'material-ui/Checkbox';
import find from 'lodash/find';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';


// Import Style
import styles from '../../components/AccountListItem/AccountListItem.css';

// Import Actions
import { fetchAccount, associateUsersRequest,setSuccessMessage } from '../../AccountActions';
import { fetchUsers } from '../../../User/UserActions';

// Import Selectors
import { getAccount,getSuccessMessage } from '../../AccountReducer';
import { getUsers } from '../../../User/UserReducer';

class AccountDetailPage extends Component {
  componentDidMount() {
    this.props.dispatch(fetchUsers());
  }
 handleClose = () => {
    this.props.dispatch(setSuccessMessage(""));
  };
  render() {
       const actions = [
      <FlatButton
        label="OK"
        primary={true}
        onTouchTap={this.handleClose}
      />,
    ];
    var accounts = this.props.account.users;
    return (
      <div>
        <Helmet title={this.props.account.email} />
        <div className={`${styles['single-account']} ${styles['account-detail']}`}>
          <h3 className={styles['account-title']}>{this.props.account.email}</h3>
          <input placeholder='Password' className={styles['form-field']} type="password" defaultValue={this.props.account.password} ref="password" />
          <input placeholder='Number of threads' className={styles['form-field']}  type='number' defaultValue={this.props.account.threads}  ref="threads" />
          <p>Associate users with this account.</p><br />
          {this.props.users.map((user, i) => {
            var userID=user._id
            return (
              <Checkbox
              key={i}
              label={user.name}
              style={styles.checkbox}
              defaultChecked={((accounts.indexOf(userID) != -1) ? true : false )}
              ref={user._id}
            />);
          })}<br />
          <a className={styles['account-submit-button']} href="#" onClick={this.associateUsers}><FormattedMessage id="submit" /></a>
        </div>
         <Dialog
          title="Success Message"
          actions={actions}
          modal={true}
          open={this.props.success && this.props.success.length > 0}
          onRequestClose={this.handleClose}
        >
          {this.props.success}
        </Dialog>
      </div>
    );
  }

  associateUsers = () => {
    const refs = this.refs;
    const usersRef = this.props.users.filter((user) => {
      if (refs[user._id].isChecked()) {
        return user._id;
      }
    });
    const passwordRefs = this.refs.password.value
    const threadsRefs = this.refs.threads.value
    if (usersRef) {
      this.props.dispatch(associateUsersRequest({ users: usersRef || [], password: passwordRefs, threads:threadsRefs, cuid: this.props.account.cuid }));
    }
  }
}

// Actions required to provide data for this component to render in sever side.
AccountDetailPage.need = [params => {
  return fetchAccount(params.cuid);
},
() => { return fetchUsers(); }
];

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    account: getAccount(state, props.params.cuid),
    users: getUsers(state),
    success: getSuccessMessage(state),
  };
}

AccountDetailPage.propTypes = {
  account: PropTypes.shape({
    email: PropTypes.string.isRequired,
    cuid: PropTypes.string.isRequired,
    threads: PropTypes.number.isRequired,
  }).isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  })).isRequired,
   success: PropTypes.string,
};

export default connect(mapStateToProps)(AccountDetailPage);
