import { START_APP, UPDATE_MESSAGE_LIST } from '../const/ClientActionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case START_APP:
    case UPDATE_MESSAGE_LIST:
      return { ...action.payload.messages };

    default:
      return state;
  }
}
