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
import Employees from './modules/Employee/Employee';
import GoalSettings from './modules/GoalSetting/GoalSetting';
import Submission from './modules/Submission/Submission';
import Idle from './modules/Submission/Idle';

export default (
  <Route>
    <Route path="login" component={LoginPage}/>
    <Route path="/" component={App}>
      <IndexRoute component={requireAuth(Dashboard)}/>
      <Route path="dashboard" component={requireAuth(Dashboard)}  />
      <Route path="users" component={requireAuth(requireRole(UserTable, 'Admin'))} />
      <Route path="accounts" component={requireAuth(requireRole(AccountList, 'Admin'))} />
      <Route path="accounts/:cuid" component={requireAuth(requireRole(AccountDetailPage, 'Admin'))} />
      <Route path="assigners" component={requireAuth(Assigners)}  />
      <Route path="employees" component={requireAuth(Employees)}  />
      <Route path="goal_settings" component={requireAuth(GoalSettings)}  />
      <Route path="submissions" component={requireAuth(Submission)}  />
      <Route path="idle" component={requireAuth(Idle)}  />
      <Route path="*" component={NotFoundPage}/>
    </Route>
  </Route>
);
