import {FC} from 'react';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {Coordinates} from '../../types/coordinates.ts';
import {MapPoint} from './types.ts';

const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
const URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

type MapProps = {
  mapCenter: Coordinates;
  markers?: MapPoint[];
};

export const MapWidget: FC<MapProps> = ({mapCenter, markers = []}) => {
  return (
    <MapContainer
      center={[mapCenter.latitude, mapCenter.longitude]}
      zoom={12}
      scrollWheelZoom={true}
      className="cities__map map"
    >
      <TileLayer attribution={ATTRIBUTION} url={URL}/>
      {markers.map((marker) => (
        <Marker key={marker.id} position={[marker.coordinates.latitude, marker.coordinates.longitude]}>
          {marker.popupNode && <Popup>{marker.popupNode}</Popup>}
        </Marker>
      ))}
    </MapContainer>
  );
};
