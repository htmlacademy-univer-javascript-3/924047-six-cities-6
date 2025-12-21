import react, {useEffect} from 'react';
import {Helmet} from 'react-helmet-async';
import FavoriteOffersList from '../components/favorite-offers/favorite-offers-list.tsx';
import {AppRoute} from '../const/routes.ts';
import {Link} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../store/typed-hooks.ts';
import {OffersByCity} from '../types/offer.ts';
import {loadOffers} from '../store/offers/api.ts';
import Header from '../components/common/header.tsx';

function FavoritesPage(): react.JSX.Element {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadOffers());
  }, [dispatch]);

  const offers = useAppSelector((state) => state.offers.offers);

  const favoriteOffers = Object.entries(offers).reduce<OffersByCity>(
    (acc, [city, cityOffers]) => {
      const favorites = cityOffers.filter((o) => o.isFavorite);
      if (favorites.length > 0) {
        acc[city] = favorites;
      }
      return acc;
    },
    {}
  );
  const favoritesCounter = Object.values(favoriteOffers).flat().length;

  return (
    <div className="page">
      <Helmet>
        <title> 6 cities - favorites </title>
      </Helmet>
      <Header favoritesCount={favoritesCounter} />

      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            <ul className="favorites__list">
              <FavoriteOffersList offers={favoriteOffers}/>
            </ul>
          </section>
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
