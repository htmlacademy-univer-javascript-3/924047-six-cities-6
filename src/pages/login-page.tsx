import react, {FormEvent, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import Header from '../components/common/header.tsx';
import {useAppDispatch, useAppSelector} from '../store/typed-hooks.ts';
import {useNavigate} from 'react-router-dom';
import {AppRoute, AuthorizationStatus} from '../const/routes.ts';
import {login} from '../store/user/api.ts';
import React from 'react';

function LoginPage(): react.JSX.Element {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector((state) => state.user.authorizationStatus);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (authorizationStatus === AuthorizationStatus.Auth) {
      navigate(AppRoute.Root);
    }
  }, [authorizationStatus, navigate]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
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
                <a className="locations__item-link" href="#">
                  <span>Amsterdam</span>
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
