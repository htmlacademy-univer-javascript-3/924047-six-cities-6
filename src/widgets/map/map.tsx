import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {Coordinates} from '../../types/coordinates.ts';
import {MapPoint} from './types.ts';
import react from 'react';
import {activeMarker, defaultMarker} from './markers.ts';

const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
const URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

type MapProps = {
  mapCenter: Coordinates;
  markers?: MapPoint[];
  mapContainerClassName: string;
  activeMarkers?: MapPoint['id'][];
};

function MapWidget(mapProps: MapProps): react.JSX.Element {
  const {mapCenter, markers, mapContainerClassName, activeMarkers = []} = mapProps;
  return (
    <MapContainer
      center={[mapCenter.latitude, mapCenter.longitude]}
      zoom={12}
      scrollWheelZoom
      className={mapContainerClassName}
    >
      <TileLayer attribution={ATTRIBUTION} url={URL}/>
      {markers && markers.map(({id: markerId, coordinates, popupNode}) => {
        const isActive = activeMarkers.includes(markerId);
        return (
          <Marker
            key={markerId}
            position={[coordinates.latitude, coordinates.longitude]}
            icon={isActive ? activeMarker : defaultMarker}
            zIndexOffset={isActive ? 100000 : 0}
          >
            {popupNode && <Popup>{popupNode}</Popup>}
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default MapWidget;
