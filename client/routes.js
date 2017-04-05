import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import NotFoundPage from './containers/NotFoundPage.js';
import LoginPage from './containers/LoginPage';
import FormPage from './containers/FormPage';
import TablePage from './containers/TablePage';
import Dashboard from './containers/DashboardPage';
import requireAuth from './util/requireAuth';
import requireRole from './util/requireRole';
import UserTable from './modules/User/pages/UserTablePage/UserTablePage';
import AccountList from './modules/Account/pages/AccountListPage/AccountListPage';
import AccountDetailPage from './modules/Account/pages/AccountDetailPage/AccountDetailPage';
import Assigners from './modules/Assigner/Assigner';

export default (
  <Route>
    <Route path="login" component={LoginPage}/>
    <Route path="/" component={App}>
      <IndexRoute component={requireAuth(Dashboard)}/>
      <Route path="dashboard" component={requireAuth(Dashboard)}  />
      <Route path="users" component={requireAuth(requireRole(UserTable, 'Admin'))} />
      <Route path="accounts" component={requireAuth(requireRole(AccountList, 'Admin'))} />
      <Route path="accounts/:cuid" component={requireAuth(requireRole(AccountDetailPage, 'Admin'))} />
      <Route path="assigners" component={requireAuth(requireRole(Assigners, 'Admin'))}  />
      <Route path="*" component={NotFoundPage}/>
    </Route>
  </Route>
);
