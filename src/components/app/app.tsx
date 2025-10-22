import react from 'react';
import MainPage from '../../pages/mainPage.tsx';
import NotFoundPage from '../../pages/notFoundPage.tsx';
import {Offer} from '../../types/offer.ts';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {AppRoute, AuthorizationStatus} from '../../const/routes.ts';
import LoginPage from '../../pages/loginPage.tsx';
import FavouritesPage from '../../pages/favouritesPage.tsx';
import OfferPage from '../../pages/offerPage.tsx';
import AuthorizedRoute from '../authorizedRoute.tsx';
import { HelmetProvider } from 'react-helmet-async';
type AppProps = {
  offers: Offer[];
  favouriteOffers: Offer[];
};

function App({offers, favouriteOffers}: AppProps): react.JSX.Element {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path={AppRoute.Root}
            element={<MainPage offers={offers} />}
          />
          <Route
            path={AppRoute.Login}
            element={<LoginPage />}
          />
          <Route
            path={AppRoute.Favourites}
            element={<FavouritesPage favouriteOffers={favouriteOffers} />}
          />
          <Route
            path={AppRoute.Offer}
            element={
              <AuthorizedRoute
                authorizationStatus={AuthorizationStatus.Auth} // TODO back to NoAuth
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
