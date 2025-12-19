import {Key, ReactNode} from 'react';
import {Location} from '../../types/location.ts';

export type MapPoint = {
  id: Key;
  coordinates: Location;
  popupNode?: ReactNode;
};
