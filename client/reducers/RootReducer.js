import { combineReducers } from 'redux';

import application from './ApplicationReducer';
import activeUser from './ActiveUserReducer';
import users from './UserReducer';
import messages from './MessageReducer';

export default combineReducers({
  application,
  activeUser,
  users,
  messages
});
