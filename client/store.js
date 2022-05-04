import { createStore, applyMiddleware } from 'redux'

import messageEnricherMiddleware from './middlewares/MessageMiddleware'
import socketMiddleware from './middlewares/SocketMiddleware'

import RootReducer from './reducers/RootReducer'

export default createStore(
  RootReducer,
  {},
  applyMiddleware(messageEnricherMiddleware, socketMiddleware)
)
