import React from 'react';
import { Provider } from 'react-redux';

import "./i18n"; // Internationalization
import MainComponent from './components/MainComponent';

const Application = ({ store }) => (
  <Provider store={store}>
    <MainComponent />
  </Provider>
)

export default Application;
