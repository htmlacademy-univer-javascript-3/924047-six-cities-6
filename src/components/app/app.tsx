import react, {useEffect} from 'react';
import MainPage from '../../pages/main-page.tsx';
import NotFoundPage from '../../pages/not-found-page.tsx';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {AppRoute} from '../../const/routes.ts';
import LoginPage from '../../pages/login-page.tsx';
import FavoritesPage from '../../pages/favorites-page.tsx';
import OfferPage from '../../pages/offer-page.tsx';
import AuthorizedRoute from '../common/authorized-route.tsx';
import { HelmetProvider } from 'react-helmet-async';
import {checkAuth} from '../../store/user/api.ts';
import {useAppDispatch} from '../../store/typed-hooks.ts';

function App(): react.JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path={AppRoute.Root}
            element={<MainPage/>}
          />
          <Route
            path={AppRoute.Login}
            element={<LoginPage />}
          />
          <Route
            path={AppRoute.Favorites}
            element={
              <AuthorizedRoute>
                <FavoritesPage />
              </AuthorizedRoute>
            }
          />
          <Route
            path={AppRoute.Offer}
            element={<OfferPage/>}
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
