import react from 'react';
import MainPage from '../../pages/mainPage.tsx';
import NotFoundPage from '../../pages/notFoundPage.tsx';
import {Place} from '../../types/place.ts';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {AppRoute, AuthorizationStatus} from '../../const/routes.ts';
import LoginPage from '../../pages/loginPage.tsx';
import FavouritesPage from '../../pages/favouritesPage.tsx';
import OfferPage from '../../pages/offerPage.tsx';
import AuthorizedRoute from '../authorizedRoute.tsx';
import { HelmetProvider } from 'react-helmet-async';
type AppProps = {
  places: Place[];
};

function App({places}: AppProps): react.JSX.Element {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path={AppRoute.Root}
            element={<MainPage places={places} />}
          />
          <Route
            path={AppRoute.Login}
            element={<LoginPage />}
          />
          <Route
            path={AppRoute.Favourites}
            element={<FavouritesPage />}
          />
          <Route
            path={AppRoute.Offer}
            element={
              <AuthorizedRoute
                authorizationStatus={AuthorizationStatus.NoAuth}
              >
                <OfferPage/>
              </AuthorizedRoute>
            }
          />
          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
