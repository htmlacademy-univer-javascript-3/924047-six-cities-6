import react from 'react';
import MainPage from '../../pages/mainPage.tsx';
import {Place} from '../../types/place.ts';

type AppProps = {
  places: Place[];
};

function App({places}: AppProps): react.JSX.Element {
  return (
    <MainPage places={places}/>
  );
}

export default App;
