import {Key, ReactNode} from 'react';
import {Coordinates} from '../../types/coordinates.ts';

export type MapPoint = {
  id: Key;
  coordinates: Coordinates;
  popupNode?: ReactNode;
};
