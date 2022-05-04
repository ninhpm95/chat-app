import { SEND_MESSAGE, SET_STATUS_TO_TYPING } from '../const/ClientActionTypes';

let addEmoji = text => (
  text
    .replace(/\:\)/, '\u{1F642}')
    .replace(/\:D/, '\u{1F601}')
    .replace(/\:P/, '\u{1F60B}')
    .replace(/\;\)/, '\u{1F609}')
    .replace(/\:\(/, '\u{1F622}')
);

export default store => next => action => {
  if (action.type === SEND_MESSAGE) {
    return next({
      ...action,
      payload: {
        ...action.payload,
        userId: store.getState().activeUser.id,
        text: addEmoji(action.payload.text),        
        time: new Date(),
      },
    });
  }

  if (action.type === SET_STATUS_TO_TYPING) {
    return next({
      ...action,
      payload: {
        ...action.payload,
        userId: store.getState().activeUser.id,
      },
    });
  }

  return next(action);
}
