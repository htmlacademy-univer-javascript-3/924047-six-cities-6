import react from 'react';
import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet-async';
import Header from '../components/header.tsx';

function NotFoundPage(): react.JSX.Element {
  return (
    <div className="page">
      <Helmet>
        <title> 6 cities - page not found </title>
      </Helmet>

      <Header />

      <main className="page__main page__main--property">
        <div style={{
          marginTop: '30vh',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.5rem',
          textAlign: 'center',
        }}
        >
          <div style={{
            fontSize: '10rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#666',
          }}
          >404
          </div>
          <hr style={{visibility: 'hidden'}}></hr>
          Requested resource not found. Go to <b><Link to="/">main page</Link></b>
        </div>
      </main>
    </div>
  );
}

export default NotFoundPage;
