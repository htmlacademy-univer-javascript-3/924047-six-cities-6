import react, {useEffect} from 'react';
import {Helmet} from 'react-helmet-async';
import FavoriteOffersList from '../components/favorite-offers/favorite-offers-list.tsx';
import {AppRoute} from '../const/routes.ts';
import {Link} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../store/typed-hooks.ts';
import {loadOffers} from '../store/offers/api.ts';
import Header from '../components/common/header.tsx';

function FavoritesPage(): react.JSX.Element {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadOffers());
  }, [dispatch]);

  const favoriteOffers = useAppSelector((state) => state.offers.favorites);

  return (
    <div className="page">
      <Helmet>
        <title> 6 cities - favorites </title>
      </Helmet>
      <Header />

      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          {favoriteOffers.length > 0 ?
            <section className="favorites">
              <h1 className="favorites__title">Saved listing</h1>
              <ul className="favorites__list">
                <FavoriteOffersList offers={favoriteOffers}/>
              </ul>
            </section>
            :
            <section className="favorites favorites--empty">
              <h1 className="visually-hidden">Favorites (empty)</h1>
              <div className="favorites__status-wrapper">
                <b className="favorites__status">Nothing yet saved.</b>
                <p className="favorites__status-description">Save properties to narrow down search or plan your future
                trips.
                </p>
              </div>
            </section>}
        </div>
      </main>
      <footer className="footer container">
        <Link className="footer__logo-link" to={AppRoute.Root}>
          <img className="footer__logo" src="../../markup/img/logo.svg" alt="6 cities logo" width="64" height="33"/>
        </Link>
      </footer>
    </div>
  );
}

export default FavoritesPage;
