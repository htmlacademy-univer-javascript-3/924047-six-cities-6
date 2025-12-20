import react from 'react';
import {Navigate} from 'react-router-dom';
import {AppRoute, AuthorizationStatus} from '../const/routes';
import {useAppSelector} from '../store/typedHooks.ts';
import {Spinner} from './spinner.tsx';

type PrivateRouteProps = {
  children: react.JSX.Element;
}

function AuthorizedRoute(props: PrivateRouteProps): react.JSX.Element {
  const authorizationStatus = useAppSelector((state) => state.user.authorizationStatus);
  const {children} = props;

  if (authorizationStatus === AuthorizationStatus.Unknown) {
    return <Spinner />;
  }

  return (
    authorizationStatus === AuthorizationStatus.Auth
      ? children
      : <Navigate to={AppRoute.Login} />
  );
}

export default AuthorizedRoute;
