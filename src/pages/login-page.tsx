import react, {FormEvent, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import Header from '../components/common/header.tsx';
import {useAppDispatch, useAppSelector} from '../store/typed-hooks.ts';
import {useNavigate} from 'react-router-dom';
import {AppRoute, AuthorizationStatus} from '../const/routes.ts';
import {login} from '../store/user/api.ts';
import React from 'react';
import {setCity} from '../store/offers/offers-slice.ts';
import {City} from '../types/city.ts';

export const AvailableCities = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
] as const;

function LoginPage(): react.JSX.Element {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector((state) => state.user.authorizationStatus);
  const cities = useAppSelector((state) => state.offers.cities);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (isMounted && authorizationStatus === AuthorizationStatus.Auth) {
      navigate(AppRoute.Root);
    }

    return () => {
      isMounted = false;
    };
  }, [authorizationStatus, navigate]);

  const validatePassword = (password: string): boolean => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    return hasLetter && hasDigit;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must contain at least one letter and one digit');
      return;
    }

    setIsLoading(true);

    dispatch(login(formData))
      .unwrap()
      .then(() => {
        navigate(AppRoute.Root);
      })
      .catch((loginError) => {
        setError(`Failed to sign in: ${loginError}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRandomCityClick = () => {
    const availableCitiesList = Object.values(cities).filter((city) =>
      AvailableCities.includes(city.name as typeof AvailableCities[number])
    );

    if (availableCitiesList.length > 0) {
      const randomCity = availableCitiesList[Math.floor(Math.random() * availableCitiesList.length)];
      dispatch(setCity(randomCity));
      navigate(AppRoute.Root);
    } else {
      // Fallback to random city from predefined list if cities not loaded yet
      const randomCityName = AvailableCities[Math.floor(Math.random() * AvailableCities.length)];
      const fallbackCity: City = {
        name: randomCityName,
        location: {latitude: 48.8566, longitude: 2.3522, zoom: 13}, // Default Paris location, will be updated when offers load
      };
      dispatch(setCity(fallbackCity));
      navigate(AppRoute.Root);
    }
  };

  return (
    <div className="page">
      <Helmet>
        <title> 6 cities - login </title>
      </Helmet>
      <div className="page page--gray page--login">
        <Header />

        <main className="page__main page__main--login">
          <div className="page__login-container container">
            <section className="login">
              <h1 className="login__title">Sign in</h1>
              <form className="login__form form" onSubmit={handleSubmit}>
                <div className="login__input-wrapper form__input-wrapper">
                  <label className="visually-hidden">E-mail</label>
                  <input className="login__input form__input"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="login__input-wrapper form__input-wrapper">
                  <label className="visually-hidden">Password</label>
                  <input className="login__input form__input" type="password" name="password" placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <div style={{ color: 'red', marginBottom: '10px' }}>
                    {error}
                  </div>
                )}
                <button className="login__submit form__submit button" type="submit" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
            </section>
            <section className="locations locations--login locations--current">
              <div className="locations__item">
                <a
                  className="locations__item-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRandomCityClick();
                  }}
                >
                  <span>Random city</span>
                </a>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default LoginPage;
