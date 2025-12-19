import react, {useEffect} from 'react';
import {Helmet} from 'react-helmet-async';
import FavoriteOffersList from '../components/favoriteOffers/favoriteOffersList.tsx';
import {AppRoute} from '../const/routes.ts';
import {Link} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../store/typedHooks.ts';
import {OffersByCity} from '../types/offer.ts';
import {loadOffers} from '../store/reducer.ts';

function FavoritesPage(): react.JSX.Element {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadOffers());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="footer__logo-link" to={AppRoute.Root}>
                <img className="header__logo" src="../../markup/img/logo.svg" alt="6 cities logo" width="81" height="41"/>
              </Link>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <a className="header__nav-link header__nav-link--profile" href="#">
                    <div className="header__avatar-wrapper user__avatar-wrapper">
                    </div>
                    <span className="header__user-name user__name">Oliver.conner@gmail.com</span>
                    <span className="header__favorite-count">{favoritesCounter}</span>
                  </a>
                </li>
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#">
                    <span className="header__signout">Sign out</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

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
