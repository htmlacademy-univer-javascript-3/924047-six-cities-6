import react, {useEffect} from 'react';
import MainPage from '../../pages/mainPage.tsx';
import NotFoundPage from '../../pages/notFoundPage.tsx';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {AppRoute} from '../../const/routes.ts';
import LoginPage from '../../pages/loginPage.tsx';
import FavoritesPage from '../../pages/favoritesPage.tsx';
import OfferPage from '../../pages/offerPage.tsx';
import AuthorizedRoute from '../authorizedRoute.tsx';
import { HelmetProvider } from 'react-helmet-async';
import {checkAuth} from '../../store/api.ts';
import {useAppDispatch} from '../../store/typedHooks.ts';

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
