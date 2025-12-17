import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/app.tsx';
import { offerMockData, favouritesOfferData } from './mocks/offers.ts';
import {Provider} from 'react-redux';
import {store} from './store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App offers={offerMockData} favouriteOffers={favouritesOfferData}/>
    </Provider>
  </React.StrictMode>
);
