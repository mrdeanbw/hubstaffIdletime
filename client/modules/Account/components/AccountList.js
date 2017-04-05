import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import { typography } from 'material-ui/styles';
import { white, cyan600 } from 'material-ui/styles/colors'
import ActionDelete from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';
import EditButton from  'material-ui/svg-icons/editor/mode-edit';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';;

const styles = {
  subheader: {
    fontSize: 24,
    fontWeight: typography.fontWeightLight,
    backgroundColor: cyan600,
    color: white,
  },
  headerProps: {
    enableSelectAll: false,
    displaySelectAll: false,
    adjustForCheckbox: false,
  },
  checkbox: {
    fontSize: 11,
  },
};


const AccountList = (props) => {
  return (
    <Paper>
      <Subheader style={styles.subheader} >Accounts</Subheader>
      <Table>
        <TableHeader {...styles.headerProps}>
          <TableRow>
            <TableHeaderColumn>Email</TableHeaderColumn>
            <TableHeaderColumn>Actions</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
        >
          {props.accounts.map((account, index) => {
            return (
              <TableRow
                key={index}
              >
                <TableRowColumn>{account.email}</TableRowColumn>
                <TableRowColumn>
                  <IconButton className={styles['post-action']} onClick={() => props.handleDeleteAccount(account.cuid)}><ActionDelete /></IconButton>
                  <IconButton className={styles['post-action']} containerElement={<Link to={`/accounts/${account.cuid}`} >
                    {account.email}
                  </Link>}><EditButton /></IconButton>
                </TableRowColumn>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

AccountList.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.shape({
    email: PropTypes.string.isRequired,
    cuid: PropTypes.string.isRequired,
  })).isRequired,
  handleDeleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(AccountList);