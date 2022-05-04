import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import ProfilePicture from '../static/UserProfilePicture.png';

let UserComponent = ({ activeUser, users }) => (
  <div className="user-list-wrapper">
    <h3>User list</h3>
    <ul className="user-list">
      {users.map(user => (
        <li
          key={user.id}
          className={classNames('user', {
            'user-me': user.id === activeUser.id
          })}
        >
          <div className="user-profile-picture">
            <img alt="ProfilePicture" src={ProfilePicture} />
          </div>
          <div className="username">
            {user.name}
          </div>
          <div
            className={classNames('user-typing', {
              pulsate: user.typing && user.id !== activeUser.id
            })}
          >
            {
              user.typing && user.id !== activeUser.id
              ? 'typing...'
              : 'online'
            }
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default connect(
  state => ({
    activeUser: state.activeUser,
    users: Object.keys(state.users).map(id => state.users[id])
  })
)(UserComponent);
