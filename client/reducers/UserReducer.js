import { START_APP, UPDATE_USER_LIST } from '../const/ClientActionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case START_APP:
    case UPDATE_USER_LIST:
      return { ...action.payload.users };

    default:
      return state;
  }
}
