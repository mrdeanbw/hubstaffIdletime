import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

// Import Components
import AccountList from '../../components/AccountList';
import AccountCreateWidget from '../../components/AccountCreateWidget/AccountCreateWidget';

// Import Actions
import { addAccountRequest, fetchAccounts, deleteAccountRequest } from '../../AccountActions';
import { toggleAddAccount } from '../../../App/AppActions';

// Import Selectors
import { getAccounts } from '../../AccountReducer';

class AccountListPage extends Component {
  componentDidMount() {
    this.props.dispatch(fetchAccounts());
  }

  handleDeleteAccount = account => {
    if (confirm('Do you want to delete this account')) { // eslint-disable-line
      this.props.dispatch(deleteAccountRequest(account));
    }
  };

  handleAddAccount = (email, password,threads) => {
    this.props.dispatch(addAccountRequest({ email, password,threads}));
  };

  render() {
    return (
      <div>
        <AccountCreateWidget addAccount={this.handleAddAccount} />
        <AccountList handleDeleteAccount={this.handleDeleteAccount} accounts={this.props.accounts} />
      </div>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
AccountListPage.need = [() => { return fetchAccounts(); }];

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    accounts: getAccounts(state),
  };
}

AccountListPage.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.shape({
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  })).isRequired,
  dispatch: PropTypes.func.isRequired,
};

AccountListPage.contextTypes = {
  router: React.PropTypes.object,
};

export default connect(mapStateToProps)(AccountListPage);
