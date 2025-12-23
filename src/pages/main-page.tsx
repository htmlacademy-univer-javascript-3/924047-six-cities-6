import react, {useEffect, useCallback} from 'react';
import {Helmet} from 'react-helmet-async';
import {useAppDispatch, useAppSelector} from '../store/typed-hooks.ts';
import {setCity} from '../store/offers/offers-slice.ts';
import {City} from '../types/city.ts';
import {CityList} from '../components/cities/cities-list.tsx';
import {Spinner} from '../components/common/spinner.tsx';
import {OffersContainer} from '../components/offers/offers-container.tsx';
import {loadOffers} from '../store/offers/api.ts';
import Header from '../components/common/header.tsx';

function MainPage(): react.JSX.Element {
  const dispatch = useAppDispatch();
  const cities = useAppSelector((state) => state.offers.cities);
  const isLoading = useAppSelector((state) => state.offers.isOffersLoading);
  const currentCity = useAppSelector((state) => state.offers.currentCity);

  const setActiveCity = useCallback((city: City) => {
    dispatch(setCity(city));
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      dispatch(loadOffers());
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return (
    <div className="page">
      <Helmet>
        <title> 6 cities - main </title>
      </Helmet>
      <div className="page page--gray page--main">
        <Header />

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
