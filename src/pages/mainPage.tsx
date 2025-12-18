import react, {useEffect, useState} from 'react';
import {Offer} from '../types/offer.ts';
import {Helmet} from 'react-helmet-async';
import OffersList from '../components/offers/offersList.tsx';
import MapWidget from '../widgets/map/map.tsx';
import {MapPoint} from '../widgets/map/types.ts';
import {defaultCityCoordinates} from '../mocks/coordinates.ts';
import {useAppDispatch, useAppSelector} from '../store/typedHooks.ts';
import {setActiveOffer, setCity, setOffers} from '../store/action.ts';
import {citiesDataMock} from '../mocks/cities.ts';
import {City} from '../types/city.ts';
import {CityList} from '../components/cities/citiesList.tsx';
import {Cities} from '../const/cities.ts';
import { Select } from '../components/select.tsx';
import {SelectOption} from '../types/select.ts';
import {sortOptions} from '../const/sortOptions.ts';
import {getSortedOffers} from '../utils/offersSort.ts';

type MainPageProps = {
  offers: Offer[];
}

function MainPage({offers}: MainPageProps): react.JSX.Element {
  const dispatch = useAppDispatch();
  const activeCity = useAppSelector((state) => state.offers.city);
  const activeOffers = useAppSelector((state) => state.offers.offers);
  const activeOfferId = useAppSelector((state) => state.offers.activeOfferId);

  const [sort, setSort] = useState<SelectOption['key']>(sortOptions[0].key);

  function handleSortChange(sortOption: SelectOption['key']) {
    setSort(sortOption);

    const sortedOffers = getSortedOffers(activeOffers, sortOption);
    dispatch(setOffers(sortedOffers));
  }


  const setActiveCity = (city: City) => {
    dispatch(setCity(city));

    const cityName = city.name;
    const newOffers = offers.filter((offer) => offer.city.name === cityName);
    dispatch(setOffers(newOffers));
  };

  const handleOfferHover = (offerId: Offer['id']) => {
    dispatch(setActiveOffer(offerId));
  };

  // temp to set default city
  useEffect(() => {
    const paris = citiesDataMock.find((city) => city.name === Cities.Paris);
    if (paris) {
      setActiveCity(paris);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markers: MapPoint[] = activeOffers.map((offer) => ({
    id: offer.id,
    coordinates: offer.coordinates,
    popupNode: offer.placeName
  }));

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
              <CityList cities={citiesDataMock} activeCity={activeCity} onCityClick={setActiveCity}/>
            </section>
          </div>
          <div className="cities">
            <div className="cities__places-container container">
              <section className="cities__places places">
                <h2 className="visually-hidden">Places</h2>
                <b className="places__found">{activeOffers.length} places to stay in {activeCity.name}</b>
                <Select
                  options={sortOptions}
                  activeOptionKey={sort}
                  onSelect={(sortOption) => handleSortChange(sortOption)}
                >
                  Sort by
                </Select>
                <OffersList offers={activeOffers} onCardHover={handleOfferHover} containerClassName="cities__places-list places__list tabs__content" />
              </section>
              <div className="cities__right-section">
                <MapWidget mapCenter={defaultCityCoordinates} activeMarkers={activeOfferId ? [activeOfferId] : []} markers={markers} mapContainerClassName="cities__map map"/>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainPage;
