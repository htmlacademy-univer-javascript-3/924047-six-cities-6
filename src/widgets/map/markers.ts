import L, {IconOptions} from 'leaflet';

const markerOptions: Partial<IconOptions> = {
  iconSize: [26, 40],
  iconAnchor: [14, 40],
  popupAnchor: [0, -35],
};

export const defaultMarker = new L.Icon({...markerOptions, iconUrl: 'img/pin.svg'});
export const activeMarker = new L.Icon({...markerOptions, iconUrl: 'img/pin-active.svg'});
