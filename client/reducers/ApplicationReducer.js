import { START_APP } from '../const/ClientActionTypes';
import { CHANGE_LANGUAGE } from '../const/ClientActionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case START_APP:
      return { ...state, isAppReady: true };
    case CHANGE_LANGUAGE:
      return { ...state, language: action.payload.language };
    default:
      return state;
  }
}
