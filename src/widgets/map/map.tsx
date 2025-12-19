import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {Location} from '../../types/location.ts';
import {MapPoint} from './types.ts';
import react, {FC} from 'react';
import {activeMarker, defaultMarker} from './markers.ts';

const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
const URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

type UpdateMapCentreProps = {
  mapCenter: Location;
}

export const UpdateMapCenter: FC<UpdateMapCentreProps> = ({mapCenter}) => {
  const map = useMap();
  map.panTo([mapCenter.latitude, mapCenter.longitude],);
  map.setZoom(mapCenter.zoom);
  return null;
};

type MapProps = {
  mapCenter: Location;
  markers?: MapPoint[];
  mapContainerClassName: string;
  activeMarkers?: MapPoint['id'][];
};

function MapWidget(mapProps: MapProps): react.JSX.Element {
  const {mapCenter, markers, mapContainerClassName, activeMarkers = []} = mapProps;
  return (
    <MapContainer
      center={[mapCenter.latitude, mapCenter.longitude]}
      zoom={mapCenter.zoom}
      scrollWheelZoom
      className={mapContainerClassName}
    >
      <UpdateMapCenter mapCenter={mapCenter}/>
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
