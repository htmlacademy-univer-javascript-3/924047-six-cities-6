import react, {useEffect} from 'react';
import {Helmet} from 'react-helmet-async';
import {useAppDispatch, useAppSelector} from '../store/typedHooks.ts';
import {setCity} from '../store/action.ts';
import {City} from '../types/city.ts';
import {CityList} from '../components/cities/citiesList.tsx';
import {loadOffers} from '../store/reducer.ts';
import {Spinner} from '../components/spinner.tsx';
import {OffersContainer} from '../components/offers-container.tsx';

function MainPage(): react.JSX.Element {
  const dispatch = useAppDispatch();
  const cities = useAppSelector((state) => state.offers.cities);
  const isLoading = useAppSelector((state) => state.offers.isOffersLoading);
  const currentCity = useAppSelector((state) => state.offers.currentCity);

  const setActiveCity = (city: City) => {
    dispatch(setCity(city));
  };

  useEffect(() => {
    dispatch(loadOffers());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page">
      <Helmet>
        <title> 6 cities - main </title>
      </Helmet>
      <div className="page page--gray page--main">
        <header className="header">
          <div className="container">
            <div className="header__wrapper">
              <div className="header__left">
                <a className="header__logo-link header__logo-link--active">
                  <img className="header__logo" src="../../markup/img/logo.svg" alt="6 cities logo" width="81" height="41"/>
                </a>
              </div>
              <nav className="header__nav">
                <ul className="header__nav-list">
                  <li className="header__nav-item user">
                    <a className="header__nav-link header__nav-link--profile" href="#">
                      <div className="header__avatar-wrapper user__avatar-wrapper">
                      </div>
                      <span className="header__user-name user__name">Oliver.conner@gmail.com</span>
                      <span className="header__favorite-count">3</span>
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

        <main className="page__main page__main--index">
          <h1 className="visually-hidden">Cities</h1>
          <div className="tabs">
            <section className="locations container">
              <CityList cities={cities} activeCity={currentCity} onCityClick={setActiveCity}/>
            </section>
          </div>
          <div className="cities">
            {isLoading ? <Spinner/> : <OffersContainer />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainPage;
