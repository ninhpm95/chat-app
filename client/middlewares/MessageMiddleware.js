import { SEND_MESSAGE, SET_STATUS_TO_TYPING } from '../const/ClientActionTypes';

// Convert special characters to emoji: :), :D, :P, ;), :(
let addEmoji = text => (
  text
    .replace(/\:\)/g, '\u{1F642}')
    .replace(/\:D/g, '\u{1F601}')
    .replace(/\:P/g, '\u{1F60B}')
    .replace(/\;\)/g, '\u{1F609}')
    .replace(/\:\(/g, '\u{1F622}')
);

export default store => next => action => {
  // Intercept and change message: add userId, change special characters to emoji, add time
  if (action.type === SEND_MESSAGE) {
    return next({
      ...action,
      payload: {
        ...action.payload,
        userId: store.getState().activeUser.id,
        text: addEmoji(action.payload.text),
        time: new Date().toLocaleString(),
      },
    });
  }

  // Intercept when sending user's typing status to server, add userId
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
