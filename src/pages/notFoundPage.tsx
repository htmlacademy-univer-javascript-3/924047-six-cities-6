import react from 'react';

function NotFoundPage(): react.JSX.Element {
  return (
    <div className="page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a className="header__logo-link" href="main">
                <img className="header__logo" src="../../markup/img/logo.svg" alt="6 cities logo" width="81" height="41"/>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="page__main page__main--property">
        <div style={{
          marginTop: '30vh',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.5rem',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '10rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#666',
          }}>404</div>
          <hr style={{visibility: "hidden"}}></hr>
          Requested resource not found. Go to <b><a href="/">main page</a></b>
        </div>
      </main>
    </div>
  );
}

export default NotFoundPage;
