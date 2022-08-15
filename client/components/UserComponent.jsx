import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

// User's profile picture
import ProfilePicture from '../static/UserProfilePicture.png';

import i18n from "../i18n"; // Internationalization
import { CHANGE_LANGUAGE } from '../const/ClientActionTypes';

let UserComponent = ({ activeUser, users, changeLanguage }) => (
  <div className="user-list-wrapper">
    <div>
      <h3>{i18n.t("user.list")}</h3>
    </div>
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
              pulsate: user.typing
            })}
          >
            {
              user.typing
              ? i18n.t("user.typing")
              : i18n.t("user.online")
            }
          </div>
        </li>
      ))}
    </ul>
    <div className="dropdown">
      <button class="dropbtn">{i18n.t("app.language")}</button>
      <div class="dropdown-content">
        <a onClick={() => {
          i18n.changeLanguage('en');
          changeLanguage('en');
        }}>{i18n.t("common.en")}</a>
        <a onClick={() => {
          i18n.changeLanguage('jp');
          changeLanguage('jp');
        }}>{i18n.t("common.jp")}</a>
        <a onClick={() => {
          i18n.changeLanguage('vn');
          changeLanguage('vn');
        }}>{i18n.t("common.vn")}</a>
      </div>
    </div>
  </div>
);

export default connect(
  state => ({
    language: state.application.language, // language of the app
    activeUser: state.activeUser,
    users: state.users
  }), dispatch => ({
    changeLanguage: language => dispatch({
      type: CHANGE_LANGUAGE,
      payload: { language }
    })
  })
)(UserComponent);
