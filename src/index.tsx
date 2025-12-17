import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/app.tsx';
import { offerMockData, favouritesOfferData } from './mocks/offers.ts';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App offers={offerMockData} favouriteOffers={favouritesOfferData}/>
  </React.StrictMode>
);
