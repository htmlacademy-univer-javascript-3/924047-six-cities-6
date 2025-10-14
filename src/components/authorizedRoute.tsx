import react from 'react';
import {Navigate} from 'react-router-dom';
import {AppRoute, AuthorizationStatus} from '../const/routes';

type PrivateRouteProps = {
  authorizationStatus: AuthorizationStatus;
  children: react.JSX.Element;
}

function AuthorizedRoute(props: PrivateRouteProps): react.JSX.Element {
  const {authorizationStatus, children} = props;

  return (
    authorizationStatus === AuthorizationStatus.Auth
      ? children
      : <Navigate to={AppRoute.Login} />
  );
}

export default AuthorizedRoute;
