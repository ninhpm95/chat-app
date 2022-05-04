import { START_APP } from '../const/ClientActionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case START_APP:
      return { ...state, ...action.payload.activeUser };

    default:
      return state;
  }
}
