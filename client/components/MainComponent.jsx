import React from 'react';
import { connect } from 'react-redux';

import UserComponent from '../components/UserComponent';
import MessageComponent from '../components/MessageComponent';
import MessageInputComponent from '../components/MessageInputComponent';

let MainComponent = ({ isAppReady }) => (
  isAppReady
    ? (
      <div className="main-wrapper">
        <aside className="sidebar">
          <UserComponent />
        </aside>
        <section className="main">
          <MessageComponent />
          <MessageInputComponent />
        </section>
      </div>
    )
    :
    <div className="loading-screen">
      Loading...
    </div>
);

export default connect(
  state => ({ isAppReady: state.application.isAppReady })
)(MainComponent);
