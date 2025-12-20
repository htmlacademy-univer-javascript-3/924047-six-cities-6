import { Link } from 'react-router-dom';
import React from 'react';
import {AppRoute, AuthorizationStatus} from '../const/routes.ts';
import {useAppDispatch, useAppSelector} from '../store/typed-hooks.ts';
import {logout} from '../store/api.ts';

type Props = {
  favoritesCount?: number;
};

function Header({ favoritesCount = 0 }: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const {authorizationStatus, user} = useAppSelector(
    (state) => ({
      authorizationStatus: state.user.authorizationStatus,
      user: state.user.userAuth
    })
  );
  const isAuthorized = authorizationStatus === AuthorizationStatus.Auth;
  const userEmail = user?.email || 'user@example.com';

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Link className="header__logo-link" to={AppRoute.Root}>
              <img
                className="header__logo"
                src="img/logo.svg"
                alt="6 cities logo"
                width="81"
                height="41"
              />
            </Link>
          </div>
          {isAuthorized ? (
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <Link
                    className="header__nav-link header__nav-link--profile"
                    to={AppRoute.Favorites}
                  >
                    <div className="header__avatar-wrapper user__avatar-wrapper" />
                    <span className="header__user-name user__name">
                      {userEmail}
                    </span>
                    <span className="header__favorite-count">
                      {favoritesCount}
                    </span>
                  </Link>
                </li>
                <li className="header__nav-item">
                  <a
                    className="header__nav-link"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                  >
                    <span className="header__signout">Sign out</span>
                  </a>
                </li>
              </ul>
            </nav>
          ) : (
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item">
                  <Link className="header__nav-link" to="/login">
                    <span className="header__login">Sign in</span>
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
